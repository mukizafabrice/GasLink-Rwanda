import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Flame,
  Truck,
  Shield,
  Users,
  MapPin,
  CheckCircle,
  BarChart,
  Clock,
  Building,
  ShoppingCart,
  ChevronRight,
  ChevronLeft,
  Play,
  Star,
  Award,
  Phone,
  Mail,
  Menu,
  X,
  ArrowRight,
  Zap,
  Package,
  TrendingUp,
  Home,
  Globe,
} from "lucide-react";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Testimonials data
  const testimonials = [
    {
      name: "Jean Paul U.",
      role: "Restaurant Owner, Kigali",
      content:
        "GasLink has transformed how I manage my LPG supply. Never run out of gas again!",
      rating: 5,
      avatar: "JP",
    },
    {
      name: "Marie A.",
      role: "Household Client, Nyarugenge",
      content:
        "Finding reliable gas suppliers in my area was hard. Now with GasLink, it's one click away.",
      rating: 5,
      avatar: "MA",
    },
    {
      name: "GasMart Ltd.",
      role: "LPG Merchant, Gasabo",
      content:
        "Our sales increased by 40% since joining GasLink. The inventory management is fantastic.",
      rating: 5,
      avatar: "GM",
    },
  ];

  // Features data
  const features = [
    {
      icon: <Flame className="h-8 w-8" />,
      title: "Smart Marketplace",
      description: "Connect buyers and sellers in Rwanda's LPG ecosystem",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: <Package className="h-8 w-8" />,
      title: "Inventory Management",
      description: "Real-time stock tracking and automated alerts",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Business Analytics",
      description: "Sales reports and performance insights",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure Platform",
      description: "Verified merchants and safe transactions",
      color: "from-purple-500 to-pink-500",
    },
  ];

  // How it works steps
  const steps = [
    {
      number: "01",
      title: "Browse & Discover",
      description:
        "Find LPG merchants by location with real-time stock availability",
      icon: <MapPin className="h-6 w-6" />,
    },
    {
      number: "02",
      title: "Place Order",
      description: "Select products, quantity, and delivery preferences",
      icon: <ShoppingCart className="h-6 w-6" />,
    },
    {
      number: "03",
      title: "Merchant Approval",
      description: "Merchant confirms order and prepares for pickup/delivery",
      icon: <CheckCircle className="h-6 w-6" />,
    },
    {
      number: "04",
      title: "Complete Transaction",
      description: "Offline payment and order completion",
      icon: <Zap className="h-6 w-6" />,
    },
  ];

  // Statistics
  const stats = [
    {
      value: "50+",
      label: "Active Merchants",
      icon: <Building className="h-5 w-5" />,
    },
    {
      value: "1,200+",
      label: "Happy Clients",
      icon: <Users className="h-5 w-5" />,
    },
    {
      value: "5,000+",
      label: "Orders Processed",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      value: "100%",
      label: "Secure Platform",
      icon: <Shield className="h-5 w-5" />,
    },
  ];

  // Auto slide testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-2 rounded-xl">
                <Flame className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">GasLink</h1>
                <p className="text-xs text-orange-600 font-medium">Rwanda</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
              >
                How it Works
              </a>
              <a
                href="#testimonials"
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
              >
                Testimonials
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
              >
                Contact
              </a>

              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <a
                  href="#features"
                  className="text-gray-700 hover:text-orange-600 font-medium"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-gray-700 hover:text-orange-600 font-medium"
                >
                  How it Works
                </a>
                <a
                  href="#testimonials"
                  className="text-gray-700 hover:text-orange-600 font-medium"
                >
                  Testimonials
                </a>
                <a
                  href="#contact"
                  className="text-gray-700 hover:text-orange-600 font-medium"
                >
                  Contact
                </a>
                <div className="pt-4 space-y-3">
                  <Link
                    to="/login"
                    className="block text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-medium text-center hover:from-orange-600 hover:to-orange-700 transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-6">
                <Award className="h-4 w-4 mr-2" />
                Rwanda's Leading LPG Marketplace
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Connect. Order.{" "}
                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  Deliver.
                </span>
              </h1>

              <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                GasLink Rwanda revolutionizes LPG distribution with a seamless
                web platform connecting merchants and clients across Rwanda.
                Real-time inventory, smart ordering, and efficient management in
                one place.
              </p>

              {/* CTA Buttons */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="group bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <button
                  onClick={() => navigate("/login")}
                  className="bg-white text-gray-700 border-2 border-gray-300 px-8 py-4 rounded-xl font-semibold text-lg hover:border-orange-500 hover:text-orange-600 transition-all shadow-lg hover:shadow-xl"
                >
                  Watch Demo
                  <Play className="inline ml-2 h-5 w-5" />
                </button>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 mt-1 flex items-center justify-center">
                      {stat.icon}
                      <span className="ml-2">{stat.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image/Illustration */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-3xl p-8">
                {/* Dashboard Preview */}
                <div className="bg-white rounded-2xl shadow-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="bg-orange-100 p-2 rounded-lg">
                        <Flame className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Merchant Dashboard
                        </h3>
                        <p className="text-sm text-gray-500">
                          Kigali Gas Supplies
                        </p>
                      </div>
                    </div>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Live
                    </div>
                  </div>

                  {/* Stats Preview */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-gray-900">42</div>
                      <div className="text-sm text-gray-600">Active Orders</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-gray-900">
                        RWF 1.2M
                      </div>
                      <div className="text-sm text-gray-600">
                        Today's Revenue
                      </div>
                    </div>
                  </div>

                  {/* Product Preview */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <span className="font-medium">12kg Cooking Gas</span>
                      </div>
                      <span className="font-bold">RWF 25,000</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <span className="font-medium">6kg Cooking Gas</span>
                      </div>
                      <span className="font-bold">RWF 14,000</span>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-white p-4 rounded-2xl shadow-xl">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-lg mr-3">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">+40%</div>
                      <div className="text-sm text-gray-600">Sales Growth</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-2xl shadow-xl">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">98%</div>
                      <div className="text-sm text-gray-600">
                        Client Satisfaction
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900">
              Everything You Need for LPG Business
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive platform designed specifically for Rwanda's LPG
              ecosystem
            </p>
          </div>

          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white p-8 rounded-2xl border border-gray-200 hover:border-orange-300 transition-all duration-300 hover:shadow-2xl"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
                />
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-6`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-20 bg-gradient-to-b from-white to-orange-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900">
              How GasLink Works
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, efficient, and designed for Rwanda's unique needs
            </p>
          </div>

          <div className="mt-16 relative">
            {/* Timeline Line */}
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-orange-500 to-red-500 top-1/2 w-full" />

            <div className="grid lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
                    <div className="text-4xl font-bold text-orange-500 mb-4">
                      {step.number}
                    </div>
                    <div className="inline-flex p-3 bg-orange-100 rounded-xl text-orange-600 mb-4">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900">
              Built for Everyone
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're buying or selling LPG, GasLink has you covered
            </p>
          </div>

          <div className="mt-16 grid md:grid-cols-2 gap-8">
            {/* Client Card */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-4 rounded-2xl mr-4">
                  <Home className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    For Clients & Households
                  </h3>
                  <p className="text-blue-600 font-medium">
                    Buy LPG with confidence
                  </p>
                </div>
              </div>

              <ul className="space-y-4">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Browse verified merchants by location</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Real-time stock availability</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Order tracking and history</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Save favorite merchants</span>
                </li>
              </ul>

              <Link
                to="/register?role=client"
                className="mt-8 inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl"
              >
                Register as Client
              </Link>
            </div>

            {/* Merchant Card */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-8">
              <div className="flex items-center mb-6">
                <div className="bg-orange-100 p-4 rounded-2xl mr-4">
                  <Building className="h-8 w-8 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    For LPG Merchants
                  </h3>
                  <p className="text-orange-600 font-medium">
                    Grow your business efficiently
                  </p>
                </div>
              </div>

              <ul className="space-y-4">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Inventory management system</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Order approval workflow</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Sales analytics and reports</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Public shop page</span>
                </li>
              </ul>

              <Link
                to="/register?role=merchant"
                className="mt-8 inline-flex items-center justify-center w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl"
              >
                Register as Merchant
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-20 bg-gradient-to-b from-white to-orange-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900">
              Trusted by Rwandans
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              See what our users say about GasLink Rwanda
            </p>
          </div>

          <div className="mt-16 relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-2xl mx-auto">
                      <div className="flex items-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                          {testimonial.avatar}
                        </div>
                        <div className="ml-6">
                          <h4 className="text-xl font-bold text-gray-900">
                            {testimonial.name}
                          </h4>
                          <p className="text-gray-600">{testimonial.role}</p>
                          <div className="flex mt-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-5 w-5 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-lg text-gray-700 italic">
                        "{testimonial.content}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center mt-8 space-x-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentSlide === index
                      ? "bg-orange-600 w-8"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() =>
                setCurrentSlide(
                  (prev) =>
                    (prev - 1 + testimonials.length) % testimonials.length,
                )
              }
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>
            <button
              onClick={() =>
                setCurrentSlide((prev) => (prev + 1) % testimonials.length)
              }
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 via-orange-600 to-red-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your LPG Experience?
            </h2>
            <p className="text-xl text-orange-100 mb-10 max-w-3xl mx-auto">
              Join hundreds of merchants and clients already using GasLink
              Rwanda
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/register"
                className="bg-white text-orange-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-orange-50 transition-all shadow-2xl hover:shadow-3xl"
              >
                Start Free Trial
              </Link>

              <button
                onClick={() => navigate("/login")}
                className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all"
              >
                Schedule Demo
              </button>
            </div>

            <p className="mt-8 text-orange-200 text-sm">
              No credit card required • 14-day free trial • Full support
              included
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-orange-500 p-2 rounded-lg">
                  <Flame className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">GasLink</h3>
                  <p className="text-orange-400 text-sm">Rwanda</p>
                </div>
              </div>
              <p className="text-gray-400">
                Revolutionizing LPG distribution across Rwanda with technology
                and innovation.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Platform</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a
                    href="#features"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="hover:text-orange-400 transition-colors"
                  >
                    How it Works
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Testimonials
                  </a>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Contact</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-orange-400" />
                  +250 788 123 456
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-orange-400" />
                  hello@gaslink.rw
                </li>
                <li className="flex items-center">
                  <Globe className="h-5 w-5 mr-3 text-orange-400" />
                  Kigali, Rwanda
                </li>
              </ul>

              <div className="mt-6">
                <p className="text-gray-400 text-sm">Follow Us</p>
                <div className="flex space-x-4 mt-3">
                  {/* Social media icons would go here */}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
            <p>
              © {new Date().getFullYear()} GasLink Rwanda. All rights reserved.
            </p>
            <p className="mt-2">
              Phase 1: Web Platform • Phase 2: Mobile App • Phase 3: SMS
              Integration
            </p>
            <p className="mt-2 text-gray-600">Made with ❤️ for Rwanda</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
