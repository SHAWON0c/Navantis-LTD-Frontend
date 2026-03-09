// import React, { useState } from "react";
// import { useGetGroupedDepotRequestsQuery } from "../../redux/features/depot/depotProductRequestAPI";
// import { ChevronDown, ChevronUp } from "lucide-react";

// const STATUS_OPTIONS = ["pending", "requested", "accepted"];

// const DepotRequests = () => {
//   const [selectedStatus, setSelectedStatus] = useState("pending");
//   const [expandedRows, setExpandedRows] = useState({}); // Track expanded rows

//   const { data, isLoading, isError } = useGetGroupedDepotRequestsQuery(selectedStatus);

//   if (isLoading) return <p className="text-center mt-4">Loading requests...</p>;
//   if (isError) return <p className="text-center text-red-500 mt-4">Failed to load requests!</p>;

//   // Convert object to array of { date, requests }
//   const groupedRequests = data?.data
//     ? Object.entries(data.data).map(([date, requests]) => ({ date, requests }))
//     : [];

//   const toggleRow = (requestId) => {
//     setExpandedRows((prev) => ({
//       ...prev,
//       [requestId]: !prev[requestId],
//     }));
//   };

//   return (
//     <div className="p-4">
//       {/* Status Filter */}
//       <div className="flex gap-4 mb-6">
//         {STATUS_OPTIONS.map((status) => (
//           <button
//             key={status}
//             onClick={() => setSelectedStatus(status)}
//             className={`px-4 py-2 rounded font-semibold ${
//               selectedStatus === status
//                 ? "bg-blue-600 text-white"
//                 : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//             }`}
//           >
//             {status.charAt(0).toUpperCase() + status.slice(1)}
//           </button>
//         ))}
//       </div>

//       {/* Requests */}
//       {groupedRequests.length > 0 ? (
//         groupedRequests.map(({ date, requests }) => (
//           <div key={date} className="mb-8">
//             <h3 className="font-bold mb-2 text-lg">
//               Date: {new Date(date).toLocaleDateString()}
//             </h3>

//             <table className="table-auto w-full border border-gray-300 text-left">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-4 py-2 border">#</th>
//                   <th className="px-4 py-2 border">Product Name</th>
//                   <th className="px-4 py-2 border text-center">Pack Size</th>
//                   <th className="px-4 py-2 border text-center">Requested Qty</th>
//                   <th className="px-4 py-2 border text-center">Warehouse Qty</th>
//                   <th className="px-4 py-2 border text-center">Depot Qty</th>
//                   <th className="px-4 py-2 border text-center">Batches</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {requests.map((req, idx) => {
//                   const isExpanded = expandedRows[req.requestId] || false;

//                   return (
//                     <React.Fragment key={req.requestId}>
//                       <tr className="border-b hover:bg-gray-50">
//                         <td className="px-4 py-2 text-center">{idx + 1}</td>
//                         <td className="px-4 py-2">{req.productName}</td>
//                         <td className="px-4 py-2 text-center">{req.packSize}</td>
//                         <td className="px-4 py-2 text-center">{req.requestedQuantity}</td>
//                         <td className="px-4 py-2 text-center">{req.warehouseQuantity}</td>
//                         <td className="px-4 py-2 text-center">{req.depotQuantity}</td>
//                         <td className="px-4 py-2 text-center cursor-pointer" onClick={() => toggleRow(req.requestId)}>
//                           {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//                         </td>
//                       </tr>

//                       {/* Collapsible Batches */}
//                       {isExpanded && (
//                         <tr className="bg-gray-50">
//                           <td colSpan={7} className="p-4">
//                             <div className="flex gap-8">
//                               {/* Warehouse Batches */}
//                               <div className="flex-1">
//                                 <h4 className="font-semibold mb-2">Warehouse Batches</h4>
//                                 <table className="w-full border border-gray-200 text-left">
//                                   <thead>
//                                     <tr className="bg-gray-100">
//                                       <th className="px-2 py-1 border">Batch</th>
//                                       <th className="px-2 py-1 border text-center">Expire Date</th>
//                                       <th className="px-2 py-1 border text-center">Total Qty</th>
//                                       {req.status !== "pending" && (
//                                         <th className="px-2 py-1 border text-center">Requested Qty</th>
//                                       )}
//                                     </tr>
//                                   </thead>
//                                   <tbody>
//                                     {req.warehouseBatches.map((b) => (
//                                       <tr key={b.warehouseProductId} className="border-b">
//                                         <td className="px-2 py-1">{b.batch}</td>
//                                         <td className="px-2 py-1 text-center">{new Date(b.expireDate).toLocaleDateString()}</td>
//                                         <td className="px-2 py-1 text-center">{b.totalQuantity}</td>
//                                         {req.status !== "pending" && (
//                                           <td className="px-2 py-1 text-center">{b.requestedQuantity || 0}</td>
//                                         )}
//                                       </tr>
//                                     ))}
//                                   </tbody>
//                                 </table>
//                               </div>

//                               {/* Depot Batches */}
//                               <div className="flex-1">
//                                 <h4 className="font-semibold mb-2">Depot Batches</h4>
//                                 <table className="w-full border border-gray-200 text-left">
//                                   <thead>
//                                     <tr className="bg-gray-100">
//                                       <th className="px-2 py-1 border">Batch</th>
//                                       <th className="px-2 py-1 border text-center">Expire Date</th>
//                                       <th className="px-2 py-1 border text-center">Total Qty</th>
//                                     </tr>
//                                   </thead>
//                                   <tbody>
//                                     {req.depotBatches.map((b) => (
//                                       <tr key={b.depotProductId} className="border-b">
//                                         <td className="px-2 py-1">{b.batch}</td>
//                                         <td className="px-2 py-1 text-center">{new Date(b.expireDate).toLocaleDateString()}</td>
//                                         <td className="px-2 py-1 text-center">{b.totalQuantity}</td>
//                                       </tr>
//                                     ))}
//                                   </tbody>
//                                 </table>
//                               </div>
//                             </div>
//                           </td>
//                         </tr>
//                       )}
//                     </React.Fragment>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         ))
//       ) : (
//         <p className="text-center text-gray-500">
//           No requests found for "{selectedStatus}" status.
//         </p>
//       )}
//     </div>
//   );
// };

// export default DepotRequests;




import React, { useState } from "react";
import { useGetGroupedDepotRequestsQuery } from "../../redux/features/depot/depotProductRequestAPI";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_OPTIONS = ["pending", "requested", "accepted"];

const DepotRequests = () => {
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [expandedRows, setExpandedRows] = useState({});

  const { data, isLoading, isError } = useGetGroupedDepotRequestsQuery(selectedStatus);

  if (isLoading)
    return <p className="text-center mt-8 text-gray-600">Loading requests...</p>;
  if (isError)
    return <p className="text-center mt-8 text-red-500">Failed to load requests!</p>;

  const groupedRequests = data?.data
    ? Object.entries(data.data).map(([date, requests]) => ({ date, requests }))
    : [];

  const toggleRow = (requestId) =>
    setExpandedRows((prev) => ({ ...prev, [requestId]: !prev[requestId] }));

  return (
    <div className="p-6 min-h-screen font-sans bg-gray-50">
      {/* Status Filter */}
      <div className="flex gap-3 mb-6">
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-5 py-2 rounded-lg font-semibold border ${
              selectedStatus === status
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-800"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Requests */}
      {groupedRequests.length > 0 ? (
        groupedRequests.map(({ date, requests }) => (
          <div key={date} className="mb-10">
            <h3 className="font-bold mb-4 text-xl text-gray-800 border-b pb-2">
              Date: {new Date(date).toLocaleDateString()}
            </h3>

            <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border text-center">#</th>
                    <th className="px-4 py-2 border">Product Name</th>
                    <th className="px-4 py-2 border text-center">Pack Size</th>
                    <th className="px-4 py-2 border text-center">Requested Qty</th>
                    <th className="px-4 py-2 border text-center">Warehouse Qty</th>
                    <th className="px-4 py-2 border text-center">Depot Qty</th>
                    <th className="px-4 py-2 border text-center">Batches</th>
                  </tr>
                </thead>

                <tbody>
                  {requests.map((req, idx) => {
                    const isExpanded = expandedRows[req.requestId] || false;
                    return (
                      <React.Fragment key={req.requestId}>
                        <tr>
                          <td className="px-4 py-2 border text-center">{idx + 1}</td>
                          <td className="px-4 py-2 border">{req.productName}</td>
                          <td className="px-4 py-2 border text-center">{req.packSize}</td>
                          <td className="px-4 py-2 border text-center">{req.requestedQuantity}</td>
                          <td className="px-4 py-2 border text-center">{req.warehouseQuantity}</td>
                          <td className="px-4 py-2 border text-center">{req.depotQuantity}</td>
                          <td
                            className="px-4 py-2 border text-center cursor-pointer"
                            onClick={() => toggleRow(req.requestId)}
                          >
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </td>
                        </tr>

                        {/* Collapsible Section */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.tr
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <td colSpan={7} className="p-4 border-t">
                                <div className="flex gap-6 flex-wrap">
                                  {/* Warehouse Batches */}
                                  <div className="flex-1 min-w-[250px]">
                                    <h4 className="font-bold mb-2 text-center">Warehouse Batches</h4>
                                    <table className="w-full border border-gray-300 border-collapse">
                                      <thead>
                                        <tr>
                                          <th className="px-2 py-1 border text-center">Batch</th>
                                          <th className="px-2 py-1 border text-center">Expire Date</th>
                                          <th className="px-2 py-1 border text-center">Total Qty</th>
                                          {req.status !== "pending" && (
                                            <th className="px-2 py-1 border text-center">Requested Qty</th>
                                          )}
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {req.warehouseBatches.map((b) => (
                                          <tr key={b.warehouseProductId}>
                                            <td className="px-2 py-1 border text-center">{b.batch}</td>
                                            <td className="px-2 py-1 border text-center">{new Date(b.expireDate).toLocaleDateString()}</td>
                                            <td className="px-2 py-1 border text-center">{b.totalQuantity}</td>
                                            {req.status !== "pending" && (
                                              <td className="px-2 py-1 border text-center">{b.requestedQuantity || 0}</td>
                                            )}
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>

                                  {/* Depot Batches */}
                                  <div className="flex-1 min-w-[250px]">
                                    <h4 className="font-bold mb-2 text-center">Depot Batches</h4>
                                    <table className="w-full border border-gray-300 border-collapse">
                                      <thead>
                                        <tr>
                                          <th className="px-2 py-1 border text-center">Batch</th>
                                          <th className="px-2 py-1 border text-center">Expire Date</th>
                                          <th className="px-2 py-1 border text-center">Total Qty</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {req.depotBatches.map((b) => (
                                          <tr key={b.depotProductId}>
                                            <td className="px-2 py-1 border text-center">{b.batch}</td>
                                            <td className="px-2 py-1 border text-center">{new Date(b.expireDate).toLocaleDateString()}</td>
                                            <td className="px-2 py-1 border text-center">{b.totalQuantity}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </td>
                            </motion.tr>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-700 mt-6">
          No requests found for "{selectedStatus}" status.
        </p>
      )}
    </div>
  );
};

export default DepotRequests;