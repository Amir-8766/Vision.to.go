import React, { useState, useEffect } from "react";
import { apiFetch } from "../lib/api";
import { getImageUrl } from "../lib/api";
import SEOHead from "../components/SEOHead";
import { PiInstagramLogoLight } from "react-icons/pi";

export default function Affiliates() {
  const [affiliates, setAffiliates] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offersLoading, setOffersLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    fetchAffiliates();
    fetchOffers();
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [selectedCategory, sortBy]);

  async function fetchAffiliates() {
    try {
      const res = await apiFetch("/partners");
      if (res.ok) {
        const data = await res.json();
        setAffiliates(data);
      } else {
        throw new Error("Failed to fetch affiliates");
      }
    } catch (err) {
      setError("Error loading affiliates");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchOffers() {
    try {
      setOffersLoading(true);
      const res = await apiFetch(
        `/partners/offers?category=${selectedCategory}&sortBy=${sortBy}&limit=12`
      );
      if (res.ok) {
        const data = await res.json();
        setOffers(data.offers);
      } else {
        throw new Error("Failed to fetch offers");
      }
    } catch (err) {
      console.error("Error fetching offers:", err);
    } finally {
      setOffersLoading(false);
    }
  }

  const handleOfferClick = async (offer) => {
    try {
      // Track the click
      await apiFetch("/partners/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offerId: offer.id,
          campaignId: offer.partner.toLowerCase(),
        }),
      });

      // Open the affiliate link
      window.open(offer.deepLink, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("Error tracking click:", err);
      // Still open the link even if tracking fails
      window.open(offer.deepLink, "_blank", "noopener,noreferrer");
    }
  };

  const categories = [
    { value: "all", label: "All Deals", icon: "🌟" },
    { value: "flights", label: "Flights", icon: "✈️" },
    { value: "hotels", label: "Hotels", icon: "🏨" },
    { value: "transport", label: "Transport", icon: "🚄" },
    { value: "packages", label: "Packages", icon: "🎁" },
  ];

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "discount", label: "Best Discount" },
    { value: "price", label: "Lowest Price" },
    { value: "commission", label: "Highest Commission" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading affiliates...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Affiliates & Partners - Vision To Go"
        description="Discover exclusive travel deals from our trusted affiliate partners. Find the best flight deals, hotel discounts, and travel packages."
        keywords="affiliate partners, travel deals, flight discounts, hotel deals, travel packages, commission"
      />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Travel Deals & Partners
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover exclusive travel deals from our trusted affiliate
              partners. Find the best flight deals, hotel discounts, and travel
              packages.
            </p>
          </div>

          {/* Top Deals Section */}
          <div className="mb-16">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
                🔥 Top Deals Today
              </h2>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === cat.value
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                      }`}
                    >
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>

                {/* Sort Options */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      Sort by: {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Offers Grid */}
            {offersLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
                  >
                    <div className="h-48 bg-gray-300"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded mb-4"></div>
                      <div className="h-8 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 relative"
                  >
                    {offer.featured && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                        🔥 FEATURED
                      </div>
                    )}

                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={offer.image}
                        alt={offer.title}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                      />
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                          {offer.partner}
                        </span>
                        <span className="text-sm text-gray-500">
                          {offer.category}
                        </span>
                      </div>

                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {offer.title}
                      </h3>

                      <p className="text-gray-600 mb-4 text-sm">
                        {offer.description}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-green-600">
                            €{offer.discountedPrice}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            €{offer.originalPrice}
                          </span>
                          <span className="text-sm font-bold text-red-600">
                            -{offer.discount}%
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {offer.commission}% commission
                        </span>
                      </div>

                      <button
                        onClick={() => handleOfferClick(offer)}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                      >
                        Get This Deal
                      </button>

                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Valid until{" "}
                        {new Date(offer.validUntil).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <hr className="my-16 border-gray-200" />

          {/* Traditional Partners Section */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Our Trusted Partners
            </h2>

            {error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchAffiliates}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            ) : affiliates.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No partners available yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {affiliates.map((affiliate) => (
                  <div
                    key={affiliate._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
                  >
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={getImageUrl(
                          affiliate.featuredImage || "/line-woman12.png"
                        )}
                        alt={affiliate.name}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {affiliate.name}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {affiliate.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {affiliate.category === "flights" && "✈️ Flights"}
                          {affiliate.category === "hotels" && "🏨 Hotels"}
                          {affiliate.category === "transport" && "🚄 Transport"}
                          {affiliate.category === "packages" && "🎁 Packages"}
                          {affiliate.category === "car_rental" &&
                            "🚗 Car Rental"}
                          {affiliate.category === "travel_insurance" &&
                            "🛡️ Travel Insurance"}
                          {affiliate.category === "activities" &&
                            "🎯 Activities & Tours"}
                          {affiliate.category === "other" && "🔗 Other"}
                        </span>
                        <div className="flex items-center gap-3">
                          {affiliate.instagram && (
                            <a
                              href={affiliate.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-pink-600 hover:text-pink-800 text-lg"
                              title="Follow on Instagram"
                            >
                              <PiInstagramLogoLight />
                            </a>
                          )}
                          {affiliate.website && (
                            <a
                              href={affiliate.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Visit Website
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
