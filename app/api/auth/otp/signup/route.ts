import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { EMAIL_FROM, mailer } from '@/lib/mailer';
import { generateOTP, otpExpiry, secondsUntilResend } from '@/lib/otp';

export async function POST(req: Request) {
  const { email, password, name } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json({ message: 'Email, password, and name are required.' }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ message: 'Email already registered. Please sign in.' }, { status: 409 });
  }

  const lastOtp = await prisma.otp.findFirst({
    where: { email, purpose: 'SIGNUP' },
    orderBy: { createdAt: 'desc' },
  });
  if (lastOtp) {
    const remaining = secondsUntilResend(lastOtp.createdAt);
    if (remaining > 0) {
      return NextResponse.json(
        { message: `Please wait ${remaining}s before requesting a new OTP.`, retryAfter: remaining },
        { status: 429 }
      );
    }
  }

  const otp = generateOTP();
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.otp.deleteMany({ where: { email, purpose: 'SIGNUP' } });
  await prisma.otp.create({
    data: {
      email,
      otp,
      purpose: 'SIGNUP',
      expiresAt: otpExpiry(),
      passwordHash,
      name,
    },
  });

  await mailer.sendMail({
    from: EMAIL_FROM,
    to: email,
    subject: 'Your AstrobyAB signup OTP',
    text: `Your OTP is ${otp}. It expires in 10 minutes.`,
  });

  return NextResponse.json({ message: 'OTP sent successfully.' });
}
