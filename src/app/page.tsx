import { mockArticles, trendingTopics, authors } from "@/lib/data";
import { HeroSection } from "@/components/home/HeroSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { NewsCard } from "@/components/shared/NewsCard";
import Image from "next/image";
import Link from "next/link";
import { PlayCircle, ShieldCheck } from "lucide-react";

export default function Home() {
  const latestNews = mockArticles.slice(0, 4);
  const advocacyNews = mockArticles.filter(a => a.category === 'Human Rights' || a.category === 'Environment').slice(0, 3);
  const investigations = mockArticles.filter(a => a.type === 'investigation').slice(0, 2);
  const factChecks = mockArticles.filter(a => a.type === 'fact-check').slice(0, 4);
  const videos = mockArticles.filter(a => a.type === 'video').slice(0, 3);
  const opinions = mockArticles.filter(a => a.type === 'opinion').slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />

      {/* Featured News Grid & Latest Feed */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <SectionHeader 
                title="Featured Reports" 
                linkText="All Reports" 
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
              <SectionHeader title="Latest Feed" />
              <div className="flex flex-col gap-6">
                {latestNews.map(article => (
                  <NewsCard key={article.id} article={article} layout="compact" />
                ))}
              </div>
            </div>
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
                <div className="relative w-full aspect-[16/9] overflow-hidden">
                  <Image 
                    src={article.image} 
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute top-4 left-4 bg-brand-red text-white text-[10px] font-bold uppercase px-3 py-1.5 tracking-widest flex items-center gap-2">
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
                      <Image src={article.author.avatar} alt={article.author.name} fill className="object-cover" />
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
                title="Fact Check Center" 
                linkText="More Fact Checks"
                linkHref="/fact-check"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {factChecks.map((article, i) => (
                  <Link key={article.id} href={`/news/${article.slug}`} className="group flex flex-col bg-brand-gray-light border border-gray-200 hover:border-brand-navy transition-colors">
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image 
                        src={article.image} 
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
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
                    <div className="p-5 flex-1 flex flex-col">
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
                <SectionHeader title="Trending Topics" />
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
                <SectionHeader title="Journalist Spotlight" />
                <div className="flex flex-col gap-4">
                  {authors.slice(0, 3).map(author => (
                    <div key={author.id} className="flex items-center gap-4 group cursor-pointer">
                      <div className="w-16 h-16 rounded-full overflow-hidden relative shrink-0 grayscale group-hover:grayscale-0 transition-all border-2 border-transparent group-hover:border-brand-red">
                        <Image src={author.avatar} alt={author.name} fill className="object-cover" />
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
                <Link href={`/news/${article.slug}`} className="block relative w-full aspect-video overflow-hidden">
                  <Image 
                    src={article.image} 
                    alt={article.title}
                    fill
                    className="object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center border border-white/30 group-hover:bg-brand-red group-hover:border-brand-red transition-colors">
                      <PlayCircle size={32} className="text-white" />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 border-t border-b border-gray-200 py-8">
            {opinions.map((article) => (
              <div key={article.id} className="flex flex-col group border-r border-gray-200 last:border-r-0 pr-8 last:pr-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden relative shrink-0">
                    <Image src={article.author.avatar} alt={article.author.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-brand-navy">{article.author.name}</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">{article.author.role}</p>
                  </div>
                </div>
                <Link href={`/news/${article.slug}`}>
                  <h3 className="font-serif font-bold text-xl leading-tight group-hover:text-brand-red transition-colors mb-4">
                    "{article.title}"
                  </h3>
                </Link>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4 italic">
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
