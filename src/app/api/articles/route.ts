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
    const type = searchParams.get('type');

    let query: any = {};
    if (category && category !== 'All') query.category = category;
    if (type && type !== 'All') query.type = type;
    if (status && status !== 'All') {
      query.status = status;
    }
    // Note: For public site view (no status query provided or non-admin calls), show only Published articles
    if (!status) {
      query.$or = [
        { status: 'Published' },
        { status: 'published' }
      ];
    }

    if (q) {
      query.$or = [
        { 'title.bn': { $regex: q, $options: 'i' } },
        { 'title.en': { $regex: q, $options: 'i' } },
        { 'excerpt.bn': { $regex: q, $options: 'i' } },
        { 'excerpt.en': { $regex: q, $options: 'i' } },
        { 'content.bn': { $regex: q, $options: 'i' } },
        { 'content.en': { $regex: q, $options: 'i' } }
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      featured: body.featured || false,
      breaking: body.breaking || false,
      trending: body.trending || false,
      // Support frontend provided bilingual slug object
      slug: body.slug || {
        bn: body.title?.bn ? body.title.bn.toLowerCase().replace(/[^\w\u0980-\u09FF ]+/g, '').replace(/ +/g, '-') : '',
        en: body.title?.en ? body.title.en.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-') : ''
      }
    };

    const result = await db.collection('articles').insertOne(newArticle);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error: any) {
    const errMsg = error?.message || String(error);
    console.error('Error creating article:', error);
    const isMongoErr = errMsg.includes('Mongo') || errMsg.includes('SSL') || errMsg.includes('connect') || errMsg.includes('topology');
    return NextResponse.json({ 
      error: isMongoErr ? 'Database Connection Refused: Please whitelist your IP in MongoDB Atlas.' : 'Failed to create article', 
      details: errMsg 
    }, { status: 500 });
  }
}
