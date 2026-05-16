import { mockArticles } from "@/lib/data";
import { NewsCard } from "@/components/shared/NewsCard";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

export const metadata = {
  title: "Investigations | The Reform Times",
  description: "Exclusive investigative reports uncovering corruption, fraud, and abuse of power.",
};

export default function InvestigationsPage() {
  const investigations = mockArticles.filter(a => a.type === 'investigation');
  const featured = investigations[0];
  const rest = investigations.slice(1);

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container py-16">
        <div className="mb-16 border-b border-white/20 pb-16">
          <h1 className="font-serif font-bold text-5xl md:text-7xl text-brand-red mb-6">Investigations</h1>
          <p className="text-xl md:text-2xl text-gray-400 font-serif max-w-3xl">
            Holding power to account through deep, rigorous, and fearless reporting.
          </p>
        </div>

        {featured && (
          <div className="mb-20">
            <Link href={`/news/${featured.slug}`} className="group block relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden">
              <Image 
                src={featured.image} 
                alt={featured.title}
                fill
                className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full max-w-4xl">
                <div className="bg-brand-red text-white text-[10px] font-bold uppercase px-3 py-1.5 tracking-widest inline-block mb-4">
                  Featured Investigation
                </div>
                <h2 className="font-serif font-bold text-3xl md:text-5xl leading-tight mb-4 group-hover:text-brand-red transition-colors">
                  {featured.title}
                </h2>
                <p className="text-gray-300 text-lg md:text-xl line-clamp-3 mb-6">
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm font-medium text-gray-400">
                  <span>By {featured.author.name}</span>
                  <span>&bull;</span>
                  <span>{featured.readTime}</span>
                </div>
              </div>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {rest.map(article => (
            <div key={article.id} className="group flex flex-col gap-4">
              <Link href={`/news/${article.slug}`} className="relative w-full aspect-[4/3] overflow-hidden">
                <Image 
                  src={article.image} 
                  alt={article.title}
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                />
              </Link>
              <div className="flex-1">
                <Link href={`/news/${article.slug}`}>
                  <h3 className="font-serif font-bold text-2xl leading-tight group-hover:text-brand-red transition-colors mb-3">
                    {article.title}
                  </h3>
                </Link>
                <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                  {article.excerpt}
                </p>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  By {article.author.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
