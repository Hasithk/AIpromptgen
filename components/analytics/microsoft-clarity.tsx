'use client';

import Script from 'next/script';

const CLARITY_ID = 'your_clarity_project_id'; // You'll need to sign up at https://clarity.microsoft.com/

declare global {
  interface Window {
    clarity: (...args: any[]) => void;
  }
}

export function MicrosoftClarity() {
  // Remove or comment out if you don't want to use Clarity yet
  if (!CLARITY_ID || CLARITY_ID === 'your_clarity_project_id') {
    return null;
  }

  return (
    <Script
      id="microsoft-clarity"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${CLARITY_ID}");
        `,
      }}
    />
  );
}

// Clarity event tracking
export const clarityEvent = {
  setCustomTag: (key: string, value: string) => {
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('set', key, value);
    }
  },

  trackEvent: (eventName: string) => {
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('event', eventName);
    }
  },
};
