import React from "react";
import { Link } from "react-router-dom";
import { FaLock, FaHome } from "react-icons/fa";

const AccessDenied = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <FaLock className="mx-auto text-6xl text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-[#171717]">
            You don't have permission to access this page. Only administrators
            can view this content.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaHome size={16} />
            <span>Go to Home</span>
          </Link>

          <p className="text-sm text-gray-500">
            If you believe this is an error, please contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
