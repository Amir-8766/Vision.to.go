import React, { useState } from "react";
import "../styles/checkout.css";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { apiFetch } from "../lib/api";

export default function CheckoutForm({ items, total, userId, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setMessage(null);
    setError(false);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/payment-success",
        },
        redirect: "if_required",
      });

      if (error) {
        setError(true);
        setMessage(error.message);
        setIsProcessing(false);
        return;
      }

      // اگر پرداخت موفق بود
      if (paymentIntent && paymentIntent.status === "succeeded") {
        try {
          // ایجاد سفارش در دیتابیس
          const orderData = {
            userId: userId,
            items: items.map(item => ({
              productId: item._id,
              quantity: item.quantity || 1,
              price: item.price,
              name: item.name
            })),
            totalPrice: total,
            status: "پرداخت شده",
            paymentIntentId: paymentIntent.id,
            shippingAddress: "Default Address", // TODO: Add address form
          };

          const orderRes = await apiFetch("/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(orderData),
          });

          if (!orderRes.ok) {
            throw new Error("Failed to create order");
          }

          // کاهش موجودی محصولات
          for (const item of items) {
            try {
              await apiFetch(`/inventory/${item._id}/decrease`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ 
                  quantity: item.quantity || 1 
                }),
              });
            } catch (inventoryError) {
              console.warn(`Failed to update inventory for product ${item._id}:`, inventoryError);
              // ادامه می‌دهیم حتی اگر موجودی به‌روزرسانی نشود
            }
          }

          setError(false);
          setMessage("Payment successful! Redirecting...");
          
          // فراخوانی callback موفقیت
          setTimeout(() => {
            onSuccess();
          }, 1500);

        } catch (orderError) {
          console.error("Order creation error:", orderError);
          setError(true);
          setMessage("Payment successful but order creation failed. Please contact support.");
        }
      }
    } catch (err) {
      setError(true);
      setMessage(err.message);
    }

    setIsProcessing(false);
  };

  return (
    <div className="checkout-container">
      <h2>Complete Your Purchase</h2>
      <form onSubmit={handleSubmit} className="checkout-form">
        <PaymentElement className="StripeElement" />
        <button
          disabled={isProcessing || !stripe || !elements}
          className="btn-primary"
        >
          {isProcessing ? "Processing..." : `Pay €${total.toFixed(2)}`}
        </button>
        {message && (
          <p className={`message ${error ? "error" : "success"}`}>{message}</p>
        )}
      </form>
    </div>
  );
}
