// // import { useState, useEffect } from "react";
// // import { NavLink, Navigate } from "react-router-dom";
// // import { ChevronRight, Activity } from "lucide-react";
// // import sidebarConfig from "../config/sidebar.config.json";
// // import { iconMap } from "../config/iconMap";
// // import { useAuth } from "../provider/AuthProvider";

// // export default function Sidebar({ isOpen }) {
// //   const { user, loading } = useAuth();
// //   const [openMenu, setOpenMenu] = useState(() => {
// //     return localStorage.getItem("sidebarOpenMenu") || null;
// //   });

// //   const toggleMenu = (key) => {
// //     const newKey = openMenu === key ? null : key;
// //     setOpenMenu(newKey);
// //     localStorage.setItem("sidebarOpenMenu", newKey);
// //   };

// //   const linkClass =
// //     "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-blue-500 transition-colors text-white font-bold";

// //   const sectionClass =
// //     "flex items-center justify-between px-4 py-2 rounded-md hover:bg-blue-500 cursor-pointer text-white text-sm";

// //   // 🔹 Redirect if no user after loading
// //   if (!loading && !user) return <Navigate to="/login" replace />;

// //   // 🔹 Skeleton sidebar preview while loading (YouTube-style)
// //   if (loading || !user) {
// //     return (
// //       <aside
// //         className={`bg-[#0F213D] h-full ${isOpen ? "w-64" : "w-16"} transition-all duration-300`}
// //       >
// //         <div className="h-16 flex items-center justify-center border-b border-white bg-black dark:bg-gray-800">
// //           <Activity className="animate-pulse w-6 h-6 text-gray-400" />
// //         </div>

// //         <nav className="p-2 space-y-2">
// //           {[...Array(6)].map((_, i) => (
// //             <div
// //               key={i}
// //               className={`flex items-center gap-3 px-4 py-2 rounded-md bg-gray-700 animate-pulse ${
// //                 isOpen ? "w-full" : "w-12 mx-auto"
// //               }`}
// //             >
// //               <div className="w-5 h-5 bg-gray-500 rounded-full" />
// //               {isOpen && <div className="h-4 bg-gray-600 rounded flex-1" />}
// //             </div>
// //           ))}
// //         </nav>
// //       </aside>
// //     );
// //   }

// //   // 🔹 Filter menu items based on user role
// //   const role = user.role?.trim();
// //   const filterMenuByRole = (menu) => {
// //     if (!role) return false;

// //     if (menu.children) {
// //       const filteredChildren = menu.children.filter((child) =>
// //         child.allowedRoles?.includes(role)
// //       );
// //       if (filteredChildren.length > 0) return { ...menu, children: filteredChildren };
// //       return null;
// //     }

// //     if (!menu.children && menu.allowedRoles?.includes(role)) return menu;
// //     return null;
// //   };

// //   const filteredSidebar = sidebarConfig.map(filterMenuByRole).filter(Boolean);

// //   return (
// //     <aside
// //       className={`bg-[#0F213D] h-full ${isOpen ? "w-64" : "w-16"} transition-all duration-300`}
// //     >
// //       {/* Logo */}
// //       <div className="h-16 flex items-center justify-center border-b border-white bg-black dark:bg-gray-800">
// //         {isOpen ? (
// //           <img src="/images/NPL-Logo2.png" alt="Logo" className="h-auto w-auto" />
// //         ) : (
// //           <Activity />
// //         )}
// //       </div>

// //       {/* Navigation */}
// //       <nav className="p-2 space-y-1 text-white">
// //         {filteredSidebar.map((menu) => {
// //           const Icon = iconMap[menu.icon];

// //           if (!menu.children) {
// //             return (
// //               <NavLink key={menu.key} to={menu.path} className={linkClass}>
// //                 <Icon className="w-5 h-5" />
// //                 {isOpen && menu.label}
// //               </NavLink>
// //             );
// //           }

// //           return (
// //             <div key={menu.key}>
// //               <div onClick={() => toggleMenu(menu.key)} className={sectionClass}>
// //                 <div className="flex items-center gap-3 font-bold text-base">
// //                   <Icon className="w-5 h-5" />
// //                   {isOpen && menu.label}
// //                 </div>
// //                 {isOpen && (
// //                   <ChevronRight
// //                     className={`w-4 h-4 transition-transform duration-200 ${
// //                       openMenu === menu.key ? "rotate-90" : ""
// //                     }`}
// //                   />
// //                 )}
// //               </div>

// //               {openMenu === menu.key && isOpen && (
// //                 <div className="ml-6 mt-1 space-y-1 text-sm">
// //                   {menu.children.map((child) => {
// //                     const ChildIcon = iconMap[child.icon];
// //                     return (
// //                       <NavLink
// //                         key={child.path}
// //                         to={child.path}
// //                         className="flex items-center gap-2 py-1 px-2 rounded text-gray-100 hover:bg-blue-500 hover:text-white transition-colors"
// //                       >
// //                         <ChildIcon className="w-4 h-4 text-white" />
// //                         {child.label}
// //                       </NavLink>
// //                     );
// //                   })}
// //                 </div>
// //               )}
// //             </div>
// //           );
// //         })}
// //       </nav>
// //     </aside>
// //   );
// // }


// import { useState } from "react";
// import { NavLink, Navigate } from "react-router-dom";
// import { ChevronRight } from "lucide-react";
// import sidebarConfig from "../config/sidebar.config.json";
// import { iconMap } from "../config/iconMap";
// import { useAuth } from "../provider/AuthProvider";
// import SidebarLogo from "./SidebarLogo";

// export default function Sidebar({ isOpen }) {
//   const { user, loading } = useAuth();

//   const [openMenu, setOpenMenu] = useState(() => {
//     return localStorage.getItem("sidebarOpenMenu") || null;
//   });

//   const toggleMenu = (key) => {
//     const newKey = openMenu === key ? null : key;
//     setOpenMenu(newKey);
//     localStorage.setItem("sidebarOpenMenu", newKey);
//   };

//   const linkClass =
//     "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-blue-500 transition-colors text-white font-bold";

//   const sectionClass =
//     "flex items-center justify-between px-4 py-2 rounded-md hover:bg-blue-500 cursor-pointer text-white text-sm";

//   // Redirect if no user
//   if (!loading && !user) return <Navigate to="/login" replace />;

//   // Loading skeleton
//   if (loading || !user) {
//     return (
//       <aside
//         className={`bg-[#0F213D] h-full ${
//           isOpen ? "w-64" : "w-16"
//         } transition-all duration-300`}
//       >
//         <SidebarLogo isOpen={isOpen} />

//         <nav className="p-2 space-y-2">
//           {[...Array(6)].map((_, i) => (
//             <div
//               key={i}
//               className={`flex items-center gap-3 px-4 py-2 rounded-md bg-gray-700 animate-pulse ${
//                 isOpen ? "w-full" : "w-12 mx-auto"
//               }`}
//             >
//               <div className="w-5 h-5 bg-gray-500 rounded-full" />
//               {isOpen && (
//                 <div className="h-4 bg-gray-600 rounded flex-1" />
//               )}
//             </div>
//           ))}
//         </nav>
//       </aside>
//     );
//   }

//   // Filter menu by role
//   const role = user.role?.trim();

//   const filterMenuByRole = (menu) => {
//     if (!role) return false;

//     if (menu.children) {
//       const filteredChildren = menu.children.filter((child) =>
//         child.allowedRoles?.includes(role)
//       );

//       if (filteredChildren.length > 0) {
//         return { ...menu, children: filteredChildren };
//       }

//       return null;
//     }

//     if (!menu.children && menu.allowedRoles?.includes(role)) {
//       return menu;
//     }

//     return null;
//   };

//   const filteredSidebar = sidebarConfig.map(filterMenuByRole).filter(Boolean);

//   return (
//     <aside
//       className={`bg-[#0F213D] h-full ${
//         isOpen ? "w-64" : "w-16"
//       } transition-all duration-300`}
//     >
//       {/* Logo */}
//       <SidebarLogo isOpen={isOpen} />

//       {/* Navigation */}
//       <nav className="p-2 space-y-1 text-white">
//         {filteredSidebar.map((menu) => {
//           const Icon = iconMap[menu.icon];

//           if (!menu.children) {
//             return (
//               <NavLink key={menu.key} to={menu.path} className={linkClass}>
//                 <Icon className="w-5 h-5" />
//                 {isOpen && menu.label}
//               </NavLink>
//             );
//           }

//           return (
//             <div key={menu.key}>
//               <div
//                 onClick={() => toggleMenu(menu.key)}
//                 className={sectionClass}
//               >
//                 <div className="flex items-center gap-3 font-bold text-base">
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
//                         className="flex items-center gap-2 py-1 px-2 rounded text-gray-100 hover:bg-blue-500 hover:text-white transition-colors"
//                       >
//                         <ChildIcon className="w-4 h-4 text-white" />
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



import { useState } from "react";
import { NavLink, Navigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import sidebarConfig from "../config/sidebar.config.json";
import { iconMap } from "../config/iconMap";
import { useAuth } from "../provider/AuthProvider";
import SidebarLogo from "./SidebarLogo";

export default function Sidebar({ isOpen }) {
  const { user, loading } = useAuth();

  const [openMenu, setOpenMenu] = useState(() => {
    return localStorage.getItem("sidebarOpenMenu") || null;
  });

  const toggleMenu = (key) => {
    const newKey = openMenu === key ? null : key;
    setOpenMenu(newKey);
    localStorage.setItem("sidebarOpenMenu", newKey);
  };

  const linkClass =
    "flex items-center gap-3 px-4 py-2 rounded-md text-white font-bold transition-colors group hover:bg-yellow-400";

  const sectionClass =
    "flex items-center justify-between px-4 py-2 rounded-md cursor-pointer text-white text-sm font-semibold transition-colors group hover:bg-yellow-400";

  if (!loading && !user) return <Navigate to="/login" replace />;

  if (loading || !user) {
    return (
      <aside
        className={`bg-[#0F213D] h-full ${isOpen ? "w-64" : "w-16"} transition-all duration-300`}
      >
        <SidebarLogo isOpen={isOpen} />
        <nav className="p-2 space-y-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-2 rounded-md bg-gray-700 animate-pulse ${
                isOpen ? "w-full" : "w-12 mx-auto"
              }`}
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

  const filterMenuByRole = (menu) => {
    if (!role) return false;

    if (menu.children) {
      const filteredChildren = menu.children.filter((child) =>
        child.allowedRoles?.includes(role)
      );
      if (filteredChildren.length > 0) return { ...menu, children: filteredChildren };
      return null;
    }

    if (!menu.children && menu.allowedRoles?.includes(role)) return menu;

    return null;
  };

  const filteredSidebar = sidebarConfig.map(filterMenuByRole).filter(Boolean);

  return (
    <aside className={`bg-[#0F213D] h-full ${isOpen ? "w-80" : "w-16"} transition-all duration-300`}>
      <SidebarLogo isOpen={isOpen} />

      <nav className="p-2 space-y-1 text-white">
        {filteredSidebar.map((menu) => {
          const Icon = iconMap[menu.icon];

          if (!menu.children) {
            return (
              <NavLink key={menu.key} to={menu.path} className={linkClass}>
                <Icon className="w-5 h-5 group-hover:text-black" />
                {isOpen && <span className="group-hover:text-black">{menu.label}</span>}
              </NavLink>
            );
          }

          return (
            <div key={menu.key}>
              <div onClick={() => toggleMenu(menu.key)} className={sectionClass}>
                <div className="flex items-center gap-3 font-semibold text-base text-gray-300 group-hover:text-black">
                  <Icon className="w-5 h-5" />
                  {isOpen && menu.label}
                </div>

                {isOpen && (
                  <ChevronRight
                    className={`w-4 h-4 transition-transform duration-200 group-hover:text-black ${
                      openMenu === menu.key ? "rotate-90" : ""
                    }`}
                  />
                )}
              </div>

              {openMenu === menu.key && isOpen && (
                <div className="ml-6 mt-1 space-y-1 text-sm">
                  {menu.children.map((child) => {
                    const ChildIcon = iconMap[child.icon];

                    return (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className="flex items-center gap-2 py-1 px-2 rounded text-gray-100 transition-colors group hover:bg-yellow-400"
                      >
                        <ChildIcon className="w-4 h-4 text-white group-hover:text-black" />
                        <span className="group-hover:text-black">{child.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}