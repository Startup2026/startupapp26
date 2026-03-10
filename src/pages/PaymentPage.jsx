import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const navigate = useNavigate();

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    const res = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: "PREMIUM" }),
      credentials: "include",
    });
    const data = await res.json();
    if (!data.success) return alert("Order creation failed");

    await loadRazorpayScript();

    const options = {
      key: "YOUR_RAZORPAY_KEY_ID", // replace with your Razorpay key
      amount: data.order.amount,
      currency: data.order.currency,
      order_id: data.order.id,
      name: "Your App Name",
      description: "Plan Purchase",
      handler: async function (response) {
        try {
          // Send payment details to backend for verification
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan: "PREMIUM",
            }),
            credentials: "include",
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            navigate("/dashboard");
          } else {
            alert("Payment verification failed: " + (verifyData.message || ""));
          }
        } catch (err) {
          alert("Payment verification error");
        }
      },
      prefill: {
        email: "user@example.com", // replace with user email
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div>
      <h2>Buy Premium Plan</h2>
      <button onClick={handlePayment}>Pay with Razorpay</button>
    </div>
  );
};

export default PaymentPage;
