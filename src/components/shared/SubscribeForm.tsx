'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

interface SubscribeFormProps {
  locale: string;
  variant: 'footer' | 'sidebar';
}

export default function SubscribeForm({ locale, variant }: SubscribeFormProps) {
  const isBangla = locale === 'bn';
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      toast.error(isBangla ? 'অনুগ্রহ করে একটি সঠিক ইমেইল ঠিকানা দিন।' : 'Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          isBangla 
            ? 'সাবস্ক্রিপশন সফল হয়েছে! আপনার ইমেইল চেক করুন।' 
            : 'Subscribed successfully! Please check your inbox.'
        );
        setEmail('');
      } else {
        toast.error(data.error || (isBangla ? 'কিছু একটা ভুল হয়েছে।' : 'Something went wrong.'));
      }
    } catch {
      toast.error(isBangla ? 'সার্ভার কানেকশন ব্যর্থ হয়েছে।' : 'Server connection failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (variant === 'footer') {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto min-w-[300px] md:min-w-[450px]">
        <input 
          type="email" 
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={isBangla ? "আপনার ইমেইল লিখুন" : "Enter your work email"} 
          className="flex-1 bg-white/10 border border-white/20 px-6 py-4 rounded-xl text-sm focus:outline-none focus:border-primary transition-all backdrop-blur-md text-white placeholder:text-white/40"
          disabled={isSubmitting}
        />
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-sm hover:scale-105 transition-transform shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer min-w-[120px]"
        >
          {isSubmitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            isBangla ? 'এখনই যোগ দিন' : 'Join Now'
          )}
        </button>
      </form>
    );
  }

  // Sidebar variant
  return (
    <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-3 w-full">
      <input 
        type="email" 
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={isBangla ? "আপনার ইমেইল" : "Your work email"} 
        className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-sm placeholder:text-white/40 focus:outline-none focus:bg-white/20 transition-all text-white"
        disabled={isSubmitting}
      />
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-white text-primary font-bold py-3 rounded-xl hover:bg-opacity-90 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
      >
        {isSubmitting ? (
          <Loader2 size={16} className="animate-spin text-primary" />
        ) : (
          isBangla ? 'ফ্রি সাবস্ক্রাইব' : 'Subscribe Free'
        )}
      </button>
    </form>
  );
}
