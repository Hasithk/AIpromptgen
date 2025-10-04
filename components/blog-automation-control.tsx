'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Zap, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export function BlogAutomationControl() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const generateBlogNow = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/blog/generate-now', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      setLastResult(result);

      if (!result.success) {
        setError(result.error || 'Failed to generate blog post');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const triggerAutomatedGeneration = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/blog/cron-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      setLastResult(result);

      if (!result.success && result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-primary" />
            <span>Blog Automation Control</span>
          </CardTitle>
          <CardDescription>
            Generate AI-powered blog posts immediately or set up automated generation every 3 days
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={generateBlogNow}
              disabled={isGenerating}
              className="h-20 flex-col space-y-2"
            >
              <Zap className="h-6 w-6" />
              <div className="text-center">
                <div className="font-semibold">Generate Now</div>
                <div className="text-xs opacity-90">Create blog post immediately</div>
              </div>
            </Button>

            <Button
              onClick={triggerAutomatedGeneration}
              disabled={isGenerating}
              variant="outline"
              className="h-20 flex-col space-y-2"
            >
              <RefreshCw className="h-6 w-6" />
              <div className="text-center">
                <div className="font-semibold">Check Automation</div>
                <div className="text-xs opacity-90">Trigger 3-day automation</div>
              </div>
            </Button>
          </div>

          {isGenerating && (
            <div className="flex items-center justify-center space-x-2 py-4">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Generating blog post...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center space-x-2 p-3 bg-destructive/10 rounded-lg">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="text-sm text-destructive">{error}</span>
            </div>
          )}

          {lastResult && lastResult.success && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">
                  {lastResult.message}
                </span>
              </div>

              {lastResult.post && (
                <Card className="bg-muted/50">
                  <CardContent className="pt-4">
                    <h4 className="font-semibold mb-2">{lastResult.post.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {lastResult.post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Generated: {new Date().toLocaleString()}</span>
                      {lastResult.post.id && (
                        <Badge variant="secondary">ID: {lastResult.post.id}</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {lastResult.nextGeneration && (
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>Next automatic generation:</span>
                  <Badge variant="outline">
                    {new Date(lastResult.nextGeneration).toLocaleDateString()}
                  </Badge>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-primary" />
            <span>Automation Schedule</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Frequency:</span>
              <Badge>Every 3 days</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Content Type:</span>
              <Badge variant="outline">AI News & Trends</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Auto-publish:</span>
              <Badge variant="secondary">Enabled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="font-semibold">🤖 AI-Powered Content</h3>
            <p className="text-sm text-muted-foreground">
              Our blog automation uses DeepSeek AI and real-time news APIs to create 
              engaging, relevant content about AI trends, prompt engineering, and technology updates.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}