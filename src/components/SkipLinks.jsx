import React from 'react';

const SkipLinks = () => {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <a
        href="#main-content"
        className="absolute top-4 left-4 z-50 bg-pink-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <a
        href="#navigation"
        className="absolute top-4 left-32 z-50 bg-pink-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
      >
        Skip to navigation
      </a>
    </div>
  );
};

export default SkipLinks;
