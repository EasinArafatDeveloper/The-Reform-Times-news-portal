import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

async function seedData() {
  console.log('Connecting to database for seeding high-quality bilingual data...');
  const client = new MongoClient(MONGODB_URI!, {
    tlsAllowInvalidCertificates: true,
  });

  try {
    await client.connect();
    const db = client.db('the-reform-times-news');

    // 1. CLEAR OLD COLLECTIONS
    await db.collection('articles').deleteMany({});
    await db.collection('categories').deleteMany({});
    await db.collection('journalists').deleteMany({});

    // 2. SEED JOURNALISTS
    const journalists = [
      { 
        id: 'author-1',
        name: 'Salman Ahmed', 
        role: { en: 'Chief Editor', bn: 'প্রধান সম্পাদক' }, 
        email: 'salman@reformtimes.com', 
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 
        articles: 156, 
        status: 'Active' 
      },
      { 
        id: 'author-2',
        name: 'Sarah Jenkins', 
        role: { en: 'Senior Investigative Reporter', bn: 'সিনিয়র অনুসন্ধানী প্রতিবেদক' }, 
        email: 'sarah@reformtimes.com', 
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 
        articles: 89, 
        status: 'Active' 
      },
      { 
        id: 'author-3',
        name: 'Michael Chen', 
        role: { en: 'Fact Check Director', bn: 'ফ্যাক্ট চেক পরিচালক' }, 
        email: 'michael@reformtimes.com', 
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 
        articles: 42, 
        status: 'Active' 
      },
      { 
        id: 'author-4',
        name: 'Elena Rodriguez', 
        role: { en: 'Political Editor', bn: 'রাজনৈতিক সম্পাদক' }, 
        email: 'elena@reformtimes.com', 
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', 
        articles: 215, 
        status: 'Active' 
      },
    ];
    await db.collection('journalists').insertMany(journalists);

    // 3. SEED CATEGORIES
    const categories = [
      { name: { en: 'National', bn: 'জাতীয়' }, slug: 'national', color: '#8B0000' },
      { name: { en: 'International', bn: 'আন্তর্জাতিক' }, slug: 'international', color: '#0B1B3D' },
      { name: { en: 'Investigations', bn: 'অনুসন্ধান' }, slug: 'investigations', color: '#C5A059' },
      { name: { en: 'Politics', bn: 'রাজনীতি' }, slug: 'politics', color: '#1a365d' },
      { name: { en: 'Human Rights', bn: 'মানবাধিকার' }, slug: 'human-rights', color: '#e53e3e' },
      { name: { en: 'Environment', bn: 'পরিবেশ' }, slug: 'environment', color: '#2f855a' },
      { name: { en: 'Fact Check', bn: 'ফ্যাক্ট চেক' }, slug: 'fact-check', color: '#dd6b20' },
      { name: { en: 'Opinions', bn: 'মতামত' }, slug: 'opinions', color: '#4a5568' },
      { name: { en: 'Economy', bn: 'অর্থনীতি' }, slug: 'economy', color: '#2c7a7b' }
    ];
    await db.collection('categories').insertMany(categories);

    // 4. PREPARE HIGH-QUALITY BILINGUAL ARTICLES (3 per type/section)
    const articles = [
      // === SECTION: INVESTIGATIONS ===
      {
        id: 'invest-1',
        title: {
          en: "The Ghost Factories: Where Billions in Public Funds Disappeared",
          bn: "অদৃশ্য কারখানা: যেখানে বিলিয়ন বিলিয়ন সরকারি তহবিল উধাও হয়েছে"
        },
        slug: {
          en: "the-ghost-factories-billions-disappeared",
          bn: "অদৃশ্য-কারখানা-বিলিয়ন-সরকারি-তহবিল-উধাও"
        },
        excerpt: {
          en: "A comprehensive investigation tracks the money trail of multi-million dollar industrial projects that exist only on paper but have fully drained government reserves.",
          bn: "একটি দীর্ঘ ও নিবিড় অনুসন্ধান প্রকাশ করেছে কীভাবে শুধুমাত্র কাগজে-কলমে থাকা বড় বড় শিল্প কারখানাগুলো কোটি কোটি টাকা সরকারি ব্যাংক ও রিজার্ভ থেকে তুলে আত্মসাৎ করেছে।"
        },
        content: {
          en: "<p>A six-month tracking of procurement registries and field audits reveals that over 24 industrial plants slated to boost local jobs never laid a single brick. Local residents report zero construction activity while corporate executives fled overseas with substantial public subsidies.</p>",
          bn: "<p>ছয় মাসেরও বেশি সময় ধরে বিভিন্ন ক্রয় নথি এবং মাঠ পর্যায়ের অডিট রিপোর্টের অনুসন্ধানে জানা গেছে যে, ২৪টিরও বেশি শিল্প কারখানা যা স্থানীয় কর্মসংস্থান বৃদ্ধির কথা ছিল, সেগুলোর একটি ইটও স্থাপন করা হয়নি। স্থানীয় বাসিন্দারা জানান কোনো নির্মাণ কাজই হয়নি, অথচ কর্পোরেট কর্মকর্তারা বিপুল পরিমাণ সরকারি ভতুর্কি তুলে বিদেশে পালিয়ে গেছেন।</p>"
        },
        image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800",
        mainImage: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800",
        category: "investigations",
        author: journalists[1],
        type: "investigation",
        status: "Published",
        featured: true,
        breaking: true,
        readTime: { en: "15 min read", bn: "১৫ মিনিট পাঠ" },
        createdAt: new Date().toISOString()
      },
      {
        id: 'invest-2',
        title: {
          en: "Massive Medicine Supply Collapses Across Rural Healthcare Units",
          bn: "গ্রামীণ স্বাস্থ্যকেন্দ্রগুলোতে জীবন রক্ষাকারী ওষুধের তীব্র সংকট"
        },
        slug: {
          en: "massive-medicine-supply-collapses-rural",
          bn: "গ্রামীণ-স্বাস্থ্যকেন্দ্রগুলোতে-ওষুধের-তীব্র-সংকট"
        },
        excerpt: {
          en: "Systematic failure in procurement lists leaving millions without accessible cardiac and insulin supplies in remote communities.",
          bn: "সরকারি ওষুধ ক্রয়ের ত্রুটিপূর্ণ সিস্টেম ও বন্টন অব্যবস্থাপনার কারণে কোটি কোটি গ্রামীণ ও প্রত্যন্ত অঞ্চলের মানুষ ডায়াবেটিস ও হৃদরোগের জরুরি ওষুধ থেকে বঞ্চিত হচ্ছেন।"
        },
        content: {
          en: "<p>Dozens of rural community clinics are left with dusty shelves as the supply lines completely dried out. The government appointed distributors blamed inflation and transport logistics, but financial audits indicate massive fund diversions.</p>",
          bn: "<p>দেশের অসংখ্য গ্রামীণ কমিউনিটি ক্লিনিকের ওষুধের তাক ধূলিময় পড়ে আছে কারণ ওষুধ সরবরাহ সম্পূর্ণ বন্ধ। সরকারি সরবরাহকারীরা মুদ্রাস্ফীতি ও যাতায়াত খরচের অজুহাত দিলেও আর্থিক অডিটে ব্যাপক দুর্নীতি ও অর্থ পাচারের প্রমাণ মিলেছে।</p>"
        },
        image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800",
        mainImage: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800",
        category: "investigations",
        author: journalists[1],
        type: "investigation",
        status: "Published",
        featured: false,
        readTime: { en: "10 min read", bn: "১০ মিনিট পাঠ" },
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'invest-3',
        title: {
          en: "The Wetlands Devastated by Illegal Sand Dredging Syndicates",
          bn: "অবৈধ বালু উত্তোলন সিন্ডিকেটের থাবায় বিলীন হচ্ছে ফসলি জমি ও নদী"
        },
        slug: {
          en: "wetlands-devastated-illegal-sand-dredging",
          bn: "অবৈধ-বালু-উত্তোলন-সিন্ডিকেটের-ফসলি-জমি-নদী"
        },
        excerpt: {
          en: "Powerful regional syndicates bypass environmental regulations, leading to major riverbank collapses and displacement of farming families.",
          bn: "ক্ষমতাশালী আঞ্চলিক সিন্ডিকেট সরকারি পরিবেশ আইন অমান্য করে অবৈধ ড্রেজার বসিয়ে বালু তোলার ফলে নদীভাঙন দেখা দিয়েছে ও শত শত কৃষক পরিবার গৃহহীন হয়ে পড়ছে।"
        },
        content: {
          en: "<p>Despite court restrictions, illegal suction dredgers operate night and day. Large tracts of arable farming land have slid into the expanding riverbeds, permanently destroying local agricultural livelihoods.</p>",
          bn: "<p>আদালতের নিষেধাজ্ঞা থাকা সত্ত্বেও রাতের আঁধারে অবৈধ ড্রেজার দিয়ে বালু তোলা হচ্ছে। এর ফলে ফসলি জমি নদীগর্ভে বিলীন হয়ে গেছে, যা স্থানীয় কৃষিজীবী মানুষের জীবন-জীবিকা সম্পূর্ণ ধ্বংস করে দিয়েছে।</p>"
        },
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
        mainImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
        category: "investigations",
        author: journalists[1],
        type: "investigation",
        status: "Published",
        featured: false,
        readTime: { en: "8 min read", bn: "৮ মিনিট পাঠ" },
        createdAt: new Date(Date.now() - 172800000).toISOString()
      },

      // === SECTION: FACT CHECK ===
      {
        id: 'fact-1',
        title: {
          en: "Fact Check: Misleading Claims Regarding Bank Reserve Shortages Debunked",
          bn: "ফ্যাক্ট চেক: ব্যাংকের রিজার্ভ ফুরিয়ে যাওয়ার দাবিটি বিভ্রান্তিকর ও মিথ্যা"
        },
        slug: {
          en: "fact-check-bank-reserve-shortage-claims-false",
          bn: "ফ্যাক্ট-চেক-ব্যাংকের-রিজার্ভ-ফুরিয়ে-যাওয়ার-দাবি-বিভ্রান্তিকর"
        },
        excerpt: {
          en: "A detailed analysis of central treasury logs confirms that rumors regarding complete financial bankruptcy are entirely baseless.",
          bn: "কেন্দ্রীয় ব্যাংকের হিসাব ও রিজার্ভের ডেটা বিশ্লেষণ করে নিশ্চিত হওয়া গেছে যে, দেশ সম্পূর্ণ ব্যাংক দেউলিয়া হয়ে যাওয়ার যে গুজব ফেসবুকে ছড়িয়েছে তা ভিত্তিহীন।"
        },
        content: {
          en: "<p>A viral social media post claimed the treasury only holds 2 days of imports. However, real-time banking data shows reserves are stable at multi-billion levels, easily covering standard trade buffers. Our verification rates this viral claim as FALSE.</p>",
          bn: "<p>ফেসবুকে ভাইরাল একটি পোস্টে দাবি করা হয়েছে ব্যাংকের রিজার্ভ মাত্র ২ দিনের আমদানির সমান। অথচ ব্যাংকিং ডেটা পর্যালোচনা করে দেখা গেছে রিজার্ভ এখনো বিলিয়ন ডলারের স্থিতিশীল অবস্থানে রয়েছে। আমাদের যাচাইয়ে এই ভাইরাল পোস্টটি অসত্য প্রমাণিত হয়েছে।</p>"
        },
        image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800",
        mainImage: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800",
        category: "fact-check",
        author: journalists[2],
        type: "fact-check",
        factCheckStatus: "False",
        status: "Published",
        featured: false,
        readTime: { en: "4 min read", bn: "৪ মিনিট পাঠ" },
        createdAt: new Date().toISOString()
      },
      {
        id: 'fact-2',
        title: {
          en: "Fact Check: Did the Ministry Mandate 6-Day Work Weeks for Schools?",
          bn: "ফ্যাক্ট চেক: স্কুলগুলোতে কি সপ্তাহে ৬ দিন ক্লাসের নতুন আইন জারি করা হয়েছে?"
        },
        slug: {
          en: "fact-check-ministry-mandate-6-day-school",
          bn: "ফ্যাক্ট-চেক-স্কুল-সপ্তাহে-৬-দিন-ক্লাসের-নতুন-আইন"
        },
        excerpt: {
          en: "We verified the alleged circular claiming secondary schools will remain open on Saturdays, and found it to be forged.",
          bn: "মাধ্যমিক স্কুলগুলো আগামী শনিবার থেকে খোলা রাখার দাবি সংবলিত একটি নোটিশ ইন্টারনেটে ছড়ালে শিক্ষা মন্ত্রণালয়ের সাথে কথা বলে আমরা নিশ্চিত হয়েছি নোটিশটি নকল।"
        },
        content: {
          en: "<p>The viral circular used an altered header and a forged signature of the secretary. The Ministry confirmed to us that no such notification was issued, and the standard five-day academic schedule remains in effect.</p>",
          bn: "<p>ভাইরাল হওয়া নোটিশে শিক্ষা মন্ত্রণালয়ের লোগো ও সচিবের সই জাল করা হয়েছে। মন্ত্রণালয় নিশ্চিত করেছে এই ধরণের কোনো নির্দেশ জারি করা হয়নি এবং সপ্তাহে দুই দিনই ছুটি বহাল থাকবে।</p>"
        },
        image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800",
        mainImage: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800",
        category: "fact-check",
        author: journalists[2],
        type: "fact-check",
        factCheckStatus: "False",
        status: "Published",
        featured: false,
        readTime: { en: "3 min read", bn: "৩ মিনিট পাঠ" },
        createdAt: new Date(Date.now() - 43200000).toISOString()
      },
      {
        id: 'fact-3',
        title: {
          en: "Fact Check: The Truth Behind the River Water Contamination Rumors",
          bn: "ফ্যাক্ট চেক: শীতলক্ষ্যা নদীর পানি বিষাক্ত হওয়ার খবরটি কতটুকু সত্য?"
        },
        slug: {
          en: "fact-check-river-water-contamination-truth",
          bn: "ফ্যাক্ট-চেক-শীতলক্ষ্যা-নদীর-পানি-বিষাক্ত-হওয়ার-খবর"
        },
        excerpt: {
          en: "Water filtration plants confirm that water safety indexes remain clean, debasing rumors of toxic poisoning.",
          bn: "পানি শোধনাগারের ল্যাবরেটরি টেস্ট রিপোর্টে দেখা গেছে নদীর পানি সরবরাহে ক্ষতিকর বিষক্রিয়ার যে গুজব ছড়ানো হয়েছে, তা সম্পূর্ণ অসত্য।"
        },
        content: {
          en: "<p>Reports claiming massive toxic chemical leaks into the water supply triggered alarm. Water treatment plants ran comprehensive tests and confirmed the safety index is within normal limits. The rumors are MISLEADING.</p>",
          bn: "<p>নদীর পানিতে মারাত্মক কেমিক্যাল লিকেজ হওয়ার গুজবে আতঙ্ক ছড়ায়। তবে পানি শোধনাগারের ল্যাব টেস্টে পানির মান সম্পূর্ণ স্বাভাবিক পাওয়া গেছে। সুতরাং এই খবরটি বিভ্রান্তিকর।</p>"
        },
        image: "https://images.unsplash.com/photo-1518081461904-9d8f136351c2?w=800",
        mainImage: "https://images.unsplash.com/photo-1518081461904-9d8f136351c2?w=800",
        category: "fact-check",
        author: journalists[2],
        type: "fact-check",
        factCheckStatus: "Misleading",
        status: "Published",
        featured: false,
        readTime: { en: "5 min read", bn: "৫ মিনিট পাঠ" },
        createdAt: new Date(Date.now() - 172800000).toISOString()
      },

      // === SECTION: OPINION & EDITORIAL ===
      {
        id: 'opinion-1',
        title: {
          en: "The Path to Democratic Reconstruction: Systemic Reforms We Need",
          bn: "গণতান্ত্রিক পুনর্গঠনের পথ: আমাদের যে প্রাতিষ্ঠানিক সংস্কার প্রয়োজন"
        },
        slug: {
          en: "path-to-democratic-reconstruction-systemic-reforms",
          bn: "গণতান্ত্রিক-পুনর্গঠনের-পথ-প্রাতিষ্ঠানিক-সংস্কার"
        },
        excerpt: {
          en: "True governance reform requires rebuilding transparent judicial and electoral frameworks, rather than superficial political shifts.",
          bn: "প্রকৃত সুশাসন প্রতিষ্ঠা করতে হলে শুধু ক্ষমতার হাতবদল নয়, বরং বিচার বিভাগ ও নির্বাচন ব্যবস্থার স্থায়ী ও স্বচ্ছ প্রাতিষ্ঠানিক সংস্কার অত্যন্ত জরুরি।"
        },
        content: {
          en: "<p>The history of transition highlights that without deep structural reforms, old political malpractices inevitably return. We must guarantee judicial autonomy and strengthen electoral commissions to build a resilient future.</p>",
          bn: "<p>ইতিহাস আমাদের শেখায় যে, গভীর কাঠামোগত সংস্কার ছাড়া পুরনো রাজনৈতিক অনিয়ম আবারও ফিরে আসে। বিচার বিভাগের পূর্ণ স্বাধীনতা ও নির্বাচন কমিশনকে শক্তিশালী করা ছাড়া দীর্ঘস্থায়ী মুক্তি অসম্ভব।</p>"
        },
        image: "https://images.unsplash.com/photo-1541872703-74c5e443d1fe?w=800",
        mainImage: "https://images.unsplash.com/photo-1541872703-74c5e443d1fe?w=800",
        category: "opinions",
        author: journalists[0],
        type: "opinion",
        status: "Published",
        featured: false,
        readTime: { en: "7 min read", bn: "৭ মিনিট পাঠ" },
        createdAt: new Date().toISOString()
      },
      {
        id: 'opinion-2',
        title: {
          en: "Advocacy Journalism: Speaking Truth to Power in the Digital Era",
          bn: "অ্যাডভোকেসি জার্নালিজম: ডিজিটাল যুগে ক্ষমতার সামনে সত্য বলার লড়াই"
        },
        slug: {
          en: "advocacy-journalism-speaking-truth-power-digital",
          bn: "অ্যাডভোকেসি-জার্নালিজম-ডিজিটাল-যুগে-সত্য-বলার-লড়াই"
        },
        excerpt: {
          en: "In an era of corporate media filters, objective advocacy journalism serves as a crucial voice for the vulnerable.",
          bn: "কর্পোরেট মিডিয়ার ভিড়ে সত্য প্রকাশ করা ও অধিকারহারা মানুষের পক্ষে জোরালো আওয়াজ তোলাই হচ্ছে আধুনিক অ্যাডভোকেসি সাংবাদিকতার মূল উদ্দেশ্য।"
        },
        content: {
          en: "<p>Journalism must never be silent observers in the face of human rights violations. Our commitment is always to tell stories that demand accountability and support justice.</p>",
          bn: "<p><p>মানবাধিকার লঙ্ঘনের সামনে সাংবাদিকরা কখনই নীরব দর্শক থাকতে পারেন না। আমাদের অঙ্গীকার সবসময় সত্য ও ন্যায়ের পক্ষে কথা বলা ও জবাবদিহিতা নিশ্চিত করা।</p></p>"
        },
        image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800",
        mainImage: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800",
        category: "opinions",
        author: journalists[3],
        type: "opinion",
        status: "Published",
        featured: false,
        readTime: { en: "6 min read", bn: "৬ মিনিট পাঠ" },
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'opinion-3',
        title: {
          en: "Green Energy Transitions: The Immediate Ecological Imperative",
          bn: "সবুজ শক্তির রূপান্তর: আমাদের অবহেলা করার আর সুযোগ নেই"
        },
        slug: {
          en: "green-energy-transitions-ecological-imperative",
          bn: "সবুজ-শক্তির-রূপান্তর-আমাদের-অবহেলার-সুযোগ-নেই"
        },
        excerpt: {
          en: "We must phase out traditional polluting fossil fuels to save the delicate ecosystems of the Sundarbans Delta.",
          bn: "সুন্দরবনের মতো সংবেদনশীল প্রাকৃতিক অববাহিকাকে বাঁচাতে হলে কয়লা ও ঐতিহ্যবাহী জীবাশ্ম জ্বালানি থেকে দ্রুত সবুজ শক্তিতে রূপান্তর জরুরি।"
        },
        content: {
          en: "<p>Climate changes are already causing severe storm surges in coastal regions. Immediate national clean energy policies are a survival requirement, not a lifestyle preference.</p>",
          bn: "<p>জলবায়ু পরিবর্তনের কারণে উপকূলীয় অঞ্চলে প্রতিনিয়ত জলোচ্ছ্বাস হচ্ছে। তাই দ্রুত সৌর ও সবুজ বিদ্যুৎ শক্তির প্রসার ঘটানো আমাদের বেঁচে থাকার জন্য আবশ্যক।</p>"
        },
        image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800",
        mainImage: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800",
        category: "opinions",
        author: journalists[0],
        type: "opinion",
        status: "Published",
        featured: false,
        readTime: { en: "8 min read", bn: "৮ মিনিট পাঠ" },
        createdAt: new Date(Date.now() - 172800000).toISOString()
      },

      // === SECTION: VIDEOS ===
      {
        id: 'video-1',
        title: {
          en: "Underground: The Untold Struggle of City Day Laborers",
          bn: "মাটির নিচে: শহরের দিনমজুরদের জীবনযুদ্ধ ও না বলা কথা"
        },
        slug: {
          en: "underground-struggle-city-day-laborers-documentary",
          bn: "মাটির-নিচে-শহরের-দিনমজুরদের-জীবনযুদ্ধ"
        },
        excerpt: {
          en: "An inside look into the dangerous work and minimum wages of manual laborers working in urban drainage projects.",
          bn: "নগরের ড্রেনেজ ও টানেল নির্মাণে কর্মরত দিনমজুরদের তীব্র ঝুঁকি এবং অতি সামান্য বেতনে হাড়ভাঙা খাটুনির এক নেপথ্য চিত্র।"
        },
        content: {
          en: "<p>This short video documentary follows three workers deep inside sewage construction lanes, highlighting the extreme lack of medical safety nets and safety gear.</p>",
          bn: "<p>এই স্বল্পদৈর্ঘ্য ভিডিও প্রামাণ্যচিত্রে দেখানো হয়েছে নোংরা সুয়ারেজ টানেলের ভেতর জীবনের ঝুঁকি নিয়ে কাজ করা তিন শ্রমিকের জীবন, যেখানে নেই কোনো চিকিৎসা বা সুরক্ষার ব্যবস্থা।</p>"
        },
        image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800",
        mainImage: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800",
        category: "video",
        author: journalists[0],
        type: "video",
        status: "Published",
        featured: false,
        readTime: { en: "5 min video", bn: "৫ মিনিট ভিডিও" },
        createdAt: new Date().toISOString()
      },
      {
        id: 'video-2',
        title: {
          en: "Reclaiming the Buriganga: An Environmental Victory",
          bn: "বুড়িগঙ্গা উদ্ধার: একটি পরিবেশগত বিজয় ও ফিরে আসা প্রাণ"
        },
        slug: {
          en: "reclaiming-buriganga-environmental-victory-documentary",
          bn: "বুড়িগঙ্গা-উদ্ধার-পরিবেশগত-বিজয়-প্রাণ"
        },
        excerpt: {
          en: "Tracking the massive citizens clean-up operation that successfully revived heavily polluted urban river banks.",
          bn: "নাগরিক সমাজের সম্মিলিত উদ্যোগে দূষিত বুড়িগঙ্গা নদীর তীর দখলমুক্ত করা ও প্রাণ ফিরিয়ে আনার এক আশাব্যাঞ্জক ভিজ্যুয়াল স্টোরি।"
        },
        content: {
          en: "<p>Witness the dramatic transition of heavily dump sites turning back to clean riverbeds, and local fishermen starting to return to their ancestral profession.</p>",
          bn: "<p>এই ভিডিও স্টোরিতে দেখুন কীভাবে একটি ময়লার ভাগাড় ধীরে ধীরে পরিষ্কার নদীপাড়ে পরিণত হলো এবং জেলেরা তাদের আদি পেশায় ফিরতে শুরু করলো।</p>"
        },
        image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800",
        mainImage: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800",
        category: "video",
        author: journalists[3],
        type: "video",
        status: "Published",
        featured: false,
        readTime: { en: "8 min video", bn: "৮ মিনিট ভিডিও" },
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'video-3',
        title: {
          en: "Behind the Lens: Human Rights Storytelling in Remote Hills",
          bn: "ক্যামেরার নেপথ্যে: পাহাড়ের আদিবাসীদের মানবাধিকারের গল্প"
        },
        slug: {
          en: "behind-lens-human-rights-storytelling-hills",
          bn: "ক্যামেরার-নেপথ্যে-পাহাড়ের-আদিবাসীদের-অধিকারের-গল্প"
        },
        excerpt: {
          en: "Our field journalists reflect on the challenges of reporting stories from conflict-prone tribal regions.",
          bn: "পার্বত্য প্রত্যন্ত অঞ্চলের বিপদসংকুল পরিবেশে আদিবাসীদের জীবন ও অধিকার নিয়ে কাজ করতে গিয়ে সাংবাদিকদের অভিজ্ঞতার ভিডিও।"
        },
        content: {
          en: "<p>Get a rare behind-the-scenes look as our camera crew navigates steep forest terrains to interview families seeking basic civic rights.</p>",
          bn: "<p>এই নেপথ্য ভিডিওতে দেখুন কীভাবে আমাদের ক্যামেরা টিম গহীন বনের পাহাড়ি রাস্তা পাড়ি দিয়ে মৌলিক নাগরিক অধিকার আদায়ের লড়াকু পরিবারের সাক্ষাৎকার নিয়েছে।</p>"
        },
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
        mainImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
        category: "video",
        author: journalists[1],
        type: "video",
        status: "Published",
        featured: false,
        readTime: { en: "12 min video", bn: "১২ মিনিট ভিডিও" },
        createdAt: new Date(Date.now() - 172800000).toISOString()
      },

      // === SECTION: NATIONAL / STANDARD NEWS ===
      {
        id: 'national-1',
        title: {
          en: "National Reform Bill Passes Senate After Intense 48-Hour Session",
          bn: "জাতীয় সংস্কার বিল দীর্ঘ ৪৮ ঘণ্টার তীব্র বিতর্কের পর অবশেষে পাস"
        },
        slug: {
          en: "national-reform-bill-passes-senate-historic-session",
          bn: "জাতীয়-সংস্কার-বিল-দীর্ঘ-৪৮-ঘণ্টার-বিতর্ক-পাস"
        },
        excerpt: {
          en: "The historic bill aims to restructure governance systems, increase transparency and limit political centralization.",
          bn: "শাসন ব্যবস্থার আমূল সংস্কার, অবাধ স্বচ্ছতা নিশ্চিত করা এবং অতিরিক্ত ক্ষমতা বিকেন্দ্রীকরণ করতে এই ঐতিহাসিক বিলটি পাস করা হয়েছে।"
        },
        content: {
          en: "<p>Lawmakers finalized the historic structural reform bill. The new act introduces deep changes to public audits and mandates independent oversight for all state infrastructure projects.</p>",
          bn: "<p>আইনপ্রণেতারা অবশেষে ঐতিহাসিক এই সংস্কার বিল পাস করলেন। এই নতুন আইনের মাধ্যমে সকল সরকারি অবকাঠামো প্রকল্পে স্বাধীন অডিট ও জনগণের জবাবদিহিতা নিশ্চিত করা বাধ্যতামূলক করা হয়েছে।</p>"
        },
        image: "https://images.unsplash.com/photo-1520110120385-c285d6b23ce2?w=800",
        mainImage: "https://images.unsplash.com/photo-1520110120385-c285d6b23ce2?w=800",
        category: "national",
        author: journalists[0],
        type: "standard",
        status: "Published",
        featured: false,
        readTime: { en: "5 min read", bn: "৫ মিনিট পাঠ" },
        createdAt: new Date().toISOString()
      },
      {
        id: 'national-2',
        title: {
          en: "Technical Education Focus Core in Newly Proposed Academic Syllabus",
          bn: "নতুন প্রস্তাবিত পাঠ্যসূচিতে কারিগরি ও বাস্তবমুখী শিক্ষার বড় ধরণের বদল"
        },
        slug: {
          en: "technical-education-focus-new-academic-syllabus",
          bn: "কারিগরি-বাস্তবমুখী-শিক্ষার-নতুন-পাঠ্যসূচি"
        },
        excerpt: {
          en: "Primary and secondary schools will pivot towards computer literacy and practical engineering programs.",
          bn: "প্রাথমিক ও মাধ্যমিক স্কুলগুলোতে মুখস্থ বিদ্যার বদলে কম্পিউটার লিটারেসি এবং ব্যবহারিক প্রকৌশল প্রোগ্রাম বাড়ানোর চূড়ান্ত খসড়া প্রকাশ।"
        },
        content: {
          en: "<p>The Education Commission announced a major curricular overhaul. Traditional exam formats are scheduled to be replaced with continuous assessments and team project logs.</p>",
          bn: "<p>শিক্ষা কমিশন কারিকুলামে বড় ধরনের সংস্কার ঘোষণা করেছে। মুখস্থ নির্ভর পরীক্ষার বদলে এখন থেকে প্রজেক্ট ও ব্যবহারিক কাজের ওপর ভিত্তি করে মূল্যায়ন করা হবে।</p>"
        },
        image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800",
        mainImage: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800",
        category: "national",
        author: journalists[0],
        type: "standard",
        status: "Published",
        featured: false,
        readTime: { en: "6 min read", bn: "৬ মিনিট পাঠ" },
        createdAt: new Date(Date.now() - 43200000).toISOString()
      },
      {
        id: 'national-3',
        title: {
          en: "Agricultural Innovation Boosts Economic Freedom in Remote Delta Islands",
          bn: "কৃষি গবেষণায় লবণাক্ত দ্বীপগুলোর অর্থনীতিতে নতুন সমৃদ্ধির আলো"
        },
        slug: {
          en: "agricultural-innovation-boosts-delta-islands-economy",
          bn: "কৃষি-গবেষণায়-লবণাক্ত-দ্বীপগুলোর-নতুন-সমৃদ্ধি"
        },
        excerpt: {
          en: "Salt-tolerant crop strains researched by local universities are successfully raising family yields by over 60%.",
          bn: "স্থানীয় বিজ্ঞানীদের আবিষ্কৃত লবণাক্ততা সহনশীল ধান চাষ করে উপকূলীয় চরের কৃষকদের ফসলের ফলন ৬০% এর বেশি বেড়েছে।"
        },
        content: {
          en: "<p>Farming communities in vulnerable delta zones report excellent harvests using the new salt-tolerant paddy. Financial yields have permanently altered family income security.</p>",
          bn: "<p>উপকূলীয় চরের কৃষকরা নতুন উদ্ভাবিত জাতের ধান চাষ করে বাম্পার ফলন পেয়েছেন। এই প্রযুক্তির সফল ব্যবহারে এলাকার শত শত পরিবারের অর্থনৈতিক মুক্তি নিশ্চিত হয়েছে।</p>"
        },
        image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800",
        mainImage: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800",
        category: "national",
        author: journalists[3],
        type: "standard",
        status: "Published",
        featured: false,
        readTime: { en: "8 min read", bn: "৮ মিনিট পাঠ" },
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];

    await db.collection('articles').insertMany(articles);
    console.log('Successfully seeded HIGH-QUALITY BILINGUAL articles to database for all sections!');

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await client.close();
  }
}

seedData();
