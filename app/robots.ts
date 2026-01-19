import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.aipromptgen.app'
  
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