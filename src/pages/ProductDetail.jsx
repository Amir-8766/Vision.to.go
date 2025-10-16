import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { BASE_URL } from "../lib/api";
import StarRating from "../components/StarRating";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FiZoomIn, FiZoomOut } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { getImageUrl } from "../lib/api";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [avgRating, setAvgRating] = useState(null);
  const [hasBought, setHasBought] = useState(false);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [showFullDesc, setShowFullDesc] = useState(false);
  const mainSliderRef = useRef(null);
  const zoomImageRef = useRef(null);

  // تابع تشخیص دستگاه موبایل
  const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

  // تنظیمات اسلایدر اصلی
  const mainSliderSettings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    cssEase: "linear",
    beforeChange: (current, next) => setCurrentSlide(next),
  };

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setFeedback("");
      try {
        const token = localStorage.getItem("token");
        const res = await apiFetch(`/products/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load product");
        setProduct(data);
        setAvgRating(Number(data.avgRating) || null);
        setUserRating(data.userRating || 0);
        setHasBought(data.hasBought || false);
      } catch (err) {
        setFeedback(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleRate = async (rating) => {
    setFeedback("");
    try {
      const token = localStorage.getItem("token");
      const res = await apiFetch(`/products/${id}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit rating");
      setUserRating(rating);
      setFeedback("Thank you for your rating!");
    } catch (err) {
      setFeedback(err.message);
    }
  };

  const handleThumbnailClick = (index) => {
    setCurrentSlide(index);
    if (mainSliderRef.current) {
      mainSliderRef.current.slickGoTo(index);
    }
  };

  const handleImageClick = (image) => {
    if (isMobile()) return; // غیرفعال برای موبایل
    setModalImage(getImageUrl(image));
    setShowZoomModal(true);
  };

  const handleZoom = (e) => {
    if (!zoomImageRef.current) return;
    const rect = zoomImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!product)
    return <div className="text-center py-20">Product not found.</div>;

  const images =
    product.images && product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : [];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center md:items-start gap-10 py-12">
        {/* مشخصات سمت چپ */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start order-2 md:order-1">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center md:text-left">
            {product.name}
          </h1>
          {product.description && (
            <div className="mb-6 w-full max-w-lg mx-auto md:mx-0">
              <p className="text-[#171717] leading-relaxed">
                {showFullDesc
                  ? product.description
                  : product.description.length > 150
                  ? product.description.substring(0, 150) + "..."
                  : product.description}
              </p>
              {product.description.length > 150 && (
                <button
                  className="text-blue-600 hover:text-blue-800 font-medium mt-2"
                  onClick={() => setShowFullDesc(!showFullDesc)}
                >
                  {showFullDesc ? "less" : "more"}
                </button>
              )}
            </div>
          )}
          <div className="text-2xl font-semibold text-gray-900 mb-8 text-center md:text-left">
            €{product.price}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full max-w-lg mx-auto md:mx-0">
            <button
              onClick={() => addToCart({ ...product, quantity: 1 })}
              className="flex-1 bg-[#DC2525] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#b71c1c] hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Add to Cart
            </button>
            <button
              onClick={() => toggleWishlist(product._id)}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                wishlist.includes(product._id)
                  ? "bg-pink-500 text-gray-800 hover:bg-pink-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {wishlist.includes(product._id)
                ? "Remove from Wishlist"
                : "Add to Wishlist"}
            </button>
          </div>

          {/* جزئیات محصول */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8 w-full max-w-lg mx-auto md:mx-0">
            <div className="mb-2">
              <span className="font-bold text-[#171717]">Zustand:</span>{" "}
              <span className="text-[#171717]">{product.zustand || "-"}</span>
            </div>
            <div className="mb-2">
              <span className="font-bold text-[#171717]">Size (cm):</span>{" "}
              <span className="text-[#171717]">
                {product.width || "-"} x {product.depth || "-"} x{" "}
                {product.height || "-"}
              </span>
            </div>
            <div className="mb-2">
              <span className="font-bold text-[#171717]">Brand:</span>{" "}
              <span className="text-[#171717]">{product.brand || "-"}</span>
            </div>
            <div className="mb-2">
              <span className="font-bold text-[#171717]">Model:</span>{" "}
              <span className="text-[#171717]">{product.model || "-"}</span>
            </div>
            <div className="mb-2">
              <span className="font-bold text-[#171717]">Color:</span>{" "}
              <span className="text-[#171717]">{product.color || "-"}</span>
            </div>
            <div className="mb-2">
              <span className="font-bold text-[#171717]">Material:</span>{" "}
              <span className="text-[#171717]">{product.material || "-"}</span>
            </div>
            <div className="mb-2">
              <span className="font-bold text-[#171717]">Pattern:</span>{" "}
              <span className="text-[#171717]">{product.pattern || "-"}</span>
            </div>
          </div>
        </div>

        {/* بخش تصاویر سمت راست */}
        <div className="w-full md:w-1/2 flex flex-row-reverse gap-6 order-1 md:order-2">
          {/* اسلایدر اصلی */}
          <div className="w-4/5 relative">
            {images.length > 0 ? (
              <Slider
                {...mainSliderSettings}
                initialSlide={currentSlide}
                ref={mainSliderRef}
              >
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={getImageUrl(image)}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-auto max-h-[500px] object-contain rounded-lg shadow"
                      style={{ background: "#f8f8f8" }}
                      onClick={() => handleImageClick(image)}
                    />
                    {!isMobile() && (
                      <div
                        className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-zoom-in"
                        onClick={() => handleImageClick(image)}
                      >
                        <div className="bg-black bg-opacity-50 rounded-full p-3">
                          <FiZoomIn className="text-white text-2xl" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="w-full h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-[#171717]">No images available</p>
              </div>
            )}
          </div>

          {/* گالری تصاویر عمودی */}
          <div className="w-1/5 flex flex-col gap-4 overflow-y-auto max-h-[500px] pr-2">
            {images.map((image, index) => (
              <div
                key={index}
                className={`cursor-pointer transition-all duration-200 ${
                  index === currentSlide
                    ? "border-2 border-gray-900"
                    : "border border-gray-300"
                } rounded-lg overflow-hidden`}
                onClick={() => handleThumbnailClick(index)}
              >
                <img
                  src={getImageUrl(image)}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover aspect-square"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* بخش رتبه‌بندی */}
      <div className="flex flex-col items-center mt-2 mb-8">
        <div className="mb-2 flex flex-col items-center">
          <span className="font-semibold mb-1">Average rating:</span>
          <StarRating
            value={avgRating || 0}
            disabled
            onChange={() => {}}
            size={20}
          />
          <span className="text-xs text-[#171717] mt-1">
            {avgRating ? `${avgRating} / 5` : "No ratings yet"}
          </span>
        </div>
        <div className="mb-2 flex flex-col items-center">
          <span className="font-semibold mb-1">Your rating:</span>
          <StarRating
            value={userRating}
            onChange={hasBought ? handleRate : () => {}}
            disabled={!hasBought}
            size={20}
          />
          {!hasBought && (
            <span className="ml-2 text-xs text-[#171717]">
              (You can only rate products you have purchased)
            </span>
          )}
        </div>
        {feedback && (
          <div
            className={`text-sm mt-2 px-3 py-2 rounded ${
              feedback.includes("Thank you")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {feedback}
          </div>
        )}
      </div>

      {/* مودال زوم */}
      {showZoomModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setShowZoomModal(false)}
        >
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              className="absolute top-4 right-4 text-white text-2xl z-10"
              onClick={() => setShowZoomModal(false)}
            >
              ×
            </button>
            <img
              ref={zoomImageRef}
              src={modalImage}
              alt="Zoomed product"
              className="max-w-full max-h-full object-contain"
              onMouseMove={handleZoom}
              style={{
                transform: isZoomed
                  ? `scale(2) translate(-${zoomPosition.x}%, -${zoomPosition.y}%)`
                  : "scale(1)",
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                transition: isZoomed ? "none" : "transform 0.3s ease",
              }}
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <button
                className="bg-white bg-opacity-20 text-white px-4 py-2 rounded mr-2"
                onClick={() => setIsZoomed(!isZoomed)}
              >
                {isZoomed ? <FiZoomOut /> : <FiZoomIn />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
