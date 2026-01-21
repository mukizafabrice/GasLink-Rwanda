// src/components/auth/AuthLayout.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Flame, Shield, Truck, Users } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  type: "login" | "register" | "forgot-password";
  footerText?: string;
  footerLinkText?: string;
  footerLinkTo?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  type,
  footerText,
  footerLinkText,
  footerLinkTo,
}) => {
  return (
    <div className="flex flex-col justify-center min-h-screen py-12 bg-gray-50 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-primary-500 rounded-xl">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">GasLink</h1>
              <p className="text-sm text-gray-600">Rwanda</p>
            </div>
          </div>
        </div>

        <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-2 text-sm text-center text-gray-600">{subtitle}</p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="px-4 py-8 bg-white border border-gray-200 shadow-xl sm:rounded-2xl sm:px-10">
          {children}
        </div>

        {footerText && footerLinkText && footerLinkTo && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {footerText}{" "}
              <Link
                to={footerLinkTo}
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                {footerLinkText}
              </Link>
            </p>
          </div>
        )}

        {/* Features section for register page */}
        {type === "register" && (
          <div className="mt-10">
            <h3 className="mb-6 text-lg font-semibold text-center text-gray-900">
              Choose Your Role
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="p-6 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
                <div className="flex items-center mb-4">
                  <div className="p-3 mr-4 rounded-lg bg-primary-100">
                    <Users className="w-6 h-6 text-primary-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    Client
                  </h4>
                </div>
                <p className="text-sm text-gray-600">
                  Browse merchants, place orders, track purchases, and save
                  favorite gas suppliers.
                </p>
              </div>

              <div className="p-6 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
                <div className="flex items-center mb-4">
                  <div className="p-3 mr-4 rounded-lg bg-primary-100">
                    <Truck className="w-6 h-6 text-primary-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    Merchant
                  </h4>
                </div>
                <p className="text-sm text-gray-600">
                  Manage inventory, set prices, receive orders, and grow your
                  LPG business.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Security note for login */}
        {type === "login" && (
          <div className="p-4 mt-8 border border-blue-200 bg-blue-50 rounded-xl">
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-3 text-blue-600" />
              <p className="text-sm text-blue-800">
                Your security is our priority. All transactions are securely
                processed.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} GasLink Rwanda. All rights reserved.
          <br />
          <span className="text-xs text-gray-400">
            Phase 1: Web Platform • Coming Soon: Mobile App & SMS Notifications
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
