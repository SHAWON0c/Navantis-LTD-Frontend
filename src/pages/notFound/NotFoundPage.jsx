// src/pages/NotFoundPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FiSettings } from "react-icons/fi"; // gear icon from react-icons

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      
      {/* Spinning Gear */}
      <div className="mb-6">
        <FiSettings className="text-6xl text-gray-400 animate-spin-slow" />
      </div>

      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">
        Oops! The page you are looking for does not exist or is under development.
      </p>
      
      <Link
        to="/dashboard"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded shadow transition"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;