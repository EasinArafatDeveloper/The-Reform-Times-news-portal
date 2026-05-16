'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Menu, X, Moon } from 'lucide-react';
import { navigationLinks } from '@/lib/data';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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
              {link.name}
            </Link>
          ))}
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
            Subscribe
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
