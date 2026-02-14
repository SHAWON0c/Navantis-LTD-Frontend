
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import Topbar from "../component/Topbar";
import Footer from "../component/Footer";


export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} />

      <div className="flex flex-col flex-1 min-w-0">
        <Topbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 bg-gray-100 p-4 overflow-y-auto">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}
