import { serializeMongo } from "@/lib/utils";
import clientPromise from "@/lib/mongodb";
import { getLocalizedContent, getTranslation } from "@/lib/i18n-utils";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Opinion & Editorial | The Reform Times",
  description: "Expert analysis, editorials, and opinion pieces from our contributors.",
};

export default async function OpinionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isBangla = locale === 'bn';
  const t = (key: string) => getTranslation(locale, key);
  
  const client = await clientPromise;
  const db = client.db('the-reform-times-news');
  const rawArticles = await db.collection('articles')
    .find({ 
      $or: [
        { type: 'opinion' },
        { category: 'opinions' }
      ],
      status: 'Published' 
    })
    .sort({ createdAt: -1 })
    .toArray();

  const opinions = serializeMongo((rawArticles as any[]).map(a => ({
    ...a,
    id: a._id ? a._id.toString() : a.id,
  })));

  return (
    <div className="bg-[#fcfcfc] min-h-screen">
      <div className="container py-16 max-w-6xl">
        <div className="text-center mb-16 border-b border-gray-300 pb-12">
          <h1 className="font-serif font-bold text-5xl md:text-6xl text-brand-navy mb-6">
            {t('opinion')}
          </h1>
          <p className="text-xl text-gray-600 font-serif italic max-w-2xl mx-auto">
            {isBangla 
              ? 'আমাদের সম্পাদক এবং অতিথি লেখকদের দৃষ্টিভঙ্গি, বিশ্লেষণ এবং মতামত।' 
              : 'Perspectives, analysis, and commentary from our editors and guest contributors.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {opinions.map(article => {
            const localizedTitle = getLocalizedContent<string>(article.title, locale);
            const localizedSlug = getLocalizedContent<string>(article.slug, locale);
            const localizedExcerpt = getLocalizedContent<string>(article.excerpt, locale);
            const localizedReadTime = getLocalizedContent<string>(article.readTime, locale);
            const localizedAuthorRole = getLocalizedContent<string>(article.author.role, locale);

            return (
              <div key={article.id} className="flex flex-col group border-r border-gray-200 last:border-r-0 pr-8 last:pr-0 lg:border-r-0 lg:pr-0 lg:[&:not(:nth-child(3n))]:border-r lg:[&:not(:nth-child(3n))]:pr-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden relative shrink-0 border border-gray-200">
                    <Image src={article.author.avatar} alt={article.author.name} fill className="object-cover grayscale" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-navy">{article.author.name}</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                      {localizedAuthorRole}
                    </p>
                  </div>
                </div>
                <Link href={`/${locale}/news/${localizedSlug}`}>
                  <h3 className="font-serif font-bold text-2xl md:text-3xl leading-tight group-hover:text-brand-red transition-colors mb-4 text-brand-navy">
                    "{localizedTitle}"
                  </h3>
                </Link>
                <p className="text-gray-600 text-base leading-relaxed mb-6 italic">
                  {localizedExcerpt}
                </p>
                <div className="mt-auto pt-4 border-t border-gray-200 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {localizedReadTime}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
