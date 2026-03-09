// import Loader from "../../component/Loader";
// import { useGetWarehouseReceiveRequestQuery } from "../../redux/features/wareHouse/warehouseReceiveApi";
// import WarehouseRequestProductCard from "./WarehouseRequestProductCard";

// const WarehouseRequest = () => {
//   // Fetch pending warehouse receive requests
//   const { data: whReceiveRequests, isLoading } = useGetWarehouseReceiveRequestQuery(undefined, {
//     // Optional: live updates every 5s
//     pollingInterval: 5000,
//     refetchOnFocus: true,
//     refetchOnReconnect: true,
//   });

//   // Extract data and totals safely
//   const filteredProducts = whReceiveRequests?.data || [];
//   const {
//     totalProducts = 0,
//     totalOrderQuantity = 0,
//     totalStockQuantity = 0,
//     totalMissingQuantity = 0,
//     count = 0,
//   } = whReceiveRequests || {};

//   if (isLoading) {
//     return <Loader/>
//   }

//   return (
//     <div className="mx-auto p-2">

//       {/* Top Bar */}
//       <div className="bg-white text-gray-500 h-12 flex items-center px-6">
//         <h2 className="text-base font-bold">NPL / Admin / Purchase Order</h2>
//       </div>

//       {/* Main Content */}
//       <div className="space-y-6 mt-4">
//         <div className="bg-white pb-1 rounded-lg">

//           {/* Product Info / Summary */}
//           <div className="m-0 p-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-md ">
//             <p className="text-md text-gray-700 text-center mb-4 font-medium">Warehouse Request Summary</p>

//             <div className="bg-white p-3 rounded-md rounded-b-none shadow-sm flex flex-col md:flex-row justify-around items-center text-gray-600">
//               <p className="text-sm">
//                 Total Products: <span className="font-medium text-blue-700">{totalProducts}</span>
//               </p>
//               <p className="text-sm">
//                 Total Order Quantity: <span className="font-medium text-blue-700">{totalOrderQuantity}</span>
//               </p>
//               <p className="text-sm">
//                 Total Stock Quantity: <span className="font-medium text-blue-700">{totalStockQuantity}</span>
//               </p>
//               <p className="text-sm">
//                 Total Missing Quantity: <span className="font-medium text-blue-700">{totalMissingQuantity}</span>
//               </p>
//             </div>
//           </div>

//           {/* Table */}
//           <div className="p-6">
//             <div className="overflow-x-auto mb-3">
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th className="text-center">Sl. No.</th>
//                     <th>Name / Details</th>
//                     <th className="text-center">Batch</th>
//                     <th className="text-center">Exp.</th>
//                     <th className="text-center">Order Quantity</th>
//                     <th className="text-center">Stock Quantity</th>
//                     <th className="text-center">Missing Quantity</th>
//                     <th className="text-center">Details</th>
//                     <th className="text-center">Approve</th>
//                     <th className="text-center">Deny</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredProducts.map((product, idx) => (
//                     <WarehouseRequestProductCard
//                       idx={idx + 1}
//                       key={product.warehouseReceiveId} // ✅ use unique warehouseReceiveId as key
//                       product={product}
//                       summary={{
//                         count,
//                         totalProducts,
//                         totalOrderQuantity,
//                         totalStockQuantity,
//                         totalMissingQuantity,
//                       }}
//                     />
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default WarehouseRequest;


import React from "react";
import Loader from "../../component/Loader";
import { useGetWarehouseReceiveRequestQuery } from "../../redux/features/wareHouse/warehouseReceiveApi";
import WarehouseRequestProductCard from "./WarehouseRequestProductCard";
import UniversalSummaryPanel from "../../component/common/UniversalSummaryPanel";
// ✅ import the universal panel

const WarehouseRequest = () => {
  // Fetch pending warehouse receive requests
  const { data: whReceiveRequests, isLoading } = useGetWarehouseReceiveRequestQuery(undefined, {
    pollingInterval: 5000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // Extract data and totals safely
  const filteredProducts = whReceiveRequests?.data || [];
  const {
    totalProducts = 0,
    totalOrderQuantity = 0,
    totalStockQuantity = 0,
    totalMissingQuantity = 0,
    count = 0,
  } = whReceiveRequests || {};

  if (isLoading) return <Loader />;

  // Prepare dynamic totals object for the UniversalSummaryPanel
  const totals = {
    "Total Products": totalProducts,
    "Total Order Quantity": totalOrderQuantity,
    "Total Stock Quantity": totalStockQuantity,
    "Total Missing Quantity": totalMissingQuantity,
    "Count of Requests": count,
  };

  return (
    <div className="mx-auto p-2">
      {/* Top Bar */}
      <div className="bg-white text-gray-500 h-12 flex items-center px-6">
        <h2 className="text-base font-bold">NPL / Admin / Purchase Order</h2>
      </div>

      {/* Universal Summary Panel */}
      <UniversalSummaryPanel totals={totals} />

      {/* Table */}
      <div className="space-y-6 mt-4 bg-white pb-1 rounded-lg p-6">
        <div className="overflow-x-auto mb-3">
          <table className="table">
            <thead>
              <tr>
                <th className="text-center">Sl. No.</th>
                <th>Name / Details</th>
                <th className="text-center">Batch</th>
                <th className="text-center">Exp.</th>
                <th className="text-center">Order Quantity</th>
                <th className="text-center">Stock Quantity</th>
                <th className="text-center">Missing Quantity</th>
                <th className="text-center">Details</th>
                <th className="text-center">Approve</th>
                <th className="text-center">Deny</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, idx) => (
                <WarehouseRequestProductCard
                  idx={idx + 1}
                  key={product.warehouseReceiveId} // ✅ unique key
                  product={product}
                  summary={totals} // pass the same totals dynamically if needed
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WarehouseRequest;