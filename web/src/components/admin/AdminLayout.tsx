import React, { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import AdminFooter from "./AdminFooter";
import AdminSideNav from "./AdminSideNav";
import AdminTopNav from "./AdminTopNav";

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
  const { user, loading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading admin workspace..." />;
  }

  if (!user) {
    return null;
  }

  const adminUser = {
    name: `${user.firstName} ${user.lastName}`.trim() || "Admin User",
    email: user.email,
    role: user.role,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
        <AdminSideNav
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((current) => !current)}
        />
      </div>

      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-40 transform ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300`}
      >
        <AdminSideNav
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
        <AdminTopNav
          user={adminUser}
          onToggleSidebar={() => setMobileSidebarOpen((current) => !current)}
          sidebarCollapsed={sidebarCollapsed}
        />

        <main className="flex-1">
          <div className="px-4 py-6 bg-white border-b border-gray-200 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
              {breadcrumbs.length > 0 && (
                <nav className="flex text-sm text-gray-500">
                  <Link to="/admin/dashboard" className="hover:text-gray-700">
                    Dashboard
                  </Link>
                  {breadcrumbs.map((crumb) => (
                    <React.Fragment key={`${crumb.label}-${crumb.path || "current"}`}>
                      <span className="mx-2">/</span>
                      {crumb.path ? (
                        <Link to={crumb.path} className="hover:text-gray-700">
                          {crumb.label}
                        </Link>
                      ) : (
                        <span className="text-gray-900">{crumb.label}</span>
                      )}
                    </React.Fragment>
                  ))}
                </nav>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </div>
        </main>

        <AdminFooter />
      </div>
    </div>
  );
};

export default AdminLayout;
