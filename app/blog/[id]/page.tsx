'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';
import type { BlogPost } from '@/types';

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all blog articles and find the one with matching ID
        const response = await fetch(`/api/blog-articles?limit=1000&page=1&t=${Date.now()}`);
        if (!response.ok) throw new Error('Failed to fetch blog posts');

        const data = await response.json();
        const articles: BlogPost[] = data.posts || [];

        // Find article with matching ID
        const foundPost = articles.find((article: BlogPost) => article.id === params.id);

        if (foundPost) {
          setPost(foundPost);
        } else {
          setError('Blog post not found');
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError(err instanceof Error ? err.message : 'Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container-max section-padding py-12">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="h-12 bg-muted rounded-lg animate-pulse"></div>
            <div className="aspect-video bg-muted rounded-lg animate-pulse"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 bg-muted rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container-max section-padding py-12">
          <div className="max-w-3xl mx-auto">
            <Link href="/blog">
              <Button variant="ghost" className="mb-8">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-destructive mb-4">{error || 'Blog post not found'}</p>
                <Link href="/blog">
                  <Button>Return to Blog</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container-max section-padding py-12">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <Link href="/blog">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>

          {/* Article Header */}
          <article className="space-y-8">
            {/* Metadata & Category */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="text-sm">
                  {post.category}
                </Badge>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{post.readTime}</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold leading-tight gradient-text">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="text-lg text-muted-foreground">
                {post.excerpt}
              </p>

              {/* Article Info */}
              <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-b py-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="h-4 w-4 mr-2" />
                    {post.author}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(post.publishedAt)}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>

            {/* Cover Image */}
            {post.coverImage && (
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg bg-muted">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  className="object-cover"
                  priority
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

            {/* Article Content */}
            <div className="prose prose-invert max-w-none dark:prose-invert">
              <div className="text-lg text-foreground/90 leading-relaxed space-y-6">
                {post.content.split('\n---\n').map((section: string, idx: number) => (
                  <div key={idx} className="space-y-4">
                    {section.split('\n').map((line: string, lineIdx: number) => {
                      const trimmedLine = line.trim();
                      
                      // Skip empty lines but preserve spacing
                      if (!trimmedLine) {
                        return <div key={`${idx}-${lineIdx}`} className="h-2" />;
                      }
                      
                      // Handle numbered items (1. 2. 3. etc)
                      if (/^\d+\./.test(trimmedLine)) {
                        return (
                          <h3 key={`${idx}-${lineIdx}`} className="text-xl font-bold mt-6 mb-3">
                            {trimmedLine}
                          </h3>
                        );
                      }
                      
                      // Handle source lines
                      if (trimmedLine.startsWith('Source:')) {
                        return (
                          <p key={`${idx}-${lineIdx}`} className="text-sm text-muted-foreground italic">
                            {trimmedLine}
                          </p>
                        );
                      }
                      
                      // Handle URL lines
                      if (trimmedLine.startsWith('URL:')) {
                        const url = trimmedLine.replace('URL: ', '').trim();
                        return (
                          <p key={`${idx}-${lineIdx}`} className="text-sm">
                            <a 
                              href={url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              Read the full article →
                            </a>
                          </p>
                        );
                      }
                      
                      // Regular paragraph
                      return (
                        <p key={`${idx}-${lineIdx}`} className="text-base leading-relaxed">
                          {trimmedLine}
                        </p>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-4 pt-8 border-t">
              <div className="space-y-3">
                <h3 className="font-semibold">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <Card className="border-0 bg-hero-gradient text-white">
              <CardContent className="p-8 text-center">
                <div className="space-y-4 max-w-2xl mx-auto">
                  <h3 className="text-2xl font-bold">Enjoyed this article?</h3>
                  <p className="text-white/90">
                    Check out more AI news, prompts, and insights on our blog.
                  </p>
                  <Link href="/blog">
                    <Button className="bg-white text-primary hover:bg-white/90">
                      Back to Blog
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t">
              <Link href="/blog">
                <Button variant="outline">← Back to Blog</Button>
              </Link>
              <Link href="/ai-news">
                <Button variant="outline">View AI News →</Button>
              </Link>
            </div>
          </article>
        </div>
      </div>

      {/* Related Articles Section */}
      <div className="container-max section-padding py-20">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text">
              More from the Blog
            </h2>
            <p className="text-muted-foreground">
              Discover more AI insights and news summaries
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded w-1/3 animate-pulse"></div>
                  <div className="h-6 bg-muted rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center pt-8">
            <Link href="/blog">
              <Button size="lg" className="gap-2">
                Explore All Articles
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}