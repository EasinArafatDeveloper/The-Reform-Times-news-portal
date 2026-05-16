import Link from "next/link";
import { format } from "date-fns";
import { bn as bnLocale } from "date-fns/locale";
import { ArrowRight, Clock } from "lucide-react";
import { mockArticles } from "@/lib/data";
import { fetchRealNews } from "@/lib/api";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { NewsCard } from "@/components/shared/NewsCard";
import { getLocalizedContent, getTranslation } from "@/lib/i18n-utils";

export async function HeroSection({ locale = 'bn' }: { locale?: string }) {
  const isBangla = locale === 'bn';
  const t = (key: string) => getTranslation(locale, key);

  const realNews = await fetchRealNews();
  const allArticles = Array.isArray(realNews) && realNews.length > 0 ? realNews : mockArticles;
  
  const featuredArticle = allArticles.find(a => a.isFeatured || a.featured) || allArticles[0];
  const sideArticles = allArticles.filter(a => (a._id || a.id) !== (featuredArticle._id || featuredArticle.id)).slice(0, 4);

  if (!featuredArticle) return null;

  const title = getLocalizedContent<string>(featuredArticle.title, locale);
  const excerpt = getLocalizedContent<string>(featuredArticle.excerpt, locale);
  const category = getLocalizedContent<string>(featuredArticle.category, locale);
  const slug = getLocalizedContent<string>(featuredArticle.slug, locale);
  const readTime = getLocalizedContent<string>(featuredArticle.readTime || "", locale);

  const formattedDate = format(new Date(featuredArticle.createdAt || featuredArticle.date), isBangla ? 'd MMMM, yyyy' : 'MMMM d, yyyy', {
    locale: isBangla ? bnLocale : undefined
  });

  return (
    <section className="py-6 md:py-10 border-b border-border bg-background relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 bg-grid-subtle opacity-40 pointer-events-none"></div>
      
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Main Hero Story - Large & Powerful */}
          <div className="lg:col-span-8 group">
            <Link href={`/${locale}/news/${slug}`} className="block relative w-full aspect-[16/9] md:aspect-[16/8.5] overflow-hidden rounded-3xl shadow-premium border border-border/50">
              <img 
                src={featuredArticle.mainImage || featuredArticle.image} 
                alt={title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              {/* Cinematic Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 p-6 md:p-12 md:w-11/12">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-primary text-white text-[10px] md:text-[11px] font-black uppercase px-3 py-1 tracking-[0.2em] rounded-sm shadow-lg">
                    {isBangla ? "ফিচারড স্টোরি" : "Featured Story"}
                  </span>
                  <CategoryBadge category={category} className="text-white mb-0 border-l border-white/20 pl-3 py-0.5" />
                </div>

                <h1 className="font-serif font-bold text-3xl md:text-5xl lg:text-6xl leading-[1.1] mb-4 text-white group-hover:text-primary transition-colors duration-500">
                  {title}
                </h1>
                
                <p className="text-white/80 text-sm md:text-lg line-clamp-2 mb-8 max-w-3xl leading-relaxed font-sans">
                  {excerpt}
                </p>
                
                <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-white/60 border-t border-white/10 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/50 p-0.5">
                      <img src={featuredArticle.author.avatar} alt={featuredArticle.author.name} className="w-full h-full object-cover rounded-full" />
                    </div>
                    <span className="text-white tracking-normal">{featuredArticle.author.name}</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-2">
                    <Clock size={14} className="text-primary" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                    <span>{readTime || (isBangla ? '৫ মিনিট পাঠ' : '5 min read')}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Sidebar - High Density Editorial Grid */}
          <div className="lg:col-span-4 flex flex-col h-full">
            <div className="flex items-center justify-between border-b-2 border-primary pb-3 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-6 bg-primary rounded-full"></div>
                <h2 className="font-serif font-bold text-2xl text-title tracking-tight">{isBangla ? "শীর্ষ সংবাদ" : "Top Stories"}</h2>
              </div>
              <Link href={`/${locale}/news`} className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-1 group/link">
                {isBangla ? "সব দেখুন" : "View All"}
                <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="flex flex-col gap-6 flex-1">
              {sideArticles.map((article) => (
                <NewsCard 
                  key={article.id} 
                  article={article} 
                  locale={locale}
                  layout="compact" 
                  className="hover:translate-x-1 transition-transform duration-300"
                />
              ))}
            </div>

            {/* Premium Support Ticker */}
            <div className="mt-8 pt-6 border-t border-border/50">
              <Link 
                href={`/${locale}/subscribe`} 
                className="flex items-center justify-between w-full bg-surface p-5 rounded-2xl border border-border hover:border-primary transition-all duration-300 group shadow-sm hover:shadow-md"
              >
                <div>
                  <h4 className="font-bold text-title text-sm mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    {isBangla ? 'স্বতন্ত্র সংবাদকে সমর্থন করুন' : 'Support Independent Truth'}
                  </h4>
                  <p className="text-xs text-caption">
                    {isBangla ? 'এক্সক্লুসিভ অনুসন্ধানমূলক রিপোর্টের জন্য সাবস্ক্রাইব করুন।' : 'Subscribe for exclusive investigative reports.'}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <ArrowRight size={18} />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
