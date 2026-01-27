import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  HelpCircle,
  Sun,
  Moon,
  Menu,
  X,
  Shield,
  LogOut,
  User,
  Settings,
  Mail,
} from "lucide-react";

interface AdminTopNavProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

const AdminTopNav: React.FC<AdminTopNavProps> = ({
  user,
  onToggleSidebar,
  sidebarCollapsed,
}) => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  const handleLogout = async () => {
    try {
      // Call logout API
      const token = localStorage.getItem("token");
      if (token) {
        await fetch("http://localhost:5000/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login
      navigate("/login");

      // Show success message
      alert("Successfully logged out");
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local storage and redirect
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const markAllAsRead = () => {
    setUnreadNotifications(0);
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

            {/* Desktop Logo */}
            <div className="items-center hidden ml-2 lg:flex">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    GasLink Admin
                  </h1>
                  <p className="text-xs font-medium text-orange-600">
                    Control Panel
                  </p>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden ml-8 md:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search merchants, orders, users..."
                  className="block w-64 py-2 pl-10 pr-3 border border-gray-300 rounded-lg lg:w-80 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 transition-colors rounded-lg hover:bg-gray-100"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
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

              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="absolute right-0 z-20 mt-2 bg-white border border-gray-200 shadow-2xl w-80 rounded-xl">
                    <div className="p-4 border-b">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">
                          Notifications
                        </h3>
                        {unreadNotifications > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-sm text-orange-600 hover:text-orange-700"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="overflow-y-auto max-h-96">
                      {/* Notification items */}
                      <div className="p-4 border-b hover:bg-gray-50">
                        <div className="flex items-start">
                          <div className="p-2 mr-3 bg-blue-100 rounded-lg">
                            <Bell className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              New Merchant Registration
                            </h4>
                            <p className="mt-1 text-sm text-gray-600">
                              Kigali Gas Supplies wants to join
                            </p>
                            <p className="mt-2 text-xs text-gray-500">
                              2 min ago
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User Profile with Complete Logout */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center p-2 space-x-3 transition-colors rounded-lg hover:bg-gray-100"
              >
                <div className="flex items-center justify-center w-10 h-10 font-bold text-white rounded-full bg-gradient-to-r from-orange-500 to-orange-600">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden text-left md:block">
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.role}</div>
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
                          {user.name.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <h4 className="font-semibold text-gray-900">
                            {user.name}
                          </h4>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <span className="inline-block px-2 py-1 mt-1 text-xs text-orange-800 bg-orange-100 rounded-full">
                            {user.role}
                          </span>
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
                        Settings
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

        {/* Mobile Search */}
        <div className="py-3 md:hidden">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopNav;
