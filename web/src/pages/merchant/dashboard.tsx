import React from "react";
import MerchantLayout from "../../components/layouts/MerchantLayout";
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  Truck,
  Star,
} from "lucide-react";

const DashboardPage: React.FC = () => {
  // Mock data for the dashboard
  const stats = [
    {
      title: "Total Revenue",
      value: "RWF 2,450,000",
      change: "+24.5%",
      trend: "up",
      icon: <DollarSign className="w-6 h-6" />,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Orders",
      value: "156",
      change: "+12.3%",
      trend: "up",
      icon: <ShoppingCart className="w-6 h-6" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Products",
      value: "24",
      change: "+2",
      trend: "up",
      icon: <Package className="w-6 h-6" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "New Customers",
      value: "42",
      change: "+18.2%",
      trend: "up",
      icon: <Users className="w-6 h-6" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const recentOrders = [
    {
      id: "#ORD-001",
      customer: "John Doe",
      product: "12kg Cooking Gas",
      amount: "RWF 25,000",
      status: "Pending",
      time: "10 min ago",
    },
    {
      id: "#ORD-002",
      customer: "Jane Smith",
      product: "6kg Cooking Gas",
      amount: "RWF 14,000",
      status: "Approved",
      time: "30 min ago",
    },
    {
      id: "#ORD-003",
      customer: "Robert K.",
      product: "Gas Regulator",
      amount: "RWF 8,000",
      status: "Completed",
      time: "2 hours ago",
    },
    {
      id: "#ORD-004",
      customer: "Alice U.",
      product: "12kg Cooking Gas",
      amount: "RWF 25,000",
      status: "Pending",
      time: "3 hours ago",
    },
    {
      id: "#ORD-005",
      customer: "Mark T.",
      product: "Gas Hose",
      amount: "RWF 5,000",
      status: "Approved",
      time: "5 hours ago",
    },
  ];

  const topProducts = [
    { name: "12kg Cooking Gas", sales: 156, revenue: "RWF 3.9M", stock: 42 },
    { name: "6kg Cooking Gas", sales: 89, revenue: "RWF 1.2M", stock: 24 },
    { name: "Gas Regulator", sales: 67, revenue: "RWF 536K", stock: 156 },
    { name: "Gas Hose", sales: 45, revenue: "RWF 225K", stock: 89 },
  ];

  return (
    <MerchantLayout
      pageTitle="Merchant Dashboard"
      breadcrumbs={[{ label: "Overview" }]}
    >
      {/* Welcome Banner */}
      <div className="p-6 mb-8 text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl">
        <div className="flex flex-col justify-between md:flex-row md:items-center">
          <div>
            <h2 className="mb-2 text-2xl font-bold">Welcome back, Merchant!</h2>
            <p className="text-orange-100">
              Here's what's happening with your shop today.
            </p>
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <div className="p-3 mr-4 bg-white/20 rounded-xl">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm">Shop Rating</div>
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-300 fill-current" />
                <span className="ml-1 text-xl font-bold">4.8</span>
                <span className="ml-2 text-sm text-orange-100">
                  (156 reviews)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bgColor} p-3 rounded-xl`}>
                <div className={stat.color}>{stat.icon}</div>
              </div>
              <div
                className={`flex items-center ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
              >
                {stat.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                )}
                <span className="text-sm font-medium">{stat.change}</span>
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-gray-600">{stat.title}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Orders
                </h3>
                <button className="text-sm font-medium text-orange-600 hover:text-orange-700">
                  View all →
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                      Product
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {order.customer}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {order.product}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {order.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Approved"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status === "Completed" && (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          )}
                          {order.status === "Approved" && (
                            <Clock className="w-3 h-3 mr-1" />
                          )}
                          {order.status === "Pending" && (
                            <AlertCircle className="w-3 h-3 mr-1" />
                          )}
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div>
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Top Products
                </h3>
                <BarChart3 className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {topProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-10 h-10 mr-3 rounded-lg bg-gradient-to-r from-orange-100 to-orange-200">
                          <Package className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.sales} sales
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        {product.revenue}
                      </div>
                      <div
                        className={`text-xs ${product.stock < 50 ? "text-red-600" : "text-green-600"}`}
                      >
                        {product.stock} in stock
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 mt-8 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">Stock Alert</div>
                  <div className="flex items-center">
                    <Truck className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">
                      3 products low
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-2 lg:grid-cols-4">
        <button className="p-4 text-left transition-all bg-white border border-gray-200 rounded-xl hover:border-orange-300 hover:shadow-md">
          <div className="flex items-center">
            <div className="p-2 mr-3 bg-orange-100 rounded-lg">
              <Package className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Add Product</div>
              <div className="text-sm text-gray-500">List new items</div>
            </div>
          </div>
        </button>

        <button className="p-4 text-left transition-all bg-white border border-gray-200 rounded-xl hover:border-orange-300 hover:shadow-md">
          <div className="flex items-center">
            <div className="p-2 mr-3 bg-blue-100 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Process Orders</div>
              <div className="text-sm text-gray-500">12 pending</div>
            </div>
          </div>
        </button>

        <button className="p-4 text-left transition-all bg-white border border-gray-200 rounded-xl hover:border-orange-300 hover:shadow-md">
          <div className="flex items-center">
            <div className="p-2 mr-3 bg-green-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">View Reports</div>
              <div className="text-sm text-gray-500">Analytics dashboard</div>
            </div>
          </div>
        </button>

        <button className="p-4 text-left transition-all bg-white border border-gray-200 rounded-xl hover:border-orange-300 hover:shadow-md">
          <div className="flex items-center">
            <div className="p-2 mr-3 bg-purple-100 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Schedule</div>
              <div className="text-sm text-gray-500">Delivery times</div>
            </div>
          </div>
        </button>
      </div>
    </MerchantLayout>
  );
};

export default DashboardPage;
