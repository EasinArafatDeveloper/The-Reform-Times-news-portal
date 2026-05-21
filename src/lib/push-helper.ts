import clientPromise from '@/lib/mongodb';
import webpush from 'web-push';

// Initialize web-push VAPID details
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

export async function sendArticlePushNotification(article: any) {
  try {
    const client = await clientPromise;
    const db = client.db('the-reform-times-news');

    // 1. Fetch all active push subscribers
    const subscribers = await db.collection('push_subscriptions').find({ active: true }).toArray();

    if (subscribers.length === 0) {
      console.log('No active push subscribers to notify.');
      return { success: true, sentCount: 0, failedCount: 0 };
    }

    let sentCount = 0;
    let failedCount = 0;

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    // 2. Loop through subscribers in parallel
    const pushPromises = subscribers.map(async (sub) => {
      const isBn = sub.language === 'bn';
      
      // Select bilingual push payload based on subscriber preference
      let title = '';
      let bodyText = '';
      let url = '/';

      if (isBn) {
        title = article.title?.bn || article.title?.en || 'দি রিফর্ম টাইমস';
        bodyText = article.excerpt?.bn || article.excerpt?.en || '';
        url = `${baseUrl}/bn/news/${article.slug?.en || article.slug?.bn || ''}`;
      } else {
        title = article.title?.en || article.title?.bn || 'The Reform Times';
        bodyText = article.excerpt?.en || article.excerpt?.bn || '';
        url = `${baseUrl}/en/news/${article.slug?.en || article.slug?.bn || ''}`;
      }

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
        url,
        icon: '/icons/icon-192.png',
        badge: '/icons/badge-72.png'
      });

      try {
        await webpush.sendNotification(pushSubscription, payload);
        sentCount++;
      } catch (err: any) {
        console.error(`Web Push notification send failed for endpoint ${sub.endpoint}:`, err);
        failedCount++;

        // Deactivate subscription if expired or unsupported
        if (err.statusCode === 410 || err.statusCode === 404) {
          await db.collection('push_subscriptions').updateOne(
            { _id: sub._id },
            { $set: { active: false, updatedAt: new Date() } }
          );
        }
      }
    });

    await Promise.all(pushPromises);

    // 3. Record in push history collection for the admin page
    await db.collection('push_history').insertOne({
      title: article.title?.en || article.title?.bn || 'New Publication',
      body: article.excerpt?.en || article.excerpt?.bn || '',
      url: `/news/${article.slug?.en || article.slug?.bn || ''}`,
      sentDate: new Date(),
      sentCount,
      failedCount,
      language: 'Bilingual (Automatic)',
      status: failedCount > 0 && sentCount === 0 ? 'Failed' : 'Delivered',
      articleId: article._id ? article._id.toString() : article.id || null
    });

    console.log(`Bilingual Web Push Notification successfully sent to ${sentCount} subscribers (${failedCount} failed)`);
    return { success: true, sentCount, failedCount };

  } catch (err) {
    console.error('Error broadcasting push notification:', err);
    return { success: false, error: err };
  }
}
