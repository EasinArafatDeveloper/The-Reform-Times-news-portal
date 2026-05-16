import { format } from 'date-fns';
import { TwitterIcon, FacebookIcon, InstagramIcon, YoutubeIcon } from '@/components/ui/icons';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import Link from 'next/link';

export function Header() {
  const currentDate = new Date();

  return (
    <div className="relative z-[60] bg-brand-navy text-white text-xs py-2 px-4">
      <div className="container flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="hidden md:inline-block border-r border-white/20 pr-4">
            {format(currentDate, 'EEEE, MMMM d, yyyy')}
          </span>
          <div className="flex items-center gap-2">
            <span className="bg-brand-red text-white font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider text-[10px]">Breaking</span>
            <span className="truncate max-w-[200px] md:max-w-[400px]">
              Senate Passes Historic Climate Reform Bill After Marathon Session...
            </span>
          </div>
        </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-3 border-r border-white/20 pr-4">
              <Link href="#" className="hover:text-brand-red transition-colors"><TwitterIcon width={14} height={14} /></Link>
              <Link href="#" className="hover:text-brand-red transition-colors"><FacebookIcon width={14} height={14} /></Link>
              <Link href="#" className="hover:text-brand-red transition-colors"><InstagramIcon width={14} height={14} /></Link>
              <Link href="#" className="hover:text-brand-red transition-colors"><YoutubeIcon width={14} height={14} /></Link>
            </div>
            <LanguageSwitcher />
          </div>
      </div>
    </div>
  );
}
