import React from "react";
import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center justify-center">
      <h1 className="text-8xl font-bold text-purple-500">404</h1>

      <h2 className="text-2xl font-semibold mt-4">
        Page Not Found
      </h2>

      <p className="text-gray-400 mt-2">
        The page you're looking for doesn't exist.
      </p>

      <Link
        to="/home"
        className="mt-6 px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;