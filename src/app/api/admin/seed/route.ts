import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('the-reform-times-news');

    // 1. Clear existing
    await db.collection('articles').deleteMany({});
    await db.collection('categories').deleteMany({});
    await db.collection('journalists').deleteMany({});

    // 2. Seeding Data
    const journalists = [
      { name: 'Salman Ahmed', role: 'Chief Editor', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', articles: 156, status: 'Active' },
      { name: 'Sarah Jenkins', role: 'Investigative Head', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', articles: 89, status: 'Active' }
    ];
    await db.collection('journalists').insertMany(journalists);

    const categories = [
      { name: 'National', slug: 'national', color: '#8B0000' },
      { name: 'Investigations', slug: 'investigations', color: '#C5A059' },
      { name: 'Human Rights', slug: 'human-rights', color: '#e53e3e' },
      { name: 'Fact Check', slug: 'fact-check', color: '#dd6b20' }
    ];
    await db.collection('categories').insertMany(categories);

    const articles = [
      {
        title: "Exclusive: Massive Supply Chain Crisis Threatens Essential Medicines",
        slug: "exclusive-massive-supply-chain-crisis",
        excerpt: "A six-month investigation reveals systematic failures in the global distribution of life-saving treatments.",
        mainImage: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=1200",
        category: "Investigations",
        author: journalists[1],
        isFeatured: true,
        isBreaking: true,
        status: "Published",
        createdAt: new Date(),
        readTime: "12 min read"
      },
      {
        title: "National Reform Bill Passes Senate After Intense Session",
        slug: "national-reform-bill-passes",
        excerpt: "The historic bill aims to restructure governance and increase transparency.",
        mainImage: "https://images.unsplash.com/photo-1520110120385-c285d6b23ce2?w=1200",
        category: "National",
        author: journalists[0],
        isFeatured: false,
        isBreaking: true,
        status: "Published",
        createdAt: new Date(),
        readTime: "5 min read"
      }
    ];
    await db.collection('articles').insertMany(articles);

    return NextResponse.json({ success: true, message: "Database seeded successfully!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
