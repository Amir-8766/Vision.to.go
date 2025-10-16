import SkipLinks from "./components/SkipLinks";
import ErrorBoundary from "./components/ErrorBoundary";
import React, { useState, useEffect, useRef } from "react";
import { useDarkMode } from "./hooks/useDarkMode";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useLocation,
  Link,
} from "react-router-dom";
import Home from "./pages/Home";
const Services = React.lazy(() => import("./pages/Services"));
import About from "./pages/About";
import Products from "./pages/Products";
const Checkout = React.lazy(() => import("./pages/Checkout"));
const PaymentSuccess = React.lazy(() => import("./pages/PaymentSuccess"));
const PaymentError = React.lazy(() => import("./pages/PaymentError"));
import { CartProvider, useCart } from "./context/CartContext";
const Cart = React.lazy(() => import("./pages/Cart"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
const Admin = React.lazy(() => import("./pages/Admin"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
import Footer from "./components/Footer";
import logo from "./assets/logo.png";
const Profile = React.lazy(() => import("./pages/Profile"));
const UpdatePassword = React.lazy(() => import("./pages/UpdatePassword"));
import MobileBottomNav from "./components/MobileBottomNav";
import { WishlistProvider, useWishlist } from "./context/WishlistContext";
const Wishlist = React.lazy(() => import("./pages/Wishlist"));
import ProductDetail from "./pages/ProductDetail";
const Commission = React.lazy(() => import("./pages/Commission"));
const CommissionDetail = React.lazy(() => import("./pages/CommissionDetail"));
const Terms = React.lazy(() => import("./pages/Terms"));
const Privacy = React.lazy(() => import("./pages/Privacy"));
const Impressum = React.lazy(() => import("./pages/Impressum"));
const FAQ = React.lazy(() => import("./pages/FAQ"));
import Partners from "./pages/Partners";
import CookieBanner from "./components/CookieBanner";

const AuthSuccess = React.lazy(() => import("./pages/AuthSuccess"));
const ForgetPassword = React.lazy(() => import("./pages/ForgetPassword"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));
import {
  CiUser,
  CiLogin,
  CiLogout,
  CiSearch,
  CiShoppingCart,
} from "react-icons/ci";
import { PiHeartStraightThin } from "react-icons/pi";
import { RiAdminLine, RiUserLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";

// import { HiOutlineUser } from "react-icons/hi";

// SearchBox Component
const SearchBox = React.forwardRef(
  ({ isOpen, onClose, searchTerm, setSearchTerm, onSubmit }, ref) => {
    return (
      <div
        ref={ref}
        className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-40 transform transition-all duration-300 ease-in-out"
        style={{
          transform: isOpen ? "translateY(0)" : "translateY(-100%)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        <form onSubmit={onSubmit} className="p-4">
          <div className="flex items-center bg-gray-50 rounded-full px-4 py-2 max-w-md mx-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="flex-1 bg-transparent outline-none text-gray-900"
              autoFocus
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="ml-2 p-2 hover:bg-gray-200 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Clear search"
              >
                <IoClose size={16} className="text-[#171717]" />
              </button>
            )}
            <button
              type="submit"
              className="ml-2 p-2 hover:bg-gray-200 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Search"
            >
              <CiSearch size={18} className="text-[#171717]" />
            </button>
          </div>
        </form>
      </div>
    );
  }
);

// Tooltip for Admin icon (desktop only)
function AdminIconWithTooltip() {
  const [show, setShow] = useState(false);
  return (
    <div
      className="relative flex items-center md:flex hidden"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      tabIndex={0}
      role="button"
      aria-label="Admin panel"
    >
      <RiAdminLine size={18} className="cursor-pointer" />
      {show && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 bg-white/70 text-black text-xs rounded shadow z-50 whitespace-nowrap backdrop-blur-md border border-gray-200">
          Admin
        </div>
      )}
    </div>
  );
}

// Tooltip for User icon (desktop only)
function UserIconWithTooltip() {
  const [show, setShow] = useState(false);
  return (
    <div
      className="relative flex items-center md:flex hidden"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      tabIndex={0}
      role="button"
      aria-label="User profile"
    >
      <RiUserLine className="w-5 h-5 cursor-pointer text-gray-800" />
      {show && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 bg-white/70 text-black text-xs rounded shadow z-50 whitespace-nowrap backdrop-blur-md border border-gray-200">
          User
        </div>
      )}
    </div>
  );
}

// Tooltip for Logout icon (desktop only)
function LogoutIconWithTooltip({ onClick }) {
  const [show, setShow] = useState(false);
  return (
    <button
      onClick={onClick}
      className="relative flex items-center text-red-500 hover:underline md:flex hidden"
      style={{
        background: "none",
        border: "none",
        padding: "8px",
        minWidth: "44px",
        minHeight: "44px",
      }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      tabIndex={0}
      type="button"
      aria-label="Logout"
    >
      <CiLogout size={28} />
      {show && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 bg-white/80 text-black text-xs rounded shadow z-50 whitespace-nowrap backdrop-blur-md border border-gray-200">
          Logout
        </div>
      )}
    </button>
  );
}

// Tooltip for Login icon (desktop only)
function LoginIconWithTooltip() {
  const [show, setShow] = useState(false);
  return (
    <NavLink
      to="/login"
      className="relative flex items-center md:flex hidden"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      tabIndex={0}
      aria-label="Login to your account"
    >
      <CiLogin size={28} className="text-gray-800" />
      {show && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 bg-white/80 text-black text-xs rounded shadow z-50 whitespace-nowrap backdrop-blur-md border border-gray-200">
          Login
        </div>
      )}
    </NavLink>
  );
}

// Tooltip for Search icon (desktop only)
function SearchIconWithTooltip({ onClick, isOpen }) {
  const [show, setShow] = useState(false);
  return (
    <button
      onClick={onClick}
      className="relative flex items-center md:flex hidden"
      style={{
        background: "none",
        border: "none",
        padding: "8px",
        marginRight: 4,
        minWidth: "44px",
        minHeight: "44px",
      }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      tabIndex={0}
      type="button"
      data-search-icon
      aria-label={isOpen ? "Close search" : "Open search"}
    >
      <CiSearch
        size={28}
        className={`transition-colors text-gray-800 ${
          isOpen ? "text-gray-700" : "hover:text-gray-700"
        }`}
      />
      {show && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 bg-white/80 text-black text-xs rounded shadow z-50 whitespace-nowrap backdrop-blur-md border border-gray-200">
          {isOpen ? "Close Search" : "Search"}
        </div>
      )}
    </button>
  );
}

// Tooltip for Shop/Cart icon (desktop only)
function ShopIconWithTooltip({ onClick }) {
  const [show, setShow] = useState(false);
  const { items } = useCart();

  const cartItemCount = items.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  return (
    <button
      onClick={onClick}
      className="relative flex items-center md:flex hidden"
      style={{
        background: "none",
        border: "none",
        padding: "8px",
        marginLeft: 4,
        minWidth: "44px",
        minHeight: "44px",
      }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      tabIndex={0}
      type="button"
      aria-label={`Shopping cart with ${cartItemCount} items`}
    >
      <CiShoppingCart size={28} className="text-gray-800" />
      {cartItemCount > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {cartItemCount}
        </div>
      )}
      {show && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 bg-white/80 text-black text-xs rounded shadow z-50 whitespace-nowrap backdrop-blur-md border border-gray-200">
          Shop
        </div>
      )}
    </button>
  );
}

// Tooltip for Favorites/Wishlist icon (desktop only)
function FavoritesIconWithTooltip({ onClick }) {
  const [show, setShow] = useState(false);
  const { wishlist } = useWishlist();

  const wishlistItemCount = wishlist.length;

  return (
    <button
      onClick={onClick}
      className="relative flex items-center md:flex hidden"
      style={{
        background: "none",
        border: "none",
        padding: "8px",
        marginLeft: 4,
        minWidth: "44px",
        minHeight: "44px",
      }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      tabIndex={0}
      type="button"
      aria-label={`Wishlist with ${wishlistItemCount} items`}
    >
      <PiHeartStraightThin size={28} className="text-gray-800" />
      {wishlistItemCount > 0 && (
        <div className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {wishlistItemCount}
        </div>
      )}
      {show && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 bg-white/80 text-black text-xs rounded shadow z-50 whitespace-nowrap backdrop-blur-md border border-gray-200">
          Favorites
        </div>
      )}
    </button>
  );
}

function Navigation() {
  const { user, role, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef(null);
  const isDarkMode = useDarkMode();
  const navigate = window.location
    ? (path) => (window.location.href = path)
    : () => {};

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setSearchOpen(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  // Close search box when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        // Check if click is on search icon
        const searchIcon = event.target.closest("[data-search-icon]");
        if (searchIcon) {
          return; // Don't close if clicking on search icon
        }
        setSearchOpen(false);
      }
    };

    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchOpen]);

  return (
    <>
      <nav
        className="text-gray-800 py-8 px-4 shadow-md flex items-center justify-between relative"
        style={{ backgroundColor: "#EDDCD9" }}
      >
        {/* Left side - Logo */}
        <div className="text-xl font-bold flex items-center justify-start ml-8">
          <NavLink to="/" aria-label="Home">
            <img
              src={logo}
              alt="Shop Logo"
              className="h-24 w-auto cursor-pointer logo"
              style={{
                filter:
                  "brightness(0) saturate(100%) invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%)",
              }}
            />
          </NavLink>
        </div>

        {/* Center - Menu (Desktop Only) */}
        <div className="hidden md:flex items-center gap-6">
          {[
            "/",
            "/services",
            "/about",
            "/products",
            "/partners",
            "/commission",
          ].map((path, idx) => {
            const names = [
              "HOME",
              "SERVICES",
              "ABOUT US",
              "PRODUCTS",
              "PARTNER",
              "COMMISSION",
            ];
            return (
              <div key={path} className="relative">
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `${
                      isActive ? "font-semibold" : ""
                    } py-2 px-4 hover:-translate-y-1 hover:scale-105 hover:text-gray-700 transition-transform duration-200 ease-in-out uppercase text-sm tracking-wide text-gray-800`
                  }
                >
                  {names[idx]}
                </NavLink>
                {/* Active indicator line above menu item */}
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `${
                      isActive ? "block" : "hidden"
                    } absolute -top-2 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-pink-500`
                  }
                  aria-label={`Active indicator for ${names[idx]}`}
                />
              </div>
            );
          })}
        </div>

        {/* Right side - Wishlist, Cart, Search, Login, etc. */}
        <div className="hidden md:flex items-center gap-4 text-sm text-gray-800">
          <FavoritesIconWithTooltip onClick={() => navigate("/favorites")} />
          <ShopIconWithTooltip onClick={() => navigate("/cart")} />
          <SearchIconWithTooltip
            onClick={() => setSearchOpen(!searchOpen)}
            isOpen={searchOpen}
          />
          {user ? (
            <>
              <NavLink
                to="/profile"
                onClick={closeMenu}
                className="flex items-center gap-1 text-gray-800 hover:text-gray-700"
              >
                <UserIconWithTooltip />
                {user?.username || "Profile"}
              </NavLink>

              {role === "admin" && (
                <NavLink
                  to="/admin-dashboard"
                  onClick={closeMenu}
                  className="md:flex hidden bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 ease-in-out font-medium"
                >
                  Dashboard
                </NavLink>
              )}
              <LogoutIconWithTooltip
                onClick={() => {
                  logout();
                  closeMenu();
                }}
              />
            </>
          ) : (
            <>
              <LoginIconWithTooltip />
            </>
          )}
        </div>

        {/* SearchBox */}
        <SearchBox
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSubmit={handleSearch}
          ref={searchRef}
        />

        {/* دکمه موبایل */}
        <div className="md:hidden z-50 absolute top-8 right-4">
          <button
            onClick={toggleMenu}
            aria-label="Toggle menu"
            className="focus:outline-none z-50 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
            style={{ color: "#171717" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                  style={{ stroke: "white" }}
                />
              ) : (
                <>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 12h16"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 18h16"
                  />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* بکدراپ موبایل */}
        {menuOpen && (
          <div
            onClick={closeMenu}
            className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          />
        )}

        {/* منوی موبایل */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-pink-100 dark:bg-gray-800 shadow-lg transform transition-transform duration-500 ease-in-out z-40
      ${menuOpen ? "translate-x-0" : "translate-x-full"}
      pt-24 md:hidden
    `}
        >
          {[
            "/",
            "/services",
            "/about",
            "/products",
            "/partners",
            "/commission",
          ].map((path, idx) => {
            const names = [
              "HOME",
              "SERVICES",
              "ABOUT US",
              "PRODUCTS",
              "PARTNER",
              "COMMISSION",
            ];
            return (
              <NavLink
                key={path}
                to={path}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `${
                    isActive ? "font-semibold" : ""
                  } block py-3 px-4 text-center hover:-translate-y-1 hover:scale-105 hover:text-pink-600 transition-transform duration-200 ease-in-out uppercase text-sm tracking-wide text-gray-900 dark:text-gray-100 min-h-[44px] flex items-center justify-center`
                }
              >
                {names[idx]}
              </NavLink>
            );
          })}

          <div className="mt-4 flex flex-col items-center gap-2 text-sm justify-center">
            {user ? (
              <>
                <NavLink
                  to="/profile"
                  onClick={closeMenu}
                  className="hover:text-pink-600 flex items-center gap-1 text-gray-900 dark:text-gray-100"
                >
                  <CiUser className="w-5 h-5" />
                  {user?.username || "Profile"}
                </NavLink>
                {role === "admin" && (
                  <NavLink
                    to="/admin-dashboard"
                    onClick={closeMenu}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 ease-in-out font-medium"
                  >
                    Dashboard
                  </NavLink>
                )}
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="text-red-500 hover:underline flex items-center justify-center mt-6 dark:text-red-400"
                  style={{
                    background: "none",
                    border: "none",
                    padding: "8px",
                    minWidth: "44px",
                    minHeight: "44px",
                  }}
                  aria-label="Logout"
                >
                  <CiLogout size={28} />
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={closeMenu}
                  className="flex items-center justify-center text-gray-900 dark:text-gray-100 min-h-[44px] min-w-[44px] p-2"
                  aria-label="Login to your account"
                >
                  <CiLogin size={28} className="text-green-500" />
                </NavLink>
              </>
            )}
          </div>

          {/* Social media icons at the bottom of mobile menu */}
          <div className="mt-auto pt-8 flex items-center justify-center gap-4">
            <a
              href="https://www.instagram.com/the_grrrls_club?igsh=YWFybzVzNWtrZTB0"
              aria-label="Follow us on Instagram"
              className="hover:text-pink-600 transition-colors text-gray-900 dark:text-gray-100 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://facebook.com"
              aria-label="Follow us on Facebook"
              className="hover:text-blue-600 transition-colors text-gray-900 dark:text-gray-100 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook size={20} />
            </a>
          </div>
        </div>
      </nav>

      {/* ✅ خط باریک زیر Navigation */}
      <div className="h-px bg-gray-300" />
    </>
  );
}

// --- Breadcrumb Component ---
function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  return (
    <nav
      className="text-xs sm:text-sm px-4 py-2 bg-gray-50 text-[#171717]"
      aria-label="breadcrumb"
    >
      <ol className="list-none flex flex-wrap gap-1">
        <li>
          <NavLink
            to="/"
            className="hover:underline text-pink-600 dark:text-pink-400"
          >
            Home
          </NavLink>
          {pathnames.length > 0 && <span className="mx-1">/</span>}
        </li>
        {pathnames.map((name, idx) => {
          const routeTo = "/" + pathnames.slice(0, idx + 1).join("/");
          const isLast = idx === pathnames.length - 1;
          return (
            <li key={routeTo} className="flex items-center">
              {!isLast ? (
                <NavLink
                  to={routeTo}
                  className="hover:underline text-pink-600 dark:text-pink-400 capitalize"
                >
                  {decodeURIComponent(name)}
                </NavLink>
              ) : (
                <span className="capitalize text-gray-700">
                  {decodeURIComponent(name)}
                </span>
              )}
              {!isLast && <span className="mx-1">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <ErrorBoundary>
            <SkipLinks />
            <BrowserRouter>
              {/* محفظه اصلی */}
              <div className="relative min-h-screen bg-white">
                {/* محتوای اصلی */}
                <div className="px-0">
                  <Navigation />
                  <Breadcrumb />
                  <main>
                    <React.Suspense fallback={null}>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/partners" element={<Partners />} />
                        <Route
                          path="/checkout"
                          element={
                            <ProtectedRoute>
                              <Checkout />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/payment-success"
                          element={<PaymentSuccess />}
                        />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                          path="/admin"
                          element={
                            <ProtectedRoute requireAdmin={true}>
                              <Admin />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/admin-dashboard"
                          element={
                            <ProtectedRoute requireAdmin={true}>
                              <AdminDashboard />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/profile"
                          element={
                            <ProtectedRoute>
                              <Profile />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/update-password"
                          element={<UpdatePassword />}
                        />
                        <Route path="/favorites" element={<Wishlist />} />
                        <Route
                          path="/products/:id"
                          element={<ProductDetail />}
                        />
                        <Route path="/commission" element={<Commission />} />
                        <Route
                          path="/commission/:id"
                          element={<CommissionDetail />}
                        />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/impressum" element={<Impressum />} />
                        <Route path="/faq" element={<FAQ />} />

                        <Route path="/auth-success" element={<AuthSuccess />} />
                        <Route
                          path="/forget-password"
                          element={<ForgetPassword />}
                        />
                        <Route
                          path="/reset-password"
                          element={<ResetPassword />}
                        />
                      </Routes>
                    </React.Suspense>
                  </main>

                  <Footer />
                  <MobileBottomNav />
                  <CookieBanner />

                  {/* Floating WhatsApp Icon */}
                  <a
                    href="https://wa.me/4952194932874"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed bottom-20 right-6 md:bottom-6 md:right-6 z-50 bg-green-500/90 hover:bg-green-600/95 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-110"
                    aria-label="Contact us on WhatsApp"
                  >
                    <FaWhatsapp size={28} />
                  </a>
                </div>
              </div>
            </BrowserRouter>
          </ErrorBoundary>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
