import React, { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { BASE_URL } from "../lib/api";
import {
  FaUsers,
  FaShoppingCart,
  FaBox,
  FaEuroSign,
  FaChartLine,
  FaFileAlt,
} from "react-icons/fa";
import ReportsModal from "../components/ReportsModal";
import StatCard from "../components/StatCard";
import RevenueChart from "../components/RevenueChart";
import RevenueTrendChart from "../components/RevenueTrendChart";
import OrderStatusChart from "../components/OrderStatusChart";
import TopProductsChart from "../components/TopProductsChart";
import OrdersView from "../components/OrdersView";
import UsersView from "../components/UsersView";
import FeaturedProductsView from "../components/FeaturedProductsView";
import PartnersView from "../components/PartnersView";

// Custom color palette based on client's requirements
const colors = {
  lightPink: "#EDDCD9",
  offWhite: "#F2EBE9",
  brightPink: "#DE5499",
  darkTeal: "#264143",
  orange: "#E9944C",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    recentOrders: [],
    recentUsers: [],
    monthlyRevenue: [],
    topProducts: [],
    orderStatuses: {},
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dateRange, setDateRange] = useState("30"); // days
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // TODO: Remove this in production - only for testing
    // if (!localStorage.getItem("token")) {
    //   localStorage.setItem(
    //     "token",
    //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODg3N2VjYTZmNzEzY2U5NGRlZGI3NmEiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1MzcxMDI5OSwiZXhwIjoxNzUzNzk2Njk5fQ.rl94go2VdicRDaxdLWhrWIetQf5-y-bcsm4mCS00dEw"
    //   );
    // }
    checkUserRole();
  }, [dateRange]);

  async function checkUserRole() {
    setLoading(true);
    try {
      // Check if user is logged in
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, redirecting to login");
        window.location.href = "/login";
        return;
      }

      // Decode JWT token to get user role
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const role = payload.role;

        if (role !== "admin") {
          console.log("User is not admin, redirecting to home");
          window.location.href = "/";
          return;
        }

        setUserRole(role);
        fetchDashboardData();
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }
    } catch (err) {
      console.error("Error checking user role:", err);
      localStorage.removeItem("token");
      window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  }

  async function fetchDashboardData() {
    setLoading(true);
    try {
      // Check if user is logged in
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, redirecting to login");
        window.location.href = "/login";
        return;
      }

      // Fetch all data in parallel
      const [usersRes, ordersRes, productsRes] = await Promise.all([
        apiFetch("/users"),
        apiFetch("/orders"),
        apiFetch("/products"),
      ]);

      // Check if responses are ok
      if (!usersRes.ok || !ordersRes.ok || !productsRes.ok) {
        if (
          usersRes.status === 401 ||
          ordersRes.status === 401 ||
          productsRes.status === 401
        ) {
          console.log("Unauthorized, redirecting to login");
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }
        console.log(
          "Response status:",
          usersRes.status,
          ordersRes.status,
          productsRes.status
        );
        throw new Error("Failed to fetch data");
      }

      const users = await usersRes.json();
      const orders = await ordersRes.json();
      const products = await productsRes.json();

      // Calculate statistics
      const totalRevenue = orders.reduce(
        (sum, order) => sum + (order.totalPrice || 0),
        0
      );

      // Calculate monthly revenue (last 6 months)
      const monthlyRevenue = calculateMonthlyRevenue(orders);

      // Calculate order statuses
      const orderStatuses = calculateOrderStatuses(orders);

      // Calculate top products
      const topProducts = calculateTopProducts(orders, products);

      setStats({
        totalUsers: users.length,
        totalOrders: orders.length,
        totalProducts: products.length,
        totalRevenue,
        recentOrders: orders.slice(-5).reverse(),
        recentUsers: users.slice(-5).reverse(),
        monthlyRevenue,
        orderStatuses,
        topProducts,
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      // If it's a JSON parse error, it might be an HTML response (login page)
      if (err.message.includes("Unexpected token '<'")) {
        console.log("Received HTML response, redirecting to login");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }
    } finally {
      setLoading(false);
    }
  }

  const calculateMonthlyRevenue = (orders) => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleDateString("en-US", { month: "short" });
      const monthOrders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return (
          orderDate.getMonth() === date.getMonth() &&
          orderDate.getFullYear() === date.getFullYear()
        );
      });
      const revenue = monthOrders.reduce(
        (sum, order) => sum + (order.totalPrice || 0),
        0
      );
      months.push({ month: monthName, revenue });
    }
    return months;
  };

  const calculateOrderStatuses = (orders) => {
    const statuses = {};
    orders.forEach((order) => {
      const status = order.status || "Unknown";
      statuses[status] = (statuses[status] || 0) + 1;
    });
    return statuses;
  };

  const calculateTopProducts = (orders, products) => {
    const productSales = {};
    orders.forEach((order) => {
      order.items?.forEach((item) => {
        const productId = item.productId;
        productSales[productId] =
          (productSales[productId] || 0) + (item.quantity || 1);
      });
    });

    return products
      .map((product) => ({
        ...product,
        sales: productSales[product._id] || 0,
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
  };

  const DashboardView = () => (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<FaUsers className="text-white" size={24} />}
          color="border-blue-500"
          bgColor="bg-white"
          trend={12}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<FaShoppingCart className="text-white" size={24} />}
          color="border-green-500"
          bgColor="bg-white"
          trend={8}
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={<FaBox className="text-white" size={24} />}
          color="border-purple-500"
          bgColor="bg-white"
          trend={-3}
        />
        <StatCard
          title="Total Revenue"
          value={`€${stats.totalRevenue.toFixed(2)}`}
          icon={<FaEuroSign className="text-white" size={24} />}
          color="border-yellow-500"
          bgColor="bg-white"
          trend={15}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart
          monthlyRevenue={stats.monthlyRevenue}
          dateRange={dateRange}
          setDateRange={setDateRange}
          colors={colors}
        />
        <OrderStatusChart orderStatuses={stats.orderStatuses} colors={colors} />
      </div>

      {/* Revenue Trend Chart */}
      <div className="grid grid-cols-1 gap-6">
        <RevenueTrendChart
          monthlyRevenue={stats.monthlyRevenue}
          colors={colors}
        />
      </div>

      {/* Top Products and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProductsChart topProducts={stats.topProducts} colors={colors} />

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {stats.recentOrders.slice(0, 5).map((order) => (
              <div
                key={order._id}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.lightPink }}
                >
                  <FaShoppingCart
                    size={14}
                    style={{ color: colors.darkTeal }}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    New order #{order._id.slice(-6)}
                  </p>
                  <p className="text-xs text-[#171717]">
                    €{order.totalPrice} •{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    order.status === "Paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.status === "Paid" ? "Paid" : order.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2"
            style={{ borderColor: colors.brightPink }}
          ></div>
        </div>
      </div>
    );
  }

  // Check if user is logged in
  const token = localStorage.getItem("token");
  if (!token) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h2>
          <p className="text-[#171717] mb-6">
            Please log in to access the admin dashboard.
          </p>
          <a
            href="/login"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg text-white font-medium transition-colors hover:opacity-90"
            style={{ backgroundColor: colors.brightPink }}
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className="max-w-7xl mx-auto p-6"
      style={{ backgroundColor: colors.offWhite }}
    >
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold" style={{ color: colors.darkTeal }}>
            Admin Dashboard
          </h1>
          <p className="text-[#171717] mt-2">
            Complete store management and analytics
          </p>
        </div>
        <button
          onClick={() => setShowReportsModal(true)}
          className="flex items-center space-x-2 px-6 py-3 rounded-lg text-white font-medium transition-colors hover:opacity-90"
          style={{ backgroundColor: colors.orange }}
        >
          <FaFileAlt size={16} />
          <span>Generate Reports</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-2 md:space-x-8 overflow-x-auto">
          {[
            { id: "dashboard", label: "Dashboard", icon: <FaChartLine /> },
            { id: "orders", label: "Orders", icon: <FaShoppingCart /> },
            { id: "users", label: "Users", icon: <FaUsers /> },
            { id: "products", label: "Products", icon: <FaBox /> },
            { id: "featured", label: "Featured Products", icon: <FaBox /> },
            { id: "partners", label: "Partners", icon: <FaFileAlt /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1 md:space-x-2 py-3 px-2 md:px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? `border-b-2 font-semibold`
                  : "border-transparent text-[#171717] hover:text-gray-700 hover:border-gray-300"
              }`}
              style={
                activeTab === tab.id
                  ? { borderColor: colors.brightPink, color: colors.brightPink }
                  : {}
              }
            >
              {tab.icon}
              <span className="text-xs md:text-sm">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === "dashboard" && <DashboardView />}
      {activeTab === "orders" && <OrdersView />}
      {activeTab === "users" && <UsersView />}
      {activeTab === "featured" && <FeaturedProductsView />}
      {activeTab === "partners" && <PartnersView />}
      {activeTab === "products" && (
        <div className="space-y-6">
          {/* Product Management Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Add Product Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-center">
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.lightPink }}
                >
                  <FaBox size={24} style={{ color: colors.darkTeal }} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Add New Product
                </h3>
                <p className="text-[#171717] text-sm mb-4">
                  Create and add new products to your store
                </p>
                <a
                  href="/admin"
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-medium transition-colors hover:opacity-90"
                  style={{ backgroundColor: colors.brightPink }}
                >
                  <FaBox size={16} />
                  <span>Add Product</span>
                </a>
              </div>
            </div>

            {/* Manage Products Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-center">
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.lightPink }}
                >
                  <FaBox size={24} style={{ color: colors.darkTeal }} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Manage Products
                </h3>
                <p className="text-[#171717] text-sm mb-4">
                  Edit, delete and manage existing products
                </p>
                <a
                  href="/admin"
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-medium transition-colors hover:opacity-90"
                  style={{ backgroundColor: colors.orange }}
                >
                  <FaBox size={16} />
                  <span>Manage</span>
                </a>
              </div>
            </div>

            {/* Product Analytics Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-center">
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.lightPink }}
                >
                  <FaChartLine size={24} style={{ color: colors.darkTeal }} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Product Analytics
                </h3>
                <p className="text-[#171717] text-sm mb-4">
                  View detailed analytics and insights
                </p>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-medium transition-colors hover:opacity-90"
                  style={{ backgroundColor: colors.darkTeal }}
                >
                  <FaChartLine size={16} />
                  <span>View Analytics</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => window.open("/admin", "_blank")}
                className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-400 hover:bg-pink-50 transition-all duration-300"
              >
                <FaBox size={20} style={{ color: colors.brightPink }} />
                <span className="font-medium text-gray-700">
                  Open Product Manager
                </span>
              </button>
              <button
                onClick={() => setActiveTab("dashboard")}
                className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-400 hover:bg-pink-50 transition-all duration-300"
              >
                <FaChartLine size={20} style={{ color: colors.brightPink }} />
                <span className="font-medium text-gray-700">
                  View Dashboard
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reports Modal */}
      <ReportsModal
        isOpen={showReportsModal}
        onClose={() => setShowReportsModal(false)}
        data={stats}
      />
    </div>
  );
}
