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
    select: { userId: true },
  });

  if (!consultation) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  const isAdmin = session.user.role === 'ADMIN';
  const isOwner = session.user.id === consultation.userId;
  if (!isAdmin && !isOwner) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const report = await prisma.consultationReport.findUnique({
    where: { consultationId: id },
  });

  if (!report) {
    return NextResponse.json({ message: 'Report not found' }, { status: 404 });
  }

  const fileName = report.fileName || 'consultation-report.pdf';

  return new Response(report.data, {
    headers: {
      'Content-Type': report.mimeType || 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Cache-Control': 'private, max-age=0, no-cache',
    },
  });
}
