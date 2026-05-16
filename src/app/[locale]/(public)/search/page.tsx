"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Article } from '@/lib/data';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { NewsCard } from '@/components/shared/NewsCard';
import { Search, Filter, SlidersHorizontal, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    async function fetchResults() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/articles?q=${encodeURIComponent(query)}&status=Published`);
        if (res.ok) {
          const data = await res.json();
          setArticles(data);
        }
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (query) {
      fetchResults();
    } else {
      setIsLoading(false);
    }
  }, [query]);

  const filteredArticles = activeFilter === 'all' 
    ? articles 
    : articles.filter(a => a.category.toLowerCase() === activeFilter.toLowerCase());

  const categories = ['All', ...Array.from(new Set(articles.map(a => a.category)))];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Search Header */}
      <div className="bg-surface border-b border-border py-12 mb-8">
        <div className="container">
          <div className="max-w-2xl">
            <p className="text-primary font-bold uppercase tracking-widest text-xs mb-3">Search Results</p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-title mb-6">
              {query ? `Showing results for "${query}"` : "Search The Reform Times"}
            </h1>
            
            <div className="flex flex-wrap gap-3">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat.toLowerCase())}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-semibold transition-all border",
                    activeFilter === cat.toLowerCase()
                      ? "bg-primary border-primary text-white"
                      : "bg-card border-border text-caption hover:border-primary hover:text-primary"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-caption animate-pulse">Searching the archives...</p>
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-3xl border border-border border-dashed">
            <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="text-caption" size={32} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-title mb-2">No results found</h3>
            <p className="text-caption max-w-md mx-auto">
              We couldn't find any articles matching your search. Try different keywords or browse our categories.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
