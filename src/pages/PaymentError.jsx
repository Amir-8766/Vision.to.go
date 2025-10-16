import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaExclamationTriangle, FaHome, FaShoppingCart } from "react-icons/fa";

export default function PaymentError() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const errorMessage = searchParams.get("error") || "Payment was not completed";
  const errorCode = searchParams.get("error_code") || "unknown";

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Error Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <FaExclamationTriangle className="text-red-600 text-4xl" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment Failed ❌
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            We're sorry, but your payment could not be processed.
          </p>
          <p className="text-gray-500">
            Don't worry, no charges have been made to your account.
          </p>
        </div>

        {/* Error Details */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Error Details</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Error Message</h3>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                {errorMessage}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Error Code</h3>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-lg font-mono">
                {errorCode}
              </p>
            </div>
          </div>

          {/* Common Solutions */}
          <div className="mt-8">
            <h3 className="font-semibold text-gray-700 mb-4">What you can do:</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Check your card details and try again</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Ensure you have sufficient funds</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Try a different payment method</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Contact your bank if the problem persists</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <FaShoppingCart className="text-lg" />
            Back to Cart
          </button>
          <button
            onClick={() => navigate("/products")}
            className="flex items-center justify-center gap-2 bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            <FaHome className="text-lg" />
            Continue Shopping
          </button>
        </div>

        {/* Support Information */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 mb-2">
            Need help? Contact our support team
          </p>
          <a 
            href="mailto:support@thegrrrlsclub.de" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            support@thegrrrlsclub.de
          </a>
        </div>
      </div>
    </div>
  );
}
