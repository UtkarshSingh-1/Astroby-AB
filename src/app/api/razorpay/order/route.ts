import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { prisma } from '@/lib/prisma';

const razorpayKeyId = process.env.RAZORPAY_KEY_ID || '';
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || '';

const razorpay = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      serviceId,
      name,
      email,
      birthDate,
      birthTime,
      birthPlace,
      consultationPurpose,
    } = body || {};

    if (!userId || !serviceId || !name || !email) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    if (!razorpayKeyId || !razorpayKeySecret) {
      return NextResponse.json({ message: 'Razorpay keys not configured' }, { status: 500 });
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
        birthPlace,
        birthDate: birthDate ? new Date(birthDate) : undefined,
        birthTime,
        consultationPurpose,
      },
    });

    const order = await razorpay.orders.create({
      amount: Math.round(service.price * 100),
      currency: 'INR',
      receipt: consultation.id,
      notes: {
        serviceId: service.id,
        serviceName: service.name,
        userId,
      },
    });

    await prisma.consultation.update({
      where: { id: consultation.id },
      data: { razorpayOrderId: order.id },
    });

    return NextResponse.json({
      order,
      consultationId: consultation.id,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Razorpay order error:', error);
    return NextResponse.json({ message: 'Failed to create order' }, { status: 500 });
  }
}
