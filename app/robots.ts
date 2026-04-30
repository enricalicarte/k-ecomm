import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/checkout/', '/cuenta/', '/*?*sort=', '/*?*filter='],
      },
      {
        userAgent: [
          'GPTBot',
          'ClaudeBot',
          'Claude-Web',
          'PerplexityBot',
          'Google-Extended',
          'cohere-ai',
          'Applebot-Extended'
        ],
        allow: '/',
      },
    ],
    sitemap: 'https://kauai-archive.kauai.es/sitemap.xml',
  };
}
