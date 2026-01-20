
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
import { useDispatch } from "react-redux";
import { resetAuthState } from "../redux/features/auth/authSlice"; // adjust path
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../hooks/useUserProfile"; // ✅ import your hook

export default function Topbar({ onMenuClick }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data } = useUserProfile();

  const user = data?.data?.user;
  const org = data?.data?.organizationProfile;

  const [darkMode, setDarkMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3); // example



  const [appsOpen, setAppsOpen] = useState(false);
  const appsRef = useRef(null);


  const settingsRef = useRef(null);
  const megaRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // ⏰ Digital clock state
  const [time, setTime] = useState(new Date());

  // Load dark mode from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved === "true") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  // Update clock every second
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

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


  // Logout handler
  const handleLogout = () => {
    dispatch(resetAuthState());
    localStorage.removeItem("token");
    navigate("/login");
  };

  const dropdownClass =
    "absolute right-5 mt-5 w-56 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-lg rounded-md overflow-hidden z-50";
  const dropdownClass2 =
    "absolute right-40 mt-40 w-56 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-lg rounded-md overflow-hidden z-50 border border-gray-100";

  return (
    <header className="h-16 w-full flex items-center justify-between px-4 shadow-sm bg-white dark:bg-gray-800 dark:text-gray-200">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <Menu
          onClick={onMenuClick}
          className="w-5 h-5 cursor-pointer text-gray-600 dark:text-gray-200"
        />
        <span className="text-xl font-semibold tracking-wide">NPL EMS</span>
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
        {/* Mega Menu with Clock */}
        <div className="relative flex items-center gap-3" ref={megaRef}>
          <button
            onClick={() => setMegaMenuOpen(!megaMenuOpen)}
            className="text-sm text-gray-600 hover:text-black dark:text-gray-200 dark:hover:text-white"
          >
            Mega Menu
          </button>


          here 

          {/* ⏰ Digital Clock next to Mega Menu */}
          <div className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
            {formattedTime}
          </div>

          {megaMenuOpen && (
            <div className="absolute top-full left-0 mt-2 w-56 rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
              <ul className="py-2">
                <li>
                  <button className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    <AppWindow className="w-4 h-4" />
                    Dashboard
                  </button>
                </li>

                <li>
                  <button className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    <AppWindow className="w-4 h-4" />
                    Projects
                  </button>
                </li>

                <li>
                  <button className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    <AppWindow className="w-4 h-4" />
                    Tasks
                  </button>
                </li>


                 <li>
                  <button className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    <AppWindow className="w-4 h-4" />
                    areas
                  </button>
                </li>


              </ul>
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
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <div className="relative">
            <Bell
              className="w-5 h-5 cursor-pointer text-gray-600 dark:text-gray-200"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            />

            {/* 🔴 Notification Badge */}
            {notificationCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {notificationCount > 99 ? "99+" : notificationCount}
              </span>
            )}
          </div>

          {notificationsOpen && (
            <div className={dropdownClass}>
              <div className="px-4 py-2 font-semibold">Notifications</div>
              <div className="border-t border-gray-200 dark:border-gray-700"></div>

              <button className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700">
                You have 3 new messages
              </button>
              <button className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700">
                Server restarted successfully
              </button>
              <button className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700">
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
              src={org?.profilePic || "https://i.pravatar.cc/40"}
              alt="user"
              className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600"
            />
            <div className="hidden lg:block text-sm">
              <div className="font-semibold">{org?.name || user?.email || "User"}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{user?.role || "Role"}</div>
            </div>
          </div>
          {profileOpen && (
            <div className={dropdownClass}>
              <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <User className="w-4 h-4" /> Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>

        {/* Grid / Apps */}
        {/* Grid / Apps Dropdown */}
        <div className="relative" ref={appsRef}>
          <Grid
            className="w-5 h-5 cursor-pointer text-gray-600 dark:text-gray-200"
            onClick={() => setAppsOpen(!appsOpen)}
          />

          {appsOpen && (
            <div className="absolute right-0 mt-10 w-64 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-lg rounded-md overflow-hidden z-50 p-4 grid grid-cols-2 gap-4">
              {/* Each app button */}
              <button className="flex flex-col items-center justify-center gap-1 p-2 hover:bg-blue-300 dark:hover:bg-gray-700 rounded-md transition-colors">
                <AppWindow className="w-6 h-6" />
                <span className="text-xs">Company Calendar</span>
              </button>

              <button className="flex flex-col items-center justify-center gap-1 p-2 hover:bg-blue-300 dark:hover:bg-gray-700 rounded-md transition-colors">
                <AppWindow className="w-6 h-6" />
                <span className="text-xs">Calculator</span>
              </button>

              <button className="flex flex-col items-center justify-center gap-1 p-2 hover:bg-blue-300 dark:hover:bg-gray-700 rounded-md transition-colors">
                <AppWindow className="w-6 h-6" />
                <span className="text-xs">To-Do Notes</span>
              </button>

              <button className="flex flex-col items-center justify-center gap-1 p-2 hover:bg-blue-300 dark:hover:bg-gray-700 rounded-md transition-colors">
                <AppWindow className="w-6 h-6" />
                <span className="text-xs">Outlook</span>
              </button>

              <button className="flex flex-col items-center justify-center gap-1 p-2 hover:bg-blue-300 dark:hover:bg-gray-700 rounded-md transition-colors">
                <AppWindow className="w-6 h-6" />
                <span className="text-xs">Employee Numbers</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-1 p-2 hover:bg-blue-300 dark:hover:bg-gray-700 rounded-md transition-colors">
                <AppWindow className="w-6 h-6" />
                <span className="text-xs">Drive</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
