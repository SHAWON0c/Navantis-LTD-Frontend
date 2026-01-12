// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";

import HomeLayout from "../layouts/HomeLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/auth/login";
import PurchaseOrder from "../pages/PurchaseOrder";
import WarehouseRequest from "../pages/WarehouseRequest";

// ✅ FIXED PATHS



export default function AppRoutes() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<HomeLayout />} />

      {/* Auth Pages (No Navbar, No Footer) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="purchase-order" element={<PurchaseOrder />} />
        <Route path="warehouse-request" element={<WarehouseRequest />} />
      </Route>

    </Routes>
  );
}
