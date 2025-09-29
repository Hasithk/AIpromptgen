'use client';

import { useState, useEffect } from 'react';
import { getUserCredits } from '@/lib/api';

export function useCredits() {
  const [credits, setCredits] = useState<number>(70);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCredits() {
      try {
        setLoading(true);
        const response = await getUserCredits();
        if (response.success) {
          setCredits(response.data.credits);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch credits');
      } finally {
        setLoading(false);
      }
    }

    fetchCredits();
  }, []);

  const updateCredits = (newCredits: number) => {
    setCredits(newCredits);
  };

  return {
    credits,
    loading,
    error,
    updateCredits,
  };
}