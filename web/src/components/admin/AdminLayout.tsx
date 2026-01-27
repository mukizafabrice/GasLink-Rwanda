import React, { useState, ReactNode } from "react";
import AdminTopNav from "./AdminTopNav";
import AdminSideNav from "./AdminSideNav";
import AdminFooter from "./AdminFooter";

interface AdminLayoutProps {
  children: ReactNode;
  pageTitle: string;
  breadcrumbs?: Array<{ label: string; path?: string }>;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  pageTitle,
  breadcrumbs = [],
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Mock user data - will come from auth context
  const user = {
    name: "Admin User",
    email: "admin@gaslink.rw",
    role: "Super Admin",
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar - Fixed position */}
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
        <AdminSideNav
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />
      </div>

      {/* Mobile Sidebar - Overlay */}
      <div
        className={`
        lg:hidden fixed inset-y-0 left-0 z-40 transform
        ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        transition-transform duration-300 ease-in-out
      `}
      >
        <AdminSideNav
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

      {/* Main Content Area */}
      <div
        className={`
        flex flex-col min-h-screen
        ${sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"}
        transition-all duration-300 ease-in-out
      `}
      >
        {/* Top Navigation */}
        <AdminTopNav
          user={user}
          onToggleSidebar={toggleMobileSidebar}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Main Content */}
        <main className="flex-1">
          {/* Page Header */}
          <div className="px-4 py-6 bg-white border-b border-gray-200 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {pageTitle}
                </h1>

                {/* Breadcrumbs */}
                {breadcrumbs.length > 0 && (
                  <nav className="flex mt-2" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-2">
                      <li>
                        <a
                          href="/admin/dashboard"
                          className="text-gray-500 hover:text-gray-700"
                        >
                          Home
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

              {/* Page Actions */}
              <div className="flex mt-4 space-x-3 sm:mt-0">
                <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                  Export
                </button>
                <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                  Add New
                </button>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </div>
        </main>

        {/* Footer */}
        <AdminFooter />
      </div>
    </div>
  );
};

export default AdminLayout;
