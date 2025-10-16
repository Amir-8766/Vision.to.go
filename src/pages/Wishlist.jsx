import React, { useEffect, useState } from "react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { AiFillHeart } from "react-icons/ai";
import { RiDeleteBin3Line } from "react-icons/ri";
import { apiFetch, BASE_URL, getImageUrl } from "../lib/api";
import { Link } from "react-router-dom";
import StarRating from "../components/StarRating";

export default function Wishlist() {
  const { wishlist, toggleWishlist, refreshWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [commissionProducts, setCommissionProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);

        // Loading regular products
        const productsRes = await apiFetch("/products");
        const productsData = await productsRes.json();
        setProducts(productsData);

        // Loading Commission products
        const commissionRes = await apiFetch("/commission");
        const commissionData = await commissionRes.json();
        setCommissionProducts(commissionData);

        console.log("Products loaded:", productsData.length);
        console.log("Commission products loaded:", commissionData.length);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Combining all products
  const allProducts = [...products, ...commissionProducts];
  const wishlistProducts = allProducts.filter((p) => wishlist.includes(p._id));

  // Debug info
  console.log("Debug Wishlist:");
  console.log("- Wishlist IDs:", wishlist);
  console.log("- Regular products:", products.length);
  console.log("- Commission products:", commissionProducts.length);
  console.log("- All products:", allProducts.length);
  console.log("- Wishlist products found:", wishlistProducts.length);
  console.log("- localStorage wishlist:", JSON.parse(localStorage.getItem("wishlistItems") || "[]"));
  console.log("- Sample product data:", allProducts[0]);
  console.log("- Wishlist products data:", wishlistProducts);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-20">
        <div className="text-center mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6 pb-20">
      {/* Back to Products */}
      <div className="mb-6 flex justify-center md:justify-start">
        <Link
          to="/products"
          className="inline-block px-4 py-2 bg-[#DC2525] text-white rounded-lg font-medium hover:bg-[#b71c1c] transition"
        >
          ← Back to Products
        </Link>
      </div>

      <div className="flex flex-col gap-0">
        {wishlistProducts.length === 0 ? (
          <div className="text-center mt-20 col-span-full">
            <AiFillHeart size={40} className="mx-auto text-pink-400" />
            <h2 className="text-xl mt-4 text-[#171717]">Your wishlist is empty!</h2>
            {/* Debug info */}
            <div className="mt-4 p-4 bg-gray-100 rounded-lg text-left max-w-md mx-auto">
              <h3 className="font-semibold mb-2 text-[#171717]">Debug Info:</h3>
              <p className="text-[#171717]">Wishlist IDs: {JSON.stringify(wishlist)}</p>
              <p className="text-[#171717]">Regular products: {products.length}</p>
              <p className="text-[#171717]">Commission products: {commissionProducts.length}</p>
              <p className="text-[#171717]">All products: {allProducts.length}</p>
              <p className="text-[#171717]">Wishlist products found: {wishlistProducts.length}</p>
              <button 
                onClick={refreshWishlist}
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                Refresh Wishlist
              </button>
            </div>
          </div>
        ) : (
          wishlistProducts.map((product, idx) => (
            <div key={product._id}>
              <div
                className={
                  "sm:bg-white sm:border sm:rounded-xl sm:shadow sm:p-4 " +
                  "flex flex-row gap-4 items-start "
                }
              >
                {/* Image + delivery */}
                <div className="flex flex-col items-center justify-center w-32 sm:w-24 flex-shrink-0">
                  <img
                    src={getImageUrl(product.image || product.images?.[0] || '')}
                    alt={product.name}
                    className="w-28 h-28 sm:w-20 sm:h-20 object-cover rounded border"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                  <div className="text-xs text-[#171717] mt-2 flex items-center gap-1">
                    📦 <span>Available - 2-3 working days</span>
                  </div>
                  <button
                    onClick={() => toggleWishlist(product._id)}
                    className="flex items-center gap-2 text-white border border-gray-300 rounded px-3 py-1 mt-10 w-auto sm:w-auto justify-center bg-gray-800 hover:bg-gray-700 transition text-sm"
                  >
                    <RiDeleteBin3Line />
                    Remove
                  </button>
                </div>
                {/* Product Info */}
                <div className="flex-1 flex flex-col justify-between pl-2">
                  {/* Title, description, rating */}
                  <div className="mb-3">
                    <h3 className="text-base font-semibold text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-[#171717] text-sm">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating value={product.avgRating || 0} disabled />
                      <span className="text-xs text-[#171717]">
                        ({product.ratings?.length || 0})
                      </span>
                    </div>
                  </div>
                  {/* Buttons + price */}
                  <div className="flex flex-col sm:flex-row justify-end items-end gap-2 mt-9 sm:mt-12">
                    <div className="flex flex-col items-end">
                      <span className="text-lg font-bold text-[#DC2525] mb-1">
                        €{product.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full sm:w-auto px-3 py-1 bg-[#DC2525] text-white rounded hover:bg-[#b71c1c] hover:scale-105 hover:shadow-lg active:scale-95 active:bg-[#8e0000] transform transition-all duration-200 ease-in-out text-sm font-semibold"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Divider for mobile only, not after last item */}
              {idx < wishlistProducts.length - 1 && (
                <div className="block sm:hidden -mx-4 my-4">
                  <hr className="border-t-2 border-gray-200" />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
