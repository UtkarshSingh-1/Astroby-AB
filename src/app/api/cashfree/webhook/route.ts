import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY || '';

const verifySignature = (timestamp: string, rawBody: string, signature: string) => {
  if (!timestamp || !rawBody || !signature || !CASHFREE_SECRET_KEY) {
    return false;
  }

  const expected = crypto
    .createHmac('sha256', CASHFREE_SECRET_KEY)
    .update(`${timestamp}${rawBody}`)
    .digest('base64');

  if (expected.length !== signature.length) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
};

export async function POST(req: Request) {
  const signature = req.headers.get('x-webhook-signature') || '';
  const timestamp = req.headers.get('x-webhook-timestamp') || '';
  const rawBody = await req.text();

  if (!verifySignature(timestamp, rawBody, signature)) {
    return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
  }

  let payload: {
    type?: string;
    data?: {
      order?: { order_id?: string };
      payment?: { cf_payment_id?: string; payment_status?: string };
    };
  } | null = null;

  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
  }

  const eventType = payload?.type;
  const orderId = payload?.data?.order?.order_id;
  const paymentId = payload?.data?.payment?.cf_payment_id;

  if (!orderId) {
    return NextResponse.json({ received: true });
  }

  if (eventType === 'PAYMENT_SUCCESS_WEBHOOK') {
    await prisma.consultation.updateMany({
      where: { paymentOrderId: orderId },
      data: {
        paymentStatus: 'completed',
        paymentId: paymentId ?? undefined,
      },
    });
  }

  if (eventType === 'PAYMENT_FAILED_WEBHOOK' || eventType === 'PAYMENT_USER_DROPPED_WEBHOOK') {
    await prisma.consultation.updateMany({
      where: { paymentOrderId: orderId },
      data: {
        paymentStatus: 'failed',
        paymentId: paymentId ?? undefined,
      },
    });
  }

  return NextResponse.json({ received: true });
}
