import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { paymentStatus, notes } = body || {};

  const updated = await prisma.consultation.update({
    where: { id },
    data: {
      paymentStatus: paymentStatus ?? undefined,
      notes: notes ?? undefined,
    },
  });

  return NextResponse.json(updated);
}
