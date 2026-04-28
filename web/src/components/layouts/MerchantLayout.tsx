import React, { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import MerchantFooter from "@/components/merchant/MerchantFooter";
import MerchantSideNav from "@/components/merchant/MerchantSideNav";
import MerchantTopNav from "@/components/merchant/MerchantTopNav";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface MerchantLayoutProps {
  children: ReactNode;
  pageTitle: string;
  breadcrumbs?: Array<{ label: string; path?: string }>;
}

const MerchantLayout: React.FC<MerchantLayoutProps> = ({
  children,
  pageTitle,
  breadcrumbs = [],
}) => {
  const { user, loading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading merchant workspace..." />;
  }

  if (!user) {
    return null;
  }

  const userData = {
    name: `${user.firstName} ${user.lastName}`.trim() || "Merchant",
    email: user.email,
    role: user.role,
    shopName: user.shop?.shopName || "My Gas Shop",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
        <MerchantSideNav
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((current) => !current)}
        />
      </div>

      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-40 transform ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300`}
      >
        <MerchantSideNav
          collapsed={false}
          onToggleCollapse={() => setMobileSidebarOpen(false)}
        />
      </div>

      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <div
        className={`flex flex-col min-h-screen ${
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
        } transition-all duration-300`}
      >
        <MerchantTopNav
          user={userData}
          onToggleSidebar={() => setMobileSidebarOpen((current) => !current)}
          sidebarCollapsed={sidebarCollapsed}
        />

        <main className="flex-1">
          <div className="px-4 py-6 bg-white border-b border-gray-200 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
            {breadcrumbs.length > 0 && (
              <nav className="flex mt-2" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                  <li>
                    <Link
                      to="/merchant/dashboard"
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Dashboard
                    </Link>
                  </li>
                  {breadcrumbs.map((crumb) => (
                    <li key={`${crumb.label}-${crumb.path || "current"}`} className="flex items-center">
                      <span className="mx-2 text-gray-400">/</span>
                      {crumb.path ? (
                        <Link
                          to={crumb.path}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {crumb.label}
                        </Link>
                      ) : (
                        <span className="font-medium text-gray-900">{crumb.label}</span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            )}
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </div>
        </main>

        <MerchantFooter />
      </div>
    </div>
  );
};

export default MerchantLayout;
