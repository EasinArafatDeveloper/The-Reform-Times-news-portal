import { Article, BilingualString } from './data';

export const getLocalizedContent = <T = string>(content: BilingualString | string | undefined, lang: string): T => {
  if (!content) return '' as any;
  if (typeof content === 'string') return content as any;
  return (lang === 'bn' ? (content.bn || content.en) : (content.en || content.bn)) as any;
};

export const getTranslationStatus = (article: any) => {
  const hasBn = !!(article.title?.bn && article.content?.bn);
  const hasEn = !!(article.title?.en && article.content?.en);
  
  if (hasBn && hasEn) return 'Complete';
  if (hasBn && !hasEn) return 'English Missing';
  if (!hasBn && hasEn) return 'Bangla Missing';
  return 'Needs Review';
};

export const getPublishedArticles = (articles: Article[]) => {
  return articles.filter(a => a.status === 'published' || a.status === 'Published');
};

export const getFeaturedArticles = (articles: Article[]) => {
  return getPublishedArticles(articles).filter(a => a.featured);
};

export const getBreakingArticles = (articles: Article[]) => {
  return getPublishedArticles(articles).filter(a => a.breaking);
};

export const getTrendingArticles = (articles: Article[]) => {
  return getPublishedArticles(articles).filter(a => a.trending);
};

export const getArticlesByCategory = (articles: Article[], categorySlug: string) => {
  return getPublishedArticles(articles).filter(a => 
    a.category?.toLowerCase() === categorySlug.toLowerCase()
  );
};

export const getArticleBySlug = (articles: Article[], slug: string, lang: string) => {
  return getPublishedArticles(articles).find(a => 
    (a.slug as any)?.[lang] === slug || 
    (a.slug as any)?.en === slug || 
    (a.slug as any)?.bn === slug ||
    (a.slug as any) === slug
  );
};

// Generate Slug Helper
export const generateSlug = (text: string) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\u0980-\u09FF ]+/g, '') // Keep alphanumeric and Bengali chars
    .replace(/ +/g, '-');
};
