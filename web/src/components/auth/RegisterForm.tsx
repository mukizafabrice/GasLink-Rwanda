import React from "react";
import { Link } from "react-router-dom";

const RegisterForm: React.FC = () => {
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-900">
        Create Your Account
      </h2>
      <p className="mt-2 text-sm text-gray-500">
        The registration flow is available on the dedicated register page.
      </p>
      <Link
        to="/register"
        className="inline-flex px-4 py-3 mt-5 font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600"
      >
        Open registration page
      </Link>
    </div>
  );
};

export default RegisterForm;
