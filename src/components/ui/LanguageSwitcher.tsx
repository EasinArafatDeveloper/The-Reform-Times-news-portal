"use client";

import { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { i18n } from '@/i18n/config';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const segments = pathname.split('/');
  const currentLocale = i18n.locales.includes(segments[1] as any) ? segments[1] : i18n.defaultLocale;

  const languages = [
    { label: 'English', code: 'en' },
    { label: 'বাংলা', code: 'bn' }
  ];

  const handleLocaleChange = (newLocale: string) => {
    setIsOpen(false);
    if (newLocale === currentLocale) return;

    // Replace the first segment with the new locale
    const newPathname = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  const currentLanguage = languages.find(lang => lang.code === currentLocale);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 cursor-pointer text-white/70 hover:text-white transition-colors font-medium focus:outline-none py-1"
      >
        <Globe size={14} className="text-primary" />
        <span className="text-[11px] font-bold uppercase tracking-wider">{currentLanguage?.label}</span>
        <ChevronDown size={10} className={cn("transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute top-full right-0 mt-2 w-32 bg-card text-title shadow-2xl rounded-md overflow-hidden z-50 border border-border animate-in fade-in zoom-in duration-200">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLocaleChange(lang.code)}
                className={cn(
                  "w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-surface hover:text-primary",
                  currentLocale === lang.code ? "bg-primary/10 text-primary" : "text-body"
                )}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
