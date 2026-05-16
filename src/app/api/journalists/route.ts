import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('the-reform-times-news');
    
    const journalists = await db.collection('journalists')
      .find({})
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json(journalists);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch journalists' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('the-reform-times-news');
    const body = await req.json();

    const newJournalist = {
      ...body,
      articles: 0,
      createdAt: new Date(),
    };

    const result = await db.collection('journalists').insertOne(newJournalist);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add journalist' }, { status: 500 });
  }
}
