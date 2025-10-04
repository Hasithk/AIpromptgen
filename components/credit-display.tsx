'use client';

import { useCredits } from '@/hooks/use-credits';
import { useSession } from 'next-auth/react';
import { Coins } from 'lucide-react';

export function CreditDisplay() {
  const sessionData = useSession();
  const status = sessionData?.status;
  const session = sessionData?.data;
  const { credits, loading } = useCredits();
  
  // Don't show during SSR or when not authenticated
  if (typeof window === 'undefined' || status === 'loading') {
    return (
      <div className="flex items-center space-x-2 px-3 py-1.5 bg-primary/10 rounded-full border">
        <Coins className="h-4 w-4 text-primary animate-pulse" />
        <span className="text-sm font-medium text-primary">
          --
        </span>
      </div>
    );
  }
  
  // Show default credits if not authenticated
  if (status === 'unauthenticated') {
    return (
      <div className="flex items-center space-x-2 px-3 py-1.5 bg-primary/10 rounded-full border">
        <Coins className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-primary">
          70 credits
        </span>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-1.5 bg-primary/10 rounded-full border">
        <Coins className="h-4 w-4 text-primary animate-pulse" />
        <span className="text-sm font-medium text-primary">
          Loading...
        </span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center space-x-2 px-3 py-1.5 bg-primary/10 rounded-full border">
      <Coins className="h-4 w-4 text-primary" />
      <span className="text-sm font-medium text-primary">
        {credits} credits
      </span>
    </div>
  );
}