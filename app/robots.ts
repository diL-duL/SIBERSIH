import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://sibersih.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/login', '/login/register', '/login/forgot-password'],
        disallow: ['/reporter/', '/staff/', '/executive/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
