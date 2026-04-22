import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronRight, Settings, LogOut } from "lucide-react";
import sidebarConfig from "../config/sidebar.config.json";
import { iconMap } from "../config/iconMap";
import { useAuth } from "../provider/AuthProvider";
import SidebarLogo from "./SidebarLogo";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ isOpen, setSidebarOpen }) {
  const { user, loading, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [openSectionKey, setOpenSectionKey] = useState(null);
  const expandIfCollapsed = () => {
    if (!isOpen) setSidebarOpen(true);
  };

  if (!loading && !user) return null;

  if (loading || !user) {
    return (
      <aside className="h-full w-full bg-primary-800">
        <SidebarLogo isOpen={isOpen} />
        <nav className="p-2 space-y-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-2 rounded-md bg-[#181616] animate-pulse"
            >
              <div className="w-5 h-5 bg-gray-500 rounded-full" />
              {isOpen && <div className="h-4 bg-gray-600 rounded flex-1" />}
            </div>
          ))}
        </nav>
      </aside>
    );
  }

  const role = user.role?.trim();

  const flattenLeafItems = (nodes, parents = []) => {
    if (!Array.isArray(nodes) || !role) return [];

    return nodes.flatMap((node) => {
      if (!node) return [];

      if (node.children?.length) {
        return flattenLeafItems(node.children, [...parents, node.label]);
      }

      if (node.allowedRoles?.includes(role) && node.path) {
        const Icon = iconMap[node.icon] || iconMap.FileText;

        return [
          {
            key: node.key,
            label: node.label,
            path: node.path,
            Icon,
            context: parents.slice(1).join(" / "),
          },
        ];
      }

      return [];
    });
  };

  const sidebarSections = sidebarConfig
    .map((section) => ({
      key: section.key,
      label: section.label,
      Icon: iconMap[section.icon] || iconMap.FileText,
      items: flattenLeafItems(section.children, [section.label]),
    }))
    .filter((section) => section.items.length > 0);

  const toggleSection = (key) => {
    setOpenSectionKey((prev) => (prev === key ? null : key));
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="h-full bg-slate-800 text-slate-400 flex flex-col transition-all duration-300 border-r border-slate-700/70">
      <SidebarLogo isOpen={isOpen} setSidebarOpen={setSidebarOpen} />

      <nav className="p-3 space-y-1 overflow-y-auto flex-1">
        {sidebarSections.map((section) => (
          <div key={section.key} className="mb-3">
            {isOpen ? (
              <button
                type="button"
                onClick={() => toggleSection(section.key)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500 hover:text-slate-300 transition-colors"
                aria-expanded={openSectionKey === section.key}
              >
                <span className="flex items-center gap-2">
                  <section.Icon className="w-3.5 h-3.5" />
                  {section.label}
                </span>
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    openSectionKey === section.key ? "rotate-90" : ""
                  }`}
                />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="w-full flex items-center justify-center px-2 py-2 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-700/80 transition-colors"
                title={section.label}
              >
                <section.Icon className="w-4 h-4" />
              </button>
            )}

            {isOpen && (
              <div
                className={`overflow-hidden transition-[max-height,opacity,transform,margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] origin-top ${
                  openSectionKey === section.key
                    ? "max-h-[1200px] opacity-100 mt-1 translate-y-0 scale-y-100"
                    : "max-h-0 opacity-0 -translate-y-1 scale-y-95"
                }`}
              >
                <div className="space-y-1 pb-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.key}
                    to={item.path}
                    end
                    onClick={expandIfCollapsed}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] transition-colors duration-200 ${
                        isActive
                          ? "bg-slate-600/90 text-slate-100 border-l-2 border-cyan-300"
                          : "text-slate-400 hover:bg-slate-700/80 hover:text-slate-200"
                      }`
                    }
                    title={!isOpen ? item.label : undefined}
                  >
                    <item.Icon className="w-4 h-4 shrink-0" />
                    {isOpen && <span className="truncate">{item.label}</span>}
                  </NavLink>
                ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-700/70 p-2 space-y-1">
        {isOpen ? (
          <>
            <button
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-slate-300 hover:bg-slate-700/80 hover:text-slate-100 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm">Settings</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-slate-300 hover:bg-red-700/60 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-md text-slate-300 hover:bg-slate-700/80"><Settings className="w-4 h-4" /></button>
          </div>
        )}
      </div>
    </aside>
  );
}
