import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
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
      className={`h-screen bg-white border-r border-gray-200 ${
        collapsed ? "w-20" : "w-64"
      } transition-all duration-200 flex flex-col`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed ? (
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-orange-500 rounded-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">GasLink Merchant</h1>
              <p className="text-xs text-gray-500">Operations</p>
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
          className="hidden p-1 rounded lg:block hover:bg-gray-100"
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={`flex items-center rounded-lg transition-colors ${
                    active
                      ? "bg-orange-50 text-orange-700 border-l-4 border-orange-500"
                      : "text-gray-700 hover:bg-gray-50"
                  } ${collapsed ? "justify-center p-3" : "px-4 py-3"}`}
                  title={collapsed ? item.title : ""}
                >
                  <div className={active ? "text-orange-600" : "text-gray-500"}>
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
    </aside>
  );
};

export default MerchantSideNav;
