import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <Link
          to="/"
          className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-600 mb-8">Join GasLink Rwanda today</p>
          
          <div className="space-y-6">
            {/* Registration form would go here */}
            <p className="text-center text-gray-500">
              Registration form coming soon...
            </p>
            
            <Link
              to="/login"
              className="block text-center text-orange-600 hover:text-orange-700"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;