
// import { useState } from "react";
// import { Outlet } from "react-router-dom";
// import Sidebar from "../component/Sidebar";
// import Topbar from "../component/Topbar";
// import Footer from "../component/Footer";


// export default function DashboardLayout() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   return (
//     <div className="flex h-screen w-full overflow-hidden">
//       <Sidebar isOpen={isSidebarOpen} />

//       <div className="flex flex-col flex-1 min-w-0">
//         <Topbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

//         <main className="flex-1 bg-gray-100 p-4 overflow-y-auto">
//           <Outlet />
//         </main>

//         <Footer />
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import Sidebar from "../component/Sidebar";
import Topbar from "../component/Topbar";
import Footer from "../component/Footer";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen width for mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false); // collapse sidebar on mobile by default
        setIsMobile(true);
      } else {
        setSidebarOpen(true);
        setIsMobile(false);
      }
    };
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Topbar */}
        <Topbar onMenuClick={toggleSidebar} />

        {/* Outlet for nested routes */}
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}