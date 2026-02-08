import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getMailer } from '@/lib/mailer';
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

  const { mailer, emailFrom } = getMailer();
  if (!mailer || !emailFrom) {
    return NextResponse.json({ message: 'SMTP not configured.' }, { status: 500 });
  }

  const subject = 'Your AstrobyAB password reset OTP';
  const text = [
    `We received a request to reset your AstrobyAB password.`,
    ``,
    `Your OTP is: ${otp}`,
    `This code expires in 10 minutes.`,
    ``,
    `About AstrobyAB:`,
    `- Trusted Vedic astrology guidance`,
    `- Personalized insights based on your birth details`,
    `- Your data is handled with care and privacy`,
    ``,
    `If you did not request a reset, you can ignore this email.`,
  ].join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.5;">
      <h2 style="margin: 0 0 12px;">Reset Your AstrobyAB Password</h2>
      <p>Use the OTP below to reset your password:</p>
      <div style="font-size: 28px; font-weight: 700; letter-spacing: 4px; margin: 12px 0; color: #7f1d1d;">
        ${otp}
      </div>
      <p>This code expires in <strong>10 minutes</strong>.</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
      <p style="margin: 0 0 6px;"><strong>About AstrobyAB</strong></p>
      <ul style="margin: 0 0 12px; padding-left: 18px;">
        <li>Trusted Vedic astrology guidance</li>
        <li>Personalized insights based on your birth details</li>
        <li>Your data is handled with care and privacy</li>
      </ul>
      <p style="margin: 0;">If you did not request a reset, you can ignore this email.</p>
    </div>
  `;

  await mailer.sendMail({
    from: emailFrom,
    to: email,
    subject,
    text,
    html,
  });

  return NextResponse.json({ message: 'OTP sent successfully.' });
}
