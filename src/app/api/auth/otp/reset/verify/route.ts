import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { email, otp } = await req.json();

  if (!email || !otp) {
    return NextResponse.json({ message: 'Email and OTP are required.' }, { status: 400 });
  }

  const record = await prisma.otp.findFirst({
    where: {
      email,
      otp,
      purpose: 'RESET_PASSWORD',
      expiresAt: { gt: new Date() },
    },
  });

  if (!record) {
    return NextResponse.json({ message: 'Invalid or expired OTP.' }, { status: 400 });
  }

  return NextResponse.json({ message: 'OTP verified.' });
}
