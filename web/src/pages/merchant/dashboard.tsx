import React from "react";
import { Link } from "react-router-dom";
import { BarChart3, Package, ShoppingCart, Star } from "lucide-react";
import MerchantLayout from "../../components/layouts/MerchantLayout";
import OrderCard from "@/components/shared/OrderCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { merchantService } from "@/services/platform.service";
import type { Order, Product } from "@/types";
import { formatCurrency } from "@/utils/format";

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [dashboard, setDashboard] = React.useState<{
    stats: Record<string, number>;
    recentOrders: Order[];
    products: Product[];
    shop?: { shopName?: string; averageRating?: number; totalReviews?: number };
  } | null>(null);

  React.useEffect(() => {
    const load = async () => {
      const response = await merchantService.getDashboard();
      if (response.success && response.data) {
        setDashboard(response.data);
      }
      setLoading(false);
    };

    void load();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading merchant dashboard..." />;
  }

  const stats = [
    {
      title: "Revenue",
      value: formatCurrency(dashboard?.stats.totalRevenue || 0),
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      title: "Orders",
      value: String(dashboard?.stats.totalOrders || 0),
      icon: <ShoppingCart className="w-5 h-5" />,
    },
    {
      title: "Products",
      value: String(dashboard?.stats.totalProducts || 0),
      icon: <Package className="w-5 h-5" />,
    },
    {
      title: "Low stock",
      value: String(dashboard?.stats.lowStockProducts || 0),
      icon: <Star className="w-5 h-5" />,
    },
  ];

  return (
    <MerchantLayout
      pageTitle="Merchant Dashboard"
      breadcrumbs={[{ label: "Overview" }]}
    >
      <div className="p-6 mb-8 text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl">
        <div className="flex flex-col justify-between md:flex-row md:items-center">
          <div>
            <h2 className="mb-2 text-2xl font-bold">
              {dashboard?.shop?.shopName || "Merchant Dashboard"}
            </h2>
            <p className="text-orange-100">
              Track revenue, pending approvals, and stock health in one place.
            </p>
          </div>
          <div className="p-4 mt-4 bg-white/15 rounded-2xl md:mt-0">
            <div className="text-sm text-orange-100">Shop Rating</div>
            <div className="mt-1 text-2xl font-bold">
              {dashboard?.shop?.averageRating?.toFixed(1) || "0.0"}
            </div>
            <div className="text-sm text-orange-100">
              {dashboard?.shop?.totalReviews || 0} review(s)
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">{stat.title}</div>
                <div className="mt-2 text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
              </div>
              <div className="p-3 text-orange-600 bg-orange-100 rounded-xl">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Orders
              </h3>
              <Link
                to="/merchant/orders"
                className="text-sm font-medium text-orange-600 hover:text-orange-700"
              >
                View all
              </Link>
            </div>
            <div className="mt-6 space-y-4">
              {(dashboard?.recentOrders || []).map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
              {!dashboard?.recentOrders?.length && (
                <p className="text-sm text-gray-500">
                  Orders will appear here as soon as clients start placing them.
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Inventory Snapshot
                </h3>
                <BarChart3 className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {(dashboard?.products || []).map((product) => (
                  <div key={product._id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {product.productName || product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {typeof product.sizeKg === "number" ? `${product.sizeKg} kg` : product.unit}
                        {" • "}
                        {formatCurrency(
                          typeof product.pricePerKg === "number" && product.pricePerKg > 0
                            ? product.pricePerKg
                            : typeof product.sizeKg === "number" && product.sizeKg > 0
                              ? product.price / product.sizeKg
                              : product.price
                        )}{" "}
                        {typeof product.sizeKg === "number" ? "per kg" : "per item"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        {product.currentStock}
                      </div>
                      <div
                        className={`text-xs ${
                          product.currentStock <= product.minStockLevel
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {product.currentStock <= product.minStockLevel
                          ? "Reorder soon"
                          : "Healthy stock"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 mt-8 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">Low stock items</div>
                  <span className="text-sm font-medium text-gray-900">
                    {dashboard?.stats.lowStockProducts || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-2 lg:grid-cols-4">
        <Link
          to="/merchant/inventory"
          className="p-4 bg-white border border-gray-200 rounded-xl hover:border-orange-300 hover:shadow-md"
        >
          <div className="font-medium text-gray-900">Manage inventory</div>
          <div className="mt-1 text-sm text-gray-500">
            Create and update products
          </div>
        </Link>
        <Link
          to="/merchant/orders"
          className="p-4 bg-white border border-gray-200 rounded-xl hover:border-orange-300 hover:shadow-md"
        >
          <div className="font-medium text-gray-900">Review orders</div>
          <div className="mt-1 text-sm text-gray-500">
            Approve or reject pending requests
          </div>
        </Link>
        <Link
          to="/merchant/analytics"
          className="p-4 bg-white border border-gray-200 rounded-xl hover:border-orange-300 hover:shadow-md"
        >
          <div className="font-medium text-gray-900">Open analytics</div>
          <div className="mt-1 text-sm text-gray-500">
            Monitor sales and category performance
          </div>
        </Link>
        <Link
          to="/merchant/settings"
          className="p-4 bg-white border border-gray-200 rounded-xl hover:border-orange-300 hover:shadow-md"
        >
          <div className="font-medium text-gray-900">Update shop</div>
          <div className="mt-1 text-sm text-gray-500">
            Adjust delivery and contact details
          </div>
        </Link>
      </div>
    </MerchantLayout>
  );
};

export default DashboardPage;
