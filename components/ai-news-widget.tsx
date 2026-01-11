'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, TrendingUp, Clock } from 'lucide-react';
import { getLatestNews } from '@/lib/api';
import type { NewsItem } from '@/types';

export function AINewsWidget() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await getLatestNews();
        if (response.success) {
          setNews(response.data);
        } else {
          throw new Error(response.error || 'Failed to fetch news');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${Math.floor(diffHours / 24)}d ago`;
    }
  };

  if (error) {
    return (
      <Card className="h-fit sticky top-24">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-primary" />
            AI News
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit sticky top-24">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-primary" />
              AI News
            </CardTitle>
            <CardDescription>
              Latest updates from the AI world
            </CardDescription>
          </div>
          <Badge variant="secondary" className="bg-green-600 text-white font-semibold">
            Live
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full mb-1"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {news.map((item, index) => (
              <div 
                key={item.id} 
                className="group border-b last:border-b-0 pb-4 last:pb-0 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <Badge 
                      variant="outline" 
                      className="text-xs px-2 py-1 bg-primary/10 text-primary border-primary/20"
                    >
                      {item.category}
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(item.publishedAt)}
                    </div>
                  </div>
                  
                  <h4 className="font-medium text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                  
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {item.source}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-1 text-xs hover:text-primary"
                      onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <Button 
          variant="outline" 
          className="w-full mt-4 group"
          size="sm"
          onClick={() => window.open('/ai-news', '_blank')}
        >
          View All News
          <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
}