import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  Heart,
  ShoppingBag,
  Store,
} from "lucide-react";

interface ClientSideNavProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const ClientSideNav: React.FC<ClientSideNavProps> = ({
  collapsed,
  onToggleCollapse,
}) => {
  const location = useLocation();

  const items = [
    {
      title: "Browse",
      path: "/client/browse",
      icon: <Compass className="w-5 h-5" />,
    },
    {
      title: "Saved",
      path: "/client/saved",
      icon: <Heart className="w-5 h-5" />,
    },
    {
      title: "Orders",
      path: "/client/orders/history",
      icon: <ShoppingBag className="w-5 h-5" />,
    },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <aside
      className={`h-screen bg-white border-r border-gray-200 ${
        collapsed ? "w-20" : "w-64"
      } transition-all duration-300 flex flex-col`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">GasLink Client</div>
              <div className="text-xs text-gray-500">Order LPG faster</div>
            </div>
          </div>
        ) : (
          <div className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500">
            <Store className="w-5 h-5 text-white" />
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="hidden p-1 rounded-lg lg:block hover:bg-gray-100"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {items.map((item) => {
          const active = isActive(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center rounded-xl ${
                active
                  ? "bg-orange-50 text-orange-700 border border-orange-100"
                  : "text-gray-700 hover:bg-gray-50"
              } ${collapsed ? "justify-center p-3" : "px-4 py-3"}`}
            >
              {item.icon}
              {!collapsed && <span className="ml-3 font-medium">{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default ClientSideNav;
