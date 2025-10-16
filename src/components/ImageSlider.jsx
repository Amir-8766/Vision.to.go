import React, { useState, useEffect, useRef } from "react";
import { useDarkMode } from "../hooks/useDarkMode";
import { apiFetch, BASE_URL } from "../lib/api";

const ImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef(null);
  const isDarkMode = useDarkMode();

  const [sliderImages, setSliderImages] = useState([]);

  // Fetch slider images from backend; fallback to local slide01..slide14
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await apiFetch("/slider");
        if (res.ok) {
          const data = await res.json();
          if (mounted)
            setSliderImages(data.map((i) => `${BASE_URL}${i.imageUrl}`));
        } else {
          throw new Error("bad status");
        }
      } catch (_) {
        if (mounted) {
          const local = Array.from(
            { length: 14 },
            (_, i) => `/src/assets/slide${String(i + 1).padStart(2, "0")}.jpg`
          );
          setSliderImages(local);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
      }, 4000); // Change slide every 4 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, sliderImages.length]);

  // Pause auto-play on hover (desktop only)
  const handleMouseEnter = () => {
    // Only pause on desktop, not on mobile
    if (window.innerWidth >= 768) {
      setIsAutoPlaying(false);
    }
  };

  const handleMouseLeave = () => {
    // Only resume on desktop, not on mobile
    if (window.innerWidth >= 768) {
      setIsAutoPlaying(true);
    }
  };

  // Handle click to toggle auto-play (mobile friendly)
  const handleSliderClick = () => {
    setIsAutoPlaying((prev) => !prev);
  };

  return (
    <section
      className={`relative w-full max-w-6xl mx-auto my-12 px-4 ${
        isDarkMode ? "dark" : ""
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleSliderClick}
    >
      <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-gray-800">
        {/* Main slider container */}
        <div className="relative h-64 md:h-80 lg:h-96">
          {/* Slides */}
          <div
            className="flex transition-transform duration-700 ease-in-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {sliderImages.map((image, index) => {
              const isVisible =
                index === currentSlide ||
                index === (currentSlide + 1) % sliderImages.length;
              return (
                <div
                  key={index}
                  className="w-full h-full flex-shrink-0 relative"
                >
                  {isVisible ? (
                    <picture>
                      <img
                        src={image.startsWith("http") ? image : `/${image}`}
                        alt={`Fashion showcase ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading={index === currentSlide ? "eager" : "lazy"}
                        decoding="async"
                        fetchPriority={index === 0 ? "high" : undefined}
                        width={1920}
                        height={768}
                        sizes="(max-width: 768px) 100vw, 100vw"
                      />
                    </picture>
                  ) : (
                    <div
                      className="w-full h-full bg-gray-100"
                      aria-hidden="true"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>
              );
            })}
          </div>

          {/* Slide counter */}
          <div
            className="absolute top-4 right-4 bg-gray-800/90 dark:bg-gray-200/90 px-3 py-1 rounded-full text-sm font-medium"
            style={{ color: "#171717" }}
          >
            {currentSlide + 1} / {sliderImages.length}
          </div>

          {/* Auto-play indicator */}
          <div className="absolute top-4 left-4">
            <div className="bg-gray-600/80 px-3 py-1 rounded-full flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isAutoPlaying ? "bg-green-400" : "bg-gray-400"
                }`}
              ></div>
              <span className="text-sm font-medium text-white">
                {isAutoPlaying ? "Auto" : "Paused"}
              </span>
            </div>
          </div>
        </div>

        {/* Slider info */}
        <div className="p-6 slider-info-bg" style={{ color: "white" }}>
          <h3
            className="text-xl font-bold text-white mb-2"
            style={{ color: "white" }}
          >
            Discover Our Fashion Collection
          </h3>
          <p className="text-white" style={{ color: "white" }}>
            Explore our curated selection of stylish second-hand clothing and
            accessories. Each piece tells a story and contributes to sustainable
            fashion.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ImageSlider;
