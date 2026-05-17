'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

export default function CookieConsentBanner() {
  const params = useParams();
  const pathname = usePathname();
  const locale = (params?.locale as string) || 'en';
  const isBangla = locale === 'bn';

  const [isVisible, setIsVisible] = useState(false);

  // Check if consent has already been accepted
  useEffect(() => {
    // 1. Don't show cookie banner on admin pages
    if (pathname?.includes('/admin')) {
      setIsVisible(false);
      return;
    }

    // Helper to get cookies
    const getCookie = (name: string) => {
      if (typeof document === 'undefined') return null;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const consent = getCookie('cookie_consent') || localStorage.getItem('cookie_consent');
    if (consent !== 'accepted') {
      // Delay slightly for premium entrance transition
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const handleAccept = () => {
    // Set cookie expiry for 1 year
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    
    // 1. Save in document.cookie
    document.cookie = `cookie_consent=accepted; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax; Secure`;
    
    // 2. Save in localStorage
    localStorage.setItem('cookie_consent', 'accepted');

    // 3. Set other initial defaults if they don't exist
    if (!localStorage.getItem('preferred_language')) {
      localStorage.setItem('preferred_language', locale);
    }
    
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 w-full bg-card border-t border-border shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom duration-500">
      <div className="container max-w-7xl py-5 px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Text and Icon Column */}
          <div className="flex items-center gap-4 text-left w-full md:w-auto">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-base text-title">
                {isBangla ? 'আমরা কুকি ব্যবহার করি' : 'We use cookies'}
              </h3>
              <p className="text-body text-xs md:text-sm leading-relaxed max-w-3xl">
                {isBangla 
                  ? 'আপনার পাঠ্য অভিজ্ঞতা উন্নত করতে, ভাষা পছন্দ মনে রাখতে এবং ওয়েবসাইটের ট্রাফিক বিশ্লেষণ করতে আমরা কুকি ব্যবহার করি।' 
                  : 'We use cookies to improve your reading experience, remember your language preference, and analyze website traffic.'}
              </p>
            </div>
          </div>

          {/* Action Buttons Column */}
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end">
            <Link 
              href={`/${locale}/cookie-policy`}
              className="text-center text-xs font-bold text-caption hover:text-title py-3 px-4 hover:bg-surface rounded-xl transition-colors whitespace-nowrap"
            >
              {isBangla ? 'কুকি পলিসি' : 'Cookie Policy'}
            </Link>
            
            <button 
              onClick={handleAccept}
              className="w-full md:w-auto bg-primary text-white font-bold text-xs py-3.5 px-6 rounded-xl hover:bg-primary/95 transition-all shadow-md shadow-primary/15 cursor-pointer text-center whitespace-nowrap"
            >
              {isBangla ? 'সব কুকি গ্রহণ করুন' : 'Accept All Cookies'}
            </button>
            
            <button 
              onClick={() => setIsVisible(false)}
              className="text-caption hover:text-title p-2 rounded-lg hover:bg-surface transition-colors cursor-pointer hidden md:block"
              title={isBangla ? 'বন্ধ করুন' : 'Close'}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
