import { cookies } from "next/headers";
import { mockArticles, trendingTopics, authors, Article, banglaArticles } from "@/lib/data";
import { fetchRealNews } from "@/lib/api";
import { HeroSection } from "@/components/home/HeroSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { NewsCard } from "@/components/shared/NewsCard";
import { PlayCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const isBangla = locale === 'bn';

  const realNews = await fetchRealNews();
  const allArticles = [...realNews, ...mockArticles];
  
  // Smart merge: For every article in allArticles, check if there's a translated version in banglaArticles
  const sourceArticles = isBangla 
    ? allArticles.map(article => {
        const translated = banglaArticles.find(ba => ba.id === article.id || ba.slug === article.slug);
        if (translated) return translated;
        // Fallback for untranslated: keep article but mark for translation if needed
        return article;
      })
    : allArticles;
  
  const latestNews = sourceArticles.slice(0, 4);
  const advocacyNews = sourceArticles.filter(a => a.category === 'Human Rights' || a.category === 'Environment' || a.category === 'Advocacy').slice(0, 3);
  const investigations = sourceArticles.filter(a => a.type === 'investigation' || a.category === 'Investigations').slice(0, 2);
  const factChecks = sourceArticles.filter(a => a.type === 'fact-check' || a.category === 'Fact Check').slice(0, 4);
  const videos = sourceArticles.filter(a => a.type === 'video').slice(0, 3);
  const opinions = sourceArticles.filter(a => a.type === 'opinion' || a.category === 'Opinion').slice(0, 4);
  const bangladeshNews = isBangla ? banglaArticles : allArticles.slice(4, 8);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />

      {/* Featured News Grid & Latest Feed */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <SectionHeader 
                title={isBangla ? "ফিচারড রিপোর্ট" : "Featured Reports"} 
                linkText={isBangla ? "সব রিপোর্ট" : "All Reports"} 
                linkHref="/news" 
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {latestNews.slice(0, 2).map(article => (
                  <NewsCard key={article.id} article={article} />
                ))}
                <div className="md:col-span-2">
                  {latestNews.length > 2 && (
                    <NewsCard 
                      article={latestNews[2]} 
                      layout="horizontal" 
                      className="bg-brand-gray-light p-6"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <SectionHeader title={isBangla ? "লাইভ আপডেট" : "Latest Feed"} />
              <div className="flex flex-col gap-8 lg:col-span-1">
                {latestNews.slice(1).map((article, index) => (
                  <NewsCard key={article.id} article={article} layout="compact" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bangladesh / Bangla News Section */}
      <section className="bg-brand-gray-light py-16 md:py-24 border-t border-b border-gray-200">
        <div className="container max-w-6xl">
          <SectionHeader 
            title={isBangla ? "বাংলাদেশ" : "Bangladesh"} 
            subtitle={isBangla ? "জাতীয় রাজনীতি, অর্থনীতি ও সমাজের সর্বশেষ খবর" : "Latest news on national politics, economy and society"}
            linkText={isBangla ? "সব খবর পড়ুন" : "Read all news"}
            linkHref="/category/bangladesh"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 font-sans">
            {bangladeshNews.map(article => (
              <div key={article.id} className="flex flex-col group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-brand-red text-white text-[10px] font-bold px-2 py-1 tracking-wider rounded-sm shadow-md">
                    {article.category}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <a href={`/news/${article.slug}`}>
                    <h3 className="font-serif font-bold text-xl leading-snug group-hover:text-brand-red transition-colors mb-3">
                      {article.title}
                    </h3>
                  </a>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                    {article.excerpt}
                  </p>
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                    <span>{article.author.name}</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advocacy Journalism Section */}
      <section className="py-16 bg-brand-gray-light border-y border-gray-200">
        <div className="container">
          <SectionHeader 
            title="Human Rights & Justice" 
            subtitle="Deep dives into social justice, policy failures, and the stories of marginalized communities."
            linkText="Read More"
            linkHref="/category/human-rights"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {advocacyNews.map((article, i) => (
              <NewsCard 
                key={article.id} 
                article={article} 
                imageClassName={i === 0 ? "aspect-[3/4]" : "aspect-[4/3]"} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Investigative Reports */}
      <section className="py-16 bg-brand-navy text-white">
        <div className="container">
          <SectionHeader 
            title="Investigations" 
            subtitle="Exclusive reports uncovering corruption, fraud, and abuse of power."
            linkText="All Investigations"
            linkHref="/investigations"
            dark
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {investigations.map(article => (
              <div key={article.id} className="group flex flex-col gap-4">
                <div className="relative w-full aspect-[16/9] overflow-hidden rounded-xl">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute top-4 left-4 bg-brand-red text-white text-[10px] font-bold uppercase px-3 py-1.5 tracking-widest flex items-center gap-2 rounded-sm shadow-lg">
                    <ShieldCheck size={14} />
                    Exclusive Report
                  </div>
                </div>
                <div>
                  <span className="text-brand-gold text-xs font-bold uppercase tracking-widest mb-2 block">
                    {article.category}
                  </span>
                  <Link href={`/news/${article.slug}`}>
                    <h3 className="font-serif font-bold text-2xl md:text-3xl leading-tight group-hover:text-brand-red transition-colors mb-3">
                      {article.title}
                    </h3>
                  </Link>
                  <p className="text-gray-400 text-base line-clamp-3 mb-4">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-sm text-gray-300 font-medium border-t border-white/20 pt-4 mt-auto">
                    <div className="w-8 h-8 rounded-full overflow-hidden relative">
                      <img src={article.author.avatar} alt={article.author.name} className="w-full h-full object-cover" />
                    </div>
                    <span>{article.author.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fact Check Center & Trending */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <SectionHeader 
                title={isBangla ? "ফ্যাক্ট চেক" : "Fact Check Center"} 
                linkText={isBangla ? "সব ফ্যাক্ট চেক" : "More Fact Checks"}
                linkHref="/fact-check"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {factChecks.map((article, i) => (
                  <Link key={article.id} href={`/news/${article.slug}`} className="group flex flex-col bg-brand-gray-light border border-gray-200 hover:border-brand-navy hover:shadow-lg transition-all rounded-xl overflow-hidden">
                    <div className="relative h-48 w-full overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {article.factCheckStatus && (
                        <div className={`absolute bottom-0 left-0 text-white text-xs font-bold uppercase px-3 py-1.5 tracking-wider
                          ${article.factCheckStatus === 'Verified' ? 'bg-green-600' : ''}
                          ${article.factCheckStatus === 'False' ? 'bg-brand-red' : ''}
                          ${article.factCheckStatus === 'Misleading' ? 'bg-orange-500' : ''}
                          ${article.factCheckStatus === 'Under Review' ? 'bg-gray-600' : ''}
                        `}>
                          {article.factCheckStatus}
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col bg-white">
                      <h3 className="font-serif font-bold text-lg leading-tight group-hover:text-brand-red transition-colors mb-3">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mt-auto">
                        {article.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-12">
              <div>
                <SectionHeader title={isBangla ? "ট্রেন্ডিং টপিক" : "Trending Topics"} />
                <div className="flex flex-wrap gap-2">
                  {trendingTopics.map(topic => (
                    <Link 
                      key={topic} 
                      href={`/search?q=${encodeURIComponent(topic)}`}
                      className="bg-brand-gray-light border border-gray-200 text-brand-navy px-4 py-2 text-sm font-semibold hover:bg-brand-navy hover:text-white transition-colors rounded-sm"
                    >
                      #{topic}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <SectionHeader title={isBangla ? "সাংবাদিক পরিচিতি" : "Journalist Spotlight"} />
                <div className="flex flex-col gap-4">
                  {authors.slice(0, 3).map(author => (
                    <div key={author.id} className="flex items-center gap-4 group cursor-pointer bg-white p-4 border border-gray-100 hover:border-brand-red hover:shadow-md transition-all rounded-lg">
                      <div className="w-16 h-16 rounded-full overflow-hidden relative shrink-0 grayscale group-hover:grayscale-0 transition-all border-2 border-transparent group-hover:border-brand-red">
                        <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-navy group-hover:text-brand-red transition-colors">{author.name}</h4>
                        <p className="text-xs text-gray-500 mb-1">{author.role}</p>
                        <p className="text-xs text-gray-400 font-medium">{author.articleCount} Articles</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Journalism */}
      <section className="py-16 bg-black text-white">
        <div className="container">
          <SectionHeader 
            title="Video Journalism" 
            linkText="Watch More"
            linkHref="/video"
            dark
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {videos.length > 0 ? videos.map((article, i) => (
              <div key={article.id} className={`group ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                <Link href={`/news/${article.slug}`} className="block relative w-full aspect-video overflow-hidden rounded-xl border border-white/10 group-hover:border-brand-red transition-all shadow-2xl">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:bg-brand-red group-hover:border-brand-red transition-colors shadow-xl">
                      <PlayCircle size={32} className="text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 p-4 md:p-6 w-full bg-gradient-to-t from-black/90 to-transparent">
                    <span className="text-brand-gold text-[10px] font-bold uppercase tracking-widest mb-2 block">
                      {article.category} &bull; {article.readTime}
                    </span>
                    <h3 className={`font-serif font-bold text-white group-hover:text-brand-red transition-colors ${i === 0 ? 'text-2xl md:text-3xl' : 'text-lg'}`}>
                      {article.title}
                    </h3>
                  </div>
                </Link>
              </div>
            )) : (
              <div className="col-span-3 text-center py-12 text-gray-500">More videos coming soon.</div>
            )}
          </div>
        </div>
      </section>

      {/* Opinion & Editorial */}
      <section className="py-16 bg-white">
        <div className="container">
          <SectionHeader 
            title="Opinion & Editorial" 
            linkText="Read All Columns"
            linkHref="/opinion"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-8">
            {opinions.map((article) => (
              <div key={article.id} className="flex flex-col group bg-brand-gray-light p-6 rounded-xl border border-gray-100 hover:border-brand-navy hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                  <div className="w-12 h-12 rounded-full overflow-hidden relative shrink-0">
                    <img src={article.author.avatar} alt={article.author.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-brand-navy">{article.author.name}</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{article.author.role}</p>
                  </div>
                </div>
                <Link href={`/news/${article.slug}`}>
                  <h3 className="font-serif font-bold text-xl leading-tight group-hover:text-brand-red transition-colors mb-4">
                    "{article.title}"
                  </h3>
                </Link>
                <p className="text-gray-600 text-sm line-clamp-4 mb-4 italic leading-relaxed">
                  {article.excerpt}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-20 bg-gradient-to-br from-brand-navy to-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <div className="container relative z-10 max-w-4xl text-center">
          <h2 className="font-serif font-bold text-4xl md:text-5xl mb-4">Get Truth Delivered Weekly</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join 50,000+ readers who rely on our investigative journalism. No spam, just the stories that matter.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 bg-white/10 border border-white/20 text-white px-6 py-4 focus:outline-none focus:border-brand-red transition-colors rounded-sm text-lg"
              required
            />
            <button 
              type="submit"
              className="bg-brand-red text-white px-8 py-4 font-bold text-lg hover:bg-white hover:text-brand-red transition-colors rounded-sm whitespace-nowrap"
            >
              Subscribe Now
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-4">
            By subscribing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </section>

    </div>
  );
}
