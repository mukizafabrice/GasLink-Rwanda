import React, { useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.service";
import MerchantTopNav from "@/components/merchant/MerchantTopNav";
import MerchantSideNav from "@/components/merchant/MerchantSideNav";
import MerchantFooter from "@/components/merchant/MerchantFooter";

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
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Get user from localStorage
  const user = authService.getCurrentUser();

  // Debug log
  console.log("MerchantLayout - User:", user);

  // If no user, show loading
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-b-2 border-orange-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  // Prepare user data for the top nav
  const userData = {
    name:
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.email?.split("@")[0] || "Merchant",
    email: user.email || "",
    role: user.role || "MERCHANT",
    shopName: user.shopName || "My Gas Shop",
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
        <MerchantSideNav
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`
        lg:hidden fixed inset-y-0 left-0 z-40 transform
        ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        transition-transform duration-300 ease-in-out
      `}
      >
        <MerchantSideNav
          collapsed={false}
          onToggleCollapse={toggleMobileSidebar}
        />
      </div>

      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Main Content */}
      <div
        className={`
        flex flex-col min-h-screen
        ${sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"}
        transition-all duration-300 ease-in-out
      `}
      >
        {/* Top Navigation - Pass userData, not raw user */}
        <MerchantTopNav
          user={userData}
          onToggleSidebar={toggleMobileSidebar}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Rest of the layout remains the same... */}
        <main className="flex-1">
          <div className="px-4 py-6 bg-white border-b border-gray-200 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {pageTitle}
                </h1>

                {breadcrumbs.length > 0 && (
                  <nav className="flex mt-2" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-2">
                      <li>
                        <a
                          href="/merchant/dashboard"
                          className="text-gray-500 hover:text-gray-700"
                        >
                          Dashboard
                        </a>
                      </li>
                      {breadcrumbs.map((crumb, index) => (
                        <li key={index} className="flex items-center">
                          <svg
                            className="w-5 h-5 mx-2 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {crumb.path ? (
                            <a
                              href={crumb.path}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              {crumb.label}
                            </a>
                          ) : (
                            <span className="font-medium text-gray-900">
                              {crumb.label}
                            </span>
                          )}
                        </li>
                      ))}
                    </ol>
                  </nav>
                )}
              </div>
            </div>
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
