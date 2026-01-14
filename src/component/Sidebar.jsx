// import { useState } from "react";
// import { NavLink } from "react-router-dom";
// import {
//   LayoutDashboard,
//   ShoppingCart,
//   Activity,
//   ChevronRight,
//   Users,
//   Warehouse,
//   Building2,
//   Stethoscope,
//   FileBarChart,
//   Landmark,
//   Trophy,
//   FileText,
//   UserCheck,
//   ClipboardList
// } from "lucide-react";

// export default function Sidebar({ isOpen }) {
//   const [openMenu, setOpenMenu] = useState(null);

//   const toggleMenu = (menu) => {
//     setOpenMenu(openMenu === menu ? null : menu);
//   };

//   const linkClass = `flex items-center gap-3 px-4 py-2 rounded-md hover:bg-blue-500 transition-colors text-white`;
//   const sectionClass = `flex items-center justify-between px-4 py-2 rounded-md hover:bg-blue-500 cursor-pointer text-white`;

//   return (
//     <aside
//       className={`bg-blue-600 text-white h-full transition-all duration-300 ${
//         isOpen ? "w-64" : "w-16"
//       }`}
//     >
//       {/* LOGO */}
//       <div className="h-16 flex items-center justify-center border-b border-blue-500">
//         {isOpen ? (
//           <span className="text-xl font-bold tracking-wider">Navantis</span>
//         ) : (
//           <Activity className="w-6 h-6" />
//         )}
//       </div>

//       <nav className="p-2 space-y-1">

//         {/* Dashboard */}
//         <NavLink to="/dashboard" className={linkClass}>
//           <LayoutDashboard className="w-5 h-5" />
//           {isOpen && <span>Dashboard</span>}
//         </NavLink>

//         {/* Product Flow */}
//         <div>
//           <div onClick={() => toggleMenu("productFlow")} className={sectionClass}>
//             <div className="flex items-center gap-3">
//               <ShoppingCart className="w-5 h-5" />
//               {isOpen && <span>Product Flow</span>}
//             </div>
//             {isOpen && (
//               <ChevronRight
//                 className={`w-4 h-4 transition-transform ${
//                   openMenu === "productFlow" ? "rotate-90" : ""
//                 }`}
//               />
//             )}
//           </div>
//           {openMenu === "productFlow" && isOpen && (
//             <div className="ml-6 mt-1 space-y-1 text-sm">
//               <NavLink to="/admin-po" className="flex items-center gap-2 py-1 px-2 rounded hover:bg-blue-500">
//                 <FileText className="w-4 h-4" />
//                 Purchase / Import Product
//               </NavLink>
//               <NavLink to="/warehouse/stock" className="flex items-center gap-2 py-1 px-2 rounded hover:bg-blue-500">
//                 <Warehouse className="w-4 h-4" />
//                 Warehouse Stock
//               </NavLink>
//               <NavLink to="/depot/inventory" className="flex items-center gap-2 py-1 px-2 rounded hover:bg-blue-500">
//                 <Building2 className="w-4 h-4" />
//                 Depot Inventory
//               </NavLink>
//               <NavLink to="/customer-list" className="flex items-center gap-2 py-1 px-2 rounded hover:bg-blue-500">
//                 <UserCheck className="w-4 h-4" />
//                 Customer Management
//               </NavLink>
//             </div>
//           )}
//         </div>

//         {/* Admin */}
//         <div>
//           <div onClick={() => toggleMenu("admin")} className={sectionClass}>
//             <div className="flex items-center gap-3">
//               <Users className="w-5 h-5" />
//               {isOpen && <span>Admin</span>}
//             </div>
//             {isOpen && (
//               <ChevronRight
//                 className={`w-4 h-4 transition-transform ${
//                   openMenu === "admin" ? "rotate-90" : ""
//                 }`}
//               />
//             )}
//           </div>
//           {openMenu === "admin" && isOpen && (
//             <div className="ml-6 mt-1 space-y-1 text-sm">
//               <NavLink to="/admin/users" className="flex items-center gap-2 py-1 px-2 rounded hover:bg-blue-500">
//                 <UserCheck className="w-4 h-4" />
//                 Users
//               </NavLink>
//               <NavLink to="/admin/roles" className="flex items-center gap-2 py-1 px-2 rounded hover:bg-blue-500">
//                 <ClipboardList className="w-4 h-4" />
//                 Roles
//               </NavLink>
//             </div>
//           )}
//         </div>

//         {/* Warehouse */}
//         <div>
//           <div onClick={() => toggleMenu("warehouse")} className={sectionClass}>
//             <div className="flex items-center gap-3">
//               <Warehouse className="w-5 h-5" />
//               {isOpen && <span>Warehouse</span>}
//             </div>
//             {isOpen && <ChevronRight className={`w-4 h-4 ${openMenu === "warehouse" && "rotate-90"}`} />}
//           </div>
//           {openMenu === "warehouse" && isOpen && (
//             <div className="ml-6 mt-1 space-y-1 text-sm">
//               <NavLink to="/warehouse/request" className="flex items-center gap-2 py-1 px-2 rounded hover:bg-blue-500">
//                 <FileText className="w-4 h-4" />
//                 Request
//               </NavLink>
//               <NavLink to="/warehouse/stock" className="flex items-center gap-2 py-1 px-2 rounded hover:bg-blue-500">
//                 <ClipboardList className="w-4 h-4" />
//                 Stock
//               </NavLink>
//             </div>
//           )}
//         </div>

//         {/* Depot */}
//         <div>
//           <div onClick={() => toggleMenu("depot")} className={sectionClass}>
//             <div className="flex items-center gap-3">
//               <Building2 className="w-5 h-5" />
//               {isOpen && <span>Depot</span>}
//             </div>
//             {isOpen && <ChevronRight className={`w-4 h-4 ${openMenu === "depot" && "rotate-90"}`} />}
//           </div>
//           {openMenu === "depot" && isOpen && (
//             <div className="ml-6 mt-1 space-y-1 text-sm">
//               <NavLink to="/depot/inventory" className="flex items-center gap-2 py-1 px-2 rounded hover:bg-blue-500">
//                 <FileText className="w-4 h-4" />
//                 Inventory
//               </NavLink>
//               <NavLink to="/depot/orders" className="flex items-center gap-2 py-1 px-2 rounded hover:bg-blue-500">
//                 <ClipboardList className="w-4 h-4" />
//                 Orders
//               </NavLink>
//             </div>
//           )}
//         </div>

//         {/* Institute */}
//         <NavLink to="/institute" className={linkClass}>
//           <Landmark className="w-5 h-5" />
//           {isOpen && <span>Institute</span>}
//         </NavLink>

//         {/* Doctor Requisition */}
//         <NavLink to="/doctor-requisition" className={linkClass}>
//           <Stethoscope className="w-5 h-5" />
//           {isOpen && <span>Doctor Requisition</span>}
//         </NavLink>

//         {/* Reports */}
//         <NavLink to="/reports" className={linkClass}>
//           <FileBarChart className="w-5 h-5" />
//           {isOpen && <span>Reports</span>}
//         </NavLink>

//         {/* Accounts */}
//         <NavLink to="/accounts" className={linkClass}>
//           <ShoppingCart className="w-5 h-5" />
//           {isOpen && <span>Accounts</span>}
//         </NavLink>

//         {/* Achievements */}
//         <NavLink to="/achievements" className={linkClass}>
//           <Trophy className="w-5 h-5" />
//           {isOpen && <span>Achievements</span>}
//         </NavLink>
//       </nav>
//     </aside>
//   );
// }



import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronRight, Activity } from "lucide-react";
import sidebarConfig from "../config/sidebar.config.json";
import { iconMap } from "../config/iconMap";

export default function Sidebar({ isOpen }) {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (key) => {
    setOpenMenu(openMenu === key ? null : key);
  };

  const linkClass =
    "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-blue-500 transition-colors text-white font-bold"

  const sectionClass =
    "flex items-center justify-between px-4 py-2 rounded-md hover:bg-blue-500 cursor-pointer text-white text-sm";

  return (
    <aside className={`bg-blue-600 h-full ${isOpen ? "w-64" : "w-16"} transition-all`}>
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-blue-500">
        {isOpen ? <span className="font-bold text-xl">Navantis</span> : <Activity />}
      </div>

      <nav className="p-2 space-y-1">
        {sidebarConfig.map((menu) => {
          const Icon = iconMap[menu.icon];

          // 🔹 Simple link
          if (!menu.children) {
            return (
              <NavLink key={menu.key} to={menu.path} className={linkClass}>
                <Icon className="w-5 h-5" />
                {isOpen && menu.label}
              </NavLink>
            );
          }

          // 🔹 Dropdown section
          return (
            <div key={menu.key}>
              <div onClick={() => toggleMenu(menu.key)} className={sectionClass}>
                <div className="flex items-center gap-3 font-bold text-base">
                  <Icon className="w-5 h-5" />
                  {isOpen && menu.label}
                </div>
                {isOpen && (
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${openMenu === menu.key ? "rotate-90" : ""
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
                        className="flex items-center gap-2 py-1 px-2 rounded text-gray-100 hover:bg-blue-500 hover:text-white"
                      >
                        <ChildIcon className="w-4 h-4 text-white" /> {/* icon color white */}
                        {child.label}
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
