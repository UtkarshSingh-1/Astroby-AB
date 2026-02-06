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

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { name, slug, price, description, icon, features } = body || {};
  const finalSlug = slug ? slug : name ? toSlug(name) : undefined;

  const service = await prisma.service.update({
    where: { id: params.id },
    data: {
      name: name || undefined,
      slug: finalSlug || undefined,
      price: typeof price === 'number' ? price : undefined,
      description: description ?? undefined,
      icon: icon ?? undefined,
      features: Array.isArray(features) ? features : undefined,
    },
  });

  return NextResponse.json(service);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await prisma.service.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
