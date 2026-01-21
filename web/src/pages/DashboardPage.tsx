import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import {
  Flame,
  MapPin,
  Package,
  Clock,
  DollarSign,
  Settings,
  LogOut,
  User,
  Shield,
} from "lucide-react";
import Layout from "../components/layout/Layout";

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const stats = [
    {
      label: "Total Orders",
      value: user.customer?.totalOrders || 0,
      icon: Package,
      color: "bg-blue-500",
    },
    {
      label: "Total Spent",
      value: `RWF ${user.customer?.totalSpent || 0}`,
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      label: "Active Deliveries",
      value: "0",
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      label: "Account Status",
      value: user.emailVerified ? "Verified" : "Pending",
      icon: Shield,
      color: "bg-purple-500",
    },
  ];

  const recentOrders = [
    {
      id: 1,
      date: "2024-01-15",
      type: "Jibu Gas 6KG",
      status: "Delivered",
      amount: 24945,
    },
    {
      id: 2,
      date: "2024-01-10",
      type: "Kgali Gas 12KG",
      status: "In Progress",
      amount: 44500,
    },
    {
      id: 3,
      date: "2024-01-05",
      type: "Meru Gas 3KG",
      status: "Delivered",
      amount: 15000,
    },
  ];

  return (
    <Layout>
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="p-8 text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl">
            <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
              <div>
                <h1 className="mb-2 text-3xl font-bold">
                  Welcome back, {user.firstName} {user.lastName}!
                </h1>
                <p className="text-primary-100">
                  {user.role === "CUSTOMER" && "Ready to order gas today?"}
                  {user.role === "MERCHANT" &&
                    "Manage your gas business efficiently"}
                  {user.role === "DRIVER" && "Ready for your next delivery?"}
                </p>
                <div className="flex items-center mt-4 space-x-4">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>
                      {user.district}, {user.province}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    <span className="capitalize">
                      {user.role.toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center px-4 py-2 mt-4 transition-colors md:mt-0 bg-white/20 hover:bg-white/30 rounded-xl"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Orders & Quick Actions */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Orders
                </h2>
                <button className="font-medium text-primary-600 hover:text-primary-700">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50"
                  >
                    <div>
                      <div className="font-medium text-gray-900">
                        {order.type}
                      </div>
                      <div className="text-sm text-gray-600">{order.date}</div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "In Progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {order.status}
                      </div>
                      <div className="mt-1 font-medium text-gray-900">
                        RWF {order.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
              <h2 className="mb-6 text-xl font-bold text-gray-900">
                Quick Actions
              </h2>

              <div className="space-y-3">
                <button className="flex items-center justify-between w-full p-4 transition-colors border border-gray-200 rounded-xl hover:bg-primary-50 hover:border-primary-200">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 mr-3 bg-blue-100 rounded-xl">
                      <Flame className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Order Gas</div>
                      <div className="text-sm text-gray-600">
                        Find and order gas
                      </div>
                    </div>
                  </div>
                </button>

                <button className="flex items-center justify-between w-full p-4 transition-colors border border-gray-200 rounded-xl hover:bg-green-50 hover:border-green-200">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 mr-3 bg-green-100 rounded-xl">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">
                        Track Delivery
                      </div>
                      <div className="text-sm text-gray-600">Live tracking</div>
                    </div>
                  </div>
                </button>

                <button className="flex items-center justify-between w-full p-4 transition-colors border border-gray-200 rounded-xl hover:bg-purple-50 hover:border-purple-200">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 mr-3 bg-purple-100 rounded-xl">
                      <Settings className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">
                        Account Settings
                      </div>
                      <div className="text-sm text-gray-600">
                        Update profile
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Account Status */}
            <div className="p-6 mt-6 bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl">
              <h3 className="mb-4 font-bold text-gray-900">Account Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Email Verification</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.emailVerified
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {user.emailVerified ? "Verified" : "Pending"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Phone Verification</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.phoneVerified
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {user.phoneVerified ? "Verified" : "Pending"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Account Type</span>
                  <span className="px-3 py-1 text-sm font-medium capitalize rounded-full bg-primary-100 text-primary-800">
                    {user.role.toLowerCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
