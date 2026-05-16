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
  featured?: boolean;
  breaking?: boolean;
  type?: 'standard' | 'video' | 'investigation' | 'opinion' | 'fact-check';
  factCheckStatus?: 'Verified' | 'False' | 'Misleading' | 'Under Review';
}

export const categories: Category[] = [
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
  { name: 'Home', href: '/' },
  { name: 'National', href: '/category/national' },
  { name: 'World', href: '/category/world' },
  { name: 'Politics', href: '/category/politics' },
  { name: 'Human Rights', href: '/category/human-rights' },
  { name: 'Investigations', href: '/investigations' },
  { name: 'Opinion', href: '/opinion' },
  { name: 'Fact Check', href: '/fact-check' },
  { name: 'Video', href: '/video' },
  { name: 'Contact', href: '/contact' },
];
