import { mockArticles } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { Link as LinkIcon, Share2, Mail } from "lucide-react";
import { TwitterIcon, FacebookIcon } from "@/components/ui/icons";
import Link from "next/link";
import { NewsCard } from "@/components/shared/NewsCard";
import { ReadingProgressBar } from "@/components/ui/ReadingProgressBar";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const article = mockArticles.find(a => a.slug === resolvedParams.slug);
  if (!article) return { title: 'Article Not Found' };

  return {
    title: `${article.title} | The Reform Times`,
    description: article.excerpt,
  };
}

export default async function NewsDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const article = mockArticles.find(a => a.slug === resolvedParams.slug);
  
  if (!article) {
    notFound();
  }

  const relatedArticles = mockArticles.filter(a => a.category === article.category && a.id !== article.id).slice(0, 3);

  return (
    <div className="bg-white">
      <ReadingProgressBar />
      {/* Article Header */}
      <div className="container max-w-4xl pt-12 pb-8">
        <CategoryBadge category={article.category} className="mb-6 text-brand-red text-sm" />
        <h1 className="font-serif font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6 text-brand-navy">
          {article.title}
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 font-serif mb-8 leading-relaxed italic">
          {article.excerpt}
        </p>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-b border-gray-200 py-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden relative shrink-0 grayscale hover:grayscale-0 transition-all border border-gray-200">
              <Image src={article.author.avatar} alt={article.author.name} fill className="object-cover" />
            </div>
            <div>
              <p className="font-bold text-brand-navy">{article.author.name}</p>
              <p className="text-sm text-brand-red font-medium uppercase tracking-wider">{article.author.role}</p>
            </div>
          </div>
          
          <div className="flex flex-col md:items-end gap-2 text-sm text-gray-500 font-medium">
            <p>Published: {format(new Date(article.date), 'MMMM d, yyyy h:mm a')}</p>
            <p>{article.readTime}</p>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="container max-w-5xl mb-12">
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-gray-100">
          <Image 
            src={article.image} 
            alt={article.title}
            fill
            priority
            className="object-cover"
          />
        </div>
        <p className="text-xs text-gray-500 text-right mt-2 uppercase tracking-wide">Image source: The Reform Times / Unsplash</p>
      </div>

      {/* Article Body */}
      <div className="container max-w-4xl pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Social Share Sidebar */}
          <div className="lg:col-span-1 hidden lg:flex flex-col items-center gap-4 sticky top-24 h-fit">
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest rotate-180" style={{ writingMode: 'vertical-rl' }}>Share</p>
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand-red hover:text-brand-red transition-colors"><TwitterIcon width={18} height={18} /></button>
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand-red hover:text-brand-red transition-colors"><FacebookIcon width={18} height={18} /></button>
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand-red hover:text-brand-red transition-colors"><Mail size={18} /></button>
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand-red hover:text-brand-red transition-colors"><LinkIcon size={18} /></button>
          </div>

          <div className="lg:col-span-11">
            {/* Main Content */}
            <article className="prose prose-lg md:prose-xl prose-stone max-w-none prose-headings:font-serif prose-headings:text-brand-navy prose-a:text-brand-red hover:prose-a:text-brand-navy prose-p:leading-relaxed prose-p:text-gray-800 mb-12">
              <div dangerouslySetInnerHTML={{ __html: article.content || '<p>This is a placeholder for the article content. In a real application, this would be rich HTML or Markdown parsed content.</p><p>The Reform Times is dedicated to bringing you the truth.</p>' }} />
            </article>

            {/* Tags */}
            <div className="flex items-center gap-3 border-t border-gray-200 pt-8 mb-12">
              <span className="font-bold text-sm uppercase tracking-wider text-brand-navy">Tags:</span>
              <div className="flex flex-wrap gap-2">
                {article.tags.map(tag => (
                  <Link key={tag} href={`/search?q=${tag}`} className="bg-gray-100 text-gray-700 px-3 py-1 text-sm font-medium hover:bg-brand-navy hover:text-white transition-colors">
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Author Bio Box */}
            <div className="bg-brand-gray-light p-8 border border-gray-200 flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden relative shrink-0">
                <Image src={article.author.avatar} alt={article.author.name} fill className="object-cover" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs uppercase tracking-widest text-brand-red font-bold mb-1">About the Author</p>
                <h4 className="font-serif font-bold text-2xl text-brand-navy mb-2">{article.author.name}</h4>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">{article.author.bio}</p>
                <Link href="#" className="text-brand-red font-semibold text-sm hover:underline">View all articles by {article.author.name}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      <div className="bg-brand-gray-light py-16 border-t border-gray-200">
        <div className="container">
          <h2 className="font-serif font-bold text-3xl text-brand-navy mb-8 border-b-2 border-brand-navy inline-block pb-2">More from {article.category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedArticles.map(a => (
              <NewsCard key={a.id} article={a} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
