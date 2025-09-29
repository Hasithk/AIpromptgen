'use client';

import { useCredits } from '@/hooks/use-credits';
import { Coins } from 'lucide-react';

export function CreditDisplay() {
  const { credits, loading } = useCredits();
  
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