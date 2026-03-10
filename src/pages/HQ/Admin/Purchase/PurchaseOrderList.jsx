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
import { MdDescription } from "react-icons/md";
import { useGetPurchaseOrdersQuery } from "../../../../redux/features/HQ/MD/purchaseOrder/purchaseOrderApi";
import FiltersAndSummaryPanel from "../../../../component/common/FiltersAndSummaryPanel";
import AdminPurchaseInvoice from "../../../../component/reports/AdminPrintPurchaseProductList";

const PurchaseOrderList = () => {
  // ---------------- URL state ----------------
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get("page")) || 1;
  const productsPerPage = parseInt(searchParams.get("limit")) || 10;

  // ---------------- Filters state ----------------
  const [filters, setFilters] = useState({
    searchTerm: "",
    year: searchParams.get("year") || "",
    month: searchParams.get("month") || "",
    fromDate: searchParams.get("fromDate") || "",
    toDate: searchParams.get("toDate") || "",
    today: searchParams.get("today") || ""
  });

  // ---------------- API Query ----------------
  const { data, isLoading, isError } = useGetPurchaseOrdersQuery(
    {
      page: currentPage,
      limit: productsPerPage,
      year: filters.year,
      month: filters.month,
      fromDate: filters.fromDate,
      toDate: filters.toDate,
      today: filters.today
    },
    { pollingInterval: 10000 }
  );

  // ---------------- Sync filters to URL ----------------
  useEffect(() => {
    const params = {
      page: 1, // reset page to 1 on filter change
      limit: productsPerPage,
      ...(filters.year && { year: filters.year }),
      ...(filters.month && { month: filters.month }),
      ...(filters.fromDate && { fromDate: filters.fromDate }),
      ...(filters.toDate && { toDate: filters.toDate }),
      ...(filters.today && { today: true })
    };
    setSearchParams(params);
  }, [filters.year, filters.month, filters.fromDate, filters.toDate, filters.today, productsPerPage, setSearchParams]);

  // ---------------- Sync page change to URL ----------------
  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    params.page = currentPage; // only update page number
    setSearchParams(params);
  }, [currentPage, setSearchParams]);

  if (isLoading) return <Loader />;
  if (isError) return <p className="text-red-500 text-center">Failed to load purchase orders.</p>;

  // ---------------- Data and totals ----------------
  const purchaseOrders = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const totalUniqueProducts = data?.totalUniqueProducts ?? 0;
  const totalUnit = data?.totalUnits ?? 0;
  const totalTP = data?.totalTradePrice ?? 0;

  // ---------------- Frontend search ----------------
  const filteredOrders = purchaseOrders.filter(order =>
    order.Name.toLowerCase().includes(filters.searchTerm.toLowerCase())
  );

  // ---------------- Clear filters ----------------
  const clearFilters = () => setFilters({
    searchTerm: "",
    year: "",
    month: "",
    fromDate: "",
    toDate: "",
    today: ""
  });

  // ---------------- Page change ----------------
  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;

    const params = Object.fromEntries(searchParams.entries());
    params.page = page;
    setSearchParams(params);
  };

  // ---------------- Print Handler ----------------
  // const handlePrint = async (all = false) => {
  //   if (!all) {
  //     // Print current page
  //     AdminPurchaseInvoice({
  //       purchaseOrders,
  //       totalUniqueProducts,
  //       totalUnit,
  //       totalTP,
  //       fromDate: filters.fromDate,
  //       toDate: filters.toDate
  //     })();
  //   } else {
  //     try {
  //       // Fetch all purchase orders from backend with limit=all
  //       const queryParams = new URLSearchParams({
  //         limit: "all",
  //         year: filters.year || "",
  //         month: filters.month || "",
  //         fromDate: filters.fromDate || "",
  //         toDate: filters.toDate || "",
  //         today: filters.today || ""
  //       });

  //       const res = await fetch(`http://localhost:5000/api/purchase-orders?${queryParams.toString()}`);
  //       const result = await res.json();

  //       AdminPurchaseInvoice({
  //         purchaseOrders: result.data,
  //         totalUniqueProducts: result.totalUniqueProducts,
  //         totalUnit: result.totalUnits,
  //         totalTP: result.totalTradePrice,
  //         fromDate: filters.fromDate,
  //         toDate: filters.toDate
  //       })();
  //     } catch (err) {
  //       console.error("Failed to fetch all purchase orders:", err);
  //       alert("Error fetching all data for printing");
  //     }
  //   }
  // };


const handlePrint = async (all = false) => {
  if (!all) {
    // Current page only
    AdminPurchaseInvoice({
      purchaseOrders,
      totalUniqueProducts,
      totalUnit,
      totalTP,
      fromDate: filters.fromDate,
      toDate: filters.toDate,
    })();
  } else {
    // Fetch all data from API
    const params = new URLSearchParams({
      limit: "all",
      year: filters.year || "",
      month: filters.month || "",
      fromDate: filters.fromDate || "",
      toDate: filters.toDate || "",
      today: filters.today ? true : "",
    });

    const res = await fetch(`http://localhost:5000/api/purchase-orders?${params.toString()}`);
    const allData = await res.json();

    AdminPurchaseInvoice({
      purchaseOrders: allData.data,
      totalUniqueProducts: allData.totalUniqueProducts,
      totalUnit: allData.totalUnits,
      totalTP: allData.totalTradePrice,
      fromDate: filters.fromDate,
      toDate: filters.toDate,
    })();
  }
};
  return (
    <div className="mx-auto p-2">
      {/* Header */}
      <div className="bg-white text-gray-600 h-12 flex items-center px-6">
        <MdDescription className="text-2xl text-blue-600 mr-2" />
        <h2 className="text-base font-bold">NPL / Admin / Purchase Order List</h2>
      </div>

      {/* Filters + Summary */}
      <FiltersAndSummaryPanel
        filters={filters}
        setFilters={setFilters}
        totals={{ totalUniqueProducts, totalUnit, totalTP }}
        onClear={clearFilters}
        onPrint={handlePrint}
      />

      {/* Table */}
      <div className="overflow-x-auto mt-10 bg-white shadow-md rounded-lg border">
        <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-xs">
              <th className="px-4 py-2 text-center">Sl. No.</th>
              <th className="px-4 py-2">Product Name</th>
              <th className="px-4 py-2">Pack Size</th>
              <th className="px-4 py-2">Batch</th>
              <th className="px-4 py-2 text-center">Quantity</th>
              <th className="px-4 py-2 text-center">Expire Date</th>
              <th className="px-4 py-2 text-right">TP</th>
              <th className="px-4 py-2 text-right">Total Price</th>
              <th className="px-4 py-2 text-center">Warehouse Status</th>
              <th className="px-4 py-2">Purchase Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order, idx) => (
              <tr key={order.productId + idx} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-center">{(currentPage - 1) * productsPerPage + idx + 1}</td>
                <td className="px-4 py-2">{order.Name}</td>
                <td className="px-4 py-2">{order.PackSize}</td>
                <td className="px-4 py-2">{order.Batch}</td>
                <td className="px-4 py-2 text-center">{order.Quantity}</td>
                <td className="px-4 py-2 text-center">{new Date(order.Expire).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-right">{order?.PriceUnitTP?.toLocaleString()}</td>
                <td className="px-4 py-2 text-right">{order?.TotalPrice?.toLocaleString()}</td>
                <td className="px-4 py-2 text-center">{order.warehouseStatus}</td>
                <td className="px-4 py-2">{new Date(order.Date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>
            <BsArrowLeftSquareFill className="w-6 h-6" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => changePage(page)}
              className={`px-3 py-1 rounded ${currentPage === page ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              {page}
            </button>
          ))}

          <button disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)}>
            <BsArrowRightSquareFill className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrderList;