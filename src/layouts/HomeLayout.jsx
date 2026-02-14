// src/layouts/HomeLayout.jsx
import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function  HomeLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="bg-blue-500 text-red-400 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-5xl font-bold">
            MyApp
          </Link>
          <nav className="space-x-4">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            {/* Add more links here */}
            {/* <Link to="/about" className="hover:underline">About</Link> */}
          </nav>
        </div>
      </header>


      {/* Footer */}
      <footer className="bg-gray-200 text-center p-4 mt-auto">
        &copy; {new Date().getFullYear()} MyApp. All rights reserved.
      </footer>
    </div>
  );
}
