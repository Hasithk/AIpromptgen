'use client';

import { useCredits } from '@/hooks/use-credits';
import { Coins } from 'lucide-react';

export function CreditDisplay() {
  // Temporarily show default credits without authentication
  const { credits, loading } = useCredits();
  
  // Don't show during SSR
  if (typeof window === 'undefined' || loading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-1.5 bg-primary/10 rounded-full border">
        <Coins className="h-4 w-4 text-primary animate-pulse" />
        <span className="text-sm font-medium text-primary">
          --
        </span>
      </div>
    );
  }
  
    // Show credits (default to 70 if no credits loaded)
  return (
    <div className="flex items-center space-x-2 px-3 py-1.5 bg-primary/10 rounded-full border">
      <Coins className="h-4 w-4 text-primary" />
      <span className="text-sm font-medium text-primary">
        {credits || 70} credits
      </span>
    </div>
  );
}