import React, { useState, useEffect } from "react";
import { apiFetch } from "../lib/api";
import { getImageUrl } from "../lib/api";

export default function Affiliates() {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAffiliates();
  }, []);

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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchAffiliates}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Affiliates
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our valuable affiliate partners who share our commitment to
            sustainable and quality products.
          </p>
        </div>

        {affiliates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No affiliates available yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {affiliates.map((affiliate) => (
              <div
                key={affiliate._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
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
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {affiliate.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {affiliate.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {affiliate.category === "education" && "🎓 Education"}
                      {affiliate.category === "natural_products" &&
                        "🌿 Natural Products"}
                      {affiliate.category === "fashion" && "👗 Fashion"}
                      {affiliate.category === "health_wellness" &&
                        "💪 Health & Wellness"}
                      {affiliate.category === "beauty" && "💄 Beauty"}
                      {affiliate.category === "sustainability" &&
                        "🌱 Sustainability"}
                      {affiliate.category === "other" && "🔗 Other"}
                    </span>
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


