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



export default function DashboardSelector() {
  const role = localStorage.getItem("role")?.trim().toLowerCase();

  const roleMap = {
    md: <DashboardMD />,
    mpo: <MPOPage />,
    wm: <WarehouseDashboard />,
    zm: <ZonalDashboard />,
    am: <AreaDashboard />,
    hr: <HRDashboard />,
    pmd: <PMDDashboard />,
  };

  return roleMap[role] || <Navigate to="/login" replace />;
}