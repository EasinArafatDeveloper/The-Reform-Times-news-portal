import { Article, authors } from './data';

export async function fetchRealNews(): Promise<Article[]> {
  try {
    const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=http://feeds.bbci.co.uk/news/rss.xml&api_key=', { next: { revalidate: 3600 } });
    if (!response.ok) throw new Error('Failed to fetch real news');
    
    const data = await response.json();
    
    if (!data || !data.items || !Array.isArray(data.items)) {
      return [];
    }

    return data.items.map((item: any, index: number) => {
      // BBC thumbnails are small, we can try to get a larger image by replacing the path if possible, or just use as is.
      const imageUrl = item.thumbnail || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1200';
      
      // Slugify title
      const slugStr = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const titleStr = item.title;
      const excerptStr = item.description || item.title;
      const contentStr = `<p>${item.content || item.description}</p><p><a href="${item.link}" target="_blank" rel="noopener noreferrer">Read full original article on BBC</a></p>`;

      return {
        id: `real-${index}`,
        slug: { en: slugStr, bn: slugStr },
        title: { en: titleStr, bn: titleStr },
        excerpt: { en: excerptStr, bn: excerptStr },
        content: { en: contentStr, bn: contentStr },
        category: 'world', // Using category ID from data.ts
        author: authors[Math.floor(Math.random() * authors.length)], // Randomize author for realistic look
        date: item.pubDate || new Date().toISOString(),
        readTime: { en: `${Math.floor(Math.random() * 5) + 3} min read`, bn: `${Math.floor(Math.random() * 5) + 3} মিনিট পাঠ` },
        image: imageUrl,
        tags: [
          { en: 'World News', bn: 'বিশ্ব সংবাদ' },
          { en: 'Breaking', bn: 'ব্রেকিং নিউজ' }
        ],
        type: 'standard',
        status: 'Published'
      } as Article;
    });
  } catch (error) {
    console.error('Error fetching real news:', error);
    return [];
  }
}
