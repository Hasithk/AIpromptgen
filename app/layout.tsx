import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { ClientNavigation } from '@/components/client-navigation';
import { Footer } from '@/components/footer';
import { AnalyticsProvider } from '@/components/analytics';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.aipromptgen.app'),
  title: {
    default: 'AI Prompt Generator | Professional AI Prompts for Sora, Midjourney, DALL-E, Qwen.ai',
    template: '%s | AI Prompt Generator'
  },
  description: 'Generate high-quality AI prompts for Sora, Veo 3, Midjourney, DALL-E, Qwen.ai and other AI platforms. Professional prompt engineering tool with 70+ free generations, curated library, and AI-powered blog.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/Aipromptgen.png', sizes: '192x192', type: 'image/png' },
      { url: '/Aipromptgen.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [
      { url: '/Aipromptgen.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  keywords: [
    'AI prompt generator',
    'best AI prompt generator',
    'AI prompt generator free',
    'AI prompt generator ChatGPT',
    'AI prompt generator image',
    'prompt generator from image',
    'AI prompt generator video',
    'AI prompt generator text',
    'AI prompt examples',
    'how to generate a prompt for AI',
    'what is the best AI prompt generator',
    'where can I find free AI prompts',
    'free AI prompts',
    'prompt engineering',
    'Sora prompts',
    'Midjourney prompts',
    'DALL-E prompts',
    'ChatGPT prompts',
    'AI art generator',
    'AI video prompts',
    'DeepSeek AI',
    'AI content creation',
    'prompt library',
    'AI writing assistant',
    'artificial intelligence tools',
    'Claude prompts',
    'Gemini prompts',
    'Stable Diffusion prompts'
  ],
  authors: [{ name: 'AI Prompt Gen Team' }],
  creator: 'AI Prompt Gen',
  publisher: 'AI Prompt Gen',
  category: 'Technology',
  openGraph: {
    title: 'AI Prompt Generator - Create Professional AI Prompts Instantly',
    description: 'Generate stunning AI prompts for Sora, Midjourney, DALL-E and more. 70 free generations, premium plans, and AI-powered blog content.',
    url: 'https://www.aipromptgen.app',
    siteName: 'AI Prompt Generator',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://www.aipromptgen.app/Aipromptgen.png',
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
    images: ['https://www.aipromptgen.app/Aipromptgen.png'],
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
    canonical: 'https://www.aipromptgen.app'
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
    "url": "https://www.aipromptgen.app",
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/Aipromptgen.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
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