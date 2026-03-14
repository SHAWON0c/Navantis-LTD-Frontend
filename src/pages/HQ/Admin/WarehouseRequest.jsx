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
import Loader from "../../../component/Loader";
import { useGetWarehouseReceiveRequestQuery } from "../../../redux/features/wareHouse/warehouseReceiveApi";
import WarehouseRequestProductCard from "../../WareHouse/WarehouseRequestProductCard";
import UniversalSummaryPanel from "../../../component/common/UniversalSummaryPanel";
import Card from "../../../component/common/Card";
import { ChevronRight } from "lucide-react";
import { MdArrowBack } from "react-icons/md";
import Button from "../../../component/common/Button";


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
    <div className="min-h-screen">
      {/* Header */}
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="small"  onClick={() => window.history.back()}
              className="ml-2">
                 <MdArrowBack className="inline mr-1" />
              Back
            </Button>
            <div className="bg-white text-gray-500 flex items-center px-3 sm:px-4 md:px-6 py-2 sm:h-12">
              <h2 className="flex flex-wrap items-center text-xs sm:text-sm md:text-base font-semibold text-gray-800 gap-1 sm:gap-2">
                <span>EMS</span>
                <ChevronRight size={14} className="text-gray-400" />
                <span>ADMIN</span>
                <ChevronRight size={14} className="text-gray-400" />
                <span className="text-gray-900 font-bold">WAREHOUSE REQUEST</span>
              </h2>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-neutral-500 mr-2 sm:mr-4 md:mr-6">
            Total Requests: {filteredProducts.length}
          </div>
        </div>
      </Card>


      {/* Summary Panel */}
      <div className="mb-6">
        <UniversalSummaryPanel totals={totals} />
      </div>

      {/* Data Table */}
      <Card title="Warehouse Requests" subtitle={`Showing ${filteredProducts.length} request(s)`}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Sl. No.</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Product Name</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Batch</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Expire</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Order Qty</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Stock Qty</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Missing Qty</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Details</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Approve</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Deny</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-8 text-gray-500">
                    No pending requests found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, idx) => (
                  <WarehouseRequestProductCard
                    idx={idx + 1}
                    key={product.warehouseReceiveId}
                    product={product}
                    summary={totals}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default WarehouseRequest;