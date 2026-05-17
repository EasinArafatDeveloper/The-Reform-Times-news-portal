export interface BilingualString {
  en: string;
  bn: string;
}

export interface Category {
  id: string;
  slug: string;
  name: BilingualString;
  description?: BilingualString;
}

export interface Author {
  id: string;
  name: string; // Names usually stay same, but could be bilingual
  role: BilingualString;
  bio: BilingualString;
  avatar: string;
  articleCount?: number;
}

export interface ArticleLocation {
  country?: string;
  division?: string;
  district?: string;
  upazila?: string;
}

export interface Article {
  _id?: string;
  id?: string;
  slug: BilingualString;
  title: BilingualString;
  excerpt: BilingualString;
  content: BilingualString;
  seoTitle?: BilingualString;
  metaDescription?: BilingualString;
  category: string;
  subCategory?: string;
  author: any;
  authorId?: string;
  image?: string;
  mainImage?: string;
  gallery?: string[];
  tags?: string[] | BilingualString[];
  location?: ArticleLocation;
  type?: 'standard' | 'investigation' | 'opinion' | 'fact-check' | 'video';
  status?: 'Draft' | 'Pending Review' | 'Published' | 'Scheduled' | 'Archived' | 'published' | 'draft';
  featured?: boolean;
  breaking?: boolean;
  trending?: boolean;
  factCheckStatus?: 'Verified' | 'False' | 'Misleading' | 'Under Review';
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  date?: string;
  readTime?: string | BilingualString;
  views?: number;
}

export const categories: Category[] = [
  { id: 'bangladesh', slug: 'bangladesh', name: { en: 'Bangladesh', bn: 'বাংলাদেশ' } },
  { id: 'national', slug: 'national', name: { en: 'National', bn: 'জাতীয়' } },
  { id: 'world', slug: 'world', name: { en: 'World', bn: 'আন্তর্জাতিক' } },
  { id: 'politics', slug: 'politics', name: { en: 'Politics', bn: 'রাজনীতি' } },
  { id: 'human-rights', slug: 'human-rights', name: { en: 'Human Rights', bn: 'মানবাধিকার' } },
  { id: 'investigations', slug: 'investigations', name: { en: 'Investigations', bn: 'অনুসন্ধান' } },
  { id: 'opinion', slug: 'opinion', name: { en: 'Opinion', bn: 'মতামত' } },
  { id: 'fact-check', slug: 'fact-check', name: { en: 'Fact Check', bn: 'ফ্যাক্ট চেক' } },
  { id: 'video', slug: 'video', name: { en: 'Video', bn: 'ভিডিও' } },
  { id: 'environment', slug: 'environment', name: { en: 'Environment', bn: 'পরিবেশ' } },
  { id: 'youth-voice', slug: 'youth-voice', name: { en: 'Youth Voice', bn: 'যুগান্তর' } },
];

export const authors: Author[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    role: { en: 'Senior Investigative Reporter', bn: 'সিনিয়র অনুসন্ধানী প্রতিবেদক' },
    bio: { 
      en: 'Award-winning journalist focusing on corporate corruption and public policy.', 
      bn: 'করপোরেট দুর্নীতি এবং জননীতি নিয়ে কাজ করা একজন পুরস্কারপ্রাপ্ত সাংবাদিক।' 
    },
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
    articleCount: 142
  },
  {
    id: '2',
    name: 'David Chen',
    role: { en: 'Human Rights Correspondent', bn: 'মানবাধিকার প্রতিনিধি' },
    bio: { 
      en: 'Covering global human rights issues, migration, and social justice.', 
      bn: 'বিশ্বব্যাপী মানবাধিকার ইস্যু, অভিবাসন এবং সামাজিক ন্যায়বিচার নিয়ে কাজ করছেন।' 
    },
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150',
    articleCount: 89
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    role: { en: 'Political Editor', bn: 'রাজনৈতিক সম্পাদক' },
    bio: { 
      en: 'Expert analysis on national politics, elections, and legislative reforms.', 
      bn: 'জাতীয় রাজনীতি, নির্বাচন এবং আইনী সংস্কারের বিশেষজ্ঞ বিশ্লেষক।' 
    },
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150',
    articleCount: 215
  },
  {
    id: '4',
    name: 'Marcus Thorne',
    role: { en: 'Fact-Check Lead', bn: 'ফ্যাক্ট-চেক প্রধান' },
    bio: { 
      en: 'Dedicated to verifying claims and combating misinformation in digital media.', 
      bn: 'ডিজিটাল মিডিয়াতে তথ্যের সত্যতা যাচাই এবং অপপ্রচার মোকাবিলায় নিবেদিত।' 
    },
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150',
    articleCount: 310
  }
];

export const mockArticles: Article[] = [
  {
    id: '1',
    slug: { en: 'uncovering-the-hidden-supply-chain-crisis', bn: 'supply-chain-crisis-bd' },
    title: { 
      en: 'Uncovering the Hidden Supply Chain Crisis Affecting Essential Medicines', 
      bn: 'জীবনরক্ষাকারী ওষুধের সরবরাহ সংকটের নেপথ্যে: একটি অনুসন্ধানী প্রতিবেদন' 
    },
    excerpt: { 
      en: 'A six-month investigation reveals systematic failures in the global distribution of life-saving treatments.', 
      bn: 'দীর্ঘ ছয় মাসের অনুসন্ধানে জীবনরক্ষাকারী ওষুধের সরবরাহ ব্যবস্থায় ভয়াবহ অব্যবস্থাপনা এবং দুর্নীতির চিত্র উঠে এসেছে।' 
    },
    content: { 
      en: '<p>English content...</p>', 
      bn: '<p>বাংলা কন্টেন্ট...</p>' 
    },
    category: 'investigations',
    author: authors[0],
    date: new Date().toISOString(),
    readTime: { en: '12 min read', bn: '১২ মিনিট পড়ুন' },
    image: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&q=80&w=1200',
    tags: [{ en: 'Healthcare', bn: 'স্বাস্থ্যসেবা' }, { en: 'Supply Chain', bn: 'সরবরাহ ব্যবস্থা' }],
    featured: true,
    type: 'investigation'
  },
  {
    id: '2',
    slug: { en: 'senate-passes-historic-climate-reform-bill', bn: 'climate-reform-bill' },
    title: { 
      en: 'Senate Passes Historic Climate Reform Bill After Marathon Session', 
      bn: 'দীর্ঘ আলোচনার পর ঐতিহাসিক জলবায়ু সংস্কার বিল পাস' 
    },
    excerpt: { 
      en: 'Lawmakers approved the most comprehensive environmental legislation in a decade.', 
      bn: 'গত এক দশকের মধ্যে সবচেয়ে বড় পরিবেশগত আইন পাস করলেন আইনপ্রণেতারা।' 
    },
    content: { 
      en: '<p>English content...</p>', 
      bn: '<p>বাংলা কন্টেন্ট...</p>' 
    },
    category: 'politics',
    author: authors[2],
    date: new Date().toISOString(),
    readTime: { en: '5 min read', bn: '৫ মিনিট পড়ুন' },
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=800',
    tags: [{ en: 'Climate', bn: 'জলবায়ু' }, { en: 'Politics', bn: 'রাজনীতি' }],
    breaking: true,
    type: 'standard'
  },
  {
    id: '3',
    slug: { en: 'voices-from-the-border', bn: 'voices-from-the-border' },
    title: { 
      en: 'Voices from the Border: The Human Stories Behind the Policy', 
      bn: 'সীমান্তের কণ্ঠস্বর: নীতির আড়ালে মানবিক গল্প' 
    },
    excerpt: { 
      en: 'Direct stories from families affected by new immigration directives.', 
      bn: 'নতুন অভিবাসন নীতির প্রভাবে ক্ষতিগ্রস্ত পরিবারগুলোর সরাসরি অভিজ্ঞতা।' 
    },
    content: { en: '<p>English content...</p>', bn: '<p>বাংলা কন্টেন্ট...</p>' },
    category: 'human-rights',
    author: authors[1],
    date: new Date().toISOString(),
    readTime: { en: '8 min read', bn: '৮ মিনিট পড়ুন' },
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead2708?auto=format&fit=crop&q=80&w=800',
    tags: [{ en: 'Immigration', bn: 'অভিবাসন' }, { en: 'Rights', bn: 'অধিকার' }],
    type: 'standard'
  },
  {
    id: '4',
    slug: { en: 'fact-check-viral-video-claims', bn: 'fact-check-viral-video' },
    title: { 
      en: 'Fact Check: Viral Video Claims About Election Fraud Are Baseless', 
      bn: 'ফ্যাক্ট চেক: নির্বাচন কারচুপি নিয়ে ভাইরাল হওয়া ভিডিওটি ভিত্তিহীন' 
    },
    excerpt: { 
      en: 'A manipulated video alleging voter suppression has been debunked.', 
      bn: 'ভোট কারচুপির অভিযোগে ভাইরাল হওয়া ভিডিওটি আসলে কারসাজি করা এবং পুরনো।' 
    },
    content: { en: '<p>English content...</p>', bn: '<p>বাংলা কন্টেন্ট...</p>' },
    category: 'fact-check',
    author: authors[3],
    date: new Date().toISOString(),
    readTime: { en: '4 min read', bn: '৪ মিনিট পড়ুন' },
    image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff0f?auto=format&fit=crop&q=80&w=800',
    tags: [{ en: 'Election', bn: 'নির্বাচন' }, { en: 'Fact Check', bn: 'ফ্যাক্ট চেক' }],
    type: 'fact-check',
    factCheckStatus: 'False'
  }
];

export const banglaArticles = mockArticles;


export const trendingTopics = [
  'Election 2026',
  'Climate Action',
  'Tech Regulation',
  'Global Economy',
  'Healthcare Reform',
  'Human Rights'
];

export const navigationLinks = [
  { name: 'Home', bnName: 'প্রচ্ছদ', href: '/' },
  { name: 'Bangladesh', bnName: 'বাংলাদেশ', href: '/category/bangladesh' },
  { name: 'International', bnName: 'আন্তর্জাতিক', href: '/category/world' },
  { name: 'Politics', bnName: 'রাজনীতি', href: '/category/politics' },
  { name: 'Investigations', bnName: 'অনুসন্ধান', href: '/investigations' },
  { name: 'Fact Check', bnName: 'ফ্যাক্ট চেক', href: '/fact-check' },
];

export const uiTranslations = {
  en: {
    subscribe: "Subscribe",
    searchPlaceholder: "Search news...",
    breaking: "Breaking",
    more: "More",
    sections: "Sections",
    organization: "Organization",
    newsletter: "Newsletter",
    newsletterDesc: "Get truth delivered weekly. Sign up for our top investigative stories.",
    allRightsReserved: "All rights reserved.",
    aboutUs: "About Us",
    contactTips: "Contact & Tips",
    editorialPolicy: "Editorial Policy",
    careers: "Careers",
    transparency: "Transparency Report",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    cookieSettings: "Cookie Settings",
    heroTitle: "Journalism that Matters",
    heroSubtitle: "Dedicated to human rights, truth, and transparency.",
    readMore: "Read More",
  },
  bn: {
    subscribe: "সাবস্ক্রাইব",
    searchPlaceholder: "খবর খুঁজুন...",
    breaking: "ব্রেকিং",
    more: "আরও",
    sections: "বিভাগ",
    organization: "প্রতিষ্ঠান",
    newsletter: "নিউজলেটার",
    newsletterDesc: "সাপ্তাহিক সত্য সংবাদ পান। আমাদের সেরা অনুসন্ধানী গল্পের জন্য সাইন আপ করুন।",
    allRightsReserved: "সর্বস্বত্ব সংরক্ষিত।",
    aboutUs: "আমাদের সম্পর্কে",
    contactTips: "যোগাযোগ ও টিপস",
    editorialPolicy: "সম্পাদকীয় নীতি",
    careers: "ক্যারিয়ার",
    transparency: "স্বচ্ছতা রিপোর্ট",
    privacyPolicy: "গোপনীয়তা নীতি",
    termsOfService: "পরিষেবার শর্তাবলী",
    cookieSettings: "কুকি সেটিংস",
    heroTitle: "সঠিক সংবাদ, সঠিক দিশা",
    heroSubtitle: "মানবাধিকার, সত্য এবং স্বচ্ছতার প্রতি নিবেদিত।",
    readMore: "আরও পড়ুন",
  }
};
export const categoryTranslations: Record<string, string> = {
  'Investigations': 'অনুসন্ধান',
  'Environment': 'পরিবেশ',
  'National': 'জাতীয়',
  'Technology': 'প্রযুক্তি',
  'Politics': 'রাজনীতি',
  'World': 'আন্তর্জাতিক',
  'International': 'আন্তর্জাতিক',
  'Human Rights': 'মানবাধিকার',
  'Advocacy': 'অধিকার',
  'Fact Check': 'ফ্যাক্ট চেক',
  'Opinion': 'মতামত',
  'Video': 'ভিডিও',
  'Bangladesh': 'বাংলাদেশ',
};
