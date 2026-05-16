import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-brand-gray-light px-6 py-24">
      <div className="text-center max-w-2xl">
        <h1 className="font-serif font-bold text-brand-red text-8xl md:text-9xl mb-4">404</h1>
        <h2 className="font-serif font-bold text-3xl md:text-4xl text-brand-navy mb-6">
          Page Not Found
        </h2>
        <p className="text-gray-600 text-lg mb-10 leading-relaxed">
          We couldn't find the page you were looking for. It might have been removed, renamed, or didn't exist in the first place.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link 
            href="/" 
            className="flex items-center gap-2 bg-brand-navy text-white px-8 py-4 text-sm font-semibold hover:bg-brand-red transition-colors rounded-sm w-full sm:w-auto justify-center"
          >
            <ArrowLeft size={18} />
            Return to Homepage
          </Link>
          <Link 
            href="/news" 
            className="flex items-center gap-2 bg-white text-brand-navy border border-gray-300 px-8 py-4 text-sm font-semibold hover:border-brand-navy transition-colors rounded-sm w-full sm:w-auto justify-center"
          >
            <Search size={18} />
            Browse Latest News
          </Link>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-500 font-medium">
            Think this is a mistake? <Link href="/contact" className="text-brand-red hover:underline">Contact our newsroom.</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
