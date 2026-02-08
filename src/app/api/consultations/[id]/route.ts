import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const consultation = await prisma.consultation.findUnique({
    where: { id },
  });

  if (!consultation) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  const isAdmin = session.user.role === 'ADMIN';
  const isOwner = consultation.userId === session.user.id;
  if (!isAdmin && !isOwner) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json(consultation);
}
