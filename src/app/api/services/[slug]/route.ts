import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const service = await prisma.service.findUnique({
    where: { slug },
  });

  if (!service) {
    return NextResponse.json({ message: 'Service not found' }, { status: 404 });
  }

  return NextResponse.json(service);
}
