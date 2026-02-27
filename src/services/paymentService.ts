import { apiFetch } from '@/lib/api';

export const paymentService = {
  createOrder: async (planType: string) => {
    try {
      // apiFetch returns the parsed JSON automatically
      const result = await apiFetch(`/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType }),
      });
      return result;
    } catch (error) {
      console.error("Error creating payment order:", error);
      throw error;
    }
  },

  verifyPayment: async (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    try {
      const result = await apiFetch(`/payment/verify-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return result;
    } catch (error) {
      console.error("Error verifying payment:", error);
      throw error;
    }
  }
};
