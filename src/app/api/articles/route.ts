import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('the-reform-times-news');
    
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const lang = searchParams.get('lang');
    const q = searchParams.get('q');

    let query: any = {};
    if (category && category !== 'All') query.category = category;
    if (status && status !== 'All') query.status = status;
    if (lang) query.language = lang;
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { excerpt: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } }
      ];
    }

    const articles = await db.collection('articles')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('the-reform-times-news');
    const body = await req.json();

    const newArticle = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      isFeatured: body.isFeatured || false,
      isBreaking: body.isBreaking || false,
      language: body.language || 'en',
      slug: body.title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-'),
    };

    const result = await db.collection('articles').insertOne(newArticle);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}
