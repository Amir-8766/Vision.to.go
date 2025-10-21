import * as React from "react";
import { motion } from "framer-motion";
import { Plane } from "lucide-react";
import { cn } from "../../lib/utils";

// Define the props for the FlightCard component
export const FlightCard = React.forwardRef(
  (
    {
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
      className,
      price,
      ...props
    },
    ref
  ) => {
    // Animation variants for the container and its children
    const cardVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          when: "beforeChildren",
          staggerChildren: 0.1,
        },
      },
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0 },
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "max-w-sm w-full font-sans rounded-2xl overflow-hidden shadow-lg bg-white border border-gray-200 hover:shadow-xl transition-shadow duration-300",
          className
        )}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
        {...props}
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
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between"
          >
            <div className="text-left">
              <p className="text-sm text-gray-500">{departureTime}</p>
              <p className="text-4xl font-bold text-gray-900">
                {departureCode}
              </p>
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
          </motion.div>

          {/* Divider */}
          <motion.div
            variants={itemVariants}
            className="border-t border-dashed border-gray-300 my-5"
          />

          {/* Additional Details */}
          <motion.div
            variants={itemVariants}
            className="flex justify-between text-center"
          >
            <InfoItem label="Airline" value={airline} />
            <InfoItem label="Flight Code" value={flightCode} />
            <InfoItem label="Class" value={flightClass} />
          </motion.div>
        </div>
      </motion.div>
    );
  }
);

FlightCard.displayName = "FlightCard";

// Helper component for bottom info items
const InfoItem = ({ label, value }) => (
  <div className="flex flex-col items-center">
    <span className="text-xs text-gray-500">{label}</span>
    <span className="font-semibold text-gray-900">{value}</span>
  </div>
);
