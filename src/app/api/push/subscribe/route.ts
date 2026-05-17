import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { subscription, language, userAgent } = body;

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return NextResponse.json({ error: 'Invalid subscription payload' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Check if subscription already exists
    const existing = await db.collection('push_subscriptions').findOne({
      endpoint: subscription.endpoint
    });

    const now = new Date();

    if (existing) {
      // Update existing subscription status
      await db.collection('push_subscriptions').updateOne(
        { _id: existing._id },
        {
          $set: {
            keys: subscription.keys,
            userAgent: userAgent || '',
            language: language || 'bn',
            active: true,
            updatedAt: now
          }
        }
      );
    } else {
      // Insert new subscription
      await db.collection('push_subscriptions').insertOne({
        endpoint: subscription.endpoint,
        keys: subscription.keys,
        userAgent: userAgent || '',
        language: language || 'bn',
        active: true,
        createdAt: now,
        updatedAt: now
      });
    }

    return NextResponse.json({ success: true, message: 'Subscribed to web push notifications successfully' });
  } catch (err: any) {
    console.error('Push subscribe error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
