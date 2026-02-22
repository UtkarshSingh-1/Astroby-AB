import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID || '';
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY || '';
const CASHFREE_API_VERSION = process.env.CASHFREE_API_VERSION || '2025-01-01';
const CASHFREE_ENV = (process.env.CASHFREE_ENV || process.env.NEXT_PUBLIC_CASHFREE_ENV || 'production').toLowerCase();
const CASHFREE_BASE_URL =
  CASHFREE_ENV === 'sandbox' ? 'https://sandbox.cashfree.com/pg' : 'https://api.cashfree.com/pg';

const FAILED_STATUSES = new Set(['FAILED', 'CANCELLED', 'EXPIRED', 'TERMINATED']);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { consultationId, orderId } = body || {};

    if (!consultationId || !orderId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
      return NextResponse.json({ message: 'Cashfree keys not configured' }, { status: 500 });
    }

    const cashfreeResponse = await fetch(`${CASHFREE_BASE_URL}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': CASHFREE_API_VERSION,
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
      },
    });

    const cashfreeData = await cashfreeResponse.json();

    if (!cashfreeResponse.ok) {
      return NextResponse.json(
        { message: cashfreeData?.message || 'Failed to verify payment' },
        { status: cashfreeResponse.status }
      );
    }

    const orderStatus = String(cashfreeData?.order_status || '').toUpperCase();
    const isPaid = orderStatus === 'PAID';
    const isFailed = FAILED_STATUSES.has(orderStatus);

    if (isPaid || isFailed) {
      await prisma.consultation.update({
        where: { id: consultationId },
        data: {
          paymentStatus: isPaid ? 'completed' : 'failed',
          paymentId: isPaid ? cashfreeData?.cf_order_id ?? undefined : undefined,
          paymentOrderId: cashfreeData?.order_id ?? orderId,
        },
      });
    }

    return NextResponse.json({ success: isPaid, status: orderStatus });
  } catch (error) {
    console.error('Cashfree verify error:', error);
    return NextResponse.json({ message: 'Failed to verify payment' }, { status: 500 });
  }
}
