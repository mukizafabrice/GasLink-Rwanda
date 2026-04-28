import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, LogOut, Menu, Search, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import NotificationBell from "@/components/shared/NotificationBell";

interface ClientTopNavProps {
  userName: string;
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

const ClientTopNav: React.FC<ClientTopNavProps> = ({
  userName,
  onToggleSidebar,
  sidebarCollapsed,
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg lg:hidden hover:bg-gray-100"
          >
            {sidebarCollapsed ? (
              <Menu className="w-5 h-5 text-gray-700" />
            ) : (
              <X className="w-5 h-5 text-gray-700" />
            )}
          </button>
          <div>
            <div className="text-sm text-gray-500">Good to see you</div>
            <div className="font-semibold text-gray-900">{userName}</div>
          </div>
        </div>

        <div className="items-center hidden gap-3 md:flex">
          <div className="relative">
            <Search className="absolute w-4 h-4 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
            <input
              placeholder="Search merchants or products"
              className="py-2.5 pl-9 pr-4 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button
            onClick={() => navigate("/client/saved")}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Heart className="w-5 h-5 text-gray-700" />
          </button>
          <NotificationBell />
          <button
            onClick={() => setShowMenu((current) => !current)}
            className="w-10 h-10 font-semibold text-white rounded-full bg-gradient-to-r from-orange-500 to-amber-500"
          >
            {userName.charAt(0).toUpperCase()}
          </button>
          {showMenu && (
            <div className="absolute right-6 top-16 w-52 p-2 bg-white border border-gray-200 rounded-2xl shadow-xl">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-sm text-rose-600 rounded-xl hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default ClientTopNav;
