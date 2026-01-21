import React from 'react';
import { Flame, MapPin, Phone, Shield, Truck } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-md">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">GasLink</h1>
                <p className="text-xs font-medium text-primary-600">Rwanda</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="items-center hidden space-x-8 md:flex">
              <a href="#" className="font-medium text-gray-700 transition-colors hover:text-primary-600">
                Find Gas
              </a>
              <a href="#" className="font-medium text-gray-700 transition-colors hover:text-primary-600">
                How It Works
              </a>
              <a href="#" className="font-medium text-gray-700 transition-colors hover:text-primary-600">
                For Businesses
              </a>
              <a href="#" className="font-medium text-gray-700 transition-colors hover:text-primary-600">
                Safety
              </a>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 font-medium text-primary-600 hover:text-primary-700">
                Sign In
              </button>
              <button className="px-6 py-2 font-semibold text-white transition-shadow bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl hover:shadow-lg">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Features Section */}
      <section className="py-12 mt-12 bg-gradient-to-r from-primary-50 to-primary-100">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="flex items-center justify-center mx-auto mb-4 bg-white shadow-lg w-14 h-14 rounded-2xl">
                <MapPin className="w-7 h-7 text-primary-500" />
              </div>
              <h3 className="mb-2 font-bold text-gray-900">Find Nearby</h3>
              <p className="text-sm text-gray-600">Locate gas dealers in your area</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mx-auto mb-4 bg-white shadow-lg w-14 h-14 rounded-2xl">
                <Truck className="w-7 h-7 text-primary-500" />
              </div>
              <h3 className="mb-2 font-bold text-gray-900">Fast Delivery</h3>
              <p className="text-sm text-gray-600">Quick delivery to your location</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mx-auto mb-4 bg-white shadow-lg w-14 h-14 rounded-2xl">
                <Shield className="w-7 h-7 text-primary-500" />
              </div>
              <h3 className="mb-2 font-bold text-gray-900">Safe Handling</h3>
              <p className="text-sm text-gray-600">Certified professionals only</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mx-auto mb-4 bg-white shadow-lg w-14 h-14 rounded-2xl">
                <Phone className="w-7 h-7 text-primary-500" />
              </div>
              <h3 className="mb-2 font-bold text-gray-900">24/7 Support</h3>
              <p className="text-sm text-gray-600">Always here to help you</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-white bg-gray-900">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center mb-6 space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-primary-500 rounded-xl">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">GasLink Rwanda</h2>
                  <p className="text-sm text-primary-300">Clean Cooking Solution</p>
                </div>
              </div>
              <p className="text-gray-400">
                Connecting Rwanda with reliable LPG gas delivery services.
              </p>
            </div>
            
            <div>
              <h3 className="mb-4 font-bold">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">Find Gas</a></li>
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">Become a Merchant</a></li>
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">Driver Jobs</a></li>
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">Safety Guide</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="mb-4 font-bold">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">FAQ</a></li>
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="mb-4 font-bold">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Kigali, Rwanda</li>
                <li>info@gaslink.rw</li>
                <li>+250 788 123 456</li>
                <li>Mon - Sun: 6:00 AM - 10:00 PM</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 mt-12 text-center border-t border-gray-800">
            <p className="text-gray-500">
              © {new Date().getFullYear()} GasLink Rwanda. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;