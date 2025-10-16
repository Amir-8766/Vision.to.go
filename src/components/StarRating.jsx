import React from "react";

export default function StarRating({ value, onChange, disabled }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange(star)}
          className={star <= value ? "text-yellow-400" : "text-gray-300"}
        >
          ★
        </button>
      ))}
    </div>
  );
}
