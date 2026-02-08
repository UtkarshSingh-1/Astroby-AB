import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { getMailer } from '@/lib/mailer';
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

  const { mailer, emailFrom } = getMailer();
  if (!mailer || !emailFrom) {
    return NextResponse.json({ message: 'SMTP not configured.' }, { status: 500 });
  }

  const subject = 'Your AstrobyAB signup OTP';
  const text = [
    `Welcome to AstrobyAB!`,
    ``,
    `Your signup OTP is: ${otp}`,
    `This code expires in 10 minutes.`,
    ``,
    `Why AstrobyAB?`,
    `- Personalized Vedic insights tailored to your birth details`,
    `- Private and secure handling of your information`,
    `- Expert guidance to support key life decisions`,
    ``,
    `If you did not request this, you can safely ignore this email.`,
    `Need help? Reply to this email and we’ll assist you.`,
  ].join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.5;">
      <h2 style="margin: 0 0 12px;">Welcome to AstrobyAB</h2>
      <p>Use the OTP below to complete your signup:</p>
      <div style="font-size: 28px; font-weight: 700; letter-spacing: 4px; margin: 12px 0; color: #7f1d1d;">
        ${otp}
      </div>
      <p>This code expires in <strong>10 minutes</strong>.</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
      <p style="margin: 0 0 6px;"><strong>Why AstrobyAB?</strong></p>
      <ul style="margin: 0 0 12px; padding-left: 18px;">
        <li>Personalized Vedic insights tailored to your birth details</li>
        <li>Private and secure handling of your information</li>
        <li>Expert guidance to support key life decisions</li>
      </ul>
      <p style="margin: 0;">If you did not request this, you can safely ignore this email.</p>
      <p style="margin: 8px 0 0;">Need help? Reply to this email and we’ll assist you.</p>
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
