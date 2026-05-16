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
        </ThemeProvider>
      </body>
    </html>
  );
}
