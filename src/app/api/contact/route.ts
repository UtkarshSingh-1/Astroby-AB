import { NextResponse } from 'next/server';
import { getMailer } from '@/lib/mailer';
import { applyRateLimit, getClientIp } from '@/lib/rate-limit';

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rate = applyRateLimit(`contact:${ip}`, {
      limit: 5,
      windowMs: 10 * 60 * 1000,
    });
    if (!rate.allowed) {
      return NextResponse.json(
        {
          message: `Too many requests. Please try again in ${rate.retryAfterSeconds} seconds.`,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rate.retryAfterSeconds) },
        }
      );
    }

    const body = (await req.json()) as ContactPayload;
    const name = body.name?.trim() || '';
    const email = body.email?.trim() || '';
    const phone = body.phone?.trim() || '';
    const subjectInput = body.subject?.trim() || '';
    const message = body.message?.trim() || '';

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ message: 'Please enter a valid email.' }, { status: 400 });
    }

    const { mailer, emailFrom } = getMailer();
    if (!mailer || !emailFrom) {
      return NextResponse.json({ message: 'SMTP not configured.' }, { status: 500 });
    }

    const to = process.env.CONTACT_RECEIVER_EMAIL || 'singhabhinav748@gmail.com';
    const subject = subjectInput || `New Contact Form Message from ${name}`;
    const safePhone = phone || 'Not provided';

    const text = [
      'New contact form submission',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${safePhone}`,
      `Subject: ${subjectInput || 'Not provided'}`,
      '',
      'Message:',
      message,
    ].join('\n');

    const html = `
      <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.5;">
        <h2 style="margin: 0 0 12px;">New Contact Form Submission</h2>
        <p style="margin: 0 0 8px;"><strong>Name:</strong> ${name}</p>
        <p style="margin: 0 0 8px;"><strong>Email:</strong> ${email}</p>
        <p style="margin: 0 0 8px;"><strong>Phone:</strong> ${safePhone}</p>
        <p style="margin: 0 0 8px;"><strong>Subject:</strong> ${subjectInput || 'Not provided'}</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
        <p style="margin: 0 0 6px;"><strong>Message:</strong></p>
        <p style="white-space: pre-wrap; margin: 0;">${message}</p>
      </div>
    `;

    await mailer.sendMail({
      from: emailFrom,
      to,
      replyTo: email,
      subject,
      text,
      html,
    });

    return NextResponse.json({ message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ message: 'Failed to send message.' }, { status: 500 });
  }
}
