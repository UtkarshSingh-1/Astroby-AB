import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { name, slug, price, description, icon, features } = body || {};

  if (!name || typeof price !== 'number') {
    return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
  }

  const finalSlug = slug ? slug : toSlug(name);

  const service = await prisma.service.create({
    data: {
      name,
      slug: finalSlug || undefined,
      price,
      description: description || undefined,
      icon: icon || undefined,
      features: Array.isArray(features) ? features : [],
    },
  });

  return NextResponse.json(service);
}
