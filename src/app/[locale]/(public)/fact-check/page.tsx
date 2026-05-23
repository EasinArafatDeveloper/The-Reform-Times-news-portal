import { serializeMongo } from "@/lib/utils";
import clientPromise from "@/lib/mongodb";
import { getLocalizedContent, getTranslation } from "@/lib/i18n-utils";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isBangla = locale === 'bn';
  return {
    title: isBangla ? "তথ্য যাচাই কেন্দ্র | দি রিফর্ম টাইমস" : "Fact Check Center | The Reform Times",
    description: isBangla 
      ? "ডিজিটাল মিডিয়া ও খবরের সত্যতা যাচাইকরণ এবং ভুল তথ্যের অপপ্রচার রুখতে আমাদের সচিত্র যাচাই প্রতিবেদন।" 
      : "Dedicated to verifying claims and combating misinformation in digital media.",
  };
}

export default async function FactCheckPage({
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
      type: { $in: ['Fact Check', 'fact-check'] }, 
      $and: [
        {
          $or: [
            { status: 'Published' },
            { status: 'published' },
            { status: 'Scheduled', scheduledAt: { $lte: new Date().toISOString() } }
          ]
        }
      ]
    })
    .sort({ createdAt: -1 })
    .toArray();

  const factChecks = serializeMongo((rawArticles as any[]).map(a => ({
    ...a,
    id: a._id ? a._id.toString() : a.id,
  })));

  return (
    <div className="bg-brand-gray-light min-h-screen">
      <div className="bg-brand-navy text-white py-16">
        <div className="container max-w-4xl text-center">
          <ShieldCheck size={48} className="mx-auto text-brand-red mb-6" />
          <h1 className="font-serif font-bold text-4xl md:text-5xl mb-4">
            {t('factCheck')}
          </h1>
          <p className="text-xl text-gray-300">
            {isBangla 
              ? 'কঠোর প্রমাণ এবং স্বচ্ছ যাচাইকরণের মাধ্যমে ভুল তথ্যের মোকাবিলা করা।' 
              : 'Combating misinformation with rigorous evidence and transparent verification.'}
          </p>
        </div>
      </div>

      <div className="container py-16">
        {factChecks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {factChecks.map(article => {
              const localizedTitle = getLocalizedContent<string>(article.title, locale);
              const localizedSlug = typeof article.slug === 'object' ? (article.slug.en || article.slug.bn || '') : (article.slug || '');
              const localizedExcerpt = getLocalizedContent<string>(article.excerpt, locale);
              
              return (
                <Link key={article.id} href={`/${locale}/news/${localizedSlug}`} className="group flex flex-col bg-white border border-gray-200 hover:border-brand-navy transition-colors h-full">
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image 
                      src={article.image || article.mainImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600'} 
                      alt={localizedTitle || 'Article Image'}
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
                      {isBangla ? 'দাবি যাচাই করা হয়েছে' : 'Claim Reviewed'}
                    </div>
                    <h3 className="font-serif font-bold text-xl leading-tight group-hover:text-brand-red transition-colors mb-4">
                      {localizedTitle}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-6">
                      {localizedExcerpt}
                    </p>
                    <div className="mt-auto border-t border-gray-100 pt-4 flex items-center justify-between text-xs text-gray-500 font-medium">
                      <span>{isBangla ? 'রিপোর্টার:' : 'By'} {article.author.name}</span>
                      <span>{isBangla ? 'সম্পূর্ণ বিশ্লেষণ পড়ুন' : 'Read Full Analysis'} &rarr;</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="font-serif font-bold text-2xl text-gray-400">
              {isBangla ? 'আরও ফ্যাক্ট চেক শীঘ্রই আসছে।' : 'More fact checks coming soon.'}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}
