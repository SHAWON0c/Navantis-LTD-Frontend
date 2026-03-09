// // src/pages/dashboard/DashboardSelector.jsx
// import React from "react";
// import { Navigate } from "react-router-dom";
// import DashboardMD from "../pages/dashboard/DashboardMD";
// import MPOPage from "../pages/dashboard/MPOPage";
// import WarehouseDashboard from "../pages/dashboard/WarehouseDashboard";
// import ZonalDashboard from "../pages/dashboard/ZonalDashboard";
// import AreaDashboard from "../pages/dashboard/AreaDashboard";
// import HRDashboard from "../pages/dashboard/HRDashboard";
// import PMDDashboard from "../pages/dashboard/PMDDashboard";
// import { useAuth } from "../provider/AuthProvider";
// import UserDashboard from "../pages/dashboard/UserDashboard";


// export default function DashboardSelector() {
//   const { user, loading } = useAuth();

//   // ✅ Wait until auth state is loaded
//   if (loading) return <div>Loading...</div>;

//   // ✅ If no user, redirect to login
//   if (!user) return <Navigate to="/login" replace />;

//   const role = user.role?.toLowerCase();

// const roleMap = {
//   md: <DashboardMD key="md" />,
//   mpo: <MPOPage key="mpo" />,
//   wm: <WarehouseDashboard key="wm" />,
//   zm: <ZonalDashboard key="zm" />,
//   am: <AreaDashboard key="am" />,
//   hr: <HRDashboard key="hr" />,
//   pmd: <PMDDashboard key="pmd" />,
//   user: <UserDashboard key="user" />,
// };

// return roleMap[role] || <Navigate to="/login" replace />;


// }


// src/pages/dashboard/DashboardSelector.jsx
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import DashboardMD from "../pages/dashboard/DashboardMD";
import MPOPage from "../pages/dashboard/MPOPage";
import WarehouseDashboard from "../pages/dashboard/WarehouseDashboard";
import ZonalDashboard from "../pages/dashboard/ZonalDashboard";
import AreaDashboard from "../pages/dashboard/AreaDashboard";
import HRDashboard from "../pages/dashboard/HRDashboard";
import PMDDashboard from "../pages/dashboard/PMDDashboard";
import { useAuth } from "../provider/AuthProvider";
import UserDashboard from "../pages/dashboard/UserDashboard";
import DMDashboard from "../pages/dashboard/DMDashboard";

export default function DashboardSelector() {

  console.log("🚀 DashboardSelector component mounted");

  const { user, loading } = useAuth();

  useEffect(() => {
    console.log("📡 Auth state changed:", { user, loading });
  }, [user, loading]);

  // wait auth
  if (loading) {
    console.log("⏳ Auth is loading...");
    return <div>Loading...</div>;
  }

  // no user
  if (!user) {
    console.log("❌ No user detected → redirect to /login");
    return <Navigate to="/login" replace />;
  }

  const role = user.role?.toLowerCase();

  console.log("👤 User object:", user);
  console.log("🎭 User role:", role);

  const roleMap = {
    md: <DashboardMD key="md" />,
    mpo: <MPOPage key="mpo" />,
    wm: <WarehouseDashboard key="wm" />,
    zm: <ZonalDashboard key="zm" />,
    am: <AreaDashboard key="am" />,
    hr: <HRDashboard key="hr" />,
    dm: <DMDashboard key="dm"/>,
    pmd: <PMDDashboard key="pmd" />,

    user: <UserDashboard key="user" />,
  };

  console.log("📋 Available dashboards:", Object.keys(roleMap));

  if (!roleMap[role]) {
    console.log("⚠️ Role not found in roleMap:", role);
    console.log("➡️ Redirecting to login");
  } else {
    console.log("✅ Rendering dashboard for:", role);
  }

  return roleMap[role] || <Navigate to="/login" replace />;
}