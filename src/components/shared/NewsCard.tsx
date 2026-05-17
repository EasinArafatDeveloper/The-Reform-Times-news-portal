import Link from "next/link";
import { format } from "date-fns";
import { bn as bnLocale } from "date-fns/locale";
import { Article } from "@/lib/data";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { cn } from "@/lib/utils";
import { PlayCircle, Clock, User } from "lucide-react";
import { getLocalizedContent } from "@/lib/i18n-utils";

interface NewsCardProps {
  article: Article;
  layout?: "vertical" | "horizontal" | "compact" | "hero" | "featured";
  className?: string;
  imageClassName?: string;
  locale?: string;
}

export function NewsCard({ article, layout = "vertical", className, imageClassName, locale = "bn" }: NewsCardProps) {
  if (!article) return null;
  
  const isVideo = article.type === 'video';
  const isFactCheck = article.type === 'fact-check';
  const isBangla = locale === 'bn';

  const title = getLocalizedContent<string>(article.title, locale);
  const excerpt = getLocalizedContent<string>(article.excerpt, locale);
  const category = getLocalizedContent<string>(article.category, locale);
  const authorName = article.author.name; // Author name is usually a string, not bilingual in mock data yet but good to keep in mind
  const slug = getLocalizedContent<string>(article.slug, locale);
  const readTime = getLocalizedContent<string>(article.readTime || "", locale);

  const formattedDate = format(new Date(article.createdAt || article.publishedAt || article.date || new Date()), isBangla ? 'd MMM, yyyy' : 'MMM d, yyyy', {
    locale: isBangla ? bnLocale : undefined
  });

  // Compact layout (for sidebars or small lists)
  if (layout === "compact") {
    return (
      <div className={cn("group flex gap-4 border-b border-border/50 pb-4 last:border-0 last:pb-0 hover:bg-surface/50 p-2 -mx-2 transition-colors rounded-xl", className)}>
        <div className="relative w-20 h-20 shrink-0 overflow-hidden rounded-lg shadow-sm border border-border/50">
          <img 
            src={article.image || article.mainImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600'} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-6 h-6 rounded-full bg-primary/90 flex items-center justify-center text-white">
                <PlayCircle size={12} fill="currentColor" />
              </div>
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <CategoryBadge category={category} className="mb-1 text-[9px] scale-90 origin-left" />
          <Link href={`/${locale}/news/${slug}`}>
            <h3 className="font-serif font-bold text-sm leading-snug text-title group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>
          <div className="text-[10px] text-caption font-medium mt-1 flex items-center gap-2">
            <span>{formattedDate}</span>
            {readTime && <span>&bull; {readTime}</span>}
          </div>
        </div>
      </div>
    );
  }

  // Horizontal layout (for main feed or lists)
  if (layout === "horizontal") {
    return (
      <div className={cn("group flex flex-col sm:flex-row gap-6 p-4 rounded-2xl border border-transparent hover:border-border hover:bg-card hover:shadow-premium transition-all", className)}>
        <div className={cn("relative w-full sm:w-[40%] aspect-video sm:aspect-[4/3] overflow-hidden rounded-xl shadow-md border border-border/50", imageClassName)}>
          <img 
            src={article.image || article.mainImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600'} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center text-white shadow-xl backdrop-blur-sm">
                <PlayCircle size={24} fill="currentColor" />
              </div>
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col py-1">
          <CategoryBadge category={category} />
          <Link href={`/${locale}/news/${slug}`}>
            <h2 className="font-serif font-bold text-xl md:text-2xl leading-tight text-title group-hover:text-primary transition-colors mb-3">
              {title}
            </h2>
          </Link>
          <p className="text-body text-sm line-clamp-2 mb-4 leading-relaxed opacity-80">
            {excerpt}
          </p>
          <div className="flex items-center gap-3 text-xs text-caption font-medium mt-auto">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full overflow-hidden border border-border">
                <img src={article.author.avatar} alt={authorName} className="w-full h-full object-cover" />
              </div>
              <span className="text-title/80">{authorName}</span>
            </div>
            <span>&bull;</span>
            <span>{formattedDate}</span>
            <span>&bull;</span>
            <span>{readTime}</span>
          </div>
        </div>
      </div>
    );
  }

  // Featured layout (for section highlights)
  if (layout === "featured") {
    return (
      <div className={cn("group relative w-full overflow-hidden rounded-2xl shadow-xl", !className?.includes('h-') && "aspect-[16/9]", className)}>
        <img 
          src={article.image || article.mainImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600'} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full text-white">
          <CategoryBadge category={category} className="text-primary mb-3" />
          <Link href={`/${locale}/news/${slug}`}>
            <h2 className="font-serif font-bold text-2xl md:text-4xl leading-tight mb-4 group-hover:text-primary/90 transition-colors">
              {title}
            </h2>
          </Link>
          <p className="text-white/80 text-sm md:text-base line-clamp-2 mb-6 max-w-2xl">
            {excerpt}
          </p>
          <div className="flex items-center gap-4 text-xs font-medium text-white/60">
            <span className="flex items-center gap-1.5"><User size={14} /> {authorName}</span>
            <span className="flex items-center gap-1.5"><Clock size={14} /> {readTime}</span>
          </div>
        </div>
      </div>
    );
  }

  // Vertical layout (default card)
  return (
    <div className={cn("group flex flex-col bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-premium transition-all news-card-shadow h-full", className)}>
      <div className={cn("relative aspect-[16/10] overflow-hidden", imageClassName)}>
        <img 
          src={article.image || article.mainImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600'} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center text-white shadow-xl transform scale-90 group-hover:scale-100 transition-transform backdrop-blur-sm">
              <PlayCircle size={24} fill="currentColor" />
            </div>
          </div>
        )}
        {isFactCheck && article.factCheckStatus && (
          <div className={cn(
            "absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg",
            article.factCheckStatus === 'Verified' ? "bg-green-500 text-white" : 
            article.factCheckStatus === 'False' ? "bg-red-500 text-white" : 
            "bg-amber-500 text-white"
          )}>
            {article.factCheckStatus}
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <CategoryBadge category={category} />
        <Link href={`/${locale}/news/${slug}`}>
          <h3 className="font-serif font-bold text-lg md:text-xl leading-snug text-title group-hover:text-primary transition-colors mb-3 line-clamp-2">
            {title}
          </h3>
        </Link>
        <p className="text-caption text-sm line-clamp-2 mb-4 leading-relaxed opacity-80">
          {excerpt}
        </p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50 text-[10px] font-bold text-caption uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <User size={12} className="text-primary/70" />
            <span>{authorName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={12} className="text-primary/70" />
            <span>{readTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
