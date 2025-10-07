'use client';

import { GoogleAnalytics } from './google-analytics';
import { MicrosoftClarity } from './microsoft-clarity';
import { PerformanceMonitoring } from './performance-monitoring';

export function AnalyticsProvider() {
  return (
    <>
      <GoogleAnalytics />
      <MicrosoftClarity />
      <PerformanceMonitoring />
    </>
  );
}

// Re-export tracking functions for easy access
export { trackEvent } from './google-analytics';
export { clarityEvent } from './microsoft-clarity';
