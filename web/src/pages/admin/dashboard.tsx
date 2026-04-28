import React from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { adminService } from "@/services/platform.service";

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    const load = async () => {
      const response = await adminService.getStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
      setLoading(false);
    };

    void load();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading admin dashboard..." />;
  }

  return (
    <AdminLayout
      pageTitle="Dashboard Overview"
      breadcrumbs={[{ label: "Dashboard", path: "/admin/dashboard" }]}
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
        {[
          ["Users", stats.totalUsers || 0],
          ["Merchants", stats.totalMerchants || 0],
          ["Clients", stats.totalClients || 0],
          ["Orders", stats.totalOrders || 0],
          ["Pending verification", stats.pendingVerifications || 0],
        ].map(([label, value]) => (
          <div key={label} className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <div className="text-sm text-gray-500">{label}</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">{value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 mt-8 lg:grid-cols-3">
        <Link to="/admin/users" className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-orange-300">
          <h3 className="text-lg font-semibold text-gray-900">User management</h3>
          <p className="mt-2 text-sm text-gray-500">
            Enable, disable, and review platform accounts.
          </p>
        </Link>
        <Link to="/admin/merchant-verifications" className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-orange-300">
          <h3 className="text-lg font-semibold text-gray-900">Merchant verification</h3>
          <p className="mt-2 text-sm text-gray-500">
            Approve onboarding requests and keep quality high.
          </p>
        </Link>
        <Link to="/admin/analytics" className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-orange-300">
          <h3 className="text-lg font-semibold text-gray-900">Platform analytics</h3>
          <p className="mt-2 text-sm text-gray-500">
            Watch order flow, revenue, and product mix across the marketplace.
          </p>
        </Link>
        <Link to="/admin/gas-catalog" className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-orange-300">
          <h3 className="text-lg font-semibold text-gray-900">Gas catalog</h3>
          <p className="mt-2 text-sm text-gray-500">
            Define the only allowed gas product names, cylinder types, and cylinder sizes.
          </p>
        </Link>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
