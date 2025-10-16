import React, { useState, useEffect } from "react";
import { apiFetch, getImageUrl } from "../lib/api";
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";

const FeaturedProductsView = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    productId: "",
    displayOrder: 1,
    customTitle: "",
    customDescription: "",
  });

  const colors = {
    brightPink: "#de5499",
    darkTeal: "#00897b",
    lightPink: "#f9a8d4",
    orange: "#ff6b35",
  };

  useEffect(() => {
    fetchFeaturedProducts();
    fetchAvailableProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const res = await apiFetch("/featured-products/admin");
      if (res.ok) {
        const data = await res.json();
        setFeaturedProducts(data);
      }
    } catch (error) {
      console.error("Error fetching featured products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableProducts = async () => {
    try {
      const res = await apiFetch("/featured-products/available-products");
      if (res.ok) {
        const data = await res.json();
        setAvailableProducts(data);
      }
    } catch (error) {
      console.error("Error fetching available products:", error);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await apiFetch("/featured-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await fetchFeaturedProducts();
        await fetchAvailableProducts();
        setShowAddModal(false);
        setFormData({
          productId: "",
          displayOrder: 1,
          customTitle: "",
          customDescription: "",
        });
      } else {
        const error = await res.json();
        alert(error.error || "Error adding featured product");
      }
    } catch (error) {
      console.error("Error adding featured product:", error);
      alert("Error adding featured product");
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await apiFetch(`/featured-products/${editingProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await fetchFeaturedProducts();
        setShowEditModal(false);
        setEditingProduct(null);
        setFormData({
          productId: "",
          displayOrder: 1,
          customTitle: "",
          customDescription: "",
        });
      } else {
        const error = await res.json();
        alert(error.error || "Error updating featured product");
      }
    } catch (error) {
      console.error("Error updating featured product:", error);
      alert("Error updating featured product");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this product from featured list?"
      )
    ) {
      return;
    }

    try {
      const res = await apiFetch(`/featured-products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchFeaturedProducts();
        await fetchAvailableProducts();
      } else {
        const error = await res.json();
        alert(error.error || "Error removing featured product");
      }
    } catch (error) {
      console.error("Error removing featured product:", error);
      alert("Error removing featured product");
    }
  };

  const handleToggleActive = async (product) => {
    try {
      const res = await apiFetch(`/featured-products/${product._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !product.isActive }),
      });

      if (res.ok) {
        await fetchFeaturedProducts();
      } else {
        const error = await res.json();
        alert(error.error || "Error updating featured product");
      }
    } catch (error) {
      console.error("Error updating featured product:", error);
      alert("Error updating featured product");
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      productId: product.productId._id,
      displayOrder: product.displayOrder,
      customTitle: product.customTitle || "",
      customDescription: product.customDescription || "",
    });
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2"
          style={{ borderColor: colors.brightPink }}
        ></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Featured Products Management
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-medium transition-colors hover:opacity-90"
          style={{ backgroundColor: colors.brightPink }}
        >
          <FaPlus size={16} />
          <span>Add Featured Product</span>
        </button>
      </div>

      {/* Featured Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((order) => {
          const product = featuredProducts.find(
            (p) => p.displayOrder === order
          );
          return (
            <div
              key={order}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div
                className="p-4 border-b"
                style={{ backgroundColor: colors.lightPink }}
              >
                <h3 className="font-semibold text-gray-900">
                  Position {order}
                </h3>
              </div>

              {product ? (
                <div className="p-4">
                  <div className="aspect-square mb-4 rounded-lg overflow-hidden">
                    <img
                      src={getImageUrl(
                        product.productId.images?.[0] || product.productId.image
                      )}
                      alt={product.productId.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-2 truncate">
                    {product.customTitle || product.productId.name}
                  </h4>

                  <p className="text-sm text-[#171717] mb-2">
                    €{product.productId.price.toFixed(2)}
                  </p>

                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleToggleActive(product)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        title={product.isActive ? "Deactivate" : "Activate"}
                      >
                        {product.isActive ? (
                          <FaEyeSlash size={16} />
                        ) : (
                          <FaEye size={16} />
                        )}
                      </button>

                      <button
                        onClick={() => openEditModal(product)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Edit"
                      >
                        <FaEdit size={16} />
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                        title="Remove"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-[#171717]">
                  <p className="mb-4">No product assigned</p>
                  <button
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, displayOrder: order }));
                      setShowAddModal(true);
                    }}
                    className="text-sm px-3 py-1 rounded-lg text-white"
                    style={{ backgroundColor: colors.darkTeal }}
                  >
                    Assign Product
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Add Featured Product</h3>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product
                </label>
                <select
                  value={formData.productId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      productId: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                >
                  <option value="">Select a product</option>
                  {availableProducts.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name} - €{product.price.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <select
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      displayOrder: parseInt(e.target.value),
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                >
                  {[1, 2, 3, 4].map((order) => (
                    <option key={order} value={order}>
                      Position {order}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Title (Optional)
                </label>
                <input
                  type="text"
                  value={formData.customTitle}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      customTitle: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Override product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Description (Optional)
                </label>
                <textarea
                  value={formData.customDescription}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      customDescription: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  rows="3"
                  placeholder="Override product description"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg text-white font-medium"
                  style={{ backgroundColor: colors.brightPink }}
                >
                  Add Product
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Edit Featured Product
            </h3>

            <form onSubmit={handleEditProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <select
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      displayOrder: parseInt(e.target.value),
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                >
                  {[1, 2, 3, 4].map((order) => (
                    <option key={order} value={order}>
                      Position {order}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Title (Optional)
                </label>
                <input
                  type="text"
                  value={formData.customTitle}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      customTitle: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Override product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Description (Optional)
                </label>
                <textarea
                  value={formData.customDescription}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      customDescription: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  rows="3"
                  placeholder="Override product description"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg text-white font-medium"
                  style={{ backgroundColor: colors.brightPink }}
                >
                  Update Product
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedProductsView;
