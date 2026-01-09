'use client';

import { useState, useEffect, useCallback } from 'react';
import { getUserCredits } from '@/lib/api';

export function useCredits() {
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

  const refreshCredits = () => {
    fetchCredits();
  };

  return {
    credits,
    loading,
    error,
    updateCredits,
    refreshCredits,
  };
}