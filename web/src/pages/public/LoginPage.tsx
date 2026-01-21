import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle, Flame } from "lucide-react";

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success && data.data) {
        // Save token and user data to localStorage
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));

        // Redirect based on user role
        const role = data.data.user.role;
        switch (role) {
          case "ADMIN":
            navigate("/admin/dashboard");
            break;
          case "MERCHANT":
            navigate("/merchant/dashboard");
            break;
          case "CLIENT":
            navigate("/dashboard");
            break;
          default:
            navigate("/");
        }
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Demo account login function
  const demoLogin = (account: string) => {
    const accounts: Record<string, { email: string; password: string }> = {
      client: { email: "client@example.com", password: "Client123!" },
      merchant: { email: "merchant@example.com", password: "Merchant123!" },
      admin: { email: "admin@gaslink.rw", password: "Admin123!" },
    };

    if (accounts[account]) {
      setFormData(accounts[account]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-2xl shadow-lg mb-4">
            <Flame className="h-12 w-12 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">GasLink</h1>
            <p className="text-orange-600 font-medium mt-1">Rwanda</p>
            <p className="text-gray-600 text-sm mt-2">
              LPG Marketplace & Inventory Management
            </p>
          </div>
        </div>

        <h2 className="mt-8 text-center text-3xl font-extrabold text-gray-900">
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to access your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-gray-200">
          {/* Demo Accounts Section */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Try Demo Accounts:
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => demoLogin("client")}
                className="px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
              >
                👤 Client Demo
              </button>
              <button
                type="button"
                onClick={() => demoLogin("merchant")}
                className="px-4 py-2 text-sm bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors border border-orange-200"
              >
                🏪 Merchant Demo
              </button>
              <button
                type="button"
                onClick={() => demoLogin("admin")}
                className="px-4 py-2 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors border border-purple-200"
              >
                👑 Admin Demo
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or sign in manually
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-fadeIn">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-orange-600 hover:text-orange-500"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl
                  text-sm font-medium text-white
                  ${
                    loading
                      ? "bg-orange-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  }
                  transition-all duration-200 shadow-lg hover:shadow-xl
                `}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign in to your account"
                )}
              </button>
            </div>
          </form>

          {/* Register Link */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  New to GasLink?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/register"
                className="w-full inline-flex justify-center py-3 px-4 border-2 border-orange-300 rounded-xl text-sm font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200"
              >
                Create your GasLink account
              </Link>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Lock className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-900">
                Secure Authentication
              </h3>
              <p className="text-sm text-blue-800 mt-1">
                Your credentials are encrypted. All communications are secured
                with industry-standard protocols.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} GasLink Rwanda. Phase 1: Web Platform.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Mobile App & SMS Notifications coming in future phases.
          </p>
        </div>
      </div>

      {/* Add custom animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
