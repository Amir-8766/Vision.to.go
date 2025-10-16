import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL, getImageUrl } from "../lib/api";
import ProductCard from "../components/ProductCard";

export default function Commission() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/commission`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching commission products:", error);
    } finally {
      setLoading(false);
    }
  };

  const uniquePartners = [...new Set(products.map((p) => p.partnerName))];
  const filteredProducts =
    selectedPartner === "all"
      ? products
      : products.filter((p) => p.partnerName === selectedPartner);

  const handlePartnerSelect = (partner) => {
    setSelectedPartner(partner);
    setIsDropdownOpen(false);
  };

  const getSelectedPartnerInfo = () => {
    if (selectedPartner === "all") {
      return {
        name: "Alle Partner",
        count: products.length,
        logo: null,
      };
    }

    const partnerProducts = products.filter(
      (p) => p.partnerName === selectedPartner
    );
    return {
      name: selectedPartner,
      count: partnerProducts.length,
      logo: partnerProducts[0]?.partnerLogo,
    };
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const selectedInfo = getSelectedPartnerInfo();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Kommissions-Neuware
        </h1>
        <p className="text-lg text-[#171717]">
          Entdecken Sie neue Produkte unserer Partner mit attraktiven
          Kommissionspreisen
        </p>
      </div>

      {/* Partner Dropdown */}
      <div className="mb-8 flex justify-center">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-shadow duration-200 min-w-[200px]"
          >
            {/* Partner Logo or Icon */}
            <div className="flex items-center gap-2">
              {selectedInfo.logo ? (
                <img
                  src={getImageUrl(selectedInfo.logo)}
                  alt={selectedInfo.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <span className="text-lg">
                  {selectedPartner === "all" ? "🏪" : "🏢"}
                </span>
              )}
              <span className="font-medium text-gray-900">
                {selectedInfo.name}
              </span>
            </div>

            {/* Count Badge */}
            <span className="bg-gray-100 text-[#171717] px-2 py-1 rounded-full text-sm font-medium">
              {selectedInfo.count}
            </span>

            {/* Dropdown Arrow */}
            <svg
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              {/* All Partners Option */}
              <button
                onClick={() => handlePartnerSelect("all")}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 ${
                  selectedPartner === "all"
                    ? "bg-pink-50 text-pink-600"
                    : "text-gray-900"
                }`}
              >
                <span className="text-lg">🏪</span>
                <div className="flex-1">
                  <div className="font-medium">Alle Partner</div>
                  <div className="text-sm text-gray-500">
                    {products.length} Produkte
                  </div>
                </div>
                {selectedPartner === "all" && (
                  <svg
                    className="w-4 h-4 text-pink-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>

              {/* Divider */}
              <div className="border-t border-gray-100"></div>

              {/* Individual Partners */}
              {uniquePartners.map((partner) => {
                const partnerProducts = products.filter(
                  (p) => p.partnerName === partner
                );
                const partnerLogo = partnerProducts[0]?.partnerLogo;
                const isSelected = selectedPartner === partner;

                return (
                  <button
                    key={partner}
                    onClick={() => handlePartnerSelect(partner)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 ${
                      isSelected ? "bg-pink-50 text-pink-600" : "text-gray-900"
                    }`}
                  >
                    {partnerLogo ? (
                      <img
                        src={getImageUrl(partnerLogo)}
                        alt={partner}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-lg">🏢</span>
                    )}
                    <div className="flex-1">
                      <div className="font-medium">{partner}</div>
                      <div className="text-sm text-gray-500">
                        {partnerProducts.length} Produkte
                      </div>
                    </div>
                    {isSelected && (
                      <svg
                        className="w-4 h-4 text-pink-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Tab Content Indicator */}
      <div className="mb-6 text-center">
        <p className="text-sm text-[#171717]">
          {selectedPartner === "all"
            ? `Zeige alle ${products.length} Produkte von ${uniquePartners.length} Partnern`
            : `Zeige ${filteredProducts.length} Produkte von ${selectedPartner}`}
        </p>
      </div>

      {/* Products Grid - Using ProductCard Component */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Keine Produkte gefunden
          </h3>
          <p className="text-gray-500">
            {selectedPartner === "all"
              ? "Es sind derzeit keine Kommissionsprodukte verfügbar."
              : `Keine Produkte für ${selectedPartner} gefunden.`}
          </p>
        </div>
      )}
    </div>
  );
}
