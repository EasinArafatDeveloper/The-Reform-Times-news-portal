"use client";

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
                {isBangla 
                  ? 'ম্যারাথন অধিবেশনের পর সিনেটে পাস হলো ঐতিহাসিক জলবায়ু সংস্কার বিল • কৃষিপ্রধান অঞ্চলে ক্রমবর্ধমান পানি সংকট নিয়ে সতর্কতা জারি করল জাতিসংঘ • স্বাস্থ্যসেবা সরবরাহ ব্যবস্থায় পদ্ধতিগত ব্যর্থতার চিত্র প্রকাশ পেল একটি বড় অনুসন্ধানী প্রতিবেদনে'
                  : 'Senate passes historic climate reform bill after marathon session • UN sounds alarm on escalating water crisis in agricultural heartland • Major investigation reveals systematic failures in healthcare supply chain'
                }
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
