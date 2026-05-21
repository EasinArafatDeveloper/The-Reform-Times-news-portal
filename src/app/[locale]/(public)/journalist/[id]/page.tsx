import clientPromise from '@/lib/mongodb';
import { serializeMongo } from '@/lib/utils';
import { ObjectId } from 'mongodb';
import { notFound } from 'next/navigation';
import { getLocalizedContent, getTranslation } from '@/lib/i18n-utils';
import { NewsCard } from '@/components/shared/NewsCard';
import Link from 'next/link';
import { Mail, ArrowLeft, FileText, Eye, Calendar, Award, CheckCircle2, Globe, Link2 } from 'lucide-react';
import { format } from 'date-fns';
import { bn as bnLocale } from 'date-fns/locale';

export async function generateMetadata({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id, locale } = await params;
  try {
    const client = await clientPromise;
    const db = client.db('the-reform-times-news');
    const journalist = ObjectId.isValid(id)
      ? await db.collection('journalists').findOne({ _id: new ObjectId(id) })
      : await db.collection('journalists').findOne({ id });
    if (!journalist) return { title: 'Journalist Not Found' };
    return {
      title: `${journalist.name} | The Reform Times`,
      description: getLocalizedContent<string>((journalist as any).bio, locale) || `Reporter profile for ${journalist.name}`,
    };
  } catch {
    return { title: 'Reporter Profile | The Reform Times' };
  }
}

export default async function JournalistProfilePage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const isBangla = locale === 'bn';
  const t = (key: string) => getTranslation(locale, key);

  const client = await clientPromise;
  const db = client.db('the-reform-times-news');

  let rawJournalist = ObjectId.isValid(id)
    ? await db.collection('journalists').findOne({ _id: new ObjectId(id) })
    : await db.collection('journalists').findOne({ id });

  if (!rawJournalist) notFound();

  const journalist = serializeMongo(rawJournalist) as any;
  const journalistId = journalist._id || journalist.id;

  // Fetch their articles
  const rawArticles = await db.collection('articles')
    .find({
      $or: [
        { 'author.name': journalist.name },
        { authorId: journalistId },
      ],
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

  const articles = serializeMongo(rawArticles.map((a: any) => ({
    ...a,
    id: a._id ? a._id.toString() : a.id,
  })));

  const totalViews = articles.reduce((sum: number, a: any) => sum + (a.views || 0), 0);
  const joinDate = journalist.createdAt
    ? format(new Date(journalist.createdAt), isBangla ? 'd MMMM, yyyy' : 'MMMM yyyy', { locale: isBangla ? bnLocale : undefined })
    : '';

  const bioText = getLocalizedContent<string>(journalist.bio, locale) || '';
  const roleText = getLocalizedContent<string>(journalist.role, locale) || journalist.role || '';

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

        <div className="container relative z-10 py-16 md:py-24">
          {/* Back link */}
          <Link
            href={`/${locale}/news`}
            className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm font-medium mb-12 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            {isBangla ? 'প্রচ্ছদে ফিরুন' : 'Back to News'}
          </Link>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-36 h-36 md:w-44 md:h-44 rounded-[2.5rem] overflow-hidden border-4 border-white/10 shadow-2xl">
                {journalist.avatar ? (
                  <img
                    src={journalist.avatar}
                    alt={journalist.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary/20 flex items-center justify-center text-5xl font-bold text-primary">
                    {journalist.name?.charAt(0) || '?'}
                  </div>
                )}
              </div>
              {journalist.status === 'Active' && (
                <div className="absolute -bottom-3 -right-3 bg-emerald-500 text-white p-2 rounded-xl shadow-lg">
                  <CheckCircle2 size={18} />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                <Award size={12} />
                {roleText || (isBangla ? 'সাংবাদিক' : 'Reporter')}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4 leading-tight">
                {journalist.name}
              </h1>
              {journalist.email && (
                <a
                  href={`mailto:${journalist.email}`}
                  className="inline-flex items-center gap-2 text-white/60 hover:text-primary transition-colors text-sm font-medium mb-6"
                >
                  <Mail size={14} />
                  {journalist.email}
                </a>
              )}

              {journalist.social && (
                <div className="flex items-center gap-3 justify-center md:justify-start mb-8">
                  {journalist.social.twitter && (
                    <a href={journalist.social.twitter} target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 rounded-xl flex items-center justify-center text-white/60 hover:text-primary transition-all">
                      𝕏
                    </a>
                  )}
                  {journalist.social.facebook && (
                    <a href={journalist.social.facebook} target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 rounded-xl flex items-center justify-center text-white/60 hover:text-primary transition-all text-xs font-bold">
                      f
                    </a>
                  )}
                  {journalist.social.linkedin && (
                    <a href={journalist.social.linkedin} target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 rounded-xl flex items-center justify-center text-white/60 hover:text-primary transition-all text-xs font-bold">
                      in
                    </a>
                  )}
                  {journalist.social?.website && (
                    <a href={journalist.social.website} target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 rounded-xl flex items-center justify-center text-white/60 hover:text-primary transition-all">
                      <Globe size={16} />
                    </a>
                  )}
                </div>
              )}

              {/* Stats Row */}
              <div className="flex items-center gap-6 justify-center md:justify-start">
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-2xl font-bold text-white">{articles.length}</span>
                  <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest">
                    {isBangla ? 'রিপোর্ট' : 'Reports'}
                  </span>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-2xl font-bold text-white">
                    {totalViews > 999 ? `${(totalViews / 1000).toFixed(1)}K` : totalViews}
                  </span>
                  <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest">
                    {isBangla ? 'ভিউ' : 'Total Views'}
                  </span>
                </div>
                {joinDate && (
                  <>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="flex flex-col items-center md:items-start">
                      <span className="text-sm font-bold text-white">{joinDate}</span>
                      <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest">
                        {isBangla ? 'যোগদান' : 'Joined'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-16 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left — Bio Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Bio Card */}
            {bioText && (
              <div className="bg-card border border-border rounded-[2rem] p-8">
                <h2 className="font-serif font-bold text-xl text-title mb-4 flex items-center gap-2">
                  <span className="w-8 h-1 bg-primary rounded-full inline-block" />
                  {isBangla ? 'পরিচিতি' : 'About'}
                </h2>
                <p className="text-body leading-relaxed text-base font-serif italic">{bioText}</p>
              </div>
            )}

            {/* Beat / Specialties */}
            {journalist.beats && journalist.beats.length > 0 && (
              <div className="bg-card border border-border rounded-[2rem] p-8">
                <h2 className="font-serif font-bold text-xl text-title mb-4">
                  {isBangla ? 'বিশেষজ্ঞতার বিষয়' : 'Coverage Beats'}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {journalist.beats.map((beat: string, i: number) => (
                    <span key={i} className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-bold">
                      {beat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-card border border-border rounded-[2rem] p-8 space-y-5">
              <h2 className="font-serif font-bold text-xl text-title mb-2">
                {isBangla ? 'পরিসংখ্যান' : 'At a Glance'}
              </h2>
              <div className="flex items-center gap-4 text-sm">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                  <FileText size={18} />
                </div>
                <div>
                  <p className="font-bold text-title">{articles.length} {isBangla ? 'প্রতিবেদন' : 'Published Reports'}</p>
                  <p className="text-caption text-xs">{isBangla ? 'প্রকাশিত' : 'Total published'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                  <Eye size={18} />
                </div>
                <div>
                  <p className="font-bold text-title">{totalViews.toLocaleString()} {isBangla ? 'ভিউ' : 'Views'}</p>
                  <p className="text-caption text-xs">{isBangla ? 'সর্বমোট পঠিত' : 'Across all articles'}</p>
                </div>
              </div>
              {joinDate && (
                <div className="flex items-center gap-4 text-sm">
                  <div className="w-10 h-10 bg-violet-500/10 text-violet-500 rounded-xl flex items-center justify-center shrink-0">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-title">{joinDate}</p>
                    <p className="text-caption text-xs">{isBangla ? 'যোগদানের তারিখ' : 'Joined The Reform Times'}</p>
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Right — Articles */}
          <main className="lg:col-span-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-title">
                {isBangla ? `${journalist.name}-এর রিপোর্টসমূহ` : `Reports by ${journalist.name}`}
              </h2>
              <span className="bg-surface border border-border text-caption text-xs font-bold px-3 py-1 rounded-full">
                {articles.length}
              </span>
            </div>

            {articles.length === 0 ? (
              <div className="text-center py-20 bg-card rounded-[2rem] border border-border">
                <FileText size={48} className="mx-auto text-caption/30 mb-4" />
                <h3 className="font-serif font-bold text-xl text-caption">
                  {isBangla ? 'এখনো কোনো রিপোর্ট প্রকাশিত হয়নি।' : 'No published reports yet.'}
                </h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {articles.map((article: any) => (
                  <NewsCard key={article.id} article={article} locale={locale} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
