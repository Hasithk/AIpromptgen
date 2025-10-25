'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar, User, ArrowRight, TrendingUp, RefreshCw } from 'lucide-react';
import type { BlogPost } from '@/types';
import Link from 'next/link';

export function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 9;

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') {
        params.append('category', selectedCategory);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      params.append('limit', itemsPerPage.toString());
      params.append('page', currentPage.toString());
      params.append('t', Date.now().toString());
      
      const response = await fetch(`/api/blog-articles?${params.toString()}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      if (data.success) {
        setBlogPosts(data.posts || []);
        setTotalPages(data.totalPages || 1);
      } else {
        throw new Error(data.error || 'Failed to fetch blog posts');
      }
    } catch (err) {
      console.error('Blog fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch blog posts');
      setBlogPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    fetchBlogPosts();
  }, [currentPage, selectedCategory, searchTerm]);

  const categories = ['All'];
  blogPosts.forEach((post: BlogPost) => {
    if (!categories.includes(post.category)) {
      categories.push(post.category);
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      const isFirst3 = i <= 3;
      const isLast3 = i > totalPages - 3;
      const isNearCurrent = Math.abs(i - currentPage) <= 1;
      
      if (isFirst3 || isLast3 || isNearCurrent) {
        pages.push(
          <Button
            key={i}
            variant={i === currentPage ? 'default' : 'outline'}
            onClick={() => {
              setCurrentPage(i);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="min-w-10"
          >
            {i}
          </Button>
        );
      } else if ((i === 4 && !isFirst3) || (i === totalPages - 3 && !isLast3)) {
        pages.push(
          <span key={`ellipsis-${i}`} className="px-2 py-2 text-muted-foreground">
            ...
          </span>
        );
      }
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container-max section-padding py-12">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">AI Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest AI news, prompt engineering techniques, and industry insights.
          </p>
        </div>

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
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
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
        ) : blogPosts.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">
                No blog articles found.
              </p>
              <p className="text-xs text-muted-foreground">
                Call: /api/blog/generate-all?secret=CRON_SECRET
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {blogPosts.map((post: BlogPost) => (
                <Link href={`/blog/${post.id}`} key={post.id}>
                  <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full overflow-hidden flex flex-col">
                    {/* Cover Image */}
                    {post.coverImage && (
                      <div className="relative w-full h-48 overflow-hidden bg-muted">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized={true}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (target && target.src !== 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&auto=format&w=1200&h=600&fit=crop') {
                              target.src = 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&auto=format&w=1200&h=600&fit=crop';
                            }
                          }}
                        />
                      </div>
                    )}

                    <CardHeader className="pb-3 pt-4 flex-1 flex flex-col">
                      <div className="space-y-3 flex-1">
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
                        
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {post.author}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(post.publishedAt)}
                        </div>
                      </div>

                      <div className="w-full flex items-center justify-center py-2 px-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium gap-1">
                        Read More
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12 pb-8 flex-wrap">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentPage(Math.max(1, currentPage - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                >
                  ← Previous
                </Button>

                <div className="flex gap-1 flex-wrap justify-center">
                  {renderPageNumbers()}
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentPage(Math.min(totalPages, currentPage + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                >
                  Next →
                </Button>
              </div>
            )}

            <div className="text-center text-sm text-muted-foreground pb-4">
              Page {currentPage} of {totalPages}
            </div>
          </>
        )}

        <Card className="mt-16 border-0 bg-hero-gradient text-white">
          <CardContent className="p-8 text-center">
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Stay Updated</h3>
                <p className="text-white/90">
                  Get the latest AI news and prompt engineering tips delivered weekly.
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
