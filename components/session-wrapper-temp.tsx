'use client';

import { Button } from '@/components/ui/button';
import { CreditDisplay } from '@/components/credit-display';

export function SessionWrapper() {
  // Temporarily disable authentication to avoid NextAuth issues
  // This will be re-enabled once the SessionProvider issue is resolved
  
  const handleSignIn = () => {
    // Placeholder for sign in functionality
    console.log('Sign in clicked');
  };

  const handleGetStarted = () => {
    // Placeholder for get started functionality
    console.log('Get started clicked');
  };
  
  return (
    <div className="flex items-center gap-4">
      <CreditDisplay />
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={handleSignIn}>
          Sign In
        </Button>
        <Button onClick={handleGetStarted}>
          Get Started
        </Button>
      </div>
    </div>
  );
}