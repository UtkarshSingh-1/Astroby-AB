import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EMAIL_FROM, mailer } from '@/lib/mailer';
import { generateOTP, otpExpiry, secondsUntilResend } from '@/lib/otp';

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ message: 'Email is required.' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ message: 'No account found for this email.' }, { status: 404 });
  }

  const lastOtp = await prisma.otp.findFirst({
    where: { email, purpose: 'RESET_PASSWORD' },
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
  await prisma.otp.deleteMany({ where: { email, purpose: 'RESET_PASSWORD' } });
  await prisma.otp.create({
    data: {
      email,
      otp,
      purpose: 'RESET_PASSWORD',
      expiresAt: otpExpiry(),
    },
  });

  await mailer.sendMail({
    from: EMAIL_FROM,
    to: email,
    subject: 'Your AstrobyAB password reset OTP',
    text: `Your OTP is ${otp}. It expires in 10 minutes.`,
  });

  return NextResponse.json({ message: 'OTP sent successfully.' });
}
