import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://www.thereformtimes.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/*/admin/',
        '/api/',
        '/sw.js',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
