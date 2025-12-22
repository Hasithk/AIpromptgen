'use client';

import { useState } from 'react';
import { generatePrompt } from '@/lib/api';

interface PromptParams {
  subject: string;
  platform: string;
  styles: string[];
  mood?: string;
  lighting?: string;
  creativity: number;
  duration?: number;
  includeNegative: boolean;
  type?: 'image' | 'video';
}

export function usePromptGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);

  const generate = async (params: PromptParams) => {
    try {
      setIsGenerating(true);
      setError(null);
      
      const response = await generatePrompt(params);
      
      if (response.success) {
        setGeneratedPrompt(response.data.prompt);
        return response; // Return the response so we can access creditsUsed
      } else {
        throw new Error(response.error || 'Failed to generate prompt');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err; // Re-throw to handle in component
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setGeneratedPrompt('');
    setError(null);
  };

  return {
    generate,
    reset,
    isGenerating,
    generatedPrompt,
    error,
  };
}