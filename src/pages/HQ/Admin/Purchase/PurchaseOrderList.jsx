// import React, { useState, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import Loader from "../../../../component/Loader";
// import { BsArrowLeftSquareFill, BsArrowRightSquareFill } from "react-icons/bs";
// import { useGetPurchaseOrdersQuery } from "../../../../redux/features/HQ/MD/purchaseOrder/purchaseOrderApi";
// import FiltersAndSummaryPanel from "../../../../component/common/FiltersAndSummaryPanel";
// import AdminPurchaseInvoice from "../../../../component/reports/AdminPrintPurchaseProductList";

// const PurchaseOrderList = () => {
//   // ---------------- URL state ----------------
//   const [searchParams, setSearchParams] = useSearchParams();

//   const currentPage = parseInt(searchParams.get("page")) || 1;
//   const productsPerPage = parseInt(searchParams.get("limit")) || 10;
//   const year = searchParams.get("year") || "";
//   const month = searchParams.get("month") || "";
//   const fromDate = searchParams.get("fromDate") || "";
//   const toDate = searchParams.get("toDate") || "";
//   const today = searchParams.get("today") || "";

//   // ---------------- Filters state ----------------
//   const [filters, setFilters] = useState({
//     searchTerm: "",
//     year,
//     month,
//     fromDate,
//     toDate,
//     today
//   });

//   // ---------------- API Query ----------------
//   const { data, isLoading, isError } = useGetPurchaseOrdersQuery({
//     page: currentPage,
//     limit: productsPerPage,
//     year,
//     month,
//     fromDate,
//     toDate,
//     today
//   }, { pollingInterval: 10000 });

//   // ---------------- Sync filters to URL ----------------
//   useEffect(() => {
//     setSearchParams({
//       page: 1,
//       limit: productsPerPage,
//       ...(filters.year && { year: filters.year }),
//       ...(filters.month && { month: filters.month }),
//       ...(filters.fromDate && { fromDate: filters.fromDate }),
//       ...(filters.toDate && { toDate: filters.toDate }),
//       ...(filters.today && { today: true }),
//     });
//   }, [filters, currentPage, productsPerPage, setSearchParams]);

//   if (isLoading) return <Loader />;
//   if (isError) return <p className="text-red-500 text-center">Failed to load purchase orders.</p>;

//   const purchaseOrders = data?.data || [];
//   const totalPages = data?.totalPages || 1;

//   const totalUniqueProducts = data?.totalUniqueProducts ?? 0;
//   const totalUnit = data?.totalUnits ?? 0;
//   const totalTP = data?.totalTradePrice ?? 0;

//   const clearFilters = () => setFilters({
//     searchTerm: "",
//     year: "",
//     month: "",
//     fromDate: "",
//     toDate: "",
//     today: ""
//   });

//   const changePage = (page) => {
//     if (page < 1 || page > totalPages) return;
//     setSearchParams({
//       ...Object.fromEntries(searchParams.entries()),
//       page
//     });
//   };

//   return (
//     <div className="mx-auto p-2">
//       {/* Header */}
//       <div className="bg-white text-gray-500 h-12 flex items-center px-6">
//         <h2 className="text-base font-bold">NPL / Admin / Purchase Order List</h2>
//       </div>

//       {/* Filters + Summary */}
//       <FiltersAndSummaryPanel
//         filters={filters}
//         setFilters={setFilters}
//         totals={{ totalUniqueProducts, totalUnit, totalTP }}
//         onClear={clearFilters}
//         onPrint={() =>
//           AdminPurchaseInvoice({
//             purchaseOrders,
//             totalUniqueProducts,
//             totalUnit,
//             totalTP,
//             fromDate: filters.fromDate,
//             toDate: filters.toDate
//           })()
//         }
//       />

//       {/* Table */}
//       <div className="overflow-x-auto mt-10">
//         <table className="table-auto w-full text-left border-collapse">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="px-4 py-2 text-center">Sl. No.</th>
//               <th className="px-4 py-2">Product Name</th>
//               <th className="px-4 py-2">Pack Size</th>
//               <th className="px-4 py-2">Batch</th>
//               <th className="px-4 py-2 text-center">Quantity</th>
//               <th className="px-4 py-2 text-center">Expire Date</th>
//               <th className="px-4 py-2 text-right">TP</th>
//               <th className="px-4 py-2 text-right">Total Price</th>
//               <th className="px-4 py-2 text-center">Warehouse Status</th>
//               <th className="px-4 py-2">Purchase Date</th>
//             </tr>
//           </thead>

//           <tbody>
//             {purchaseOrders.map((order, idx) => (
//               <tr key={order.productId + idx} className="border-b hover:bg-gray-50">
//                 <td className="px-4 py-2 text-center">{(currentPage - 1) * productsPerPage + idx + 1}</td>
//                 <td className="px-4 py-2">{order.Name}</td>
//                 <td className="px-4 py-2">{order.PackSize}</td>
//                 <td className="px-4 py-2">{order.Batch}</td>
//                 <td className="px-4 py-2 text-center">{order.Quantity}</td>
//                 <td className="px-4 py-2 text-center">{new Date(order.Expire).toLocaleDateString()}</td>
//                 <td className="px-4 py-2 text-right">{order?.PriceUnitTP?.toLocaleString()}</td>
//                 <td className="px-4 py-2 text-right">{order?.TotalPrice?.toLocaleString()}</td>
//                 <td className="px-4 py-2 text-center">{order.warehouseStatus}</td>
//                 <td className="px-4 py-2">{new Date(order.Date).toLocaleDateString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-center items-center gap-2 mt-4">
//           <button disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>
//             <BsArrowLeftSquareFill className="w-6 h-6" />
//           </button>

//           {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//             <button
//               key={page}
//               onClick={() => changePage(page)}
//               className={`px-3 py-1 rounded ${currentPage === page ? "bg-blue-600 text-white" : "bg-gray-200"}`}
//             >
//               {page}
//             </button>
//           ))}

//           <button disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)}>
//             <BsArrowRightSquareFill className="w-6 h-6" />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PurchaseOrderList;


// import React, { useState, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import Loader from "../../../../component/Loader";
// import { BsArrowLeftSquareFill, BsArrowRightSquareFill } from "react-icons/bs";
// import { useGetPurchaseOrdersQuery } from "../../../../redux/features/HQ/MD/purchaseOrder/purchaseOrderApi";
// import FiltersAndSummaryPanel from "../../../../component/common/FiltersAndSummaryPanel";
// import AdminPurchaseInvoice from "../../../../component/reports/AdminPrintPurchaseProductList";

// const PurchaseOrderList = () => {
//   // ---------------- URL state ----------------
//   const [searchParams, setSearchParams] = useSearchParams();

//   const currentPage = parseInt(searchParams.get("page")) || 1;
//   const productsPerPage = parseInt(searchParams.get("limit")) || 10;

//   // ---------------- Filters state ----------------
//   const [filters, setFilters] = useState({
//     searchTerm: "",
//     year: searchParams.get("year") || "",
//     month: searchParams.get("month") || "",
//     fromDate: searchParams.get("fromDate") || "",
//     toDate: searchParams.get("toDate") || "",
//     today: searchParams.get("today") || ""
//   });

//   // ---------------- API Query ----------------
//   const { data, isLoading, isError } = useGetPurchaseOrdersQuery({
//     page: currentPage,
//     limit: productsPerPage,
//     year: filters.year,
//     month: filters.month,
//     fromDate: filters.fromDate,
//     toDate: filters.toDate,
//     today: filters.today
//   }, { pollingInterval: 10000 });

//   // ---------------- Sync filters to URL ----------------
// // ---------------- Sync filters to URL ----------------
// useEffect(() => {
//   const params = {
//     page: 1, // reset page to 1 only on filter change
//     limit: productsPerPage,
//     ...(filters.year && { year: filters.year }),
//     ...(filters.month && { month: filters.month }),
//     ...(filters.fromDate && { fromDate: filters.fromDate }),
//     ...(filters.toDate && { toDate: filters.toDate }),
//     ...(filters.today && { today: true })
//   };
//   setSearchParams(params);
// }, [filters.year, filters.month, filters.fromDate, filters.toDate, filters.today, productsPerPage, setSearchParams]);

// // ---------------- Sync page change to URL ----------------
// useEffect(() => {
//   const params = Object.fromEntries(searchParams.entries());
//   params.page = currentPage; // only update page number
//   setSearchParams(params);
// }, [currentPage, setSearchParams]);

//   if (isLoading) return <Loader />;
//   if (isError) return <p className="text-red-500 text-center">Failed to load purchase orders.</p>;

//   // ---------------- Data and totals ----------------
//   const purchaseOrders = data?.data || [];
//   const totalPages = data?.totalPages || 1;

//   const totalUniqueProducts = data?.totalUniqueProducts ?? 0;
//   const totalUnit = data?.totalUnits ?? 0;
//   const totalTP = data?.totalTradePrice ?? 0;

//   // ---------------- Frontend search ----------------
//   const filteredOrders = purchaseOrders.filter(order =>
//     order.Name.toLowerCase().includes(filters.searchTerm.toLowerCase())
//   );

//   // ---------------- Clear filters ----------------
//   const clearFilters = () => setFilters({
//     searchTerm: "",
//     year: "",
//     month: "",
//     fromDate: "",
//     toDate: "",
//     today: ""
//   });

//   // ---------------- Page change ----------------
//   const changePage = (page) => {
//     if (page < 1 || page > totalPages) return;

//     const params = Object.fromEntries(searchParams.entries());
//     params.page = page;
//     setSearchParams(params);
//   };

//   return (
//     <div className="mx-auto p-2">
//       {/* Header */}
//       <div className="bg-white text-gray-500 h-12 flex items-center px-6">
//         <h2 className="text-base font-bold">NPL / Admin / Purchase Order List</h2>
//       </div>

//       {/* Filters + Summary */}
//       <FiltersAndSummaryPanel
//         filters={filters}
//         setFilters={setFilters}
//         totals={{ totalUniqueProducts, totalUnit, totalTP }}
//         onClear={clearFilters}
//         onPrint={() =>
//           AdminPurchaseInvoice({
//             purchaseOrders,
//             totalUniqueProducts,
//             totalUnit,
//             totalTP,
//             fromDate: filters.fromDate,
//             toDate: filters.toDate
//           })()
//         }
//       />

//       {/* Table */}
//       <div className="overflow-x-auto mt-10">
//         <table className="table-auto w-full text-left border-collapse">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="px-4 py-2 text-center">Sl. No.</th>
//               <th className="px-4 py-2">Product Name</th>
//               <th className="px-4 py-2">Pack Size</th>
//               <th className="px-4 py-2">Batch</th>
//               <th className="px-4 py-2 text-center">Quantity</th>
//               <th className="px-4 py-2 text-center">Expire Date</th>
//               <th className="px-4 py-2 text-right">TP</th>
//               <th className="px-4 py-2 text-right">Total Price</th>
//               <th className="px-4 py-2 text-center">Warehouse Status</th>
//               <th className="px-4 py-2">Purchase Date</th>
//             </tr>
//           </thead>

//           <tbody>
//             {filteredOrders.map((order, idx) => (
//               <tr key={order.productId + idx} className="border-b hover:bg-gray-50">
//                 <td className="px-4 py-2 text-center">{(currentPage - 1) * productsPerPage + idx + 1}</td>
//                 <td className="px-4 py-2">{order.Name}</td>
//                 <td className="px-4 py-2">{order.PackSize}</td>
//                 <td className="px-4 py-2">{order.Batch}</td>
//                 <td className="px-4 py-2 text-center">{order.Quantity}</td>
//                 <td className="px-4 py-2 text-center">{new Date(order.Expire).toLocaleDateString()}</td>
//                 <td className="px-4 py-2 text-right">{order?.PriceUnitTP?.toLocaleString()}</td>
//                 <td className="px-4 py-2 text-right">{order?.TotalPrice?.toLocaleString()}</td>
//                 <td className="px-4 py-2 text-center">{order.warehouseStatus}</td>
//                 <td className="px-4 py-2">{new Date(order.Date).toLocaleDateString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-center items-center gap-2 mt-4">
//           <button disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>
//             <BsArrowLeftSquareFill className="w-6 h-6" />
//           </button>

//           {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//             <button
//               key={page}
//               onClick={() => changePage(page)}
//               className={`px-3 py-1 rounded ${currentPage === page ? "bg-blue-600 text-white" : "bg-gray-200"}`}
//             >
//               {page}
//             </button>
//           ))}

//           <button disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)}>
//             <BsArrowRightSquareFill className="w-6 h-6" />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PurchaseOrderList;


import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Loader from "../../../../component/Loader";
import { BsArrowLeftSquareFill, BsArrowRightSquareFill } from "react-icons/bs";
import { useGetPurchaseOrdersQuery } from "../../../../redux/features/HQ/MD/purchaseOrder/purchaseOrderApi";
import FiltersAndSummaryPanel from "../../../../component/common/FiltersAndSummaryPanel";
import AdminPurchaseInvoice from "../../../../component/reports/AdminPrintPurchaseProductList";
import Card from "../../../../component/common/Card";
import Button from "../../../../component/common/Button";

const PurchaseOrderList = () => {
  // --- URL state ---
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get("page")) || 1;
  const productsPerPage = parseInt(searchParams.get("limit")) || 10;
  const year = searchParams.get("year") || "";
  const month = searchParams.get("month") || "";
  const fromDate = searchParams.get("fromDate") || "";
  const toDate = searchParams.get("toDate") || "";
  const today = searchParams.get("today") || "";

  // --- Filters state ---
  const [filters, setFilters] = useState({
    searchTerm: "",
    year,
    month,
    fromDate,
    toDate,
    today
  });

  // --- API Query ---
  const { data, isLoading, isError } = useGetPurchaseOrdersQuery({
    page: currentPage,
    limit: productsPerPage,
    year,
    month,
    fromDate,
    toDate,
    today
  }, { pollingInterval: 10000 });

  // --- Sync filters to URL ---
  useEffect(() => {
    setSearchParams({
      page: 1,
      limit: productsPerPage,
      ...(filters.year && { year: filters.year }),
      ...(filters.month && { month: filters.month }),
      ...(filters.fromDate && { fromDate: filters.fromDate }),
      ...(filters.toDate && { toDate: filters.toDate }),
      ...(filters.today && { today: true }),
    });
  }, [filters, productsPerPage, setSearchParams]);

  if (isLoading) return <Loader />;
  if (isError) return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <Card className="text-center">
        <p className="text-error text-lg">Failed to load purchase orders.</p>
        <Button variant="primary" className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Card>
    </div>
  );

  const purchaseOrders = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const totalUniqueProducts = data?.totalUniqueProducts ?? 0;
  const totalUnit = data?.totalUnits ?? 0;
  const totalTP = data?.totalTradePrice ?? 0;

  const clearFilters = () =>
    setFilters({ searchTerm: "", year: "", month: "", fromDate: "", toDate: "", today: "" });

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      page
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Purchase Orders</h1>
              <p className="text-neutral-600 text-sm">Manage purchase order inventory</p>
            </div>
          </div>
          <div className="text-sm text-neutral-500">
            Total Records: {purchaseOrders.length}
          </div>
        </div>
      </Card>

      {/* Filters + Summary */}
      <div className="mb-6">
        <FiltersAndSummaryPanel
          filters={filters}
          setFilters={setFilters}
          totals={{ totalUniqueProducts, totalUnit, totalTP }}
          onClear={clearFilters}
          onPrint={() =>
            AdminPurchaseInvoice({
              purchaseOrders,
              totalUniqueProducts,
              totalUnit,
              totalTP,
              fromDate: filters.fromDate,
              toDate: filters.toDate
            })()
          }
        />
      </div>

      {/* Data Table */}
      <Card title="Purchase Order Records" subtitle={`Showing ${purchaseOrders.length} records`}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Sl. No.</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Product Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Pack Size</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Batch</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Quantity</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Expire Date</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">TP</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Total Price</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Warehouse Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Purchase Date</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrders.map((order, idx) => (
                <tr key={order.productId + idx} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="text-center py-3 px-4">{(currentPage - 1) * productsPerPage + idx + 1}</td>
                  <td className="text-left py-3 px-4">{order.Name}</td>
                  <td className="text-left py-3 px-4">{order.PackSize}</td>
                  <td className="text-left py-3 px-4">{order.Batch}</td>
                  <td className="text-center py-3 px-4">{Number(order.Quantity || 0).toLocaleString()}</td>
                  <td className="text-center py-3 px-4">{new Date(order.Expire).toLocaleDateString()}</td>
                  <td className="text-right py-3 px-4">₹{Number(order?.PriceUnitTP || 0).toLocaleString()}</td>
                  <td className="text-right py-3 px-4">₹{Number(order?.TotalPrice || 0).toLocaleString()}</td>
                  <td className="text-center py-3 px-4">{order.warehouseStatus}</td>
                  <td className="text-left py-3 px-4">{new Date(order.Date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="mt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-neutral-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="small"
                disabled={currentPage === 1}
                onClick={() => changePage(currentPage - 1)}
                icon={BsArrowLeftSquareFill}
              >
                Previous
              </Button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "primary" : "outline"}
                      size="small"
                      onClick={() => changePage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="small"
                disabled={currentPage === totalPages}
                onClick={() => changePage(currentPage + 1)}
                icon={BsArrowRightSquareFill}
                iconPosition="right"
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PurchaseOrderList;