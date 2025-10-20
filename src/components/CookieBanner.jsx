import React, { useState, useEffect } from "react";
import { FaPlane, FaTimes, FaCog } from "react-icons/fa";

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [cookieSettings, setCookieSettings] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const cookiesAccepted = localStorage.getItem("cookiesAccepted");
    if (!cookiesAccepted) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("cookiesAccepted", "all");
    localStorage.setItem("cookieSettings", JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    }));
    setShowBanner(false);
  };

  const handleNecessaryOnly = () => {
    localStorage.setItem("cookiesAccepted", "necessary");
    localStorage.setItem("cookieSettings", JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    }));
    setShowBanner(false);
  };

  const handleCustomSettings = () => {
    localStorage.setItem("cookiesAccepted", "custom");
    localStorage.setItem("cookieSettings", JSON.stringify(cookieSettings));
    setShowBanner(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-blue-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          {/* Travel Icon */}
          <div className="flex-shrink-0">
            <FaPlane className="text-blue-600 text-3xl" />
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Enhance Your Travel Experience
            </h3>
            <p className="text-sm text-gray-700 mb-3">
              We use cookies and similar technologies to keep our travel platform running smoothly for you. 
              They allow us to understand and improve how our website is used, offer you personalized flight deals, 
              and display relevant travel content and offers. Help us provide you with the best travel experience possible.
            </p>
            <p className="text-xs text-gray-500">
              More information can be found in our{" "}
              <a
                href="/privacy"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                Privacy Policy
              </a>
              {" "}and{" "}
              <a
                href="/terms"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                Terms of Service
              </a>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
            >
              <FaCog size={14} />
              Adjust Cookies
            </button>
            <button
              onClick={handleNecessaryOnly}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Necessary Cookies Only
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Accept All
            </button>
          </div>
        </div>

        {/* Cookie Settings Panel */}
        {showSettings && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Cookie Preferences</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-gray-900">Necessary Cookies</h5>
                  <p className="text-sm text-gray-600">Essential for website functionality and security</p>
                </div>
                <input
                  type="checkbox"
                  checked={cookieSettings.necessary}
                  disabled
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-gray-900">Analytics Cookies</h5>
                  <p className="text-sm text-gray-600">Help us understand how visitors use our travel platform</p>
                </div>
                <input
                  type="checkbox"
                  checked={cookieSettings.analytics}
                  onChange={(e) => setCookieSettings({...cookieSettings, analytics: e.target.checked})}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-gray-900">Marketing Cookies</h5>
                  <p className="text-sm text-gray-600">Enable personalized travel offers and advertisements</p>
                </div>
                <input
                  type="checkbox"
                  checked={cookieSettings.marketing}
                  onChange={(e) => setCookieSettings({...cookieSettings, marketing: e.target.checked})}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-gray-900">Preference Cookies</h5>
                  <p className="text-sm text-gray-600">Remember your travel preferences and settings</p>
                </div>
                <input
                  type="checkbox"
                  checked={cookieSettings.preferences}
                  onChange={(e) => setCookieSettings({...cookieSettings, preferences: e.target.checked})}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCustomSettings}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Save Preferences
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieBanner;
