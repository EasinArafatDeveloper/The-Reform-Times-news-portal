import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET specific article for editing
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db('the-reform-times-news');
    
    let query = {};
    try {
      query = { _id: new ObjectId(id) };
    } catch {
      query = { id: id };
    }

    const article = await db.collection('articles').findOne(query);
    
    if (!article) return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
}

// UPDATE article
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db('the-reform-times-news');
    const body = await req.json();
    
    let query = {};
    try {
      query = { _id: new ObjectId(id) };
    } catch {
      query = { id: id };
    }

    const result = await db.collection('articles').updateOne(
      query,
      { $set: { ...body, updatedAt: new Date() } }
    );
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    const errMsg = error?.message || String(error);
    console.error('Error updating article:', error);
    const isMongoErr = errMsg.includes('Mongo') || errMsg.includes('SSL') || errMsg.includes('connect') || errMsg.includes('topology');
    return NextResponse.json({ 
      error: isMongoErr ? 'Database Connection Refused: Please whitelist your IP in MongoDB Atlas.' : 'Failed to update article', 
      details: errMsg 
    }, { status: 500 });
  }
}

// DELETE article
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db('the-reform-times-news');
    
    let query = {};
    try {
      query = { _id: new ObjectId(id) };
    } catch {
      query = { id: id };
    }

    await db.collection('articles').deleteOne(query);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}
