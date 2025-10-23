'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar, ExternalLink, TrendingUp, RefreshCw, Zap, Globe, Bot, Cpu } from 'lucide-react';
import Link from 'next/link';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source: {
    id: string | null;
    name: string;
  };
  category: string;
  aiRelevance: 'high' | 'medium' | 'low';
}

export function AINewsPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Mock AI news data for demonstration
  const mockNewsData: NewsItem[] = [
    {
      id: '1',
      title: 'OpenAI Announces GPT-5 with Revolutionary Multimodal Capabilities',
      description: 'OpenAI unveils GPT-5, featuring advanced reasoning, real-time web access, and unprecedented multimodal understanding across text, images, audio, and video.',
      url: '#',
      urlToImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      source: { id: 'openai', name: 'OpenAI Blog' },
      category: 'Model Release',
      aiRelevance: 'high'
    },
    {
      id: '2',
      title: 'Google DeepMind Achieves Breakthrough in AI Agent Navigation',
      description: 'New research from Google DeepMind demonstrates AI agents that can navigate complex 3D environments with human-level spatial reasoning and planning.',
      url: '#',
      urlToImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=400&fit=crop',
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      source: { id: 'deepmind', name: 'DeepMind Research' },
      category: 'Research',
      aiRelevance: 'high'
    },
    {
      id: '3',
      title: 'Microsoft Copilot Integration Reaches 1 Billion Users Worldwide',
      description: 'Microsoft announces that Copilot AI assistant has reached 1 billion users across Office 365, Windows, and developer tools, marking a major milestone.',
      url: '#',
      urlToImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop',
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      source: { id: 'microsoft', name: 'Microsoft News' },
      category: 'Industry',
      aiRelevance: 'high'
    },
    {
      id: '4',
      title: 'Anthropic Claude 3.5 Sonnet Shows Superior Code Generation',
      description: 'Latest benchmarks reveal Claude 3.5 Sonnet outperforming competitors in code generation tasks, with 94% accuracy in complex programming challenges.',
      url: '#',
      urlToImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      source: { id: 'anthropic', name: 'Anthropic Research' },
      category: 'Model Release',
      aiRelevance: 'high'
    },
    {
      id: '5',
      title: 'Meta AI Introduces Advanced Video Generation Model',
      description: 'Meta unveils new AI model capable of generating high-quality videos from text descriptions, competing directly with OpenAI Sora and Google Veo.',
      url: '#',
      urlToImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop',
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      source: { id: 'meta', name: 'Meta AI Research' },
      category: 'Model Release',
      aiRelevance: 'high'
    },
    {
      id: '6',
      title: 'EU AI Act Implementation Guidelines Released',
      description: 'European Union publishes comprehensive guidelines for implementing the AI Act, affecting how AI companies operate in European markets.',
      url: '#',
      urlToImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop',
      publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      source: { id: 'eu', name: 'European Commission' },
      category: 'Regulation',
      aiRelevance: 'medium'
    }
  ];

  // Fetch news from API
  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);
      params.append('limit', '20');
      params.append('t', Date.now().toString()); // Cache busting
      
      const response = await fetch(`/api/ai-news?${params}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        cache: 'no-store' as any
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log(`Fetched ${data.total} AI news items`, data);
        setNewsItems(data.news || []);
      } else {
        throw new Error(data.error || 'Failed to fetch AI news');
      }
    } catch (err) {
      console.error('News fetch error:', err);
      setError('Failed to fetch AI news. Please try again later.');
      // Fallback to some basic news items
      setNewsItems(mockNewsData.slice(0, 6));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [selectedCategory, searchTerm]);

  const categories = ['All', 'Model Release', 'Research', 'Industry', 'Regulation', 'Startup'];
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Model Release':
        return <Bot className="h-4 w-4" />;
      case 'Research':
        return <Cpu className="h-4 w-4" />;
      case 'Industry':
        return <TrendingUp className="h-4 w-4" />;
      case 'Regulation':
        return <Globe className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  const getRelevanceBadgeColor = (relevance: 'high' | 'medium' | 'low') => {
    switch (relevance) {
      case 'high':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container-max section-padding py-12">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">
            AI News
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest AI breakthroughs, model releases, and industry developments.
          </p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
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
                <SelectTrigger className="md:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(category)}
                        {category}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

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
          </CardContent>
        </Card>

        {/* Error State */}
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

        {/* Results Count */}
        {!loading && !error && (
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing {newsItems.length} articles
              {searchTerm && ` for "${searchTerm}"`}
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="h-40 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                    <div className="flex justify-between items-center pt-4">
                      <div className="h-3 bg-muted rounded w-1/3"></div>
                      <div className="h-8 bg-muted rounded w-20"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : newsItems.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="space-y-4">
                <Zap className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="text-lg font-medium">No AI news found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || selectedCategory !== 'All'
                    ? 'Try adjusting your filters or search terms.'
                    : 'AI news will appear here as they become available.'}
                </p>
                {(searchTerm || selectedCategory !== 'All') && (
                  <Button onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}>
                    Clear Filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          /* News Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.map((item, index) => (
              <Card 
                key={item.id} 
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in cursor-pointer h-full"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {item.urlToImage && (
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={item.urlToImage}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          <div className="flex items-center gap-1">
                            {getCategoryIcon(item.category)}
                            {item.category}
                          </div>
                        </Badge>
                        <Badge className={`text-xs ${getRelevanceBadgeColor(item.aiRelevance)}`}>
                          {item.aiRelevance} relevance
                        </Badge>
                      </div>
                    </div>
                    
                    <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </CardTitle>
                    
                    <CardDescription className="line-clamp-3">
                      {item.description}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      {item.source.name}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(item.publishedAt)}
                    </div>
                  </div>

                  <Button className="w-full btn-primary group" asChild>
                    <Link href={item.url} target="_blank" rel="noopener noreferrer">
                      Read Full Article
                      <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}