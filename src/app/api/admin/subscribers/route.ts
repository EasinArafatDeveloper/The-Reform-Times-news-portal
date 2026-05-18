import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    
    const query = search 
      ? { email: { $regex: search, $options: 'i' } } 
      : {};
      
    const subscribers = await db.collection('subscribers')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
      
    return NextResponse.json(subscribers);
  } catch (error: any) {
    console.error('Subscribers GET Error:', error);
    return NextResponse.json({ error: 'Failed to retrieve subscribers.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email address is required.' }, { status: 400 });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db();
    
    const existing = await db.collection('subscribers').findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: 'This subscriber email is already registered.' }, { status: 400 });
    }
    
    const newSubscriber = {
      email: email.toLowerCase(),
      createdAt: new Date(),
    };
    
    await db.collection('subscribers').insertOne(newSubscriber);
    return NextResponse.json({ success: true, subscriber: newSubscriber });
  } catch (error: any) {
    console.error('Subscriber Manual POST Error:', error);
    return NextResponse.json({ error: 'Failed to insert subscriber.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Subscriber identifier is required.' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db();
    
    let query = {};
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      query = { _id: id }; // Handle string ids if seeded differently
    }
    
    const result = await db.collection('subscribers').deleteOne(query);
    if (result.deletedCount === 0) {
      // Fallback: search by email string
      const emailFallback = searchParams.get('email');
      if (emailFallback) {
        const fallbackResult = await db.collection('subscribers').deleteOne({ email: emailFallback.toLowerCase() });
        if (fallbackResult.deletedCount > 0) {
          return NextResponse.json({ success: true, message: 'Subscriber successfully removed.' });
        }
      }
      return NextResponse.json({ error: 'Subscriber entry not found.' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Subscriber successfully removed.' });
  } catch (error: any) {
    console.error('Subscriber DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete subscriber.' }, { status: 500 });
  }
}
