import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import ThemeToggle from '@/components/ThemeToggle';
import Disclaimer from '@/components/Disclaimer';
import GitHubLink from '@/components/GitHubLink';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://the-calculator-movie-industry-tycoon.vercel.app/'),
  title: 'The Calculator - Movie Industry Tycoon',
  description: 'Calculate movie affinities for The Executive: Movie Industry Tycoon',
  openGraph: {
    images: [
      {
        url: '/og-image.webp',
        width: 650,
        height: 365,
        alt: 'The Calculator - Movie Industry Tycoon',
      },
    ],
  },
  other: {
    "google-adsense-account": "ca-pub-4335073140276405"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4335073140276405"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className} flex flex-col h-full`}>
        <ThemeProvider>
          <LanguageProvider>
            <header className="flex justify-end items-center p-4 space-x-4">
              <LanguageSelector />
              <ThemeToggle />
              <GitHubLink />
            </header>
            <main className="flex-grow flex items-center justify-center px-4">
              {children}
              <Analytics />
              <SpeedInsights />
            </main>
            <Disclaimer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}