"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { bn as bnLocale } from 'date-fns/locale';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Article } from '@/lib/data';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { getLocalizedContent } from '@/lib/i18n-utils';

interface HeroSliderProps {
  articles: Article[];
  locale: string;
}

export default function HeroSlider({ articles, locale }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const isBangla = locale === 'bn';

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % articles.length);
  }, [articles.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
  }, [articles.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const currentArticle = articles[currentIndex];
  if (!currentArticle) return null;

  const title = getLocalizedContent<string>(currentArticle.title, locale);
  const excerpt = getLocalizedContent<string>(currentArticle.excerpt, locale);
  const category = getLocalizedContent<string>(currentArticle.category, locale);
  const slug = getLocalizedContent<string>(currentArticle.slug, locale);
  const readTime = getLocalizedContent<string>(currentArticle.readTime || "", locale);

  const formattedDate = format(new Date(currentArticle.date), isBangla ? 'd MMMM, yyyy' : 'MMMM d, yyyy', {
    locale: isBangla ? bnLocale : undefined
  });

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="relative w-full aspect-[16/9] md:aspect-[16/8.5] overflow-hidden rounded-[2rem] shadow-premium border border-border/50 group">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="absolute inset-0 w-full h-full"
        >
          <div className="relative w-full h-full">
            <Image 
              src={currentArticle.image} 
              alt={title}
              fill
              priority
              className="object-cover"
            />
            {/* Cinematic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 p-6 md:p-12 md:w-11/12 lg:w-10/12 xl:w-9/12 z-20">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 mb-4"
              >
                <span className="bg-primary text-white text-[10px] md:text-[11px] font-black uppercase px-3 py-1 tracking-[0.2em] rounded-sm shadow-lg">
                  {isBangla ? "ফিচারড স্টোরি" : "Featured Story"}
                </span>
                <CategoryBadge category={category} className="text-white mb-0 border-l border-white/20 pl-3 py-0.5" />
              </motion.div>

              <Link href={`/${locale}/news/${slug}`}>
                <motion.h1 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="font-serif font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-[1.1] mb-4 text-white hover:text-primary transition-colors duration-500 line-clamp-3 md:line-clamp-2 max-w-4xl"
                >
                  {title}
                </motion.h1>
              </Link>
              
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-white/80 text-sm md:text-base lg:text-lg line-clamp-2 mb-8 max-w-3xl leading-relaxed font-sans"
              >
                {excerpt}
              </motion.p>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-white/60 border-t border-white/10 pt-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/50 p-0.5">
                    <img src={currentArticle.author.avatar} alt={currentArticle.author.name} className="w-full h-full object-cover rounded-full" />
                  </div>
                  <span className="text-white tracking-normal">{currentArticle.author.name}</span>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <Clock size={14} className="text-primary" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                  <span>{readTime || (isBangla ? '৫ মিনিট পাঠ' : '5 min read')}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          onClick={prevSlide}
          className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all shadow-xl"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={nextSlide}
          className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all shadow-xl"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 right-12 z-30 flex gap-2">
        {articles.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > currentIndex ? 1 : -1);
              setCurrentIndex(i);
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentIndex ? "w-8 bg-primary" : "w-2 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
