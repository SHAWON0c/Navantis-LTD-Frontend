// src/component/modals/OrderProductsDetailsModal.jsx
// import React, { useState, useEffect } from "react";
// import { Dialog, Transition } from "@headlessui/react";
// import { Fragment } from "react";
// import { toast } from "react-toastify";
// import { useApproveOrderMutation } from "../../redux/features/orders/orderApi";

// const OrderProductsDetailsModal = ({ isOpen, onClose, order, showApproveButton, onApprove }) => {
//   const [approveOrder] = useApproveOrderMutation();

//   // State for quantities per batch (only for multiple batches)
//   const [batchQuantities, setBatchQuantities] = useState({});
//   const [isApproved, setIsApproved] = useState(false); // Track successful approval

//   useEffect(() => {
//     if (!order) return;
//     // Initialize batch quantities
//     const quantities = {};
//     order.products.forEach((product) => {
//       if (product.batchCount > 1) {
//         product.batches.forEach((batch) => {
//           quantities[batch.depotProductId] = batch.quantity || 0;
//         });
//       }
//     });
//     setBatchQuantities(quantities);
//   }, [order]);

//   const handleQuantityChange = (depotProductId, value) => {
//     setBatchQuantities((prev) => ({
//       ...prev,
//       [depotProductId]: Number(value),
//     }));
//   };

//   // const handleApproveClick = async () => {
//   //   if (!order) return;

//   //   if (isApproved) {
//   //     toast.info("Order already approved!");
//   //     return; // Prevent double API call
//   //   }

//   //   const payload = { products: [] };

//   //   order.products.forEach((product) => {
//   //     if (product.batchCount === 1) {
//   //       payload.products.push({ productId: product.productId });
//   //     } else {
//   //       const selectedBatches = product.batches
//   //         .map((b) => ({
//   //           depotProductId: b.depotProductId,
//   //           quantity: batchQuantities[b.depotProductId] || 0,
//   //         }))
//   //         .filter((b) => b.quantity > 0);

//   //       payload.products.push({
//   //         productId: product.productId,
//   //         selectedBatches,
//   //       });
//   //     }
//   //   });

//   //   try {
//   //     await approveOrder({ orderId: order._id, payload }).unwrap();
//   //     toast.success("Order approved successfully!");
//   //     setIsApproved(true);      // Mark as approved
//   //     onApprove && onApprove(); // Callback to parent
//   //     onClose();                // Close modal
//   //   } catch (err) {
//   //     console.error(err);
//   //     toast.error(`❌ Failed to approve order: ${err?.data?.message || err.message}`);
//   //   }
//   // };


// const handleApproveClick = async () => {
//   if (!order) return;

//   if (isApproved) {
//     toast.info("Order already approved!");
//     return;
//   }

//   // Build payload
//   const payload = {
//     products: order.products.map((product) => {
//       if (product.batchCount === 1) {
//         // Single batch → just productId
//         return { productId: product.productId };
//       } else {
//         // Multiple batches → include only batches with quantity > 0
//         const selectedBatches = product.batches
//           .map((batch) => ({
//             depotProductId: batch.depotProductId,
//             quantity: batchQuantities[batch.depotProductId] || 0,
//           }))
//           .filter((b) => b.quantity > 0);

//         if (selectedBatches.length === 0) {
//           toast.error(`Please select at least one batch for ${product.productName}`);
//           throw new Error("Batch selection required");
//         }

//         return {
//           productId: product.productId,
//           selectedBatches,
//         };
//       }
//     }),
//   };

//   console.log("Payload to send:", JSON.stringify(payload, null, 2));

//   try {
//     // Pass payload as-is to mutation
//     await approveOrder({ orderId: order._id, payload }).unwrap();

//     toast.success("Order approved successfully!");
//     setIsApproved(true);
//     onApprove && onApprove();
//     onClose();
//   } catch (err) {
//     console.error(err);
//     toast.error(`❌ Failed to approve order: ${err?.data?.message || err.message}`);
//   }
// };
  
//   if (!order) return null;

//   return (
//     <Transition.Root show={isOpen} as={Fragment}>
//       <Dialog as="div" className="relative z-10" onClose={onClose}>
//         <Transition.Child
//           as={Fragment}
//           enter="ease-out duration-300"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="ease-in duration-200"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
//         </Transition.Child>

//         <div className="fixed inset-0 z-10 overflow-y-auto">
//           <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
//             <Transition.Child
//               as={Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
//               enterTo="opacity-100 translate-y-0 sm:scale-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100 translate-y-0 sm:scale-100"
//               leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
//             >
//               <Dialog.Panel className="relative bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:max-w-4xl w-full p-6">
//                 <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
//                   Order #{order.invoiceNo || order._id} Products
//                 </Dialog.Title>

//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-100">
//                       <tr>
//                         {["Product Name", "Pack", "Trade Price", "Quantity", "Batch", "Expiry"].map(
//                           (th) => (
//                             <th key={th} className="px-4 py-2 text-left text-sm font-medium text-gray-700">
//                               {th}
//                             </th>
//                           )
//                         )}
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {order.products.map((product) => (
//                         <React.Fragment key={product.productId}>
//                           {product.batches.map((batch) => (
//                             <tr key={batch.depotProductId}>
//                               <td className="px-4 py-2 text-sm text-gray-700">{product.productName}</td>
//                               <td className="px-4 py-2 text-sm text-gray-700">{product.packSize}</td>
//                               <td className="px-4 py-2 text-sm text-gray-700">{product.tradePrice}</td>
//                               <td className="px-4 py-2 text-sm text-gray-700">
//                                 {product.batchCount === 1 ? (
//                                   product.quantity
//                                 ) : (
//                                   <input
//                                     type="number"
//                                     min={0}
//                                     max={batch.totalQuantity}
//                                     value={batchQuantities[batch.depotProductId] || 0}
//                                     onChange={(e) =>
//                                       handleQuantityChange(batch.depotProductId, e.target.value)
//                                     }
//                                     className="w-20 border px-2 py-1 rounded"
//                                   />
//                                 )}
//                               </td>
//                               <td className="px-4 py-2 text-sm text-gray-700">{batch.batch}</td>
//                               <td className="px-4 py-2 text-sm text-gray-700">
//                                 {new Date(batch.expireDate).toLocaleDateString("en-GB")}
//                               </td>
//                             </tr>
//                           ))}
//                         </React.Fragment>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>

//                 {showApproveButton && (
//                   <div className="mt-6 flex justify-end">
//                     <button
//                       onClick={handleApproveClick}
//                       className={`px-4 py-2 rounded-md text-white ${
//                         isApproved ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
//                       }`}
//                       disabled={isApproved} // Prevent button click after approval
//                     >
//                       {isApproved ? "Approved" : "Approve Order"}
//                     </button>
//                   </div>
//                 )}
//               </Dialog.Panel>
//             </Transition.Child>
//           </div>
//         </div>
//       </Dialog>
//     </Transition.Root>
//   );
// };

// export default OrderProductsDetailsModal;


// src/components/OrderProductsDetailsModal.jsx
// import React, { useState, useEffect, Fragment } from "react";
// import { Dialog, Transition } from "@headlessui/react";
// import { toast } from "react-toastify";
// import { useApproveOrderMutation } from "../../redux/features/orders/orderApi";

// const OrderProductsDetailsModal = ({ isOpen, onClose, order, showApproveButton, onApprove }) => {
//   const [approveOrder] = useApproveOrderMutation();
//   const [batchQuantities, setBatchQuantities] = useState({});
//   const [isApproved, setIsApproved] = useState(false);

//   // Initialize batch quantities when order changes
//   useEffect(() => {
//     if (!order) return;
//     const quantities = {};
//     order.products.forEach((product) => {
//       if (product.batchCount > 1) {
//         product.batches.forEach((batch) => {
//           quantities[batch.depotProductId] = undefined; // empty by default
//         });
//       }
//     });
//     setBatchQuantities(quantities);
//   }, [order]);

//   const handleQuantityChange = (depotProductId, value) => {
//     setBatchQuantities((prev) => ({
//       ...prev,
//       [depotProductId]: value,
//     }));
//   };

//   const handleApproveClick = async () => {
//     if (!order) return;
//     if (isApproved) {
//       toast.info("Order already approved!");
//       return;
//     }

//     const payload = { products: [] };

//     for (const product of order.products) {
//       if (product.batchCount === 1) {
//         // Single batch product → just productId
//         payload.products.push({ productId: product.productId });
//       } else {
//         // Multi-batch → only include batches with typed quantity
//         const selectedBatches = product.batches
//           .map((b) => ({
//             depotProductId: b.depotProductId,
//             quantity: batchQuantities[b.depotProductId],
//           }))
//           .filter((b) => b.quantity > 0);

//         if (selectedBatches.length === 0) {
//           toast.error(`Please enter quantity for at least one batch of ${product.productName}`);
//           return;
//         }

//         payload.products.push({
//           productId: product.productId,
//           selectedBatches,
//         });
//       }
//     }

//     try {
//       await approveOrder({ orderId: order._id, payload }).unwrap();
//       toast.success("Order approved successfully!");
//       setIsApproved(true);
//       onApprove && onApprove();
//       onClose();
//     } catch (err) {
//       console.error(err);
//       toast.error(`❌ Failed to approve order: ${err?.data?.message || err.message}`);
//     }
//   };

//   if (!order) return null;

//   return (
//     <Transition.Root show={isOpen} as={Fragment}>
//       <Dialog as="div" className="relative z-10" onClose={onClose}>
//         <Transition.Child
//           as={Fragment}
//           enter="ease-out duration-300"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="ease-in duration-200"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
//         </Transition.Child>

//         <div className="fixed inset-0 z-10 overflow-y-auto">
//           <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
//             <Transition.Child
//               as={Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
//               enterTo="opacity-100 translate-y-0 sm:scale-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100 translate-y-0 sm:scale-100"
//               leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
//             >
//               <Dialog.Panel className="relative bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:max-w-4xl w-full p-6">
//                 <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
//                   Order #{order.invoiceNo || order._id} Products
//                 </Dialog.Title>

//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-100">
//                       <tr>
//                         {["Product Name", "Pack", "Trade Price", "Quantity", "Batch", "Expiry"].map((th) => (
//                           <th key={th} className="px-4 py-2 text-left text-sm font-medium text-gray-700">
//                             {th}
//                           </th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {order.products.map((product) => (
//                         <React.Fragment key={product.productId}>
//                           {product.batches.map((batch) => (
//                             <tr key={batch.depotProductId}>
//                               <td className="px-4 py-2 text-sm text-gray-700">{product.productName}</td>
//                               <td className="px-4 py-2 text-sm text-gray-700">{product.packSize}</td>
//                               <td className="px-4 py-2 text-sm text-gray-700">{product.tradePrice}</td>
//                               <td className="px-4 py-2 text-sm text-gray-700">
//                                 {product.batchCount === 1 ? (
//                                   product.quantity
//                                 ) : (
//                                   <input
//                                     type="text"
//                                     value={batchQuantities[batch.depotProductId] ?? ""}
//                                     onChange={(e) => {
//                                       const val = e.target.value.trim();
//                                       if (/^\d+$/.test(val)) {
//                                         handleQuantityChange(batch.depotProductId, Number(val));
//                                       } else if (val === "") {
//                                         handleQuantityChange(batch.depotProductId, undefined);
//                                       }
//                                     }}
//                                     placeholder="Qty"
//                                     className="w-20 border px-2 py-1 rounded"
//                                   />
//                                 )}
//                               </td>
//                               <td className="px-4 py-2 text-sm text-gray-700">{batch.batch}</td>
//                               <td className="px-4 py-2 text-sm text-gray-700">
//                                 {new Date(batch.expireDate).toLocaleDateString("en-GB")}
//                               </td>
//                             </tr>
//                           ))}
//                         </React.Fragment>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>

//                 {showApproveButton && (
//                   <div className="mt-6 flex justify-end">
//                     <button
//                       onClick={handleApproveClick}
//                       disabled={isApproved}
//                       className={`px-4 py-2 rounded-md text-white ${
//                         isApproved ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
//                       }`}
//                     >
//                       {isApproved ? "Approved" : "Approve Order"}
//                     </button>
//                   </div>
//                 )}
//               </Dialog.Panel>
//             </Transition.Child>
//           </div>
//         </div>
//       </Dialog>
//     </Transition.Root>
//   );
// };

// export default OrderProductsDetailsModal;




// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FaTimes } from "react-icons/fa";
// import { toast } from "react-toastify";

// const OrderProductsDetailsModal = ({
//   isOpen,
//   order,
//   onClose,
//   onApprove,
//   showApproveButton = true,
//   isLoading = false,
// }) => {
//   const [productsState, setProductsState] = useState([]);

//   // Initialize state with selectedQuantity = 0 for each batch
//   useEffect(() => {
//     if (order) {
//       const initProducts = order.products.map((p) => ({
//         ...p,
//         batches: p.batches.map((b) => ({ ...b, selectedQuantity: 0 })),
//       }));
//       setProductsState(initProducts);
//     }
//   }, [order]);

//   const handleBatchChange = (productId, depotProductId, value) => {
//     setProductsState((prev) =>
//       prev.map((p) =>
//         p.productId === productId
//           ? {
//               ...p,
//               batches: p.batches.map((b) =>
//                 b.depotProductId === depotProductId
//                   ? { ...b, selectedQuantity: Number(value) }
//                   : b
//               ),
//             }
//           : p
//       )
//     );
//   };

//   const handleApproveClick = () => {
//     // Validate multi-batch selection
//     for (const p of productsState) {
//       if (p.batchCount > 1) {
//         const totalSelected = p.batches.reduce(
//           (acc, b) => acc + (b.selectedQuantity || 0),
//           0
//         );
//         if (totalSelected !== p.quantity) {
//           toast.error(
//             `Please select quantities for all batches of ${p.productName} to match total order quantity (${p.quantity})`
//           );
//           return;
//         }
//       }
//     }

//     // Generate payload
//     const productsPayload = productsState.map((p) => {
//       if (p.batchCount === 1) return { productId: p.productId };
//       const selectedBatches = p.batches
//         .filter((b) => b.selectedQuantity > 0)
//         .map((b) => ({ depotProductId: b.depotProductId, quantity: b.selectedQuantity }));
//       return { productId: p.productId, selectedBatches };
//     });

//     // Call parent handler
//     onApprove(productsPayload);
//   };

//   if (!isOpen) return null;

//   return (
//     <AnimatePresence>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//       >
//         <motion.div
//           initial={{ scale: 0.8, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           exit={{ scale: 0.8, opacity: 0 }}
//           className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative"
//         >
//           <button
//             className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
//             onClick={onClose}
//           >
//             <FaTimes />
//           </button>

//           <h2 className="text-xl font-bold mb-4">Order Products</h2>

//           <div className="space-y-4 max-h-[60vh] overflow-y-auto">
//             {productsState.map((p) => (
//               <div key={p.productId} className="border rounded-lg p-3">
//                 <h3 className="font-semibold">{p.productName}</h3>
//                 <p>Pack: {p.packSize} | Price: {p.tradePrice} | Qty: {p.quantity}</p>

//                 {p.batchCount > 1 ? (
//                   <div className="mt-2 space-y-1">
//                     {p.batches.map((b) => (
//                       <div key={b.depotProductId} className="flex items-center gap-2">
//                         <span className="w-32">
//                           {b.batch} ({new Date(b.expireDate).toLocaleDateString()})
//                         </span>
//                         <input
//                           type="number"
//                           min={0}
//                           max={b.totalQuantity}
//                           value={b.selectedQuantity}
//                           onChange={(e) =>
//                             handleBatchChange(p.productId, b.depotProductId, e.target.value)
//                           }
//                           className="border px-2 py-1 w-20 rounded"
//                         />
//                         <span>/ {b.totalQuantity}</span>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="mt-2">
//                     Batch: {p.batches[0].batch} | Exp:{" "}
//                     {new Date(p.batches[0].expireDate).toLocaleDateString()}
//                   </p>
//                 )}
//               </div>
//             ))}
//           </div>

//           {showApproveButton && (
//             <button
//               onClick={handleApproveClick}
//               disabled={isLoading}
//               className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md w-full"
//             >
//               {isLoading ? "Approving..." : "Approve Order"}
//             </button>
//           )}
//         </motion.div>
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// export default OrderProductsDetailsModal;

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const OrderProductsDetailsModal = ({
  isOpen,
  order,
  onClose,
  onApprove,
  showApproveButton = true,
  isLoading = false,
}) => {
  const [productsState, setProductsState] = useState([]);

  useEffect(() => {
    if (order) {
      const initProducts = order.products.map((p) => ({
        ...p,
        batches: p.batches.map((b) => ({ ...b, selectedQuantity: 0 })),
      }));
      setProductsState(initProducts);
    }
  }, [order]);

  const handleBatchChange = (productId, depotProductId, value) => {
    setProductsState((prev) =>
      prev.map((p) =>
        p.productId === productId
          ? {
              ...p,
              batches: p.batches.map((b) =>
                b.depotProductId === depotProductId
                  ? { ...b, selectedQuantity: Number(value) }
                  : b
              ),
            }
          : p
      )
    );
  };

  const handleApproveClick = () => {
    for (const p of productsState) {
      if (p.batchCount > 1) {
        const totalSelected = p.batches.reduce(
          (acc, b) => acc + (b.selectedQuantity || 0),
          0
        );
        if (totalSelected !== p.quantity) {
          toast.error(
            `Please select quantities for all batches of ${p.productName} to match total order quantity (${p.quantity})`
          );
          return;
        }
      }
    }

    const productsPayload = productsState.map((p) => {
      if (p.batchCount === 1) return { productId: p.productId };
      const selectedBatches = p.batches
        .filter((b) => b.selectedQuantity > 0)
        .map((b) => ({ depotProductId: b.depotProductId, quantity: b.selectedQuantity }));
      return { productId: p.productId, selectedBatches };
    });

    onApprove(productsPayload);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6 relative"
        >
          <button
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            onClick={onClose}
          >
            <FaTimes />
          </button>

          <h2 className="text-xl font-bold mb-4">Order Products</h2>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {productsState.map((p) => (
              <div key={p.productId} className="border rounded-lg p-3">
                <h3 className="font-semibold">{p.productName}</h3>
                <p className="text-sm text-gray-600">
                  Pack: {p.packSize} | Price: {p.tradePrice} | Qty: {p.quantity}
                </p>

                {p.batchCount > 1 ? (
                  <div className="mt-2 space-y-1">
                    {p.batches.map((b) => (
                      <div key={b.depotProductId} className="flex items-center gap-2">
                        <span className="w-32 text-sm">
                          {b.batch} ({new Date(b.expireDate).toLocaleDateString()})
                        </span>
                        <input
                          type="number"
                          min={0}
                          max={b.totalQuantity}
                          value={b.selectedQuantity}
                          onChange={(e) =>
                            handleBatchChange(p.productId, b.depotProductId, e.target.value)
                          }
                          className="border px-2 py-1 w-20 rounded text-sm"
                          style={{
                            MozAppearance: "textfield",
                          }}
                        />
                        <span className="text-sm">/ {b.totalQuantity}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm">
                    Batch: {p.batches[0].batch} | Exp:{" "}
                    {new Date(p.batches[0].expireDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>

          {showApproveButton && (
            <button
              onClick={handleApproveClick}
              disabled={isLoading}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md w-full text-sm"
            >
              {isLoading ? "Approving..." : "Approve Order"}
            </button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OrderProductsDetailsModal;