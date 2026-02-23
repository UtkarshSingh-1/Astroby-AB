import type { MetadataRoute } from 'next';

import { prisma } from '@/lib/prisma';

const FALLBACK_SITE_URL = 'https://astroby-ab-sy16.vercel.app';

function getBaseUrl(): string {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXTAUTH_URL ??
    FALLBACK_SITE_URL;

  return configured.replace(/\/+$/, '');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ];

  try {
    const services = await prisma.service.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
      where: {
        slug: {
          not: null,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    const serviceRoutes: MetadataRoute.Sitemap = services
      .filter((service): service is { slug: string; updatedAt: Date } => Boolean(service.slug))
      .map((service) => ({
        url: `${baseUrl}/services/${service.slug}`,
        lastModified: service.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.85,
      }));

    return [...staticRoutes, ...serviceRoutes];
  } catch {
    return staticRoutes;
  }
}
