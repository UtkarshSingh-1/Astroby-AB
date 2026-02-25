import type { MetadataRoute } from 'next';

const FALLBACK_SITE_URL = 'https://www.astrobyab.in';

function getBaseUrl(): string {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXTAUTH_URL ??
    FALLBACK_SITE_URL;

  return configured.replace(/\/+$/, '');
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/dashboard', '/api'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
