import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('the-reform-times-news');

    // 1. Journalists Seed (if not exist)
    const journalistCount = await db.collection('journalists').countDocuments();
    let authors = [];
    if (journalistCount === 0) {
      authors = [
        { 
          name: 'Kazi Salman', 
          role: { en: 'Chief Editor', bn: 'প্রধান সম্পাদক' }, 
          bio: { en: 'Dedicated to truth and systemic transparency.', bn: 'সত্য এবং কাঠামোগত স্বচ্ছতার প্রতি নিবেদিত।' },
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 
          status: 'Active' 
        },
        { 
          name: 'Tasmia Rahman', 
          role: { en: 'Senior Investigative Journalist', bn: 'সিনিয়র অনুসন্ধানী সাংবাদিক' }, 
          bio: { en: 'Specializes in exposing corruption, public policy malpractices, and corporate accountability.', bn: 'দুর্নীতি উন্মোচন, সরকারি নীতিমালার অপপ্রয়োগ এবং করপোরেট জবাবদিহিতা সংক্রান্ত সংবাদে দক্ষ।' },
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 
          status: 'Active' 
        },
        { 
          name: 'Abrar Chowdhury', 
          role: { en: 'Lead Fact-Checker', bn: 'প্রধান তথ্য-যাচাইকারী' }, 
          bio: { en: 'Combats digital misinformation and propaganda through rigorous verification.', bn: 'কঠোর তথ্য-যাচাইয়ের মাধ্যমে ডিজিটাল অপপ্রচার এবং প্রোপাগান্ডা প্রতিরোধ করেন।' },
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 
          status: 'Active' 
        },
        { 
          name: 'Nabila Hasan', 
          role: { en: 'Human Rights Correspondent', bn: 'মানবাধিকার প্রতিনিধি' }, 
          bio: { en: 'Covers humanitarian crises, minority rights, and grassroots social movements.', bn: 'মানবিক সংকট, সংখ্যালঘু অধিকার এবং তৃণমূল পর্যায়ের আন্দোলন নিয়ে কাজ করেন।' },
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 
          status: 'Active' 
        }
      ];
      await db.collection('journalists').insertMany(authors);
    } else {
      authors = await db.collection('journalists').find().toArray();
    }

    // 2. Real News Articles to Populate (Bilingual)
    const newsToInsert = [
      {
        title: {
          en: "The Silent Crisis: Medicine Shortages Hit Remote Villages",
          bn: "নীরব সংকট: দুর্গম গ্রামগুলোতে ওষুধের তীব্র অভাব"
        },
        slug: {
          en: "silent-crisis-medicine-shortages",
          bn: "silent-crisis-medicine-shortages-bn"
        },
        excerpt: {
          en: "An investigative look into why basic healthcare is failing in the country's most vulnerable regions.",
          bn: "দেশের সবচেয়ে ঝুঁকিপূর্ণ অঞ্চলগুলোতে প্রাথমিক স্বাস্থ্যসেবা কেন ব্যর্থ হচ্ছে তার একটি অনুসন্ধানী বিশ্লেষণ।"
        },
        content: {
          en: "<h2>A Systemic Failure</h2><p>Months of supply chain disruptions have left rural clinics empty...</p>",
          bn: "<h2>একটি কাঠামোগত ব্যর্থতা</h2><p>কয়েক মাস ধরে সরবরাহ ব্যবস্থার বিপর্যয় গ্রামীণ ক্লিনিকগুলোকে খালি করে দিয়েছে...</p>"
        },
        category: "Investigations",
        author: authors[0],
        status: "Published",
        isFeatured: true,
        isBreaking: false,
        mainImage: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800",
        createdAt: new Date(),
        readTime: { en: "8 min read", bn: "৮ মিনিট পড়ুন" }
      },
      {
        title: {
          en: "Major Economic Reform Announced by Treasury Department",
          bn: "ট্রেজারি বিভাগ কর্তৃক বড় ধরনের অর্থনৈতিক সংস্কার ঘোষণা"
        },
        slug: {
          en: "major-economic-reform-announced",
          bn: "major-economic-reform-announced-bn"
        },
        excerpt: {
          en: "New policies aim to curb inflation and support small businesses across the nation.",
          bn: "নতুন নীতিগুলোর লক্ষ্য মূল্যস্ফীতি কমানো এবং দেশজুড়ে ক্ষুদ্র ব্যবসায়ীদের সহায়তা করা।"
        },
        content: {
          en: "<p>The Treasury has unveiled a comprehensive package of reforms...</p>",
          bn: "<p>ট্রেজারি সংস্কারের একটি ব্যাপক প্যাকেজ উন্মোচন করেছে...</p>"
        },
        category: "National",
        author: authors[1],
        status: "Published",
        isFeatured: false,
        isBreaking: true,
        mainImage: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800",
        createdAt: new Date(),
        readTime: { en: "5 min read", bn: "৫ মিনিট পড়ুন" }
      },
      {
        title: {
          en: "Human Rights Watch Raises Concerns Over New Privacy Laws",
          bn: "নতুন গোপনীয়তা আইন নিয়ে উদ্বেগ প্রকাশ করেছে হিউম্যান রাইটস ওয়াচ"
        },
        slug: {
          en: "human-rights-concerns-privacy-laws",
          bn: "human-rights-concerns-privacy-laws-bn"
        },
        excerpt: {
          en: "Advocates argue that the latest surveillance directives could undermine fundamental freedoms.",
          bn: "অধিকারকর্মীদের দাবি, সর্বশেষ নজরদারি নির্দেশিকা মৌলিক স্বাধীনতাকে ক্ষুণ্ণ করতে পারে।"
        },
        content: {
          en: "<p>New legislative measures are under fire for potential human rights violations...</p>",
          bn: "<p>সম্ভাব্য মানবাধিকার লঙ্ঘনের জন্য নতুন আইনী পদক্ষেপগুলো সমালোচনার মুখে পড়েছে...</p>"
        },
        category: "Human Rights",
        author: authors[0],
        status: "Published",
        isFeatured: false,
        isBreaking: false,
        mainImage: "https://images.unsplash.com/photo-1589210339056-e109144490e1?w=800",
        createdAt: new Date(),
        readTime: { en: "6 min read", bn: "৬ মিনিট পড়ুন" }
      },
      {
        title: {
          en: "Fact Check: The Truth Behind the Viral Energy Crisis Claims",
          bn: "ফ্যাক্ট চেক: ভাইরাল হওয়া জ্বালানি সংকট দাবির নেপথ্যের সত্য"
        },
        slug: {
          en: "fact-check-energy-crisis",
          bn: "fact-check-energy-crisis-bn"
        },
        excerpt: {
          en: "We analyze the data to see if the recent power outage warnings are based on reality or social media hype.",
          bn: "সাম্প্রতিক বিদ্যুৎ বিভ্রাটের সতর্কতাগুলো কি বাস্তবভিত্তিক নাকি সোশ্যাল মিডিয়ার গুজব, তা যাচাই করেছি আমরা।"
        },
        content: {
          en: "<p>Misleading information about power grid stability has been circulating widely...</p>",
          bn: "<p>পাওয়ার গ্রিডের স্থিতিশীলতা সম্পর্কে বিভ্রান্তিকর তথ্য ব্যাপকভাবে ছড়িয়ে পড়েছে...</p>"
        },
        category: "Fact Check",
        author: authors[1],
        status: "Published",
        isFeatured: false,
        isBreaking: false,
        factCheckStatus: "Verified",
        mainImage: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800",
        createdAt: new Date(),
        readTime: { en: "4 min read", bn: "৪ মিনিট পড়ুন" }
      }
    ];

    // Insert only if not already exists to avoid duplicates
    for (const news of newsToInsert) {
      // For check, we look at the English slug
      const exists = await db.collection('articles').findOne({ "slug.en": news.slug.en });
      if (!exists) {
        await db.collection('articles').insertOne(news);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Admin Panel has been auto-populated with bilingual news articles!",
      count: newsToInsert.length
    });
  } catch (error: any) {
    console.error('Auto-populate error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
