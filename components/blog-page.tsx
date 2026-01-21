'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar, User, ArrowRight, TrendingUp, RefreshCw, Plus } from 'lucide-react';
import { getBlogPosts } from '@/lib/api';
import type { BlogPost } from '@/types';
import Link from 'next/link';
import { blogPosts as staticBlogPosts } from '@/data/blog-posts';

export function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  // Fetch blog posts
  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/blog?${
        new URLSearchParams({
          ...(selectedCategory !== 'All' && { category: selectedCategory }),
          ...(searchTerm && { search: searchTerm }),
          limit: '100'
        })
      }`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setBlogPosts(data.posts || []);
      } else {
        throw new Error(data.error || 'Failed to fetch blog posts');
      }
    } catch (err) {
      console.error('Blog fetch error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch blog posts. Please try again later.';
      
      // Use static blog posts as fallback
      setBlogPosts(staticBlogPosts);
      
      // Only show error message for non-database errors
      if (!errorMessage.includes('500') && !errorMessage.includes('database')) {
        setError(errorMessage);
      } else {
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, [selectedCategory, searchTerm]);

  // Filter posts based on search and category (done on server side now, but keeping for client-side refinement)
  const categories = ['All', ...Array.from(new Set(blogPosts.map(post => post.category)))];
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container-max section-padding py-12">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">
            AI Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest AI news, prompt engineering techniques, and industry insights.
          </p>
        </div>

        {/* Adstera Native Banner Ad */}
        <div className="mb-8">
          <script 
            async
            data-cfasync="false" 
            src="https://pl28340926.effectivegatecpm.com/b5f74cb024e464af5087017b5cf56ec6/invoke.js"
          />
          <div id="container-b5f74cb024e464af5087017b5cf56ec6"></div>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <Card className="mb-12 border-0 shadow-2xl bg-hero-gradient text-white overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Badge className="bg-white/20 text-white border-white/30">
                    Featured
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/30">
                    {featuredPost.category}
                  </Badge>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                  {featuredPost.title}
                </h2>
                
                <p className="text-lg text-white/90 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-white/80">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      {featuredPost.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(featuredPost.date)}
                    </div>
                    <span>{featuredPost.readTime}</span>
                  </div>
                  
                  <Link href={`/blog/${featuredPost.id}`}>
                    <Button className="bg-white text-primary hover:bg-white/90 group">
                      Read Article
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters and Controls */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={fetchBlogPosts}
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
              <Button onClick={fetchBlogPosts} className="mt-4" variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {!loading && !error && (
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing {blogPosts.length} articles
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
        ) : !error && blogPosts.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">No blog posts available yet. New posts are automatically generated from trending AI news every 3 days.</p>
            </CardContent>
          </Card>
        ) : (
          // Blog Posts Grid
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post, index) => (
            <Link href={`/blog/${post.id}`} key={post.id}>
              <Card 
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in cursor-pointer h-full"
                style={{ animationDelay: `${index * 100}ms` }}
              >
              <CardHeader className="pb-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {post.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {post.readTime}
                    </span>
                  </div>
                  
                  <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                  
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(post.date)}
                  </div>
                </div>

                <div className="w-full btn-primary group flex items-center justify-center py-2 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  Read More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
              </Card>
            </Link>
            ))}
          </div>
        )}

        {!loading && !error && regularPosts.length === 0 && blogPosts.length > 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              No articles found matching your criteria.
            </p>
            <Button onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* Adstera Ad - Mid Content */}
        <div className="my-12 text-center">
          <script 
            async
            data-cfasync="false" 
            src="https://pl28340926.effectivegatecpm.com/b5f74cb024e464af5087017b5cf56ec6/invoke.js"
          />
          <div id="container-b5f74cb024e464af5087017b5cf56ec6"></div>
        </div>

        {/* Newsletter Signup */}
        <Card className="mt-16 border-0 bg-hero-gradient text-white">
          <CardContent className="p-8 text-center">
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Stay Updated</h3>
                <p className="text-white/90">
                  Get the latest AI news and prompt engineering tips delivered to your inbox weekly.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input 
                  placeholder="Enter your email"
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                />
                <Button className="bg-white text-primary hover:bg-white/90 whitespace-nowrap">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Subscribe
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}