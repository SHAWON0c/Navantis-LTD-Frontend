// src/layouts/HomeLayout.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaChartLine,
  FaVideo,
  FaGlobe,
  FaTachometerAlt,
  FaStore,
  FaUserTie,
  FaUserShield,
  FaUsers,
} from "react-icons/fa";

export default function HomeLayout() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1600); // faster splash
    return () => clearTimeout(timer);
  }, []);

  const modules = [
    { label: "Sales", icon: <FaChartLine />, link: "/dashboard" },
    { label: "CCTV", icon: <FaVideo />, link: "/cctv" },
    { label: "Website", icon: <FaGlobe />, link: "/website" },
    { label: "Dashboard", icon: <FaTachometerAlt />, link: "/dashboard" },
    { label: "Sales Website", icon: <FaStore />, link: "/sales-website" },
    { label: "HR", icon: <FaUserTie />, link: "/hr" },
    { label: "Admin", icon: <FaUserShield />, link: "/admin" },
    { label: "Employee", icon: <FaUsers />, link: "/employee" },
  ];

  // ================= SPLASH SCREEN =================
  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="splash"
          className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.img
            src="/images/NPL-Logo2.png"
            className="h-28 mb-6"
            initial={{ scale: 0.3, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
          />

          <motion.h1
            className="text-4xl font-bold tracking-widest"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            EMS SYSTEM
          </motion.h1>

          <motion.div
            className="mt-4 h-1 w-40 bg-gray-700 overflow-hidden rounded"
          >
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.2 }}
            />
          </motion.div>
        </motion.div>
      ) : (
        // ================= MAIN DASHBOARD =================
        <motion.div
          key="home"
          className="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 to-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Navbar */}
          <div className="w-full bg-white/80 backdrop-blur-lg shadow-md py-3 px-6 flex items-center gap-4">
            <img src="/images/NPL-Logo2.png" className="h-12" />
            <h2 className="text-xl font-bold">Enterprise Management System</h2>
          </div>

          {/* Dashboard Grid */}
          <div className="flex-1 flex items-center justify-center p-8 perspective-[1200px]">
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.12 } },
              }}
            >
              {modules.map((mod) => (
                <motion.div
                  key={mod.label}
                  variants={{
                    hidden: { opacity: 0, y: 50, rotateX: 70, scale: 0.8 },
                    show: { opacity: 1, y: 0, rotateX: 0, scale: 1 },
                  }}
                  transition={{ type: "spring", stiffness: 180, damping: 15 }}
                >
                  <Link to={mod.link}>
                    <motion.div
                      className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl p-6 flex flex-col items-center cursor-pointer"
                      whileHover={{
                        scale: 1.12,
                        rotateY: 12,
                        rotateX: -6,
                        boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        transformStyle: "preserve-3d",
                        willChange: "transform",
                      }}
                    >
                      <div className="text-5xl text-blue-600 mb-3">
                        {mod.icon}
                      </div>
                      <span className="font-semibold text-lg">{mod.label}</span>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Footer */}
          <footer className="bg-white/70 backdrop-blur text-center p-4 text-sm">
            © {new Date().getFullYear()} EMS System
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
