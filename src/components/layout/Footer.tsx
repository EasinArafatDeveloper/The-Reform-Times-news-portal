import Link from 'next/link';
import { Mail, ArrowUpRight, ShieldCheck, Globe, Users } from 'lucide-react';
import { TwitterIcon, FacebookIcon, InstagramIcon, YoutubeIcon } from '@/components/ui/icons';
import { categories } from '@/lib/data';
import { getLocalizedContent, getTranslation } from '@/lib/i18n-utils';
import SubscribeForm from '@/components/shared/SubscribeForm';

export function Footer({ locale = 'bn' }: { locale?: string }) {
  const t = (key: string) => getTranslation(locale, key);
  const isBangla = locale === 'bn';

  return (
    <footer className="bg-secondary text-white relative overflow-hidden">
      {/* Editorial Grid Texture */}
      <div className="absolute inset-0 bg-grid-subtle opacity-5 pointer-events-none"></div>
      
      {/* Newsletter Bar - Pre-footer CTA */}
      <div className="border-b border-white/5 bg-white/5 relative z-10">
        <div className="container py-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center lg:text-left">
            <h3 className="text-2xl font-serif font-bold mb-2 text-white">
              {isBangla ? 'আমাদের নিউজরুমে সাবস্ক্রাইব করুন' : 'Subscribe to our Newsroom'}
            </h3>
            <p className="text-white/60 text-sm">
              {isBangla 
                ? 'স্বচ্ছতা এবং সত্যের প্রতি নিবেদিত সচেতন নাগরিকদের একটি ক্রমবর্ধমান সম্প্রদায়ে যোগ দিন।' 
                : 'Join a growing community of informed citizens dedicated to transparency and truth.'}
            </p>
          </div>
          <SubscribeForm locale={locale} variant="footer" />
        </div>
      </div>

      <div className="container py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-8">
            <Link href={`/${locale}`} className="inline-block">
              <img 
                src="/dark mode logo.png" 
                alt="The Reform Times" 
                className="h-[90px] md:h-[130px] w-auto object-contain -my-5 block" 
              />
            </Link>
            <p className="text-white/50 text-base leading-relaxed font-medium">
              {isBangla 
                ? 'আমরা একটি স্বতন্ত্র সংবাদ সংস্থা যা অ্যাডভোকেসি সাংবাদিকতা, মানবাধিকার এবং পদ্ধতিগত স্বচ্ছতার জন্য নিবেদিত। আমাদের লক্ষ্য হলো আমাদের প্রজন্মের নির্ধারক ইস্যুগুলো নিয়ে অনুসন্ধান করা।'
                : 'We are an independent news organization dedicated to advocacy journalism, human rights, and systemic transparency. Our mission is to investigate the issues that define our generation.'}
            </p>
            <div className="flex items-center gap-4">
              {[TwitterIcon, FacebookIcon, InstagramIcon, YoutubeIcon].map((Icon, i) => (
                <Link key={i} href="#" className="w-11 h-11 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-primary hover:-translate-y-1 transition-all border border-white/10">
                  <Icon width={18} height={18} />
                </Link>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-4 pt-4">
               <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                  <ShieldCheck size={16} className="text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                    {isBangla ? 'ভেরিফাইড প্রেস' : 'Verified Press'}
                  </span>
               </div>
               <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                  <Globe size={16} className="text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                    {isBangla ? 'গ্লোবাল নেটওয়ার্ক' : 'Global Network'}
                  </span>
               </div>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-10">
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-8">{t('sections')}</h4>
              <ul className="space-y-4">
                {categories.slice(0, 7).map((category) => (
                  <li key={category.id}>
                    <Link href={`/${locale}/category/${category.slug}`} className="text-white/50 hover:text-white transition-colors text-sm font-bold flex items-center group">
                      {getLocalizedContent<string>(category.name, locale)}
                      <ArrowUpRight size={14} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all ml-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-8">{t('organization')}</h4>
              <ul className="space-y-4">
                {[
                  { name: t('about'), href: `/${locale}/about` },
                  { name: t('contact'), href: `/${locale}/contact` },
                  { name: t('editorialPolicy'), href: `/${locale}/editorial-policy` },
                  { name: t('careers'), href: `/${locale}/careers` },
                  { name: t('transparency'), href: `/${locale}/transparency` },
                ].map((item, i) => (
                  <li key={i}>
                    <Link href={item.href} className="text-white/50 hover:text-white transition-colors text-sm font-bold">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-8">
                {isBangla ? 'যোগাযোগ ও সহায়তা' : 'Contact & Support'}
              </h4>
              <div className="space-y-6">
                <div>
                   <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">
                    {isBangla ? 'নিউজ টিপস' : 'News Tips'}
                   </p>
                   <p className="text-sm font-bold text-white/80"><a href="mailto:thereformtimes@gmail.com" className="hover:text-primary transition-colors">thereformtimes@gmail.com</a></p>
                </div>
                <div>
                   <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">
                    {isBangla ? 'সাধারণ অনুসন্ধান' : 'General Inquiries'}
                   </p>
                   <p className="text-sm font-bold text-white/80"><a href="mailto:thereformtimes@gmail.com" className="hover:text-primary transition-colors">thereformtimes@gmail.com</a></p>
                </div>
                <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl">
                   <p className="text-xs font-bold text-primary mb-2 flex items-center gap-2">
                      <Users size={14} />
                      {isBangla ? 'মেম্বার পোর্টাল' : 'Member Portal'}
                   </p>
                   <p className="text-[10px] text-white/60 mb-3">
                    {isBangla ? 'আপনার সাবস্ক্রিপশন এবং পছন্দগুলো ম্যানেজ করুন।' : 'Manage your subscription and reading preferences.'}
                   </p>
                   <Link href={`/${locale}/login`} className="text-[10px] font-black uppercase tracking-widest text-white hover:text-primary transition-colors">
                    {isBangla ? 'অ্যাকাউন্ট অ্যাক্সেস করুন' : 'Access Account'} &rarr;
                   </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-12 mt-20 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <p className="text-white/30 text-[11px] font-bold tracking-wide">
              &copy; {new Date().getFullYear()} The Reform Times Media Organization. {t('allRightsReserved')}
            </p>
            <div className="flex gap-8 text-[11px] font-bold uppercase tracking-widest text-white/30">
              <Link href={`/${locale}/privacy`} className="hover:text-primary transition-colors">{t('privacyPolicy')}</Link>
              <Link href={`/${locale}/terms`} className="hover:text-primary transition-colors">{t('termsOfService')}</Link>
              <Link href={`/${locale}/cookies`} className="hover:text-primary transition-colors">{t('cookieSettings')}</Link>
            </div>
          </div>
          
          <div className="text-white/30 text-[10px] font-medium max-w-xs text-center md:text-right">
             {isBangla 
              ? 'দ্য রিফর্ম টাইমস একটি স্বতন্ত্র অলাভজনক নিউজরেট। ২০২৪ সাল থেকে সত্যকে শক্তিশালী করছে।'
              : 'The Reform Times is an independent non-profit newsroom. Empowering truth since 2024.'}
          </div>
        </div>
      </div>
    </footer>
  );
}
