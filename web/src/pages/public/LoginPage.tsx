import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle, Flame } from "lucide-react";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // If user already has a valid JWT token, redirect them
    if (authService.isAuthenticated()) {
      const user = authService.getCurrentUser();
      if (user) {
        switch (user.role) {
          case "ADMIN":
            navigate("/admin/dashboard");
            break;
          case "MERCHANT":
            navigate("/merchant/dashboard");
            break;
          case "CLIENT":
            navigate("/client/browse");
            break;
        }
      }
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authService.login(
        formData.email,
        formData.password,
      );

      if (response.success && response.data) {
        authService.setAuthData(response.data.token, response.data.user);
        login(response.data.user);
        toast.success("Welcome back to GasLink");

        const role = response.data.user.role;
        if (role === "ADMIN") {
          navigate("/admin/dashboard");
        } else if (role === "MERCHANT") {
          navigate("/merchant/dashboard");
        } else {
          navigate("/client/browse");
        }
      } else {
        setError(response.message || "Invalid email or password");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
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

  const demoLogin = (account: string) => {
    const accounts = {
      admin: { email: "admin@gaslink.rw", password: "Admin123!" },
      merchant: { email: "merchant@example.com", password: "Merchant123!" },
      client: { email: "client@example.com", password: "Client123!" },
    };

    if (accounts[account as keyof typeof accounts]) {
      setFormData(accounts[account as keyof typeof accounts]);
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-screen py-12 bg-gray-50 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-500 rounded-xl">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">GasLink</h1>
              <p className="text-sm text-gray-600">Rwanda</p>
            </div>
          </div>
        </div>

        <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-center text-gray-600">
          Use your email and password to access the platform
        </p>
        <div className="mt-4 text-center">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-orange-600 hover:text-orange-500 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to GasLink
          </Link>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="p-4 mb-4 border border-red-200 rounded-lg bg-red-50">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-3 text-red-600" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Demo Accounts Section */}
          <div className="mb-6">
            <p className="mb-3 text-sm font-medium text-gray-700">
              Quick Login (Demo):
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => demoLogin("admin")}
                className="px-4 py-2 text-sm text-purple-700 transition-colors bg-purple-100 rounded-lg hover:bg-purple-200"
              >
                Admin Account
              </button>
              <button
                type="button"
                onClick={() => demoLogin("merchant")}
                className="px-4 py-2 text-sm text-orange-700 transition-colors bg-orange-100 rounded-lg hover:bg-orange-200"
              >
                Merchant Account
              </button>
              <button
                type="button"
                onClick={() => demoLogin("client")}
                className="px-4 py-2 text-sm text-blue-700 transition-colors bg-blue-100 rounded-lg hover:bg-blue-200"
              >
                Client Account
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <label
                  htmlFor="remember-me"
                  className="block ml-2 text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-orange-600 hover:text-orange-500"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-lg shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg
                      className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
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
                  "Sign in"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-500 bg-white">
                  New to GasLink?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/register"
                className="inline-flex justify-center w-full px-4 py-3 text-sm font-medium text-orange-600 transition-colors border-2 border-orange-300 rounded-lg bg-orange-50 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Create your account
              </Link>
            </div>
          </div>

          {/* Security Note */}
          <div className="p-4 mt-8 border border-blue-200 rounded-lg bg-blue-50">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Lock className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-900">
                  Secure Authentication
                </h3>
                <p className="mt-1 text-sm text-blue-800">
                  Your credentials are encrypted. All communications are secured
                  with industry-standard protocols.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} GasLink Rwanda. All rights reserved.
          </p>
          <p className="mt-1 text-xs text-gray-400">Phase 1: Web Platform</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
