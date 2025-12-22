'use client';

import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { CreditProvider } from '@/contexts/credit-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CreditProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </CreditProvider>
    </SessionProvider>
  );
}