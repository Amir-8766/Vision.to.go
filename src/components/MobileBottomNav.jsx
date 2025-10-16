// src/components/MobileBottomNav.jsx
import { NavLink } from "react-router-dom";
import { PiShoppingBagThin, PiHeartStraightThin } from "react-icons/pi";
import { CiSearch, CiHome, CiUser } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { useDarkMode } from "../hooks/useDarkMode";

export default function MobileBottomNav() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef(null);
  const { items } = useCart();
  const { wishlist } = useWishlist();
  const { user } = useAuth();
  const isDarkMode = useDarkMode();

  const cartItemCount = items.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );
  const wishlistItemCount = wishlist.length;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(
        searchTerm.trim()
      )}`;
      setSearchTerm("");
      setSearchOpen(false);
    }
  };

  // Close search box when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        const searchIcon = event.target.closest("[data-mobile-search-icon]");
        if (searchIcon) {
          return;
        }
        setSearchOpen(false);
      }
    };

    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchOpen]);

  return (
    <>
      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-pink-100 border-t border-gray-200 shadow-lg z-50 grid grid-cols-5 items-center h-16 md:hidden">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-2 transition-colors ${
              isActive && !searchOpen
                ? "text-pink-600 dark:text-pink-400"
                : "text-[#171717] dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400"
            }`
          }
        >
          <CiHome size={24} />
          <span className="text-xs mt-1">Home</span>
        </NavLink>

        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className={`flex flex-col items-center justify-center py-2 transition-colors ${
            searchOpen
              ? "text-pink-600 dark:text-pink-400"
              : "text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400"
          }`}
          data-mobile-search-icon
        >
          <CiSearch size={24} />
          <span className="text-xs mt-1">Search</span>
        </button>

        <NavLink
          to="/cart"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-2 transition-colors relative ${
              isActive && !searchOpen
                ? "text-pink-600 dark:text-pink-400"
                : "text-[#171717] dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400"
            }`
          }
        >
          <PiShoppingBagThin size={24} />
          <span className="text-xs mt-1">Cart</span>
          {user && cartItemCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
              {cartItemCount > 99 ? "99+" : cartItemCount}
            </div>
          )}
        </NavLink>

        <NavLink
          to="/wishlist"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-2 transition-colors relative ${
              isActive && !searchOpen
                ? "text-pink-600 dark:text-pink-400"
                : "text-[#171717] dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400"
            }`
          }
        >
          <PiHeartStraightThin size={24} />
          <span className="text-xs mt-1">Wishlist</span>
          {user && wishlistItemCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
              {wishlistItemCount > 99 ? "99+" : wishlistItemCount}
            </div>
          )}
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-2 transition-colors ${
              isActive
                ? "text-pink-600 dark:text-pink-400"
                : "text-[#171717] dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400"
            }`
          }
        >
          <CiUser size={24} />
          <span className="text-xs mt-1">Profile</span>
        </NavLink>
      </nav>

      {/* Mobile Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" />
      )}

      {/* Mobile SearchBox */}
      <div
        ref={searchRef}
        className="fixed bottom-16 left-0 right-0 bg-pink-100 shadow-xl border-t border-gray-200 z-50 transform transition-all duration-300 ease-in-out md:hidden"
        style={{
          transform: searchOpen ? "translateY(0)" : "translateY(100%)",
          opacity: searchOpen ? 1 : 0,
          pointerEvents: searchOpen ? "auto" : "none",
        }}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-[#171717]">
              Search Products
            </h3>
            <button
              onClick={() => setSearchOpen(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <IoClose
                size={20}
                className="text-[#171717] dark:text-gray-400"
              />
            </button>
          </div>

          <form onSubmit={handleSearch}>
            <div className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-600 focus-within:border-pink-500 focus-within:bg-white dark:focus-within:bg-gray-600 transition-colors">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for products..."
                className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                autoFocus
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="ml-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                >
                  <IoClose
                    size={18}
                    className="text-[#171717] dark:text-gray-400"
                  />
                </button>
              )}
              <button
                type="submit"
                className="ml-2 p-2 bg-pink-500 hover:bg-pink-600 rounded-full transition-colors"
              >
                <CiSearch size={20} className="text-gray-800" />
              </button>
            </div>
          </form>

          {/* Quick Search Suggestions */}
          <div className="mt-4">
            <p className="text-sm text-[#171717] mb-2">Popular searches:</p>
            <div className="flex flex-wrap gap-2">
              {["Dress", "Shoes", "Bag", "Accessories"].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchTerm(term);
                    handleSearch({ preventDefault: () => {} });
                  }}
                  className="px-3 py-1 bg-gray-100 hover:bg-pink-100 text-gray-700 hover:text-pink-700 rounded-full text-sm transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
