"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { bn as bnLocale } from 'date-fns/locale';
import { TwitterIcon, FacebookIcon, InstagramIcon, YoutubeIcon } from '@/components/ui/icons';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { i18n } from '@/i18n/config';

export function Header() {
  const currentDate = new Date();
  const pathname = usePathname();
  
  // Extract locale from pathname
  const segments = pathname.split('/');
  const locale = i18n.locales.includes(segments[1] as any) ? segments[1] : i18n.defaultLocale;
  const isBangla = locale === 'bn';

  const [tickerText, setTickerText] = useState<string>('');

  useEffect(() => {
    async function loadBreakingNews() {
      try {
        const res = await fetch('/api/articles?type=Breaking%20News');
        if (res.ok) {
          const articles = await res.json();
          const published = Array.isArray(articles) 
            ? articles.filter((a: any) => a.status === 'Published')
            : [];
            
          if (published.length > 0) {
            const text = published.map((a: any) => {
              if (typeof a.title === 'string') return a.title;
              return a.title[locale] || a.title.bn || a.title.en || '';
            }).filter(Boolean).join(' • ');
            setTickerText(text);
          } else {
            // Fallback: fetch latest general news if no breaking news is active
            const fallbackRes = await fetch('/api/articles');
            if (fallbackRes.ok) {
              const allNews = await fallbackRes.json();
              const latest = Array.isArray(allNews)
                ? allNews.filter((a: any) => a.status === 'Published').slice(0, 3)
                : [];
              const fallbackText = latest.map((a: any) => {
                if (typeof a.title === 'string') return a.title;
                return a.title[locale] || a.title.bn || a.title.en || '';
              }).filter(Boolean).join(' • ');
              setTickerText(fallbackText);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching breaking news:', err);
      }
    }
    loadBreakingNews();
  }, [locale]);

  return (
    <div className="relative z-[60] bg-secondary text-white text-[10px] md:text-[11px] py-1.5 px-4 border-b border-white/5">
      <div className="container flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-2 border-r border-white/10 pr-6">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
            <span className="font-bold text-white tracking-wide">
              {format(currentDate, isBangla ? 'EEEE, d MMMM, yyyy' : 'EEEE, MMMM d, yyyy', { 
                locale: isBangla ? bnLocale : undefined 
              })}
            </span>
          </div>
          
          <div className="flex items-center gap-3 group cursor-pointer overflow-hidden">
            <span className="flex-shrink-0 bg-primary text-white font-black px-2 py-0.5 rounded-sm uppercase tracking-[0.1em] text-[8px] md:text-[9px] shadow-sm">
              {isBangla ? 'সরাসরি ব্রেকিং' : 'Live Breaking'}
            </span>
            <div className="flex items-center gap-4 animate-ticker hover:pause">
              <span className="truncate max-w-[150px] sm:max-w-[300px] md:max-w-[500px] lg:max-w-[700px] text-white/80 font-medium hover:text-white transition-colors">
                {tickerText || (isBangla 
                  ? 'সংবাদ লোড হচ্ছে...' 
                  : 'Loading latest updates...'
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 border-r border-white/10 pr-6">
            <Link href="#" className="text-white/50 hover:text-white transition-colors"><TwitterIcon width={13} height={13} /></Link>
            <Link href="#" className="text-white/50 hover:text-white transition-colors"><FacebookIcon width={13} height={13} /></Link>
            <Link href="#" className="text-white/50 hover:text-white transition-colors"><InstagramIcon width={13} height={13} /></Link>
            <Link href="#" className="text-white/50 hover:text-white transition-colors"><YoutubeIcon width={13} height={13} /></Link>
          </div>
          <div className="flex items-center">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </div>
  );
}
