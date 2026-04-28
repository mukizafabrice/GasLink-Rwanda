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
import usePublicStats from "@/hooks/usePublicStats";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { stats: platformStats, loading: statsLoading } = usePublicStats();

  const handleContactSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get("name") as string) || "";
    const company = (formData.get("company") as string) || "";
    const email = (formData.get("email") as string) || "";
    const message = (formData.get("message") as string) || "";

    const subject = encodeURIComponent(
      name ? `GasLink Contact - ${name}` : "GasLink Contact",
    );
    const body = [
      name ? `Name: ${name}` : null,
      company ? `Company: ${company}` : null,
      email ? `Email: ${email}` : null,
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = `mailto:hello@gaslink.rw?subject=${subject}&body=${encodeURIComponent(
      body,
    )}`;
    form.reset();
  };

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
      icon: <Flame className="w-8 h-8" />,
      title: "Smart Marketplace",
      description: "Connect buyers and sellers in Rwanda's LPG ecosystem",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: "Inventory Management",
      description: "Real-time stock tracking and automated alerts",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Business Analytics",
      description: "Sales reports and performance insights",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <Shield className="w-8 h-8" />,
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
      icon: <MapPin className="w-6 h-6" />,
    },
    {
      number: "02",
      title: "Place Order",
      description: "Select products, quantity, and delivery preferences",
      icon: <ShoppingCart className="w-6 h-6" />,
    },
    {
      number: "03",
      title: "Merchant Approval",
      description: "Merchant confirms order and prepares for pickup/delivery",
      icon: <CheckCircle className="w-6 h-6" />,
    },
    {
      number: "04",
      title: "Complete Transaction",
      description: "Offline payment and order completion",
      icon: <Zap className="w-6 h-6" />,
    },
  ];

  // Statistics
  const stats = [
    {
      value: statsLoading
        ? "--"
        : platformStats.activeMerchants.toLocaleString(),
      label: "Active Merchants",
      icon: <Building className="w-5 h-5" />,
    },
    {
      value: statsLoading
        ? "--"
        : platformStats.activeClients.toLocaleString(),
      label: "Engaged Clients",
      icon: <Users className="w-5 h-5" />,
    },
    {
      value: statsLoading
        ? "--"
        : platformStats.totalOrders.toLocaleString(),
      label: "Orders Processed",
      icon: <ShoppingCart className="w-5 h-5" />,
    },
    {
      value: statsLoading
        ? "--"
        : `${platformStats.securePlatformScore}%`,
      label: "Secure Platform",
      icon: <Shield className="w-5 h-5" />,
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
      <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur-md">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">GasLink</h1>
                <p className="text-xs font-medium text-orange-600">Rwanda</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="items-center hidden space-x-8 md:flex">
              <a
                href="#features"
                className="font-medium text-gray-700 transition-colors hover:text-orange-600"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="font-medium text-gray-700 transition-colors hover:text-orange-600"
              >
                How it Works
              </a>
              <a
                href="#testimonials"
                className="font-medium text-gray-700 transition-colors hover:text-orange-600"
              >
                Testimonials
              </a>
              <a
                href="#contact"
                className="font-medium text-gray-700 transition-colors hover:text-orange-600"
              >
                Contact
              </a>

              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="font-medium text-orange-600 transition-colors hover:text-orange-700"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 font-medium text-white transition-all shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700 hover:shadow-xl"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg md:hidden hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="py-4 border-t border-gray-200 md:hidden">
              <div className="flex flex-col space-y-4">
                <a
                  href="#features"
                  className="font-medium text-gray-700 hover:text-orange-600"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="font-medium text-gray-700 hover:text-orange-600"
                >
                  How it Works
                </a>
                <a
                  href="#testimonials"
                  className="font-medium text-gray-700 hover:text-orange-600"
                >
                  Testimonials
                </a>
                <a
                  href="#contact"
                  className="font-medium text-gray-700 hover:text-orange-600"
                >
                  Contact
                </a>
                <div className="pt-4 space-y-3">
                  <Link
                    to="/login"
                    className="block font-medium text-orange-600 hover:text-orange-700"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block px-6 py-3 font-medium text-center text-white transition-all bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700"
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
      <section className="px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Hero Content */}
            <div>
              <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-orange-700 bg-orange-100 rounded-full">
                <Award className="w-4 h-4 mr-2" />
                Rwanda's Leading LPG Marketplace
              </div>

              <h1 className="text-5xl font-bold leading-tight text-gray-900 md:text-6xl">
                Connect. Order.{" "}
                <span className="text-transparent bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text">
                  Deliver.
                </span>
              </h1>

              <p className="mt-6 text-xl leading-relaxed text-gray-600">
                GasLink Rwanda revolutionizes LPG distribution with a seamless
                web platform connecting merchants and clients across Rwanda.
                Real-time inventory, smart ordering, and efficient management in
                one place.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-4 mt-10 sm:flex-row">
                <Link
                  to="/register"
                  className="flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all shadow-xl group bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700 hover:shadow-2xl"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>

                <button
                  onClick={() => navigate("/login")}
                  className="px-8 py-4 text-lg font-semibold text-gray-700 transition-all bg-white border-2 border-gray-300 shadow-lg rounded-xl hover:border-orange-500 hover:text-orange-600 hover:shadow-xl"
                >
                  Watch Demo
                  <Play className="inline w-5 h-5 ml-2" />
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 mt-12 md:grid-cols-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="flex items-center justify-center mt-1 text-sm text-gray-600">
                      {stat.icon}
                      <span className="ml-2">{stat.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image/Illustration */}
            <div className="relative">
              <div className="relative p-8 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-3xl">
                {/* Dashboard Preview */}
                <div className="p-6 bg-white shadow-2xl rounded-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Flame className="w-6 h-6 text-orange-600" />
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
                    <div className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                      Live
                    </div>
                  </div>

                  {/* Stats Preview */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-2xl font-bold text-gray-900">42</div>
                      <div className="text-sm text-gray-600">Active Orders</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
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
                    <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50">
                      <div className="flex items-center">
                        <div className="w-3 h-3 mr-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium">12kg Cooking Gas</span>
                      </div>
                      <span className="font-bold">RWF 25,000</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center">
                        <div className="w-3 h-3 mr-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium">6kg Cooking Gas</span>
                      </div>
                      <span className="font-bold">RWF 14,000</span>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute p-4 bg-white shadow-xl -top-4 -right-4 rounded-2xl">
                  <div className="flex items-center">
                    <div className="p-2 mr-3 bg-green-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">+40%</div>
                      <div className="text-sm text-gray-600">Sales Growth</div>
                    </div>
                  </div>
                </div>

                <div className="absolute p-4 bg-white shadow-xl -bottom-4 -left-4 rounded-2xl">
                  <div className="flex items-center">
                    <div className="p-2 mr-3 bg-blue-100 rounded-lg">
                      <Users className="w-5 h-5 text-blue-600" />
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
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900">
              Everything You Need for LPG Business
            </h2>
            <p className="max-w-3xl mx-auto mt-4 text-xl text-gray-600">
              A comprehensive platform designed specifically for Rwanda's LPG
              ecosystem
            </p>
          </div>

          <div className="grid gap-8 mt-16 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="relative p-8 transition-all duration-300 bg-white border border-gray-200 group rounded-2xl hover:border-orange-300 hover:shadow-2xl"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
                />
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-6`}
                >
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">
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
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900">
              How GasLink Works
            </h2>
            <p className="max-w-3xl mx-auto mt-4 text-xl text-gray-600">
              Simple, efficient, and designed for Rwanda's unique needs
            </p>
          </div>

          <div className="relative mt-16">
            {/* Timeline Line */}
            <div className="absolute hidden w-full h-1 transform -translate-x-1/2 lg:block left-1/2 bg-gradient-to-r from-orange-500 to-red-500 top-1/2" />

            <div className="grid gap-8 lg:grid-cols-4">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="p-8 transition-shadow duration-300 bg-white border border-gray-200 shadow-xl rounded-2xl hover:shadow-2xl">
                    <div className="mb-4 text-4xl font-bold text-orange-500">
                      {step.number}
                    </div>
                    <div className="inline-flex p-3 mb-4 text-orange-600 bg-orange-100 rounded-xl">
                      {step.icon}
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-gray-900">
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
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900">
              Built for Everyone
            </h2>
            <p className="max-w-3xl mx-auto mt-4 text-xl text-gray-600">
              Whether you're buying or selling LPG, GasLink has you covered
            </p>
          </div>

          <div className="grid gap-8 mt-16 md:grid-cols-2">
            {/* Client Card */}
            <div className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl">
              <div className="flex items-center mb-6">
                <div className="p-4 mr-4 bg-blue-100 rounded-2xl">
                  <Home className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    For Clients & Households
                  </h3>
                  <p className="font-medium text-blue-600">
                    Buy LPG with confidence
                  </p>
                </div>
              </div>

              <ul className="space-y-4">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
                  <span>Browse verified merchants by location</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
                  <span>Real-time stock availability</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
                  <span>Order tracking and history</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
                  <span>Save favorite merchants</span>
                </li>
              </ul>

              <Link
                to="/register?role=client"
                className="inline-flex items-center justify-center w-full py-3 mt-8 font-semibold text-white transition-all shadow-lg bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl hover:from-blue-600 hover:to-cyan-600 hover:shadow-xl"
              >
                Register as Client
              </Link>
            </div>

            {/* Merchant Card */}
            <div className="p-8 bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl">
              <div className="flex items-center mb-6">
                <div className="p-4 mr-4 bg-orange-100 rounded-2xl">
                  <Building className="w-8 h-8 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    For LPG Merchants
                  </h3>
                  <p className="font-medium text-orange-600">
                    Grow your business efficiently
                  </p>
                </div>
              </div>

              <ul className="space-y-4">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
                  <span>Inventory management system</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
                  <span>Order approval workflow</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
                  <span>Sales analytics and reports</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
                  <span>Public shop page</span>
                </li>
              </ul>

              <Link
                to="/register?role=merchant"
                className="inline-flex items-center justify-center w-full py-3 mt-8 font-semibold text-white transition-all shadow-lg bg-gradient-to-r from-orange-500 to-red-500 rounded-xl hover:from-orange-600 hover:to-red-600 hover:shadow-xl"
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
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900">
              Trusted by Rwandans
            </h2>
            <p className="max-w-3xl mx-auto mt-4 text-xl text-gray-600">
              See what our users say about GasLink Rwanda
            </p>
          </div>

          <div className="relative mt-16">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="flex-shrink-0 w-full px-4">
                    <div className="max-w-2xl p-8 mx-auto bg-white shadow-2xl rounded-3xl">
                      <div className="flex items-center mb-6">
                        <div className="flex items-center justify-center w-16 h-16 text-xl font-bold text-white rounded-full bg-gradient-to-r from-orange-500 to-red-500">
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
                                className="w-5 h-5 text-yellow-400 fill-yellow-400"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-lg italic text-gray-700">
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
              className="absolute p-3 transition-all transform -translate-y-1/2 bg-white rounded-full shadow-lg left-4 top-1/2 hover:shadow-xl"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button
              onClick={() =>
                setCurrentSlide((prev) => (prev + 1) % testimonials.length)
              }
              className="absolute p-3 transition-all transform -translate-y-1/2 bg-white rounded-full shadow-lg right-4 top-1/2 hover:shadow-xl"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold tracking-wider text-orange-600 uppercase">
                Get in touch
              </p>
              <h2 className="mt-3 text-4xl font-bold text-gray-900">
                Let’s talk about your LPG operations
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-gray-600">
                Whether you are a merchant looking to digitize your distribution,
                or a business searching for reliable LPG suppliers, our team is ready
                to help. Reach out for product demos, partnerships, or support.
              </p>

              <div className="mt-10 space-y-6">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-12 h-12 text-orange-600 bg-orange-100 rounded-xl">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm tracking-wide text-gray-500 uppercase">
                      Call us
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      +250 78 818 521
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex items-center justify-center w-12 h-12 text-orange-600 bg-orange-100 rounded-xl">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm tracking-wide text-gray-500 uppercase">
                      Email
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      info@gaslink.rw
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex items-center justify-center w-12 h-12 text-orange-600 bg-orange-100 rounded-xl">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm tracking-wide text-gray-500 uppercase">
                      Office
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      Kigali, Rwanda
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 border border-gray-200 shadow-xl bg-gray-50 rounded-3xl">
              <h3 className="text-2xl font-bold text-gray-900">
                Send us a message
              </h3>
              <p className="mt-2 text-gray-600">
                Share a few details and we will get back within one business day.
              </p>

              <form className="mt-8 space-y-6" onSubmit={handleContactSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Jane Doe"
                    className="w-full px-4 py-3 mt-2 text-gray-900 bg-white border border-gray-300 shadow-sm rounded-xl focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                    Company
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    placeholder="GasLink Ltd"
                    className="w-full px-4 py-3 mt-2 text-gray-900 bg-white border border-gray-300 shadow-sm rounded-xl focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 mt-2 text-gray-900 bg-white border border-gray-300 shadow-sm rounded-xl focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Tell us how we can help"
                    className="w-full px-4 py-3 mt-2 text-gray-900 bg-white border border-gray-300 shadow-sm rounded-xl focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-3 text-base font-semibold text-white transition-all shadow-lg rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  Send Message
                </button>

                <p className="text-sm text-gray-500">
                  By submitting this form you agree to be contacted about GasLink
                  products and services.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 via-orange-600 to-red-500">
        <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          <div className="p-12 bg-white/10 backdrop-blur-sm rounded-3xl">
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Ready to Transform Your LPG Experience?
            </h2>
            <p className="max-w-3xl mx-auto mb-10 text-xl text-orange-100">
              Join hundreds of merchants and clients already using GasLink
              Rwanda
            </p>

            <div className="flex flex-col justify-center gap-6 sm:flex-row">
              <Link
                to="/register"
                className="px-10 py-4 text-lg font-bold text-orange-600 transition-all bg-white shadow-2xl rounded-xl hover:bg-orange-50 hover:shadow-3xl"
              >
                Start Free Trial
              </Link>

              <button
                onClick={() => navigate("/login")}
                className="px-10 py-4 text-lg font-bold text-white transition-all bg-transparent border-2 border-white rounded-xl hover:bg-white/10"
              >
                Schedule Demo
              </button>
            </div>

            <p className="mt-8 text-sm text-orange-200">
              No credit card required • 14-day free trial • Full support
              included
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-white bg-gray-900">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center mb-6 space-x-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">GasLink</h3>
                  <p className="text-sm text-orange-400">Rwanda</p>
                </div>
              </div>
              <p className="text-gray-400">
                Revolutionizing LPG distribution across Rwanda with technology
                and innovation.
              </p>
            </div>

            <div>
              <h4 className="mb-6 text-lg font-bold">Platform</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a
                    href="#features"
                    className="transition-colors hover:text-orange-400"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="transition-colors hover:text-orange-400"
                  >
                    How it Works
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="transition-colors hover:text-orange-400"
                  >
                    Testimonials
                  </a>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="transition-colors hover:text-orange-400"
                  >
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-6 text-lg font-bold">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-orange-400"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-orange-400"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-orange-400"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-orange-400"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-6 text-lg font-bold">Contact</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center">
                  <Phone className="w-5 h-5 mr-3 text-orange-400" />
                  +250 783 818 521
                </li>
                <li className="flex items-center">
                  <Mail className="w-5 h-5 mr-3 text-orange-400" />
                  Info@gaslink.rw
                </li>
                <li className="flex items-center">
                  <Globe className="w-5 h-5 mr-3 text-orange-400" />
                  Kigali, Rwanda
                </li>
              </ul>

              <div className="mt-6">
                <p className="text-sm text-gray-400">Follow Us</p>
                <div className="flex mt-3 space-x-4">
                  {/* Social media icons would go here */}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 mt-12 text-sm text-center text-gray-500 border-t border-gray-800">
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
