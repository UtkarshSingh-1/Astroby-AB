import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const email = searchParams.get('email');

  if (!userId && !email) {
    return NextResponse.json([]);
  }

  const whereClause =
    userId && email
      ? { OR: [{ userId }, { email }] }
      : userId
      ? { userId }
      : email
      ? { email }
      : {};

  const consultations = await prisma.consultation.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(consultations);
}
