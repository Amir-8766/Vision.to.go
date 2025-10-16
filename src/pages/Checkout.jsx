import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../lib/stripe";
import CheckoutForm from "../components/CheckoutForm";
import { apiFetch, getImageUrl } from "../lib/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SHIPPING_COST = 4.99;

export default function Checkout() {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // محاسبه مبلغ کل
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  const shippingCost = subtotal > 0 ? SHIPPING_COST : 0;
  const total = subtotal + shippingCost;

  useEffect(() => {
    // اگر سبد خرید خالی است، به صفحه محصولات هدایت کن
    if (items.length === 0) {
      navigate("/products");
      return;
    }

    // اگر کاربر لاگین نیست، به صفحه لاگین هدایت کن
    if (!user) {
      navigate("/login");
      return;
    }

    // ایجاد Payment Intent با مبلغ واقعی
    const createPaymentIntent = async () => {
      try {
        setLoading(true);
        const amountInCents = Math.round(total * 100); // تبدیل به سنت

        const res = await apiFetch("/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: amountInCents,
            items: items,
            userId: user.id,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to create payment intent");
        }

        const data = await res.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [items, total, user, navigate]);

  const appearance = { theme: "stripe" };
  const options = {
    clientSecret,
    appearance,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-[#171717]">Preparing checkout...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#171717]">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-[#171717]">
              Order Summary
            </h2>

            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 p-3 bg-white rounded"
                >
                  <img
                    src={getImageUrl(item.images?.[0] || item.image)}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-[#171717]">{item.name}</h3>
                    <p className="text-[#171717]">
                      Quantity: {item.quantity || 1}
                    </p>
                  </div>
                  <p className="font-semibold text-[#171717]">
                    €{(item.price * (item.quantity || 1)).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-[#171717]">Subtotal:</span>
                <span className="text-[#171717]">€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#171717]">Shipping:</span>
                <span className="text-[#171717]">
                  €{shippingCost.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span className="text-[#171717]">Total:</span>
                <span className="text-[#171717]">€{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4 text-[#171717]">
              Payment Information
            </h2>
            {clientSecret && (
              <Elements stripe={stripePromise} options={options}>
                <CheckoutForm
                  items={items}
                  total={total}
                  userId={user.id}
                  onSuccess={() => {
                    clearCart();
                    navigate("/payment-success");
                  }}
                />
              </Elements>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
