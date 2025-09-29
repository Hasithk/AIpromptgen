'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExternalLink, TrendingUp, Clock, Search, RefreshCw } from 'lucide-react';
import { getLatestNews } from '@/lib/api';
import type { NewsItem } from '@/types';

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getLatestNews();
      if (response.success) {
        setNews(response.data);
        setFilteredNews(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch news');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    let filtered = news;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setFilteredNews(filtered);
  }, [news, searchTerm, selectedCategory]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    }
  };

  const categories = ['all', ...Array.from(new Set(news.map(item => item.category)))];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <TrendingUp className="mr-3 h-8 w-8 text-primary" />
                AI News Hub
              </h1>
              <p className="text-muted-foreground mt-2">
                Stay updated with the latest developments in artificial intelligence
              </p>
            </div>
            <Button
              onClick={fetchNews}
              disabled={loading}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search AI news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">{error}</p>
              <Button onClick={fetchNews} className="mt-4" variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="pt-6">
                  <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
                  <div className="h-6 bg-muted rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3 mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-3 bg-muted rounded w-1/4"></div>
                    <div className="h-3 bg-muted rounded w-1/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item, index) => (
              <Card 
                key={item.id} 
                className="group hover:shadow-lg transition-all duration-200 animate-fade-in cursor-pointer"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
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
                  
                  <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="line-clamp-3 mb-4">
                    {item.description}
                  </CardDescription>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-medium">
                      {item.source}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-2 text-xs hover:text-primary group-hover:translate-x-1 transition-transform"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(item.url, '_blank', 'noopener,noreferrer');
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredNews.length === 0 && !error && (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No AI news found matching your criteria.</p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }} 
                className="mt-4" 
                variant="outline"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
