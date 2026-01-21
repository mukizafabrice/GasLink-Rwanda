import React from "react";
import { Link } from "react-router-dom";
import {
  Flame,
  Phone,
  Mail,
  MapPin,
  Globe,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Shield,
  Award,
  Users,
  Truck,
  Building,
  ShoppingCart,
  Clock,
} from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-start space-x-4 mb-6">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-xl">
                <Flame className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">GasLink Rwanda</h2>
                <p className="text-orange-400 text-sm font-medium">
                  LPG Marketplace & Inventory Management
                </p>
              </div>
            </div>

            <p className="text-gray-400 mb-6 max-w-md">
              Revolutionizing Rwanda's LPG distribution through technology.
              Connecting merchants and clients for efficient, reliable, and safe
              gas supply across the nation.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center bg-gray-800/50 px-4 py-2 rounded-lg">
                <Shield className="h-5 w-5 text-green-400 mr-2" />
                <span className="text-sm">Secure Platform</span>
              </div>
              <div className="flex items-center bg-gray-800/50 px-4 py-2 rounded-lg">
                <Award className="h-5 w-5 text-yellow-400 mr-2" />
                <span className="text-sm">Verified Merchants</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-orange-400 transition-colors flex items-center group"
                >
                  <div className="w-1 h-4 bg-orange-500 mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-orange-400 transition-colors flex items-center group"
                >
                  <div className="w-1 h-4 bg-orange-500 mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/how-it-works"
                  className="text-gray-400 hover:text-orange-400 transition-colors flex items-center group"
                >
                  <div className="w-1 h-4 bg-orange-500 mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-gray-400 hover:text-orange-400 transition-colors flex items-center group"
                >
                  <div className="w-1 h-4 bg-orange-500 mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-orange-400 transition-colors flex items-center group"
                >
                  <div className="w-1 h-4 bg-orange-500 mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Features */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Platform</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-400">
                <Users className="h-4 w-4 mr-3 text-orange-400" />
                <span>For Clients</span>
              </li>
              <li className="flex items-center text-gray-400">
                <Building className="h-4 w-4 mr-3 text-orange-400" />
                <span>For Merchants</span>
              </li>
              <li className="flex items-center text-gray-400">
                <ShoppingCart className="h-4 w-4 mr-3 text-orange-400" />
                <span>Marketplace</span>
              </li>
              <li className="flex items-center text-gray-400">
                <Truck className="h-4 w-4 mr-3 text-orange-400" />
                <span>Inventory Management</span>
              </li>
              <li className="flex items-center text-gray-400">
                <Award className="h-4 w-4 mr-3 text-orange-400" />
                <span>Verified System</span>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">
              Contact Info
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-orange-400 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  Kigali Heights, KG 7 Ave
                  <br />
                  Kigali, Rwanda
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0" />
                <a
                  href="tel:+250788123456"
                  className="text-gray-400 hover:text-orange-400 transition-colors"
                >
                  +250 788 123 456
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0" />
                <a
                  href="mailto:info@gaslink.rw"
                  className="text-gray-400 hover:text-orange-400 transition-colors"
                >
                  info@gaslink.rw
                </a>
              </li>
              <li className="flex items-center">
                <Clock className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0" />
                <span className="text-gray-400">
                  Mon - Fri: 8:00 - 18:00
                  <br />
                  Sat: 9:00 - 14:00
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
              <p className="text-gray-400">
                Subscribe to our newsletter for platform updates, tips, and
                industry news.
              </p>
            </div>
            <div>
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-gray-500 text-sm mt-3">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>

        {/* Social Media & App Download */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-800 pt-8">
          <div className="mb-6 md:mb-0">
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-gray-800 p-3 rounded-full hover:bg-orange-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 p-3 rounded-full hover:bg-orange-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 p-3 rounded-full hover:bg-orange-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 p-3 rounded-full hover:bg-orange-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* App Coming Soon Badge */}
          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-4 mb-6 md:mb-0">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-500/20 p-2 rounded-lg">
                <Globe className="h-6 w-6 text-orange-400" />
              </div>
              <div>
                <p className="font-semibold">Mobile App Coming Soon</p>
                <p className="text-sm text-gray-400">
                  Available on iOS & Android
                </p>
              </div>
            </div>
          </div>

          {/* App Store Badges (Placeholder) */}
          <div className="flex space-x-4">
            <div className="bg-gray-800 px-6 py-3 rounded-xl opacity-50 cursor-not-allowed">
              <div className="text-center">
                <div className="text-xs text-gray-500">Download on the</div>
                <div className="font-bold">App Store</div>
              </div>
            </div>
            <div className="bg-gray-800 px-6 py-3 rounded-xl opacity-50 cursor-not-allowed">
              <div className="text-center">
                <div className="text-xs text-gray-500">Get it on</div>
                <div className="font-bold">Google Play</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm mb-4 md:mb-0">
              © {currentYear} GasLink Rwanda Ltd. All rights reserved.
            </div>

            <div className="flex items-center space-x-6 text-gray-500 text-sm">
              <Link
                to="/privacy"
                className="hover:text-orange-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="hover:text-orange-400 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="hover:text-orange-400 transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>

          {/* Platform Roadmap */}
          <div className="mt-8 pt-6 border-t border-gray-800">
            <div className="text-center">
              <div className="inline-flex items-center space-x-6 bg-gray-800/50 px-6 py-3 rounded-xl">
                <div className="text-orange-400">
                  <div className="text-xs">PHASE 1</div>
                  <div className="font-semibold">Web Platform</div>
                  <div className="text-xs text-green-400">✓ Live Now</div>
                </div>
                <div className="text-gray-500">
                  <div className="text-xs">PHASE 2</div>
                  <div className="font-semibold">Mobile App</div>
                  <div className="text-xs">Coming Soon</div>
                </div>
                <div className="text-gray-500">
                  <div className="text-xs">PHASE 3</div>
                  <div className="font-semibold">SMS Integration</div>
                  <div className="text-xs">Planned</div>
                </div>
              </div>
            </div>
          </div>

          {/* Partnership Badges */}
          <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-gray-500 text-sm">
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2 text-green-400" />
              <span>Rwanda Standards Board Compliant</span>
            </div>
            <div className="hidden md:block">•</div>
            <div className="flex items-center">
              <Award className="h-4 w-4 mr-2 text-yellow-400" />
              <span>Member: Rwanda LPG Association</span>
            </div>
            <div className="hidden md:block">•</div>
            <div className="flex items-center">
              <Flame className="h-4 w-4 mr-2 text-orange-400" />
              <span>Official Partner: Ministry of Infrastructure</span>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 rounded-full shadow-2xl hover:shadow-3xl transition-all hover:scale-110 z-40"
        aria-label="Back to top"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </footer>
  );
};

export default Footer;
