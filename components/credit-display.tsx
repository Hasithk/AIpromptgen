'use client';

import { useCredits } from '@/contexts/credit-context';
import { Coins } from 'lucide-react';

export function CreditDisplay() {
  const { credits, loading } = useCredits();
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-1.5 bg-primary/10 rounded-full border">
        <Coins className="h-4 w-4 text-primary animate-pulse" />
        <span className="text-sm font-medium text-primary">
          --
        </span>
      </div>
    );
  }
  
  // Show credits with color coding
  const creditColor = credits === 0 ? 'text-destructive' : credits < 20 ? 'text-orange-500' : 'text-primary';
  const bgColor = credits === 0 ? 'bg-destructive/10' : credits < 20 ? 'bg-orange-500/10' : 'bg-primary/10';
  
  return (
    <div className={`flex items-center space-x-2 px-3 py-1.5 ${bgColor} rounded-full border`}>
      <Coins className={`h-4 w-4 ${creditColor}`} />
      <span className={`text-sm font-medium ${creditColor}`}>
        {credits} credits
      </span>
    </div>
  );
}