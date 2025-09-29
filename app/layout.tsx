import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Prompt Generator | Create Professional AI Prompts for Sora, Midjourney & More',
  description: 'Generate high-quality AI prompts for Sora, Veo 3, Midjourney and other AI platforms. Professional prompt engineering tool with guided creation and curated library.',
  keywords: ['AI prompts', 'prompt engineering', 'Sora prompts', 'Midjourney prompts', 'AI art', 'prompt generator'],
  authors: [{ name: 'AI Prompt Gen' }],
  openGraph: {
    title: 'AI Prompt Generator - Professional AI Prompts',
    description: 'Create stunning AI prompts for all major platforms',
    url: 'https://aipromptgen.app',
    siteName: 'AI Prompt Gen',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Prompt Generator',
    description: 'Create professional AI prompts for Sora, Midjourney & more',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}