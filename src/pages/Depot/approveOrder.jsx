// // src/components/PendingOrdersCard.jsx
// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FaClipboardList, FaHistory, FaCheck } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

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

//   const [approveOrder] = useApproveOrderMutation();
//   const [deliverOrder] = useDeliverOrderMutation();
//   const [assignRiderApi] = useAssignRiderMutation();

//   const navigate = useNavigate();

//   if (isLoading) return <Loader />;
//   if (!orders.length) return <p className="text-center mt-12 text-gray-500">No pending orders</p>;

//   const toggleRow = (orderId) => {
//     setExpandedRows(prev =>
//       prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
//     );
//   };

//   const handleApprove = async (orderId) => {
//     try {
//       await approveOrder(orderId).unwrap();
//       alert("✅ Order approved successfully!");
//       refetch();
//     } catch (err) {
//       console.error(err);
//       alert("❌ Failed to approve order");
//     }
//   };

// const handleDeliver = (order) => {
//   // Redirect to invoice page with order details
//   navigate("/invoice-print", { state: { order } });
// };
//   const assignRider = async (orderId, riderId) => {
//     if (!riderId) return;
//     try {
//       await assignRiderApi({ orderId, riderId, orderStatus: "assigned" }).unwrap();
//       alert("✅ Rider assigned successfully!");
//       refetch();
//     } catch (err) {
//       console.error(err);
//       alert("❌ Failed to assign rider");
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
//               {["#", "Customer", "Customer ID", "Territory", "Order Date", "Payment Mode", "Phone", "Actions"].map(th => (
//                 <th key={th} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{th}</th>
//               ))}
//             </tr>
//           </thead>

//           <tbody className="bg-white divide-y divide-gray-200">
//             {orders.map((order, index) => {
//               const isExpanded = expandedRows.includes(order.orderId);

//               return (
//                 <React.Fragment key={order.orderId}>
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
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(order.orderDate).toLocaleDateString("en-GB")}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.payMode}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customer.phoneNumber}</td>
//                     <td className="px-6 py-4 whitespace-nowrap flex flex-wrap gap-2">

//                       {/* Approve / Assign Rider / Deliver */}
//                       {/* Approve / Assign Rider / Deliver Logic */}
//                       {order.orderStatus === "pending" ? (
//                         // Order not approved yet
//                         <button
//                           onClick={() => handleApprove(order.orderId)}
//                           className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs md:text-sm transition-colors"
//                         >
//                           <FaCheck /> Approve
//                         </button>
//                       ) : order.orderStatus === "confirmed" ? (
//                         // Order approved but rider not assigned yet
//                         !order.assignedRiderId ? (
//                           <select
//                             onChange={(e) => assignRider(order.orderId, e.target.value)}
//                             className="px-3 py-1 text-sm rounded-md border border-gray-300"
//                           >
//                             <option value="">Assign Rider</option>
//                             {riders.map((r) => (
//                               <option key={r._id} value={r._id}>
//                                 {r.name}
//                               </option>
//                             ))}
//                           </select>
//                         ) : (
//                           // Rider assigned → deliver button
//                           <button
//                             onClick={() => handleDeliver(order)}
//                             className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs md:text-sm transition-colors"
//                           >
//                             Deliver & Download Invoice
//                           </button>
//                         )
//                       ) : order.orderStatus === "assigned" ? (
//                         // Already assigned → deliver button
//                         <button
//                           onClick={() => handleDeliver(order)}
//                           className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs md:text-sm transition-colors"
//                         >
//                           Deliver & Download Invoice
//                         </button>
//                       ) : null}

//                       {/* Details / History */}
//                       <button
//                         onClick={() => setSelectedProductOrder(order)}
//                         className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-xs md:text-sm transition-colors"
//                       >
//                         <FaClipboardList /> Details
//                       </button>
//                       <button
//                         onClick={() => alert("Customer history placeholder")}
//                         className="flex items-center gap-1 bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-md text-xs md:text-sm transition-colors"
//                       >
//                         <FaHistory /> History
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
//                                 {["Product", "Pack Size", "Trade Price", "Quantity", "Earliest Expiry", "Batch", "Depot Quantity"].map(th => (
//                                   <th key={th} className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{th}</th>
//                                 ))}
//                               </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                               {order.products.map(p => (
//                                 <tr key={p.productId}>
//                                   <td className="px-4 py-2 text-sm text-gray-700">{p.productName}</td>
//                                   <td className="px-4 py-2 text-sm text-gray-700">{p.packSize}</td>
//                                   <td className="px-4 py-2 text-sm text-gray-700">{p.tradePrice}</td>
//                                   <td className="px-4 py-2 text-sm text-gray-700">{p.quantity}</td>
//                                   <td className="px-4 py-2 text-sm text-gray-700">{p.earliestExpiryDate ? new Date(p.earliestExpiryDate).toLocaleDateString("en-GB") : "-"}</td>
//                                   <td className="px-4 py-2 text-sm text-gray-700">{p.batch || "-"}</td>
//                                   <td className="px-4 py-2 text-sm text-gray-700">{p.depotTotalQuantity || "-"}</td>
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
//             onDeliver={handleDeliver}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default PendingOrdersCard;



// src/components/PendingOrdersCard.jsx
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
//   const [pendingApprovalOrderId, setPendingApprovalOrderId] = useState(null); // New state

//   const [approveOrder] = useApproveOrderMutation();
//   const [deliverOrder] = useDeliverOrderMutation();
//   const [assignRiderApi] = useAssignRiderMutation();

//   const navigate = useNavigate();

//   if (isLoading) return <Loader />;
//   if (!orders.length) return <p className="text-center mt-12 text-gray-500">No pending orders</p>;

//   const toggleRow = (orderId) => {
//     setExpandedRows(prev =>
//       prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
//     );
//   };

// const handleApprove = async (orderId) => {
//   try {
//     await approveOrder(orderId).unwrap();
//     toast.success("Order approved successfully!");
//     refetch();
//     setSelectedProductOrder(null);
//     setPendingApprovalOrderId(null);
//   } catch (err) {
//     console.error(err);
//     toast.error("❌ Failed to approve order");
//   }
// };

//   const handleDeliver = (order) => {
//     navigate("/invoice-print", { state: { order } });
//   };

//   const assignRider = async (orderId, riderId) => {
//     if (!riderId) return;
//     try {
//       await assignRiderApi({ orderId, riderId, orderStatus: "assigned" }).unwrap();
//        toast.success("Rider assigned successfully!");
//       refetch();
//     } catch (err) {
//       console.error(err);
//       alert("❌ Failed to assign rider");
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
//               {["#", "Customer", "Customer ID", "Territory", "Order Date", "Payment Mode", "Phone", "Actions"].map(th => (
//                 <th key={th} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{th}</th>
//               ))}
//             </tr>
//           </thead>

//           <tbody className="bg-white divide-y divide-gray-200">
//             {orders.map((order, index) => {
//               const isExpanded = expandedRows.includes(order.orderId);

//               return (
//                 <React.Fragment key={order.orderId}>
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
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(order.orderDate).toLocaleDateString("en-GB")}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.payMode}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customer.phoneNumber}</td>
//                     <td className="px-6 py-4 whitespace-nowrap flex flex-wrap gap-2">
                      
//                       {/* Approve / Assign Rider / Deliver */}
//                       {order.orderStatus === "pending" ? (
//                         <button
//                           onClick={() => {
//                             setSelectedProductOrder(order);
//                             setPendingApprovalOrderId(order.orderId); // mark order as pending approval
//                           }}
//                           className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs md:text-sm transition-colors"
//                         >
//                           <FaCheck /> Approve
//                         </button>
//                       ) : order.orderStatus === "confirmed" ? (
//                         !order.assignedRiderId ? (
//                           <select
//                             onChange={(e) => assignRider(order.orderId, e.target.value)}
//                             className="px-3 py-1 text-sm rounded-md border border-gray-300"
//                           >
//                             <option value="">Assign Rider</option>
//                             {riders.map((r) => (
//                               <option key={r._id} value={r._id}>
//                                 {r.name}
//                               </option>
//                             ))}
//                           </select>
//                         ) : (
//                           <button
//                             onClick={() => handleDeliver(order)}
//                             className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs md:text-sm transition-colors"
//                           >
//                             Deliver & Download Invoice
//                           </button>
//                         )
//                       ) : order.orderStatus === "assigned" ? (
//                         <button
//                           onClick={() => handleDeliver(order)}
//                           className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs md:text-sm transition-colors"
//                         >
//                           Deliver & Download Invoice
//                         </button>
//                       ) : null}

//                       {/* Details / History */}
//                       <button
//                         onClick={() => setSelectedProductOrder(order)}
//                         className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-xs md:text-sm transition-colors"
//                       >
//                         <FaClipboardList /> Details
//                       </button>
//                       <button
//                         onClick={() => alert("Customer history placeholder")}
//                         className="flex items-center gap-1 bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-md text-xs md:text-sm transition-colors"
//                       >
//                         <FaHistory /> History
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
//                                 {["Product", "Pack Size", "Trade Price", "Quantity", "Earliest Expiry", "Batch", "Depot Quantity"].map(th => (
//                                   <th key={th} className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{th}</th>
//                                 ))}
//                               </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                               {order.products.map(p => (
//                                 <tr key={p.productId}>
//                                   <td className="px-4 py-2 text-sm text-gray-700">{p.productName}</td>
//                                   <td className="px-4 py-2 text-sm text-gray-700">{p.packSize}</td>
//                                   <td className="px-4 py-2 text-sm text-gray-700">{p.tradePrice}</td>
//                                   <td className="px-4 py-2 text-sm text-gray-700">{p.quantity}</td>
//                                   <td className="px-4 py-2 text-sm text-gray-700">{p.earliestExpiryDate ? new Date(p.earliestExpiryDate).toLocaleDateString("en-GB") : "-"}</td>
//                                   <td className="px-4 py-2 text-sm text-gray-700">{p.batch || "-"}</td>
//                                   <td className="px-4 py-2 text-sm text-gray-700">{p.depotTotalQuantity || "-"}</td>
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
//             showApproveButton={pendingApprovalOrderId === selectedProductOrder.orderId} // pass prop
//             onApprove={() => handleApprove(selectedProductOrder.orderId)} // trigger approval
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default PendingOrdersCard;


// src/components/PendingOrdersCard.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaClipboardList, FaHistory, FaCheck } from "react-icons/fa";
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

const PendingOrdersCard = () => {
  const { data, isLoading, refetch } = useGetPendingOrdersQuery();
  const orders = data?.data || [];

  const { data: ridersData } = useGetAllRidersQuery();
  const riders = ridersData?.data || [];

  const [selectedProductOrder, setSelectedProductOrder] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);
  const [pendingApprovalOrderId, setPendingApprovalOrderId] = useState(null);

  const [approveOrder] = useApproveOrderMutation();
  const [deliverOrder] = useDeliverOrderMutation();
  const [assignRiderApi] = useAssignRiderMutation();

  const navigate = useNavigate();

  if (isLoading) return <Loader />;
  if (!orders.length) return <p className="text-center mt-12 text-gray-500">No pending orders</p>;

  const toggleRow = (orderId) => {
    setExpandedRows(prev =>
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  };

  const handleApprove = async (orderId) => {
    try {
      await approveOrder(orderId).unwrap();
      toast.success("Order approved successfully!");
      refetch();
      setSelectedProductOrder(null);
      setPendingApprovalOrderId(null);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to approve order");
    }
  };

  const handleDeliver = (order) => {
    navigate("/invoice-print", { state: { order } });
  };

  const assignRider = async (orderId, riderId) => {
    if (!riderId) return;
    try {
      await assignRiderApi({ orderId, riderId, orderStatus: "assigned" }).unwrap();
      toast.success("Rider assigned successfully!");
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to assign rider");
    }
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">
        Pending Orders
      </h1>

      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {["#", "Customer", "Customer ID", "Territory", "Order Date", "Payment Mode", "Phone", "Actions"].map(th => (
                <th key={th} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{th}</th>
              ))}
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(order.orderDate).toLocaleDateString("en-GB")}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.payMode}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customer.mobile}</td>
                    <td className="px-6 py-4 whitespace-nowrap flex flex-wrap gap-2">

                      {order.orderStatus === "pending" ? (
                        <button
                          onClick={() => {
                            setSelectedProductOrder(order);
                            setPendingApprovalOrderId(order._id);
                          }}
                          className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs md:text-sm transition-colors"
                        >
                          <FaCheck /> Approve
                        </button>
                      ) : order.orderStatus === "confirmed" ? (
                        !order.assignedRiderId ? (
                          <select
                            onChange={(e) => assignRider(order._id, e.target.value)}
                            className="px-3 py-1 text-sm rounded-md border border-gray-300"
                          >
                            <option value="">Assign Rider</option>
                            {riders.map((r) => (
                              <option key={r._id} value={r._id}>
                                {r.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <button
                            onClick={() => handleDeliver(order)}
                            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs md:text-sm transition-colors"
                          >
                            Deliver & Download Invoice
                          </button>
                        )
                      ) : order.orderStatus === "assigned" ? (
                        <button
                          onClick={() => handleDeliver(order)}
                          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs md:text-sm transition-colors"
                        >
                          Deliver & Download Invoice
                        </button>
                      ) : null}

                      <button
                        onClick={() => setSelectedProductOrder(order)}
                        className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-xs md:text-sm transition-colors"
                      >
                        <FaClipboardList /> Details
                      </button>
                      <button
                        onClick={() => alert("Customer history placeholder")}
                        className="flex items-center gap-1 bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-md text-xs md:text-sm transition-colors"
                      >
                        <FaHistory /> History
                      </button>
                    </td>
                  </motion.tr>

                  {/* Collapsible Products */}
                  {isExpanded && (
                    <tr className="bg-gray-50">
                      <td colSpan={8} className="px-6 py-4">
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                            <thead className="bg-gray-200">
                              <tr>
                                {["Product ID", "Price", "Quantity", "Discount", "Batch", "Expiry"].map(th => (
                                  <th key={th} className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{th}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {order.products.map(p => (
                                <tr key={p.productId}>
                                  <td className="px-4 py-2 text-sm text-gray-700">{p.productId}</td>
                                  <td className="px-4 py-2 text-sm text-gray-700">{p.price}</td>
                                  <td className="px-4 py-2 text-sm text-gray-700">{p.quantity}</td>
                                  <td className="px-4 py-2 text-sm text-gray-700">{p.discount}</td>
                                  <td className="px-4 py-2 text-sm text-gray-700">{p.batchNo || "-"}</td>
                                  <td className="px-4 py-2 text-sm text-gray-700">{p.expired ? new Date(p.expired).toLocaleDateString("en-GB") : "-"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
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
            onClose={() => {
              setSelectedProductOrder(null);
              setPendingApprovalOrderId(null);
            }}
            onDeliver={handleDeliver}
            showApproveButton={pendingApprovalOrderId === selectedProductOrder._id}
            onApprove={() => handleApprove(selectedProductOrder._id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PendingOrdersCard;