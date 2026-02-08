import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateKundli, getCacheKey, type KundliInput } from '@/lib/kundli-engine';

const DEFAULT_AYANAMSA = 'Lahiri';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const calculation = await prisma.kundliCalculation.findFirst({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
  });

  if (!calculation) {
    return NextResponse.json({ result: null });
  }

  return NextResponse.json({ result: calculation.result, cacheKey: calculation.cacheKey });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const {
    dateOfBirth,
    timeOfBirth,
    placeOfBirth,
    latitude,
    longitude,
    timezone,
    ayanamsa,
    saveToProfile = true,
  } = body || {};

  if (!dateOfBirth || !timeOfBirth || !placeOfBirth) {
    return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
  }

  const input: KundliInput = {
    dateOfBirth,
    timeOfBirth,
    placeOfBirth,
    latitude: Number(latitude || 0),
    longitude: Number(longitude || 0),
    timezone: timezone || 'UTC',
  };

  const resolvedAyanamsa = ayanamsa || DEFAULT_AYANAMSA;
  const cacheKey = getCacheKey(input, resolvedAyanamsa);

  const cached = await prisma.kundliCalculation.findUnique({
    where: { cacheKey },
  });

  if (cached) {
    return NextResponse.json({ result: cached.result, cacheKey, cached: true });
  }

  const result = await generateKundli(input, resolvedAyanamsa);

  await prisma.kundliCalculation.create({
    data: {
      userId: session.user.id,
      cacheKey,
      input: input as unknown as object,
      result: result as unknown as object,
      engine: result.metadata.engine,
      ayanamsa: resolvedAyanamsa,
    },
  });

  if (saveToProfile) {
    await prisma.userProfile.upsert({
      where: { userId: session.user.id },
      update: {
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        timeOfBirth: timeOfBirth ?? undefined,
        birthPlace: placeOfBirth ?? undefined,
        latitude: latitude != null ? String(latitude) : undefined,
        longitude: longitude != null ? String(longitude) : undefined,
      },
      create: {
        userId: session.user.id,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        timeOfBirth: timeOfBirth ?? undefined,
        birthPlace: placeOfBirth ?? undefined,
        latitude: latitude != null ? String(latitude) : undefined,
        longitude: longitude != null ? String(longitude) : undefined,
      },
    });
  }

  return NextResponse.json({ result, cacheKey, cached: false });
}
