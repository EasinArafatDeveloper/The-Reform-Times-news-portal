import { mockArticles, categories, trendingTopics } from "@/lib/data";
import { NewsCard } from "@/components/shared/NewsCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import Link from "next/link";
import { Search } from "lucide-react";

export const metadata = {
  title: "Latest News | The Reform Times",
  description: "Browse the latest news, investigations, and reports from The Reform Times.",
};

export default function NewsListingPage() {
  const featuredArticle = mockArticles.find(a => a.featured) || mockArticles[0];
  const articles = mockArticles.filter(a => a.id !== featuredArticle.id);

  return (
    <div className="bg-white min-h-screen py-8 md:py-12">
      <div className="container">
        <SectionHeader title="Latest News & Reports" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            {/* Featured Story */}
            <div className="mb-12 border-b border-gray-200 pb-12">
              <NewsCard article={featuredArticle} layout="horizontal" />
            </div>

            {/* Article Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
              {articles.map(article => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>

            {/* Pagination UI */}
            <div className="flex items-center justify-center gap-2 border-t border-gray-200 pt-8">
              <button className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-brand-navy disabled:opacity-50" disabled>Previous</button>
              <button className="w-10 h-10 flex items-center justify-center bg-brand-navy text-white font-semibold">1</button>
              <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 font-semibold text-brand-navy">2</button>
              <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 font-semibold text-brand-navy">3</button>
              <span className="text-gray-400">...</span>
              <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 font-semibold text-brand-navy">8</button>
              <button className="px-4 py-2 text-sm font-semibold text-brand-navy hover:text-brand-red">Next</button>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-10">
            {/* Search Bar */}
            <div>
              <h3 className="font-serif font-bold text-lg border-b-2 border-brand-navy pb-2 mb-4">Search</h3>
              <form className="relative">
                <input 
                  type="text" 
                  placeholder="Search articles..." 
                  className="w-full border border-gray-300 p-3 pr-10 text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-red">
                  <Search size={18} />
                </button>
              </form>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-serif font-bold text-lg border-b-2 border-brand-navy pb-2 mb-4">Categories</h3>
              <ul className="flex flex-col gap-2">
                {categories.map(cat => (
                  <li key={cat.id}>
                    <Link href={`/category/${cat.slug}`} className="text-gray-600 hover:text-brand-red transition-colors flex justify-between items-center text-sm font-medium py-1">
                      <span>{cat.name}</span>
                      {/* Random count for mockup */}
                      <span className="text-gray-400 text-xs bg-gray-100 px-2 py-0.5 rounded-full">{Math.floor(Math.random() * 50) + 10}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trending */}
            <div>
              <h3 className="font-serif font-bold text-lg border-b-2 border-brand-navy pb-2 mb-4">Trending Topics</h3>
              <div className="flex flex-wrap gap-2">
                {trendingTopics.map(topic => (
                  <Link 
                    key={topic} 
                    href={`/search?q=${encodeURIComponent(topic)}`}
                    className="bg-brand-gray-light border border-gray-200 text-brand-navy px-3 py-1.5 text-xs font-semibold hover:bg-brand-navy hover:text-white transition-colors"
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
