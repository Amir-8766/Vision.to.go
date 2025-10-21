import React from "react";
import { motion } from "framer-motion";
import { Plane } from "lucide-react";

const FlightCard = ({
  imageUrl,
  airline,
  flightCode,
  flightClass,
  departureCode,
  departureCity,
  departureTime,
  arrivalCode,
  arrivalCity,
  arrivalTime,
  duration,
  price,
  className = "",
}) => {
  return (
    <motion.div
      className={`max-w-sm w-full font-sans rounded-2xl overflow-hidden shadow-lg bg-white border border-gray-200 hover:shadow-xl transition-shadow duration-300 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      {/* Flight Image */}
      <div className="relative h-40">
        <img
          src={imageUrl}
          alt="View from airplane window"
          className="w-full h-full object-cover"
        />
        {price && (
          <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-lg text-sm font-bold">
            {price}
          </div>
        )}
      </div>

      {/* Flight Details Container */}
      <div className="p-6 pt-4">
        {/* Main Flight Route */}
        <div className="flex items-center justify-between">
          <div className="text-left">
            <p className="text-sm text-gray-500">{departureTime}</p>
            <p className="text-4xl font-bold text-gray-900">{departureCode}</p>
            <p className="text-xs text-gray-500">{departureCity}</p>
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">{flightCode}</p>
            <div className="flex items-center gap-2 my-1">
              <div className="h-px w-8 bg-gray-300" />
              <Plane className="h-4 w-4 text-gray-500" />
              <div className="h-px w-8 bg-gray-300" />
            </div>
            <p className="text-xs text-gray-500">{duration}</p>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500">{arrivalTime}</p>
            <p className="text-4xl font-bold text-gray-900">{arrivalCode}</p>
            <p className="text-xs text-gray-500">{arrivalCity}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-300 my-5" />

        {/* Additional Details */}
        <div className="flex justify-between text-center">
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500">Airline</span>
            <span className="font-semibold text-gray-900">{airline}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500">Flight Code</span>
            <span className="font-semibold text-gray-900">{flightCode}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500">Class</span>
            <span className="font-semibold text-gray-900">{flightClass}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FlightCard;
