import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const cacheKey = searchParams.get('cacheKey');

  const calculation = await prisma.kundliCalculation.findFirst({
    where: {
      userId: session.user.id,
      ...(cacheKey ? { cacheKey } : {}),
    },
    orderBy: { updatedAt: 'desc' },
  });

  if (!calculation) {
    return NextResponse.json({ message: 'No kundli data found.' }, { status: 404 });
  }

  const result = calculation.result as {
    input?: {
      dateOfBirth?: string;
      timeOfBirth?: string;
      placeOfBirth?: string;
      timezone?: string;
    };
    metadata?: {
      engine?: string;
      ayanamsa?: string;
      generatedAt?: string;
    };
  };

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]);
  const { width } = page.getSize();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  page.drawText('AstrobyAB Kundli Report', {
    x: 40,
    y: 800,
    size: 20,
    font: fontBold,
    color: rgb(0.49, 0.11, 0.11),
  });

  const details = [
    `Generated: ${result?.metadata?.generatedAt || new Date().toISOString()}`,
    `Engine: ${result?.metadata?.engine || 'external-api'}`,
    `Ayanamsa: ${result?.metadata?.ayanamsa || 'Lahiri'}`,
    `DOB: ${result?.input?.dateOfBirth || '-'}`,
    `TOB: ${result?.input?.timeOfBirth || '-'}`,
    `Place: ${result?.input?.placeOfBirth || '-'}`,
    `Timezone: ${result?.input?.timezone || '-'}`,
  ];

  let y = 770;
  details.forEach((line) => {
    page.drawText(line, { x: 40, y, size: 11, font });
    y -= 16;
  });

  page.drawText('Charts (D1, D9, D10, Bhava)', {
    x: 40,
    y: 640,
    size: 13,
    font: fontBold,
  });

  const boxTop = 610;
  const boxWidth = (width - 100) / 3;
  const boxHeight = 140;
  const labels = ['D1 (Rasi)', 'D9 (Navamsa)', 'D10 (Dasamsa)'];

  labels.forEach((label, index) => {
    const x = 40 + index * (boxWidth + 10);
    page.drawRectangle({
      x,
      y: boxTop - boxHeight,
      width: boxWidth,
      height: boxHeight,
      borderColor: rgb(0.8, 0.8, 0.8),
      borderWidth: 1,
    });
    page.drawText(label, { x: x + 8, y: boxTop - 18, size: 10, font: fontBold });
    page.drawText('Chart data rendered in app view.', { x: x + 8, y: boxTop - 36, size: 9, font });
  });

  page.drawText('Bhava Chart', {
    x: 40,
    y: 420,
    size: 13,
    font: fontBold,
  });
  page.drawRectangle({
    x: 40,
    y: 380,
    width: width - 80,
    height: 100,
    borderColor: rgb(0.8, 0.8, 0.8),
    borderWidth: 1,
  });
  page.drawText('Bhava details are available in the app view.', {
    x: 50,
    y: 440,
    size: 9,
    font,
  });

  const pdfBytes = await pdf.save();

  return new Response(Buffer.from(pdfBytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="kundli-report.pdf"',
      'Cache-Control': 'private, max-age=0, no-cache',
    },
  });
}
