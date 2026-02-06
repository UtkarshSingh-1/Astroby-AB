import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { email, otp, newPassword } = await req.json();

  if (!email || !otp || !newPassword) {
    return NextResponse.json({ message: 'Email, OTP, and new password are required.' }, { status: 400 });
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

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { email },
    data: { passwordHash },
  });

  await prisma.otp.deleteMany({ where: { email, purpose: 'RESET_PASSWORD' } });

  return NextResponse.json({ message: 'Password reset successfully.' });
}
