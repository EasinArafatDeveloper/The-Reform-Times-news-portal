"use client";

import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('English');
  const router = useRouter();

  useEffect(() => {
    // Read the current locale from document.cookie on mount
    const match = document.cookie.match(new RegExp('(^| )NEXT_LOCALE=([^;]+)'));
    if (match && match[2] === 'bn') {
      setLanguage('বাংলা');
    } else {
      setLanguage('English');
    }
  }, []);

  const languages = [
    { label: 'English', code: 'en' },
    { label: 'বাংলা', code: 'bn' }
  ];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 cursor-pointer hover:text-brand-red transition-colors font-medium focus:outline-none"
      >
        <Globe size={14} />
        <span className="hidden sm:inline">{language}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-32 bg-white text-brand-navy shadow-lg rounded-md overflow-hidden z-50 border border-gray-100">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.label);
                setIsOpen(false);
                // Set cookie that never expires (effectively 1 year)
                document.cookie = `NEXT_LOCALE=${lang.code}; path=/; max-age=31536000; SameSite=Lax`;
                
                // Dispatch custom event for immediate client-side update
                window.dispatchEvent(new CustomEvent('localeChange', { detail: lang.code }));
                
                router.refresh(); // Refresh to trigger server components to re-render with new cookie
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-brand-gray-light hover:text-brand-red transition-colors ${
                language === lang.label ? 'font-bold bg-gray-50 text-brand-red' : ''
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
