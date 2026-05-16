import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('the-reform-times-news');

    // Count articles by status
    const totalArticles = await db.collection('articles').countDocuments();
    const publishedCount = await db.collection('articles').countDocuments({ status: 'Published' });
    const draftCount = await db.collection('articles').countDocuments({ status: 'Draft' });
    const pendingCount = await db.collection('articles').countDocuments({ status: 'Pending Review' });
    
    // Count specific categories for the "Editorial Workflow" section
    const investigationsCount = await db.collection('articles').countDocuments({ category: 'Investigations' });

    // Get recent activity (last 5 articles)
    const recentArticles = await db.collection('articles')
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    const activity = recentArticles.map(article => ({
      id: article._id,
      user: article.author || 'System',
      action: article.status === 'Published' ? 'published' : 'saved',
      target: article.title,
      time: 'Just now' // Simplified for demo
    }));

    return NextResponse.json({
      stats: {
        totalArticles,
        publishedCount,
        draftCount,
        pendingCount,
        investigationsCount,
        // visitors and subscriptions are still static until we have those collections
        visitors: '45.2K', 
        subscriptions: '8,420',
        submissions: '24'
      },
      activity
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}
