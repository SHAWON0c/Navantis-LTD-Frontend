// // // import React, { useState, useEffect } from "react";

// // // const DepotReceiveRequestModal = ({
// // //   isOpen,
// // //   onClose,
// // //   addedBy,
// // //   productData, // pass product info from parent
// // //   onSubmit, // function to handle submission
// // // }) => {
// // //   const [requestQuantity, setRequestQuantity] = useState("");

// // //   // Lock background scroll
// // //   useEffect(() => {
// // //     document.body.style.overflow = isOpen ? "hidden" : "auto";
// // //     return () => (document.body.style.overflow = "auto");
// // //   }, [isOpen]);

// // //   const handleSubmit = () => {
// // //     if (!requestQuantity || Number(requestQuantity) <= 0) {
// // //       alert("Please enter a valid quantity");
// // //       return;
// // //     }

// // //     // Call parent submit function
// // //     onSubmit({
// // //       productId: productData._id,
// // //       quantity: Number(requestQuantity),
// // //       requestedBy: addedBy?.name,
// // //     });

// // //     setRequestQuantity("");
// // //     onClose();
// // //   };

// // //   if (!isOpen) return null;

// // //   return (
// // //     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
// // //       <div className="bg-white rounded-xl shadow-2xl w-96 p-6 relative">
// // //         {/* Close Button */}
// // //         <button
// // //           onClick={onClose}
// // //           className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
// // //         >
// // //           ✕
// // //         </button>

// // //         {/* Product Name */}
// // //         <h2 className="text-2xl font-bold text-[#0F213D] mb-1 text-center">
// // //           {productData.productName || "Product Name"}
// // //         </h2>
// // //         <p className="text-center text-gray-600 font-medium mb-6">
// // //           {productData.packSize || "-"}
// // //         </p>

// // //         {/* Info Grid */}
// // //         <div className="grid grid-cols-2 gap-4 mb-6">
// // //           <InfoCard label="Available in Warehouse" value={productData.availableWarehouse || 0} />
// // //           <InfoCard label="Available in Depot" value={productData.availableDepot || 0} />
// // //           <InfoCard label="Order Quantity" value={productData.orderQuantity || 0} />
// // //           <InfoCard label="Last Month Sales" value={productData.lastMonthSales || 0} />
// // //         </div>

// // //         {/* Request Quantity */}
// // //         <div className="mb-4">
// // //           <label className="block text-gray-700 mb-1 font-medium">
// // //             Request Quantity
// // //           </label>
// // //           <input
// // //             type="number"
// // //             min="1"
// // //             value={requestQuantity}
// // //             onChange={(e) => setRequestQuantity(e.target.value)}
// // //             className="w-full border rounded px-3 py-2"
// // //           />
// // //         </div>

// // //         {/* Added By */}
// // //         <div className="grid grid-cols-2 gap-4 mb-6">
// // //           <input
// // //             readOnly
// // //             value={addedBy?.name || "Depot Manager"}
// // //             className="border rounded px-3 py-2 bg-gray-100"
// // //           />
// // //           <input
// // //             readOnly
// // //             value={addedBy?.email || "depot@navantis.com"}
// // //             className="border rounded px-3 py-2 bg-gray-100"
// // //           />
// // //         </div>

// // //         {/* Submit */}
// // //         <button
// // //           onClick={handleSubmit}
// // //           className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
// // //         >
// // //           Submit Request
// // //         </button>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // const InfoCard = ({ label, value }) => (
// // //   <div className="border p-4 rounded-lg shadow">
// // //     <p className="text-gray-400 text-xs uppercase">{label}</p>
// // //     <p className="font-semibold text-lg">{value}</p>
// // //   </div>
// // // );

// // // export default DepotReceiveRequestModal;



// // import React, { useState, useEffect } from "react";
// // import { useUpdateSendProductRequestStatusMutation } from "../../redux/features/depot/depotStockApi";

// // const DepotReceiveRequestModal = ({
// //   isOpen,
// //   onClose,
// //   addedBy,
// //   productData, // product info from parent
// //   refetch, // refetch list after submission
// // }) => {
// //   const [requestQuantity, setRequestQuantity] = useState("");
// //   const [updateStatus, { isLoading }] = useUpdateSendProductRequestStatusMutation();

// //   // Lock background scroll
// //   useEffect(() => {
// //     document.body.style.overflow = isOpen ? "hidden" : "auto";
// //     return () => (document.body.style.overflow = "auto");
// //   }, [isOpen]);

// //   const handleSubmit = async () => {
// //     if (!requestQuantity || Number(requestQuantity) <= 0) {
// //       alert("Please enter a valid quantity");
// //       return;
// //     }

// //     try {
// //       await updateStatus({
// //         id: productData._id, // send _id in URL
// //         status: "requested", // you can change to "pending" or "denied" if needed
// //         quantity: Number(requestQuantity),
// //       }).unwrap();

// //       alert(`Request updated successfully for ${productData.productName}`);
// //       setRequestQuantity("");
// //       onClose();
// //       refetch(); // refresh parent list
// //     } catch (err) {
// //       console.error(err);
// //       const errorMessage = err?.data?.message || "Failed to update request";
// //       alert(errorMessage);
// //     }
// //   };

// //   if (!isOpen) return null;

// //   return (
// //     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
// //       <div className="bg-white rounded-xl shadow-2xl w-96 p-6 relative">
// //         {/* Close Button */}
// //         <button
// //           onClick={onClose}
// //           className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
// //         >
// //           ✕
// //         </button>

// //         {/* Product Name */}
// //         <h2 className="text-2xl font-bold text-[#0F213D] mb-1 text-center">
// //           {productData.productName || "Product Name"}
// //         </h2>
// //         <p className="text-center text-gray-600 font-medium mb-6">
// //           {productData.packSize || "-"}
// //         </p>

// //         {/* Info Grid */}
// //         <div className="grid grid-cols-2 gap-4 mb-6">
// //           <InfoCard label="Available in Warehouse" value={productData.availableWarehouse || 0} />
// //           <InfoCard label="Available in Depot" value={productData.availableDepot || 0} />
// //           <InfoCard label="Order Quantity" value={productData.orderQuantity || 0} />
// //           <InfoCard label="Last Month Sales" value={productData.lastMonthSales || 0} />
// //         </div>

// //         {/* Request Quantity */}
// //         <div className="mb-4">
// //           <label className="block text-gray-700 mb-1 font-medium">
// //             Request Quantity
// //           </label>
// //           <input
// //             type="number"
// //             min="1"
// //             value={requestQuantity}
// //             onChange={(e) => setRequestQuantity(e.target.value)}
// //             className="w-full border rounded px-3 py-2"
// //           />
// //         </div>

// //         {/* Added By */}
// //         <div className="grid grid-cols-2 gap-4 mb-6">
// //           <input
// //             readOnly
// //             value={addedBy?.name || "Depot Manager"}
// //             className="border rounded px-3 py-2 bg-gray-100"
// //           />
// //           <input
// //             readOnly
// //             value={addedBy?.email || "depot@navantis.com"}
// //             className="border rounded px-3 py-2 bg-gray-100"
// //           />
// //         </div>

// //         {/* Submit */}
// //         <button
// //           onClick={handleSubmit}
// //           disabled={isLoading}
// //           className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
// //         >
// //           {isLoading ? "Submitting..." : "Submit Request"}
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // const InfoCard = ({ label, value }) => (
// //   <div className="border p-4 rounded-lg shadow">
// //     <p className="text-gray-400 text-xs uppercase">{label}</p>
// //     <p className="font-semibold text-lg">{value}</p>
// //   </div>
// // );

// // export default DepotReceiveRequestModal;



// import React, { useState, useEffect } from "react";
// import { useUpdateSendProductRequestStatusMutation } from "../../redux/features/depot/depotStockApi";

// const DepotReceiveRequestModal = ({ isOpen, onClose, addedBy, productData, refetch }) => {
//   const [requestQuantity, setRequestQuantity] = useState("");
//   const [updateStatus, { isLoading }] = useUpdateSendProductRequestStatusMutation();

//   useEffect(() => {
//     document.body.style.overflow = isOpen ? "hidden" : "auto";
//     return () => (document.body.style.overflow = "auto");
//   }, [isOpen]);

//   const handleSubmit = async () => {
//     if (!requestQuantity || Number(requestQuantity) <= 0) {
//       alert("Please enter a valid quantity");
//       return;
//     }

//     try {
//       await updateStatus({
//         id: productData._id,        // URL param
//         status: "requested",        // fixed
//         quantity: Number(requestQuantity), // input value
//       }).unwrap();

//       alert(`Request submitted successfully for ${productData.productName}`);
//       setRequestQuantity("");
//       onClose();
//       refetch();
//     } catch (err) {
//       console.error(err);
//       const errorMessage = err?.data?.message || "Failed to submit request";
//       alert(errorMessage);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//       <div className="bg-white rounded-xl shadow-2xl w-96 p-6 relative">
//         <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
//           ✕
//         </button>

//         <h2 className="text-2xl font-bold text-center mb-1">{productData.productName}</h2>
//         <p className="text-center text-gray-600 mb-6">{productData.packSize}</p>

//         <div className="grid grid-cols-2 gap-4 mb-6">
//           <InfoCard label="Available in Warehouse" value={productData.availableWarehouse || 0} />
//           <InfoCard label="Available in Depot" value={productData.availableDepot || 0} />
//           <InfoCard label="Order Quantity" value={productData.orderQuantity || 0} />
//           <InfoCard label="Last Month Sales" value={productData.lastMonthSales || 0} />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700 mb-1 font-medium">Request Quantity</label>
//           <input
//             type="number"
//             min="1"
//             value={requestQuantity}
//             onChange={(e) => setRequestQuantity(e.target.value)}
//             className="w-full border rounded px-3 py-2"
//           />
//         </div>

//         <div className="grid grid-cols-2 gap-4 mb-6">
//           <input readOnly value={addedBy?.name || "Depot Manager"} className="border rounded px-3 py-2 bg-gray-100" />
//           <input readOnly value={addedBy?.email || "depot@navantis.com"} className="border rounded px-3 py-2 bg-gray-100" />
//         </div>

//         <button
//           onClick={handleSubmit}
//           disabled={isLoading}
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
//         >
//           {isLoading ? "Submitting..." : "Submit Request"}
//         </button>
//       </div>
//     </div>
//   );
// };

// const InfoCard = ({ label, value }) => (
//   <div className="border p-4 rounded-lg shadow">
//     <p className="text-gray-400 text-xs uppercase">{label}</p>
//     <p className="font-semibold text-lg">{value}</p>
//   </div>
// );

// export default DepotReceiveRequestModal;



// import React, { useState, useEffect } from "react";
// import { useUpdateSendProductRequestStatusMutation } from "../../redux/features/depot/depotStockApi";

// const DepotReceiveRequestModal = ({ isOpen, onClose, addedBy, productData, refetch }) => {
//   const [requestQuantity, setRequestQuantity] = useState("");
//   const [updateStatus, { isLoading }] = useUpdateSendProductRequestStatusMutation();

//   // ✅ Call hooks at the top
//   useEffect(() => {
//     document.body.style.overflow = isOpen ? "hidden" : "auto";
//     return () => {
//       document.body.style.overflow = "auto";
//     };
//   }, [isOpen]);

//   const handleSubmit = async () => {
//     if (!requestQuantity || Number(requestQuantity) <= 0) {
//       alert("Please enter a valid quantity");
//       return;
//     }

//     try {
//       await updateStatus({
//         id: productData._id,
//         status: "requested",
//         quantity: Number(requestQuantity),
//       }).unwrap();

//       alert(`Request submitted successfully for ${productData.productName}`);
//       setRequestQuantity("");
//       onClose();
//       if (refetch) refetch();
//     } catch (err) {
//       console.error(err);
//       alert(err?.data?.message || "Failed to submit request");
//     }
//   };

//   // ✅ Early return after hooks
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//       <div className="bg-white rounded-xl shadow-2xl w-96 p-6 relative">
//         <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">✕</button>
//         <h2 className="text-2xl font-bold text-center mb-1">{productData.productName}</h2>
//         <p className="text-center text-gray-600 mb-6">{productData.packSize}</p>

//         <div className="grid grid-cols-2 gap-4 mb-6">
//           <InfoCard label="Available in Warehouse" value={productData.availableWarehouse || 0} />
//           <InfoCard label="Available in Depot" value={productData.availableDepot || 0} />
//           <InfoCard label="Order Quantity" value={productData.orderQuantity || 0} />
//           <InfoCard label="Last Month Sales" value={productData.lastMonthSales || 0} />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700 mb-1 font-medium">Request Quantity</label>
//           <input
//             type="number"
//             min="1"
//             value={requestQuantity}
//             onChange={(e) => setRequestQuantity(e.target.value)}
//             className="w-full border rounded px-3 py-2"
//           />
//         </div>

//         <div className="grid grid-cols-2 gap-4 mb-6">
//           <input readOnly value={addedBy?.name || "Depot Manager"} className="border rounded px-3 py-2 bg-gray-100" />
//           <input readOnly value={addedBy?.email || "depot@navantis.com"} className="border rounded px-3 py-2 bg-gray-100" />
//         </div>

//         <button
//           onClick={handleSubmit}
//           disabled={isLoading}
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
//         >
//           {isLoading ? "Submitting..." : "Submit Request"}
//         </button>
//       </div>
//     </div>
//   );
// };

// const InfoCard = ({ label, value }) => (
//   <div className="border p-4 rounded-lg shadow">
//     <p className="text-gray-400 text-xs uppercase">{label}</p>
//     <p className="font-semibold text-lg">{value}</p>
//   </div>
// );

// export default DepotReceiveRequestModal;


import React, { useState, useEffect } from "react";
import { useUpdateSendProductRequestStatusMutation } from "../../redux/features/depot/depotStockApi";

const DepotReceiveRequestModal = ({ isOpen, onClose, addedBy, productData, refetch }) => {
  const [requestQuantity, setRequestQuantity] = useState(productData?.quantity || 0);
  const [updateStatus, { isLoading }] = useUpdateSendProductRequestStatusMutation();

  // Lock background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleSubmit = async () => {
    const quantityNum = Number(requestQuantity);

    if (!quantityNum || quantityNum <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    try {
      // Send only `_id` in URL and `status` + `quantity` in body
      await updateStatus({
        id: productData._id, // depot request _id
        status: "approved",   // change to "requested" or "accepted" if needed
        quantity: quantityNum
      }).unwrap();

      alert(`Request updated successfully for ${productData?.warehouseProductId?.productName}`);
      setRequestQuantity("");
      onClose();
      refetch?.(); // refresh the parent list if needed
    } catch (err) {
      console.error(err);
      alert(err?.data?.message || "Failed to update request");
    }
  };

  if (!isOpen) return null;

  const productName = productData?.warehouseProductId?.productName || "Product Name";
  const batch = productData?.warehouseProductId?.batch || "-";
  const availableWarehouse = productData?.warehouseProductId?.totalQuantity || 0;
  const availableDepot = productData?.depotQuantity || 0;
  const orderQuantity = productData?.quantity || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-96 p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Product Info */}
        <h2 className="text-2xl font-bold text-center mb-1">{productName}</h2>
        <p className="text-center text-gray-600 mb-6">{batch}</p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <InfoCard label="Available in Warehouse" value={availableWarehouse} />
          <InfoCard label="Available in Depot" value={availableDepot} />
          <InfoCard label="Order Quantity" value={orderQuantity} />
          <InfoCard label="Last Month Sales" value={productData?.lastMonthSales || 0} />
        </div>

        {/* Request Quantity Input */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1 font-medium">Request Quantity</label>
          <input
            type="number"
            min="1"
            value={requestQuantity}
            onChange={(e) => setRequestQuantity(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Added By */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <input
            readOnly
            value={addedBy?.name || "Depot Manager"}
            className="border rounded px-3 py-2 bg-gray-100"
          />
          <input
            readOnly
            value={addedBy?.email || "depot@navantis.com"}
            className="border rounded px-3 py-2 bg-gray-100"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          {isLoading ? "Submitting..." : "Submit Request"}
        </button>
      </div>
    </div>
  );
};

// InfoCard component
const InfoCard = ({ label, value }) => (
  <div className="border p-4 rounded-lg shadow">
    <p className="text-gray-400 text-xs uppercase">{label}</p>
    <p className="font-semibold text-lg">{value}</p>
  </div>
);

export default DepotReceiveRequestModal;

