import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.log("[GET /api/profile] Unauthorized: No session or user found");
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user?.id;
    if (!userId) {
      console.log("[GET /api/profile] Unauthorized: No userId in session");
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

    if (!user) {
      console.log("[GET /api/profile] User not found in database for ID:", userId);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user, profile: user?.profile || null });
  } catch (error) {
    console.error("[GET /api/profile] Critical Error:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.log("[PUT /api/profile] Unauthorized: No session found");
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user?.id;
    if (!userId) {
      console.log("[PUT /api/profile] Unauthorized: No userId in session");
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    console.log("[PUT /api/profile] Received Body:", body);

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

    // Attempt to parse date carefully
    let parsedDOB = undefined;
    if (dateOfBirth) {
      const date = new Date(dateOfBirth);
      if (!isNaN(date.getTime())) {
        parsedDOB = date;
      } else {
        console.warn("[PUT /api/profile] Invalid Date encountered:", dateOfBirth);
      }
    }

    const profile = await prisma.userProfile.upsert({
      where: { userId },
      update: {
        dateOfBirth: parsedDOB,
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
        dateOfBirth: parsedDOB,
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

    console.log("[PUT /api/profile] Profile updated successfully for user:", userId);
    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("[PUT /api/profile] Critical Error:", error);
    return NextResponse.json({ message: 'Internal Server Error', error: String(error) }, { status: 500 });
  }
}
