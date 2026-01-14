// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import HomeLayout from "../layouts/HomeLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/auth/login";

import WarehouseRequest from "../pages/WarehouseRequest";
import Register from "../pages/auth/Register";
import VerifyEmail from "../pages/auth/VerifyEmail";
import UserDashboard from "../pages/dashboard/UserDashboard";
import AuthProvider from "../provider/AuthProvider";
import ProtectedRoute from "../provider/PrivateRoute";
import PurchaseOrder from "../pages/HQ/Admin/PurchaseOrder";
import PurchaseOrderList from "../pages/HQ/Admin/PurchaseOrderList";
import WarehouseAddProduct from "../pages/WareHouse/warehouseAddProduct";


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
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Route>

      <Route element={<DashboardLayout />}>

        {/* Default dashboard */}
       <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
        <Route path="/user-dashboard" element={<UserDashboard />} />
      </Route>

         <Route element={<ProtectedRoute allowedRoles={["md"]} />}>
        <Route path="/md-dashboard" element={<Dashboard />} />
      </Route>

        {/* Admin */}
        <Route path="/admin/purchase-order" element={<PurchaseOrder />} />
        <Route path="/admin/purchase-list" element={<PurchaseOrderList />} />

        {/* Warehouse */}

        <Route path="/admin/warehouse-request" element={<WarehouseRequest />} />


         <Route path="/warehouse/receive" element={<WarehouseAddProduct />} />

      </Route>

    </Routes>
  );
}
