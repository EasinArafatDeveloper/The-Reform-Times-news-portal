export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  articleCount?: number;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  author: Author;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
  type?: 'standard' | 'investigation' | 'opinion' | 'fact-check' | 'video';
  factCheckStatus?: 'Verified' | 'False' | 'Misleading' | 'Under Review';
  breaking?: boolean;
  featured?: boolean;
}

export const banglaArticles: Article[] = [
  {
    id: '1',
    slug: 'uncovering-the-hidden-supply-chain-crisis',
    title: 'ঢাকার যানজট নিরসনে নতুন মেগা প্ল্যান: কতটা কার্যকর হবে?',
    excerpt: 'রাজধানীর দীর্ঘদিনের যানজট সমস্যা সমাধানে সরকার নতুন একটি মেগা প্ল্যান হাতে নিয়েছে। বিশেষজ্ঞরা মিশ্র প্রতিক্রিয়া জানিয়েছেন।',
    content: '<p>রাজধানী ঢাকার যানজট নিরসনে সরকার নতুন একটি পরিকল্পনা গ্রহণ করেছে, যা আগামী দুই বছরের মধ্যে বাস্তবায়ন করা হবে বলে আশা করা হচ্ছে। এই পরিকল্পনায় আধুনিক সিগন্যাল সিস্টেম এবং নতুন কিছু ফ্লাইওভারের প্রস্তাব রয়েছে।</p><p>তবে নগর পরিকল্পনাবিদরা বলছেন, শুধুমাত্র অবকাঠামো উন্নয়ন দিয়ে এই সমস্যার স্থায়ী সমাধান সম্ভব নয়। গণপরিবহনের আধুনিকায়ন ও বিকেন্দ্রীকরণ জরুরি।</p>',
    category: 'Investigations',
    author: {
      id: 'a1',
      name: 'Sarah Jenkins',
      role: 'Senior Investigative Reporter',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      bio: 'Award-winning journalist focusing on corporate corruption and public policy.',
      articleCount: 142
    },
    date: new Date().toISOString(),
    readTime: '৩ মিনিট পড়ুন',
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f0a?auto=format&fit=crop&q=80&w=1200',
    tags: ['ঢাকা', 'যানজট', 'উন্নয়ন'],
    type: 'standard',
  },
  {
    id: '2',
    slug: 'the-future-of-renewable-energy-in-developing-nations',
    title: 'জলবায়ু পরিবর্তনের প্রভাবে হুমকির মুখে উপকূলীয় অঞ্চল',
    excerpt: 'সমুদ্রপৃষ্ঠের উচ্চতা বৃদ্ধি এবং ঘন ঘন প্রাকৃতিক দুর্যোগের কারণে বাংলাদেশের দক্ষিণাঞ্চলের লক্ষাধিক মানুষ বাস্তুচ্যুত হওয়ার ঝুঁকিতে রয়েছে।',
    content: '<p>সাম্প্রতিক এক গবেষণায় দেখা গেছে, জলবায়ু পরিবর্তনের ফলে বাংলাদেশের উপকূলীয় অঞ্চলে লবণাক্ততা বৃদ্ধি পেয়েছে, যা কৃষিকাজের জন্য বড় হুমকি।</p>',
    category: 'Environment',
    author: {
      id: 'a2',
      name: 'Michael Chen',
      role: 'Data Journalism Editor',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
      bio: 'Data specialist visualizing complex systemic issues and economic trends.',
      articleCount: 89
    },
    date: new Date().toISOString(),
    readTime: '৪ মিনিট পড়ুন',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200',
    tags: ['জলবায়ু', 'পরিবেশ', 'উপকূল'],
    type: 'standard',
  },
  {
    id: '3',
    slug: 'new-education-reforms-spark-nationwide-debate',
    title: 'শিক্ষা খাতে ব্যাপক সংস্কারের দাবি বিশেষজ্ঞদের',
    excerpt: 'মুখস্থবিদ্যা নির্ভর শিক্ষাব্যবস্থা থেকে বেরিয়ে এসে কর্মমুখী ও সৃজনশীল শিক্ষার উপর জোর দেওয়ার আহ্বান জানিয়েছেন শিক্ষাবিদরা।',
    content: '<p>বর্তমান শিক্ষাব্যবস্থা শিক্ষার্থীদের প্রতিযোগিতামূলক বিশ্বের জন্য কতটা প্রস্তুত করছে তা নিয়ে প্রশ্ন তুলেছেন বিশ্লেষকরা।</p>',
    category: 'National',
    author: {
      id: 'a3',
      name: 'Elena Rodriguez',
      role: 'Human Rights Correspondent',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
      bio: 'Reporting from the frontlines of global human rights movements.',
      articleCount: 215
    },
    date: new Date().toISOString(),
    readTime: '২ মিনিট পড়ুন',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1200',
    tags: ['শিক্ষা', 'সংস্কার', 'বাংলাদেশ'],
    type: 'standard',
  },
  {
    id: '4',
    slug: 'tech-startups-thriving-despite-economic-headwinds',
    title: 'ঢাকায় প্রযুক্তি স্টার্টআপের নতুন দিগন্ত',
    excerpt: 'তরুণ উদ্যোক্তাদের হাত ধরে প্রযুক্তি খাতে দ্রুত এগিয়ে যাচ্ছে বাংলাদেশ। বিদেশি বিনিয়োগও বাড়ছে উল্লেখযোগ্য হারে।',
    content: '<p>গত কয়েক বছরে দেশের স্টার্টআপ ইকোসিস্টেমে ব্যাপক পরিবর্তন এসেছে। ফিনটেক, এডটেক এবং হেলথটেক খাতে নতুন নতুন আইডিয়া নিয়ে কাজ করছে তরুণরা।</p>',
    category: 'Technology',
    author: {
      id: 'a1',
      name: 'Sarah Jenkins',
      role: 'Senior Reporter',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      bio: 'Award-winning journalist.',
      articleCount: 142
    },
    date: new Date().toISOString(),
    readTime: '৩ মিনিট পড়ুন',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200',
    tags: ['প্রযুক্তি', 'স্টার্টআপ', 'বিনিয়োগ'],
    type: 'standard',
  }
];

export const categories: Category[] = [
  { id: '0', name: 'Bangladesh', slug: 'bangladesh' },
  { id: '1', name: 'National', slug: 'national' },
  { id: '2', name: 'World', slug: 'world' },
  { id: '3', name: 'Politics', slug: 'politics' },
  { id: '4', name: 'Human Rights', slug: 'human-rights' },
  { id: '5', name: 'Investigations', slug: 'investigations' },
  { id: '6', name: 'Opinion', slug: 'opinion' },
  { id: '7', name: 'Fact Check', slug: 'fact-check' },
  { id: '8', name: 'Video', slug: 'video' },
  { id: '9', name: 'Environment', slug: 'environment' },
  { id: '10', name: 'Youth Voice', slug: 'youth-voice' },
];

export const authors: Author[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    role: 'Senior Investigative Reporter',
    bio: 'Award-winning journalist focusing on corporate corruption and public policy.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
    articleCount: 142
  },
  {
    id: '2',
    name: 'David Chen',
    role: 'Human Rights Correspondent',
    bio: 'Covering global human rights issues, migration, and social justice.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150',
    articleCount: 89
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    role: 'Political Editor',
    bio: 'Expert analysis on national politics, elections, and legislative reforms.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150',
    articleCount: 215
  },
  {
    id: '4',
    name: 'Marcus Thorne',
    role: 'Fact-Check Lead',
    bio: 'Dedicated to verifying claims and combating misinformation in digital media.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150',
    articleCount: 310
  }
];

export const mockArticles: Article[] = [
  {
    id: '1',
    slug: 'uncovering-the-hidden-supply-chain-crisis',
    title: 'Uncovering the Hidden Supply Chain Crisis Affecting Essential Medicines',
    excerpt: 'A six-month investigation reveals systematic failures in the global distribution of life-saving treatments, leaving vulnerable populations at risk.',
    content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
    category: 'Investigations',
    author: authors[0],
    date: '2026-05-15T08:00:00Z',
    readTime: '12 min read',
    image: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&q=80&w=1200',
    tags: ['Healthcare', 'Supply Chain', 'Global Economy'],
    featured: true,
    breaking: false,
    type: 'investigation'
  },
  {
    id: '2',
    slug: 'senate-passes-historic-climate-reform-bill',
    title: 'Senate Passes Historic Climate Reform Bill After Marathon Session',
    excerpt: 'In a narrow 51-49 vote, lawmakers approved the most comprehensive environmental legislation in a decade, targeting industrial emissions.',
    category: 'Politics',
    author: authors[2],
    date: '2026-05-16T10:30:00Z',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=800',
    tags: ['Climate Change', 'Legislation', 'Senate'],
    breaking: true,
    type: 'standard'
  },
  {
    id: '3',
    slug: 'voices-from-the-border-human-stories-behind-policy',
    title: 'Voices from the Border: The Human Stories Behind the Policy',
    excerpt: 'We spent a month at the southern border speaking directly with families affected by the new immigration directives.',
    category: 'Human Rights',
    author: authors[1],
    date: '2026-05-14T14:15:00Z',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead2708?auto=format&fit=crop&q=80&w=800',
    tags: ['Immigration', 'Human Rights', 'Policy'],
    type: 'standard'
  },
  {
    id: '4',
    slug: 'fact-check-viral-video-claims-about-election-fraud',
    title: 'Fact Check: Viral Video Claims About Election Fraud Are Baseless',
    excerpt: 'A widely circulated video alleging voter suppression in key swing states has been manipulated from 2022 footage.',
    category: 'Fact Check',
    author: authors[3],
    date: '2026-05-16T09:00:00Z',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff0f?auto=format&fit=crop&q=80&w=800',
    tags: ['Elections', 'Misinformation', 'Social Media'],
    type: 'fact-check',
    factCheckStatus: 'False'
  },
  {
    id: '5',
    slug: 'why-we-need-to-rethink-urban-planning',
    title: 'Why We Need to Rethink Urban Planning for the Next Generation',
    excerpt: 'Current city models are failing our youth. It’s time for a radical redesign of public spaces that prioritize community over cars.',
    category: 'Opinion',
    author: authors[0],
    date: '2026-05-13T11:45:00Z',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=800',
    tags: ['Urban Planning', 'Opinion', 'Future Cities'],
    type: 'opinion'
  },
  {
    id: '6',
    slug: 'inside-the-protests-demanding-education-reform',
    title: 'Inside the Protests Demanding Immediate Education Reform',
    excerpt: 'Students and teachers unite across major cities, calling for equitable funding and modernized curriculums.',
    category: 'Video',
    author: authors[1],
    date: '2026-05-15T16:20:00Z',
    readTime: '15 min watch',
    image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&q=80&w=800',
    tags: ['Education', 'Protests', 'Youth'],
    type: 'video'
  },
  {
    id: '7',
    slug: 'corporate-tax-loopholes-costing-billions',
    title: 'The Invisible Drain: Corporate Tax Loopholes Costing Public Services Billions',
    excerpt: 'Our latest investigation traces how multinational conglomerates legally avoid taxes that could fund schools and hospitals.',
    category: 'Investigations',
    author: authors[0],
    date: '2026-05-12T07:30:00Z',
    readTime: '14 min read',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
    tags: ['Economy', 'Taxes', 'Corporate Accountability'],
    type: 'investigation'
  },
  {
    id: '8',
    slug: 'water-crisis-deepens-in-agricultural-heartland',
    title: 'Water Crisis Deepens in the Agricultural Heartland',
    excerpt: 'Farmers face unprecedented droughts while local governments struggle to implement emergency conservation measures.',
    category: 'Environment',
    author: authors[2],
    date: '2026-05-16T12:00:00Z',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&q=80&w=800',
    tags: ['Environment', 'Agriculture', 'Water'],
    type: 'standard'
  }
];

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
