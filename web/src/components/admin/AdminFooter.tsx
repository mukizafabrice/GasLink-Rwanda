import React from "react";

const AdminFooter: React.FC = () => {
  return (
    <footer className="px-4 py-6 bg-white border-t border-gray-200 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-between md:flex-row">
        <div className="text-sm text-gray-500">
          © {new Date().getFullYear()} GasLink Rwanda. All rights reserved.
        </div>
        <div className="flex items-center mt-4 space-x-6 text-sm text-gray-500 md:mt-0">
          <a href="#" className="hover:text-gray-700">
            Privacy
          </a>
          <a href="#" className="hover:text-gray-700">
            Terms
          </a>
          <a href="#" className="hover:text-gray-700">
            Help
          </a>
          <div className="flex items-center">
            <div className="w-2 h-2 mr-2 bg-green-500 rounded-full"></div>
            <span>System OK</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
