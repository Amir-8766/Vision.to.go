import React, { useEffect, useState } from "react";
import { PiInstagramLogoLight } from "react-icons/pi";
import { Link } from "react-router-dom";
import SEOHead from "../components/SEOHead";
import { apiFetch } from "../lib/api";
import OptimizedImage from "../components/OptimizedImage";
import LazyWrapper from "../components/LazyWrapper";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Partners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    fetchPartners();
    fetchCategories();
    fetchTypes();
  }, [selectedCategory, selectedType, searchTerm]);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== "all")
        params.append("category", selectedCategory);
      if (selectedType !== "all")
        params.append("partnershipType", selectedType);
      if (searchTerm) params.append("search", searchTerm);

      const res = await apiFetch(`/partners?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPartners(data);
      }
    } catch (error) {
      console.error("Error fetching partners:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await apiFetch("/partners/categories/list");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchTypes = async () => {
    try {
      const res = await apiFetch("/partners/types/list");
      if (res.ok) {
        const data = await res.json();
        setTypes(data);
      }
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPartners();
  };

  const getCategoryIcon = (category) => {
    const categoryData = categories.find((cat) => cat.value === category);
    return categoryData ? categoryData.icon : "🔗";
  };

  const getCategoryLabel = (category) => {
    const categoryData = categories.find((cat) => cat.value === category);
    return categoryData ? categoryData.label : category;
  };

  const getTypeIcon = (type) => {
    const typeData = types.find((t) => t.value === type);
    return typeData ? typeData.icon : "🤝";
  };

  const getTypeLabel = (type) => {
    const typeData = types.find((t) => t.value === type);
    return typeData ? typeData.label : type;
  };

  return (
    <>
      <SEOHead
        title="Geschäftspartner & Synergin - The Grrrls Club"
        description="Entdecken Sie unsere Geschäftspartner und Synergin, die nachhaltige und natürliche Produkte und Dienstleistungen anbieten."
        keywords="Geschäftspartner, Synergin, Nachhaltigkeit, Naturprodukte, Partnerschaften"
      />

      <main id="main-content" className="min-h-screen bg-white">
        {/* Header Section */}
        <section className="bg-[#849c22] text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Geschäftspartner & Synergin
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Entdecken Sie unsere wertvollen Partner, die nachhaltige und
              natürliche Lösungen anbieten
            </p>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8" style={{ backgroundColor: "#ffffff" }}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSearch} className="mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Partner suchen..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-[#849c22] focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#849c22] text-white rounded-lg hover:bg-[#6b7e1c] transition-colors"
                  >
                    Suchen
                  </button>
                </div>
              </form>

              <div className="flex flex-wrap gap-4 justify-center">
                {/* Category Filter */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Kategorie
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-[#849c22]"
                  >
                    <option className="bg-white text-gray-900" value="all">
                      Alle Kategorien
                    </option>
                    {categories.map((category) => (
                      <option
                        className="bg-white text-gray-900"
                        key={category.value}
                        value={category.value}
                      >
                        {category.icon} {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type Filter */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Typ
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-[#849c22]"
                  >
                    <option className="bg-white text-gray-900" value="all">
                      Alle Typen
                    </option>
                    {types.map((type) => (
                      <option
                        className="bg-white text-gray-900"
                        key={type.value}
                        value={type.value}
                      >
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partners Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex justify-center">
                <LoadingSpinner />
              </div>
            ) : partners.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-2xl font-semibold text-[#171717] mb-4">
                  Keine Partner gefunden
                </h3>
                <p className="text-[#171717]">
                  Versuchen Sie andere Suchkriterien oder Filter.
                </p>
              </div>
            ) : (
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                style={{ alignItems: "stretch" }}
              >
                {partners.map((partner) => (
                  <LazyWrapper key={partner._id}>
                    <div
                      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}
                    >
                      {/* Partner Image */}
                      <div className="h-48 bg-[#eef5db] flex items-center justify-center overflow-hidden p-4">
                        {partner.logo || partner.featuredImage ? (
                          <OptimizedImage
                            src={partner.logo || partner.featuredImage}
                            alt={partner.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <div className="text-6xl">
                            {getCategoryIcon(partner.category)}
                          </div>
                        )}
                      </div>

                      {/* Partner Content */}
                      <div
                        className="p-6 flex flex-col flex-1"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          flex: "1",
                        }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#eef5db] text-[#849c22]">
                            {getCategoryIcon(partner.category)}{" "}
                            {getCategoryLabel(partner.category)}
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {getTypeIcon(partner.partnershipType)}{" "}
                            {getTypeLabel(partner.partnershipType)}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {partner.name}
                        </h3>

                        <p
                          className="text-[#171717] mb-4 line-clamp-3"
                          style={{ height: "4.5rem", overflow: "hidden" }}
                        >
                          {partner.description}
                        </p>

                        {/* Services */}
                        <div
                          className="mb-4"
                          style={{ height: "3rem", overflow: "hidden" }}
                        >
                          {partner.services && partner.services.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                Services:
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {partner.services
                                  .slice(0, 3)
                                  .map((service, index) => (
                                    <span
                                      key={index}
                                      className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                                    >
                                      {service}
                                    </span>
                                  ))}
                                {partner.services.length > 3 && (
                                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                    +{partner.services.length - 3} mehr
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Special Offers */}
                        <div
                          className="mb-4"
                          style={{ height: "2rem", overflow: "hidden" }}
                        >
                          {partner.specialOffers && (
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <p className="text-sm text-yellow-800">
                                <strong>Angebot:</strong>{" "}
                                {partner.specialOffers}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Contact Info */}
                        <div
                          className="space-y-2 text-sm text-[#171717]"
                          style={{ height: "3rem", overflow: "hidden" }}
                        >
                          {partner.contactInfo?.phone && (
                            <p>📞 {partner.contactInfo.phone}</p>
                          )}
                          {partner.contactInfo?.address && (
                            <p>📍 {partner.contactInfo.address}</p>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div
                          className="mt-auto pt-4 flex gap-3"
                          style={{
                            marginTop: "auto",
                            paddingTop: "1rem",
                            display: "flex",
                            gap: "0.75rem",
                          }}
                        >
                          <a
                            href={partner.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-[#849c22] text-white text-center py-2 px-4 rounded-lg hover:bg-[#6b7e1c] transition-colors"
                          >
                            Website besuchen
                          </a>
                          {partner.instagram && (
                            <a
                              href={partner.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                              aria-label="Instagram"
                            >
                              <PiInstagramLogoLight size={22} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </LazyWrapper>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#849c22] text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Möchten Sie unser Partner werden?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Kontaktieren Sie uns für eine Partnerschaft
            </p>
            <Link
              to="/contact"
              className="inline-block bg-white text-[#849c22] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Kontakt aufnehmen
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
