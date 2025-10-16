import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../lib/api";
import { BASE_URL } from "../lib/api";
import {
  FaCheckCircle,
  FaShoppingBag,
  FaHome,
  FaEnvelope,
} from "react-icons/fa";
import { getImageUrl } from "../lib/api";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const paymentIntentId = searchParams.get("payment_intent");
  const paymentIntentClientSecret = searchParams.get(
    "payment_intent_client_secret"
  );

  useEffect(() => {
    // اگر کاربر لاگین نیست، به صفحه لاگین هدایت کن
    if (!user) {
      navigate("/login");
      return;
    }

    // دریافت آخرین سفارش کاربر
    const fetchLatestOrder = async () => {
      try {
        const res = await apiFetch("/orders/user/my-orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.ok) {
          const orders = await res.json();
          if (orders.length > 0) {
            setOrderDetails(orders[0]); // آخرین سفارش
          }
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestOrder();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-[#171717]">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <FaCheckCircle className="text-green-600 text-4xl" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment Successful! 🎉
          </h1>
          <p className="text-xl text-[#171717] mb-2">
            Thank you for your purchase, {user?.name || "Valued Customer"}!
          </p>
          <p className="text-gray-500">
            Your order has been confirmed and will be processed shortly.
          </p>
        </div>

        {/* Order Details */}
        {orderDetails && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FaShoppingBag className="mr-3 text-blue-600" />
              Order Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Order Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Order ID:</span>{" "}
                    {orderDetails._id}
                  </p>
                  <p>
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(orderDetails.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    <span className="text-green-600 font-semibold">
                      {orderDetails.status}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Total:</span>{" "}
                    <span className="text-lg font-bold text-green-600">
                      €{orderDetails.totalPrice.toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Payment Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Payment Method:</span> Stripe
                  </p>
                  <p>
                    <span className="font-medium">Payment ID:</span>{" "}
                    {orderDetails.paymentIntentId}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    <span className="text-green-600 font-semibold">
                      Completed
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-700 mb-4">
                Items Ordered
              </h3>
              <div className="space-y-4">
                {orderDetails.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    {item.productId?.images?.[0] && (
                      <img
                        src={getImageUrl(item.productId.images[0])}
                        alt={item.productId.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {item.productId?.name || item.name}
                      </h4>
                      <p className="text-[#171717]">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      €{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <FaEnvelope className="mr-3 text-blue-600" />
            What's Next?
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Order Confirmation
                </h3>
                <p className="text-[#171717]">
                  You will receive an email confirmation shortly with your order
                  details.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Processing</h3>
                <p className="text-[#171717]">
                  Your order is being prepared and will be shipped within 1-2
                  business days.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-sm">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Shipping</h3>
                <p className="text-[#171717]">
                  You will receive tracking information once your order ships.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/products")}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <FaHome className="text-lg" />
            Continue Shopping
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center justify-center gap-2 bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            <FaShoppingBag className="text-lg" />
            View My Orders
          </button>
        </div>
      </div>
    </div>
  );
}
