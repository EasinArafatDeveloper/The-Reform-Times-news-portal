import React from 'react';
import Link from 'next/link';
import { ArrowRight, AlertCircle, Home } from 'lucide-react';
import './[locale]/globals.css';

export default function NotFoundFallback() {
  return (
    <html lang="en">
      <body className="bg-background text-title min-h-screen flex items-center justify-center font-sans antialiased">
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-6 py-20 relative overflow-hidden">
          {/* Abstract background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

          <div className="text-center max-w-2xl space-y-8 relative z-10">
            
            {/* Animated Badge */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-3xl text-primary animate-bounce mb-2">
              <AlertCircle size={42} />
            </div>

            <div className="space-y-3">
              <h1 className="font-serif font-black text-8xl md:text-9xl text-primary tracking-tighter select-none">
                404
              </h1>
              
              <h2 className="font-serif font-bold text-2xl md:text-4xl text-title">
                Page Not Found
              </h2>
              
              <p className="text-caption text-sm md:text-base max-w-md mx-auto leading-relaxed">
                The link you followed might be broken, or the page has been removed. Please return to the home page to select your language.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto pt-4">
              <Link 
                href="/en" 
                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-white w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:scale-[1.02] shadow-md shadow-primary/15"
              >
                <Home size={14} />
                English Portal
              </Link>
              
              <Link 
                href="/bn" 
                className="flex items-center justify-center gap-2 bg-card hover:bg-surface border border-border text-title w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:scale-[1.02]"
              >
                বাংলা পোর্টাল
                <ArrowRight size={14} className="text-primary" />
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
