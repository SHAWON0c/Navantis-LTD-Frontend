



import { useState, useEffect, useRef } from "react";
import {
  Bell,
  Menu,
  Search,
  Settings,
  Grid,
  Moon,
  Sun,
  User,
  LogOut,
  Globe,
  AppWindow
} from "lucide-react";

export default function Topbar({ onMenuClick }) {
  const [darkMode, setDarkMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const settingsRef = useRef(null);
  const megaRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Load dark mode from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved === "true") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    }
    setDarkMode(!darkMode);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) setSettingsOpen(false);
      if (megaRef.current && !megaRef.current.contains(event.target)) setMegaMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target)) setNotificationsOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Common dropdown style
  const dropdownClass =
    "absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-lg rounded-md overflow-hidden z-50";

  return (
    <header className="h-16 w-full flex items-center justify-between px-4 shadow-sm bg-white dark:bg-gray-800 dark:text-gray-200">
      
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <Menu
          onClick={onMenuClick}
          className="w-5 h-5 cursor-pointer text-gray-600 dark:text-gray-200"
        />
        <span className="text-xl font-semibold tracking-wide">Architect</span>
      </div>

      {/* CENTER */}
      <div className="hidden md:flex items-center w-1/3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 dark:text-gray-300" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 relative">

        {/* Mega Menu */}
        <div className="relative" ref={megaRef}>
          <button
            onClick={() => setMegaMenuOpen(!megaMenuOpen)}
            className="text-sm text-gray-600 hover:text-black dark:text-gray-200 dark:hover:text-white"
          >
            Mega Menu
          </button>
          {megaMenuOpen && (
            <div className={dropdownClass}>
              <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <AppWindow className="w-4 h-4" /> Dashboard
              </button>
              <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <AppWindow className="w-4 h-4" /> Projects
              </button>
              <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <AppWindow className="w-4 h-4" /> Tasks
              </button>
            </div>
          )}
        </div>

        {/* Settings Dropdown */}
        <div className="relative" ref={settingsRef}>
          <Settings
            className="w-5 h-5 cursor-pointer text-gray-600 dark:text-gray-200"
            onClick={() => setSettingsOpen(!settingsOpen)}
          />
          {settingsOpen && (
            <div className={dropdownClass}>
              <button
                onClick={toggleDarkMode}
                className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="flex items-center gap-2">
                  {darkMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4" />}
                  Dark Mode
                </span>
                <span>{darkMode ? "On" : "Off"}</span>
              </button>
              <button className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Language
                </span>
                <span>🇩🇪</span>
              </button>
              <div className="border-t border-gray-200 dark:border-gray-700"></div>
              <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <User className="w-4 h-4" /> Profile
              </button>
              <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <Bell
            className="w-5 h-5 cursor-pointer text-gray-600 dark:text-gray-200"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          />
          {notificationsOpen && (
            <div className={dropdownClass}>
              <div className="px-4 py-2 font-semibold">Notifications</div>
              <div className="border-t border-gray-200 dark:border-gray-700"></div>
              <button className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                You have 3 new messages
              </button>
              <button className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                Server restarted successfully
              </button>
              <button className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                New user registered
              </button>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <img
              src="https://i.pravatar.cc/40"
              alt="user"
              className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600"
            />
            <div className="hidden lg:block text-sm">
              <div className="font-semibold">Alina Mcloud</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">VP People Manager</div>
            </div>
          </div>
          {profileOpen && (
            <div className={dropdownClass}>
              <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <User className="w-4 h-4" /> Profile
              </button>
              <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>

        {/* Grid / Apps */}
        <Grid className="w-5 h-5 cursor-pointer text-gray-600 dark:text-gray-200" />
      </div>
    </header>
  );
}
