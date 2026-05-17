import React from 'react';
import { Shield, CheckCircle, FileText, Lock, Eye } from 'lucide-react';

export const metadata = {
  title: "Editorial Policy | The Reform Times",
  description: "Learn about our strict ethical standards and publishing guidelines.",
};

export default async function EditorialPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isBangla = locale === 'bn';

  return (
    <div className="bg-background min-h-screen py-16 md:py-24 transition-colors duration-300">
      <div className="container max-w-4xl space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="bg-primary/10 text-primary text-xs font-black uppercase tracking-[0.2em] py-1.5 px-4 rounded-full">
            {isBangla ? 'নীতি ও আদর্শ' : 'Standards & Ethics'}
          </span>
          <h1 className="font-serif font-black text-4xl md:text-5xl text-title leading-tight">
            {isBangla ? 'সম্পাদকীয় নীতিমালা' : 'Editorial Policy'}
          </h1>
          <p className="text-caption text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            {isBangla 
              ? 'দি রিফর্ম টাইমস নিরপেক্ষতা, সত্যতা এবং স্বচ্ছতার সর্বোচ্চ পেশাদার মান বজায় রাখতে প্রতিশ্রুতিবদ্ধ।' 
              : 'The Reform Times is dedicated to upholding the highest professional standards of objectivity, truth, and transparency.'}
          </p>
        </div>

        {/* Content Details */}
        <div className="bg-card border border-border p-8 md:p-12 rounded-[2rem] shadow-sm space-y-10">
          <section className="space-y-4">
            <h2 className="font-serif font-bold text-2xl text-title flex items-center gap-2">
              <Shield className="text-primary" size={20} />
              {isBangla ? '১. সততা ও সংবাদ যাচাইকরণ' : '1. Truth and Verification'}
            </h2>
            <p className="text-caption text-sm leading-relaxed">
              {isBangla 
                ? 'আমরা যেকোনো তথ্য প্রকাশের আগে তা অত্যন্ত নিখুঁতভাবে একাধিক নির্ভরযোগ্য উৎসের মাধ্যমে যাচাই করে নিই। কোনো প্রকার গুজবে কান না দিয়ে সম্পূর্ণ তথ্য-প্রমাণ ও দালিলিক রেকর্ডের ওপর ভিত্তি করে সংবাদ প্রকাশ করা আমাদের মূল নীতি।' 
                : 'Before publishing any dispatch, we conduct a rigorous cross-verification process using multiple credible sources. We do not engage in speculation; our reporting is anchored strictly by empirical evidence and documented records.'}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif font-bold text-2xl text-title flex items-center gap-2">
              <Lock className="text-primary" size={20} />
              {isBangla ? '২. গোপনীয়তা ও সোর্স সুরক্ষা' : '2. Confidentiality and Source Protection'}
            </h2>
            <p className="text-caption text-sm leading-relaxed">
              {isBangla 
                ? 'আমরা সংবাদদাতাদের পরিচয় সম্পূর্ণ গোপন রাখতে দৃঢ় প্রতিজ্ঞ। অনুসন্ধানী সাংবাদিকতায় যারা ঝুঁকি নিয়ে আমাদের তথ্য প্রদান করেন, তাদের সোর্স সুরক্ষার নীতি আমরা আইনের সর্বোচ্চ পর্যায় পর্যন্ত রক্ষা করি।' 
                : 'We guarantee absolute confidentiality for whistleblowers and anonymous contributors. When individuals take personal risks to supply public interest disclosures, we defend their source anonymity to the highest legal extent.'}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif font-bold text-2xl text-title flex items-center gap-2">
              <Eye className="text-primary" size={20} />
              {isBangla ? '৩. সংশোধন ও স্বচ্ছতা' : '3. Corrections and Corrections Policy'}
            </h2>
            <p className="text-caption text-sm leading-relaxed">
              {isBangla 
                ? 'আমরা সর্বদা ভুলের ঊর্ধ্বে ওঠার চেষ্টা করি, তবে কোনো ভুল হয়ে থাকলে তা অকপটে স্বীকার করি। কোনো অসঙ্গতি বা অসত্য প্রকাশিত হলে তা দ্রুততার সাথে সংশোধন করা হয় এবং সংশোধিত অংশে স্বচ্ছতার সাথে নোটিফিকেশন প্রদান করা হয়।' 
                : 'While we strive for absolute accuracy, errors can happen. When an error is identified, we commit to correcting it promptly and transparently, clearly notifying readers of the specific changes made.'}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif font-bold text-2xl text-title flex items-center gap-2">
              <CheckCircle className="text-primary" size={20} />
              {isBangla ? '৪. অ্যাডভোকেসি ও সংস্কারের ডাক' : '4. Advocacy and Call for Reforms'}
            </h2>
            <p className="text-caption text-sm leading-relaxed">
              {isBangla 
                ? 'আমরা সমাজ ও রাষ্ট্রের ইতিবাচক সংস্কারের পক্ষে কথা বলি। আমরা মানবাধিকার, সুশাসন এবং জনগণের ন্যায়ের পক্ষে ওকালতি করি। আমরা বিশ্বাস করি নির্ভীক কলমই পারে অন্যায়ের দেয়াল ভাঙতে।' 
                : 'We stand firmly on the side of positive societal and institutional reforms. We advocate for human rights, good governance, and civil justice. We believe courageous journalism is the catalyst to trigger constructive reforms.'}
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
