// // Sidebar.jsx
// import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
// import { ChevronRight } from "lucide-react";
// import sidebarConfig from "../config/sidebar.config.json";
// import { iconMap } from "../config/iconMap";
// import { useAuth } from "../provider/AuthProvider";
// import SidebarLogo from "./SidebarLogo";

// export default function Sidebar({ isOpen, setSidebarOpen }) {
//   const { user, loading } = useAuth();
//   const [openMenu, setOpenMenu] = useState(
//     () => localStorage.getItem("sidebarOpenMenu") || null
//   );

//   const toggleMenu = (key) => {
//     const newKey = openMenu === key ? null : key;
//     setOpenMenu(newKey);
//     localStorage.setItem("sidebarOpenMenu", newKey);
//   };

//   if (!loading && !user) return null;

//   if (loading || !user) {
//     return (
//       <aside className={`h-full w-full bg-primary-800`}>
//         <SidebarLogo isOpen={isOpen} />
//         <nav className="p-2 space-y-2">
//           {[...Array(6)].map((_, i) => (
//             <div
//               key={i}
//               className="flex items-center gap-3 px-4 py-2 rounded-md bg-red-700 animate-pulse"
//             >
//               <div className="w-5 h-5 bg-gray-500 rounded-full" />
//               {isOpen && <div className="h-4 bg-gray-600 rounded flex-1" />}
//             </div>
//           ))}
//         </nav>
//       </aside>
//     );
//   }

//   const role = user.role?.trim();
//   const filterMenuByRole = (menu) => {
//     if (!role) return false;
//     if (menu.children) {
//       const filteredChildren = menu.children.filter((child) =>
//         child.allowedRoles?.includes(role)
//       );
//       if (filteredChildren.length > 0) return { ...menu, children: filteredChildren };
//       return null;
//     }
//     if (!menu.children && menu.allowedRoles?.includes(role)) return menu;
//     return null;
//   };
//   const filteredSidebar = sidebarConfig.map(filterMenuByRole).filter(Boolean);

//   return (
//     <aside
//       className={`h-full bg-black text-white flex flex-col transition-all duration-300`}
//     >
//       <SidebarLogo isOpen={isOpen} setSidebarOpen={setSidebarOpen} />

//       <nav className="p-2 space-y-1 overflow-y-auto flex-1">
//         {filteredSidebar.map((menu) => {
//           const Icon = iconMap[menu.icon];

//           if (!menu.children) {
//             return (
//               <NavLink
//                 key={menu.key}
//                 to={menu.path}
//                 className={({ isActive }) =>
//                   `flex items-center gap-3 px-4 py-2 rounded-md font-bold hover:bg-yellow-400 transition-colors
//                   ${isActive ? "bg-yellow-400 text-black" : ""}`
//                 }
//                 title={!isOpen ? menu.label : undefined} // tooltip when collapsed
//               >
//                 <Icon className="w-5 h-5" />
//                 {isOpen && menu.label}
//               </NavLink>
//             );
//           }

//           return (
//             <div key={menu.key}>
//               <div
//                 onClick={() => toggleMenu(menu.key)}
//                 className="flex items-center justify-between px-4 py-2 rounded-md cursor-pointer font-semibold hover:bg-yellow-400 transition-colors"
//                 title={!isOpen ? menu.label : undefined}
//               >
//                 <div className="flex items-center gap-3">
//                   <Icon className="w-5 h-5" />
//                   {isOpen && menu.label}
//                 </div>
//                 {isOpen && (
//                   <ChevronRight
//                     className={`w-4 h-4 transition-transform duration-200 ${
//                       openMenu === menu.key ? "rotate-90" : ""
//                     }`}
//                   />
//                 )}
//               </div>

//               {openMenu === menu.key && isOpen && (
//                 <div className="ml-6 mt-1 space-y-1 text-sm">
//                   {menu.children.map((child) => {
//                     const ChildIcon = iconMap[child.icon];
//                     return (
//                       <NavLink
//                         key={child.path}
//                         to={child.path}
//                         className={({ isActive }) =>
//                           `flex items-center gap-2 py-1 px-2 rounded hover:bg-yellow-400 transition-colors
//                           ${isActive ? "bg-yellow-400 text-black" : "text-gray-100"}`
//                         }
//                       >
//                         <ChildIcon className="w-4 h-4" />
//                         {child.label}
//                       </NavLink>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </nav>
//     </aside>
//   );
// }




// Sidebar.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import sidebarConfig from "../config/sidebar.config.json";
import { iconMap } from "../config/iconMap";
import { useAuth } from "../provider/AuthProvider";
import SidebarLogo from "./SidebarLogo";

export default function Sidebar({ isOpen, setSidebarOpen }) {
  const { user, loading } = useAuth();

  // ✅ Independent open state for ALL levels
  const [openMenus, setOpenMenus] = useState(() => {
    const saved = localStorage.getItem("sidebarOpenMenus");
    return saved ? JSON.parse(saved) : {};
  });

  const toggleMenu = (key) => {
    setOpenMenus((prev) => {
      const updated = {
        ...prev,
        [key]: !prev[key],
      };

      localStorage.setItem("sidebarOpenMenus", JSON.stringify(updated));
      return updated;
    });
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
              {isOpen && (
                <div className="h-4 bg-gray-600 rounded flex-1" />
              )}
            </div>
          ))}
        </nav>
      </aside>
    );
  }

  const role = user.role?.trim();

  const filterMenuByRole = (menu) => {
    if (!role) return null;

    if (menu.children) {
      const filteredChildren = menu.children
        .map(filterMenuByRole)
        .filter(Boolean);

      if (filteredChildren.length > 0) {
        return { ...menu, children: filteredChildren };
      }

      return null;
    }

    if (menu.allowedRoles?.includes(role)) return menu;

    return null;
  };

  const filteredSidebar = sidebarConfig
    .map(filterMenuByRole)
    .filter(Boolean);

  // ✅ Fully Recursive Renderer
  const renderMenuItems = (items) =>
    items.map((item) => {
      const Icon = iconMap[item.icon];
      const isOpen = openMenus[item.key];

      if (!item.children) {
        return (
          <NavLink
            key={item.key}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 py-1 px-2 rounded hover:bg-[#c1d4fa] transition-all duration-400 ease-in-out
              ${isActive ? "bg-[#eedacd] dark:bg-red-500! text-black " : "hover:text-black"}`
            }
           end>
            {Icon && <Icon className="w-4 h-4" />}
            {item.label}
          </NavLink>
        );
      }

      return (
        <div key={item.key}>
          <div
            onClick={() => toggleMenu(item.key)}
            className="flex items-center justify-between px-2 py-1 rounded cursor-pointer hover:bg-[#eedacd] hover:text-black transition-all duration-900 ease-in-out"
          >
            <div className="flex items-center gap-2">
              {Icon && <Icon className="w-4 h-4" />}
              {item.label}
            </div>

            <ChevronRight
              className={`w-4 h-4 transition-transform duration-900 ease-in-out ${
                isOpen ? "rotate-90" : ""
              }`}
            />
          </div>

          {isOpen && (
            <div className="ml-4 mt-1 space-y-1 text-sm">
              {renderMenuItems(item.children)}
            </div>
          )}
        </div>
      );
    });

  return (
    <aside className="h-full bg-black text-white flex flex-col transition-all duration-300">
      <SidebarLogo
        isOpen={isOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <nav className="p-2 space-y-1 overflow-y-auto flex-1">
        {filteredSidebar.map((menu) => {
          const Icon = iconMap[menu.icon];
          const isOpenMenu = openMenus[menu.key];

          if (!menu.children) {
            return (
              <NavLink
                key={menu.key}
                to={menu.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-md font-bold hover:bg-[#eedacd] transition-all duration-900 ease-in-out
                  ${isActive ? "bg-[#eedacd] text-black" : ""}`
                }
                title={!isOpen ? menu.label : undefined}
              >
                <Icon className="w-5 h-5" />
                {isOpen && menu.label}
              </NavLink>
            );
          }

          return (
            <div key={menu.key}>
              <div
                onClick={() => toggleMenu(menu.key)}
                className="flex items-center justify-between px-4 py-2 rounded-md cursor-pointer font-semibold hover:bg-[#eedacd] hover:text-black transition-all duration-900 ease-in-out"
                title={!isOpen ? menu.label : undefined}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  {isOpen && menu.label}
                </div>

                {isOpen && (
                  <ChevronRight
                    className={`w-4 h-4 transition-transform duration-900 ease-in-out ${
                      isOpenMenu ? "rotate-90" : ""
                    }`}
                  />
                )}
              </div>

              {isOpenMenu && isOpen && (
                <div className="ml-6 mt-1 space-y-1 text-sm">
                  {renderMenuItems(menu.children)}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}