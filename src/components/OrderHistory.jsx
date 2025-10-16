import React, { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { BASE_URL } from "../lib/api";
import {
  FaShoppingBag,
  FaCalendarAlt,
  FaEuroSign,
  FaEye,
} from "react-icons/fa";
import { getImageUrl } from "../lib/api";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await apiFetch("/orders/user/my-orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        } else {
          setError("Failed to load orders");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
        <p className="text-[#171717]">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <FaShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-[#171717] mb-2">
          No Orders Yet
        </h3>
        <p className="text-gray-500">You haven't made any purchases yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>

      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white rounded-lg shadow-md border p-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div className="flex items-center gap-3 mb-2 md:mb-0">
              <FaShoppingBag className="text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">
                  Order #{order._id.slice(-8)}
                </h3>
                <div className="flex items-center gap-2 text-sm text-[#171717]">
                  <FaCalendarAlt className="text-xs" />
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-1 text-lg font-bold text-green-600">
                  <FaEuroSign className="text-sm" />
                  <span>{order.totalPrice.toFixed(2)}</span>
                </div>
                <span
                  className={`text-sm px-2 py-1 rounded-full ${
                    order.status === "پرداخت شده"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-700 mb-3">
              Items ({order.items.length})
            </h4>
            <div className="space-y-2">
              {order.items.slice(0, 3).map((item, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  {item.productId?.images?.[0] && (
                    <img
                      src={getImageUrl(item.productId.images[0])}
                      alt={item.productId.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <span className="font-medium">
                      {item.productId?.name || item.name}
                    </span>
                    <span className="text-gray-500 ml-2">x{item.quantity}</span>
                  </div>
                  <span className="font-medium">
                    €{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              {order.items.length > 3 && (
                <p className="text-sm text-gray-500 italic">
                  +{order.items.length - 3} more items
                </p>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center justify-between text-sm text-[#171717]">
              <span>Payment ID: {order.paymentIntentId?.slice(-12)}</span>
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                View Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
