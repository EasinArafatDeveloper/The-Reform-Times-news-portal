import { mockArticles } from "@/lib/data";
import { getLocalizedContent, getTranslation } from "@/lib/i18n-utils";
import Image from "next/image";
import Link from "next/link";
import { PlayCircle } from "lucide-react";

export const metadata = {
  title: "Video Journalism | The Reform Times",
  description: "Watch our latest video reports, documentaries, and interviews.",
};

export default async function VideoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isBangla = locale === 'bn';
  const t = (key: string) => getTranslation(locale, key);
  
  const videos = mockArticles.filter(a => a.type === 'video' || a.category === 'video');

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container py-16">
        <div className="mb-12">
          <h1 className="font-serif font-bold text-4xl md:text-5xl text-white mb-4">
            {isBangla ? 'ভিডিও সাংবাদিকতা' : 'Video Journalism'}
          </h1>
          <p className="text-gray-400 max-w-2xl text-lg">
            {isBangla 
              ? 'অনুপ্রেরণামূলক তথ্যচিত্র, মাঠ পর্যায়ের রিপোর্ট এবং বিশেষজ্ঞ সাক্ষাৎকার।' 
              : 'Immersive documentaries, field reports, and expert interviews.'}
          </p>
        </div>

        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((article, i) => {
              const localizedTitle = getLocalizedContent<string>(article.title, locale);
              const localizedSlug = getLocalizedContent<string>(article.slug, locale);
              const localizedReadTime = getLocalizedContent<string>(article.readTime || "", locale);
              const localizedCategory = getLocalizedContent<string>(article.category, locale);

              return (
                <div key={article.id} className={`group ${i === 0 ? 'md:col-span-2 lg:col-span-2 md:row-span-2' : ''}`}>
                  <Link href={`/${locale}/news/${localizedSlug}`} className="block relative w-full aspect-video overflow-hidden border border-white/10 group-hover:border-white/30 transition-colors">
                    <Image 
                      src={article.image} 
                      alt={localizedTitle}
                      fill
                      className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`rounded-full bg-black/50 flex items-center justify-center border border-white/30 group-hover:bg-brand-red group-hover:border-brand-red transition-colors backdrop-blur-sm
                        ${i === 0 ? 'w-20 h-20' : 'w-16 h-16'}
                      `}>
                        <PlayCircle size={i === 0 ? 40 : 32} className="text-white ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 p-6 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-brand-red text-white text-[10px] font-bold uppercase px-2 py-1 tracking-wider">
                          {localizedCategory}
                        </span>
                        <span className="text-gray-300 text-[10px] font-bold uppercase tracking-wider">
                          {localizedReadTime}
                        </span>
                      </div>
                      <h3 className={`font-serif font-bold text-white group-hover:text-brand-red transition-colors leading-tight
                        ${i === 0 ? 'text-3xl md:text-4xl' : 'text-xl'}
                      `}>
                        {localizedTitle}
                      </h3>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="font-serif font-bold text-2xl text-gray-500">
              {isBangla ? 'আরও ভিডিও শীঘ্রই আসছে।' : 'More videos coming soon.'}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}
