import { mockArticles, banglaArticles } from "@/lib/data";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { cookies } from "next/headers";
import { Link as LinkIcon, Mail } from "lucide-react";
import { TwitterIcon, FacebookIcon, LinkedinIcon } from "@/components/ui/icons";
import Link from "next/link";
import { NewsCard } from "@/components/shared/NewsCard";
import { ReadingProgressBar } from "@/components/ui/ReadingProgressBar";
import { uiTranslations } from "@/lib/data";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const allArticles = [...mockArticles, ...banglaArticles];
  const article = allArticles.find(a => a.slug === resolvedParams.slug);
  if (!article) return { title: 'Article Not Found' };

  return {
    title: `${article.title} | The Reform Times`,
    description: article.excerpt,
  };
}

export default async function NewsDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const isBangla = locale === 'bn';
  const t = uiTranslations[locale as keyof typeof uiTranslations] || uiTranslations.en;

  const resolvedParams = await params;
  const allArticles = [...mockArticles, ...banglaArticles];
  const article = allArticles.find(a => a.slug === resolvedParams.slug);
  
  if (!article) {
    notFound();
  }

  const relatedArticles = allArticles.filter(a => a.category === article.category && a.id !== article.id).slice(0, 3);

  return (
    <div className="bg-white">
      <ReadingProgressBar />
      
      {/* Immersive Hero Header */}
      <div className="relative w-full h-[60vh] md:h-[75vh] min-h-[500px] bg-black">
        <img 
          src={article.image} 
          alt={article.title}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full">
          <div className="container max-w-5xl pb-12 md:pb-16 px-4 md:px-8">
            <span className="inline-block bg-brand-red text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 mb-6 rounded-sm">
              {article.category}
            </span>
            <h1 className="font-serif font-bold text-4xl md:text-5xl lg:text-7xl leading-[1.1] text-white mb-6 text-balance shadow-sm">
              {article.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 font-serif mb-8 leading-relaxed italic max-w-4xl text-balance">
              {article.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300 font-medium">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden relative border-2 border-white/20">
                  <img src={article.author.avatar} alt={article.author.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-white font-bold text-base">{article.author.name}</p>
                  <p className="text-xs uppercase tracking-wider text-brand-gold">{article.author.role}</p>
                </div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/20"></div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <p>{format(new Date(article.date), 'MMMM d, yyyy')}</p>
                <span className="hidden sm:inline">&bull;</span>
                <p>{article.readTime}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-5xl py-16 px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left Sidebar - Social Share */}
          <div className="lg:w-16 shrink-0 order-2 lg:order-1 flex lg:flex-col items-center gap-4 lg:sticky lg:top-32 h-fit border-t lg:border-t-0 border-gray-200 pt-8 lg:pt-0">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest lg:-rotate-90 lg:mb-6 whitespace-nowrap">
              {isBangla ? "শেয়ার করুন" : "Share Story"}
            </span>
            <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand-red hover:bg-red-50 hover:text-brand-red transition-all"><TwitterIcon width={18} height={18} /></button>
            <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand-red hover:bg-red-50 hover:text-brand-red transition-all"><FacebookIcon width={18} height={18} /></button>
            <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand-red hover:bg-red-50 hover:text-brand-red transition-all"><LinkedinIcon width={18} height={18} /></button>
            <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand-red hover:bg-red-50 hover:text-brand-red transition-all"><Mail size={18} /></button>
            <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand-red hover:bg-red-50 hover:text-brand-red transition-all"><LinkIcon size={18} /></button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 order-1 lg:order-2">
            <article className="prose prose-lg md:prose-xl lg:prose-2xl prose-stone max-w-none 
              prose-headings:font-serif prose-headings:text-brand-navy prose-headings:font-bold
              prose-p:leading-[1.9] prose-p:text-gray-800 prose-p:mb-8
              prose-a:text-brand-red hover:prose-a:text-brand-navy prose-a:font-semibold prose-a:underline-offset-4
              prose-blockquote:border-l-4 prose-blockquote:border-brand-red prose-blockquote:pl-6 prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:text-brand-navy
              first-letter:text-7xl first-letter:font-serif first-letter:font-bold first-letter:text-brand-red first-letter:mr-3 first-letter:float-left first-letter:leading-none
              mb-16">
              <div dangerouslySetInnerHTML={{ __html: article.content || `<p>This is a placeholder for the article content. In a real application, this would be rich HTML or Markdown parsed content.</p><p>The Reform Times is dedicated to bringing you the truth.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p><blockquote>"Freedom of the press is not just important to democracy, it is democracy."</blockquote><p>We believe that a well-informed public is the foundation of a just society.</p>` }} />
            </article>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-3 border-t border-gray-200 pt-8 mb-16">
              <span className="font-bold text-sm uppercase tracking-wider text-brand-navy">Topics:</span>
              {article.tags.map(tag => (
                <Link key={tag} href={`/search?q=${tag}`} className="bg-gray-100 text-gray-700 px-4 py-1.5 text-sm font-semibold hover:bg-brand-navy hover:text-white transition-colors rounded-sm">
                  {tag}
                </Link>
              ))}
            </div>

            {/* Elegant Author Bio Box */}
            <div className="border-t-4 border-brand-navy pt-8 flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-8">
              <div className="w-28 h-28 rounded-full overflow-hidden relative shrink-0 grayscale hover:grayscale-0 transition-all duration-500 shadow-md">
                <img src={article.author.avatar} alt={article.author.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-center sm:text-left flex-1">
                <h4 className="font-serif font-bold text-3xl text-brand-navy mb-2">{article.author.name}</h4>
                <p className="text-sm uppercase tracking-widest text-brand-red font-bold mb-4">{article.author.role}</p>
                <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-4 font-serif italic">
                  {article.author.bio}
                </p>
                <Link href="#" className="inline-flex items-center gap-2 text-brand-navy font-semibold text-sm hover:text-brand-red transition-colors group">
                  <span>Read more from this author</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Articles - Beautiful Grid */}
      {relatedArticles.length > 0 && (
        <div className="bg-brand-gray-light py-20 border-t border-gray-200">
          <div className="container max-w-6xl">
            <div className="flex items-center justify-between mb-10 border-b-2 border-brand-navy pb-4">
              <h2 className="font-serif font-bold text-3xl md:text-4xl text-brand-navy">
                {isBangla ? `${article.category} বিভাগে আরও পড়ুন` : `Read Next in ${article.category}`}
              </h2>
              <Link href={`/category/${article.category.toLowerCase()}`} className="hidden sm:inline-block text-brand-red font-semibold hover:text-brand-navy transition-colors">
                {isBangla ? "সবগুলো দেখুন" : "View All"} &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {relatedArticles.map(a => (
                <NewsCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
