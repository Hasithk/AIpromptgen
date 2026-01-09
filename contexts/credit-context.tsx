'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getUserCredits } from '@/lib/api';

interface CreditContextType {
  credits: number;
  loading: boolean;
  error: string | null;
  updateCredits: (newCredits: number) => void;
  refreshCredits: () => Promise<void>;
}

const CreditContext = createContext<CreditContextType | undefined>(undefined);

export function CreditProvider({ children }: { children: ReactNode }) {
  const [credits, setCredits] = useState<number>(50);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCredits = useCallback(async () => {
    // Don't fetch during SSR
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getUserCredits();
      if (response.success && response.data) {
        setCredits(response.data.credits);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch credits');
      // Keep default credits on error
      setCredits(50);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  const updateCredits = (newCredits: number) => {
    setCredits(newCredits);
  };

  const refreshCredits = async () => {
    await fetchCredits();
  };

  return (
    <CreditContext.Provider value={{ credits, loading, error, updateCredits, refreshCredits }}>
      {children}
    </CreditContext.Provider>
  );
}

export function useCredits() {
  const context = useContext(CreditContext);
  if (context === undefined) {
    throw new Error('useCredits must be used within a CreditProvider');
  }
  return context;
}
