import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import { Providers } from './providers';
import { ClientNavigation } from '@/components/client-navigation';
import { Footer } from '@/components/footer';
import { AnalyticsProvider } from '@/components/analytics';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.aipromptgen.app'),
  title: {
    default: 'AI Prompt Generator | #1 Free AI Prompt Tool for ChatGPT, Midjourney, DALL-E, Sora (2026)',
    template: '%s | AI Prompt Generator - Best Free AI Prompt Tool'
  },
  description: 'The best free AI prompt generator for 2026. Create perfect AI prompts for ChatGPT, Midjourney, DALL-E, Sora, Claude, and Gemini. 70 free AI prompt generations monthly. AI prompt templates, examples, and a curated prompt library. No credit card required.',
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
    'ai prompt',
    'ai prompt generator',
    'ai prompt generator free',
    'best ai prompt generator',
    'free ai prompt',
    'ai prompts',
    'ai prompt examples',
    'ai prompt templates',
    'ai prompt engineering',
    'ai prompt for chatgpt',
    'ai prompt for midjourney',
    'ai prompt for dall-e',
    'ai prompt for sora',
    'ai prompt for image generation',
    'ai prompt for video generation',
    'ai prompt writer',
    'ai prompt creator',
    'ai prompt maker',
    'ai prompt tool',
    'how to write ai prompts',
    'best ai prompts 2026',
    'chatgpt prompt generator',
    'midjourney prompt generator',
    'dall-e prompt generator',
    'sora prompt generator',
    'ai image prompt',
    'ai video prompt',
    'ai text prompt',
    'ai code prompt',
    'prompt engineering tool',
    'ai content generator',
    'free prompt generator',
    'ai prompt library',
    'ai prompt ideas',
    'ai art prompt',
    'stable diffusion prompt',
    'claude prompt generator',
    'gemini prompt generator'
  ],
  authors: [{ name: 'AI Prompt Gen Team', url: 'https://www.aipromptgen.app' }],
  creator: 'AI Prompt Gen',
  publisher: 'AI Prompt Gen',
  category: 'Technology',
  openGraph: {
    title: 'AI Prompt Generator - #1 Free AI Prompt Tool | Create Perfect AI Prompts Instantly',
    description: 'The best free AI prompt generator. Create stunning AI prompts for ChatGPT, Midjourney, DALL-E, Sora. 70 free AI prompt generations monthly. AI prompt templates, library, and examples.',
    url: 'https://www.aipromptgen.app',
    siteName: 'AI Prompt Generator - Free AI Prompt Tool',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://www.aipromptgen.app/Aipromptgen.png',
        width: 1200,
        height: 630,
        alt: 'AI Prompt Generator - Best Free AI Prompt Tool 2026'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Prompt Generator - #1 Free AI Prompt Tool 2026',
    description: 'Create perfect AI prompts for ChatGPT, Midjourney, DALL-E, Sora. 70 free AI prompt generations + prompt library + templates.',
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
      bing: 'your-bing-verification-code',
      'p:domain_verify': '5a696274a126305d9b66dbc608c58f8f'
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
    "@type": "WebApplication",
    "name": "AI Prompt Generator",
    "alternateName": ["AI Prompt Gen", "AIPromptGen", "AI Prompt Tool", "Free AI Prompt Generator"],
    "description": "The best free AI prompt generator for ChatGPT, Midjourney, DALL-E, Sora, Claude, and Gemini. Create perfect AI prompts with 70 free generations monthly.",
    "url": "https://www.aipromptgen.app",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Web Browser",
    "browserRequirements": "Requires JavaScript. Works in all modern browsers.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free AI prompt generator with 70 generations per month"
    },
    "creator": {
      "@type": "Organization",
      "name": "AI Prompt Gen",
      "url": "https://www.aipromptgen.app"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "2850",
      "reviewCount": "1420"
    },
    "featureList": [
      "AI Prompt Generation for ChatGPT",
      "AI Prompt Generation for Midjourney",
      "AI Prompt Generation for DALL-E",
      "AI Prompt Generation for Sora",
      "AI Prompt Library with Curated Templates",
      "AI Prompt Examples for Image, Video, Text, Code",
      "70 Free AI Prompt Generations Monthly",
      "Platform-Specific AI Prompt Optimization"
    ],
    "screenshot": "https://www.aipromptgen.app/Aipromptgen.png",
    "softwareVersion": "3.0",
    "datePublished": "2025-01-01",
    "dateModified": "2026-02-19"
  };

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AI Prompt Gen",
    "url": "https://www.aipromptgen.app",
    "logo": "https://www.aipromptgen.app/Aipromptgen.png",
    "description": "The leading AI prompt generator platform. Create free AI prompts for ChatGPT, Midjourney, DALL-E, Sora, and all major AI platforms.",
    "sameAs": [
      "https://twitter.com/aipromptgen"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "lookinternationallk@gmail.com"
    }
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AI Prompt Generator",
    "alternateName": "AIPromptGen",
    "url": "https://www.aipromptgen.app",
    "description": "Best free AI prompt generator for ChatGPT, Midjourney, DALL-E, Sora. Create perfect AI prompts instantly.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.aipromptgen.app/library?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AI Prompt Gen",
      "url": "https://www.aipromptgen.app"
    }
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is an AI prompt?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "An AI prompt is a text instruction given to an AI model to generate desired output. AI prompts can be used for text generation (ChatGPT, Claude), image generation (Midjourney, DALL-E), video generation (Sora), and code generation. The quality of your AI prompt directly determines the quality of AI output."
        }
      },
      {
        "@type": "Question",
        "name": "What is the best free AI prompt generator?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "AIPromptGen.app is the best free AI prompt generator in 2026, offering 70 free AI prompt generations per month, support for all major AI platforms (ChatGPT, Midjourney, DALL-E, Sora, Claude, Gemini), a curated AI prompt library, and AI prompt templates for text, image, video, and code generation."
        }
      },
      {
        "@type": "Question",
        "name": "How do I write a good AI prompt?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To write great AI prompts: 1) Be specific and detailed in your description, 2) Include technical parameters like resolution, style, and lighting for image prompts, 3) Specify the desired output format, 4) Use role-based prompting for ChatGPT, 5) Add negative prompts to exclude unwanted elements. Our free AI prompt generator automates this process."
        }
      },
      {
        "@type": "Question",
        "name": "How to use AI prompt generator for images?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To generate AI image prompts: 1) Select your AI platform (Midjourney, DALL-E, Stable Diffusion), 2) Describe your desired image with details about subject, style, lighting, and composition, 3) Add technical parameters like resolution and aspect ratio, 4) Use AIPromptGen.app to automatically optimize your AI prompt for the selected platform."
        }
      },
      {
        "@type": "Question",
        "name": "Is AI prompt generator free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! AIPromptGen.app offers 70 free AI prompt generations every month with no credit card required. You can generate AI prompts for ChatGPT, Midjourney, DALL-E, Sora, and other platforms completely free. Pro plans are available for unlimited generations."
        }
      }
    ]
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
        />
      </head>
      <body className={inter.className}>
        <Suspense fallback={null}>
          <AnalyticsProvider />
        </Suspense>
        <Providers>
          {/* Adstera Social Bar */}
          <script 
            async
            data-cfasync="false"
            src="https://pl28526069.effectivegatecpm.com/1c/f5/8d/1cf58d3395fabf144c267a7f2b0d43a4.js"
          />
          
          <div className="flex flex-col min-h-screen">
            <Suspense fallback={<div className="h-16 bg-background border-b" />}>
              <ClientNavigation />
            </Suspense>
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
        
        {/* Adstera Native Banner */}
        <script 
          async
          data-cfasync="false" 
          src="https://pl28340926.effectivegatecpm.com/b5f74cb024e464af5087017b5cf56ec6/invoke.js"
        />
        <div id="container-b5f74cb024e464af5087017b5cf56ec6"></div>
      </body>
    </html>
  );
}