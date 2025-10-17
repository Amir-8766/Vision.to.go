import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { Link } from "react-router-dom";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { CiShoppingBasket } from "react-icons/ci";
import { BASE_URL } from "../lib/api";
import {
  FaFacebookF,
  FaPinterestP,
  FaLinkedinIn,
  FaTelegramPlane,
  FaWhatsapp,
  FaCheckCircle,
} from "react-icons/fa";
import { PiXLogo } from "react-icons/pi";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getImageUrl } from "../lib/api";
import OptimizedImage from "./OptimizedImage";

const Tooltip = ({ show, children }) => (
  <div
    className={`pointer-events-none absolute left-10 top-2 z-20 px-2 py-1 rounded text-xs text-gray-800 bg-gray-100 dark:text-gray-800 dark:bg-gray-200 transition-opacity duration-200 ${
      show ? "opacity-100" : "opacity-0"
    }`}
    style={{ whiteSpace: "nowrap" }}
  >
    {children}
  </div>
);

const SOCIALS = [
  {
    name: "Facebook",
    icon: <FaFacebookF size={20} />,
    url: (link, name) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        link
      )}&quote=${encodeURIComponent(name)}`,
  },
  {
    name: "X",
    icon: <PiXLogo size={20} />,
    url: (link, name) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        link
      )}&text=${encodeURIComponent(name)}`,
  },
  {
    name: "Pinterest",
    icon: <FaPinterestP size={20} />,
    url: (link, name) =>
      `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
        link
      )}&description=${encodeURIComponent(name)}`,
  },
  {
    name: "LinkedIn",
    icon: <FaLinkedinIn size={20} />,
    url: (link, name) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        link
      )}`,
  },
  {
    name: "Telegram",
    icon: <FaTelegramPlane size={20} />,
    url: (link, name) =>
      `https://t.me/share/url?url=${encodeURIComponent(
        link
      )}&text=${encodeURIComponent(name)}`,
  },
  {
    name: "WhatsApp",
    icon: <FaWhatsapp size={20} />,
    url: (link, name) =>
      `https://wa.me/?text=${encodeURIComponent(name + " " + link)}`,
  },
];

const QuickViewModal = ({ product, open, onClose }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("M");
  const [hoveredSize, setHoveredSize] = useState(null);
  const productLink = window.location.origin + "/products/" + product._id;
  const sizes = ["S", "M", "L", "XL"];

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    cssEase: "linear",
    arrows: true,
    adaptiveHeight: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  // Custom components for arrows
  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, right: "-25px", zIndex: 1 }}
        onClick={onClick}
      />
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, left: "-25px", zIndex: 1 }}
        onClick={onClick}
      />
    );
  }

  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div
        className="bg-white rounded-lg shadow-lg max-w-3xl w-full relative p-8 flex flex-col md:flex-row gap-10 min-h-[480px] max-h-[90vh] md:max-h-[90vh] overflow-y-auto md:overflow-visible"
        style={{
          padding: window.innerWidth <= 768 ? 16 : undefined,
          minHeight: window.innerWidth <= 768 ? 0 : undefined,
          maxHeight: window.innerWidth <= 768 ? "80vh" : undefined,
        }}
      >
        <button
          className="absolute top-2 right-2 text-black hover:text-gray-700 rounded-full w-8 h-8 flex items-center justify-center text-3xl font-thin tracking-tighter z-50"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className="flex-1 flex items-center justify-center">
          {product.images && product.images.length > 0 ? (
            <div className="w-full max-w-md">
              <Slider {...sliderSettings}>
                {product.images.map((image, index) => (
                  <div key={index} className="px-2 outline-none">
                    <OptimizedImage
                      src={getImageUrl(image)}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-auto max-h-96 object-contain rounded mx-auto"
                      priority={index === 0}
                    />
                  </div>
                ))}
              </Slider>
            </div>
          ) : (
            <OptimizedImage
              src={getImageUrl(product.image)}
              alt={product.name}
              className="w-full max-w-md object-contain rounded max-h-96"
              priority={true}
            />
          )}
        </div>
        <div className="flex-1 flex flex-col justify-start">
          <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
          <div className="text-pink-600 dark:text-pink-400 text-2xl font-semibold mb-4">
            {product.isDiscounted && product.originalPrice ? (
              <div className="flex items-center gap-3">
                <span className="line-through text-red-500 text-xl">
                  €{product.originalPrice.toLocaleString()}
                </span>
                <span className="text-pink-600 dark:text-pink-400">
                  €{product.price.toLocaleString()}
                </span>
                <span className="bg-red-500 text-white px-3 py-1 rounded text-sm font-medium">
                  {product.discountLabel || "Last Chance"}
                </span>
              </div>
            ) : (
              <span>€{product.price.toLocaleString()}</span>
            )}
          </div>

          {/* Size selector */}
          <div className="mb-6">
            <div className="font-semibold mb-2">Size:</div>
            <div className="flex gap-6">
              {sizes.map((size) => (
                <button
                  key={size}
                  className="relative px-2 py-1 text-lg font-medium text-gray-800 focus:outline-none bg-transparent"
                  style={{ minWidth: 36 }}
                  onMouseEnter={() => setHoveredSize(size)}
                  onMouseLeave={() => setHoveredSize(null)}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                  <span
                    className={`absolute left-0 right-0 -bottom-1 h-[2px] rounded transition-all duration-200 ${
                      selectedSize === size
                        ? "bg-black w-full opacity-100"
                        : hoveredSize === size
                        ? "bg-black w-2/3 opacity-60"
                        : "bg-transparent w-0 opacity-0"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <button
            className="mt-2 mb-8 bg-pink-500 text-gray-800 px-6 py-2 rounded flex items-center gap-2 justify-center hover:bg-pink-600 transition text-lg font-semibold"
            onClick={() => {
              addToCart({ ...product, selectedSize });
              onClose();
              setTimeout(() => alert("Added to cart!"), 200);
            }}
          >
            <AiOutlineShoppingCart size={22} /> Add to Cart
          </button>

          <div className="mt-auto pt-4 border-t flex flex-col gap-2 pb-2 md:pb-0">
            <div className="font-medium text-gray-700 mb-1">Share:</div>
            <div className="flex gap-4 items-center flex-wrap">
              {SOCIALS.map((s) => (
                <a
                  key={s.name}
                  href={s.url(productLink, product.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#171717] hover:text-pink-600 dark:hover:text-pink-400 transition"
                  title={"Share on " + s.name}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product, linkPath = null }) => {
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const [hovered, setHovered] = useState(false);
  const [showSearchTip, setShowSearchTip] = useState(false);
  const [showHeartTip, setShowHeartTip] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [blurHovered, setBlurHovered] = useState(false);
  const [addedEffect, setAddedEffect] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

  // Determine the correct link path
  const getLinkPath = () => {
    if (linkPath) return linkPath;
    // Check if it's a commission product
    if (product.commissionRate !== undefined) {
      return `/commission/${product._id}`;
    }
    // Default to products
    return `/products/${product._id}`;
  };

  const handleCardClick = (e) => {
    if (isMobile()) {
      if (!showActions) {
        e.preventDefault();
        setShowActions(true);
      } else {
        // Second tap: go to product details
        setShowActions(false);
      }
    }
  };

  const mainImg =
    product.images && product.images.length > 0
      ? product.images[0]
      : product.image;
  const secondImg =
    product.images && product.images.length > 1 ? product.images[1] : mainImg;

  const handleAddToCart = (e) => {
    e.preventDefault();
    console.log("Adding to cart:", product);
    console.log("Product images:", product.images);
    console.log("Product image:", product.image);
    addToCart(product);
    setAddedEffect(true);
    setTimeout(() => setAddedEffect(false), 1500);
  };

  return (
    <div
      className="relative bg-white rounded-2xl overflow-hidden shadow group transition-all duration-300 border hover:shadow-xl"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setShowSearchTip(false);
        setShowHeartTip(false);
        setBlurHovered(false);
        setShowActions(false);
      }}
    >
      {/* Feedback effect overlay */}
      {addedEffect && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/70 animate-fade-in-out">
          <FaCheckCircle className="text-green-500" size={48} />
          <span className="mt-2 text-green-700 font-bold text-lg animate-pop">
            Added to cart!
          </span>
        </div>
      )}

      {/* Image with hover effect */}
      <Link to={getLinkPath()} className="block" onClick={handleCardClick}>
        <div className="relative w-full aspect-[3/4] overflow-hidden">
          {/* Product Image covering entire card */}
          <OptimizedImage
            src={getImageUrl(hovered ? secondImg : mainImg)}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              hovered ? "scale-105" : "scale-100"
            }`}
            priority={true}
          />

          {/* Gradient Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Left icons with animation */}
          <div
            className={`absolute top-2 left-2 flex flex-col gap-2 z-10
            transition-all duration-300
            ${
              hovered || (isMobile() && showActions)
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-4"
            }
          `}
          >
            <div className="relative">
              <button
                className="bg-white/90 backdrop-blur-sm rounded-full w-9 h-9 flex items-center justify-center shadow hover:scale-110 transition"
                onMouseEnter={() => setShowSearchTip(true)}
                onMouseLeave={() => setShowSearchTip(false)}
                onClick={(e) => {
                  e.preventDefault();
                  setShowModal(true);
                }}
                tabIndex={-1}
                aria-label={`Quick view ${product.name}`}
              >
                <AiOutlineSearch size={22} className="text-gray-700" />
              </button>
              <Tooltip show={showSearchTip}>Quick View</Tooltip>
            </div>
            <div className="relative">
              <button
                className="bg-white/90 backdrop-blur-sm rounded-full w-9 h-9 flex items-center justify-center shadow hover:scale-110 transition"
                onMouseEnter={() => setShowHeartTip(true)}
                onMouseLeave={() => setShowHeartTip(false)}
                onClick={(e) => {
                  e.preventDefault();
                  toggleWishlist(product._id);
                }}
                tabIndex={-1}
                aria-label={`${
                  wishlist.includes(product._id) ? "Remove from" : "Add to"
                } wishlist ${product.name}`}
              >
                {wishlist.includes(product._id) ? (
                  <AiFillHeart
                    size={22}
                    className="text-pink-600 dark:text-pink-400"
                  />
                ) : (
                  <AiOutlineHeart size={22} className="text-gray-700" />
                )}
              </button>
              <Tooltip show={showHeartTip}>Add to Wishlist</Tooltip>
            </div>
          </div>

          {/* Cart Icon fixed at bottom */}
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 z-20">
            <button
              onClick={handleAddToCart}
              className="bg-white/90 backdrop-blur-sm text-gray-700 hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer rounded-full w-10 h-10 flex items-center justify-center shadow hover:scale-110"
              title="Add to Cart"
              aria-label={`Add ${product.name} to cart`}
            >
              <CiShoppingBasket size={20} />
            </button>
          </div>

          {/* Product info overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            {/* Partner Logo for Commission products */}
            {product.partnerLogo && (
              <div className="mb-2">
                <OptimizedImage
                  src={getImageUrl(product.partnerLogo)}
                  alt={product.partnerName || "Partner"}
                  className="w-8 h-8 rounded-full object-cover border border-white/30"
                  title={product.partnerName || "Partner"}
                  width={32}
                  height={32}
                />
              </div>
            )}

            {/* Product Name */}
            <div className="text-lg font-semibold text-white mb-2 line-clamp-2">
              {product.name}
            </div>

            {/* Price */}
            <div className="text-white font-bold text-xl">
              {product.isDiscounted && product.originalPrice ? (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="line-through text-red-300 text-sm">
                      €{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-white text-xl">
                      €{product.price.toLocaleString()}
                    </span>
                  </div>
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium inline-block w-fit">
                    {product.discountLabel || "Last Chance"}
                  </span>
                </div>
              ) : (
                <span>€{product.price.toLocaleString()}</span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        open={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default ProductCard;
