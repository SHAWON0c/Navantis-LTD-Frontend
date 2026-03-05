// src/pages/dashboard/DashboardSelector.jsx
import React from "react";
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


export default function DashboardSelector() {
  const { user, loading } = useAuth();

  // ✅ Wait until auth state is loaded
  if (loading) return <div>Loading...</div>;

  // ✅ If no user, redirect to login
  if (!user) return <Navigate to="/login" replace />;

  const role = user.role?.toLowerCase();

const roleMap = {
  md: <DashboardMD key="md" />,
  mpo: <MPOPage key="mpo" />,
  wm: <WarehouseDashboard key="wm" />,
  zm: <ZonalDashboard key="zm" />,
  am: <AreaDashboard key="am" />,
  hr: <HRDashboard key="hr" />,
  pmd: <PMDDashboard key="pmd" />,
  user: <UserDashboard key="user" />,
};

return roleMap[role] || <Navigate to="/login" replace />;


}