import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user?.id;
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
      profile: true,
    },
  });

  return NextResponse.json({ user, profile: user?.profile || null });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user?.id;
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const {
    name,
    dateOfBirth,
    timeOfBirth,
    birthPlace,
    birthCity,
    birthCountry,
    gender,
    maritalStatus,
    education,
    profession,
    bio,
  } = body || {};

  if (typeof name === 'string' && name.trim().length) {
    await prisma.user.update({
      where: { id: userId },
      data: { name: name.trim() },
    });
  }

  const profile = await prisma.userProfile.upsert({
    where: { userId },
    update: {
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      timeOfBirth: timeOfBirth ?? undefined,
      birthPlace: birthPlace ?? undefined,
      birthCity: birthCity ?? undefined,
      birthCountry: birthCountry ?? undefined,
      gender: gender ?? undefined,
      maritalStatus: maritalStatus ?? undefined,
      education: education ?? undefined,
      profession: profession ?? undefined,
      bio: bio ?? undefined,
    },
    create: {
      userId,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      timeOfBirth: timeOfBirth ?? undefined,
      birthPlace: birthPlace ?? undefined,
      birthCity: birthCity ?? undefined,
      birthCountry: birthCountry ?? undefined,
      gender: gender ?? undefined,
      maritalStatus: maritalStatus ?? undefined,
      education: education ?? undefined,
      profession: profession ?? undefined,
      bio: bio ?? undefined,
    },
  });

  return NextResponse.json({ success: true, profile });
}
