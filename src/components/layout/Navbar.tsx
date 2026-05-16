'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Menu, X, Moon, ChevronDown } from 'lucide-react';
import { navigationLinks, categories, uiTranslations } from '@/lib/data';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [locale, setLocale] = useState('en');
  const pathname = usePathname();

  useEffect(() => {
    const handleLocaleChange = (e: any) => {
      setLocale(e.detail);
    };

    const match = document.cookie.match(new RegExp('(^| )NEXT_LOCALE=([^;]+)'));
    if (match) setLocale(match[2]);

    window.addEventListener('localeChange', handleLocaleChange);
    return () => window.removeEventListener('localeChange', handleLocaleChange);
  }, [pathname]);

  const t = uiTranslations[locale as keyof typeof uiTranslations] || uiTranslations.en;

  const mainLinkUrls = navigationLinks.map(link => link.href);
  const dropdownCategories = categories.filter(cat => !mainLinkUrls.includes(`/category/${cat.slug}`) && cat.slug !== 'investigations' && cat.slug !== 'fact-check');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 transition-all duration-300 border-b border-transparent",
        isScrolled ? "bg-white text-black shadow-md border-gray-200 py-3" : "bg-white text-black py-5 border-gray-100"
      )}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif font-bold text-2xl tracking-tight text-brand-navy">
            The Reform Times
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navigationLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={cn(
                "text-sm font-semibold tracking-wide uppercase transition-colors hover:text-brand-red",
                pathname === link.href ? "text-brand-red" : "text-brand-navy/80"
              )}
            >
              {locale === 'bn' ? link.bnName : link.name}
            </Link>
          ))}
          
          {/* More Dropdown */}
          <div 
            className="relative group"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button className="flex items-center gap-1 text-sm font-semibold tracking-wide uppercase text-brand-navy/80 hover:text-brand-red transition-colors focus:outline-none">
              {t.more} <ChevronDown size={14} />
            </button>
            
            <div className={cn(
              "absolute top-full left-0 mt-0 pt-6 w-48 transition-all duration-200",
              isDropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-2"
            )}>
              <div className="bg-white border border-gray-100 shadow-xl rounded-md overflow-hidden py-2">
                {dropdownCategories.map(cat => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-brand-red hover:bg-gray-50 transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button className="text-brand-navy hover:text-brand-red transition-colors hidden sm:block">
            <Search size={20} />
          </button>
          <button className="text-brand-navy hover:text-brand-red transition-colors hidden sm:block">
            <Moon size={20} />
          </button>
          <Link 
            href="/subscribe"
            className="hidden sm:inline-block bg-brand-red text-white px-5 py-2 text-sm font-semibold hover:bg-brand-red/90 transition-colors rounded-sm"
          >
            {t.subscribe}
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden text-brand-navy"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg py-4 px-4 flex flex-col gap-4">
          {navigationLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-base font-semibold text-brand-navy hover:text-brand-red py-2 border-b border-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {/* Mobile Dropdown Categories */}
          {dropdownCategories.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/category/${cat.slug}`}
              className="text-base font-semibold text-gray-500 hover:text-brand-red py-2 border-b border-gray-50 pl-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {cat.name}
            </Link>
          ))}
          <Link 
            href="/subscribe"
            className="bg-brand-red text-white text-center px-5 py-3 text-base font-semibold hover:bg-brand-red/90 transition-colors mt-2 rounded-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Subscribe Now
          </Link>
        </div>
      )}
    </header>
  );
}
