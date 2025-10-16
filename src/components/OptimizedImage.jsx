import React, { useState, useRef, useEffect } from "react";

const OptimizedImage = ({
  src,
  alt,
  className = "",
  width,
  height,
  priority = false,
  placeholder = "blur",
  quality = 75,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  // Generate optimized src for different screen sizes
  const getOptimizedSrc = (originalSrc) => {
    if (!originalSrc) return "";

    // If it's already a webp, return as is
    if (originalSrc.includes(".webp")) {
      return originalSrc;
    }

    // For other formats, we'll use the original for now
    // In production, you'd want to implement proper image optimization
    return originalSrc;
  };

  const optimizedSrc = getOptimizedSrc(src);

  if (hasError) {
    return (
      <div
        ref={imgRef}
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
        {...props}
      >
        <span className="text-[#171717] text-sm">Image not available</span>
      </div>
    );
  }

  return (
    <div ref={imgRef} className={`relative ${className}`} {...props}>
      {/* Placeholder */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
          style={{ width, height }}
        >
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Actual Image */}
      {isInView && (
        <img
          src={optimizedSrc}
          alt={alt}
          width={width}
          height={height}
          className={`transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
      )}
    </div>
  );
};

export default OptimizedImage;
