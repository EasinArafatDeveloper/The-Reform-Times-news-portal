import { mockArticles } from "@/lib/data";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { NewsCard } from "@/components/shared/NewsCard";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Fact Check Center | The Reform Times",
  description: "Dedicated to verifying claims and combating misinformation in digital media.",
};

export default function FactCheckPage() {
  const factChecks = mockArticles.filter(a => a.type === 'fact-check');

  return (
    <div className="bg-brand-gray-light min-h-screen">
      <div className="bg-brand-navy text-white py-16">
        <div className="container max-w-4xl text-center">
          <ShieldCheck size={48} className="mx-auto text-brand-red mb-6" />
          <h1 className="font-serif font-bold text-4xl md:text-5xl mb-4">Fact Check Center</h1>
          <p className="text-xl text-gray-300">
            Combating misinformation with rigorous evidence and transparent verification.
          </p>
        </div>
      </div>

      <div className="container py-16">
        {factChecks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {factChecks.map(article => (
              <Link key={article.id} href={`/news/${article.slug}`} className="group flex flex-col bg-white border border-gray-200 hover:border-brand-navy transition-colors h-full">
                <div className="relative h-56 w-full overflow-hidden">
                  <Image 
                    src={article.image} 
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {article.factCheckStatus && (
                    <div className={`absolute top-4 right-4 text-white text-xs font-bold uppercase px-3 py-1.5 tracking-wider shadow-lg
                      ${article.factCheckStatus === 'Verified' ? 'bg-green-600' : ''}
                      ${article.factCheckStatus === 'False' ? 'bg-brand-red' : ''}
                      ${article.factCheckStatus === 'Misleading' ? 'bg-orange-500' : ''}
                      ${article.factCheckStatus === 'Under Review' ? 'bg-gray-600' : ''}
                    `}>
                      {article.factCheckStatus}
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3">
                    Claim Reviewed
                  </div>
                  <h3 className="font-serif font-bold text-xl leading-tight group-hover:text-brand-red transition-colors mb-4">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-6">
                    {article.excerpt}
                  </p>
                  <div className="mt-auto border-t border-gray-100 pt-4 flex items-center justify-between text-xs text-gray-500 font-medium">
                    <span>By {article.author.name}</span>
                    <span>Read Full Analysis &rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="font-serif font-bold text-2xl text-gray-400">More fact checks coming soon.</h2>
          </div>
        )}
      </div>
    </div>
  );
}
