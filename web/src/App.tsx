import React from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import ToastNotification from "./components/ui/ToastNotification";
import { AuthProvider } from "./contexts/AuthContext";
import MerchantAnalyticsPage from "./pages/merchant/AnalyticsPage";
import InventoryPage from "./pages/merchant/InventoryPage";
import MerchantOrdersPage from "./pages/merchant/OrdersPage";
import MerchantDashboardPage from "./pages/merchant/dashboard";
import ShopSettingsPage from "./pages/merchant/ShopSettingsPage";
import MerchantVerificationPage from "./pages/admin/MerchantVerificationPage";
import PlatformAnalyticsPage from "./pages/admin/PlatformAnalyticsPage";
import UsersManagementPage from "./pages/admin/UsersManagementPage";
import GasCatalogPage from "./pages/admin/GasCatalogPage";
import SystemSettingsPage from "./pages/admin/SystemSettingsPage";
import AdminDashboardPage from "./pages/admin/dashboard";
import BrowseMerchantsPage from "./pages/client/BrowseMerchantsPage";
import OrderHistoryPage from "./pages/client/OrderHistoryPage";
import PlaceOrderPage from "./pages/client/PlaceOrderPage";
import SavedMerchantsPage from "./pages/client/SavedMerchantsPage";
import ShopPage from "./pages/client/ShopPage";
import LandingPage from "./pages/public/LandingPage";
import LoginPage from "./pages/public/LoginPage";
import RegisterPage from "./pages/public/RegisterPage";

const App: React.FC = () => (
  <AuthProvider>
    <Router>
      <div className="min-h-screen bg-gray-50">
        <ToastNotification />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/merchant/dashboard"
            element={
              <ProtectedRoute allowedRoles={["MERCHANT"]}>
                <MerchantDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/merchant/inventory"
            element={
              <ProtectedRoute allowedRoles={["MERCHANT"]}>
                <InventoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/merchant/orders"
            element={
              <ProtectedRoute allowedRoles={["MERCHANT"]}>
                <MerchantOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/merchant/analytics"
            element={
              <ProtectedRoute allowedRoles={["MERCHANT"]}>
                <MerchantAnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/merchant/settings"
            element={
              <ProtectedRoute allowedRoles={["MERCHANT"]}>
                <ShopSettingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["CLIENT"]}>
                <BrowseMerchantsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/browse"
            element={
              <ProtectedRoute allowedRoles={["CLIENT"]}>
                <BrowseMerchantsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/shops/:merchantId"
            element={
              <ProtectedRoute allowedRoles={["CLIENT"]}>
                <ShopPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/orders/new/:merchantId"
            element={
              <ProtectedRoute allowedRoles={["CLIENT"]}>
                <PlaceOrderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/orders/history"
            element={
              <ProtectedRoute allowedRoles={["CLIENT"]}>
                <OrderHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/saved"
            element={
              <ProtectedRoute allowedRoles={["CLIENT"]}>
                <SavedMerchantsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <UsersManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/merchant-verifications"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <MerchantVerificationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <PlatformAnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/gas-catalog"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <GasCatalogPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <SystemSettingsPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  </AuthProvider>
);

export default App;
