import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import webpush from 'web-push';

// Configure Web Push with our VAPID credentials
const vapidEmail = process.env.VAPID_EMAIL || 'mailto:thereformtimes@gmail.com';
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(
    vapidEmail,
    vapidPublicKey,
    vapidPrivateKey
  );
}

export async function POST(req: Request) {
  try {
    // 1. Security Check: Verify secret token if PUSH_SECRET is configured
    const authHeader = req.headers.get('x-push-secret');
    if (process.env.PUSH_SECRET && authHeader !== process.env.PUSH_SECRET) {
      return NextResponse.json({ error: 'Unauthorized push trigger' }, { status: 401 });
    }

    // 2. Parse Body
    const body = await req.json();
    const { title, bodyText, url, language, articleId } = body;

    if (!title || !bodyText) {
      return NextResponse.json({ error: 'Title and body text are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // 3. Query Active Subscribers
    // If language is provided (e.g. 'bn' or 'en'), query only those; otherwise query all active
    const query: any = { active: true };
    if (language) {
      query.language = language;
    }

    const subscribers = await db.collection('push_subscriptions').find(query).toArray();

    if (subscribers.length === 0) {
      // Record a history entry with zero subscribers
      await db.collection('push_history').insertOne({
        title,
        body: bodyText,
        url: url || '/',
        sentDate: new Date(),
        sentCount: 0,
        failedCount: 0,
        language: language || 'all',
        status: 'Delivered',
        articleId: articleId || null
      });

      return NextResponse.json({ success: true, message: 'No active subscribers found', sentCount: 0 });
    }

    let sentCount = 0;
    let failedCount = 0;

    // 4. Send Notifications in Parallel
    const pushPromises = subscribers.map(async (sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          auth: sub.keys.auth,
          p256dh: sub.keys.p256dh
        }
      };

      const payload = JSON.stringify({
        title,
        body: bodyText,
        url: url || '/',
        icon: '/icons/icon-192.png',
        badge: '/icons/badge-72.png'
      });

      try {
        await webpush.sendNotification(pushSubscription, payload);
        sentCount++;
      } catch (err: any) {
        console.error(`Web Push notification send failed for endpoint ${sub.endpoint}:`, err);
        failedCount++;

        // 5. Deactivate subscription if expired or unsupported (410 Gone / 404 Not Found)
        if (err.statusCode === 410 || err.statusCode === 404) {
          await db.collection('push_subscriptions').updateOne(
            { _id: sub._id },
            { $set: { active: false, updatedAt: new Date() } }
          );
        }
      }
    });

    // Wait for all notification attempts to complete
    await Promise.all(pushPromises);

    // 6. Record in Notification History
    await db.collection('push_history').insertOne({
      title,
      body: bodyText,
      url: url || '/',
      sentDate: new Date(),
      sentCount,
      failedCount,
      language: language || 'all',
      status: failedCount > 0 && sentCount === 0 ? 'Failed' : 'Delivered',
      articleId: articleId || null
    });

    return NextResponse.json({
      success: true,
      message: `Notifications sent: ${sentCount} succeeded, ${failedCount} failed`,
      sentCount,
      failedCount
    });

  } catch (err: any) {
    console.error('Push send API error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
