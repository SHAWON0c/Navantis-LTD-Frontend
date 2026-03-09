
// // import React, { useState } from "react";
// // import Modal from "react-modal";
// // import {
// //   useGetGroupedDepotRequestsQuery,
// //   useSendProductRequestTowarehouseMutation,
// // } from "../../../../redux/features/depot/depotStockApi";

// // Modal.setAppElement("#root");

// // const DepotRequestsPage = () => {
// //   const { data, isLoading, isError } = useGetGroupedDepotRequestsQuery("pending");
// //   const [sendProductRequestTowarehouse] = useSendProductRequestTowarehouseMutation();

// //   const [selectedProduct, setSelectedProduct] = useState(null);
// //   const [batchInputs, setBatchInputs] = useState({});

// //   const openModal = (product) => {
// //     setSelectedProduct(product);
// //     const initialInputs = {};
// //     product.warehouseBatches.forEach((b) => {
// //       initialInputs[b.warehouseProductId] = 0;
// //     });
// //     setBatchInputs(initialInputs);
// //   };

// //   const closeModal = () => {
// //     setSelectedProduct(null);
// //     setBatchInputs({});
// //   };

// //   const handleBatchChange = (batchId, value) => {
// //     const numericValue = parseInt(value) || 0;
// //     const total = Object.entries(batchInputs).reduce((sum, [id, val]) => {
// //       return id === batchId ? sum + numericValue : sum + val;
// //     }, 0);
// //     if (total <= selectedProduct.requestedQuantity) {
// //       setBatchInputs({ ...batchInputs, [batchId]: numericValue });
// //     }
// //   };

// //   const handleRequestToWarehouse = async () => {
// //     if (!selectedProduct) return;

// //     const batches = Object.entries(batchInputs)
// //       .filter(([_, qty]) => qty > 0)
// //       .map(([warehouseProductId, quantity]) => ({
// //         warehouseProductId,
// //         quantity,
// //       }));

// //     if (batches.length === 0) {
// //       alert("Please select at least one batch");
// //       return;
// //     }

// //     const totalQuantity = batches.reduce((sum, b) => sum + b.quantity, 0);

// //     const payload = {
// //       status: "requested",
// //       quantity: totalQuantity,
// //       batches,
// //       addedBy: "69770be5b47a7f9275439da0",
// //     };

// //     try {
// //       await sendProductRequestTowarehouse({
// //         requestId: selectedProduct.requestId,
// //         payload,
// //       }).unwrap();

// //       alert("Request sent to warehouse successfully");
// //       closeModal();
// //     } catch (error) {
// //       console.error(error);
// //       alert("Failed to send request");
// //     }
// //   };

// //   if (isLoading) return <p className="text-center py-10">Loading...</p>;
// //   if (isError) return <p className="text-center py-10 text-red-500">Error fetching depot requests</p>;

// //   const groupedData = data?.data || {};

// //   return (
// //     <div className="p-6 bg-gray-50 min-h-screen">
// //       <h1 className="text-3xl font-bold mb-6 text-gray-800">Depot Requests</h1>

// //       {Object.entries(groupedData).length === 0 && (
// //         <p className="text-center text-gray-500 mt-10">No pending requests found.</p>
// //       )}

// //       {Object.entries(groupedData).map(([date, products]) => (
// //         <div key={date} className="mb-8">
// //           <h2 className="text-lg font-semibold mb-3 text-gray-700">{date}</h2>
// //           <div className="overflow-x-auto">
// //             <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
// //               <thead className="bg-blue-50">
// //                 <tr>
// //                   <th className="text-left p-3 border-b">#</th>
// //                   <th className="text-left p-3 border-b">Name</th>
// //                   <th className="text-left p-3 border-b">Warehouse Qty</th>
// //                   <th className="text-left p-3 border-b">Depot Qty</th>
// //                   <th className="text-left p-3 border-b">Requested Qty</th>
// //                   <th className="text-left p-3 border-b">Action</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {(Array.isArray(products) ? products : []).map((prod, idx) => (
// //                   <tr key={prod.productId + idx} className="hover:bg-gray-50 transition">
// //                     <td className="p-3 border-b">{idx + 1}</td>
// //                     <td className="p-3 border-b font-medium">{prod.productName}</td>
// //                     <td className="p-3 border-b">{prod.warehouseQuantity}</td>
// //                     <td className="p-3 border-b">{prod.depotQuantity}</td>
// //                     <td className="p-3 border-b">{prod.requestedQuantity}</td>
// //                     <td className="p-3 border-b">
// //                       <button
// //                         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
// //                         onClick={() => openModal(prod)}
// //                       >
// //                         View & Approve
// //                       </button>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>
// //       ))}

// //       {/* Modal */}
// //       <Modal
// //         isOpen={!!selectedProduct}
// //         onRequestClose={closeModal}
// //         contentLabel="View & Approve"
// //         className="bg-white p-6 max-w-4xl mx-auto mt-20 rounded-xl shadow-xl overflow-auto max-h-[80vh]"
// //         overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50"
// //       >
// //         {selectedProduct && (
// //           <div>
// //             <h2 className="text-2xl font-bold mb-4 text-gray-800">
// //               {selectedProduct.productName} - Approve
// //             </h2>
// //             <p className="mb-4 text-gray-600">
// //               Requested Quantity: <span className="font-semibold">{selectedProduct.requestedQuantity}</span>
// //             </p>

// //             <h3 className="text-lg font-semibold mb-2 text-gray-700">Warehouse Batches</h3>
// //             <div className="overflow-x-auto mb-6">
// //               <table className="min-w-full bg-white border rounded-lg">
// //                 <thead className="bg-blue-50">
// //                   <tr>
// //                     <th className="p-2 border">Batch</th>
// //                     <th className="p-2 border">Expire Date</th>
// //                     <th className="p-2 border">Available Qty</th>
// //                     <th className="p-2 border">Select Qty</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {selectedProduct.warehouseBatches.map((b) => (
// //                     <tr key={b.warehouseProductId} className="hover:bg-gray-50 transition">
// //                       <td className="p-2 border">{b.batch}</td>
// //                       <td className="p-2 border">{new Date(b.expireDate).toLocaleDateString()}</td>
// //                       <td className="p-2 border">{b.totalQuantity}</td>
// //                       <td className="p-2 border">
// //                         <input
// //                           type="number"
// //                           min={0}
// //                           max={b.totalQuantity}
// //                           value={batchInputs[b.warehouseProductId]}
// //                           onChange={(e) => handleBatchChange(b.warehouseProductId, e.target.value)}
// //                           className="border rounded px-2 py-1 w-20 text-center"
// //                         />
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>

// //             <h3 className="text-lg font-semibold mb-2 text-gray-700">Depot Batches</h3>
// //             <div className="overflow-x-auto mb-6">
// //               <table className="min-w-full bg-white border rounded-lg">
// //                 <thead className="bg-blue-50">
// //                   <tr>
// //                     <th className="p-2 border">Batch</th>
// //                     <th className="p-2 border">Expire Date</th>
// //                     <th className="p-2 border">Total Qty</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {selectedProduct.depotBatches.map((b) => (
// //                     <tr key={b.depotProductId} className="hover:bg-gray-50 transition">
// //                       <td className="p-2 border">{b.batch}</td>
// //                       <td className="p-2 border">{new Date(b.expireDate).toLocaleDateString()}</td>
// //                       <td className="p-2 border">{b.totalQuantity}</td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>

// //             <div className="flex justify-end gap-3">
// //               <button
// //                 onClick={closeModal}
// //                 className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded shadow"
// //               >
// //                 Close
// //               </button>
// //               <button
// //                 onClick={handleRequestToWarehouse}
// //                 className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded shadow"
// //               >
// //                 Request to Warehouse
// //               </button>
// //             </div>
// //           </div>
// //         )}
// //       </Modal>
// //     </div>
// //   );
// // };

// // export default DepotRequestsPage;


// import React, { useState } from "react";
// import Modal from "react-modal";
// import {
//   useGetGroupedDepotRequestsQuery,
//   useSendProductRequestTowarehouseMutation,
// } from "../../../../redux/features/depot/depotStockApi";

// Modal.setAppElement("#root");

// // Card component for a single depot request row
// const DepotRequestCard = ({ idx, product, openModal }) => (
//   <tr className="text-gray-700 hover:bg-gray-50 transition">
//     <td className="text-center p-2">{idx}</td>
//     <td className="p-2 font-medium">{product.productName}</td>
//     <td className="text-center p-2">{product.warehouseQuantity}</td>
//     <td className="text-center p-2">{product.depotQuantity}</td>
//     <td className="text-center p-2">{product.requestedQuantity}</td>
//     <td className="text-center p-2">
//       <button
//         className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
//         onClick={() => openModal(product)}
//       >
//         View & Approve
//       </button>
//     </td>
//   </tr>
// );

// const DepotRequestsPage = () => {
//   const { data, isLoading, isError } = useGetGroupedDepotRequestsQuery("pending");
//   const [sendProductRequestTowarehouse] = useSendProductRequestTowarehouseMutation();
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [batchInputs, setBatchInputs] = useState({});

//   const openModal = (product) => {
//     setSelectedProduct(product);
//     const initialInputs = {};
//     product.warehouseBatches.forEach((b) => {
//       initialInputs[b.warehouseProductId] = 0;
//     });
//     setBatchInputs(initialInputs);
//   };

//   const closeModal = () => {
//     setSelectedProduct(null);
//     setBatchInputs({});
//   };

//   const handleBatchChange = (batchId, value) => {
//     const numericValue = parseInt(value) || 0;
//     const total = Object.entries(batchInputs).reduce((sum, [id, val]) => {
//       return id === batchId ? sum + numericValue : sum + val;
//     }, 0);
//     if (total <= selectedProduct.requestedQuantity) {
//       setBatchInputs({ ...batchInputs, [batchId]: numericValue });
//     }
//   };

//   const handleRequestToWarehouse = async () => {
//     if (!selectedProduct) return;

//     const batches = Object.entries(batchInputs)
//       .filter(([_, qty]) => qty > 0)
//       .map(([warehouseProductId, quantity]) => ({ warehouseProductId, quantity }));

//     if (batches.length === 0) {
//       alert("Please select at least one batch");
//       return;
//     }

//     const totalQuantity = batches.reduce((sum, b) => sum + b.quantity, 0);

//     const payload = { status: "requested", quantity: totalQuantity, batches, addedBy: "69770be5b47a7f9275439da0" };

//     try {
//       await sendProductRequestTowarehouse({ requestId: selectedProduct.requestId, payload }).unwrap();
//       alert("Request sent to warehouse successfully");
//       closeModal();
//     } catch (error) {
//       console.error(error);
//       alert("Failed to send request");
//     }
//   };

//   if (isLoading) return <p className="text-center py-10">Loading depot requests...</p>;
//   if (isError) return <p className="text-center py-10 text-red-500">Error fetching depot requests</p>;

//   const groupedData = data?.data || [];

//   // Calculate summary totals
//   const allProducts = Object.values(groupedData).flat();
//   const totals = {
//     totalProducts: allProducts.length,
//     totalRequestedQty: allProducts.reduce((sum, p) => sum + p.requestedQuantity, 0),
//     totalDepotQty: allProducts.reduce((sum, p) => sum + p.depotQuantity, 0),
//     totalWarehouseQty: allProducts.reduce((sum, p) => sum + p.warehouseQuantity, 0),
//   };

//   return (
//     <div className="mx-auto p-4">
//       {/* Top Bar */}
//       <div className="bg-white text-gray-500 h-12 flex items-center px-6 rounded shadow">
//         <h2 className="text-base font-bold">NPL / Admin / Depot Requests</h2>
//       </div>

//       {/* Summary Panel */}
//       <DepotRequestsSummaryPanel totals={totals} />

//       {/* Table */}
//       {Object.entries(groupedData).map(([date, products]) => (
//         <div key={date} className="mt-6 bg-white rounded-lg shadow overflow-x-auto">
//           <h3 className="font-semibold p-3 border-b">{date}</h3>
//           <table className="min-w-full border-collapse">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-2 border text-center">#</th>
//                 <th className="p-2 border text-left">Name</th>
//                 <th className="p-2 border text-center">Warehouse Qty</th>
//                 <th className="p-2 border text-center">Depot Qty</th>
//                 <th className="p-2 border text-center">Requested Qty</th>
//                 <th className="p-2 border text-center">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {(Array.isArray(products) ? products : []).map((prod, idx) => (
//                 <DepotRequestCard key={prod.productId + idx} idx={idx + 1} product={prod} openModal={openModal} />
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ))}

//       {/* Modal */}
//       {selectedProduct && (
//         <Modal
//           isOpen={!!selectedProduct}
//           onRequestClose={closeModal}
//           contentLabel="View & Approve"
//           className="bg-white p-6 max-w-4xl mx-auto mt-20 rounded-xl shadow-xl overflow-auto max-h-[80vh]"
//           overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50"
//         >
//           <h2 className="text-xl font-bold mb-4">{selectedProduct.productName} - Approve</h2>
//           <p className="mb-3 text-gray-600">
//             Requested Quantity: <span className="font-semibold">{selectedProduct.requestedQuantity}</span>
//           </p>

//           {/* Warehouse Batches */}
//           <h3 className="font-semibold mb-2">Warehouse Batches</h3>
//           <div className="overflow-x-auto mb-4">
//             <table className="min-w-full bg-white border rounded-lg">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="p-2 border">Batch</th>
//                   <th className="p-2 border">Expire Date</th>
//                   <th className="p-2 border">Available Qty</th>
//                   <th className="p-2 border">Select Qty</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {selectedProduct.warehouseBatches.map((b) => (
//                   <tr key={b.warehouseProductId} className="hover:bg-gray-50 transition">
//                     <td className="p-2 border">{b.batch}</td>
//                     <td className="p-2 border">{new Date(b.expireDate).toLocaleDateString()}</td>
//                     <td className="p-2 border">{b.totalQuantity}</td>
//                     <td className="p-2 border">
//                       <input
//                         type="number"
//                         min={0}
//                         max={b.totalQuantity}
//                         value={batchInputs[b.warehouseProductId]}
//                         onChange={(e) => handleBatchChange(b.warehouseProductId, e.target.value)}
//                         className="border rounded px-2 py-1 w-20 text-center"
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Depot Batches */}
//           <h3 className="font-semibold mb-2">Depot Batches</h3>
//           <div className="overflow-x-auto mb-4">
//             <table className="min-w-full bg-white border rounded-lg">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="p-2 border">Batch</th>
//                   <th className="p-2 border">Expire Date</th>
//                   <th className="p-2 border">Total Qty</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {selectedProduct.depotBatches.map((b) => (
//                   <tr key={b.depotProductId} className="hover:bg-gray-50 transition">
//                     <td className="p-2 border">{b.batch}</td>
//                     <td className="p-2 border">{new Date(b.expireDate).toLocaleDateString()}</td>
//                     <td className="p-2 border">{b.totalQuantity}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="flex justify-end gap-3 mt-4">
//             <button onClick={closeModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded shadow">
//               Close
//             </button>
//             <button
//               onClick={handleRequestToWarehouse}
//               className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded shadow"
//             >
//               Request to Warehouse
//             </button>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default DepotRequestsPage;


import React, { useState } from "react";
import Modal from "react-modal";
import {
  useGetGroupedDepotRequestsQuery,
  useSendProductRequestTowarehouseMutation,
} from "../../../../redux/features/depot/depotStockApi";
import UniversalSummaryPanel from "../../../../component/common/UniversalSummaryPanel";


Modal.setAppElement("#root");

// Card component for a single depot request row
const DepotRequestCard = ({ idx, product, openModal }) => (
  <tr className="hover:bg-gray-50 transition text-gray-700">
    <td className="text-center p-2">{idx}</td>
    <td className="p-2 font-medium">{product.productName}</td>
    <td className="text-center p-2">{product.warehouseQuantity}</td>
    <td className="text-center p-2">{product.depotQuantity}</td>
    <td className="text-center p-2">{product.requestedQuantity}</td>
    <td className="text-center p-2">
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded shadow"
        onClick={() => openModal(product)}
      >
        View & Approve
      </button>
    </td>
  </tr>
);

const DepotRequestsPage = () => {
  const { data, isLoading, isError } = useGetGroupedDepotRequestsQuery("pending");
  const [sendProductRequestTowarehouse] = useSendProductRequestTowarehouseMutation();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [batchInputs, setBatchInputs] = useState({});

  const openModal = (product) => {
    setSelectedProduct(product);
    const initialInputs = {};
    product.warehouseBatches.forEach((b) => {
      initialInputs[b.warehouseProductId] = 0;
    });
    setBatchInputs(initialInputs);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setBatchInputs({});
  };

  const handleBatchChange = (batchId, value) => {
    const numericValue = parseInt(value) || 0;
    const total = Object.entries(batchInputs).reduce(
      (sum, [id, val]) => (id === batchId ? sum + numericValue : sum + val),
      0
    );
    if (total <= selectedProduct.requestedQuantity) {
      setBatchInputs({ ...batchInputs, [batchId]: numericValue });
    }
  };

  const handleRequestToWarehouse = async () => {
    if (!selectedProduct) return;

    const batches = Object.entries(batchInputs)
      .filter(([_, qty]) => qty > 0)
      .map(([warehouseProductId, quantity]) => ({ warehouseProductId, quantity }));

    if (batches.length === 0) {
      alert("Please select at least one batch");
      return;
    }

    const totalQuantity = batches.reduce((sum, b) => sum + b.quantity, 0);

    const payload = { status: "requested", quantity: totalQuantity, batches, addedBy: "69770be5b47a7f9275439da0" };

    try {
      await sendProductRequestTowarehouse({ requestId: selectedProduct.requestId, payload }).unwrap();
      alert("Request sent to warehouse successfully");
      closeModal();
    } catch (error) {
      console.error(error);
      alert("Failed to send request");
    }
  };

  if (isLoading) return <p className="text-center py-10">Loading depot requests...</p>;
  if (isError) return <p className="text-center py-10 text-red-500">Error fetching depot requests</p>;

  const groupedData = data?.data || {};

  // Calculate totals for summary panel
  const allProducts = Object.values(groupedData).flat();
  const totals = {
    "Total Products": allProducts.length,
    "Total Requested Qty": allProducts.reduce((sum, p) => sum + p.requestedQuantity, 0),
    "Total Depot Qty": allProducts.reduce((sum, p) => sum + p.depotQuantity, 0),
    "Total Warehouse Qty": allProducts.reduce((sum, p) => sum + p.warehouseQuantity, 0),
  };

  return (
    <div className="mx-auto p-4">
      {/* Top Bar */}
      <div className="bg-white text-gray-500 h-12 flex items-center px-6 rounded shadow">
        <h2 className="text-base font-bold">NPL / Admin / Depot Requests</h2>
      </div>

      {/* Universal Summary Panel */}
      <UniversalSummaryPanel totals={totals} />

      {/* Table for each date group */}
      <div className="space-y-6 mt-4">
        {Object.entries(groupedData).length === 0 && (
          <p className="text-center mt-10">No pending requests found.</p>
        )}

        {Object.entries(groupedData).map(([date, products]) => (
          <div key={date} className="bg-white rounded-lg shadow overflow-x-auto">
            <h3 className="font-semibold p-3  bg-blue-50">{date}</h3>
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border text-center">Sl</th>
                  <th className="p-2 border text-left">Name</th>
                  <th className="p-2 border text-center">Warehouse Qty</th>
                  <th className="p-2 border text-center">Depot Qty</th>
                  <th className="p-2 border text-center">Requested Qty</th>
                  <th className="p-2 border text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(products) ? products : []).map((prod, idx) => (
                  <DepotRequestCard key={prod.productId + idx} idx={idx + 1} product={prod} openModal={openModal} />
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedProduct && (
        <Modal
          isOpen={!!selectedProduct}
          onRequestClose={closeModal}
          contentLabel="View & Approve"
          className="bg-white p-6 max-w-4xl mx-auto mt-20 rounded-xl shadow-xl overflow-auto max-h-[80vh]"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50"
        >
          <h2 className="text-2xl font-bold mb-4">{selectedProduct.productName} - Approve</h2>
          <p className="mb-3 text-gray-600">
            Requested Quantity: <span className="font-semibold">{selectedProduct.requestedQuantity}</span>
          </p>

          {/* Warehouse Batches */}
          <h3 className="font-semibold mb-2">Warehouse Batches</h3>
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full bg-white border rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Batch</th>
                  <th className="p-2 border">Expire Date</th>
                  <th className="p-2 border">Available Qty</th>
                  <th className="p-2 border">Select Qty</th>
                </tr>
              </thead>
              <tbody>
                {selectedProduct.warehouseBatches.map((b) => (
                  <tr key={b.warehouseProductId} className="hover:bg-gray-50 transition">
                    <td className="p-2 border">{b.batch}</td>
                    <td className="p-2 border">{new Date(b.expireDate).toLocaleDateString()}</td>
                    <td className="p-2 border">{b.totalQuantity}</td>
                    <td className="p-2 border">
                      <input
                        type="number"
                        min={0}
                        max={b.totalQuantity}
                        value={batchInputs[b.warehouseProductId]}
                        onChange={(e) => handleBatchChange(b.warehouseProductId, e.target.value)}
                        className="border rounded px-2 py-1 w-20 text-center"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Depot Batches */}
          <h3 className="font-semibold mb-2">Depot Batches</h3>
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full bg-white border rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Batch</th>
                  <th className="p-2 border">Expire Date</th>
                  <th className="p-2 border">Total Qty</th>
                </tr>
              </thead>
              <tbody>
                {selectedProduct.depotBatches.map((b) => (
                  <tr key={b.depotProductId} className="hover:bg-gray-50 transition">
                    <td className="p-2 border">{b.batch}</td>
                    <td className="p-2 border">{new Date(b.expireDate).toLocaleDateString()}</td>
                    <td className="p-2 border">{b.totalQuantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button onClick={closeModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded shadow">
              Close
            </button>
            <button
              onClick={handleRequestToWarehouse}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded shadow"
            >
              Request to Warehouse
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DepotRequestsPage;