import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const StatCard = ({ title, value, icon, trend, color, bgColor }) => (
  <div
    className={`${bgColor} p-6 rounded-xl shadow-lg border-l-4 ${color} transition-all duration-300 hover:shadow-xl hover:scale-105`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-[#171717] mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {trend && (
          <div
            className={`flex items-center mt-2 text-sm ${
              trend > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend > 0 ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
            <span className="ml-1">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div
        className={`p-4 rounded-full ${color
          .replace("border-", "bg-")
          .replace("-500", "-100")}`}
      >
        {icon}
      </div>
    </div>
  </div>
);

export default StatCard;
