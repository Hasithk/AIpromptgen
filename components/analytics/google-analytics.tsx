'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const GA_TRACKING_ID = 'G-ZHG0797RH0';

declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}

export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      pageview(pathname);
    }
  }, [pathname, searchParams]);

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
              send_page_view: true,
              anonymize_ip: true,
              cookie_flags: 'SameSite=None;Secure'
            });
          `,
        }}
      />
    </>
  );
}

// Track page views
export const pageview = (url: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track specific user actions
export const trackEvent = {
  // Prompt generation
  promptGenerated: (platform: string, category: string) => {
    event({
      action: 'prompt_generated',
      category: 'Engagement',
      label: `${platform} - ${category}`,
    });
  },

  // Prompt copied from library
  promptCopied: (promptTitle: string, platform: string) => {
    event({
      action: 'prompt_copied',
      category: 'Engagement',
      label: `${platform} - ${promptTitle}`,
    });
  },

  // Credit purchase
  creditPurchase: (plan: string, amount: number) => {
    event({
      action: 'purchase',
      category: 'Conversion',
      label: plan,
      value: amount,
    });
  },

  // Blog post view
  blogPostView: (postId: string, title: string) => {
    event({
      action: 'blog_post_view',
      category: 'Content',
      label: `${postId} - ${title}`,
    });
  },

  // Library search
  librarySearch: (searchTerm: string) => {
    event({
      action: 'library_search',
      category: 'Engagement',
      label: searchTerm,
    });
  },

  // Platform filter
  platformFilter: (platform: string) => {
    event({
      action: 'platform_filter',
      category: 'Engagement',
      label: platform,
    });
  },

  // Sign up
  signUp: (method: string) => {
    event({
      action: 'sign_up',
      category: 'Conversion',
      label: method,
    });
  },

  // Sign in
  signIn: (method: string) => {
    event({
      action: 'sign_in',
      category: 'Conversion',
      label: method,
    });
  },

  // External link click
  externalLinkClick: (url: string, linkText: string) => {
    event({
      action: 'external_link_click',
      category: 'Engagement',
      label: `${linkText} - ${url}`,
    });
  },

  // CTA button click
  ctaClick: (buttonText: string, location: string) => {
    event({
      action: 'cta_click',
      category: 'Engagement',
      label: `${location} - ${buttonText}`,
    });
  },

  // Form submission
  formSubmit: (formName: string) => {
    event({
      action: 'form_submit',
      category: 'Engagement',
      label: formName,
    });
  },

  // Error tracking
  error: (errorMessage: string, errorLocation: string) => {
    event({
      action: 'error',
      category: 'Error',
      label: `${errorLocation} - ${errorMessage}`,
    });
  },
};
