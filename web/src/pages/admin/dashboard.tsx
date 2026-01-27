import React from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Activity,
  Calendar,
  Filter,
} from "lucide-react";

const DashboardPage: React.FC = () => {
  return (
    <AdminLayout
      pageTitle="Dashboard Overview"
      breadcrumbs={[{ label: "Dashboard", path: "/admin/dashboard" }]}
    >
      {/* Your dashboard content here */}
      <div className="py-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Welcome to GasLink Admin
        </h2>
        <p className="mt-4 text-gray-600">
          Select a section from the sidebar to get started
        </p>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
