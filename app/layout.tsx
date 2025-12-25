import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { ClientNavigation } from '@/components/client-navigation';
import { Footer } from '@/components/footer';
import { AnalyticsProvider } from '@/components/analytics';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://aipromptgen.com'), // Replace with your domain
  title: {
    default: 'AI Prompt Generator | Professional AI Prompts for Sora, Midjourney, DALL-E, Qwen.ai',
    template: '%s | AI Prompt Generator'
  },
  description: 'Generate high-quality AI prompts for Sora, Veo 3, Midjourney, DALL-E, Qwen.ai and other AI platforms. Professional prompt engineering tool with 70+ free generations, curated library, and AI-powered blog.',
  icons: {
    icon: [
      { url: '/Aipromptgen.png', sizes: 'any' },
      { url: '/Aipromptgen.png', sizes: '32x32', type: 'image/png' },
      { url: '/Aipromptgen.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/Aipromptgen.png',
    apple: '/Aipromptgen.png',
    other: [
      {
        rel: 'icon',
        url: '/Aipromptgen.png',
      },
    ],
  },
  keywords: [
    'AI prompt generator',
    'prompt engineering',
    'Sora prompts',
    'Midjourney prompts',
    'Qwen.ai prompts',
    'Alibaba AI image generation', 
    'DALL-E prompts',
    'AI art generator',
    'AI video prompts',
    'DeepSeek AI',
    'AI content creation',
    'prompt library',
    'AI writing assistant',
    'artificial intelligence tools'
  ],
  authors: [{ name: 'AI Prompt Gen Team' }],
  creator: 'AI Prompt Gen',
  publisher: 'AI Prompt Gen',
  category: 'Technology',
  openGraph: {
    title: 'AI Prompt Generator - Create Professional AI Prompts Instantly',
    description: 'Generate stunning AI prompts for Sora, Midjourney, DALL-E and more. 70 free generations, premium plans, and AI-powered blog content.',
    url: 'https://aipromptgen.com',
    siteName: 'AI Prompt Generator',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/Aipromptgen.png',
        width: 1200,
        height: 630,
        alt: 'AI Prompt Generator - Professional AI Content Creation'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Prompt Generator - Create Professional AI Prompts',
    description: 'Generate high-quality prompts for Sora, Midjourney, DALL-E. 70 free generations + premium features.',
    images: ['/Aipromptgen.png'],
    creator: '@aipromptgen'
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://aipromptgen.com'
  },
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification
    yandex: 'your-yandex-verification-code',
    other: {
      bing: 'your-bing-verification-code'
    }
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AI Prompt Generator",
    "description": "Professional AI prompt generator for Sora, Midjourney, DALL-E and other AI platforms",
    "url": "https://aipromptgen.com",
    "applicationCategory": "DesignApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free tier with 70 generations per month"
    },
    "creator": {
      "@type": "Organization", 
      "name": "AI Prompt Gen"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-7361470858189605" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7361470858189605"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={inter.className}>
        <AnalyticsProvider />
        <Providers>
          <div className="flex flex-col min-h-screen">
            <ClientNavigation />
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