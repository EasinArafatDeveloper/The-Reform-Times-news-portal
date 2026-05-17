import { serializeMongo } from "@/lib/utils";
import clientPromise from "@/lib/mongodb";
import { mockArticles } from "@/lib/data";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { bn as bnLocale } from "date-fns/locale";
import { Link as LinkIcon, Mail } from "lucide-react";
import { TwitterIcon, FacebookIcon, LinkedinIcon } from "@/components/ui/icons";
import Link from "next/link";
import { NewsCard } from "@/components/shared/NewsCard";
import { ReadingProgressBar } from "@/components/ui/ReadingProgressBar";
import { getLocalizedContent, getTranslation } from "@/lib/i18n-utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await params;
  
  const client = await clientPromise;
  const db = client.db('the-reform-times-news');
  
  const decodedSlug = decodeURIComponent(slug);
  const encodedSlug = encodeURIComponent(slug);

  let article = await db.collection('articles').findOne({
    $or: [
      { 'slug': slug },
      { 'slug': decodedSlug },
      { 'slug': encodedSlug },
      { 'slug.en': slug },
      { 'slug.bn': slug },
      { 'slug.en': decodedSlug },
      { 'slug.bn': decodedSlug },
      { 'slug.en': encodedSlug },
      { 'slug.bn': encodedSlug }
    ]
  }) as any;

  if (!article) {
    article = mockArticles.find(a => {
      const s = getLocalizedContent<string>(a.slug, 'en');
      const sb = getLocalizedContent<string>(a.slug, 'bn');
      return s === slug || s === decodedSlug || sb === slug || sb === decodedSlug;
    });
  }
  
  if (!article) return { title: 'Article Not Found' };

  const title = getLocalizedContent<string>(article.title, locale);
  const excerpt = getLocalizedContent<string>(article.excerpt, locale);

  return {
    title: `${title} | The Reform Times`,
    description: excerpt,
  };
}

export default async function NewsDetailsPage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await params;
  const isBangla = locale === 'bn';
  const t = (key: string) => getTranslation(locale, key);

  const client = await clientPromise;
  const db = client.db('the-reform-times-news');

  const decodedSlug = decodeURIComponent(slug);
  const encodedSlug = encodeURIComponent(slug);

  let article = await db.collection('articles').findOne({
    $or: [
      { 'slug': slug },
      { 'slug': decodedSlug },
      { 'slug': encodedSlug },
      { 'slug.en': slug },
      { 'slug.bn': slug },
      { 'slug.en': decodedSlug },
      { 'slug.bn': decodedSlug },
      { 'slug.en': encodedSlug },
      { 'slug.bn': encodedSlug }
    ]
  }) as any;

  if (article && article._id) {
    db.collection('articles').updateOne(
      { _id: article._id },
      { $inc: { views: 1 } }
    ).catch(err => console.error('Error incrementing views:', err));
    article.views = (article.views || 0) + 1;
  }

  if (!article) {
    article = mockArticles.find(a => {
      const s = getLocalizedContent<string>(a.slug, 'en');
      const sb = getLocalizedContent<string>(a.slug, 'bn');
      return s === slug || s === decodedSlug || sb === slug || sb === decodedSlug;
    });
  }
  
  if (!article) {
    notFound();
  }

  article = serializeMongo(article);

  const title = getLocalizedContent<string>(article.title, locale);
  const excerpt = getLocalizedContent<string>(article.excerpt, locale);
  const content = getLocalizedContent<string>(article.content || "", locale);
  const category = getLocalizedContent<string>(article.category, locale);
  const authorRole = getLocalizedContent<string>(article.author.role, locale);
  const authorBio = getLocalizedContent<string>(article.author.bio, locale);
  const readTime = getLocalizedContent<string>(article.readTime || "", locale);

  const formattedDate = format(new Date(article.createdAt || article.publishedAt || article.date || new Date()), isBangla ? 'd MMMM, yyyy' : 'MMMM d, yyyy', {
    locale: isBangla ? bnLocale : undefined
  });

  const dbRelated = await db.collection('articles')
    .find({
      category: article.category,
      _id: { $ne: article._id },
      status: 'Published'
    })
    .limit(3)
    .toArray();

  const relatedArticles = dbRelated.length > 0
    ? serializeMongo(dbRelated.map(a => ({
        ...a,
        id: a._id ? a._id.toString() : a.id,
      })))
    : mockArticles.filter(a => 
        getLocalizedContent<string>(a.category, 'en') === getLocalizedContent<string>(article.category, 'en') && 
        a.id !== article.id
      ).slice(0, 3);

  return (
    <div className="bg-background">
      <ReadingProgressBar />
      
      {/* Immersive Hero Header */}
      <div className="relative w-full h-[60vh] md:h-[75vh] min-h-[500px] bg-black">
        <img 
          src={article.image} 
          alt={title}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full">
          <div className="container max-w-5xl pb-12 md:pb-16 px-4 md:px-8">
            <span className="inline-block bg-primary text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 mb-6 rounded-sm">
              {category}
            </span>
            <h1 className="font-serif font-bold text-4xl md:text-5xl lg:text-7xl leading-[1.1] text-white mb-6 text-balance shadow-sm">
              {title}
            </h1>
            <p className="text-xl md:text-2xl text-white/80 font-serif mb-8 leading-relaxed italic max-w-4xl text-balance">
              {excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-white/70 font-medium">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden relative border-2 border-white/20">
                  <img src={article.author.avatar} alt={article.author.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-white font-bold text-base">{article.author.name}</p>
                  <p className="text-xs uppercase tracking-wider text-primary">{authorRole}</p>
                </div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/20"></div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <p>{formattedDate}</p>
                <span className="hidden sm:inline">&bull;</span>
                <p>{readTime}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-5xl py-16 px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left Sidebar - Social Share */}
          <div className="lg:w-16 shrink-0 order-2 lg:order-1 flex lg:flex-col items-center gap-4 lg:sticky lg:top-32 h-fit border-t lg:border-t-0 border-border pt-8 lg:pt-0">
            <span className="text-[10px] uppercase font-bold text-caption tracking-widest lg:-rotate-90 lg:mb-6 whitespace-nowrap">
              {isBangla ? "শেয়ার করুন" : "Share Story"}
            </span>
            <button className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-caption hover:border-primary hover:bg-primary/5 hover:text-primary transition-all"><TwitterIcon width={18} height={18} /></button>
            <button className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-caption hover:border-primary hover:bg-primary/5 hover:text-primary transition-all"><FacebookIcon width={18} height={18} /></button>
            <button className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-caption hover:border-primary hover:bg-primary/5 hover:text-primary transition-all"><LinkedinIcon width={18} height={18} /></button>
            <button className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-caption hover:border-primary hover:bg-primary/5 hover:text-primary transition-all"><Mail size={18} /></button>
            <button className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-caption hover:border-primary hover:bg-primary/5 hover:text-primary transition-all"><LinkIcon size={18} /></button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 order-1 lg:order-2">
            <article className="prose prose-lg md:prose-xl lg:prose-2xl prose-stone dark:prose-invert max-w-none 
              prose-headings:font-serif prose-headings:text-title prose-headings:font-bold
              prose-p:leading-[1.9] prose-p:text-body prose-p:mb-8
              prose-a:text-primary hover:prose-a:text-title prose-a:font-semibold prose-a:underline-offset-4
              prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:text-title
              first-letter:text-7xl first-letter:font-serif first-letter:font-bold first-letter:text-primary first-letter:mr-3 first-letter:float-left first-letter:leading-none
              mb-16">
              <div dangerouslySetInnerHTML={{ __html: content || `<p>This is a placeholder for the article content. In a real application, this would be rich HTML or Markdown parsed content.</p><p>The Reform Times is dedicated to bringing you the truth.</p>` }} />
            </article>

            {/* Tags */}
            {article.tags && Array.isArray(article.tags) && article.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 border-t border-border pt-8 mb-16">
                <span className="font-bold text-sm uppercase tracking-wider text-title">
                  {isBangla ? 'বিষয়বস্তু:' : 'Topics:'}
                </span>
                {article.tags.map((tag: any, i: number) => {
                  const localizedTag = getLocalizedContent<string>(tag, locale);
                  return (
                    <Link 
                      key={i} 
                      href={`/${locale}/search?q=${encodeURIComponent(localizedTag)}`} 
                      className="bg-surface text-body px-4 py-1.5 text-sm font-semibold hover:bg-primary hover:text-white transition-colors rounded-sm border border-border"
                    >
                      {localizedTag}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Elegant Author Bio Box */}
            <div className="border-t-4 border-secondary pt-8 flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-8">
              <div className="w-28 h-28 rounded-full overflow-hidden relative shrink-0 grayscale hover:grayscale-0 transition-all duration-500 shadow-md">
                <img src={article.author.avatar} alt={article.author.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-center sm:text-left flex-1">
                <h4 className="font-serif font-bold text-3xl text-title mb-2">{article.author.name}</h4>
                <p className="text-sm uppercase tracking-widest text-primary font-bold mb-4">{authorRole}</p>
                <p className="text-body text-base md:text-lg leading-relaxed mb-4 font-serif italic">
                  {authorBio}
                </p>
                <Link href="#" className="inline-flex items-center gap-2 text-title font-semibold text-sm hover:text-primary transition-colors group">
                  <span>{isBangla ? 'লেখকের আরও সংবাদ পড়ুন' : 'Read more from this author'}</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Articles - Beautiful Grid */}
      {relatedArticles.length > 0 && (
        <div className="bg-surface py-20 border-t border-border">
          <div className="container max-w-6xl">
            <div className="flex items-center justify-between mb-10 border-b-2 border-secondary pb-4">
              <h2 className="font-serif font-bold text-3xl md:text-4xl text-title">
                {isBangla ? `${category} বিভাগে আরও পড়ুন` : `Read Next in ${category}`}
              </h2>
              <Link href={`/${locale}/category/${getLocalizedContent<string>(article.category, 'en').toLowerCase()}`} className="hidden sm:inline-block text-primary font-semibold hover:text-secondary transition-colors">
                {isBangla ? "সবগুলো দেখুন" : "View All"} &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {relatedArticles.map(a => (
                <NewsCard key={a.id} article={a as any} locale={locale} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
