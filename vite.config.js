import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          stripe: ['@stripe/stripe-js', '@stripe/react-stripe-js'],
          charts: ['recharts'],
          icons: ['react-icons'],
          slick: ['react-slick', 'slick-carousel'],
          
          // Page chunks
          admin: [
            './src/pages/Admin.jsx',
            './src/pages/AdminDashboard.jsx',
            './src/components/OrdersView.jsx',
            './src/components/UsersView.jsx',
            './src/components/ReportsModal.jsx'
          ],
          auth: [
            './src/pages/Login.jsx',
            './src/pages/Register.jsx',
            './src/pages/ForgetPassword.jsx',
            './src/pages/ResetPassword.jsx'
          ],
          shop: [
            './src/pages/Products.jsx',
            './src/pages/ProductDetail.jsx',
            './src/pages/Cart.jsx',
            './src/pages/Checkout.jsx'
          ]
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
});
