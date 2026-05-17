import React from 'react';
import clientPromise from "@/lib/mongodb";
import { Mail, Shield, Target, Compass, Award, Star, Quote, ArrowRight } from "lucide-react";
import Link from 'next/link';

export const metadata = {
  title: "About Us | The Reform Times",
  description: "Learn about our mission, vision, and Kazi Salman, our Editor-in-Chief.",
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isBangla = locale === 'bn';

  // 1. Fetch Owner/Editor Profile from MongoDB
  let ownerProfile = {
    name: 'Kazi Salman',
    avatar: '',
    role: isBangla ? 'সাংবাদিকতার শিক্ষার্থী ও প্রতিষ্ঠাতা' : 'Journalism Student & Founder',
    bio: isBangla 
      ? 'কাজী সালমান একজন উৎসর্গীকৃত সাংবাদিকতার শিক্ষার্থী এবং \'দি রিফর্ম টাইমস\'-এর স্বপ্নদ্রষ্টা প্রতিষ্ঠাতা। সত্য, স্বচ্ছতা এবং স্বাধীন প্রতিবেদনের প্রতি গভীরভাবে অনুপ্রাণিত সালমান তার ভবিষ্যৎ ক্যারিয়ার হিসেবে সাংবাদিকতাকে বেছে নিয়েছেন এবং এই বিষয়ে পড়াশোনা করছেন। এই গণমাধ্যমের সাহায্যে তিনি দেশের কল্যাণে ও মানুষের সেবায় ভালো কিছু করতে এবং সততার সাথে একটি আপসহীন প্লাটফর্ম গড়ে তুলতে প্রতিজ্ঞাবদ্ধ।'
      : 'Kazi Salman is a dedicated journalism student and the visionary founder of \'The Reform Times\'. Passionate about truth, transparency, and independent reporting, he is actively studying and pursuing journalism as his future career path. Through this portal, he is committed to serving his country and its people by building an uncompromising space for honest news, advocacy, and positive reform.'
  };

  try {
    const client = await clientPromise;
    const db = client.db('the-reform-times-news');
    const settings = await db.collection('site_settings').findOne({ type: 'owner_profile' });
    if (settings) {
      ownerProfile = {
        name: settings.name || 'Kazi Salman',
        avatar: settings.avatar || '',
        role: isBangla 
          ? (settings.role?.bn || 'প্রধান সম্পাদক ও প্রতিষ্ঠাতা') 
          : (settings.role?.en || 'Editor-in-Chief & Founder'),
        bio: isBangla 
          ? (settings.bio?.bn || ownerProfile.bio) 
          : (settings.bio?.en || ownerProfile.bio)
      };
    }
  } catch (err) {
    console.error('Error fetching settings for About page:', err);
  }

  return (
    <div className="bg-background min-h-screen py-16 md:py-24 transition-colors duration-300">
      <div className="container max-w-6xl space-y-20">
        
        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <span className="bg-primary/10 text-primary text-xs font-black uppercase tracking-[0.2em] py-1.5 px-4 rounded-full">
            {isBangla ? 'আমাদের ইতিহাস ও লক্ষ্য' : 'Our Story & Purpose'}
          </span>
          <h1 className="font-serif font-black text-4xl md:text-6xl text-title leading-tight tracking-tight">
            {isBangla ? 'সত্যের সন্ধানে আপসহীন সাংবাদিকতা' : 'Uncompromising Journalism in Search of Truth'}
          </h1>
          <p className="text-caption text-base md:text-lg leading-relaxed font-sans">
            {isBangla 
              ? 'আমরা বিশ্বাস করি একটি মুক্ত ও স্বাধীন গণমাধ্যমই পারে সমাজকে সঠিক পথে পরিচালিত করতে। কোনো চাপ বা আপস ছাড়া সঠিক তথ্য মানুষের কাছে পৌঁছে দেওয়াই আমাদের ব্রত।' 
              : 'We believe a free and independent press is the cornerstone of an accountable society. Our dedication is delivering verified facts without bias or compromise.'}
          </p>
        </div>

        {/* Editor-in-Chief Spotlight Profile Section */}
        <section className="bg-card border border-border p-8 md:p-12 rounded-[2.5rem] shadow-sm relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-center relative z-10">
            {/* Image Column */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-primary to-rose-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-3xl bg-surface border-2 border-border overflow-hidden flex items-center justify-center">
                  {ownerProfile.avatar ? (
                    <img 
                      src={ownerProfile.avatar} 
                      alt={ownerProfile.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex flex-col items-center justify-center text-primary">
                      <span className="text-6xl font-serif font-black">{ownerProfile.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Content Column */}
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                  <Star size={14} />
                  {isBangla ? 'নেতৃত্ব ও সম্পাদনা' : 'Editorial Leadership'}
                </div>
                <h2 className="font-serif font-black text-3xl md:text-4xl text-title">
                  {ownerProfile.name}
                </h2>
                <p className="text-primary font-semibold text-sm md:text-base">
                  {ownerProfile.role}
                </p>
              </div>

              <div className="relative pl-6 border-l-2 border-primary/40 italic text-caption text-sm md:text-base leading-relaxed font-serif py-1">
                <Quote className="absolute -left-2 -top-3 text-primary/20 w-8 h-8 -z-10" />
                {ownerProfile.bio}
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <a 
                  href="mailto:thereformtimes@gmail.com" 
                  className="inline-flex items-center gap-2 bg-primary text-white text-xs font-bold py-3 px-6 rounded-xl hover:scale-[1.02] transition-transform shadow-md shadow-primary/20"
                >
                  <Mail size={14} />
                  {isBangla ? 'যোগাযোগ করুন' : 'Contact Editor'}
                </a>
                
                <Link 
                  href={`/${locale}/contact`}
                  className="inline-flex items-center gap-2 bg-surface hover:bg-surface-hover border border-border text-title text-xs font-bold py-3 px-6 rounded-xl transition-all"
                >
                  {isBangla ? 'নিউজ টিপস পাঠান' : 'Submit a News Tip'}
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Mission and Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Mission Card */}
          <div className="bg-card border border-border p-8 md:p-10 rounded-[2rem] shadow-sm space-y-6 group hover:border-primary/40 transition-colors">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0 transition-transform duration-500 group-hover:scale-110">
              <Target size={26} />
            </div>
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-2xl text-title">
                {isBangla ? 'আমাদের লক্ষ্য (Mission)' : 'Our Mission'}
              </h3>
              <p className="text-caption text-sm leading-relaxed font-sans">
                {isBangla 
                  ? 'জনসাধারণকে স্বাধীন, নির্ভরযোগ্য এবং তথ্যভিত্তিক অনুসন্ধানী সাংবাদিকতার মাধ্যমে ক্ষমতায়ন করা। আমরা ক্ষমতার অপব্যবহার উন্মোচন করি, মানবাধিকার রক্ষা করি এবং সমাজে কার্যকর ইতিবাচক সংস্কার বা রিফর্ম গঠনে সাহায্য করি।' 
                  : 'Empowering citizens through verified, independent, and investigative advocacy journalism. We challenge authority, protect fundamental rights, and inspire meaningful institutional reforms.'}
              </p>
            </div>
          </div>

          {/* Vision Card */}
          <div className="bg-card border border-border p-8 md:p-10 rounded-[2rem] shadow-sm space-y-6 group hover:border-primary/40 transition-colors">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0 transition-transform duration-500 group-hover:scale-110">
              <Compass size={26} />
            </div>
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-2xl text-title">
                {isBangla ? 'আমাদের স্বপ্ন (Vision)' : 'Our Vision'}
              </h3>
              <p className="text-caption text-sm leading-relaxed font-sans">
                {isBangla 
                  ? 'একটি স্বচ্ছ, জবাবদিহিতামূলক এবং মুক্ত সমাজ গঠন করা—যেখানে প্রতিটি কণ্ঠস্বর সত্য ও ন্যায়ের নির্ভীক পরিবেশ খুঁজে পাবে এবং স্বাধীন গণমাধ্যম কোনো পক্ষপাত বা প্রতিবন্ধকতা ছাড়াই কাজ করতে পারবে।' 
                  : 'A transparent, accountable society where truth is celebrated, justice is uncompromised, and independent journalism thrives freely without systemic censorship or commercial influence.'}
              </p>
            </div>
          </div>
        </div>

        {/* Editorial Values Section */}
        <section className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="font-serif font-bold text-3xl text-title">
              {isBangla ? 'আমাদের সম্পাদকীয় মূল্যবোধ' : 'Our Editorial Values'}
            </h2>
            <p className="text-caption text-xs md:text-sm">
              {isBangla 
                ? 'দি রিফর্ম টাইমস-এর প্রতিটি প্রতিবেদন এই আপসহীন নীতিমালার ওপর ভিত্তি করে রচিত হয়।' 
                : 'Every single dispatch from The Reform Times is anchored by these rigid ethical pillars.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Value 1 */}
            <div className="bg-card border border-border p-6 rounded-2xl text-center space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto">
                <Shield size={18} />
              </div>
              <h4 className="font-bold text-title text-sm">{isBangla ? 'সত্য ও নির্ভুলতা' : 'Truth & Accuracy'}</h4>
              <p className="text-caption text-xs leading-relaxed">
                {isBangla 
                  ? 'যাচাই ছাড়া কোনো তথ্য প্রকাশ করা হয় না। সততা আমাদের প্রথম মূলধন।' 
                  : 'We verify every quote, statistic, and source. Integrity is non-negotiable.'}
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-card border border-border p-6 rounded-2xl text-center space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto">
                <Award size={18} />
              </div>
              <h4 className="font-bold text-title text-sm">{isBangla ? 'পূর্ণ স্বাধীনতা' : 'Absolute Independence'}</h4>
              <p className="text-caption text-xs leading-relaxed">
                {isBangla 
                  ? 'আমরা কোনো রাজনৈতিক বা বাণিজ্যিক গোষ্ঠীর অনুদান বা স্বার্থে কাজ করি না।' 
                  : 'Free from government sponsorship, corporate bias, or political funding.'}
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-card border border-border p-6 rounded-2xl text-center space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto">
                <Compass size={18} />
              </div>
              <h4 className="font-bold text-title text-sm">{isBangla ? 'জবাবদিহিতা' : 'Editorial Integrity'}</h4>
              <p className="text-caption text-xs leading-relaxed">
                {isBangla 
                  ? 'আমরা আমাদের ভুলগুলোর দায়িত্ব নিই এবং অবিলম্বে তা সংশোধন করি।' 
                  : 'Responsible directly to our readers. We transparently correct any errors.'}
              </p>
            </div>

            {/* Value 4 */}
            <div className="bg-card border border-border p-6 rounded-2xl text-center space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto">
                <Star size={18} />
              </div>
              <h4 className="font-bold text-title text-sm">{isBangla ? 'সাহসী অনুসন্ধান' : 'Fearless Reporting'}</h4>
              <p className="text-caption text-xs leading-relaxed">
                {isBangla 
                  ? 'হুমকি বা ভীতি প্রদর্শনের সামনে আমরা সত্য প্রকাশে পিছপা হই না।' 
                  : 'Publishing stories that matter, even in the face of pressure or intimidation.'}
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
