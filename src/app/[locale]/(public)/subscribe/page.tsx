'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, ShieldCheck, Newspaper, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useParams } from 'next/navigation';

export default function SubscribePage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const isBangla = locale === 'bn';

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error(isBangla ? 'অনুগ্রহ করে আপনার ইমেইল এড্রেসটি লিখুন।' : 'Please enter your email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(
          isBangla 
            ? 'অভিনন্দন! আপনি সফলভাবে আমাদের নিউজরুমে সাবস্ক্রাইব করেছেন।' 
            : 'Congratulations! You have successfully subscribed to our newsroom.'
        );
        setIsSuccess(true);
        setEmail('');
      } else {
        toast.error(data.error || (isBangla ? 'সাবস্ক্রাইব করতে ব্যর্থ হয়েছে।' : 'Failed to subscribe.'));
      }
    } catch (err) {
      console.error(err);
      toast.error(isBangla ? 'একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।' : 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface min-h-[80vh] flex items-center justify-center py-16 px-4 transition-colors duration-300">
      <div className="max-w-md w-full bg-card border border-border p-8 md:p-10 rounded-[2.5rem] shadow-premium transition-colors duration-300 relative overflow-hidden">
        {/* Subtle Decorative Editorial Glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

        {!isSuccess ? (
          <div className="space-y-8">
            {/* Header Icon */}
            <div className="flex justify-center">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Newspaper size={28} />
              </div>
            </div>

            {/* Header Text */}
            <div className="text-center space-y-3">
              <h1 className="text-3xl font-serif font-bold text-title tracking-tight">
                {isBangla ? 'আমাদের নিউজরুমে সাবস্ক্রাইব করুন' : 'Subscribe to our Newsroom'}
              </h1>
              <p className="text-caption text-sm leading-relaxed">
                {isBangla 
                  ? 'সরাসরি আপনার ইনবক্সে সর্বশেষ খবর, গুরুত্বপূর্ণ আপডেট এবং সাপ্তাহিক প্রতিবেদন পান।' 
                  : 'Get the latest news, important updates, and weekly stories directly in your inbox.'}
              </p>
            </div>

            {/* Subscription Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-caption/50" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isBangla ? 'আপনার ইমেল এড্রেসটি লিখুন' : 'Enter your email address'} 
                  className="w-full bg-surface border border-border pl-12 pr-4 py-4 text-sm text-body rounded-2xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-caption/40"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-4 font-bold text-sm rounded-2xl hover:bg-primary/95 transition-all shadow-md shadow-primary/15 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isBangla ? 'সাবস্ক্রাইব হচ্ছে...' : 'Subscribing...'}
                  </>
                ) : (
                  isBangla ? 'সাবস্ক্রাইব করুন' : 'Subscribe'
                )}
              </button>
            </form>

            {/* Trust Badges & Small Note */}
            <div className="pt-6 border-t border-border space-y-4">
              <div className="flex items-center justify-center gap-4 text-xs font-semibold text-caption">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-green-500" />
                  <span>{isBangla ? 'ফ্রি সাবস্ক্রিপশন' : 'Free subscription'}</span>
                </div>
                <div className="w-1.5 h-1.5 bg-border rounded-full"></div>
                <div className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-primary" />
                  <span>{isBangla ? 'কোনো স্প্যাম নেই' : 'No spam'}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6 py-4 animate-in fade-in zoom-in-95 duration-500">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                <CheckCircle2 size={36} className="animate-bounce" />
              </div>
            </div>

            {/* Success Message */}
            <div className="space-y-2">
              <h2 className="text-2xl font-serif font-bold text-title">
                {isBangla ? 'আপনাকে ধন্যবাদ!' : 'Thank You!'}
              </h2>
              <p className="text-body text-sm leading-relaxed">
                {isBangla 
                  ? 'আপনি সফলভাবে সাবস্ক্রাইব করেছেন। এখন থেকে নিউজরুমের গুরুত্বপূর্ণ আপডেট আপনার ইনবক্সে চলে যাবে।' 
                  : 'You have successfully subscribed. You will now receive important newsroom updates directly in your inbox.'}
              </p>
            </div>

            {/* Back Button */}
            <button 
              onClick={() => setIsSuccess(false)}
              className="inline-block text-xs font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors cursor-pointer"
            >
              &larr; {isBangla ? 'ফিরে যান' : 'Go back'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
