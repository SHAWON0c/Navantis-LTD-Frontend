import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import sidebarConfig from "../config/sidebar.config.json";
import { iconMap } from "../config/iconMap";
import { useAuth } from "../provider/AuthProvider";
import SidebarLogo from "./SidebarLogo";

export default function Sidebar({ isOpen, setSidebarOpen }) {
  const { user, loading } = useAuth();
  const [openSections, setOpenSections] = useState({});
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
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
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
                className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] uppercase tracking-[0.08em] text-slate-500 hover:text-slate-300 transition-colors"
                aria-expanded={!!openSections[section.key]}
              >
                <span className="flex items-center gap-2">
                  <section.Icon className="w-3.5 h-3.5" />
                  {section.label}
                </span>
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    openSections[section.key] ? "rotate-90" : ""
                  }`}
                />
              </button>
            ) : (
              <div className="h-1" />
            )}

            {(!isOpen || openSections[section.key]) && (
              <div className="space-y-1">
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
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
