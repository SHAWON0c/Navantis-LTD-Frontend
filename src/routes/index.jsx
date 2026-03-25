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
import WarehouseAddProduct from "../pages/WareHouse/warehouseAddProduct";
// import ProfilePage from "../pages/profile/ProfilePage";

import StockIn from "../pages/WareHouse/warehouseStockin";
import WarehouseProductsList from "../pages/WareHouse/warehouseProductsList";
import DepotProductsList from "../pages/Depot/DepotProductList";
import DepotReceiveRequest from "../pages/Depot/DepotReceiveRequest";
import DepotStockIn from "../pages/Depot/DepotStockIn";
import WarehouseStockOut from "../pages/WareHouse/warehouseStockOut";
import DepotStockOut from "../pages/Depot/DepotStockOut";
import WarehouseDamageRequest from "../pages/HQ/Admin/WarehouseDamageRequest";
// import DepotProductRequest from "../pages/HQ/Admin/DepotProductRequest";
// import DepotExpriedRequest from "../pages/HQ/Admin/DepotExpriedRequest";
import DamagedProducts from "../pages/WareHouse/DamagedProducts";
import DepotDelivery from "../pages/WareHouse/DepotDelivery";
import AreaPage from "../pages/AreaPage";
// import TerritoryPage from "../pages/Teritory";
import TerritoryTarget from "../pages/TerritoryTarget";
import SetTerritoryTarget from "../pages/SetTerritoryTarget";
import UserProfile from "../pages/UserProfile";
import Customer from "../pages/mpo/customer/Customer";
import CreateCustomer from "../pages/mpo/customer/CreateCustomer";
import PlaceOrder from "../pages/mpo/order/PlaceOrder";
import PendingOrders from "../pages/Depot/approveOrder";


import HardcodedInvoicePrint from "../component/reports/InvoicePrintPage";
import DispatchRidersPage from "../pages/Depot/DispatchRidersPage";
import InvoiceAndPayment from "../pages/Depot/InvoiceAndPayment";
import DepotReceive from "../pages/Depot/DepotReceive";
import ReturnRequestList from "../pages/Depot/ReturnRequestList";
import DashboardSelector from "../component/DashboardSelector";
import MPOPage from "../pages/dashboard/MPOPage";
import PurchaseOrder from "../pages/HQ/Admin/Purchase/PurchaseOrder";
import PurchaseOrderList from "../pages/HQ/Admin/Purchase/PurchaseOrderList";
import DepotRequestsPage from "../pages/HQ/Admin/depo/DepotRequestsPage";
import NotFoundPage from "../pages/notFound/NotFoundPage";
import MyOrders from "../pages/mpo/order/MyOrders";
import WarehouseRequest from "../pages/HQ/Admin/WarehouseRequest";
import CompanyCalendarPage from "../pages/apps/CompanyCalendarPage";
import CalculatorPage from "../pages/apps/CalculatorPage";
import TodoNotesPage from "../pages/apps/TodoNotesPage";
import OutlookPage from "../pages/apps/OutlookPage";
import EmployeeNumbersPage from "../pages/apps/EmployeeNumbersPage";
import DrivePage from "../pages/apps/DrivePage";
import MarketPoints from "../pages/Superadmin/marketPoints/MarketPoints";
import Zones from "../pages/Superadmin/zones/Zones";
import Areas from "../pages/Superadmin/Areas/Areas";
import Teritories from "../pages/Superadmin/teritories/Teritories";
import DailyAttendancePage from "../pages/HR/DailyAttendancePage";
import LeaveBalancePage from "../pages/HR/LeaveBalancePage";
import LeaveApplicationPage from "../pages/HR/LeaveApplicationPage";
import LeaveAttendanceViewPage from "../pages/HR/LeaveAttendanceViewPage";
import SalaryStructurePage from "../pages/HR/SalaryStructurePage";
import MonthlyPayslipPage from "../pages/HR/MonthlyPayslipPage";
import PayslipTaxPage from "../pages/HR/PayslipTaxPage";
import FinalSettlementPage from "../pages/HR/FinalSettlementPage";
import TaDaManagementPage from "../pages/HR/TaDaManagementPage";
import FestivalBonusPage from "../pages/HR/FestivalBonusPage";
import PfManagementPage from "../pages/HR/PfManagementPage";
import PersonalInfoPage from "../pages/HR/PersonalInfoPage";
import YearlyAssessmentPage from "../pages/HR/YearlyAssessmentPage";
import UserAssetsPage from "../pages/HR/UserAssetsPage";
import AssetsListPage from "../pages/HR/AssetsListPage";
import GatePassPage from "../pages/HR/GatePassPage";
import VendorDatabasePage from "../pages/HR/VendorDatabasePage";
import NoticeBoardPage from "../pages/HR/NoticeBoardPage";
import EmploymentDocsPage from "../pages/HR/EmploymentDocsPage";


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


        <Route path="*" element={<NotFoundPage />} />
        {/* Default dashboard */}
        <Route path="/dashboard" element={<DashboardSelector />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/apps/company-calendar" element={<CompanyCalendarPage />} />
        <Route path="/apps/calculator" element={<CalculatorPage />} />
        <Route path="/apps/todo-notes" element={<TodoNotesPage />} />
        <Route path="/apps/outlook" element={<OutlookPage />} />
        <Route path="/apps/employee-numbers" element={<EmployeeNumbersPage />} />
        <Route path="/apps/drive" element={<DrivePage />} />

        <Route element={<ProtectedRoute allowedRoles={["hr", "superadmin"]} />}>
          <Route path="/hr/daily-attendance" element={<DailyAttendancePage />} />
          <Route path="/hr/leave-balance" element={<LeaveBalancePage />} />
          <Route path="/hr/leave-application" element={<LeaveApplicationPage />} />
          <Route path="/hr/leave-attendance-view" element={<LeaveAttendanceViewPage />} />
          <Route path="/hr/salary-structure" element={<SalaryStructurePage />} />
          <Route path="/hr/monthly-payslip" element={<MonthlyPayslipPage />} />
          <Route path="/hr/payslip-tax" element={<PayslipTaxPage />} />
          <Route path="/hr/final-settlement" element={<FinalSettlementPage />} />
          <Route path="/hr/ta-da" element={<TaDaManagementPage />} />
          <Route path="/hr/festival-bonus" element={<FestivalBonusPage />} />
          <Route path="/hr/pf-management" element={<PfManagementPage />} />
          <Route path="/hr/personal-info" element={<PersonalInfoPage />} />
          <Route path="/hr/yearly-assessment" element={<YearlyAssessmentPage />} />
          <Route path="/hr/user-assets" element={<UserAssetsPage />} />
          <Route path="/hr/assets-list" element={<AssetsListPage />} />
          <Route path="/hr/gate-pass" element={<GatePassPage />} />
          <Route path="/hr/vendor-database" element={<VendorDatabasePage />} />
          <Route path="/hr/notice-board" element={<NoticeBoardPage />} />
          <Route path="/hr/employment-docs" element={<EmploymentDocsPage />} />
        </Route>


        {/* Admin */}
        <Route element={<ProtectedRoute allowedRoles={["md","superadmin"]} />}>
          <Route path="/admin/purchase-order" element={<PurchaseOrder />} />
          <Route path="/admin/purchase-list" element={<PurchaseOrderList />} />

        </Route>

        <Route element={<ProtectedRoute allowedRoles={["superadmin"]} />}>
          <Route path="/superadmin/zones" element={<Zones />} />
          <Route path="/superadmin/areas" element={<Areas />} />
          <Route path="/superadmin/territories" element={<Teritories />} />
          <Route path="/superadmin/marketpoints" element={<MarketPoints />} />
        </Route>

        {/* Warehouse */}

        <Route element={<ProtectedRoute allowedRoles={["md", "wm" ,"superadmin"]} />}>

          <Route path="/admin/warehouse-request" element={<WarehouseRequest />} />
          <Route path="/admin/damage-request" element={<WarehouseDamageRequest />} />
          {/* <Route path="/admin/depot-request" element={<DepotProductRequest />} /> */}


          <Route path="/admin/depot-request" element={<DepotRequestsPage></DepotRequestsPage>} ></Route>


          <Route path="/warehouse/receive" element={<WarehouseAddProduct />} />
          <Route path="/warehouse/stock-in" element={<StockIn />} />
          <Route path="/warehouse/stock-out" element={<WarehouseStockOut />} />
          <Route path="/warehouse/products" element={<WarehouseProductsList />} />
          <Route path="/warehouse/depot-delivery" element={<DepotDelivery />} />
        </Route>




        <Route element={<ProtectedRoute allowedRoles={["dm", "amdin", "md" ,"superadmin"]} />}>
          <Route path="/depot/products" element={<DepotProductsList />} />
          <Route path="/warehouse/damaged" element={<DamagedProducts />} />
          <Route path="/depot/receive-request" element={<DepotReceiveRequest />} />
          <Route path="/depot/stock-in" element={<DepotStockIn />} />
          <Route path="/depot/stock-out" element={<DepotStockOut />} />
          <Route path="/depot/order-delivery" element={<PendingOrders />} />
              <Route path="/depot/products/returnlist" element={<ReturnRequestList />} />
                <Route path="/invoice-print" element={<HardcodedInvoicePrint />} />
          <Route path="/depot/dispatch-rider" element={<DispatchRidersPage />} />
          <Route path="/depot/invoice-payment" element={<InvoiceAndPayment />} />
          <Route path="/depot/receive" element={<DepotReceive />} />


          <Route path="/area" element={<AreaPage />} />
          {/* <Route path="/territory" element={<TerritoryPage />} /> */}
          <Route path="/territory-target" element={<TerritoryTarget />} />
          <Route path="/territory/:id/set-target" element={<SetTerritoryTarget />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["amdin", "md" ,"mpo","superadmin"]} />}>
          <Route path="/customer/list" element={<Customer />} />
          <Route path="/customer/add" element={<CreateCustomer />} />

          <Route path="orders/place" element={<PlaceOrder />} />
          <Route path="/orders/my-orders" element={<MyOrders/>} />

    
        </Route>


      </Route>

    </Routes>
  );
}
