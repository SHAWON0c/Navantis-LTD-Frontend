

// // src/components/PendingOrdersCard.jsx
// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FaClipboardList, FaHistory, FaCheck } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import {
//   useGetPendingOrdersQuery,
//   useApproveOrderMutation,
//   useDeliverOrderMutation,
// } from "../../redux/features/orders/orderApi";

// import { useAssignRiderMutation, useGetAllRidersQuery } from "../../redux/features/rider/riderApi";
// import Loader from "../../component/Loader";
// import OrderProductsDetailsModal from "../../component/modals/OrderProductsDetailsModal";

// const PendingOrdersCard = () => {
//   const { data, isLoading, refetch } = useGetPendingOrdersQuery();
//   const orders = data?.data || [];

//   const { data: ridersData } = useGetAllRidersQuery();
//   const riders = ridersData?.data || [];

//   const [selectedProductOrder, setSelectedProductOrder] = useState(null);
//   const [expandedRows, setExpandedRows] = useState([]);
//   const [pendingApprovalOrderId, setPendingApprovalOrderId] = useState(null);
//   const [approveOrder, { isLoading: isApproving }] = useApproveOrderMutation();
//   const [deliverOrder] = useDeliverOrderMutation();
//   const [assignRiderApi] = useAssignRiderMutation();
//   const navigate = useNavigate();

//   if (isLoading) return <Loader />;

//   if (!orders.length) {
//     return (
//       <div className="text-center mt-12">
//         <p className="text-gray-500 mb-4 mt-60">No pending orders</p>
//         <button
//           onClick={() => window.location.reload()}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
//         >
//           Refresh
//         </button>
//       </div>
//     );
//   }

//   const toggleRow = (orderId) => {
//     setExpandedRows((prev) =>
//       prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
//     );
//   };

//   // ----- Approve Order -----
// const handleApprove = async (order) => {
//   try {
//     console.log("DEBUG: Approving order", order._id);

//     const productsPayload = order.products.map((p) => {
//       if (p.batchCount === 1) {
//         console.log(`DEBUG: Product ${p.productId} single batch`);
//         return { productId: p.productId };
//       }

//       const selectedBatches = p.batches
//         .filter((b) => b.selectedQuantity > 0)
//         .map((b) => ({
//           depotProductId: b.depotProductId,
//           quantity: Number(b.selectedQuantity),
//         }));

//       console.log(`DEBUG: Product ${p.productId} multiple batches`, selectedBatches);
//       return { productId: p.productId, selectedBatches };
//     });

//     console.log("DEBUG: Payload for approveOrder", { orderId: order._id, products: productsPayload });

//     await approveOrder({ orderId: order._id, products: productsPayload }).unwrap();

//     toast.success("✅ Order approved successfully!");
//     refetch();
//     setSelectedProductOrder(null);
//     setPendingApprovalOrderId(null);
//   } catch (err) {
//     console.error("DEBUG: Approve order error", err);
//     toast.error(`❌ Failed to approve order: ${err?.data?.message || err.message}`);
//   }
// };

//   const handleDeliver = (order) => {
//     console.log("DEBUG: Delivering order", order._id);
//     navigate("/invoice-print", { state: { order } });
//   };

//   const assignRider = async (orderId, riderId) => {
//     if (!riderId) return;
//     try {
//       console.log("DEBUG: Assigning rider", riderId, "to order", orderId);
//       await assignRiderApi({ orderId, riderId, orderStatus: "assigned" }).unwrap();
//       toast.success("✅ Rider assigned successfully!");
//       refetch();
//     } catch (err) {
//       console.error("DEBUG: Assign rider error", err);
//       toast.error(`❌ Failed to assign rider: ${err?.data?.message || err.message}`);
//     }
//   };

//   return (
//     <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
//       <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">
//         Pending Orders
//       </h1>

//       <div className="overflow-x-auto bg-white shadow rounded-xl">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-100">
//             <tr>
//               {["#", "Customer", "Customer ID", "Territory", "Order Date", "Payment Mode", "Phone", "Actions"].map(
//                 (th) => (
//                   <th
//                     key={th}
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     {th}
//                   </th>
//                 )
//               )}
//             </tr>
//           </thead>

//           <tbody className="bg-white divide-y divide-gray-200">
//             {orders.map((order, index) => {
//               const isExpanded = expandedRows.includes(order._id);

//               return (
//                 <React.Fragment key={order._id}>
//                   <motion.tr
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.2 }}
//                     className="hover:bg-gray-50"
//                   >
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{index + 1}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customer.customerName}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customer.customerId}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.territory.territoryName}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                       {new Date(order.orderDate).toLocaleDateString("en-GB")}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.payMode}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customer.mobile}</td>
//                     <td className="px-6 py-4 flex flex-wrap gap-2">
//                       {order.orderStatus === "pending" && (
//                         <button
//                           onClick={() => {
//                             setSelectedProductOrder(order);
//                             setPendingApprovalOrderId(order._id);
//                           }}
//                           className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs md:text-sm transition-colors"
//                         >
//                           <FaCheck /> Approve
//                         </button>
//                       )}

//                       {order.orderStatus === "confirmed" && !order.assignedRiderId && (
//                         <select
//                           onChange={(e) => assignRider(order._id, e.target.value)}
//                           className="px-3 py-1 text-sm rounded-md border border-gray-300"
//                         >
//                           <option value="">Assign Rider</option>
//                           {riders.map((r) => (
//                             <option key={r._id} value={r._id}>
//                               {r.name}
//                             </option>
//                           ))}
//                         </select>
//                       )}

//                       {(order.orderStatus === "assigned" ||
//                         (order.orderStatus === "confirmed" && order.assignedRiderId)) && (
//                         <button
//                           onClick={() => handleDeliver(order)}
//                           className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs md:text-sm transition-colors"
//                         >
//                           Deliver & Download Invoice
//                         </button>
//                       )}

//                       <button
//                         onClick={() => setSelectedProductOrder(order)}
//                         className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-xs md:text-sm transition-colors"
//                       >
//                         <FaClipboardList /> Details
//                       </button>
//                     </td>
//                   </motion.tr>

//                   {/* Collapsible Products */}
//                   {isExpanded && (
//                     <tr className="bg-gray-50">
//                       <td colSpan={8} className="px-6 py-4">
//                         <div className="overflow-x-auto">
//                           <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
//                             <thead className="bg-gray-200">
//                               <tr>
//                                 {["Product ID", "Price", "Quantity", "Batches", "Expiry"].map((th) => (
//                                   <th
//                                     key={th}
//                                     className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
//                                   >
//                                     {th}
//                                   </th>
//                                 ))}
//                               </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                               {order.products.map((p) => (
//                                 <tr key={p.productId}>
//                                   <td className="px-4 py-2 text-sm text-gray-700">{p.productId}</td>
//                                   <td className="px-4 py-2 text-sm text-gray-700">{p.tradePrice}</td>
//                                   <td className="px-4 py-2 text-sm text-gray-700">{p.quantity}</td>
//                                   <td className="px-4 py-2 text-sm text-gray-700">
//                                     {p.batches.map((b) => (
//                                       <div key={b.depotProductId}>
//                                         {b.batch} - {b.quantity || b.totalQuantity} pcs
//                                       </div>
//                                     ))}
//                                   </td>
//                                   <td className="px-4 py-2 text-sm text-gray-700">
//                                     {p.batches.map((b) => (
//                                       <div key={b.depotProductId}>
//                                         {b.expireDate
//                                           ? new Date(b.expireDate).toLocaleDateString("en-GB")
//                                           : "-"}
//                                       </div>
//                                     ))}
//                                   </td>
//                                 </tr>
//                               ))}
//                             </tbody>
//                           </table>
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </React.Fragment>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       {/* Product Modal */}
//       <AnimatePresence>
//         {selectedProductOrder && (
//           <OrderProductsDetailsModal
//             isOpen={!!selectedProductOrder}
//             order={selectedProductOrder}
//             onClose={() => {
//               setSelectedProductOrder(null);
//               setPendingApprovalOrderId(null);
//             }}
//             onDeliver={handleDeliver}
//             showApproveButton={pendingApprovalOrderId === selectedProductOrder._id}
//             onApprove={() => handleApprove(selectedProductOrder)}
//             isLoading={isApproving} // optional, for button state
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default PendingOrdersCard;

// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FaClipboardList, FaCheck } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import {
//   useGetPendingOrdersQuery,
//   useApproveOrderMutation,
//   useDeliverOrderMutation,
// } from "../../redux/features/orders/orderApi";

// import { useAssignRiderMutation, useGetAllRidersQuery } from "../../redux/features/rider/riderApi";
// import Loader from "../../component/Loader";
// import OrderProductsDetailsModal from "../../component/modals/OrderProductsDetailsModal";

// const PendingOrdersCard = () => {
//   const { data, isLoading, refetch } = useGetPendingOrdersQuery();
//   const orders = data?.data || [];

//   const { data: ridersData } = useGetAllRidersQuery();
//   const riders = ridersData?.data || [];

//   const [selectedProductOrder, setSelectedProductOrder] = useState(null);
//   const [expandedRows, setExpandedRows] = useState([]);
//   const [approvedOrders, setApprovedOrders] = useState([]); // track approved orders
//   const [pendingApprovalOrderId, setPendingApprovalOrderId] = useState(null);

//   const [approveOrder, { isLoading: isApproving }] = useApproveOrderMutation();
//   const [deliverOrder] = useDeliverOrderMutation();
//   const [assignRiderApi] = useAssignRiderMutation();
//   const navigate = useNavigate();

//   if (isLoading) return <Loader />;

//   if (!orders.length) {
//     return (
//       <div className="text-center mt-12">
//         <p className="text-gray-500 mb-4 mt-60">No pending orders</p>
//         <button
//           onClick={() => window.location.reload()}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
//         >
//           Refresh
//         </button>
//       </div>
//     );
//   }

//   const toggleRow = (orderId) => {
//     setExpandedRows((prev) =>
//       prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
//     );
//   };

//   const handleDeliver = (order) => {
//     navigate("/invoice-print", { state: { order } });
//   };

//   const assignRider = async (orderId, riderId) => {
//     if (!riderId) return;
//     try {
//       await assignRiderApi({ orderId, riderId, orderStatus: "assigned" }).unwrap();
//       toast.success("✅ Rider assigned successfully!");
//       refetch();
//     } catch (err) {
//       console.error("Assign rider error", err);
//       toast.error(`❌ Failed to assign rider: ${err?.data?.message || err.message}`);
//     }
//   };

//   // ----- Confirm Approve from Modal -----
//   const handleConfirmApprove = async (order) => {
//     if (approvedOrders.includes(order._id)) {
//       toast.info("Order already approved!");
//       return;
//     }

//     try {
//       // Prepare products payload
//       const productsPayload = order.products.map((p) => {
//         if (p.batchCount === 1) return { productId: p.productId };
//         const selectedBatches = p.batches
//           .filter((b) => b.selectedQuantity > 0)
//           .map((b) => ({ depotProductId: b.depotProductId, quantity: Number(b.selectedQuantity) }));
//         return { productId: p.productId, selectedBatches };
//       });

//       await approveOrder({ orderId: order._id, products: productsPayload }).unwrap();

//       toast.success("✅ Order approved successfully!");
//       setApprovedOrders((prev) => [...prev, order._id]);
//       refetch();
//       setSelectedProductOrder(null);
//       setPendingApprovalOrderId(null);
//     } catch (err) {
//       console.error("Approve order error", err);
//       toast.error(`❌ Failed to approve order: ${err?.data?.message || err.message}`);
//     }
//   };

//   return (
//     <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
//       <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">
//         Pending Orders
//       </h1>

//       <div className="overflow-x-auto bg-white shadow rounded-xl">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-100">
//             <tr>
//               {["#", "Customer", "Customer ID", "Territory", "Order Date", "Payment Mode", "Phone", "Actions"].map(
//                 (th) => (
//                   <th key={th} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     {th}
//                   </th>
//                 )
//               )}
//             </tr>
//           </thead>

//           <tbody className="bg-white divide-y divide-gray-200">
//             {orders.map((order, index) => {
//               const isExpanded = expandedRows.includes(order._id);
//               const isApproved = approvedOrders.includes(order._id);

//               return (
//                 <React.Fragment key={order._id}>
//                   <motion.tr
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.2 }}
//                     className={`hover:bg-gray-50 ${isApproved ? "bg-gray-200" : ""}`}
//                   >
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{index + 1}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customer.customerName}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customer.customerId}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.territory.territoryName}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                       {new Date(order.orderDate).toLocaleDateString("en-GB")}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.payMode}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customer.mobile}</td>
//                     <td className="px-6 py-4 flex flex-wrap gap-2">
//                       {!isApproved && order.orderStatus === "pending" && (
//                         <button
//                           onClick={() => {
//                             setSelectedProductOrder(order);
//                             setPendingApprovalOrderId(order._id);
//                           }}
//                           className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs md:text-sm transition-colors"
//                         >
//                           <FaCheck /> Approve
//                         </button>
//                       )}

//                       {order.orderStatus === "confirmed" && !order.assignedRiderId && (
//                         <select
//                           onChange={(e) => assignRider(order._id, e.target.value)}
//                           className="px-3 py-1 text-sm rounded-md border border-gray-300"
//                         >
//                           <option value="">Assign Rider</option>
//                           {riders.map((r) => (
//                             <option key={r._id} value={r._id}>
//                               {r.name}
//                             </option>
//                           ))}
//                         </select>
//                       )}

//                       {(order.orderStatus === "assigned" ||
//                         (order.orderStatus === "confirmed" && order.assignedRiderId)) && (
//                         <button
//                           onClick={() => handleDeliver(order)}
//                           className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs md:text-sm transition-colors"
//                         >
//                           Deliver & Download Invoice
//                         </button>
//                       )}

//                       <button
//                         onClick={() => setSelectedProductOrder(order)}
//                         className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-xs md:text-sm transition-colors"
//                       >
//                         <FaClipboardList /> Details
//                       </button>
//                     </td>
//                   </motion.tr>

//                   {/* Collapsible Products */}
//                   {isExpanded && (
//                     <tr className="bg-gray-50">
//                       <td colSpan={8} className="px-6 py-4">
//                         <div className="overflow-x-auto">
//                           <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
//                             <thead className="bg-gray-200">
//                               <tr>
//                                 {["Product ID", "Price", "Quantity", "Batches", "Expiry"].map((th) => (
//                                   <th key={th} className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
//                                     {th}
//                                   </th>
//                                 ))}
//                               </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                               {order.products.map((p) => (
//                                 <tr key={p.productId}>
//                                   <td className="px-4 py-2 text-sm text-gray-700">{p.productId}</td>
//                                   <td className="px-4 py-2 text-sm text-gray-700">{p.tradePrice}</td>
//                                   <td className="px-4 py-2 text-sm text-gray-700">{p.quantity}</td>
//                                   <td className="px-4 py-2 text-sm text-gray-700">
//                                     {p.batches.map((b) => (
//                                       <div key={b.depotProductId}>
//                                         {b.batch} - {b.quantity || b.totalQuantity} pcs
//                                       </div>
//                                     ))}
//                                   </td>
//                                   <td className="px-4 py-2 text-sm text-gray-700">
//                                     {p.batches.map((b) => (
//                                       <div key={b.depotProductId}>
//                                         {b.expireDate
//                                           ? new Date(b.expireDate).toLocaleDateString("en-GB")
//                                           : "-"}
//                                       </div>
//                                     ))}
//                                   </td>
//                                 </tr>
//                               ))}
//                             </tbody>
//                           </table>
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </React.Fragment>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       {/* Product Modal */}
//       <AnimatePresence>
//         {selectedProductOrder && (
//           <OrderProductsDetailsModal
//             isOpen={!!selectedProductOrder}
//             order={selectedProductOrder}
//             onClose={() => {
//               setSelectedProductOrder(null);
//               setPendingApprovalOrderId(null);
//             }}
//             onApprove={() => handleConfirmApprove(selectedProductOrder)}
//             showApproveButton={pendingApprovalOrderId === selectedProductOrder._id && !approvedOrders.includes(selectedProductOrder._id)}
//             isLoading={isApproving}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default PendingOrdersCard;






// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FaClipboardList, FaCheck } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import {
//   useGetPendingOrdersQuery,
//   useDeliverOrderMutation,
// } from "../../redux/features/orders/orderApi";

// import { useAssignRiderMutation, useGetAllRidersQuery } from "../../redux/features/rider/riderApi";
// import Loader from "../../component/Loader";
// import OrderProductsDetailsModal from "../../component/modals/OrderProductsDetailsModal";

// const PendingOrdersCard = () => {
//   const { data, isLoading, refetch } = useGetPendingOrdersQuery();
//   const orders = data?.data || [];

//   const { data: ridersData } = useGetAllRidersQuery();
//   const riders = ridersData?.data || [];

//   const [selectedProductOrder, setSelectedProductOrder] = useState(null);
//   const [expandedRows, setExpandedRows] = useState([]);

//   const [assignRiderApi] = useAssignRiderMutation();
//   const [deliverOrder] = useDeliverOrderMutation();
//   const navigate = useNavigate();

//   if (isLoading) return <Loader />;

//   if (!orders.length) {
//     return (
//       <div className="text-center mt-12">
//         <p className="text-gray-500 mb-4 mt-60">No pending orders</p>
//         <button
//           onClick={() => window.location.reload()}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
//         >
//           Refresh
//         </button>
//       </div>
//     );
//   }

//   const toggleRow = (orderId) => {
//     setExpandedRows((prev) =>
//       prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
//     );
//   };

//   const handleDeliver = (order) => {
//     navigate("/invoice-print", { state: { order } });
//   };

//   const assignRider = async (orderId, riderId) => {
//     if (!riderId) return;
//     try {
//       await assignRiderApi({ orderId, riderId, orderStatus: "assigned" }).unwrap();
//       toast.success("✅ Rider assigned successfully!");
//       refetch();
//     } catch (err) {
//       console.error("Assign rider error", err);
//       toast.error(`❌ Failed to assign rider: ${err?.data?.message || err.message}`);
//     }
//   };

//   return (
//     <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
//       <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">
//         Pending Orders
//       </h1>

//       <div className="overflow-x-auto bg-white shadow rounded-xl">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-100">
//             <tr>
//               {["#", "Customer", "Customer ID", "Territory", "Order Date", "Payment Mode", "Phone", "Actions"].map(
//                 (th) => (
//                   <th key={th} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     {th}
//                   </th>
//                 )
//               )}
//             </tr>
//           </thead>

//           <tbody className="bg-white divide-y divide-gray-200">
//             {orders.map((order, index) => {
//               const isExpanded = expandedRows.includes(order._id);

//               return (
//                 <React.Fragment key={order._id}>
//                   <motion.tr
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.2 }}
//                     className="hover:bg-gray-50"
//                   >
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{index + 1}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customer.customerName}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customer.customerId}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.territory.territoryName}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                       {new Date(order.orderDate).toLocaleDateString("en-GB")}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.payMode}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customer.mobile}</td>
//                     <td className="px-6 py-4 flex flex-wrap gap-2">
//                       {/* Only open modal for approve */}
//                       {order.orderStatus === "pending" && (
//                         <button
//                           onClick={() => setSelectedProductOrder(order)}
//                           className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs md:text-sm transition-colors"
//                         >
//                           <FaCheck /> Approve
//                         </button>
//                       )}

//                       {order.orderStatus === "confirmed" && !order.assignedRiderId && (
//                         <select
//                           onChange={(e) => assignRider(order._id, e.target.value)}
//                           className="px-3 py-1 text-sm rounded-md border border-gray-300"
//                         >
//                           <option value="">Assign Rider</option>
//                           {riders.map((r) => (
//                             <option key={r._id} value={r._id}>
//                               {r.name}
//                             </option>
//                           ))}
//                         </select>
//                       )}

//                       {(order.orderStatus === "assigned" ||
//                         (order.orderStatus === "confirmed" && order.assignedRiderId)) && (
//                         <button
//                           onClick={() => handleDeliver(order)}
//                           className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs md:text-sm transition-colors"
//                         >
//                           Deliver & Download Invoice
//                         </button>
//                       )}

//                       <button
//                         onClick={() => setSelectedProductOrder(order)}
//                         className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-xs md:text-sm transition-colors"
//                       >
//                         <FaClipboardList /> Details
//                       </button>
//                     </td>
//                   </motion.tr>

//                   {/* Collapsible Products */}
//                   {isExpanded && (
//                     <tr className="bg-gray-50">
//                       <td colSpan={8} className="px-6 py-4">
//                         <div className="overflow-x-auto">
//                           <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
//                             <thead className="bg-gray-200">
//                               <tr>
//                                 {["Product ID", "Price", "Quantity", "Batches", "Expiry"].map((th) => (
//                                   <th key={th} className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
//                                     {th}
//                                   </th>
//                                 ))}
//                               </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                               {order.products.map((p) => (
//                                 <tr key={p.productId}>
//                                   <td className="px-4 py-2 text-sm text-gray-700">{p.productId}</td>
//                                   <td className="px-4 py-2 text-sm text-gray-700">{p.tradePrice}</td>
//                                   <td className="px-4 py-2 text-sm text-gray-700">{p.quantity}</td>
//                                   <td className="px-4 py-2 text-sm text-gray-700">
//                                     {p.batches.map((b) => (
//                                       <div key={b.depotProductId}>
//                                         {b.batch} - {b.quantity || b.totalQuantity} pcs
//                                       </div>
//                                     ))}
//                                   </td>
//                                   <td className="px-4 py-2 text-sm text-gray-700">
//                                     {p.batches.map((b) => (
//                                       <div key={b.depotProductId}>
//                                         {b.expireDate
//                                           ? new Date(b.expireDate).toLocaleDateString("en-GB")
//                                           : "-"}
//                                       </div>
//                                     ))}
//                                   </td>
//                                 </tr>
//                               ))}
//                             </tbody>
//                           </table>
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </React.Fragment>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       {/* Product Modal */}
//       <AnimatePresence>
//         {selectedProductOrder && (
//           <OrderProductsDetailsModal
//             isOpen={!!selectedProductOrder}
//             order={selectedProductOrder}
//             onClose={() => setSelectedProductOrder(null)}
//             showApproveButton={true} // modal decides internally if button should be disabled after approve
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default PendingOrdersCard;






import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaClipboardList, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetPendingOrdersQuery,
  useApproveOrderMutation,
  useDeliverOrderMutation,
} from "../../redux/features/orders/orderApi";

import { useAssignRiderMutation, useGetAllRidersQuery } from "../../redux/features/rider/riderApi";
import Loader from "../../component/Loader";
import OrderProductsDetailsModal from "../../component/modals/OrderProductsDetailsModal";
import { ChevronRight } from "lucide-react";
import Card from "../../component/common/Card";
import Button from "../../component/common/Button";
import { MdArrowBack } from "react-icons/md";

const PendingOrdersCard = () => {
  const { data, isLoading, refetch } = useGetPendingOrdersQuery();
  const orders = data?.data || [];

  const { data: ridersData } = useGetAllRidersQuery();
  const riders = ridersData?.data || [];

  const [selectedProductOrder, setSelectedProductOrder] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);

  const [approveOrder, { isLoading: isApproving }] = useApproveOrderMutation();
  const [deliverOrder] = useDeliverOrderMutation();
  const [assignRiderApi] = useAssignRiderMutation();
  const navigate = useNavigate();

  if (isLoading) return <Loader />;

  if (!orders.length) {
    return (
      <div className="text-center mt-12">
        <p className="text-gray-500 mb-4 mt-60">No pending orders</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Refresh
        </button>
      </div>
    );
  }

  const handleDeliver = (order) => {
    navigate("/invoice-print", { state: { order } });
  };

  const assignRider = async (orderId, riderId) => {
    if (!riderId) return;
    try {
      await assignRiderApi({ orderId, riderId, orderStatus: "assigned" }).unwrap();
      toast.success("✅ Rider assigned successfully!");
      refetch();
    } catch (err) {
      console.error("Assign rider error", err);
      toast.error(`❌ Failed to assign rider: ${err?.data?.message || err.message}`);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="small" icon={MdArrowBack} onClick={() => window.history.back()}
              className="ml-2">
              Back
            </Button>
            <div className="bg-white text-gray-500 flex items-center px-3 sm:px-4 md:px-6 py-2 sm:h-12">
              <h2 className="flex flex-wrap items-center text-xs sm:text-sm md:text-base font-semibold text-gray-800 gap-1 sm:gap-2">
                <span>EMS</span>
                <ChevronRight size={14} className="text-gray-400" />
                <span>DEPOT</span>
                <ChevronRight size={14} className="text-gray-400" />
                <span className="text-gray-900 font-bold">PENDING ORDERS</span>
              </h2>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-neutral-500 mr-2 sm:mr-4 md:mr-6">
            Total Products:
          </div>
        </div>
      </Card>

      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {["#", "Customer", "Customer ID", "Territory", "Order Date", "Payment Mode", "Phone", "Actions"].map(
                (th) => (
                  <th
                    key={th}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {th}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order, index) => {
              const isExpanded = expandedRows.includes(order._id);

              return (
                <React.Fragment key={order._id}>
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customer.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customer.customerId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.territory.territoryName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(order.orderDate).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.payMode}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customer.mobile}</td>
                    <td className="px-6 py-4 flex flex-wrap gap-2">
                      {order.orderStatus === "pending" && (
                        <button
                          onClick={() => setSelectedProductOrder(order)}
                          className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs md:text-sm transition-colors"
                        >
                          <FaCheck /> Approve
                        </button>
                      )}

                      {order.orderStatus === "confirmed" && !order.assignedRiderId && (
                        <select
                          onChange={(e) => assignRider(order._id, e.target.value)}
                          className="px-3 py-1 text-sm rounded-md border border-gray-300"
                        >
                          <option value="">Assign Rider</option>
                          {riders.map((r) => (
                            <option key={r._id} value={r._id}>{r.name}</option>
                          ))}
                        </select>
                      )}

                      {(order.orderStatus === "assigned" ||
                        (order.orderStatus === "confirmed" && order.assignedRiderId)) && (
                        <button
                          onClick={() => handleDeliver(order)}
                          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs md:text-sm transition-colors"
                        >
                          Deliver & Download Invoice
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedProductOrder(order)}
                        className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-xs md:text-sm transition-colors"
                      >
                        <FaClipboardList /> Details
                      </button>
                    </td>
                  </motion.tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProductOrder && (
          <OrderProductsDetailsModal
            isOpen={!!selectedProductOrder}
            order={selectedProductOrder}
            onClose={() => setSelectedProductOrder(null)}
            showApproveButton={true}
            onApprove={async (productsPayload) => {
              try {
                await approveOrder({
                  orderId: selectedProductOrder._id,
                  products: productsPayload,
                }).unwrap();
                toast.success("✅ Order approved successfully!");
                setSelectedProductOrder(null);
                refetch();
              } catch (err) {
                console.error("Approve order error", err);
                toast.error(`❌ Failed to approve order: ${err?.data?.message || err.message}`);
              }
            }}
            isLoading={isApproving}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PendingOrdersCard;

