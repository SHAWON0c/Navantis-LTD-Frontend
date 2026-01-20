// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import HomeLayout from "../layouts/HomeLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/auth/login";

import Register from "../pages/auth/Register";
import VerifyEmail from "../pages/auth/VerifyEmail";
import UserDashboard from "../pages/dashboard/UserDashboard";
import AuthProvider from "../provider/AuthProvider";
import ProtectedRoute from "../provider/PrivateRoute";
import PurchaseOrder from "../pages/HQ/Admin/PurchaseOrder";
import PurchaseOrderList from "../pages/HQ/Admin/PurchaseOrderList";
import WarehouseAddProduct from "../pages/WareHouse/warehouseAddProduct";
import ProfilePage from "../pages/profile/ProfilePage";
import WarehouseRequest from "../pages/WareHouse/WarehouseRequest";
import StockIn from "../pages/WareHouse/warehouseStockin";
import WarehouseProductsList from "../pages/WareHouse/warehouseProductsList";
import DepotProductsList from "../pages/Depot/DepotProductList";
import DepotReceiveRequest from "../pages/Depot/DepotReceiveRequest";
import DepotStockIn from "../pages/Depot/DepotStockIn";
import WarehouseStockOut from "../pages/WareHouse/warehouseStockOut";
import DepotStockOut from "../pages/Depot/DepotStockOut";
import WarehouseDamageRequest from "../pages/HQ/Admin/WarehouseDamageRequest";
import DepotProductRequest from "../pages/HQ/Admin/DepotProductRequest";
import DepotExpriedRequest from "../pages/HQ/Admin/DepotExpriedRequest";
import DamagedProducts from "../pages/WareHouse/DamagedProducts";
import DepotDelivery from "../pages/WareHouse/DepotDelivery";
import AreaPage from "../pages/AreaPage";
import TerritoryPage from "../pages/Teritory";
import TerritoryTarget from "../pages/TerritoryTarget";
import SetTerritoryTarget from "../pages/SetTerritoryTarget";

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

        <Route path="/admin/warehouse-request" element={<WarehouseRequest/>} />
        <Route path="/admin/damage-request" element={<WarehouseDamageRequest />} />
        <Route path="/admin/depot-request" element={<DepotProductRequest />} />
        <Route path="/admin/expired-request" element={<DepotExpriedRequest />} />


         <Route path="/warehouse/receive" element={<WarehouseAddProduct />} />
         <Route path="/warehouse/stock-in" element={<StockIn />} />
         <Route path="/warehouse/stock-out" element={<WarehouseStockOut />} />
         <Route path="/warehouse/products" element={<WarehouseProductsList />} />
         <Route path="/warehouse/depot-delivery" element={<DepotDelivery />} />



         <Route path="/depot/products" element={<DepotProductsList />} />  
         <Route path="/warehouse/damaged" element={<DamagedProducts />} />
         <Route path="/depot/receive-request" element={<DepotReceiveRequest />} />
         <Route path="/depot/stock-in" element={<DepotStockIn />} />
         <Route path="/depot/stock-out" element={<DepotStockOut />} />


        <Route path="/profile" element={<ProfilePage />} /> 


        <Route path="/area" element={<AreaPage />} />
        <Route path="/territory" element={<TerritoryPage />} />
        <Route path="/territory-target" element={<TerritoryTarget />} />
        <Route path="/territory/:id/set-target" element={<SetTerritoryTarget />} />

      </Route>

    </Routes>
  );
}
