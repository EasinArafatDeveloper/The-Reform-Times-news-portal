import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('the-reform-times-news');
    const categories = await db.collection('categories').find({}).toArray();
    
    const categoriesWithCount = await Promise.all(categories.map(async (cat) => {
      const count = await db.collection('articles').countDocuments({ category: cat.name });
      return { ...cat, articleCount: count };
    }));

    return NextResponse.json(categoriesWithCount);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('the-reform-times-news');
    const body = await req.json();

    const newCategory = {
      ...body,
      createdAt: new Date(),
    };

    const result = await db.collection('categories').insertOne(newCategory);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

// NEW: Add support for updating and deleting categories
export async function PUT(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('the-reform-times-news');
    const body = await req.json();
    const { id, ...updateData } = body;

    await db.collection('categories').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const client = await clientPromise;
    const db = client.db('the-reform-times-news');
    await db.collection('categories').deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
