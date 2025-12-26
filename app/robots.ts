import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://aipromptgen.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/auth/',
          '/admin/',
          '/_next/',
          '/private/',
          '/history',
          '/docs',
          '*.php',
          '*.cgi',
          '/search/',
          '/portal/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}