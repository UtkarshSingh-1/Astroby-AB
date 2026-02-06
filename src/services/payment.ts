import type { RazorpayOrder, PaymentVerification } from '@/types';

class PaymentService {
  // Process consultation payment
  async processConsultationPayment(
    userId: string,
    serviceId: string,
    formData: {
      name: string;
      email: string;
      birthDate: string;
      birthTime: string;
      birthPlace: string;
      consultationPurpose: string;
    }
  ): Promise<{ consultationId: string; order: RazorpayOrder; keyId?: string }> {
    const response = await fetch('/api/razorpay/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        serviceId,
        name: formData.name,
        email: formData.email,
        birthDate: formData.birthDate,
        birthTime: formData.birthTime,
        birthPlace: formData.birthPlace,
        consultationPurpose: formData.consultationPurpose,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to create order');
    }

    return response.json();
  }

  // Confirm payment success
  async confirmPayment(
    consultationId: string,
    razorpayPaymentId: string,
    razorpayOrderId: string,
    razorpaySignature: string
  ): Promise<boolean> {
    const response = await fetch('/api/razorpay/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        consultationId,
        razorpay_payment_id: razorpayPaymentId,
        razorpay_order_id: razorpayOrderId,
        razorpay_signature: razorpaySignature,
      }),
    });

    if (!response.ok) {
      return false;
    }

    const result = await response.json();
    if (!result?.success) {
      return false;
    }

    const isValid = true;

    if (!isValid) {
      return false;
    }

    const verification: PaymentVerification = {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    };

    return !!verification;
  }

  // Load Razorpay script
  loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (document.getElementById('razorpay-script')) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  // Open Razorpay checkout (mock)
  async openCheckout(
    order: RazorpayOrder,
    userDetails: { name: string; email: string; contact?: string },
    keyId: string | undefined,
    onSuccess: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void,
    onFailure: (error: Error) => void
  ): Promise<void> {
    const loaded = await this.loadRazorpayScript();
    if (!loaded || !(window as any).Razorpay) {
      onFailure(new Error('Razorpay SDK failed to load'));
      return;
    }

    const options = {
      key: keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'AstrobyAB',
      description: 'Consultation Payment',
      order_id: order.id,
      prefill: {
        name: userDetails.name,
        email: userDetails.email,
        contact: userDetails.contact,
      },
      handler: onSuccess,
      modal: {
        ondismiss: () => onFailure(new Error('Payment cancelled')),
      },
      theme: { color: '#7f1d1d' },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  }
}

export const paymentService = new PaymentService();
