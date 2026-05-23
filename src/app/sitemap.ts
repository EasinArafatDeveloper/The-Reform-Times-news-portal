import type { MetadataRoute } from 'next';
import clientPromise from '@/lib/mongodb';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://www.thereformtimes.com';
  const locales = ['en', 'bn'];
  
  // 1. Define static paths to index
  const staticPaths = [
    '',
    '/about',
    '/careers',
    '/contact',
    '/editorial-policy',
    '/transparency',
    '/investigations',
    '/fact-check',
    '/video',
    '/opinion',
    '/news',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 2. Generate sitemap entries for static paths across all locales
  staticPaths.forEach((path) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'daily' : 'monthly',
        priority: path === '' ? 1.0 : 0.7,
        alternates: {
          languages: {
            en: `${baseUrl}/en${path}`,
            bn: `${baseUrl}/bn${path}`,
          },
        },
      });
    });
  });

  // 3. Fetch published articles from MongoDB
  try {
    const client = await clientPromise;
    const db = client.db('the-reform-times-news');
    
    const articles = await db.collection('articles')
      .find({ 
        status: { $in: ['Published', 'published'] } 
      })
      .project({ slug: 1, updatedAt: 1, createdAt: 1, publishedAt: 1, date: 1 })
      .toArray();

    articles.forEach((article) => {
      const slugEn = typeof article.slug === 'object' ? (article.slug.en || article.slug.bn) : article.slug;
      const slugBn = typeof article.slug === 'object' ? (article.slug.bn || article.slug.en) : article.slug;

      if (!slugEn && !slugBn) return;

      const primarySlug = slugEn || slugBn;
      const displaySlugEn = slugEn || primarySlug;
      const displaySlugBn = slugBn || primarySlug;
      const lastModifiedDate = article.updatedAt || article.createdAt || article.publishedAt || article.date || new Date();

      // Add English article entry
      sitemapEntries.push({
        url: `${baseUrl}/en/news/${displaySlugEn}`,
        lastModified: new Date(lastModifiedDate),
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}/en/news/${displaySlugEn}`,
            bn: `${baseUrl}/bn/news/${displaySlugBn}`,
          },
        },
      });

      // Add Bengali article entry
      sitemapEntries.push({
        url: `${baseUrl}/bn/news/${displaySlugBn}`,
        lastModified: new Date(lastModifiedDate),
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}/en/news/${displaySlugEn}`,
            bn: `${baseUrl}/bn/news/${displaySlugBn}`,
          },
        },
      });
    });
  } catch (error) {
    console.error('Error fetching articles for sitemap generation:', error);
  }

  return sitemapEntries;
}
