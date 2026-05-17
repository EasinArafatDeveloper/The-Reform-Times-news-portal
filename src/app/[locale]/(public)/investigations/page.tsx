import { serializeMongo } from "@/lib/utils";
import clientPromise from "@/lib/mongodb";
import { getLocalizedContent, getTranslation } from "@/lib/i18n-utils";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Investigations | The Reform Times",
  description: "Exclusive investigative reports uncovering corruption, fraud, and abuse of power.",
};

export default async function InvestigationsPage({
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
        { type: { $in: ['Investigation', 'investigation'] } },
        { category: { $in: ['Investigations', 'investigations'] } }
      ],
      status: 'Published' 
    })
    .sort({ createdAt: -1 })
    .toArray();

  const investigations = serializeMongo((rawArticles as any[]).map(a => ({
    ...a,
    id: a._id ? a._id.toString() : a.id,
  })));
  const featured = investigations[0];
  const rest = investigations.slice(1);

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container py-16">
        <div className="mb-16 border-b border-white/20 pb-16">
          <h1 className="font-serif font-bold text-5xl md:text-7xl text-brand-red mb-6">
            {t('investigations')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-serif max-w-3xl">
            {isBangla 
              ? 'গভীর, কঠোর এবং নির্ভীক রিপোর্টিংয়ের মাধ্যমে ক্ষমতাকে জবাবদিহিতার আওতায় আনা।' 
              : 'Holding power to account through deep, rigorous, and fearless reporting.'}
          </p>
        </div>

        {featured && (
          <div className="mb-20">
            {(() => {
              const localizedTitle = getLocalizedContent<string>(featured.title, locale);
              const localizedSlug = getLocalizedContent<string>(featured.slug, locale);
              const localizedExcerpt = getLocalizedContent<string>(featured.excerpt, locale);
              const localizedReadTime = getLocalizedContent<string>(featured.readTime, locale);

              return (
                <Link href={`/${locale}/news/${localizedSlug}`} className="group block relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden">
                  <Image 
                    src={featured.image || featured.mainImage || 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200'} 
                    alt={localizedTitle || 'Featured Image'}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full max-w-4xl">
                    <div className="bg-brand-red text-white text-[10px] font-bold uppercase px-3 py-1.5 tracking-widest inline-block mb-4">
                      {isBangla ? 'ফিচারড অনুসন্ধান' : 'Featured Investigation'}
                    </div>
                    <h2 className="font-serif font-bold text-3xl md:text-5xl leading-tight mb-4 group-hover:text-brand-red transition-colors">
                      {localizedTitle}
                    </h2>
                    <p className="text-gray-300 text-lg md:text-xl line-clamp-3 mb-6">
                      {localizedExcerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm font-medium text-gray-400">
                      <span>{isBangla ? 'রিপোর্টার:' : 'By'} {featured.author.name}</span>
                      <span>&bull;</span>
                      <span>{localizedReadTime}</span>
                    </div>
                  </div>
                </Link>
              );
            })()}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {rest.map(article => {
            const localizedTitle = getLocalizedContent<string>(article.title, locale);
            const localizedSlug = getLocalizedContent<string>(article.slug, locale);
            const localizedExcerpt = getLocalizedContent<string>(article.excerpt, locale);
            
            return (
              <div key={article.id} className="group flex flex-col gap-4">
                <Link href={`/${locale}/news/${localizedSlug}`} className="relative w-full aspect-[4/3] overflow-hidden">
                  <Image 
                    src={article.image || article.mainImage || 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600'} 
                    alt={localizedTitle || 'Article Image'}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                  />
                </Link>
                <div className="flex-1">
                  <Link href={`/${locale}/news/${localizedSlug}`}>
                    <h3 className="font-serif font-bold text-2xl leading-tight group-hover:text-brand-red transition-colors mb-3">
                      {localizedTitle}
                    </h3>
                  </Link>
                  <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                    {localizedExcerpt}
                  </p>
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                    {isBangla ? 'রিপোর্টার:' : 'By'} {article.author.name}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
