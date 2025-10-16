import React, { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { BASE_URL } from "../lib/api";
import { getImageUrl } from "../lib/api";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [commissionProducts, setCommissionProducts] = useState([]);
  const [partnersAdmin, setPartnersAdmin] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commissionLoading, setCommissionLoading] = useState(true);
  const [partnersLoading, setPartnersLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("products"); // "products" | "commission" | "partners"
  const [form, setForm] = useState({
    name: "",
    price: "",
    originalPrice: "",
    isDiscounted: false,
    discountLabel: "Last Chance",
    description: "",
    zustand: "",
    width: "",
    depth: "",
    height: "",
    brand: "",
    model: "",
    color: "",
    material: "",
    pattern: "",
  });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    originalPrice: "",
    isDiscounted: false,
    discountLabel: "Last Chance",
    description: "",
    zustand: "",
    width: "",
    depth: "",
    height: "",
    brand: "",
    model: "",
    color: "",
    material: "",
    pattern: "",
    images: [],
  });

  const [commissionForm, setCommissionForm] = useState({
    name: "",
    price: "",
    originalPrice: "",
    isDiscounted: false,
    discountLabel: "Last Chance",
    commissionRate: 30,
    partnerName: "",
    partnerLogo: "",
    partnerDescription: "",
    category: "",
    images: [],
  });
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [selectedFilesCount, setSelectedFilesCount] = useState(0);

  // Partners admin forms
  const [partnerForm, setPartnerForm] = useState({
    name: "",
    description: "",
    website: "",
    instagram: "",
    category: "education",
    services: "",
    partnershipType: "geschaeftspartner",
    isActive: true,
    logo: "",
    featuredImage: "",
  });
  const [partnerEditId, setPartnerEditId] = useState(null);
  const [partnerEditForm, setPartnerEditForm] = useState({
    name: "",
    description: "",
    website: "",
    instagram: "",
    category: "education",
    services: "",
    partnershipType: "geschaeftspartner",
    isActive: true,
    logo: "",
    featuredImage: "",
  });

  // گرفتن لیست محصولات
  useEffect(() => {
    fetchProducts();
    fetchCommissionProducts();
    fetchPartnersAdmin();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await apiFetch("/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError("Error fetching products");
    } finally {
      setLoading(false);
    }
  }

  // Partners admin
  async function fetchPartnersAdmin() {
    setPartnersLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await apiFetch("/partners/admin", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load partners");
      setPartnersAdmin(data);
    } catch (err) {
      setError("Error fetching partners");
    } finally {
      setPartnersLoading(false);
    }
  }

  async function handleAddPartner(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...partnerForm,
        logo: partnerForm.logo,
        featuredImage: partnerForm.featuredImage,
        services: partnerForm.services
          ? partnerForm.services.split(",").map((s) => s.trim())
          : [],
      };
      const res = await apiFetch("/partners", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add partner");
      setPartnerForm({
        name: "",
        description: "",
        website: "",
        instagram: "",
        category: "education",
        services: "",
        partnershipType: "geschaeftspartner",
        isActive: true,
        logo: "",
        featuredImage: "",
      });
      fetchPartnersAdmin();
    } catch (err) {
      setError("Error adding partner");
    }
  }

  async function handleUpdatePartner(id) {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...partnerEditForm,
        logo: partnerEditForm.logo,
        featuredImage: partnerEditForm.featuredImage,
        services: partnerEditForm.services
          ? partnerEditForm.services.split(",").map((s) => s.trim())
          : [],
      };
      const res = await apiFetch(`/partners/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update partner");
      setPartnerEditId(null);
      fetchPartnersAdmin();
    } catch (err) {
      setError("Error updating partner");
    }
  }

  async function handleDeletePartner(id) {
    if (!window.confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await apiFetch(`/partners/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to delete partner");
      fetchPartnersAdmin();
    } catch (err) {
      setError("Error deleting partner");
    }
  }

  async function fetchCommissionProducts() {
    setCommissionLoading(true);
    try {
      const res = await apiFetch("/commission");
      const data = await res.json();
      setCommissionProducts(data);
    } catch (err) {
      setError("Error fetching commission products");
    } finally {
      setCommissionLoading(false);
    }
  }

  // افزودن محصول جدید
  async function handleAdd(e) {
    e.preventDefault();

    // Validation: اگر تخفیف فعال باشه، قیمت اصلی باید بیشتر از قیمت فعلی باشه
    if (
      form.isDiscounted &&
      form.originalPrice &&
      parseFloat(form.originalPrice) <= parseFloat(form.price)
    ) {
      setError(
        "Original Price must be HIGHER than Current Price! Original Price is the old/higher price that will be crossed out."
      );
      return;
    }

    // اگر تخفیف فعال باشه، باید originalPrice هم وارد شده باشه
    if (form.isDiscounted && !form.originalPrice) {
      setError("If you mark as discounted, you must enter an Original Price!");
      return;
    }

    try {
      const productData = {
        name: form.name,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice
          ? parseFloat(form.originalPrice)
          : undefined,
        isDiscounted: form.isDiscounted,
        discountLabel: form.discountLabel,
        description: form.description,
        zustand: form.zustand,
        width: form.width,
        depth: form.depth,
        height: form.height,
        brand: form.brand,
        model: form.model,
        color: form.color,
        material: form.material,
        pattern: form.pattern,
        image: imageUrls[0] || imageUrl, // main image for backward compatibility
        images: imageUrls, // all images
      };

      console.log("Sending product data:", productData);

      const res = await apiFetch("/products", {
        method: "POST",
        body: JSON.stringify(productData),
      });
      if (!res.ok) throw new Error("Error adding product");
      setForm({
        name: "",
        price: "",
        originalPrice: "",
        isDiscounted: false,
        discountLabel: "Last Chance",
        description: "",
        zustand: "",
        width: "",
        depth: "",
        height: "",
        brand: "",
        model: "",
        color: "",
        material: "",
        pattern: "",
      });
      setImageUrl("");
      setImage(null);
      setImageUrls([]);
      fetchProducts();
    } catch (err) {
      setError("Error adding product");
    }
  }

  // افزودن کالای کمیسیونی جدید
  async function handleAddCommission(e) {
    e.preventDefault();

    // Validation: اگر تخفیف فعال باشه، قیمت اصلی باید بیشتر از قیمت فعلی باشه
    if (
      commissionForm.isDiscounted &&
      commissionForm.originalPrice &&
      parseFloat(commissionForm.originalPrice) <=
        parseFloat(commissionForm.price)
    ) {
      setError(
        "Original Price must be HIGHER than Current Price! Original Price is the old/higher price that will be crossed out."
      );
      return;
    }

    // اگر تخفیف فعال باشه، باید originalPrice هم وارد شده باشه
    if (commissionForm.isDiscounted && !commissionForm.originalPrice) {
      setError("If you mark as discounted, you must enter an Original Price!");
      return;
    }

    try {
      const commissionData = {
        name: commissionForm.name,
        price: parseFloat(commissionForm.price),
        originalPrice: commissionForm.originalPrice
          ? parseFloat(commissionForm.originalPrice)
          : undefined,
        isDiscounted: commissionForm.isDiscounted,
        discountLabel: commissionForm.discountLabel,
        commissionRate: parseFloat(commissionForm.commissionRate),
        partnerName: commissionForm.partnerName,
        partnerLogo: commissionForm.partnerLogo,
        partnerDescription: commissionForm.partnerDescription,
        category: commissionForm.category,
        images: imageUrls,
      };

      console.log("Sending commission data:", commissionData);

      const res = await apiFetch("/commission", {
        method: "POST",
        body: JSON.stringify(commissionData),
      });
      if (!res.ok) throw new Error("Error adding commission product");
      setCommissionForm({
        name: "",
        price: "",
        originalPrice: "",
        isDiscounted: false,
        discountLabel: "Last Chance",
        commissionRate: 30,
        partnerName: "",
        partnerLogo: "",
        partnerDescription: "",
        category: "",
        images: [],
      });
      setImageUrl("");
      setImage(null);
      setImageUrls([]);
      setSelectedFilesCount(0);
      fetchCommissionProducts();
    } catch (err) {
      setError("Error adding commission product");
    }
  }

  // حذف محصول
  async function handleDelete(id) {
    if (!window.confirm("Are you sure?")) return;
    try {
      // تشخیص نوع محصول بر اساس activeTab
      const endpoint = activeTab === "commission" ? "/commission" : "/products";
      await apiFetch(`${endpoint}/${id}`, {
        method: "DELETE",
      });

      // refresh کردن لیست مناسب
      if (activeTab === "commission") {
        fetchCommissionProducts();
      } else {
        fetchProducts();
      }
    } catch (err) {
      setError("Error deleting product");
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImage(files[0]); // برای backward compatibility
    setImageUrls([]); // پاک کردن عکس‌های قبلی
    setSelectedFilesCount(files.length);

    // اگر در تب commission هستیم، فایل‌ها رو برای commission products ذخیره کن
    if (activeTab === "commission") {
      console.log("Commission product images selected:", files);
    }
  };

  const handleImageUpload = async () => {
    try {
      // آپلود همه عکس‌های انتخاب شده
      let fileInput;
      if (activeTab === "commission") {
        fileInput = document.getElementById("commission-product-images");
      } else {
        fileInput = document.querySelector('input[type="file"]');
      }

      if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        setError("Please select files to upload");
        return;
      }

      const files = Array.from(fileInput.files);
      console.log("Uploading files:", files);

      for (const file of files) {
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch(BASE_URL + "/products/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        });

        if (!res.ok) throw new Error(`Failed to upload ${file.name}`);

        const data = await res.json();
        setImageUrls((prev) => [...prev, data.imageUrl]);
      }

      setImageUrl(""); // پاک کردن
      setImage(null);
      setSelectedFilesCount(0);
      console.log(
        "Upload completed. Total images:",
        imageUrls.length + files.length
      );
    } catch (err) {
      setError(`Error uploading images: ${err.message}`);
    }
  };

  return (
    <div className="admin-page max-w-2xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">Product Management</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 rounded ${
            activeTab === "products"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Regular Products
        </button>
        <button
          onClick={() => setActiveTab("commission")}
          className={`px-4 py-2 rounded ${
            activeTab === "commission"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Commission Products
        </button>
        <button
          onClick={() => setActiveTab("partners")}
          className={`px-4 py-2 rounded ${
            activeTab === "partners"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Partners
        </button>
      </div>

      {activeTab === "products" && (
        <>
          <form onSubmit={handleAdd} className="mb-6 space-y-2">
            <div className="font-bold">Product Name</div>
            <input
              className="w-full border p-2 rounded"
              placeholder="Product Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />

            <div className="font-bold">
              Current Price (Lower Price - What customer pays)
            </div>
            <input
              className="w-full border p-2 rounded"
              placeholder="Current Price (Lower Price)"
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({ ...f, price: e.target.value }))
              }
              required
            />

            <div className="font-bold">
              Original Price (Optional - for discounts only)
            </div>
            <input
              className="w-full border p-2 rounded"
              placeholder="Original Price (Higher Price)"
              type="number"
              value={form.originalPrice}
              onChange={(e) =>
                setForm((f) => ({ ...f, originalPrice: e.target.value }))
              }
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isDiscounted"
                checked={form.isDiscounted}
                onChange={(e) =>
                  setForm((f) => ({ ...f, isDiscounted: e.target.checked }))
                }
                className="w-4 h-4"
              />
              <label htmlFor="isDiscounted" className="font-bold">
                Mark as Discounted
              </label>
            </div>

            {form.isDiscounted && (
              <>
                <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded border">
                  💡 <strong>Discount Mode Active:</strong>
                  <br />
                  - Original Price is now required
                  <br />
                  - Original Price must be HIGHER than Current Price
                  <br />
                  Example: Original: €15.99, Current: €12.99
                </div>
                <div className="font-bold">Discount Label</div>
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Discount Label (e.g., Last Chance)"
                  value={form.discountLabel}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, discountLabel: e.target.value }))
                  }
                />
              </>
            )}

            <div className="font-bold">Description</div>
            <textarea
              className="w-full border p-2 rounded"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />

            <div className="font-bold">Zustand</div>
            <select
              className="w-full border p-2 rounded"
              value={form.zustand}
              onChange={(e) =>
                setForm((f) => ({ ...f, zustand: e.target.value }))
              }
              required
            >
              <option value="">Select Zustand</option>
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Very Good">Very Good</option>
              <option value="Good">Good</option>
              <option value="Acceptable">Acceptable</option>
              <option value="For Parts / Not Working">
                For Parts / Not Working
              </option>
            </select>

            <div className="font-bold">Size (cm)</div>
            <div className="flex gap-2">
              <input
                className="border p-2 rounded w-1/3"
                placeholder="Width"
                type="number"
                value={form.width}
                onChange={(e) =>
                  setForm((f) => ({ ...f, width: e.target.value }))
                }
              />
              <input
                className="border p-2 rounded w-1/3"
                placeholder="Depth"
                type="number"
                value={form.depth}
                onChange={(e) =>
                  setForm((f) => ({ ...f, depth: e.target.value }))
                }
              />
              <input
                className="border p-2 rounded w-1/3"
                placeholder="Height"
                type="number"
                value={form.height}
                onChange={(e) =>
                  setForm((f) => ({ ...f, height: e.target.value }))
                }
              />
            </div>

            <div className="font-bold">Details</div>
            <input
              className="w-full border p-2 rounded"
              placeholder="Brand"
              value={form.brand}
              onChange={(e) =>
                setForm((f) => ({ ...f, brand: e.target.value }))
              }
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Model"
              value={form.model}
              onChange={(e) =>
                setForm((f) => ({ ...f, model: e.target.value }))
              }
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Color"
              value={form.color}
              onChange={(e) =>
                setForm((f) => ({ ...f, color: e.target.value }))
              }
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Material"
              value={form.material}
              onChange={(e) =>
                setForm((f) => ({ ...f, material: e.target.value }))
              }
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Pattern"
              value={form.pattern}
              onChange={(e) =>
                setForm((f) => ({ ...f, pattern: e.target.value }))
              }
            />

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full border p-2 rounded"
            />

            {/* Preview of selected files */}
            {selectedFilesCount > 0 && (
              <div className="bg-gray-50 p-3 rounded border">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Selected Files ({selectedFilesCount}):
                </div>
                <div className="space-y-1">
                  {(() => {
                    let fileInput;
                    if (activeTab === "commission") {
                      fileInput = document.getElementById(
                        "commission-product-images"
                      );
                    } else {
                      fileInput = document.querySelector('input[type="file"]');
                    }
                    return fileInput && fileInput.files
                      ? Array.from(fileInput.files).map((file, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            📷 {file.name} (
                            {(file.size / 1024 / 1024).toFixed(2)} MB)
                          </div>
                        ))
                      : [];
                  })()}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleImageUpload}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              disabled={selectedFilesCount === 0}
            >
              Upload{" "}
              {selectedFilesCount > 0
                ? `${selectedFilesCount} Images`
                : "Images"}
            </button>
            {imageUrls.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {imageUrls.map((url, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={getImageUrl(url)}
                      alt="Preview"
                      width={60}
                      loading="lazy"
                      decoding="async"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      onClick={() =>
                        setImageUrls((prev) => prev.filter((u, i) => i !== idx))
                      }
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Product
            </button>
          </form>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul className="space-y-2">
              {products.map((p) => (
                <li
                  key={p._id}
                  className="flex justify-between items-center border p-2 rounded"
                >
                  {editId === p._id ? (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();

                        // Validation: اگر تخفیف فعال باشه، قیمت اصلی باید بیشتر از قیمت فعلی باشه
                        if (
                          editForm.isDiscounted &&
                          editForm.originalPrice &&
                          parseFloat(editForm.originalPrice) <=
                            parseFloat(editForm.price)
                        ) {
                          setError(
                            "Original Price must be HIGHER than Current Price! Original Price is the old/higher price that will be crossed out."
                          );
                          return;
                        }

                        // اگر تخفیف فعال باشه، باید originalPrice هم وارد شده باشه
                        if (editForm.isDiscounted && !editForm.originalPrice) {
                          setError(
                            "If you mark as discounted, you must enter an Original Price!"
                          );
                          return;
                        }

                        try {
                          const updateData = {
                            name: editForm.name,
                            price: parseFloat(editForm.price),
                            originalPrice: editForm.originalPrice
                              ? parseFloat(editForm.originalPrice)
                              : undefined,
                            isDiscounted: editForm.isDiscounted,
                            discountLabel: editForm.discountLabel,
                            description: editForm.description,
                            zustand: editForm.zustand,
                            width: editForm.width,
                            depth: editForm.depth,
                            height: editForm.height,
                            brand: editForm.brand,
                            model: editForm.model,
                            color: editForm.color,
                            material: editForm.material,
                            pattern: editForm.pattern,
                            image:
                              (editForm.images && editForm.images[0]) ||
                              p.image,
                            images: editForm.images || [],
                          };
                          await apiFetch(`/products/${p._id}`, {
                            method: "PUT",
                            body: JSON.stringify(updateData),
                          });
                          setEditId(null);
                          fetchProducts();
                        } catch {
                          setError("Error editing product");
                        }
                      }}
                      className="flex flex-col gap-1 w-full"
                    >
                      <input
                        className="border p-1 rounded"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, name: e.target.value }))
                        }
                        required
                      />
                      <input
                        className="border p-1 rounded"
                        placeholder="Current Price (Lower Price)"
                        type="number"
                        value={editForm.price}
                        onChange={(e) => {
                          const newPrice = e.target.value;
                          setEditForm((f) => ({
                            ...f,
                            price: newPrice,
                            // اگر قیمت جدید کمتر از قیمت اصلی باشه، قیمت اصلی رو به‌روزرسانی کن
                            originalPrice:
                              f.originalPrice &&
                              parseFloat(newPrice) < parseFloat(f.originalPrice)
                                ? f.originalPrice
                                : f.price || f.originalPrice,
                          }));
                        }}
                        required
                      />
                      <input
                        className="border p-1 rounded"
                        placeholder="Original Price (Higher Price)"
                        type="number"
                        value={editForm.originalPrice}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            originalPrice: e.target.value,
                          }))
                        }
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isDiscounted"
                          checked={editForm.isDiscounted}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              isDiscounted: e.target.checked,
                            }))
                          }
                          className="w-4 h-4"
                        />
                        <label htmlFor="isDiscounted" className="font-bold">
                          Mark as Discounted
                        </label>
                      </div>

                      {editForm.isDiscounted && (
                        <>
                          <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded border">
                            💡 <strong>How to set discounted price:</strong>
                            <br />
                            1. Original Price: Keep the current/higher price
                            (will be crossed out)
                            <br />
                            2. Current Price: Enter the new/lower price (what
                            customer pays)
                            <br />
                            Example: Original: €15.99, Current: €12.99
                          </div>
                          <input
                            className="border p-1 rounded"
                            placeholder="Discount Label (e.g., Last Chance)"
                            value={editForm.discountLabel}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                discountLabel: e.target.value,
                              }))
                            }
                          />
                        </>
                      )}

                      <textarea
                        className="border p-1 rounded"
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            description: e.target.value,
                          }))
                        }
                      />
                      <select
                        className="border p-1 rounded"
                        value={editForm.zustand}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            zustand: e.target.value,
                          }))
                        }
                        required
                      >
                        <option value="">Select Zustand</option>
                        <option value="New">New</option>
                        <option value="Like New">Like New</option>
                        <option value="Very Good">Very Good</option>
                        <option value="Good">Good</option>
                        <option value="Acceptable">Acceptable</option>
                        <option value="For Parts / Not Working">
                          For Parts / Not Working
                        </option>
                      </select>
                      <div className="flex gap-2">
                        <input
                          className="border p-1 rounded w-1/3"
                          placeholder="Width"
                          type="number"
                          value={editForm.width}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              width: e.target.value,
                            }))
                          }
                        />
                        <input
                          className="border p-1 rounded w-1/3"
                          placeholder="Depth"
                          type="number"
                          value={editForm.depth}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              depth: e.target.value,
                            }))
                          }
                        />
                        <input
                          className="border p-1 rounded w-1/3"
                          placeholder="Height"
                          type="number"
                          value={editForm.height}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              height: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <input
                        className="border p-1 rounded"
                        placeholder="Brand"
                        value={editForm.brand}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, brand: e.target.value }))
                        }
                      />
                      <input
                        className="border p-1 rounded"
                        placeholder="Model"
                        value={editForm.model}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, model: e.target.value }))
                        }
                      />
                      <input
                        className="border p-1 rounded"
                        placeholder="Color"
                        value={editForm.color}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, color: e.target.value }))
                        }
                      />
                      <input
                        className="border p-1 rounded"
                        placeholder="Material"
                        value={editForm.material}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            material: e.target.value,
                          }))
                        }
                      />
                      <input
                        className="border p-1 rounded"
                        placeholder="Pattern"
                        value={editForm.pattern}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            pattern: e.target.value,
                          }))
                        }
                      />
                      {/* Image upload for edit */}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={async (e) => {
                          const files = Array.from(e.target.files);
                          for (const file of files) {
                            const formData = new FormData();
                            formData.append("image", file);
                            const res = await fetch(
                              BASE_URL + "/products/upload",
                              {
                                method: "POST",
                                headers: {
                                  Authorization: `Bearer ${localStorage.getItem(
                                    "token"
                                  )}`,
                                },
                                body: formData,
                              }
                            );
                            const data = await res.json();
                            setEditForm((f) => ({
                              ...f,
                              images: [...(f.images || []), data.imageUrl],
                            }));
                          }
                        }}
                      />
                      {editForm.images && editForm.images.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {editForm.images.map((url, idx) => (
                            <div key={idx} className="relative">
                              <img
                                src={getImageUrl(url)}
                                alt="Preview"
                                width={60}
                              />
                              <button
                                type="button"
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                onClick={() =>
                                  setEditForm((f) => ({
                                    ...f,
                                    images: f.images.filter(
                                      (u, i) => i !== idx
                                    ),
                                  }))
                                }
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2 mt-1">
                        <button
                          type="submit"
                          className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="bg-gray-300 px-2 py-1 rounded"
                          onClick={() => setEditId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div>
                        <b>{p.name}</b> -
                        {p.isDiscounted && p.originalPrice ? (
                          <span className="flex items-center gap-2">
                            <span className="line-through text-red-500">
                              €{p.originalPrice}
                            </span>
                            <span className="text-green-600 font-bold">
                              €{p.price}
                            </span>
                            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">
                              {p.discountLabel}
                            </span>
                          </span>
                        ) : (
                          <span>€{p.price}</span>
                        )}
                        <div className="text-sm text-gray-500">
                          Debug: price={p.price}, originalPrice=
                          {p.originalPrice}, isDiscounted={p.isDiscounted},
                          discountLabel=
                          {p.discountLabel}
                        </div>
                        <div className="text-sm text-gray-500">
                          Condition:{" "}
                          {p.isDiscounted && p.originalPrice
                            ? "TRUE - Showing discounted"
                            : "FALSE - Showing normal price"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {p.description}
                        </div>
                        {p.image && (
                          <img
                            src={getImageUrl(p.image)}
                            alt={p.name}
                            width={60}
                          />
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditId(p._id);
                            setEditForm({
                              name: p.name,
                              price: p.price, // این قیمت فعلی می‌مونه
                              originalPrice: p.originalPrice || p.price, // اگر originalPrice نداشته باشه، قیمت فعلی رو به عنوان قیمت اصلی قرار بده
                              isDiscounted: p.isDiscounted || false,
                              discountLabel: p.discountLabel || "Last Chance",
                              description: p.description,
                              zustand: p.zustand || "",
                              width: p.width || "",
                              depth: p.depth || "",
                              height: p.height || "",
                              brand: p.brand || "",
                              model: p.model || "",
                              color: p.color || "",
                              material: p.material || "",
                              pattern: p.pattern || "",
                              images: p.images || [],
                            });
                          }}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </>
      )}

      {activeTab === "commission" && (
        <>
          <form onSubmit={handleAddCommission} className="mb-6 space-y-2">
            <div className="font-bold">Commission Product Name</div>
            <input
              className="w-full border p-2 rounded"
              placeholder="Commission Product Name"
              value={commissionForm.name}
              onChange={(e) =>
                setCommissionForm((f) => ({ ...f, name: e.target.value }))
              }
              required
            />
            <div className="font-bold">
              Current Price (Lower Price - What customer pays)
            </div>
            <input
              className="w-full border p-2 rounded"
              placeholder="Current Price (Lower Price)"
              type="number"
              value={commissionForm.price}
              onChange={(e) =>
                setCommissionForm((f) => ({ ...f, price: e.target.value }))
              }
              required
            />
            <div className="font-bold">
              Original Price (Optional - for discounts only)
            </div>
            <input
              className="w-full border p-2 rounded"
              placeholder="Original Price (Higher Price)"
              type="number"
              value={commissionForm.originalPrice}
              onChange={(e) =>
                setCommissionForm((f) => ({
                  ...f,
                  originalPrice: e.target.value,
                }))
              }
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isDiscounted"
                checked={commissionForm.isDiscounted}
                onChange={(e) =>
                  setCommissionForm((f) => ({
                    ...f,
                    isDiscounted: e.target.checked,
                  }))
                }
                className="w-4 h-4"
              />
              <label htmlFor="isDiscounted" className="font-bold">
                Mark as Discounted
              </label>
            </div>

            {commissionForm.isDiscounted && (
              <>
                <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded border">
                  💡 <strong>Discount Mode Active:</strong>
                  <br />
                  - Original Price is now required
                  <br />
                  - Original Price must be HIGHER than Current Price
                  <br />
                  Example: Original: €15.99, Current: €12.99
                </div>
                <div className="font-bold">Discount Label</div>
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Discount Label (e.g., Last Chance)"
                  value={commissionForm.discountLabel}
                  onChange={(e) =>
                    setCommissionForm((f) => ({
                      ...f,
                      discountLabel: e.target.value,
                    }))
                  }
                />
              </>
            )}

            {activeTab === "partners" && (
              <>
                <form onSubmit={handleAddPartner} className="mb-6 space-y-2">
                  <div className="font-bold">Name</div>
                  <input
                    className="w-full border p-2 rounded"
                    placeholder="Name"
                    value={partnerForm.name}
                    onChange={(e) =>
                      setPartnerForm((f) => ({ ...f, name: e.target.value }))
                    }
                    required
                  />
                  <div className="font-bold">Website (https://...)</div>
                  <input
                    className="w-full border p-2 rounded"
                    placeholder="https://example.com"
                    value={partnerForm.website}
                    onChange={(e) =>
                      setPartnerForm((f) => ({ ...f, website: e.target.value }))
                    }
                    required
                  />
                  <div className="font-bold">Instagram (optional)</div>
                  <input
                    className="w-full border p-2 rounded"
                    placeholder="https://instagram.com/..."
                    value={partnerForm.instagram}
                    onChange={(e) =>
                      setPartnerForm((f) => ({
                        ...f,
                        instagram: e.target.value,
                      }))
                    }
                  />
                  <div className="font-bold">Description</div>
                  <textarea
                    className="w-full border p-2 rounded"
                    placeholder="Short description"
                    value={partnerForm.description}
                    onChange={(e) =>
                      setPartnerForm((f) => ({
                        ...f,
                        description: e.target.value,
                      }))
                    }
                    required
                  />
                  <div className="font-bold">Category</div>
                  <select
                    className="w-full border p-2 rounded"
                    value={partnerForm.category}
                    onChange={(e) =>
                      setPartnerForm((f) => ({
                        ...f,
                        category: e.target.value,
                      }))
                    }
                  >
                    <option value="education">Education & Training</option>
                    <option value="natural_products">Natural Products</option>
                    <option value="fashion">Fashion</option>
                    <option value="health_wellness">Health & Wellness</option>
                    <option value="beauty">Beauty</option>
                    <option value="sustainability">Sustainability</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="font-bold">Services (comma separated)</div>
                  <input
                    className="w-full border p-2 rounded"
                    placeholder="Service A, Service B"
                    value={partnerForm.services}
                    onChange={(e) =>
                      setPartnerForm((f) => ({
                        ...f,
                        services: e.target.value,
                      }))
                    }
                  />
                  <div className="font-bold">Partnership Type</div>
                  <select
                    className="w-full border p-2 rounded"
                    value={partnerForm.partnershipType}
                    onChange={(e) =>
                      setPartnerForm((f) => ({
                        ...f,
                        partnershipType: e.target.value,
                      }))
                    }
                  >
                    <option value="geschaeftspartner">Geschäftspartner</option>
                    <option value="synergin">Synergin</option>
                  </select>
                  {/* Logo upload */}
                  <div className="font-bold">Logo</div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files && e.target.files[0];
                      if (!file) return;
                      const formData = new FormData();
                      formData.append("image", file);
                      const res = await fetch(BASE_URL + "/products/upload", {
                        method: "POST",
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem(
                            "token"
                          )}`,
                        },
                        body: formData,
                      });
                      const data = await res.json();
                      setPartnerForm((f) => ({ ...f, logo: data.imageUrl }));
                    }}
                    className="w-full border p-2 rounded"
                  />
                  {partnerForm.logo && (
                    <img
                      src={getImageUrl(partnerForm.logo)}
                      alt="Logo preview"
                      className="w-16 h-16 object-cover rounded border mt-2"
                    />
                  )}
                  {/* Featured image upload */}
                  <div className="font-bold">Featured Image (optional)</div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files && e.target.files[0];
                      if (!file) return;
                      const formData = new FormData();
                      formData.append("image", file);
                      const res = await fetch(BASE_URL + "/products/upload", {
                        method: "POST",
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem(
                            "token"
                          )}`,
                        },
                        body: formData,
                      });
                      const data = await res.json();
                      setPartnerForm((f) => ({
                        ...f,
                        featuredImage: data.imageUrl,
                      }));
                    }}
                    className="w-full border p-2 rounded"
                  />
                  {partnerForm.featuredImage && (
                    <img
                      src={getImageUrl(partnerForm.featuredImage)}
                      alt="Featured preview"
                      className="w-24 h-16 object-cover rounded border mt-2"
                    />
                  )}
                  <div className="flex items-center gap-2">
                    <input
                      id="partner-active"
                      type="checkbox"
                      checked={partnerForm.isActive}
                      onChange={(e) =>
                        setPartnerForm((f) => ({
                          ...f,
                          isActive: e.target.checked,
                        }))
                      }
                    />
                    <label htmlFor="partner-active" className="font-medium">
                      Active
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Add Partner
                  </button>
                </form>

                {partnersLoading ? (
                  <p>Loading partners...</p>
                ) : (
                  <ul className="space-y-2">
                    {partnersAdmin.map((p) => (
                      <li
                        key={p._id}
                        className="flex justify-between items-start border p-2 rounded"
                      >
                        {partnerEditId === p._id ? (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleUpdatePartner(p._id);
                            }}
                            className="flex flex-col gap-2 w-full"
                          >
                            <input
                              className="border p-2 rounded"
                              value={partnerEditForm.name}
                              onChange={(e) =>
                                setPartnerEditForm((f) => ({
                                  ...f,
                                  name: e.target.value,
                                }))
                              }
                              required
                            />
                            <input
                              className="border p-2 rounded"
                              placeholder="https://example.com"
                              value={partnerEditForm.website}
                              onChange={(e) =>
                                setPartnerEditForm((f) => ({
                                  ...f,
                                  website: e.target.value,
                                }))
                              }
                              required
                            />
                            <input
                              className="border p-2 rounded"
                              placeholder="https://instagram.com/..."
                              value={partnerEditForm.instagram || ""}
                              onChange={(e) =>
                                setPartnerEditForm((f) => ({
                                  ...f,
                                  instagram: e.target.value,
                                }))
                              }
                            />
                            <textarea
                              className="border p-2 rounded"
                              value={partnerEditForm.description}
                              onChange={(e) =>
                                setPartnerEditForm((f) => ({
                                  ...f,
                                  description: e.target.value,
                                }))
                              }
                            />
                            <select
                              className="border p-2 rounded"
                              value={partnerEditForm.category}
                              onChange={(e) =>
                                setPartnerEditForm((f) => ({
                                  ...f,
                                  category: e.target.value,
                                }))
                              }
                            >
                              <option value="education">
                                Education & Training
                              </option>
                              <option value="natural_products">
                                Natural Products
                              </option>
                              <option value="fashion">Fashion</option>
                              <option value="health_wellness">
                                Health & Wellness
                              </option>
                              <option value="beauty">Beauty</option>
                              <option value="sustainability">
                                Sustainability
                              </option>
                              <option value="other">Other</option>
                            </select>
                            <input
                              className="border p-2 rounded"
                              placeholder="Service A, Service B"
                              value={partnerEditForm.services}
                              onChange={(e) =>
                                setPartnerEditForm((f) => ({
                                  ...f,
                                  services: e.target.value,
                                }))
                              }
                            />
                            <select
                              className="border p-2 rounded"
                              value={partnerEditForm.partnershipType}
                              onChange={(e) =>
                                setPartnerEditForm((f) => ({
                                  ...f,
                                  partnershipType: e.target.value,
                                }))
                              }
                            >
                              <option value="geschaeftspartner">
                                Geschäftspartner
                              </option>
                              <option value="synergin">Synergin</option>
                            </select>
                            <div className="flex items-center gap-2">
                              <input
                                id={`edit-active-${p._id}`}
                                type="checkbox"
                                checked={!!partnerEditForm.isActive}
                                onChange={(e) =>
                                  setPartnerEditForm((f) => ({
                                    ...f,
                                    isActive: e.target.checked,
                                  }))
                                }
                              />
                              <label
                                htmlFor={`edit-active-${p._id}`}
                                className="font-medium"
                              >
                                Active
                              </label>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="submit"
                                className="bg-green-600 text-white px-3 py-1 rounded"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                className="bg-gray-300 px-3 py-1 rounded"
                                onClick={() => setPartnerEditId(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="flex-1">
                            <div className="font-bold">{p.name}</div>
                            {p.logo && (
                              <img
                                src={getImageUrl(p.logo)}
                                alt="Logo"
                                className="w-10 h-10 object-cover rounded-full border my-1"
                              />
                            )}
                            <div className="text-sm text-gray-600 break-words">
                              {p.website}
                            </div>
                            <div className="text-sm text-gray-600">
                              {p.category} • {p.partnershipType} •{" "}
                              {p.isActive ? "Active" : "Inactive"}
                            </div>
                            <div className="text-sm text-gray-700 mt-1">
                              {p.description}
                            </div>
                          </div>
                        )}
                        <div className="flex flex-col gap-2 ml-4">
                          <button
                            onClick={() => {
                              setPartnerEditId(p._id);
                              setPartnerEditForm({
                                name: p.name || "",
                                description: p.description || "",
                                website: p.website || "",
                                instagram: p.instagram || "",
                                category: p.category || "education",
                                services: (p.services || []).join(", "),
                                partnershipType:
                                  p.partnershipType || "geschaeftspartner",
                                isActive: p.isActive !== false,
                                logo: p.logo || "",
                                featuredImage: p.featuredImage || "",
                              });
                            }}
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePartner(p._id)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {error && <div className="text-red-500 mt-2">{error}</div>}
              </>
            )}

            <div className="font-bold">Commission Rate (e.g., 30 for 30%)</div>
            <input
              className="w-full border p-2 rounded"
              placeholder="Commission Rate (e.g., 30 for 30%)"
              type="number"
              value={commissionForm.commissionRate}
              onChange={(e) =>
                setCommissionForm((f) => ({
                  ...f,
                  commissionRate: e.target.value,
                }))
              }
              required
            />
            <div className="font-bold">Partner Name</div>
            <input
              className="w-full border p-2 rounded"
              placeholder="Partner Name"
              value={commissionForm.partnerName}
              onChange={(e) =>
                setCommissionForm((f) => ({
                  ...f,
                  partnerName: e.target.value,
                }))
              }
              required
            />

            <div className="font-bold">Partner Logo</div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  // آپلود لوگوی پارتنر
                  const formData = new FormData();
                  formData.append("image", file);

                  fetch(BASE_URL + "/products/upload", {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: formData,
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      setCommissionForm((f) => ({
                        ...f,
                        partnerLogo: data.imageUrl,
                      }));
                    })
                    .catch((err) => {
                      setError("Error uploading partner logo");
                    });
                }
              }}
              className="w-full border p-2 rounded"
            />

            {commissionForm.partnerLogo && (
              <div className="flex items-center gap-2">
                <img
                  src={getImageUrl(commissionForm.partnerLogo)}
                  alt="Partner Logo"
                  className="w-12 h-12 rounded-full object-cover border"
                />
                <span className="text-sm text-gray-600">
                  Logo uploaded successfully
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setCommissionForm((f) => ({ ...f, partnerLogo: "" }))
                  }
                  className="text-red-500 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
            )}

            <div className="font-bold">Partner Description</div>
            <textarea
              className="w-full border p-2 rounded"
              placeholder="Partner Description"
              value={commissionForm.partnerDescription}
              onChange={(e) =>
                setCommissionForm((f) => ({
                  ...f,
                  partnerDescription: e.target.value,
                }))
              }
            />
            <div className="font-bold">Category</div>
            <select
              className="w-full border p-2 rounded"
              value={commissionForm.category}
              onChange={(e) =>
                setCommissionForm((f) => ({ ...f, category: e.target.value }))
              }
              required
            >
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="file"
              accept="image/*"
              multiple
              id="commission-product-images"
              onChange={handleImageChange}
              className="w-full border p-2 rounded"
            />

            {/* Preview of selected files */}
            {selectedFilesCount > 0 && (
              <div className="bg-gray-50 p-3 rounded border">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Selected Files ({selectedFilesCount}):
                </div>
                <div className="space-y-1">
                  {(() => {
                    let fileInput;
                    if (activeTab === "commission") {
                      fileInput = document.getElementById(
                        "commission-product-images"
                      );
                    } else {
                      fileInput = document.querySelector('input[type="file"]');
                    }
                    return fileInput && fileInput.files
                      ? Array.from(fileInput.files).map((file, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            📷 {file.name} (
                            {(file.size / 1024 / 1024).toFixed(2)} MB)
                          </div>
                        ))
                      : [];
                  })()}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleImageUpload}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              disabled={selectedFilesCount === 0}
            >
              Upload{" "}
              {selectedFilesCount > 0
                ? `${selectedFilesCount} Images`
                : "Images"}
            </button>
            {imageUrls.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {imageUrls.map((url, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={getImageUrl(url)}
                      alt="Preview"
                      width={60}
                      loading="lazy"
                      decoding="async"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      onClick={() =>
                        setImageUrls((prev) => prev.filter((u, i) => i !== idx))
                      }
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Commission Product
            </button>
          </form>
          {commissionLoading ? (
            <p>Loading commission products...</p>
          ) : (
            <ul className="space-y-2">
              {commissionProducts.map((p) => (
                <li
                  key={p._id}
                  className="flex justify-between items-center border p-2 rounded"
                >
                  {editId === p._id ? (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                          const updateData = {
                            name: editForm.name,
                            price: parseFloat(editForm.price),
                            originalPrice: editForm.originalPrice
                              ? parseFloat(editForm.originalPrice)
                              : undefined,
                            isDiscounted: editForm.isDiscounted,
                            discountLabel: editForm.discountLabel,
                            description: editForm.description,
                            zustand: editForm.zustand,
                            width: editForm.width,
                            depth: editForm.depth,
                            height: editForm.height,
                            brand: editForm.brand,
                            model: editForm.model,
                            color: editForm.color,
                            material: editForm.material,
                            pattern: editForm.pattern,
                            image:
                              (editForm.images && editForm.images[0]) ||
                              p.image,
                            images: editForm.images || [],
                          };
                          await apiFetch(`/commission/${p._id}`, {
                            method: "PUT",
                            body: JSON.stringify(updateData),
                          });
                          setEditId(null);
                          fetchCommissionProducts();
                        } catch {
                          setError("Error editing commission product");
                        }
                      }}
                      className="flex flex-col gap-1 w-full"
                    >
                      <input
                        className="border p-1 rounded"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, name: e.target.value }))
                        }
                        required
                      />
                      <input
                        className="border p-1 rounded"
                        placeholder="Current Price (Lower Price)"
                        type="number"
                        value={editForm.price}
                        onChange={(e) => {
                          const newPrice = e.target.value;
                          setEditForm((f) => ({
                            ...f,
                            price: newPrice,
                            // اگر قیمت جدید کمتر از قیمت اصلی باشه، قیمت اصلی رو به‌روزرسانی کن
                            originalPrice:
                              f.originalPrice &&
                              parseFloat(newPrice) < parseFloat(f.originalPrice)
                                ? f.originalPrice
                                : f.price || f.originalPrice,
                          }));
                        }}
                        required
                      />
                      <input
                        className="border p-1 rounded"
                        placeholder="Original Price (Higher Price)"
                        type="number"
                        value={editForm.originalPrice}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            originalPrice: e.target.value,
                          }))
                        }
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isDiscounted"
                          checked={editForm.isDiscounted}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              isDiscounted: e.target.checked,
                            }))
                          }
                          className="w-4 h-4"
                        />
                        <label htmlFor="isDiscounted" className="font-bold">
                          Mark as Discounted
                        </label>
                      </div>

                      {editForm.isDiscounted && (
                        <>
                          <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded border">
                            💡 <strong>How to set discounted price:</strong>
                            <br />
                            1. Original Price: Keep the current/higher price
                            (will be crossed out)
                            <br />
                            2. Current Price: Enter the new/lower price (what
                            customer pays)
                            <br />
                            Example: Original: €15.99, Current: €12.99
                          </div>
                          <input
                            className="border p-1 rounded"
                            placeholder="Discount Label (e.g., Last Chance)"
                            value={editForm.discountLabel}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                discountLabel: e.target.value,
                              }))
                            }
                          />
                        </>
                      )}

                      <textarea
                        className="border p-1 rounded"
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            description: e.target.value,
                          }))
                        }
                      />
                      <select
                        className="border p-1 rounded"
                        value={editForm.zustand}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            zustand: e.target.value,
                          }))
                        }
                        required
                      >
                        <option value="">Select Zustand</option>
                        <option value="New">New</option>
                        <option value="Like New">Like New</option>
                        <option value="Very Good">Very Good</option>
                        <option value="Good">Good</option>
                        <option value="Acceptable">Acceptable</option>
                        <option value="For Parts / Not Working">
                          For Parts / Not Working
                        </option>
                      </select>
                      <div className="flex gap-2">
                        <input
                          className="border p-1 rounded w-1/3"
                          placeholder="Width"
                          type="number"
                          value={editForm.width}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              width: e.target.value,
                            }))
                          }
                        />
                        <input
                          className="border p-1 rounded w-1/3"
                          placeholder="Depth"
                          type="number"
                          value={editForm.depth}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              depth: e.target.value,
                            }))
                          }
                        />
                        <input
                          className="border p-1 rounded w-1/3"
                          placeholder="Height"
                          type="number"
                          value={editForm.height}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              height: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <input
                        className="border p-1 rounded"
                        placeholder="Brand"
                        value={editForm.brand}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, brand: e.target.value }))
                        }
                      />
                      <input
                        className="border p-1 rounded"
                        placeholder="Model"
                        value={editForm.model}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, model: e.target.value }))
                        }
                      />
                      <input
                        className="border p-1 rounded"
                        placeholder="Color"
                        value={editForm.color}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, color: e.target.value }))
                        }
                      />
                      <input
                        className="border p-1 rounded"
                        placeholder="Material"
                        value={editForm.material}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            material: e.target.value,
                          }))
                        }
                      />
                      <input
                        className="border p-1 rounded"
                        placeholder="Pattern"
                        value={editForm.pattern}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            pattern: e.target.value,
                          }))
                        }
                      />
                      {/* Image upload for edit */}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={async (e) => {
                          const files = Array.from(e.target.files);
                          for (const file of files) {
                            const formData = new FormData();
                            formData.append("image", file);
                            const res = await fetch(
                              BASE_URL + "/products/upload",
                              {
                                method: "POST",
                                headers: {
                                  Authorization: `Bearer ${localStorage.getItem(
                                    "token"
                                  )}`,
                                },
                                body: formData,
                              }
                            );
                            const data = await res.json();
                            setEditForm((f) => ({
                              ...f,
                              images: [...(f.images || []), data.imageUrl],
                            }));
                          }
                        }}
                      />
                      {editForm.images && editForm.images.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {editForm.images.map((url, idx) => (
                            <div key={idx} className="relative">
                              <img
                                src={getImageUrl(url)}
                                alt="Preview"
                                width={60}
                              />
                              <button
                                type="button"
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                onClick={() =>
                                  setEditForm((f) => ({
                                    ...f,
                                    images: f.images.filter(
                                      (u, i) => i !== idx
                                    ),
                                  }))
                                }
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2 mt-1">
                        <button
                          type="submit"
                          className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="bg-gray-300 px-2 py-1 rounded"
                          onClick={() => setEditId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div>
                        <b>{p.name}</b> -
                        {p.isDiscounted && p.originalPrice ? (
                          <div className="flex flex-col gap-1">
                            <span className="line-through text-red-500">
                              €{p.originalPrice}
                            </span>
                            <span className="text-green-600 font-bold">
                              €{p.price}
                            </span>
                            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">
                              {p.discountLabel}
                            </span>
                          </div>
                        ) : (
                          <span>€{p.price}</span>
                        )}
                        <div className="text-sm text-gray-500">
                          Partner: {p.partnerName}
                        </div>
                        <div className="text-sm text-gray-500">
                          Commission: {p.commissionRate}%
                        </div>
                        {p.partnerLogo && (
                          <img
                            src={getImageUrl(p.partnerLogo)}
                            alt={p.partnerName}
                            width={60}
                          />
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditId(p._id);
                            setEditForm({
                              name: p.name,
                              price: p.price, // این قیمت فعلی می‌مونه
                              originalPrice: p.originalPrice || p.price, // اگر originalPrice نداشته باشه، قیمت فعلی رو به عنوان قیمت اصلی قرار بده
                              isDiscounted: p.isDiscounted || false,
                              discountLabel: p.discountLabel || "Last Chance",
                              description: p.description,
                              zustand: p.zustand || "",
                              width: p.width || "",
                              depth: p.depth || "",
                              height: p.height || "",
                              brand: p.brand || "",
                              model: p.model || "",
                              color: p.color || "",
                              material: p.material || "",
                              pattern: p.pattern || "",
                              images: p.images || [],
                            });
                          }}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </>
      )}
    </div>
  );
}
