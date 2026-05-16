import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

async function seedData() {
  const client = new MongoClient(MONGODB_URI!, {
    tlsAllowInvalidCertificates: true,
  });

  try {
    await client.connect();
    const db = client.db('the-reform-times-news');

    // 1. CLEAR COLLECTIONS
    await db.collection('articles').deleteMany({});
    await db.collection('categories').deleteMany({});
    await db.collection('journalists').deleteMany({});

    // 2. SEED JOURNALISTS
    const journalists = [
      { name: 'Salman Ahmed', role: 'Chief Editor', email: 'salman@reformtimes.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', articles: 156, status: 'Active' },
      { name: 'Sarah Jenkins', role: 'Investigative Head', email: 'sarah@reformtimes.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', articles: 89, status: 'Active' },
      { name: 'Michael Chen', role: 'Fact Checker', email: 'michael@reformtimes.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', articles: 42, status: 'Active' },
      { name: 'Elena Rodriguez', role: 'Human Rights Lead', email: 'elena@reformtimes.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', articles: 215, status: 'Active' },
    ];
    await db.collection('journalists').insertMany(journalists);

    // 3. SEED CATEGORIES
    const categories = [
      { name: 'National', slug: 'national', color: '#8B0000' },
      { name: 'International', slug: 'international', color: '#0B1B3D' },
      { name: 'Investigations', slug: 'investigations', color: '#C5A059' },
      { name: 'Politics', slug: 'politics', color: '#1a365d' },
      { name: 'Human Rights', slug: 'human-rights', color: '#e53e3e' },
      { name: 'Environment', slug: 'environment', color: '#2f855a' },
      { name: 'Fact Check', slug: 'fact-check', color: '#dd6b20' },
      { name: 'Opinions', slug: 'opinions', color: '#4a5568' },
      { name: 'Economy', slug: 'economy', color: '#2c7a7b' }
    ];
    await db.collection('categories').insertMany(categories);

    // 4. SEED ARTICLES (Across all categories)
    const articles = [
      {
        title: "Exclusive: Massive Supply Chain Crisis Threatens Essential Medicines in Rural Regions",
        slug: "exclusive-massive-supply-chain-crisis",
        excerpt: "A six-month investigation reveals systematic failures in the global distribution of life-saving treatments, leaving vulnerable populations at risk.",
        content: "<p>A deep-dive investigation into how medicine distribution has collapsed...</p>",
        mainImage: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=1200",
        category: "Investigations",
        author: journalists[1],
        isFeatured: true,
        isBreaking: true,
        language: "en",
        status: "Published",
        createdAt: new Date(),
        readTime: "12 min read"
      },
      {
        title: "National Reform Bill Passes Senate After Intense 48-Hour Session",
        slug: "national-reform-bill-passes",
        excerpt: "The historic bill aims to restructure governance and increase transparency across all levels of public administration.",
        content: "<p>The Senate has finally passed the Reform Bill...</p>",
        mainImage: "https://images.unsplash.com/photo-1520110120385-c285d6b23ce2?w=1200",
        category: "National",
        author: journalists[0],
        isFeatured: false,
        isBreaking: true,
        language: "en",
        status: "Published",
        createdAt: new Date(Date.now() - 3600000),
        readTime: "5 min read"
      },
      {
        title: "The Ghost Factories: Where Billions in Public Funds Disappeared",
        slug: "the-ghost-factories-investigation",
        excerpt: "Tracking the money trail of industrial projects that exist only on paper but have consumed significant treasury resources.",
        mainImage: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800",
        category: "Investigations",
        author: journalists[1],
        isFeatured: false,
        isBreaking: false,
        language: "en",
        status: "Published",
        createdAt: new Date(Date.now() - 86400000),
        readTime: "15 min read"
      },
      {
        title: "Voices from the Border: The Human Stories Behind the Policy",
        slug: "voices-from-the-border",
        excerpt: "An in-depth look at the families affected by the new displacement laws and their struggle for basic dignity.",
        mainImage: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800",
        category: "Human Rights",
        author: journalists[3],
        isFeatured: false,
        isBreaking: false,
        language: "en",
        status: "Published",
        createdAt: new Date(Date.now() - 172800000),
        readTime: "8 min read"
      },
      {
        title: "Fact Check: Viral Video Claims About Election Fraud Are Baseless",
        slug: "fact-check-election-claims",
        excerpt: "Our data team debunked the misleading clips circulating on social media regarding vote counting machines.",
        mainImage: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800",
        category: "Fact Check",
        author: journalists[2],
        isFeatured: false,
        isBreaking: false,
        factCheckStatus: "False",
        language: "en",
        status: "Published",
        createdAt: new Date(Date.now() - 43200000),
        readTime: "4 min read"
      },
      {
        title: "Political Deadlock Ends as Opposition Agrees to Dialogue",
        slug: "political-deadlock-ends",
        excerpt: "After weeks of protests, a breakthrough agreement opens the door for constitutional reforms.",
        mainImage: "https://images.unsplash.com/photo-1541872703-74c5e443d1fe?w=800",
        category: "Politics",
        author: journalists[0],
        isFeatured: false,
        isBreaking: false,
        language: "en",
        status: "Published",
        createdAt: new Date(Date.now() - 432000000),
        readTime: "5 min read"
      }
    ];
    await db.collection('articles').insertMany(articles);

    console.log('Database seeded with HIGH-QUALITY REAL DATA across all categories!');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await client.close();
  }
}

seedData();
