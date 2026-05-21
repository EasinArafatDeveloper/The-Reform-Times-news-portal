"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Menu, X, Moon, ChevronDown } from 'lucide-react';
import { navigationLinks, categories } from '@/lib/data';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { getLocalizedContent, getTranslation } from '@/lib/i18n-utils';
import { i18n } from '@/i18n/config';

import { ThemeToggle } from '../shared/ThemeToggle';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();

  // Extract locale from pathname
  const segments = pathname.split('/');
  const locale = i18n.locales.includes(segments[1] as any) ? segments[1] : i18n.defaultLocale;
  const isBangla = locale === 'bn';

  const t = (key: string) => getTranslation(locale, key);

  const mainLinkUrls = navigationLinks.map(link => link.href);
  const dropdownCategories = categories.filter(cat => 
    !mainLinkUrls.includes(`/category/${cat.slug}`) && 
    cat.slug !== 'investigations' && 
    cat.slug !== 'fact-check'
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsLoadingSuggestions(true);
      setShowSuggestions(true);
      try {
        const res = await fetch(`/api/articles?q=${encodeURIComponent(searchQuery.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(Array.isArray(data) ? data.slice(0, 5) : []);
        }
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  useEffect(() => {
    const handleClose = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.search-container')) {
        setShowSuggestions(false);
      }
    };
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${locale}/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 transition-all duration-300 border-b",
        isScrolled 
          ? "bg-background/80 backdrop-blur-md shadow-md border-border py-3" 
          : "bg-background py-5 border-border"
      )}
    >
      <div className="container relative flex items-center justify-between">
        {/* Logo */}
        <Link href={`/${locale}`} className={cn("flex items-center gap-2 transition-opacity shrink-0 py-1", isSearchOpen && "opacity-0 invisible lg:visible")}>
          <img 
            src="/the reform times logo.png" 
            alt="The Reform Times" 
            className="h-[55px] sm:h-[65px] md:h-[75px] w-auto object-contain dark:hidden" 
          />
          <img 
            src="/dark mode logo.png" 
            alt="The Reform Times" 
            className="h-[90px] sm:h-[110px] md:h-[130px] w-auto object-contain -my-5 hidden dark:block" 
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className={cn("hidden lg:flex items-center gap-6 transition-opacity", isSearchOpen && "opacity-0 invisible")}>
          {navigationLinks.map((link) => {
            const href = link.href === '/' ? `/${locale}` : `/${locale}${link.href}`;
            return (
              <Link 
                key={link.name} 
                href={href}
                className={cn(
                  "text-sm font-semibold tracking-wide uppercase transition-colors hover:text-primary",
                  pathname === href ? "text-primary" : "text-body/80"
                )}
              >
                {isBangla ? link.bnName : link.name}
              </Link>
            );
          })}
          
          {/* More Dropdown */}
          <div 
            className="relative group"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button className="flex items-center gap-1 text-sm font-semibold tracking-wide uppercase text-body/80 hover:text-primary transition-colors focus:outline-none">
              {isBangla ? 'আরও' : 'More'} <ChevronDown size={14} />
            </button>
            
            <div className={cn(
              "absolute top-full left-0 mt-0 pt-6 w-48 transition-all duration-200",
              isDropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-2"
            )}>
              <div className="bg-card border border-border shadow-xl rounded-md overflow-hidden py-2">
                {dropdownCategories.map(cat => (
                  <Link
                    key={cat.id}
                    href={`/${locale}/category/${cat.slug}`}
                    className="block px-4 py-2 text-sm font-medium text-body hover:text-primary hover:bg-surface transition-colors"
                  >
                    {getLocalizedContent<string>(cat.name, locale)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Search Bar Overlay */}
        {isSearchOpen && (
          <div className="absolute inset-0 flex items-center px-4 bg-background z-10 search-container">
            <div className="container max-w-4xl relative flex items-center h-full">
              <form onSubmit={handleSearch} className="flex-1 flex items-center gap-4">
                <Search size={20} className="text-primary" />
                <input 
                  autoFocus
                  type="text" 
                  placeholder={isBangla ? "খুঁজুন..." : "Search for news, topics..."}
                  className="flex-1 bg-transparent border-none outline-none text-lg text-title font-serif"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                />
                {isLoadingSuggestions && (
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin shrink-0"></div>
                )}
                <button 
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                    setSuggestions([]);
                    setShowSuggestions(false);
                  }}
                  className="p-2 hover:bg-surface rounded-full text-caption transition-colors"
                >
                  <X size={24} />
                </button>
              </form>

              {/* Desktop Dynamic Suggestions Dropdown */}
              {showSuggestions && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border shadow-2xl rounded-b-2xl overflow-hidden z-50 animate-fadeIn">
                  {isLoadingSuggestions ? (
                    <div className="p-6 text-center text-caption flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span>{isBangla ? 'অনুসন্ধান করা হচ্ছে...' : 'Searching...'}</span>
                    </div>
                  ) : suggestions.length > 0 ? (
                    <div className="py-2 divide-y divide-border/60">
                      {suggestions.map((article) => {
                        const slug = typeof article.slug === 'object' ? (article.slug.en || article.slug.bn || '') : (article.slug || '');
                        const title = getLocalizedContent<string>(article.title, locale);
                        const category = getLocalizedContent<string>(article.category, locale);
                        return (
                          <Link
                            key={article.id}
                            href={`/${locale}/news/${slug}`}
                            onClick={() => {
                              setIsSearchOpen(false);
                              setSearchQuery('');
                              setSuggestions([]);
                              setShowSuggestions(false);
                            }}
                            className="flex items-center gap-4 px-4 py-3 hover:bg-surface transition-colors group cursor-pointer"
                          >
                            <img
                              src={article.image || article.mainImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=150'}
                              alt={title}
                              className="w-12 h-12 object-cover rounded-lg flex-shrink-0 border border-border/40"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-0.5">
                                {category}
                              </span>
                              <h4 className="text-sm font-serif font-bold text-title group-hover:text-primary transition-colors truncate">
                                {title}
                              </h4>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-caption font-serif">
                      {isBangla ? 'কোনো সংবাদ পাওয়া যায়নি।' : 'No matching articles found.'}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {!isSearchOpen && (
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="text-body hover:text-primary transition-colors hidden sm:block p-2 hover:bg-surface rounded-full"
            >
              <Search size={20} />
            </button>
          )}
          
          <ThemeToggle />

          <Link 
            href={`/${locale}/subscribe`}
            className="hidden sm:inline-block bg-primary text-white px-5 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors rounded-sm"
          >
            {isBangla ? 'সাবস্ক্রাইব' : 'Subscribe'}
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden text-title"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-card border-b border-border shadow-lg py-4 px-4 flex flex-col gap-4">
          <div className="relative mb-2 search-container">
             <form onSubmit={handleSearch}>
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-caption" />
                <input 
                  type="text" 
                  placeholder={isBangla ? "খুঁজুন..." : "Search..."}
                  className="w-full bg-surface border border-border rounded-lg py-2 pl-10 pr-4 outline-none focus:border-primary text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                />
             </form>

              {/* Mobile Dynamic Suggestions Dropdown */}
              {showSuggestions && searchQuery.trim() && (
                <div className="absolute left-0 right-0 mt-1 bg-card border border-border shadow-xl rounded-xl overflow-hidden z-50 max-h-[300px] overflow-y-auto">
                  {isLoadingSuggestions ? (
                    <div className="p-4 text-center text-caption flex items-center justify-center gap-2">
                      <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs">{isBangla ? 'অনুসন্ধান করা হচ্ছে...' : 'Searching...'}</span>
                    </div>
                  ) : suggestions.length > 0 ? (
                    <div className="py-1 divide-y divide-border/60">
                      {suggestions.map((article) => {
                        const slug = typeof article.slug === 'object' ? (article.slug.en || article.slug.bn || '') : (article.slug || '');
                        const title = getLocalizedContent<string>(article.title, locale);
                        const category = getLocalizedContent<string>(article.category, locale);
                        return (
                          <Link
                            key={article.id}
                            href={`/${locale}/news/${slug}`}
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              setSearchQuery('');
                              setSuggestions([]);
                              setShowSuggestions(false);
                            }}
                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-surface transition-colors group cursor-pointer"
                          >
                            <img
                              src={article.image || article.mainImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=100'}
                              alt={title}
                              className="w-10 h-10 object-cover rounded-md flex-shrink-0 border border-border/40"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-[9px] font-bold text-primary uppercase tracking-widest block mb-0.5">
                                {category}
                              </span>
                              <h4 className="text-xs font-serif font-bold text-title group-hover:text-primary transition-colors truncate">
                                {title}
                              </h4>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-caption font-serif">
                      {isBangla ? 'কোনো সংবাদ পাওয়া যায়নি।' : 'No matching articles found.'}
                    </div>
                  )}
                </div>
              )}
          </div>
          {navigationLinks.map((link) => {
            const href = link.href === '/' ? `/${locale}` : `/${locale}${link.href}`;
            return (
              <Link 
                key={link.name} 
                href={href}
                className="text-base font-semibold text-title hover:text-primary py-2 border-b border-border"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {isBangla ? link.bnName : link.name}
              </Link>
            );
          })}
          {/* Mobile Dropdown Categories */}
          {dropdownCategories.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/${locale}/category/${cat.slug}`}
              className="text-base font-semibold text-caption hover:text-primary py-2 border-b border-border pl-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {getLocalizedContent<string>(cat.name, locale)}
            </Link>
          ))}
          <Link 
            href={`/${locale}/subscribe`}
            className="bg-primary text-white text-center px-5 py-3 text-base font-semibold hover:bg-primary/90 transition-colors mt-2 rounded-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {isBangla ? 'সাবস্ক্রাইব করুন' : 'Subscribe Now'}
          </Link>
        </div>
      )}
    </header>
  );
}
