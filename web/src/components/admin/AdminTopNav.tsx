import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HelpCircle,
  LogOut,
  Menu,
  Search,
  Settings,
  Shield,
  User,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import NotificationBell from "@/components/shared/NotificationBell";

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
  const { logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
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

          <div className="flex items-center space-x-4">
            <button className="p-2 transition-colors rounded-lg hover:bg-gray-100">
              <HelpCircle className="w-5 h-5 text-gray-700" />
            </button>

            <NotificationBell />

            <div className="relative">
              <button
                onClick={() => setShowUserMenu((current) => !current)}
                className="flex items-center p-2 space-x-3 transition-colors rounded-lg hover:bg-gray-100"
              >
                <div className="flex items-center justify-center w-10 h-10 font-bold text-white rounded-full bg-gradient-to-r from-orange-500 to-orange-600">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden text-left md:block">
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.role}</div>
                </div>
              </button>

              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 z-20 w-64 mt-2 bg-white border border-gray-200 shadow-2xl rounded-xl">
                    <div className="p-4 border-b">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-12 h-12 text-lg font-bold text-white rounded-full bg-gradient-to-r from-orange-500 to-orange-600">
                          {user.name.charAt(0).toUpperCase()}
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

                    <div className="py-2">
                      <button
                        onClick={() => navigate("/admin/users")}
                        className="flex items-center w-full px-4 py-3 text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        <User className="w-5 h-5 mr-3 text-gray-500" />
                        My Profile
                      </button>
                      <button
                        onClick={() => navigate("/admin/settings")}
                        className="flex items-center w-full px-4 py-3 text-gray-700 transition-colors hover:bg-gray-50"
                      >
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
      </div>
    </header>
  );
};

export default AdminTopNav;
