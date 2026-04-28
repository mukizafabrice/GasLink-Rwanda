import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  Building2,
  ChevronLeft,
  ChevronRight,
  Flame,
  LayoutDashboard,
  Settings,
  Shield,
  Users,
} from "lucide-react";

interface AdminSideNavProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const AdminSideNav: React.FC<AdminSideNavProps> = ({
  collapsed,
  onToggleCollapse,
}) => {
  const location = useLocation();

  const navItems = [
    {
      title: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      title: "Users",
      path: "/admin/users",
      icon: <Users className="w-5 h-5" />,
    },
    {
      title: "Verifications",
      path: "/admin/merchant-verifications",
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      title: "Analytics",
      path: "/admin/analytics",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      title: "Gas Catalog",
      path: "/admin/gas-catalog",
      icon: <Flame className="w-5 h-5" />,
    },
    {
      title: "Settings",
      path: "/admin/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <aside
      className={`h-screen bg-gradient-to-b from-gray-900 to-black text-white ${
        collapsed ? "w-20" : "w-64"
      } transition-all duration-300 flex flex-col`}
    >
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          {!collapsed ? (
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">GasLink Admin</h1>
                <p className="text-xs text-orange-400">Control Center</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center w-full">
              <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600">
                <Shield className="w-6 h-6" />
              </div>
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="hidden p-1 transition-colors rounded lg:block hover:bg-gray-800"
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="px-3 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.path);

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                    active
                      ? "bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-400 border-l-4 border-orange-500"
                      : "hover:bg-gray-800 text-gray-300 hover:text-white"
                  } ${collapsed ? "justify-center" : ""}`}
                  title={collapsed ? item.title : ""}
                >
                  <div className={active ? "text-orange-400" : "text-gray-400"}>
                    {item.icon}
                  </div>
                  {!collapsed && (
                    <span className="ml-3 font-medium">{item.title}</span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className={collapsed ? "text-center" : "text-sm text-gray-400"}>
          {!collapsed ? (
            <>
              <div className="flex items-center justify-between mb-2">
                <span>System Status</span>
                <span className="flex items-center text-green-400">
                  <div className="w-2 h-2 mr-2 bg-green-400 rounded-full"></div>
                  Online
                </span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full">
                <div className="w-4/5 h-2 bg-green-500 rounded-full"></div>
              </div>
            </>
          ) : (
            <div className="w-2 h-2 mx-auto bg-green-500 rounded-full"></div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default AdminSideNav;
