import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Article } from "@/lib/data";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { cn } from "@/lib/utils";

interface NewsCardProps {
  article: Article;
  layout?: "vertical" | "horizontal" | "compact";
  className?: string;
  imageClassName?: string;
}

export function NewsCard({ article, layout = "vertical", className, imageClassName }: NewsCardProps) {
  if (layout === "compact") {
    return (
      <div className={cn("group flex gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0", className)}>
        <div className="relative w-24 h-24 shrink-0 overflow-hidden">
          <Image 
            src={article.image} 
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex-1">
          <CategoryBadge category={article.category} className="mb-1 text-[9px]" />
          <Link href={`/news/${article.slug}`}>
            <h3 className="font-serif font-bold text-sm leading-snug group-hover:text-brand-red transition-colors line-clamp-2 mb-2">
              {article.title}
            </h3>
          </Link>
          <div className="text-[10px] text-gray-500 font-medium">
            {format(new Date(article.date), 'MMM d, yyyy')}
          </div>
        </div>
      </div>
    );
  }

  if (layout === "horizontal") {
    return (
      <div className={cn("group flex flex-col sm:flex-row gap-6", className)}>
        <div className={cn("relative w-full sm:w-2/5 aspect-[4/3] sm:aspect-auto overflow-hidden", imageClassName)}>
          <Image 
            src={article.image} 
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <CategoryBadge category={article.category} />
          <Link href={`/news/${article.slug}`}>
            <h3 className="font-serif font-bold text-xl md:text-2xl leading-tight group-hover:text-brand-red transition-colors mb-3">
              {article.title}
            </h3>
          </Link>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mt-auto">
            <span>{article.author.name}</span>
            <span>&bull;</span>
            <span>{format(new Date(article.date), 'MMMM d, yyyy')}</span>
          </div>
        </div>
      </div>
    );
  }

  // vertical
  return (
    <div className={cn("group flex flex-col h-full", className)}>
      <div className={cn("relative w-full aspect-[4/3] overflow-hidden mb-4", imageClassName)}>
        <Image 
          src={article.image} 
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {article.breaking && (
          <div className="absolute top-2 left-2 bg-brand-red text-white text-[10px] font-bold uppercase px-2 py-1 tracking-wider">
            Breaking
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col">
        <CategoryBadge category={article.category} />
        <Link href={`/news/${article.slug}`}>
          <h3 className="font-serif font-bold text-lg leading-tight group-hover:text-brand-red transition-colors mb-2">
            {article.title}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mt-auto">
          <span>{format(new Date(article.date), 'MMM d, yyyy')}</span>
          <span>&bull;</span>
          <span>{article.readTime}</span>
        </div>
      </div>
    </div>
  );
}
