import Link from 'next/link';
import { Mail } from 'lucide-react';
import { TwitterIcon, FacebookIcon, InstagramIcon, YoutubeIcon } from '@/components/ui/icons';
import { categories, uiTranslations } from '@/lib/data';
import { cookies } from 'next/headers';

export async function Footer() {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const t = uiTranslations[locale as keyof typeof uiTranslations] || uiTranslations.en;

  return (
    <footer className="bg-brand-navy text-white pt-16 pb-8 border-t-[6px] border-brand-red">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <span className="font-serif font-bold text-3xl tracking-tight text-white">
                The Reform Times
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Advocacy journalism dedicated to human rights, truth, and transparency. 
              We investigate the issues that matter and amplify voices that need to be heard.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-red transition-colors"><TwitterIcon width={18} height={18} /></Link>
              <Link href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-red transition-colors"><FacebookIcon width={18} height={18} /></Link>
              <Link href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-red transition-colors"><InstagramIcon width={18} height={18} /></Link>
              <Link href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-red transition-colors"><YoutubeIcon width={18} height={18} /></Link>
            </div>
          </div>

          {/* Sections */}
          <div>
            <h3 className="font-serif font-bold text-xl mb-6">{t.sections}</h3>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link href={`/category/${category.slug}`} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Organization */}
          <div>
            <h3 className="font-serif font-bold text-xl mb-6">{t.organization}</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t.aboutUs}</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t.contactTips}</Link></li>
              <li><Link href="/editorial-policy" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t.editorialPolicy}</Link></li>
              <li><Link href="/careers" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t.careers}</Link></li>
              <li><Link href="/transparency" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t.transparency}</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-serif font-bold text-xl mb-6">{t.newsletter}</h3>
            <p className="text-gray-400 text-sm mb-4">
              {t.newsletterDesc}
            </p>
            <form className="flex flex-col gap-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand-red transition-colors rounded-sm"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-brand-red text-white py-3 font-semibold text-sm hover:bg-brand-red/90 transition-colors rounded-sm"
              >
                {t.subscribe}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} The Reform Times. {t.allRightsReserved}
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors">{t.privacyPolicy}</Link>
            <Link href="/terms" className="hover:text-white transition-colors">{t.termsOfService}</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">{t.cookieSettings}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
