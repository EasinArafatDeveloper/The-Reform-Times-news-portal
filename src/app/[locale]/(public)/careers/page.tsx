import React from 'react';
import { Briefcase, Heart, Users, Mail } from 'lucide-react';

export const metadata = {
  title: "Careers | The Reform Times",
  description: "Join our team of independent journalists and advocates.",
};

export default async function CareersPage({
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
            {isBangla ? 'পেশা ও সুযোগ' : 'Join Our Mission'}
          </span>
          <h1 className="font-serif font-black text-4xl md:text-5xl text-title leading-tight">
            {isBangla ? 'আমাদের সাথে কাজ করুন' : 'Work With Us'}
          </h1>
          <p className="text-caption text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            {isBangla 
              ? 'স্বাধীন সাংবাদিকতা ও সামাজিক সংস্কারের ক্ষেত্রে আপনার অবদান রাখার সুবর্ণ সুযোগ।' 
              : 'Unleash your potential in independent advocacy journalism and drive real societal change.'}
          </p>
        </div>

        {/* Content Details */}
        <div className="bg-card border border-border p-8 md:p-12 rounded-[2rem] shadow-sm space-y-10">
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto">
              <Briefcase size={28} />
            </div>
            <h3 className="font-serif font-bold text-xl md:text-2xl text-title">
              {isBangla ? 'বর্তমানে কোনো পদ খালি নেই' : 'No Openings Right Now'}
            </h3>
            <p className="text-caption text-sm max-w-md mx-auto leading-relaxed">
              {isBangla 
                ? 'বর্তমানে আমাদের কোনো অফিশিয়াল পদ খালি নেই। তবে আপনি যদি একজন দক্ষ কলামিস্ট বা ফ্রিল্যান্স রিপোর্টার হয়ে থাকেন, আপনার জীবনবৃত্তান্ত ও কন্টেন্ট পাঠিয়ে রাখতে পারেন।' 
                : 'We do not have any open positions at this moment. However, if you are a writer, researcher, or freelance reporter, feel free to drop your profile for future opportunities.'}
            </p>
            <div className="pt-4">
              <a 
                href="mailto:thereformtimes@gmail.com" 
                className="inline-flex items-center gap-2 bg-primary text-white text-xs font-bold py-3 px-6 rounded-xl hover:scale-[1.02] transition-transform shadow-md shadow-primary/20"
              >
                <Mail size={14} />
                {isBangla ? 'বায়োডাটা পাঠান' : 'Submit Resume'}
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
