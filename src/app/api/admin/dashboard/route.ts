import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const totalUsers = await prisma.user.count({ where: { role: 'USER' } });
  const totalConsultations = await prisma.consultation.count();
  const totalRevenueAgg = await prisma.consultation.aggregate({
    _sum: { price: true },
    where: { paymentStatus: 'completed' },
  });
  const pendingConsultations = await prisma.consultation.count({
    where: { paymentStatus: 'pending' },
  });
  const completedConsultations = await prisma.consultation.count({
    where: { paymentStatus: 'completed' },
  });

  return NextResponse.json({
    totalUsers,
    totalConsultations,
    totalRevenue: totalRevenueAgg._sum.price || 0,
    pendingConsultations,
    completedConsultations,
  });
}
