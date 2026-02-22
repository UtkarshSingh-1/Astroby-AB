import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID || '';
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY || '';
const CASHFREE_API_VERSION = process.env.CASHFREE_API_VERSION || '2025-01-01';
const CASHFREE_ENV = (process.env.CASHFREE_ENV || process.env.NEXT_PUBLIC_CASHFREE_ENV || 'production').toLowerCase();
const CASHFREE_BASE_URL =
  CASHFREE_ENV === 'sandbox' ? 'https://sandbox.cashfree.com/pg' : 'https://api.cashfree.com/pg';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      serviceId,
      name,
      email,
      phone,
      birthDate,
      birthTime,
      birthPlace,
      consultationPurpose,
    } = body || {};

    if (!userId || !serviceId || !name || !email || !phone) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
      return NextResponse.json({ message: 'Cashfree keys not configured' }, { status: 500 });
    }

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) {
      return NextResponse.json({ message: 'Service not found' }, { status: 404 });
    }

    const existingUser = userId
      ? await prisma.user.findUnique({ where: { id: userId } })
      : null;

    const userRecord = existingUser ?? (await prisma.user.findUnique({ where: { email } }));

    const ensuredUser =
      userRecord ??
      (await prisma.user.create({
        data: {
          email,
          name,
          role: 'USER',
          emailVerified: null,
        },
      }));

    const consultation = await prisma.consultation.create({
      data: {
        userId: ensuredUser.id,
        email,
        name,
        serviceName: service.name,
        price: service.price,
        paymentStatus: 'pending',
        consultationStatus: 'PENDING',
        birthPlace,
        birthDate: birthDate ? new Date(birthDate) : undefined,
        birthTime,
        consultationPurpose,
      },
    });

    const returnUrl = process.env.NEXTAUTH_URL
      ? `${process.env.NEXTAUTH_URL}/dashboard/consultations?order_id=${consultation.id}`
      : undefined;

    const orderPayload = {
      order_id: consultation.id,
      order_amount: Number(service.price.toFixed(2)),
      order_currency: 'INR',
      customer_details: {
        customer_id: ensuredUser.id,
        customer_name: name,
        customer_email: email,
        customer_phone: String(phone),
      },
      order_note: `${service.name} consultation`,
      ...(returnUrl
        ? {
            order_meta: {
              return_url: returnUrl,
            },
          }
        : {}),
    };

    const cashfreeResponse = await fetch(`${CASHFREE_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': CASHFREE_API_VERSION,
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
      },
      body: JSON.stringify(orderPayload),
    });

    const cashfreeData = await cashfreeResponse.json();

    if (!cashfreeResponse.ok) {
      return NextResponse.json(
        { message: cashfreeData?.message || 'Cashfree order creation failed' },
        { status: cashfreeResponse.status }
      );
    }

    await prisma.consultation.update({
      where: { id: consultation.id },
      data: { paymentOrderId: cashfreeData.order_id ?? consultation.id },
    });

    return NextResponse.json({
      order: {
        orderId: cashfreeData.order_id ?? consultation.id,
        paymentSessionId: cashfreeData.payment_session_id,
      },
      consultationId: consultation.id,
    });
  } catch (error) {
    console.error('Cashfree order error:', error);
    return NextResponse.json({ message: 'Failed to create order' }, { status: 500 });
  }
}
