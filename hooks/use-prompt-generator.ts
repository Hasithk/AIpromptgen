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
      
      if (response.success && response.data?.prompt) {
        setGeneratedPrompt(response.data.prompt);
      } else {
        const errorMsg = response.error || response.message || 'Failed to generate prompt';
        console.error('Prompt generation failed:', response);
        throw new Error(errorMsg);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while generating the prompt';
      console.error('Generate error:', err);
      setError(errorMessage);
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