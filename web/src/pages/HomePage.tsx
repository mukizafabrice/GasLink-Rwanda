import React from 'react';
import { motion } from 'framer-motion';
import { Flame, MapPin, Search, Shield, Truck, Award, Users, Clock } from 'lucide-react';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Find Nearby Dealers',
      description: 'Locate gas merchants in your province, district, and sector',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: 'Fast Delivery',
      description: 'Get your gas delivered within hours, not days',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Safe & Certified',
      description: 'All merchants and drivers are verified and trained',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Quality Brands',
      description: 'Choose from trusted brands like Jibu, Kgali Gas, and Meru',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const stats = [
    { value: '50+', label: 'Gas Dealers', icon: <Users className="w-5 h-5" /> },
    { value: '24h', label: 'Delivery Time', icon: <Clock className="w-5 h-5" /> },
    { value: '5★', label: 'Rated Service', icon: <Award className="w-5 h-5" /> },
    { value: '100%', label: 'Safe Delivery', icon: <Shield className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-100">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl">
              <Flame className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="mb-6 text-5xl font-bold text-gray-900 md:text-6xl">
              Find & Order <span className="text-transparent bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text">Gas</span> Near You
            </h1>
            
            <p className="mb-10 text-xl text-gray-600">
              GasLink Rwanda connects you with reliable LPG gas dealers. 
              Fast delivery, transparent pricing, and safe handling across Rwanda.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-4 top-1/2" />
                <input
                  type="text"
                  placeholder="Enter your location (Province, District, Sector)..."
                  className="w-full py-4 pl-12 pr-4 text-lg transition-all border-2 border-gray-300 outline-none rounded-2xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                />
                <button className="absolute px-6 py-2 font-semibold text-white transition-shadow right-2 top-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl hover:shadow-lg">
                  Find Gas
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 text-center border border-gray-200 shadow-sm bg-gradient-to-br from-gray-50 to-white rounded-2xl"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-primary-100 rounded-xl">
                  <div className="text-primary-600">
                    {stat.icon}
                  </div>
                </div>
                <div className="mb-1 text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Why Choose GasLink?
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-600">
              We're revolutionizing LPG gas delivery in Rwanda with technology and safety
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="p-6 transition-all duration-300 bg-white border border-gray-200 shadow-sm rounded-2xl hover:shadow-xl"
              >
                <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-primary-600">
        <div className="max-w-4xl px-4 mx-auto text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-4xl font-bold text-white">
            Ready to Get Started?
          </h2>
          <p className="max-w-2xl mx-auto mb-10 text-xl text-primary-100">
            Join thousands of Rwandans who trust GasLink for their LPG gas needs
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button className="px-8 py-4 text-lg font-bold transition-shadow bg-white text-primary-600 rounded-2xl hover:shadow-2xl">
              Find Gas Near You
            </button>
            <button className="px-8 py-4 text-lg font-bold text-white transition-colors bg-transparent border-2 border-white rounded-2xl hover:bg-white/10">
              Become a Merchant
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;