'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { RefreshCw, ExternalLink, Search, TrendingUp } from 'lucide-react';
import type { NewsItem } from '@/types';

export function NewsPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Force fresh fetch with cache busting
      const timestamp = Date.now();
      const response = await fetch(`/api/news/latest?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log('Fetched news data:', data);
      
      if (data.success && Array.isArray(data.data)) {
        console.log(`Setting ${data.data.length} news items`);
        setNewsItems(data.data);
        setLastFetch(new Date());
      } else {
        throw new Error(data.error || 'Failed to fetch news');
      }
    } catch (err) {
      console.error('News fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
      setNewsItems([]); // Clear old data on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch news immediately on mount
    fetchNews();
    
    // Auto-refresh news every 5 minutes for more frequent updates
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Filter news based on search term and category
  const filteredNews = newsItems.filter(item => {
    const matchesSearch = !searchTerm || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(new Set(newsItems.map(item => item.category)));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container-max section-padding py-12">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">
            AI News Feed
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest AI news and developments from around the world.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search news..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              {categories.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Categories</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedCategory === null ? 'default' : 'outline'}
                      onClick={() => setSelectedCategory(null)}
                      size="sm"
                    >
                      All
                    </Button>
                    {categories.map(category => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? 'default' : 'outline'}
                        onClick={() => setSelectedCategory(category)}
                        size="sm"
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Refresh Button */}
              <div className="flex justify-between items-center pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {filteredNews.length} article{filteredNews.length !== 1 ? 's' : ''} found
                </p>
                <Button
                  onClick={fetchNews}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={fetchNews} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                    <div className="flex justify-between items-center pt-4">
                      <div className="h-3 bg-muted rounded w-1/4"></div>
                      <div className="h-8 bg-muted rounded w-20"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* News Feed */}
        {!loading && filteredNews.length > 0 && (
          <div className="space-y-4">
            {filteredNews.map((item, index) => (
              <Card 
                key={item.id}
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in overflow-hidden group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Top Bar: Category Badge and Date */}
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(item.publishedAt)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>

                    {/* Footer: Source and Read Button */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <p className="text-xs text-muted-foreground">
                        Source: <span className="font-medium">{item.source}</span>
                      </p>
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2"
                      >
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="group/btn text-primary hover:text-primary/90"
                        >
                          Read More
                          <ExternalLink className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredNews.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedCategory 
                  ? 'No news found matching your search or filter.'
                  : 'No news available at the moment. Please check back later.'}
              </p>
              {(searchTerm || selectedCategory) && (
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory(null);
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Last Updated */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>News updates automatically every 5 minutes</p>
          {lastFetch && (
            <p className="text-xs mt-2">
              Last updated: {lastFetch.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
