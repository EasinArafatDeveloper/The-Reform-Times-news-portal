import clientPromise from "@/lib/mongodb";
import { mockArticles } from "@/lib/data";
import { fetchRealNews } from "@/lib/api";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getTranslation } from "@/lib/i18n-utils";
import HeroSlider from "./HeroSlider";
import { NewsCard } from "@/components/shared/NewsCard";
import { serializeMongo } from "@/lib/utils";

export async function HeroSection({ locale = 'bn' }: { locale?: string }) {
  const isBangla = locale === 'bn';
  const t = (key: string) => getTranslation(locale, key);

  const client = await clientPromise;
  const db = client.db('the-reform-times-news');
  const rawArticles = await db.collection('articles')
    .find({ status: 'Published' })
    .sort({ createdAt: -1 })
    .toArray();

  const allArticles = rawArticles.length > 0 
    ? serializeMongo((rawArticles as any[]).map(a => ({
        ...a,
        id: a._id ? a._id.toString() : a.id,
      })))
    : mockArticles;
  
  // Get multiple featured articles for the slider
  const featuredArticles = allArticles.filter(a => a.featured).slice(0, 5);
  if (featuredArticles.length === 0) {
    featuredArticles.push(...allArticles.slice(0, 5));
  }
  
  const sideArticles = allArticles.filter(a => !featuredArticles.find(f => f.id === a.id)).slice(0, 4);

  return (
    <section className="py-6 md:py-10 border-b border-border bg-background relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 bg-grid-subtle opacity-40 pointer-events-none"></div>
      
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Main Hero Slider */}
          <div className="lg:col-span-8">
            <HeroSlider articles={featuredArticles} locale={locale} />
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
