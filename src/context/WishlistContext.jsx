import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { apiFetch } from "../lib/api";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();

  // مقدار اولیه را از localStorage بخوان
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("wishlistItems");
      const parsed = saved ? JSON.parse(saved) : [];
      console.log("Initial wishlist loaded from localStorage:", parsed);
      return parsed;
    } catch (error) {
      console.error("Error loading wishlist from localStorage:", error);
      return [];
    }
  });

  // هر بار که wishlist تغییر کرد، در localStorage ذخیره کن
  useEffect(() => {
    try {
      localStorage.setItem("wishlistItems", JSON.stringify(wishlist));
      console.log("Wishlist saved to localStorage:", wishlist);
    } catch (error) {
      console.error("Error saving wishlist to localStorage:", error);
    }
  }, [wishlist]);

  const toggleWishlist = (productId) => {
    console.log("Toggle wishlist called for product:", productId);
    setWishlist((prev) => {
      const newWishlist = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      console.log("New wishlist:", newWishlist);
      return newWishlist;
    });
  };

  const clearWishlist = () => setWishlist([]);

  const refreshWishlist = () => {
    try {
      const saved = localStorage.getItem("wishlistItems");
      const parsed = saved ? JSON.parse(saved) : [];
      console.log("Refreshing wishlist from localStorage:", parsed);
      setWishlist(parsed);
    } catch (error) {
      console.error("Error refreshing wishlist:", error);
    }
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, toggleWishlist, clearWishlist, refreshWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
