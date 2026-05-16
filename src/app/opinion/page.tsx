import { mockArticles } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata = {
  title: "Opinion & Editorial | The Reform Times",
  description: "Expert analysis, editorials, and opinion pieces from our contributors.",
};

export default function OpinionPage() {
  const opinions = mockArticles.filter(a => a.type === 'opinion');

  return (
    <div className="bg-[#fcfcfc] min-h-screen">
      <div className="container py-16 max-w-6xl">
        <div className="text-center mb-16 border-b border-gray-300 pb-12">
          <h1 className="font-serif font-bold text-5xl md:text-6xl text-brand-navy mb-6">Opinion & Editorial</h1>
          <p className="text-xl text-gray-600 font-serif italic max-w-2xl mx-auto">
            Perspectives, analysis, and commentary from our editors and guest contributors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {opinions.map(article => (
            <div key={article.id} className="flex flex-col group border-r border-gray-200 last:border-r-0 pr-8 last:pr-0 lg:border-r-0 lg:pr-0 lg:[&:not(:nth-child(3n))]:border-r lg:[&:not(:nth-child(3n))]:pr-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden relative shrink-0 border border-gray-200">
                  <Image src={article.author.avatar} alt={article.author.name} fill className="object-cover grayscale" />
                </div>
                <div>
                  <h4 className="font-bold text-brand-navy">{article.author.name}</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">{article.author.role}</p>
                </div>
              </div>
              <Link href={`/news/${article.slug}`}>
                <h3 className="font-serif font-bold text-2xl md:text-3xl leading-tight group-hover:text-brand-red transition-colors mb-4 text-brand-navy">
                  "{article.title}"
                </h3>
              </Link>
              <p className="text-gray-600 text-base leading-relaxed mb-6 italic">
                {article.excerpt}
              </p>
              <div className="mt-auto pt-4 border-t border-gray-200 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {article.readTime}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
