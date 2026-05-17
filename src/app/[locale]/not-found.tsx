'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Home, FileText, AlertCircle } from 'lucide-react';

export default function NotFound() {
  const pathname = usePathname();
  const isBangla = pathname?.split('/').includes('bn') || false;
  const locale = isBangla ? 'bn' : 'en';

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center bg-background px-6 py-20 transition-colors duration-300 relative overflow-hidden">
      {/* Abstract background blobs for premium feel */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="text-center max-w-2xl space-y-8 relative z-10">
        
        {/* Animated Error Badge */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-3xl text-primary animate-bounce mb-2">
          <AlertCircle size={42} />
        </div>

        <div className="space-y-3">
          {/* Big Premium 404 Header */}
          <h1 className="font-serif font-black text-8xl md:text-9xl text-primary tracking-tighter drop-shadow-sm select-none">
            404
          </h1>
          
          <h2 className="font-serif font-bold text-2xl md:text-4xl text-title">
            {isBangla ? 'পাতাটি খুঁজে পাওয়া যায়নি' : 'Page Not Found'}
          </h2>
          
          <p className="text-caption text-sm md:text-base max-w-md mx-auto leading-relaxed">
            {isBangla 
              ? 'দুঃখিত, আপনি যে লিংকটি খুঁজছেন তা হয়তো পরিবর্তন করা হয়েছে, মুছে ফেলা হয়েছে অথবা সাময়িকভাবে অনুপলব্ধ।' 
              : 'We apologize, but the page you are looking for might have been removed, renamed, or is temporarily unavailable.'}
          </p>
        </div>

        {/* Buttons Grid */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto pt-4">
          <Link 
            href={`/${locale}`} 
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-white w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:scale-[1.02] shadow-md shadow-primary/15 shrink-0"
          >
            <Home size={14} />
            {isBangla ? 'হোমপেজে ফিরে যান' : 'Return to Homepage'}
          </Link>
          
          <Link 
            href={`/${locale}/news`} 
            className="flex items-center justify-center gap-2 bg-card hover:bg-surface border border-border text-title w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:scale-[1.02]"
          >
            <FileText size={14} className="text-primary" />
            {isBangla ? 'সর্বশেষ সংবাদ পড়ুন' : 'Read Latest News'}
          </Link>
        </div>

        {/* Footer Helpline */}
        <div className="pt-8 border-t border-border/80">
          <p className="text-xs text-caption font-semibold">
            {isBangla ? 'এটি একটি ভুল মনে হচ্ছে?' : 'Think this is a mistake?'} {' '}
            <Link href={`/${locale}/contact`} className="text-primary hover:underline font-bold transition-all">
              {isBangla ? 'আমাদের নিউজরুমে জানান।' : 'Contact our newsroom.'}
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
