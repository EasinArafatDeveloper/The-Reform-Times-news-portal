import clientPromise from "@/lib/mongodb";
import { mockArticles, trendingTopics, authors } from "@/lib/data";
import { fetchRealNews } from "@/lib/api";
import { HeroSection } from "@/components/home/HeroSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { NewsCard } from "@/components/shared/NewsCard";
import { PlayCircle, ShieldCheck, ArrowRight, TrendingUp, Search, User, CheckCircle2, MessageSquareQuote, Clock, Users, Globe, TrendingDown } from "lucide-react";
import Link from "next/link";
import { cn, serializeMongo } from "@/lib/utils";
import { format } from "date-fns";
import { bn as bnLocale } from "date-fns/locale";
import { getLocalizedContent, getTranslation } from "@/lib/i18n-utils";
import SubscribeForm from "@/components/shared/SubscribeForm";

export default async function Home({
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
    .find({ status: 'Published' })
    .sort({ createdAt: -1 })
    .toArray();

  const allArticles = rawArticles.length > 0 
    ? serializeMongo((rawArticles as any[]).map(a => ({
        ...a,
        id: a._id ? a._id.toString() : a.id,
      })))
    : mockArticles;

  // Fetch dynamic journalists from database with real story counts
  const rawJournalists = await db.collection('journalists').find({}).toArray();
  const dbJournalists = rawJournalists.length > 0 
    ? serializeMongo(rawJournalists) 
    : [];

  const displayAuthors = dbJournalists.length > 0
    ? await Promise.all(dbJournalists.map(async (j: any) => {
        const count = await db.collection('articles').countDocuments({ 
          $or: [
            { 'author.name': j.name },
            { 'authorId': j.id || j._id?.toString() }
          ],
          status: 'Published'
        });
        return {
          id: j.id || j._id?.toString(),
          name: j.name,
          role: j.role,
          bio: j.bio,
          avatar: j.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          articleCount: count || 0
        };
      }))
    : authors;
  
  const latestNews = allArticles.slice(0, 8);
  const investigations = allArticles.filter(a => 
    ['investigation', 'Investigation'].includes(a.type) || 
    ['investigations', 'Investigations'].includes(a.category)
  ).slice(0, 3);
  const factChecks = allArticles.filter(a => 
    ['fact-check', 'Fact Check'].includes(a.type) || 
    ['fact-check', 'Fact Check'].includes(a.category)
  ).slice(0, 4);
  const opinions = allArticles.filter(a => 
    ['opinion', 'Opinion'].includes(a.type) || 
    ['opinions', 'Opinions', 'opinion', 'Opinion'].includes(a.category)
  ).slice(0, 4);
  const bangladeshNews = allArticles.filter(a => 
    ['national', 'politics', 'bangladesh', 'National', 'Politics', 'Bangladesh'].includes(a.category)
  ).slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Trending Ticker */}
      <div className="bg-surface border-b border-border py-3 overflow-hidden">
        <div className="container flex items-center gap-4">
          <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-[0.2em] whitespace-nowrap bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            <TrendingUp size={14} />
            {t('trending')}
          </div>
          <div className="flex items-center gap-8 animate-scroll">
            {trendingTopics.map((topic, i) => (
              <Link 
                key={i} 
                href={`/${locale}/search?q=${topic}`}
                className="text-xs font-bold text-caption hover:text-primary transition-colors whitespace-nowrap"
              >
                #{topic}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <HeroSection locale={locale} />

      {/* Editorial Dashboard - Major News Feed */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Primary Column - Featured Analysis */}
            <div className="lg:col-span-8">
              <SectionHeader 
                title={isBangla ? "ফিচারড রিপোর্ট" : "Featured Reports"} 
                linkText={isBangla ? "সব রিপোর্ট" : "All Reports"} 
                linkHref={`/${locale}/news`} 
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {latestNews.slice(0, 2).map(article => (
                  <NewsCard key={article.id} article={article} locale={locale} />
                ))}
              </div>
              
              <div className="space-y-6">
                {latestNews.slice(2, 5).map(article => (
                  <NewsCard 
                    key={article.id} 
                    article={article} 
                    locale={locale}
                    layout="horizontal" 
                    className="border-b border-border pb-6 last:border-0 hover:bg-surface/30 p-4 -mx-4"
                  />
                ))}
              </div>
            </div>

            {/* Side Column - Live Stream & Trending */}
            <div className="lg:col-span-4">
              <div className="sticky top-24">
                <SectionHeader title={isBangla ? "লাইভ আপডেট" : "Latest Updates"} />
                <div className="flex flex-col gap-1 bg-surface/50 border border-border rounded-2xl p-4 mb-10">
                  {latestNews.slice(3, 8).map((article) => (
                    <NewsCard key={article.id} article={article} locale={locale} layout="compact" />
                  ))}
                  <Link href={`/${locale}/news`} className="flex items-center justify-center gap-2 py-4 text-xs font-black uppercase tracking-widest text-primary hover:bg-surface rounded-xl transition-all mt-2">
                    {isBangla ? 'আরও সংবাদ' : 'More from Latest Feed'}
                    <ArrowRight size={14} />
                  </Link>
                </div>

                {/* Newsletter Micro-widget */}
                <div className="bg-primary text-white p-8 rounded-3xl relative overflow-hidden shadow-xl shadow-primary/20">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <h3 className="text-xl font-serif font-bold mb-3 relative z-10">
                    {isBangla ? 'সত্যের জয় অনিবার্য' : 'Truth Matters.'}
                  </h3>
                  <p className="text-white/80 text-sm mb-6 relative z-10 leading-relaxed">
                    {isBangla 
                      ? 'প্রতি সপ্তাহে আমাদের সেরা অনুসন্ধানগুলো পেতে ৪৫,০০০+ পাঠকের সাথে যোগ দিন।' 
                      : 'Join 45,000+ readers getting our top investigations every week.'}
                  </p>
                  <SubscribeForm locale={locale} variant="sidebar" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bangladesh Editorial Block - Rich Multi-column */}
      <section className="bg-surface py-20 border-t border-b border-border">
        <div className="container">
          <SectionHeader 
            title={isBangla ? "বাংলাদেশ সংবাদ" : "National: Bangladesh"} 
            subtitle={isBangla ? "দেশজুড়ে ঘটে যাওয়া রাজনীতির নেপথ্যের গল্প" : "Uncovering the stories that shape our nation"}
            linkText={isBangla ? "সব খবর" : "Explore National"}
            linkHref={`/${locale}/category/bangladesh`}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Feature Slot */}
            <div className="lg:col-span-5">
              <NewsCard article={bangladeshNews[0]} locale={locale} layout="featured" className="h-full min-h-[400px]" />
            </div>
            
            {/* Grid Slot */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
              {bangladeshNews.slice(1, 5).map(article => (
                <NewsCard key={article.id} article={article} locale={locale} layout="vertical" className="bg-card" />
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Fact Check Verification Center - Compact Dashboard Style */}
      <section className="py-16 bg-background relative overflow-hidden border-b border-border/50">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shadow-inner shrink-0">
                <ShieldCheck size={32} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-title">{t('factCheck')}</h2>
                <p className="text-caption max-w-xl text-base mt-1">
                  {isBangla 
                    ? 'কঠোর যাচাইকরণ এবং শনাক্তযোগ্য প্রমাণের মাধ্যমে ভুল তথ্যের মোকাবিলা করা।' 
                    : 'Combatting misinformation through rigorous verification and traceable evidence.'}
                </p>
              </div>
            </div>
            <Link href={`/${locale}/fact-check`} className="inline-flex items-center gap-3 bg-surface border border-border px-8 py-3.5 rounded-xl font-bold text-title hover:border-primary hover:text-primary transition-all group shrink-0">
              {isBangla ? 'সব ভেরিফিকেশন দেখুন' : 'View All Verifications'}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {factChecks.map((article, i) => (
              <div key={article.id} className="relative group">
                <div className={cn(
                  "absolute top-0 left-0 w-full h-1 z-20",
                  i % 3 === 0 ? "bg-green-500" : i % 3 === 1 ? "bg-red-500" : "bg-amber-500"
                )}></div>
                <NewsCard 
                  article={article} 
                  locale={locale}
                  className="rounded-t-none border-t-0 shadow-sm hover:shadow-lg transition-shadow"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Opinion & Editorial - Elegant Magazine Layout */}
      <section className="py-24 bg-surface/50 border-t border-b border-border">
        <div className="container">
          <SectionHeader 
            title={t('opinion')} 
            subtitle={isBangla ? "ভবিষ্যত নির্ধারক ইস্যুগুলোতে বৈচিত্র্যময় দৃষ্টিভঙ্গি" : "Diverse perspectives on the issues defining our future"}
            linkText={isBangla ? "সব মতামত দেখুন" : "View All Perspectives"}
            linkHref={`/${locale}/category/opinion`}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {opinions.slice(0, 3).map((article, i) => (
              <div key={article.id} className={cn(
                "group p-8 rounded-3xl transition-all shadow-sm hover:shadow-premium border",
                i === 0 
                  ? "bg-secondary text-white lg:col-span-1 shadow-2xl border-transparent" 
                  : "bg-card border-border text-body"
              )}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/30 p-0.5 group-hover:border-primary transition-all">
                    <img src={article.author.avatar} alt={article.author.name} className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div>
                    <h4 className={cn("font-bold text-lg", i === 0 ? "text-white" : "text-title")}>{article.author.name}</h4>
                    <p className={cn("text-[10px] font-black uppercase tracking-[0.2em]", i === 0 ? "text-red-400" : "text-primary")}>
                      {getLocalizedContent<string>(article.author.role, locale)}
                    </p>
                  </div>
                </div>
                <Link href={`/${locale}/news/${getLocalizedContent<string>(article.slug, locale)}`}>
                  <h3 className={cn("font-serif font-bold text-2xl leading-tight mb-6 group-hover:text-primary transition-colors", i === 0 ? "text-white" : "text-title")}>
                    "{getLocalizedContent<string>(article.title, locale)}"
                  </h3>
                </Link>
                <p className={cn("text-sm line-clamp-4 leading-relaxed italic mb-8 opacity-80", i === 0 ? "text-white/80" : "text-caption")}>
                  {getLocalizedContent<string>(article.excerpt, locale)}
                </p>
                <div className={cn("flex items-center justify-between pt-6 border-t", i === 0 ? "border-white/10" : "border-border")}>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                    {format(new Date(article.createdAt || article.publishedAt || article.date || new Date()), isBangla ? 'd MMMM, yyyy' : 'MMMM d, yyyy', { 
                      locale: isBangla ? bnLocale : undefined 
                    })}
                  </span>
                  <MessageSquareQuote size={20} className={cn(i === 0 ? "text-white/50" : "text-primary opacity-50")} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journalist Spotlight - Modern Newsroom Team */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-title mb-4">{t('journalists')}</h2>
              <p className="text-caption text-lg max-w-2xl">
                {isBangla 
                  ? 'আমাদের রিপোর্টিংয়ের নেপথ্যে থাকা পুরস্কারপ্রাপ্ত সাংবাদিক, ডেটা অ্যানালিস্ট এবং গবেষকবৃন্দ।' 
                  : 'The award-winning journalists, data analysts, and researchers behind our reporting.'}
              </p>
            </div>
            <div className="flex gap-4">
               <div className="bg-surface px-6 py-3 rounded-full border border-border text-title font-bold text-sm flex items-center gap-2">
                 <Users size={18} className="text-primary" />
                 {isBangla 
                   ? `${displayAuthors.length} জন সাংবাদিক` 
                   : `${displayAuthors.length} ${displayAuthors.length === 1 ? 'Journalist' : 'Journalists'}`}
               </div>
               <div className="bg-surface px-6 py-3 rounded-full border border-border text-title font-bold text-sm flex items-center gap-2">
                 <Globe size={18} className="text-primary" />
                 {isBangla 
                   ? `${Math.max(1, Math.ceil(displayAuthors.length * 0.5))}টি ব্যুরো` 
                   : `${Math.max(1, Math.ceil(displayAuthors.length * 0.5))} ${Math.max(1, Math.ceil(displayAuthors.length * 0.5)) === 1 ? 'Bureau' : 'Bureaus'}`}
               </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayAuthors.slice(0, 4).map((author) => (
              <div key={author.id} className="group relative">
                <div className="bg-card rounded-[2.5rem] p-8 border border-border/50 hover:border-primary transition-all duration-500 hover:shadow-premium group-hover:-translate-y-2 overflow-hidden">
                  {/* Decorative element */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[4rem] group-hover:bg-primary/10 transition-colors"></div>
                  
                  <div className="relative w-28 h-28 mb-8 mx-auto md:mx-0">
                    <img src={author.avatar} alt={author.name} className="w-full h-full rounded-[2rem] object-cover border-4 border-white shadow-xl relative z-10" />
                    <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-xl z-20 shadow-lg scale-90 group-hover:scale-100 transition-transform">
                      <CheckCircle2 size={16} />
                    </div>
                  </div>
                  
                  <div className="text-center md:text-left">
                    <h4 className="font-serif font-bold text-2xl text-title mb-1">{author.name}</h4>
                    <p className="text-xs text-primary font-black uppercase tracking-[0.2em] mb-6">
                      {getLocalizedContent<string>(author.role, locale)}
                    </p>
                    <p className="text-caption text-sm leading-relaxed line-clamp-3 mb-8 min-h-[4.5rem]">
                      {getLocalizedContent<string>(author.bio, locale)}
                    </p>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-border">
                      <div className="flex flex-col">
                        <span className="text-xl font-black text-title">{author.articleCount}</span>
                        <span className="text-[10px] text-caption uppercase font-bold tracking-widest">
                          {isBangla ? 'গল্প' : 'Stories'}
                        </span>
                      </div>
                      <Link href={`/${locale}/author/${author.id}`} className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-title hover:bg-primary hover:text-white transition-all">
                        <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription / Membership Section - Compact Premium CTA */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="relative bg-[#0F172A] rounded-[2.5rem] p-10 md:p-14 overflow-hidden shadow-2xl">
            {/* Abstract Background Accents */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/10 to-transparent"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/10 mb-6 backdrop-blur-md">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                  <span className="text-white text-[9px] font-black uppercase tracking-[0.2em]">
                    {isBangla ? 'স্বতন্ত্র সাংবাদিকতা' : 'Independent Journalism'}
                  </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
                  {isBangla 
                    ? <>স্বতন্ত্র সাংবাদিকতায় অবদান রাখুন যা <br/><span className="text-primary italic text-2xl md:text-4xl">পরিবর্তন আনে।</span></>
                    : <>Invest in journalism that <br/><span className="text-primary italic text-2xl md:text-4xl">makes a difference.</span></>
                  }
                </h2>
                <p className="text-white/60 text-base md:text-lg mb-8 leading-relaxed max-w-xl">
                  {t('readerFunded')}
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
                  <Link href={`/${locale}/subscribe`} className="bg-primary text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-red-700 transition-all shadow-lg">
                    {t('becomeMember')}
                  </Link>
                  <Link href={`/${locale}/about`} className="text-white/80 font-bold border-b border-white/10 hover:border-primary hover:text-white transition-all pb-1 text-sm flex items-center gap-2 group">
                    {isBangla ? 'আমাদের মডেল সম্পর্কে জানুন' : 'Learn about our model'}
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
              
              {/* Compact Trust Indicators */}
              <div className="flex flex-row lg:flex-col gap-4 w-full lg:w-64">
                <div className="flex-1 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
                  <ShieldCheck className="text-primary mb-2" size={24} />
                  <h4 className="text-white text-sm font-bold">{isBangla ? 'ভেরিফাইড কন্টেন্ট' : 'Verified Content'}</h4>
                </div>
                <div className="flex-1 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm lg:translate-x-4">
                  <Globe className="text-primary mb-2" size={24} />
                  <h4 className="text-white text-sm font-bold">{isBangla ? 'গ্লোবাল ইমপ্যাক্ট' : 'Global Impact'}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
