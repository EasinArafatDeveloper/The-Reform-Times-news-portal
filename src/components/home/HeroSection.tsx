import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import { mockArticles } from "@/lib/data";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { NewsCard } from "@/components/shared/NewsCard";

export function HeroSection() {
  const featuredArticle = mockArticles.find(a => a.featured) || mockArticles[0];
  const sideArticles = mockArticles.filter(a => !a.featured).slice(0, 3);

  return (
    <section className="py-8 md:py-12 border-b border-gray-200">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Hero Story */}
          <div className="lg:col-span-8 group">
            <Link href={`/news/${featuredArticle.slug}`} className="block relative w-full aspect-[16/10] md:aspect-[16/9] lg:aspect-[4/3] overflow-hidden mb-6">
              <Image 
                src={featuredArticle.image} 
                alt={featuredArticle.title}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 p-6 md:p-8 md:w-4/5 text-white">
                <CategoryBadge category={featuredArticle.category} className="text-brand-gold mb-4" />
                <h1 className="font-serif font-bold text-3xl md:text-5xl leading-tight mb-4">
                  {featuredArticle.title}
                </h1>
                <p className="text-gray-200 text-sm md:text-base line-clamp-2 md:line-clamp-3 mb-6 max-w-2xl">
                  {featuredArticle.excerpt}
                </p>
                
                <div className="flex items-center gap-4 text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden relative">
                      <Image src={featuredArticle.author.avatar} alt={featuredArticle.author.name} fill className="object-cover" />
                    </div>
                    <span>{featuredArticle.author.name}</span>
                  </div>
                  <span className="text-gray-400">&bull;</span>
                  <span className="text-gray-300">{format(new Date(featuredArticle.date), 'MMMM d, yyyy')}</span>
                  <span className="text-gray-400">&bull;</span>
                  <span className="text-gray-300">{featuredArticle.readTime}</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Sidebar Stories */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b-2 border-brand-navy pb-2 mb-2">
              <h2 className="font-serif font-bold text-xl text-brand-navy uppercase tracking-wide">Top Stories</h2>
              <Link href="/news" className="text-brand-red text-sm font-semibold hover:underline">View All</Link>
            </div>
            
            <div className="flex flex-col gap-6">
              {sideArticles.map((article, index) => (
                <div key={article.id} className={index !== sideArticles.length - 1 ? "border-b border-gray-100 pb-6" : ""}>
                  <CategoryBadge category={article.category} />
                  <Link href={`/news/${article.slug}`} className="group">
                    <h3 className="font-serif font-bold text-xl leading-snug group-hover:text-brand-red transition-colors mb-2">
                      {article.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                    <span>{format(new Date(article.date), 'MMM d, yyyy')}</span>
                    <span>&bull;</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-6">
              <Link 
                href="/subscribe" 
                className="flex items-center justify-between w-full bg-brand-gray-light p-4 border border-gray-200 hover:border-brand-red transition-colors group"
              >
                <div>
                  <h4 className="font-bold text-brand-navy text-sm mb-1">Support Investigative Journalism</h4>
                  <p className="text-xs text-gray-600">Subscribe for unlimited access.</p>
                </div>
                <ArrowRight size={20} className="text-brand-red transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
