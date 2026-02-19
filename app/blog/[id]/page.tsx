import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User } from 'lucide-react';
import Image from 'next/image';
import { getBlogPostById, getBlogPosts } from '@/lib/prisma';
import { BackButton, ActionButtons } from '@/components/blog-action-buttons';
import { ShareSection } from '@/components/share-section';
import { formatBlogContent } from '@/lib/format-content';
import { blogPosts as staticBlogPosts } from '@/data/blog-posts';

interface BlogPostPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  try {
    const posts = await getBlogPosts();
    if (posts && posts.length > 0) {
      return posts.map((post) => ({
        id: post.id,
      }));
    }
  } catch (error) {
    console.log('Using static blog posts for static params');
  }
  
  // Fallback to static posts
  return staticBlogPosts.map((post) => ({
    id: post.id,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  let post;
  
  try {
    post = await getBlogPostById(params.id);
  } catch (error) {
    // Try static posts
    post = staticBlogPosts.find(p => p.id === params.id);
  }
  
  if (!post) {
    return {
      title: 'Article Not Found | AI Prompt Generator - Best Free AI Prompt Tool'
    };
  }

  const publishedAt = typeof post.publishedAt === 'string' 
    ? post.publishedAt 
    : post.publishedAt.toISOString();

  return {
    title: `${post.title} | AI Prompt Generator Blog`,
    description: post.excerpt || '',
    keywords: [...(Array.isArray(post.tags) ? post.tags : [post.tags]), 'ai prompt', 'ai prompt generator', 'free ai prompt'].join(', '),
    alternates: {
      canonical: `https://www.aipromptgen.app/blog/${params.id}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      type: 'article',
      publishedTime: publishedAt,
      authors: [post.author],
      tags: post.tags,
      url: `https://www.aipromptgen.app/blog/${params.id}`,
      siteName: 'AI Prompt Generator',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || '',
      creator: '@aipromptgen',
    }
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  let post;
  
  try {
    post = await getBlogPostById(params.id);
  } catch (error) {
    // Try static posts
    post = staticBlogPosts.find(p => p.id === params.id);
  }

  if (!post) {
    notFound();
  }

  // Format the content to ensure proper HTML structure
  const formattedContent = formatBlogContent(post.content);

  const publishedDate = typeof post.publishedAt === 'string'
    ? post.publishedAt
    : post.publishedAt.toISOString();

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt || '',
    "author": {
      "@type": "Organization",
      "name": post.author,
      "url": "https://www.aipromptgen.app"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AI Prompt Generator",
      "url": "https://www.aipromptgen.app",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.aipromptgen.app/Aipromptgen.png"
      }
    },
    "datePublished": publishedDate,
    "dateModified": publishedDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.aipromptgen.app/blog/${post.id}`
    },
    "keywords": Array.isArray(post.tags) ? post.tags.join(', ') : post.tags,
    "articleSection": post.category,
    "wordCount": post.content.split(/\s+/).length
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "AI Prompt Generator",
        "item": "https://www.aipromptgen.app"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "AI Prompt Blog",
        "item": "https://www.aipromptgen.app/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://www.aipromptgen.app/blog/${post.id}`
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <BackButton />

          {/* Article Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="secondary">{post.category}</Badge>
              {post.featured && (
                <Badge variant="default">Featured</Badge>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {post.title}
            </h1>

            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <ActionButtons title={post.title} />
          </div>

          {/* Article Content */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div 
                className="prose prose-lg max-w-none dark:prose-invert
                  prose-headings:font-bold prose-headings:text-foreground
                  prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                  prose-p:text-muted-foreground prose-p:leading-7 prose-p:mb-4
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-foreground prose-strong:font-semibold
                  prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4 prose-ul:space-y-2
                  prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4 prose-ol:space-y-2
                  prose-li:text-muted-foreground prose-li:leading-7
                  prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-4
                  prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                  prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg prose-pre:my-4 prose-pre:overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: formattedContent }}
              />
            </CardContent>
          </Card>

          {/* Article Tags */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(post.tags) ? post.tags : [post.tags]).map((tag: string) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Share Section */}
          <ShareSection title={post.title} excerpt={post.excerpt || ''} />

          {/* Related Articles */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* This will be populated with related articles */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-sm text-muted-foreground mb-2">Related Article</div>
                  <h4 className="font-semibold mb-2">More AI content coming soon...</h4>
                  <p className="text-sm text-muted-foreground">
                    Explore more articles about AI, prompt engineering, and technology trends.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}