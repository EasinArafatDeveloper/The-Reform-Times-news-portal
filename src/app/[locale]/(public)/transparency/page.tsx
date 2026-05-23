import React from 'react';
import { Eye, Shield, Award, DollarSign } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isBangla = locale === 'bn';
  return {
    title: isBangla ? "স্বচ্ছতা প্রতিবেদন | দি রিফর্ম টাইমস" : "Transparency Report | The Reform Times",
    description: isBangla 
      ? "দি রিফর্ম টাইমস-এর স্বচ্ছতা, নিরপেক্ষতা এবং অর্থায়নের উৎস সম্পর্কিত প্রতিবেদন পড়ুন।" 
      : "Read our transparency commitment and funding sources.",
  };
}

export default async function TransparencyPage({
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
            {isBangla ? 'স্বচ্ছতা ও জবাবদিহিতা' : 'Transparency Commitment'}
          </span>
          <h1 className="font-serif font-black text-4xl md:text-5xl text-title leading-tight">
            {isBangla ? 'স্বচ্ছতা প্রতিবেদন' : 'Transparency Report'}
          </h1>
          <p className="text-caption text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            {isBangla 
              ? 'দি রিফর্ম টাইমস তার পাঠক এবং শুভাকাঙ্ক্ষীদের কাছে আর্থিক ও সম্পাদকীয় স্বাধীনতা ও স্বচ্ছতা বজায় রাখতে অঙ্গীকারবদ্ধ।' 
              : 'The Reform Times is committed to maintaining complete financial and editorial independence for our readers.'}
          </p>
        </div>

        {/* Content Details */}
        <div className="bg-card border border-border p-8 md:p-12 rounded-[2rem] shadow-sm space-y-10">
          <section className="space-y-4">
            <h2 className="font-serif font-bold text-2xl text-title flex items-center gap-2">
              <DollarSign className="text-primary" size={20} />
              {isBangla ? '১. অর্থায়ন ও স্বাধীনতা' : '1. Funding and Independence'}
            </h2>
            <p className="text-caption text-sm leading-relaxed">
              {isBangla 
                ? 'আমরা সম্পূর্ণ নিরপেক্ষ ও স্বাধীন গণমাধ্যম। আমাদের কোনো রাজনৈতিক দল, সরকারি অনুদান বা বিশেষ কর্পোরেট স্বার্থের এজেন্ডা নেই। আমাদের কার্যক্রম সম্পূর্ণভাবে প্রতিষ্ঠাতা এবং আমাদের শুভানুধ্যায়ী ও সাধারণ পাঠকদের ক্ষুদ্র অবদানের দ্বারা পরিচালিত হয়।' 
                : 'We are completely self-funded and community-supported. We do not accept government grants, political funding, or commercial investments with editorial caveats. Our platform is supported by the founder and small contributions from our loyal readers.'}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif font-bold text-2xl text-title flex items-center gap-2">
              <Eye className="text-primary" size={20} />
              {isBangla ? '২. বাণিজ্যিক প্রভাবমুক্ত সংবাদ' : '2. Freedom from Commercial Bias'}
            </h2>
            <p className="text-caption text-sm leading-relaxed">
              {isBangla 
                ? 'কোনো বিজ্ঞাপনদাতা বা বাণিজ্যিক পার্টনার আমাদের সম্পাদকীয় নীতি বা সংবাদ প্রকাশকে প্রভাবিত করতে পারে না। আমাদের যেকোনো স্পনসরড বা পার্টনারশিপ কন্টেন্ট সম্পূর্ণ স্বচ্ছভাবে চিহ্নিত করা হয়।' 
                : 'No advertiser or corporate partner has influence over our news judgment or editorial coverage. Any sponsored partner content is strictly and clearly labeled for our audience.'}
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
