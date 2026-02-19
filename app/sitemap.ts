import { MetadataRoute } from 'next'
import { blogPosts } from '@/data/blog-posts'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.aipromptgen.app'
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date('2026-02-19'),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date('2026-02-19'),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/library`,
      lastModified: new Date('2026-02-19'),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: new Date('2026-02-19'),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date('2026-02-19'),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/ai-news`,
      lastModified: new Date('2026-02-19'),
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date('2026-02-19'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date('2026-02-19'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date('2026-02-19'),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date('2026-02-19'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date('2026-02-19'),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date('2026-02-19'),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  // Dynamic blog post pages
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => {
    const dateStr = (post as any).date || post.publishedAt || '2026-02-19';
    const parsed = new Date(dateStr);
    const lastMod = isNaN(parsed.getTime()) ? new Date('2026-02-19') : parsed;
    return {
      url: `${baseUrl}/blog/${post.id}`,
      lastModified: lastMod,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    };
  })

  return [...staticPages, ...blogPages]
}