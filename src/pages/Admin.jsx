import React, { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { BASE_URL } from "../lib/api";
import { getImageUrl } from "../lib/api";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [commissionProducts, setCommissionProducts] = useState([]);
  const [affiliatesAdmin, setAffiliatesAdmin] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commissionLoading, setCommissionLoading] = useState(true);
  const [affiliatesLoading, setAffiliatesLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("products"); // "products" | "commission" | "affiliates" | "slider"
  const [sliderImagesAdmin, setSliderImagesAdmin] = useState([]);
  const [sliderForm, setSliderForm] = useState({
    imageUrl: "",
    title: "",
    alt: "",
    order: 0,
    isActive: true,
  });
  const [multipleFiles, setMultipleFiles] = useState([]);
  const [uploadingMultiple, setUploadingMultiple] = useState(false);
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

  // Affiliates admin forms
  const [affiliateForm, setAffiliateForm] = useState({
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
  const [affiliateEditId, setAffiliateEditId] = useState(null);
  const [affiliateEditForm, setAffiliateEditForm] = useState({
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
    fetchAffiliatesAdmin();
    fetchSliderAdmin();
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

  // Affiliates admin
  async function fetchAffiliatesAdmin() {
    setAffiliatesLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await apiFetch("/partners/admin", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load affiliates");
      setAffiliatesAdmin(data);
    } catch (err) {
      setError("Error fetching affiliates");
    } finally {
      setAffiliatesLoading(false);
    }
  }

  async function handleAddAffiliate(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...affiliateForm,
        logo: affiliateForm.logo,
        featuredImage: affiliateForm.featuredImage,
        services: affiliateForm.services
          ? affiliateForm.services.split(",").map((s) => s.trim())
          : [],
      };
      const res = await apiFetch("/partners", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add affiliate");
      setAffiliateForm({
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
      fetchAffiliatesAdmin();
    } catch (err) {
      setError("Error adding affiliate");
    }
  }

  async function handleUpdateAffiliate(id) {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...affiliateEditForm,
        logo: affiliateEditForm.logo,
        featuredImage: affiliateEditForm.featuredImage,
        services: affiliateEditForm.services
          ? affiliateEditForm.services.split(",").map((s) => s.trim())
          : [],
      };
      const res = await apiFetch(`/partners/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update affiliate");
      setAffiliateEditId(null);
      fetchAffiliatesAdmin();
    } catch (err) {
      setError("Error updating affiliate");
    }
  }

  async function handleDeleteAffiliate(id) {
    if (!window.confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await apiFetch(`/partners/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to delete affiliate");
      fetchAffiliatesAdmin();
    } catch (err) {
      setError("Error deleting affiliate");
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

        const res = await fetch(BASE_URL + "/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        });
        if (!res.ok) {
          let message = `Failed to upload ${file.name}`;
          try {
            const errJson = await res.json();
            message = errJson?.error || message;
          } catch {}
          throw new Error(message);
        }
        const data = await res.json();
        const url = data.imageUrl || data.path;
        if (url) setImageUrls((prev) => [...prev, url]);
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

  async function fetchSliderAdmin() {
    try {
      const res = await apiFetch("/slider");
      const data = await res.json();
      setSliderImagesAdmin(data);
    } catch (err) {
      // noop
    }
  }

  async function handleCreateSliderImage(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await apiFetch("/slider", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(sliderForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add slider image");
      setSliderForm({
        imageUrl: "",
        title: "",
        alt: "",
        order: 0,
        isActive: true,
      });
      fetchSliderAdmin();
    } catch (err) {
      setError("Error adding slider image");
    }
  }

  async function handleAddSliderImage(imageData) {
    try {
      const token = localStorage.getItem("token");
      const res = await apiFetch("/slider", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(imageData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add slider image");
      return data;
    } catch (err) {
      console.error("Error adding slider image:", err);
      throw err;
    }
  }

  async function handleUpdateSliderImage(id, payload) {
    try {
      const token = localStorage.getItem("token");
      const res = await apiFetch(`/slider/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to update slider image");
      fetchSliderAdmin();
    } catch (err) {
      setError("Error updating slider image");
    }
  }

  async function handleDeleteSliderImage(id) {
    if (!window.confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await apiFetch(`/slider/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      fetchSliderAdmin();
    } catch (err) {
      setError("Error deleting slider image");
    }
  }

  async function handleUploadToCloudinary(file, setField) {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`${BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (res.ok && data.imageUrl) {
      setField(data.imageUrl);
    } else if (res.ok && data.path) {
      setField(data.path);
    }
  }

  async function handleMultipleFileUpload(files) {
    setUploadingMultiple(true);
    const uploadPromises = Array.from(files).map(async (file, index) => {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        return {
          imageUrl: data.imageUrl || data.path,
          title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
          alt: file.name.replace(/\.[^/.]+$/, ""),
          order: sliderImagesAdmin.length + index,
          isActive: true,
        };
      }
      return null;
    });

    try {
      const results = await Promise.all(uploadPromises);
      const validResults = results.filter(Boolean);

      // Upload all valid images to slider API
      for (const imageData of validResults) {
        await handleAddSliderImage(imageData);
      }

      setMultipleFiles([]);
      fetchSliderAdmin();
    } catch (error) {
      console.error("Multiple upload error:", error);
      setError("Error uploading multiple files");
    } finally {
      setUploadingMultiple(false);
    }
  }

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
          onClick={() => setActiveTab("affiliates")}
          className={`px-4 py-2 rounded ${
            activeTab === "affiliates"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Affiliates
        </button>
        <button
          onClick={() => setActiveTab("slider")}
          className={`px-4 py-2 rounded ${
            activeTab === "slider"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Slider
        </button>
      </div>

      {activeTab === "products" && (
        <>
          <form onSubmit={handleAdd} className="mb-6 space-y-2">
            <div className="font-bold text-gray-800">Product Name</div>
            <input
              className="w-full border p-2 rounded"
              placeholder="Product Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />

            <div className="font-bold text-gray-800">
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

            <div className="font-bold text-gray-800">
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
                className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isDiscounted" className="font-bold text-gray-800">
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
                <div className="font-bold text-gray-800">Discount Label</div>
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

            <div className="font-bold text-gray-800">Description</div>
            <textarea
              className="w-full border p-2 rounded"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />

            <div className="font-bold text-gray-800">Zustand</div>
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

            <div className="font-bold text-gray-800">Size (cm)</div>
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

            <div className="font-bold text-gray-800">Details</div>
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
                          className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
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
                            const res = await fetch(BASE_URL + "/upload", {
                              method: "POST",
                              headers: {
                                Authorization: `Bearer ${localStorage.getItem(
                                  "token"
                                )}`,
                              },
                              body: formData,
                            });
                            if (!res.ok) {
                              let message = "Upload failed";
                              try {
                                const j = await res.json();
                                message = j?.error || message;
                              } catch {}
                              throw new Error(message);
                            }
                            const data = await res.json();
                            const url = data.imageUrl || data.path;
                            if (url) {
                              setEditForm((f) => ({
                                ...f,
                                images: [...(f.images || []), url],
                              }));
                            }
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
            <div className="font-bold text-gray-800">
              Commission Product Name
            </div>
            <input
              className="w-full border p-2 rounded"
              placeholder="Commission Product Name"
              value={commissionForm.name}
              onChange={(e) =>
                setCommissionForm((f) => ({ ...f, name: e.target.value }))
              }
              required
            />
            <div className="font-bold text-gray-800">
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
            <div className="font-bold text-gray-800">
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
                className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isDiscounted" className="font-bold text-gray-800">
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
                <div className="font-bold text-gray-800">Discount Label</div>
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

            <div className="font-bold text-gray-800">
              Commission Rate (e.g., 30 for 30%)
            </div>
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

            <div className="font-bold text-gray-800">Partner Name</div>
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

            <div className="font-bold text-gray-800">Partner Description</div>
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

            <div className="font-bold text-gray-800">Partner Logo</div>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files && e.target.files[0];
                if (!file) return;
                const formData = new FormData();
                formData.append("image", file);
                const res = await fetch(BASE_URL + "/upload", {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                  body: formData,
                });
                const data = await res.json();
                const url = data.imageUrl || data.path;
                if (url) setCommissionForm((f) => ({ ...f, partnerLogo: url }));
              }}
              className="w-full border p-2 rounded"
            />
            {commissionForm.partnerLogo && (
              <img
                src={getImageUrl(commissionForm.partnerLogo)}
                alt="Partner Logo preview"
                className="w-16 h-16 object-cover rounded border mt-2"
              />
            )}

            <div className="font-bold text-gray-800">Category</div>
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
                          className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
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
                            const res = await fetch(BASE_URL + "/upload", {
                              method: "POST",
                              headers: {
                                Authorization: `Bearer ${localStorage.getItem(
                                  "token"
                                )}`,
                              },
                              body: formData,
                            });
                            if (!res.ok) {
                              let message = "Upload failed";
                              try {
                                const j = await res.json();
                                message = j?.error || message;
                              } catch {}
                              throw new Error(message);
                            }
                            const data = await res.json();
                            const url = data.imageUrl || data.path;
                            if (url) {
                              setEditForm((f) => ({
                                ...f,
                                images: [...(f.images || []), url],
                              }));
                            }
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

      {activeTab === "affiliates" && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-bold text-green-800 mb-4">
            ✅ Affiliates Management
          </h3>

          <div className="bg-white p-4 rounded border">
            <h4 className="font-bold mb-3">Add New Affiliate</h4>
            <form onSubmit={handleAddAffiliate} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">
                  Name *
                </label>
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Enter affiliate name"
                  value={affiliateForm.name}
                  onChange={(e) =>
                    setAffiliateForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">
                  Website *
                </label>
                <input
                  className="w-full border p-2 rounded"
                  placeholder="https://example.com"
                  value={affiliateForm.website}
                  onChange={(e) =>
                    setAffiliateForm((f) => ({
                      ...f,
                      website: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">
                  Description *
                </label>
                <textarea
                  className="w-full border p-2 rounded"
                  placeholder="Brief description"
                  rows={3}
                  value={affiliateForm.description}
                  onChange={(e) =>
                    setAffiliateForm((f) => ({
                      ...f,
                      description: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">
                  Category *
                </label>
                <select
                  className="w-full border p-2 rounded"
                  value={affiliateForm.category}
                  onChange={(e) =>
                    setAffiliateForm((f) => ({
                      ...f,
                      category: e.target.value,
                    }))
                  }
                  required
                >
                  <option value="education">🎓 Education</option>
                  <option value="natural_products">🌿 Natural Products</option>
                  <option value="fashion">👗 Fashion</option>
                  <option value="health_wellness">💪 Health & Wellness</option>
                  <option value="beauty">💄 Beauty</option>
                  <option value="sustainability">🌱 Sustainability</option>
                  <option value="other">🔗 Other</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="affiliate-active"
                  checked={affiliateForm.isActive}
                  onChange={(e) =>
                    setAffiliateForm((f) => ({
                      ...f,
                      isActive: e.target.checked,
                    }))
                  }
                  className="rounded"
                />
                <label
                  htmlFor="affiliate-active"
                  className="text-sm font-medium"
                >
                  Active (visible on website)
                </label>
              </div>

              {/* Logo upload */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">
                  Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files && e.target.files[0];
                    if (!file) return;
                    const formData = new FormData();
                    formData.append("image", file);
                    const res = await fetch(BASE_URL + "/upload", {
                      method: "POST",
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "token"
                        )}`,
                      },
                      body: formData,
                    });
                    const data = await res.json();
                    const url = data.imageUrl || data.path;
                    if (url) setAffiliateForm((f) => ({ ...f, logo: url }));
                  }}
                  className="w-full border p-2 rounded"
                />
                {affiliateForm.logo && (
                  <img
                    src={getImageUrl(affiliateForm.logo)}
                    alt="Logo preview"
                    className="w-16 h-16 object-cover rounded border mt-2"
                  />
                )}
              </div>

              {/* Featured image upload (optional) */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">
                  Featured Image (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files && e.target.files[0];
                    if (!file) return;
                    const formData = new FormData();
                    formData.append("image", file);
                    const res = await fetch(BASE_URL + "/upload", {
                      method: "POST",
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "token"
                        )}`,
                      },
                      body: formData,
                    });
                    const data = await res.json();
                    const url = data.imageUrl || data.path;
                    if (url)
                      setAffiliateForm((f) => ({
                        ...f,
                        featuredImage: url,
                      }));
                  }}
                  className="w-full border p-2 rounded"
                />
                {affiliateForm.featuredImage && (
                  <img
                    src={getImageUrl(affiliateForm.featuredImage)}
                    alt="Featured preview"
                    className="w-24 h-16 object-cover rounded border mt-2"
                  />
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 font-medium"
              >
                Add Affiliate
              </button>
            </form>
          </div>

          <div className="bg-white p-4 rounded border mt-4">
            <h4 className="font-bold mb-3">
              Current Affiliates ({affiliatesAdmin.length})
            </h4>

            {affiliatesLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">
                  Loading affiliates...
                </span>
              </div>
            ) : affiliatesAdmin.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <p>No affiliates found.</p>
                <p className="text-sm">
                  Add your first affiliate using the form above.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {affiliatesAdmin.map((affiliate) => (
                  <div
                    key={affiliate._id}
                    className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-800">
                          {affiliate.name}
                        </h5>
                        <p className="text-sm text-gray-600 mt-1">
                          {affiliate.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {affiliate.category}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              affiliate.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {affiliate.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <a
                          href={affiliate.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm mt-1 block"
                        >
                          {affiliate.website}
                        </a>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => {
                            setAffiliateEditId(affiliate._id);
                            setAffiliateEditForm({
                              name: affiliate.name || "",
                              description: affiliate.description || "",
                              website: affiliate.website || "",
                              instagram: affiliate.instagram || "",
                              category: affiliate.category || "education",
                              services: (affiliate.services || []).join(", "),
                              partnershipType:
                                affiliate.partnershipType ||
                                "geschaeftspartner",
                              isActive: affiliate.isActive !== false,
                              logo: affiliate.logo || "",
                              featuredImage: affiliate.featuredImage || "",
                            });
                          }}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAffiliate(affiliate._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>
      )}

      {activeTab === "slider" && (
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            Manage Slider Images
          </h2>
          <form onSubmit={handleCreateSliderImage} className="space-y-3 mb-6">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Image URL"
                value={sliderForm.imageUrl}
                onChange={(e) =>
                  setSliderForm({ ...sliderForm, imageUrl: e.target.value })
                }
                className="border p-2 flex-1"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files?.[0] &&
                  handleUploadToCloudinary(e.target.files[0], (url) =>
                    setSliderForm({ ...sliderForm, imageUrl: url })
                  )
                }
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <input
                className="border p-2"
                placeholder="Title"
                value={sliderForm.title}
                onChange={(e) =>
                  setSliderForm({ ...sliderForm, title: e.target.value })
                }
              />
              <input
                className="border p-2"
                placeholder="Alt"
                value={sliderForm.alt}
                onChange={(e) =>
                  setSliderForm({ ...sliderForm, alt: e.target.value })
                }
              />
              <input
                className="border p-2"
                type="number"
                placeholder="Order"
                value={sliderForm.order}
                onChange={(e) =>
                  setSliderForm({
                    ...sliderForm,
                    order: Number(e.target.value),
                  })
                }
              />
            </div>
            <label className="inline-flex items-center gap-2 text-gray-800">
              <input
                type="checkbox"
                checked={sliderForm.isActive}
                onChange={(e) =>
                  setSliderForm({ ...sliderForm, isActive: e.target.checked })
                }
              />
              Active
            </label>
            <button
              type="submit"
              className="bg-pink-600 text-white px-4 py-2 rounded ml-4"
            >
              Add Image
            </button>
          </form>

          {/* Multiple File Upload Section */}
          <div className="border-t pt-4 mt-6">
            <h3 className="text-md font-semibold mb-3">
              Upload Multiple Images
            </h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setMultipleFiles(Array.from(e.target.files));
                    }
                  }}
                  className="hidden"
                  id="multiple-file-input"
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById(
                      "multiple-file-input"
                    );
                    if (input) input.click();
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Choose Multiple Images
                </button>
                <button
                  type="button"
                  onClick={() => setMultipleFiles([])}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Clear Selection
                </button>
              </div>
              {multipleFiles.length > 0 && (
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600 mb-2">
                    Selected {multipleFiles.length} files:
                  </p>
                  <ul className="text-sm space-y-1">
                    {multipleFiles.map((file, index) => (
                      <li key={index} className="text-gray-700">
                        • {file.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                type="button"
                onClick={() =>
                  multipleFiles.length > 0 &&
                  handleMultipleFileUpload(multipleFiles)
                }
                disabled={multipleFiles.length === 0 || uploadingMultiple}
                className={`px-4 py-2 rounded mb-6 ${
                  multipleFiles.length === 0 || uploadingMultiple
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {uploadingMultiple
                  ? "Uploading..."
                  : `Upload ${multipleFiles.length} Images`}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {sliderImagesAdmin.map((img) => (
              <div
                key={img._id}
                className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-3">
                  <img
                    src={getImageUrl(img.imageUrl)}
                    alt={img.alt || img.title || "slider"}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </div>

                <div className="mb-3">
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Order:</span> {img.order}
                  </div>
                  <div className="text-sm">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        img.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {img.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className="px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      onClick={() =>
                        handleUpdateSliderImage(img._id, {
                          order: Math.max(0, (img.order || 0) - 1),
                        })
                      }
                    >
                      ↑ Up
                    </button>
                    <button
                      className="px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      onClick={() =>
                        handleUpdateSliderImage(img._id, {
                          order: (img.order || 0) + 1,
                        })
                      }
                    >
                      ↓ Down
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className={`px-3 py-2 text-xs rounded transition-colors ${
                        img.isActive
                          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                      onClick={() =>
                        handleUpdateSliderImage(img._id, {
                          isActive: !img.isActive,
                        })
                      }
                    >
                      {img.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      className="px-3 py-2 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                      onClick={() => handleDeleteSliderImage(img._id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
