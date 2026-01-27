import React from "react";
import { Building2, Phone, Mail, MapPin, Shield } from "lucide-react";

const MerchantFooter: React.FC = () => {
  return (
    <footer className="px-4 py-6 bg-white border-t border-gray-200 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="p-2 mr-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                GasLink Merchant
              </p>
              <p className="text-xs text-gray-500">
                Powering Your LPG Business
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2 text-green-500" />
              <span>Verified Account</span>
            </div>
            <a href="#" className="hover:text-orange-600">
              Support
            </a>
            <a href="#" className="hover:text-orange-600">
              Help Center
            </a>
            <a href="#" className="hover:text-orange-600">
              Terms
            </a>
          </div>

          <div className="mt-4 text-sm text-gray-500 md:mt-0">
            © {new Date().getFullYear()} Your Shop Name. All rights reserved.
          </div>
        </div>

        {/* Contact Info */}
        <div className="pt-6 mt-6 text-xs text-center text-gray-400 border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-center space-x-6">
            <div className="flex items-center">
              <Phone className="w-3 h-3 mr-2" />
              <span>+250 788 123 456</span>
            </div>
            <div className="flex items-center">
              <Mail className="w-3 h-3 mr-2" />
              <span>shop@example.com</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-3 h-3 mr-2" />
              <span>Kigali, Rwanda</span>
            </div>
          </div>
          <p className="mt-2">
            Need help? Contact our merchant support team 24/7
          </p>
        </div>
      </div>
    </footer>
  );
};

export default MerchantFooter;
