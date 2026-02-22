import type { CashfreeOrder } from '@/types';

type CashfreeCheckoutOptions = {
  paymentSessionId: string;
  redirectTarget?: '_self' | '_blank' | '_top' | '_modal';
};

type CashfreeCheckoutResult = {
  error?: { message?: string };
};

type CashfreeInstance = {
  checkout: (options: CashfreeCheckoutOptions) => Promise<CashfreeCheckoutResult | undefined>;
};

declare global {
  interface Window {
    Cashfree?: (options: { mode: 'sandbox' | 'production' }) => CashfreeInstance;
  }
}

class PaymentService {
  // Process consultation payment
  async processConsultationPayment(
    userId: string,
    serviceId: string,
    formData: {
      name: string;
      email: string;
      phone: string;
      birthDate: string;
      birthTime: string;
      birthPlace: string;
      gender: string;
      maritalStatus: string;
      education: string;
      profession: string;
      consultationPurpose: string;
    }
  ): Promise<{ consultationId: string; order: CashfreeOrder }> {
    const response = await fetch('/api/cashfree/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        serviceId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        birthDate: formData.birthDate,
        birthTime: formData.birthTime,
        birthPlace: formData.birthPlace,
        gender: formData.gender,
        maritalStatus: formData.maritalStatus,
        education: formData.education,
        profession: formData.profession,
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
    orderId: string
  ): Promise<boolean> {
    const response = await fetch('/api/cashfree/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        consultationId,
        orderId,
      }),
    });

    if (!response.ok) {
      return false;
    }

    const result = await response.json();
    if (!result?.success) {
      return false;
    }

    return true;
  }

  // Load Cashfree script
  loadCashfreeScript(): Promise<CashfreeInstance | null> {
    return new Promise((resolve) => {
      if (window.Cashfree) {
        resolve(window.Cashfree({ mode: this.getCashfreeMode() }));
        return;
      }

      const script = document.createElement('script');
      script.id = 'cashfree-script';
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
      script.onload = () => {
        if (!window.Cashfree) {
          resolve(null);
          return;
        }
        resolve(window.Cashfree({ mode: this.getCashfreeMode() }));
      };
      script.onerror = () => resolve(null);
      document.body.appendChild(script);
    });
  }

  private getCashfreeMode(): 'sandbox' | 'production' {
    const env = (process.env.NEXT_PUBLIC_CASHFREE_ENV || 'production').toLowerCase();
    return env === 'sandbox' ? 'sandbox' : 'production';
  }

  // Open Cashfree checkout
  async openCheckout(
    order: CashfreeOrder,
    onSuccess: () => void,
    onFailure: (error: Error) => void
  ): Promise<void> {
    const cashfree = await this.loadCashfreeScript();
    if (!cashfree) {
      onFailure(new Error('Cashfree SDK failed to load'));
      return;
    }

    try {
      const result = await cashfree.checkout({
        paymentSessionId: order.paymentSessionId,
        redirectTarget: '_modal',
      });
      if (result?.error) {
        onFailure(new Error(result.error.message || 'Payment failed'));
        return;
      }
      onSuccess();
    } catch (error) {
      onFailure(error instanceof Error ? error : new Error('Payment failed'));
    }
  }
}

export const paymentService = new PaymentService();
