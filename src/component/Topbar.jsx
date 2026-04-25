import { useState, useEffect, useRef } from "react";
import { Bell, Menu, Search, Grid, User, AppWindow } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserProfile } from "../hooks/useUserProfile";

export default function Topbar({ onMenuClick, sidebarOpen = true, sidebarAnimating = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = useUserProfile();

  const payload = data?.data;
  const profile = payload?.user
    ? {
        ...payload.user,
        organizationProfile:
          payload.organizationProfile || payload.user?.organizationProfile || {},
      }
    : payload;
  const user = profile || {};
  const org = profile?.organizationProfile || {};

  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationCount] = useState(3);
  const [appsOpen, setAppsOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [searchValue, setSearchValue] = useState(() => {
    return new URLSearchParams(location.search).get("q") || "";
  });

  const appsRef = useRef(null);
  const megaRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (megaRef.current && !megaRef.current.contains(event.target)) setMegaMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target)) setNotificationsOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false);
      if (appsRef.current && !appsRef.current.contains(event.target)) setAppsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const queryValue = new URLSearchParams(location.search).get("q");
    if (queryValue !== null) {
      setSearchValue(queryValue);
      return;
    }

    setSearchValue("");
  }, [location.search]);

  const navigateToApp = (path) => {
    setAppsOpen(false);
    navigate(path);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);

    const params = new URLSearchParams(location.search);
    if (value.trim()) {
      params.set("q", value.trim());
    } else {
      params.delete("q");
    }

    const nextSearch = params.toString();
    navigate(`${location.pathname}${nextSearch ? `?${nextSearch}` : ""}`, { replace: true });
  };

  const handleSearchKeyDown = (event) => {
    if (event.key !== "Enter") return;

    event.preventDefault();
    const value = event.currentTarget.value.trim();

    const params = new URLSearchParams(location.search);
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }

    const nextSearch = params.toString();
    navigate(`${location.pathname}${nextSearch ? `?${nextSearch}` : ""}`, { replace: true });
  };

  const dropdownClass =
    "absolute right-5 mt-5 w-56 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-lg rounded-md overflow-hidden z-50";

  return (
    <header className="h-10 w-full flex items-center justify-between px-3 shadow-sm bg-white dark:bg-gray-800 dark:text-gray-200">
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onMenuClick}
          disabled={sidebarAnimating}
          aria-label="Toggle sidebar"
          className={`rounded-md p-1 transition-all duration-300 ${
            sidebarAnimating ? "cursor-not-allowed opacity-60" : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <Menu
            className={`h-4 w-4 text-gray-600 dark:text-gray-200 transition-transform duration-300 ${
              sidebarOpen ? "rotate-0" : "rotate-180"
            }`}
          />
        </button>
        <span className="md:text-sm text-[11px] font-semibold tracking-wide leading-none">EMS-NAVANTIS</span>
      </div>

      <div className="hidden md:flex items-center w-1/4 max-w-[320px]">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-300" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-8 pr-2.5 py-1 text-xs rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
            value={searchValue}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
          />
        </div>
      </div>

      <div className="flex items-center gap-2.5 relative">
        <div className="relative hidden items-center gap-2 md:flex" ref={megaRef}>
          <button
            onClick={() => setMegaMenuOpen(!megaMenuOpen)}
            className="text-xs text-gray-600 hover:text-black dark:text-gray-200 dark:hover:text-white"
          >
            Mega Menu
          </button>

          <div className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700 font-mono text-[11px] font-semibold text-blue-600 dark:text-blue-400 leading-none">
            {formattedTime}
          </div>

          {megaMenuOpen && (
            <div className="absolute top-full left-0 mt-2 w-56 rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
              <ul className="py-2">
                <li><button className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"><AppWindow className="w-4 h-4" />Dashboard</button></li>
                <li><button className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"><AppWindow className="w-4 h-4" />Projects</button></li>
                <li><button className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"><AppWindow className="w-4 h-4" />Tasks</button></li>
              </ul>
            </div>
          )}
        </div>

        <div className="relative" ref={notifRef}>
          <div className="relative">
            <Bell className="w-4 h-4 cursor-pointer text-gray-600 dark:text-gray-200" onClick={() => setNotificationsOpen(!notificationsOpen)} />
            {notificationCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white">
                {notificationCount > 99 ? "99+" : notificationCount}
              </span>
            )}
          </div>

          {notificationsOpen && (
            <div className={dropdownClass}>
              <div className="px-4 py-2 font-semibold">Notifications</div>
              <div className="border-t border-gray-200 dark:border-gray-700"></div>
              <button className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700">You have 3 new messages</button>
              <button className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700">Server restarted successfully</button>
              <button className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700">New user registered</button>
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setProfileOpen(!profileOpen)}>
            {org?.profilePic && !avatarError ? (
              <img
                src={org.profilePic}
                alt="user"
                onError={() => setAvatarError(true)}
                className="w-7 h-7 rounded-full border border-gray-300 dark:border-gray-600 object-cover"
              />
            ) : (
              <div className="w-7 h-7 rounded-full border border-gray-300 dark:border-gray-600 bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-slate-600 dark:text-slate-200" />
              </div>
            )}
            <div className="hidden lg:block text-xs leading-tight">
              <div className="font-semibold">{org?.name || user?.email || "User"}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{user?.role || "Role"}</div>
            </div>
          </div>
          {profileOpen && (
            <div className={dropdownClass}>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/profile");
                }}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <User className="w-4 h-4" /> Profile
              </button>
            </div>
          )}
        </div>

        <div className="relative" ref={appsRef}>
          <Grid className="w-4 h-4 cursor-pointer text-gray-600 dark:text-gray-200" onClick={() => setAppsOpen(!appsOpen)} />
          {appsOpen && (
            <div className="absolute right-0 mt-10 w-64 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-lg rounded-md overflow-hidden z-50 p-4 grid grid-cols-2 gap-4">
              <button onClick={() => navigateToApp("/apps/company-calendar")} className="flex flex-col items-center justify-center gap-1 p-2 hover:bg-blue-300 dark:hover:bg-gray-700 rounded-md transition-colors"><AppWindow className="w-6 h-6" /><span className="text-xs">Company Calendar</span></button>
              <button onClick={() => navigateToApp("/apps/calculator")} className="flex flex-col items-center justify-center gap-1 p-2 hover:bg-blue-300 dark:hover:bg-gray-700 rounded-md transition-colors"><AppWindow className="w-6 h-6" /><span className="text-xs">Calculator</span></button>
              <button onClick={() => navigateToApp("/apps/todo-notes")} className="flex flex-col items-center justify-center gap-1 p-2 hover:bg-blue-300 dark:hover:bg-gray-700 rounded-md transition-colors"><AppWindow className="w-6 h-6" /><span className="text-xs">To-Do Notes</span></button>
              <button onClick={() => navigateToApp("/apps/outlook")} className="flex flex-col items-center justify-center gap-1 p-2 hover:bg-blue-300 dark:hover:bg-gray-700 rounded-md transition-colors"><AppWindow className="w-6 h-6" /><span className="text-xs">Outlook</span></button>
              <button onClick={() => navigateToApp("/apps/employee-numbers")} className="flex flex-col items-center justify-center gap-1 p-2 hover:bg-blue-300 dark:hover:bg-gray-700 rounded-md transition-colors"><AppWindow className="w-6 h-6" /><span className="text-xs">Employee Numbers</span></button>
              <button onClick={() => navigateToApp("/apps/drive")} className="flex flex-col items-center justify-center gap-1 p-2 hover:bg-blue-300 dark:hover:bg-gray-700 rounded-md transition-colors"><AppWindow className="w-6 h-6" /><span className="text-xs">Drive</span></button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
