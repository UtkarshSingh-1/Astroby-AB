import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || '';

const verifySignature = (body: string, signature: string) => {
  if (!WEBHOOK_SECRET) {
    return false;
  }
  const expected = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(body)
    .digest('hex');
  return expected === signature;
};

export async function POST(req: Request) {
  const signature = req.headers.get('x-razorpay-signature') || '';
  const body = await req.text();

  if (!verifySignature(body, signature)) {
    return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
  }

  const payload = JSON.parse(body);
  const event = payload?.event as string | undefined;
  const payment = payload?.payload?.payment?.entity;

  if (!payment?.order_id) {
    return NextResponse.json({ received: true });
  }

  if (event === 'payment.captured' || event === 'payment.authorized') {
    await prisma.consultation.updateMany({
      where: { razorpayOrderId: payment.order_id },
      data: {
        paymentStatus: 'completed',
        paymentId: payment.id,
      },
    });
  }

  if (event === 'payment.failed') {
    await prisma.consultation.updateMany({
      where: { razorpayOrderId: payment.order_id },
      data: {
        paymentStatus: 'failed',
        paymentId: payment.id,
      },
    });
  }

  return NextResponse.json({ received: true });
}
