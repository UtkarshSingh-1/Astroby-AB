import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const consultations = await prisma.consultation.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(consultations);
}
