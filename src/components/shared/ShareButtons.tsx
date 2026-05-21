"use client";

import { useState } from 'react';
import { Mail, Check, Link as LinkIcon } from 'lucide-react';
import { TwitterIcon, FacebookIcon, LinkedinIcon } from "@/components/ui/icons";
import { toast } from 'react-hot-toast';

interface ShareButtonsProps {
  url: string;
  title: string;
  isBangla: boolean;
}

export function ShareButtons({ url, title, isBangla }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success(isBangla ? 'লিঙ্ক কপি করা হয়েছে!' : 'Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error(isBangla ? 'লিঙ্ক কপি করা যায়নি' : 'Failed to copy link');
    }
  };

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
  };

  return (
    <div className="lg:w-16 shrink-0 order-2 lg:order-1 flex lg:flex-col items-center gap-4 lg:sticky lg:top-32 h-fit border-t lg:border-t-0 border-border pt-8 lg:pt-0 w-full lg:w-auto justify-center lg:justify-start">
      <span className="text-[10px] uppercase font-bold text-caption tracking-widest lg:-rotate-90 lg:mb-6 whitespace-nowrap">
        {isBangla ? "শেয়ার করুন" : "Share Story"}
      </span>
      <a 
        href={shareUrls.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-caption hover:border-primary hover:bg-primary/5 hover:text-primary transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-sm bg-card"
        title={isBangla ? "টুইটারে শেয়ার করুন" : "Share on Twitter"}
      >
        <TwitterIcon width={18} height={18} />
      </a>
      <a 
        href={shareUrls.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-caption hover:border-primary hover:bg-primary/5 hover:text-primary transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-sm bg-card"
        title={isBangla ? "ফেসবুকে শেয়ার করুন" : "Share on Facebook"}
      >
        <FacebookIcon width={18} height={18} />
      </a>
      <a 
        href={shareUrls.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-caption hover:border-primary hover:bg-primary/5 hover:text-primary transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-sm bg-card"
        title={isBangla ? "লিঙ্কডইনে শেয়ার করুন" : "Share on LinkedIn"}
      >
        <LinkedinIcon width={18} height={18} />
      </a>
      <a 
        href={shareUrls.email}
        className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-caption hover:border-primary hover:bg-primary/5 hover:text-primary transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-sm bg-card"
        title={isBangla ? "ইমেইলে পাঠান" : "Send via Email"}
      >
        <Mail size={18} />
      </a>
      <button 
        onClick={handleCopy}
        className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-caption hover:border-primary hover:bg-primary/5 hover:text-primary transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-sm bg-card cursor-pointer"
        title={isBangla ? "লিঙ্ক কপি করুন" : "Copy Link"}
      >
        {copied ? <Check size={18} className="text-emerald-500" /> : <LinkIcon size={18} />}
      </button>
    </div>
  );
}
