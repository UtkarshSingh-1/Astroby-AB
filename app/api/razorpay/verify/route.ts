import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      consultationId,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = body || {};

    if (!consultationId || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || '';
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      await prisma.consultation.update({
        where: { id: consultationId },
        data: { paymentStatus: 'failed' },
      });
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }

    const consultation = await prisma.consultation.update({
      where: { id: consultationId },
      data: {
        paymentId: razorpay_payment_id,
        paymentStatus: 'completed',
        razorpayOrderId: razorpay_order_id,
      },
    });

    return NextResponse.json({ success: true, consultation });
  } catch (error) {
    console.error('Razorpay verify error:', error);
    return NextResponse.json({ message: 'Failed to verify payment' }, { status: 500 });
  }
}
