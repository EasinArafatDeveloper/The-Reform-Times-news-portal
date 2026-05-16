import type { Metadata } from "next";
import { Merriweather, Inter, Noto_Serif_Bengali, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const merriweather = Merriweather({ subsets: ['latin'], weight: ['300', '400', '700', '900'], variable: '--font-serif' });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const notoSerifBengali = Noto_Serif_Bengali({ subsets: ['bengali'], weight: ['400', '700'], variable: '--font-bengali-serif' });
const hindSiliguri = Hind_Siliguri({ subsets: ['bengali'], weight: ['400', '600', '700'], variable: '--font-bengali-sans' });

export const metadata: Metadata = {
  title: "The Reform Times | Advocacy Journalism",
  description: "Investigative journalism, human rights storytelling, and reform-focused reporting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${merriweather.variable} ${inter.variable} ${notoSerifBengali.variable} ${hindSiliguri.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <Header />
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
