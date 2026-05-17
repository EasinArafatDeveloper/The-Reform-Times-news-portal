import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/journalists/[id] — fetch one journalist by mongo _id or string id
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const client = await clientPromise;
    const db = client.db('the-reform-times-news');

    let journalist: any = null;

    // try by ObjectId first
    if (ObjectId.isValid(id)) {
      journalist = await db.collection('journalists').findOne({ _id: new ObjectId(id) });
    }
    // fallback: string id field
    if (!journalist) {
      journalist = await db.collection('journalists').findOne({ id });
    }

    if (!journalist) {
      return NextResponse.json({ error: 'Journalist not found' }, { status: 404 });
    }

    return NextResponse.json(journalist);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch journalist' }, { status: 500 });
  }
}

// PUT /api/journalists/[id] — update a journalist
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const client = await clientPromise;
    const db = client.db('the-reform-times-news');
    const body = await req.json();

    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id };

    await db.collection('journalists').updateOne(
      filter,
      { $set: { ...body, updatedAt: new Date().toISOString() } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update journalist' }, { status: 500 });
  }
}

// DELETE /api/journalists/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const client = await clientPromise;
    const db = client.db('the-reform-times-news');

    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id };
    await db.collection('journalists').deleteOne(filter);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete journalist' }, { status: 500 });
  }
}
