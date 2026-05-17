import type { Metadata } from "next";
import { Merriweather, Inter, Noto_Serif_Bengali, Hind_Siliguri } from "next/font/google";
import "./globals.css";

const merriweather = Merriweather({ subsets: ['latin'], weight: ['300', '400', '700', '900'], variable: '--font-serif' });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const notoSerifBengali = Noto_Serif_Bengali({ subsets: ['bengali'], weight: ['400', '700'], variable: '--font-bengali-serif' });
const hindSiliguri = Hind_Siliguri({ subsets: ['bengali'], weight: ['400', '600', '700'], variable: '--font-bengali-sans' });

export const metadata: Metadata = {
  title: "The Reform Times | Advocacy Journalism",
  description: "Investigative journalism, human rights storytelling, and reform-focused reporting.",
};

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from 'react-hot-toast';
import CookieConsentBanner from "@/components/shared/CookieConsentBanner";
import PushNotificationPrompt from "@/components/shared/PushNotificationPrompt";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body 
        className={`${merriweather.variable} ${inter.variable} ${notoSerifBengali.variable} ${hindSiliguri.variable} ${
          locale === 'bn' ? 'font-bengali-sans' : 'font-sans'
        } antialiased flex flex-col min-h-screen bg-background text-body`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <CookieConsentBanner />
          <PushNotificationPrompt />
          <Toaster 
            position="bottom-right" 
            toastOptions={{
              className: 'font-sans font-semibold text-sm',
              style: {
                borderRadius: '16px',
                background: '#151c2c',
                color: '#f8fafc',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                border: '1px solid #1e293b',
              },
              success: {
                style: {
                  background: '#f0fdf4',
                  color: '#14532d',
                  border: '1px solid #bbf7d0',
                },
                iconTheme: {
                  primary: '#16a34a',
                  secondary: '#f0fdf4',
                },
              },
              error: {
                style: {
                  background: '#fff1f2',
                  color: '#4c0519',
                  border: '1px solid #fecdd3',
                },
                iconTheme: {
                  primary: '#e11d48',
                  secondary: '#fff1f2',
                },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
