// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import HomeLayout from "../layouts/HomeLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/auth/login";
import PurchaseOrder from "../pages/PurchaseOrder";
import WarehouseRequest from "../pages/WarehouseRequest";
import Register from "../pages/auth/Register";

// ✅ FIXED PATHS



export default function AppRoutes() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<HomeLayout />} />

      {/* Auth Pages (No Navbar, No Footer) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<DashboardLayout />}>

        {/* Default dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Admin */}
        <Route path="/admin/purchase-order" element={<PurchaseOrder />} />

        {/* Warehouse */}
        <Route path="/warehouse-request" element={<WarehouseRequest />} />

      </Route>

    </Routes>
  );
}
