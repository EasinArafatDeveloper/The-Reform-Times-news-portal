import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db('the-reform-times-news');

    const history = await db.collection('push_history')
      .find({})
      .sort({ sentDate: -1 })
      .toArray();

    return NextResponse.json(history);
  } catch (err: any) {
    console.error('Error fetching push notification history:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
