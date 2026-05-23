import { serializeMongo } from "@/lib/utils";
import clientPromise from "@/lib/mongodb";
import { mockArticles, categories, trendingTopics } from "@/lib/data";
import { NewsCard } from "@/components/shared/NewsCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import Link from "next/link";
import { Search } from "lucide-react";
import { getLocalizedContent, getTranslation } from "@/lib/i18n-utils";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isBangla = locale === 'bn';
  return {
    title: isBangla ? "সর্বশেষ সংবাদ | দি রিফর্ম টাইমস" : "Latest News | The Reform Times",
    description: isBangla 
      ? "দি রিফর্ম টাইমস-এর সর্বশেষ সংবাদ, অনুসন্ধানী প্রতিবেদন, বিশ্ব সংবাদ ও মতামত বিশ্লেষণ পড়ুন।" 
      : "Browse the latest news, investigations, and reports from The Reform Times.",
  };
}

export default async function NewsListingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isBangla = locale === 'bn';
  const t = (key: string) => getTranslation(locale, key);

  const client = await clientPromise;
  const db = client.db('the-reform-times-news');
  const rawArticles = await db.collection('articles')
    .find({
      $or: [
        { status: 'Published' },
        { status: 'published' },
        { status: 'Scheduled', scheduledAt: { $lte: new Date().toISOString() } }
      ]
    })
    .sort({ createdAt: -1 })
    .toArray();

  const allArticles = rawArticles.length > 0 
    ? serializeMongo((rawArticles as any[]).map(a => ({
        ...a,
        id: a._id ? a._id.toString() : a.id,
      })))
    : mockArticles;

  const featuredArticle = allArticles.find(a => a.featured) || allArticles[0];
  const articles = allArticles.filter(a => a.id !== featuredArticle.id);

  return (
    <div className="bg-background text-body min-h-screen py-8 md:py-12 transition-colors">
      <div className="container">
        <SectionHeader title={isBangla ? 'সর্বশেষ সংবাদ ও রিপোর্ট' : 'Latest News & Reports'} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            {/* Featured Story */}
            <div className="mb-12 border-b border-border pb-12">
              <NewsCard article={featuredArticle} layout="horizontal" locale={locale} />
            </div>

            {/* Article Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
              {articles.map(article => (
                <NewsCard key={article.id} article={article} locale={locale} />
              ))}
            </div>

            {/* Pagination UI */}
            <div className="flex items-center justify-center gap-2 border-t border-border pt-8">
              <button className="px-4 py-2 text-sm font-semibold text-caption hover:text-primary disabled:opacity-50" disabled>
                {isBangla ? 'পূর্ববর্তী' : 'Previous'}
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-primary text-white font-semibold rounded-lg">1</button>
              <button className="w-10 h-10 flex items-center justify-center hover:bg-surface font-semibold text-title rounded-lg">2</button>
              <button className="w-10 h-10 flex items-center justify-center hover:bg-surface font-semibold text-title rounded-lg">3</button>
              <span className="text-caption">...</span>
              <button className="w-10 h-10 flex items-center justify-center hover:bg-surface font-semibold text-title rounded-lg">8</button>
              <button className="px-4 py-2 text-sm font-semibold text-title hover:text-primary">
                {isBangla ? 'পরবর্তী' : 'Next'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-10">
            {/* Search Bar */}
            <div className="bg-card border border-border p-6 rounded-2xl">
              <h3 className="font-serif font-bold text-lg text-title border-b-2 border-primary pb-2 mb-4">
                {t('search')}
              </h3>
              <form className="relative" action={`/${locale}/search`}>
                <input 
                  type="text" 
                  name="q"
                  placeholder={isBangla ? 'আর্টিকেল অনুসন্ধান...' : 'Search articles...'} 
                  className="w-full bg-surface border border-border p-3 pr-10 text-sm text-title rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-caption/50"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-caption hover:text-primary">
                  <Search size={18} />
                </button>
              </form>
            </div>

            {/* Categories */}
            <div className="bg-card border border-border p-6 rounded-2xl">
              <h3 className="font-serif font-bold text-lg text-title border-b-2 border-primary pb-2 mb-4">
                {t('categories')}
              </h3>
              <ul className="flex flex-col gap-2">
                {categories.map(cat => (
                  <li key={cat.id}>
                    <Link href={`/${locale}/category/${cat.slug}`} className="text-caption hover:text-primary transition-colors flex justify-between items-center text-sm font-semibold py-1">
                      <span>{getLocalizedContent<string>(cat.name, locale)}</span>
                      <span className="text-caption text-xs bg-surface border border-border px-2.5 py-0.5 rounded-full">{Math.floor(Math.random() * 50) + 10}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trending */}
            <div className="bg-card border border-border p-6 rounded-2xl">
              <h3 className="font-serif font-bold text-lg text-title border-b-2 border-primary pb-2 mb-4">
                {isBangla ? 'ট্রেন্ডিং বিষয়' : 'Trending Topics'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {trendingTopics.map(topic => (
                  <Link 
                    key={topic} 
                    href={`/${locale}/search?q=${encodeURIComponent(topic)}`}
                    className="bg-surface border border-border text-title px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-primary hover:text-white transition-colors"
                  >
                    #{topic}
                  </Link>
                ))}
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
);
}
