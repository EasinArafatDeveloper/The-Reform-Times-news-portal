"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { categoryTranslations } from "@/lib/data";

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    const handleLocaleChange = (e: any) => {
      setLocale(e.detail);
    };

    const match = document.cookie.match(new RegExp('(^| )NEXT_LOCALE=([^;]+)'));
    if (match) setLocale(match[2]);

    window.addEventListener('localeChange', handleLocaleChange);
    return () => window.removeEventListener('localeChange', handleLocaleChange);
  }, []);

  const displayCategory = locale === 'bn' ? (categoryTranslations[category] || category) : category;

  return (
    <span 
      className={cn(
        "text-[10px] font-bold uppercase tracking-widest text-brand-red mb-3 block",
        className
      )}
    >
      {displayCategory}
    </span>
  );
}
