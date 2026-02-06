import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const services = await prisma.service.findMany({
    orderBy: { createdAt: 'asc' },
  });

  const toSlug = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const existingSlugs = new Set(services.map((s) => s.slug).filter(Boolean) as string[]);
  const updates: Array<{ id: string; slug: string }> = [];

  for (const service of services) {
    if (!service.slug) {
      const base = toSlug(service.name) || `service-${service.id.slice(0, 6)}`;
      let candidate = base;
      let counter = 2;
      while (existingSlugs.has(candidate)) {
        candidate = `${base}-${counter}`;
        counter += 1;
      }
      existingSlugs.add(candidate);
      updates.push({ id: service.id, slug: candidate });
    }
  }

  if (updates.length) {
    await prisma.$transaction(
      updates.map((u) =>
        prisma.service.update({
          where: { id: u.id },
          data: { slug: u.slug },
        })
      )
    );
  }

  const refreshed = updates.length
    ? await prisma.service.findMany({ orderBy: { createdAt: 'asc' } })
    : services;

  return NextResponse.json(refreshed);
}
