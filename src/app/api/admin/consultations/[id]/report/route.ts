import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';
import path from 'path';

const MAX_REPORT_SIZE_BYTES = 10 * 1024 * 1024;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const formData = await req.formData();
  const file = formData.get('file');

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ message: 'Report PDF is required.' }, { status: 400 });
  }

  if (file.type !== 'application/pdf') {
    return NextResponse.json({ message: 'Only PDF files are supported.' }, { status: 400 });
  }

  if (file.size > MAX_REPORT_SIZE_BYTES) {
    return NextResponse.json({ message: 'PDF exceeds 10MB size limit.' }, { status: 400 });
  }

  const safeBaseName = path
    .basename(file.name || 'report.pdf')
    .replace(/[^a-zA-Z0-9._-]/g, '_');
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const reportClient = (prisma as unknown as {
    consultationReport?: {
      upsert: (args: unknown) => Promise<unknown>;
    };
  }).consultationReport;

  if (!reportClient) {
    return NextResponse.json(
      { message: 'Server not updated. Run prisma generate and restart the server.' },
      { status: 500 }
    );
  }

  await reportClient.upsert({
    where: { consultationId: id },
    update: {
      fileName: safeBaseName,
      mimeType: file.type,
      data: buffer,
    },
    create: {
      consultationId: id,
      fileName: safeBaseName,
      mimeType: file.type,
      data: buffer,
    },
  });

  const reportUrl = `/api/consultations/${id}/report`;
  const updated = await prisma.consultation.update({
    where: { id },
    data: {
      reportUrl,
      reportFileName: safeBaseName,
      reportUploadedAt: new Date(),
    },
  });

  return NextResponse.json(updated);
}
