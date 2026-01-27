import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/auth.service";
import {
  Search,
  Bell,
  HelpCircle,
  Sun,
  Moon,
  Menu,
  X,
  Building2,
  LogOut,
  User,
  Settings,
  Package,
  BarChart3,
  Wallet,
  Store,
} from "lucide-react";

interface MerchantTopNavProps {
  user: {
    name: string;
    email: string;
    role: string;
    shopName?: string;
  };
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

const MerchantTopNav: React.FC<MerchantTopNavProps> = ({
  user,
  onToggleSidebar,
  sidebarCollapsed,
}) => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(5);

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      authService.clearAuthData();
      navigate("/login");
    }
  };

  const markAllAsRead = () => {
    setUnreadNotifications(0);
  };

  // Safely get user initials
  const getUserInitial = () => {
    if (!user?.name) return "U";
    return user.name.charAt(0).toUpperCase();
  };

  // Safely get display name
  const getDisplayName = () => {
    if (!user?.name) return user?.email?.split("@")[0] || "User";
    return user.name;
  };

  // Safely get email
  const getEmail = () => {
    return user?.email || "No email";
  };

  // Safely get role
  const getRole = () => {
    return user?.role || "MERCHANT";
  };

  // Safely get shop name
  const getShopName = () => {
    return user?.shopName || "My Shop";
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <button
              onClick={onToggleSidebar}
              className="p-2 transition-colors rounded-lg lg:hidden hover:bg-gray-100"
            >
              {sidebarCollapsed ? (
                <Menu className="w-5 h-5 text-gray-700" />
              ) : (
                <X className="w-5 h-5 text-gray-700" />
              )}
            </button>

            {/* Desktop Logo & Shop Info */}
            <div className="items-center hidden ml-2 lg:flex">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {getShopName()}
                  </h1>
                  <p className="text-xs font-medium text-orange-600">
                    Merchant Dashboard
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats - Desktop */}
            <div className="items-center hidden ml-8 space-x-6 md:flex">
              <div className="flex items-center">
                <div className="p-2 mr-2 bg-green-100 rounded-lg">
                  <Package className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Orders</div>
                  <div className="font-bold text-gray-900">24</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="p-2 mr-2 bg-blue-100 rounded-lg">
                  <Wallet className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Today</div>
                  <div className="font-bold text-gray-900">RWF 450K</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Public Shop Button */}
            <button
              onClick={() => navigate("/shop")}
              className="items-center hidden px-4 py-2 text-orange-600 transition-colors border border-orange-300 rounded-lg md:flex hover:bg-orange-50"
            >
              <Store className="w-4 h-4 mr-2" />
              View Shop
            </button>

            {/* Dark Mode */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 transition-colors rounded-lg hover:bg-gray-100"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-gray-700" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>

            {/* Help */}
            <button className="p-2 transition-colors rounded-lg hover:bg-gray-100">
              <HelpCircle className="w-5 h-5 text-gray-700" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 transition-colors rounded-lg hover:bg-gray-100"
              >
                <Bell className="w-5 h-5 text-gray-700" />
                {unreadNotifications > 0 && (
                  <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
                    {unreadNotifications}
                  </span>
                )}
              </button>
            </div>

            {/* User Profile with Logout */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center p-2 space-x-3 transition-colors rounded-lg hover:bg-gray-100"
              >
                <div className="flex items-center justify-center w-10 h-10 font-bold text-white rounded-full bg-gradient-to-r from-orange-500 to-orange-600">
                  {getUserInitial()}
                </div>
                <div className="hidden text-left md:block">
                  <div className="font-medium text-gray-900">
                    {getDisplayName()}
                  </div>
                  <div className="text-xs text-gray-500">{getRole()}</div>
                </div>
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 z-20 w-64 mt-2 bg-white border border-gray-200 shadow-2xl rounded-xl">
                    {/* User Info */}
                    <div className="p-4 border-b">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-12 h-12 text-lg font-bold text-white rounded-full bg-gradient-to-r from-orange-500 to-orange-600">
                          {getUserInitial()}
                        </div>
                        <div className="ml-3">
                          <h4 className="font-semibold text-gray-900">
                            {getDisplayName()}
                          </h4>
                          <p className="text-sm text-gray-600">{getEmail()}</p>
                          <div className="flex items-center mt-1">
                            <span className="px-2 py-1 text-xs text-orange-800 bg-orange-100 rounded-full">
                              {getRole()}
                            </span>
                            <span className="px-2 py-1 ml-2 text-xs text-blue-800 bg-blue-100 rounded-full">
                              {getShopName()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button className="flex items-center w-full px-4 py-3 text-gray-700 transition-colors hover:bg-gray-50">
                        <User className="w-5 h-5 mr-3 text-gray-500" />
                        My Profile
                      </button>
                      <button className="flex items-center w-full px-4 py-3 text-gray-700 transition-colors hover:bg-gray-50">
                        <Settings className="w-5 h-5 mr-3 text-gray-500" />
                        Shop Settings
                      </button>
                      <button className="flex items-center w-full px-4 py-3 text-gray-700 transition-colors hover:bg-gray-50">
                        <BarChart3 className="w-5 h-5 mr-3 text-gray-500" />
                        Analytics
                      </button>
                      <div className="my-2 border-t border-gray-200"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-red-600 transition-colors hover:bg-red-50"
                      >
                        <LogOut className="w-5 h-5 mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search & Stats */}
        <div className="py-3 md:hidden">
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div className="p-3 rounded-lg bg-gray-50">
              <div className="flex items-center">
                <Package className="w-4 h-4 mr-2 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Orders</div>
                  <div className="font-bold text-gray-900">24</div>
                </div>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-gray-50">
              <div className="flex items-center">
                <Wallet className="w-4 h-4 mr-2 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Today</div>
                  <div className="font-bold text-gray-900">RWF 450K</div>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate("/shop")}
            className="flex items-center justify-center w-full px-4 py-2 text-orange-600 transition-colors border border-orange-300 rounded-lg hover:bg-orange-50"
          >
            <Store className="w-4 h-4 mr-2" />
            View Public Shop
          </button>
        </div>
      </div>
    </header>
  );
};

export default MerchantTopNav;
