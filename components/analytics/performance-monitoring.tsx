'use client';

import { useEffect } from 'react';
import { event } from './google-analytics';

export function PerformanceMonitoring() {
  useEffect(() => {
    // Report Web Vitals to Google Analytics
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        // Core Web Vitals
        reportWebVitals();
        
        // Page load performance
        reportPageLoadMetrics();
      } catch (error) {
        console.error('Performance monitoring error:', error);
      }
    }
  }, []);

  return null;
}

function reportWebVitals() {
  // Largest Contentful Paint (LCP)
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1] as any;
    
    event({
      action: 'web_vitals',
      category: 'Performance',
      label: 'LCP',
      value: Math.round(lastEntry.renderTime || lastEntry.loadTime),
    });
  });

  try {
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {
    // LCP not supported
  }

  // First Input Delay (FID)
  const fidObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry: any) => {
      event({
        action: 'web_vitals',
        category: 'Performance',
        label: 'FID',
        value: Math.round(entry.processingStart - entry.startTime),
      });
    });
  });

  try {
    fidObserver.observe({ type: 'first-input', buffered: true });
  } catch (e) {
    // FID not supported
  }

  // Cumulative Layout Shift (CLS)
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry: any) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    });
  });

  try {
    clsObserver.observe({ type: 'layout-shift', buffered: true });
    
    // Report CLS when page is hidden or unloaded
    const reportCLS = () => {
      event({
        action: 'web_vitals',
        category: 'Performance',
        label: 'CLS',
        value: Math.round(clsValue * 1000),
      });
    };

    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        reportCLS();
      }
    });
    
    window.addEventListener('pagehide', reportCLS);
  } catch (e) {
    // CLS not supported
  }
}

function reportPageLoadMetrics() {
  // Wait for page load to complete
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (perfData) {
        // DNS lookup time
        const dnsTime = perfData.domainLookupEnd - perfData.domainLookupStart;
        event({
          action: 'page_load_metrics',
          category: 'Performance',
          label: 'DNS Lookup',
          value: Math.round(dnsTime),
        });

        // TCP connection time
        const tcpTime = perfData.connectEnd - perfData.connectStart;
        event({
          action: 'page_load_metrics',
          category: 'Performance',
          label: 'TCP Connection',
          value: Math.round(tcpTime),
        });

        // Request time
        const requestTime = perfData.responseStart - perfData.requestStart;
        event({
          action: 'page_load_metrics',
          category: 'Performance',
          label: 'Request Time',
          value: Math.round(requestTime),
        });

        // Response time
        const responseTime = perfData.responseEnd - perfData.responseStart;
        event({
          action: 'page_load_metrics',
          category: 'Performance',
          label: 'Response Time',
          value: Math.round(responseTime),
        });

        // DOM processing time
        const domProcessing = perfData.domComplete - perfData.domInteractive;
        event({
          action: 'page_load_metrics',
          category: 'Performance',
          label: 'DOM Processing',
          value: Math.round(domProcessing),
        });

        // Total page load time
        const totalLoadTime = perfData.loadEventEnd - perfData.fetchStart;
        event({
          action: 'page_load_metrics',
          category: 'Performance',
          label: 'Total Load Time',
          value: Math.round(totalLoadTime),
        });
      }
    }, 0);
  });
}
