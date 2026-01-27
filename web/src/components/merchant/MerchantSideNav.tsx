import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface MerchantSideNavProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const MerchantSideNav: React.FC<MerchantSideNavProps> = ({
  collapsed,
  onToggleCollapse,
}) => {
  const location = useLocation();

  const navItems = [
    {
      title: "Dashboard",
      path: "/merchant/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      title: "Inventory",
      path: "/merchant/inventory",
      icon: <Package className="w-5 h-5" />,
    },
    {
      title: "Orders",
      path: "/merchant/orders",
      icon: <ShoppingCart className="w-5 h-5" />,
    },
    {
      title: "Customers",
      path: "/merchant/customers",
      icon: <Users className="w-5 h-5" />,
    },
    {
      title: "Analytics",
      path: "/merchant/analytics",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      title: "Settings",
      path: "/merchant/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <aside
      className={`h-screen bg-white border-r border-gray-200
        ${collapsed ? "w-16" : "w-64"} 
        transition-all duration-200 flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed ? (
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-orange-500 rounded-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">GasLink Merchant</h1>
              <p className="text-xs text-gray-500">Dashboard</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center w-full">
            <div className="p-2 bg-orange-500 rounded-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="p-1 rounded hover:bg-gray-100"
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={`
                    flex items-center rounded-lg transition-colors
                    ${
                      active
                        ? "bg-orange-50 text-orange-700 border-l-4 border-orange-500"
                        : "text-gray-700 hover:bg-gray-50"
                    }
                    ${collapsed ? "justify-center p-3" : "px-4 py-3"}
                  `}
                  title={collapsed ? item.title : ""}
                >
                  <div
                    className={`${active ? "text-orange-600" : "text-gray-500"}`}
                  >
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

        {/* Status indicator - only when expanded */}
        {!collapsed && (
          <div className="p-4 mt-8 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Status</span>
              <span className="flex items-center text-xs text-green-600">
                <div className="w-2 h-2 mr-1 bg-green-500 rounded-full"></div>
                Active
              </span>
            </div>
            <p className="text-xs text-gray-500">Accepting orders</p>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default MerchantSideNav;
