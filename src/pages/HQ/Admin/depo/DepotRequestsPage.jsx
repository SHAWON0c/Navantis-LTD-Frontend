
// import React, { useState } from "react";

// import Modal from "react-modal"; // or your preferred modal library
// import { useGetGroupedDepotRequestsQuery, useSendProductRequestTowarehouseMutation } from "../../../../redux/features/depot/depotStockApi";

// Modal.setAppElement("#root"); // for accessibility

// const DepotRequestsPage = () => {
//   const { data, isLoading, isError } = useGetGroupedDepotRequestsQuery(
//     "pending"
//   );
//   const [sendProductRequestTowarehouse] =
//     useSendProductRequestTowarehouseMutation();

//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [batchInputs, setBatchInputs] = useState({}); // { batchId: quantity }


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
//       .map(([warehouseProductId, quantity]) => ({
//         warehouseProductId,
//         quantity
//       }));

//     if (batches.length === 0) {
//       alert("Please select at least one batch");
//       return;
//     }

//     const totalQuantity = batches.reduce((sum, b) => sum + b.quantity, 0);

//     const payload = {
//       status: "requested",
//       quantity: totalQuantity,
//       batches,
//       addedBy: "69770be5b47a7f9275439da0"
//     };

//     try {
//       await sendProductRequestTowarehouse({
//         requestId: selectedProduct.requestId,
//         payload
//       }).unwrap();

//       alert("Request sent to warehouse successfully");
//       closeModal();
//     } catch (error) {
//       console.error(error);
//       alert("Failed to send request");
//     }
//   };

//   if (isLoading) return <p>Loading...</p>;
//   if (isError) return <p>Error fetching depot requests</p>;

//   const groupedData = data?.data || {};

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Depot Requests</h1>

//       {Object.entries(groupedData).length === 0 && (
//         <p>No pending requests found.</p>
//       )}

//       {Object.entries(groupedData).map(([date, products]) => (
//         <div key={date} className="mb-6">
//           <h2 className="font-semibold text-lg mb-2">{date}</h2>
//           <table className="w-full text-left border">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="p-2 border">Sl. No.</th>
//                 <th className="p-2 border">Name</th>
//                 <th className="p-2 border">Warehouse Quantity</th>
//                 <th className="p-2 border">Depot Quantity</th>
//                 <th className="p-2 border">Requested Quantity</th>
//                 <th className="p-2 border">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {(Array.isArray(products) ? products : []).map((prod, idx) => (
//                 <tr key={prod.productId + idx}>
//                   <td className="p-2 border">{idx + 1}</td>
//                   <td className="p-2 border">{prod.productName}</td>
//                   <td className="p-2 border">{prod.warehouseQuantity}</td>
//                   <td className="p-2 border">{prod.depotQuantity}</td>
//                   <td className="p-2 border">{prod.requestedQuantity}</td>
//                   <td className="p-2 border">
//                     <button
//                       className="bg-blue-500 text-white px-3 py-1 rounded"
//                       onClick={() => openModal(prod)}
//                     >
//                       View & Approve
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ))}

//       {/* Modal */}
//       <Modal
//         isOpen={!!selectedProduct}
//         onRequestClose={closeModal}
//         contentLabel="View & Approve"
//         className="bg-white p-6 max-w-3xl mx-auto mt-20 rounded shadow-lg"
//         overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start"
//       >
//         {selectedProduct && (
//           <div>
//             <h2 className="text-xl font-bold mb-4">
//               {selectedProduct.productName} - Approve
//             </h2>
//             <p className="mb-2">
//               Requested Quantity: {selectedProduct.requestedQuantity}
//             </p>

//             <h3 className="font-semibold mb-1">Warehouse Batches</h3>
//             <table className="w-full text-left border mb-4">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="p-2 border">Batch</th>
//                   <th className="p-2 border">Expire Date</th>
//                   <th className="p-2 border">Available Quantity</th>
//                   <th className="p-2 border">Select Quantity</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {selectedProduct.warehouseBatches.map((b) => (
//                   <tr key={b.warehouseProductId}>
//                     <td className="p-2 border">{b.batch}</td>
//                     <td className="p-2 border">
//                       {new Date(b.expireDate).toLocaleDateString()}
//                     </td>
//                     <td className="p-2 border">{b.totalQuantity}</td>
//                     <td className="p-2 border">
//                       <input
//                         type="number"
//                         min={0}
//                         max={b.totalQuantity}
//                         value={batchInputs[b.warehouseProductId]}
//                         onChange={(e) =>
//                           handleBatchChange(b.warehouseProductId, e.target.value)
//                         }
//                         className="border p-1 w-20"
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             <h3 className="font-semibold mb-1">Depot Batches</h3>
//             <table className="w-full text-left border mb-4">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="p-2 border">Batch</th>
//                   <th className="p-2 border">Expire Date</th>
//                   <th className="p-2 border">Total Quantity</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {selectedProduct.depotBatches.map((b) => (
//                   <tr key={b.depotProductId}>
//                     <td className="p-2 border">{b.batch}</td>
//                     <td className="p-2 border">
//                       {new Date(b.expireDate).toLocaleDateString()}
//                     </td>
//                     <td className="p-2 border">{b.totalQuantity}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={closeModal}
//                 className="bg-gray-400 text-white px-4 py-2 rounded"
//               >
//                 Close
//               </button>
//               <button
//                 onClick={handleRequestToWarehouse}
//                 className="bg-green-500 text-white px-4 py-2 rounded"
//               >
//                 Request to Warehouse
//               </button>
//             </div>
//           </div>
//         )}
//       </Modal>
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

Modal.setAppElement("#root");

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
    const total = Object.entries(batchInputs).reduce((sum, [id, val]) => {
      return id === batchId ? sum + numericValue : sum + val;
    }, 0);
    if (total <= selectedProduct.requestedQuantity) {
      setBatchInputs({ ...batchInputs, [batchId]: numericValue });
    }
  };

  const handleRequestToWarehouse = async () => {
    if (!selectedProduct) return;

    const batches = Object.entries(batchInputs)
      .filter(([_, qty]) => qty > 0)
      .map(([warehouseProductId, quantity]) => ({
        warehouseProductId,
        quantity,
      }));

    if (batches.length === 0) {
      alert("Please select at least one batch");
      return;
    }

    const totalQuantity = batches.reduce((sum, b) => sum + b.quantity, 0);

    const payload = {
      status: "requested",
      quantity: totalQuantity,
      batches,
      addedBy: "69770be5b47a7f9275439da0",
    };

    try {
      await sendProductRequestTowarehouse({
        requestId: selectedProduct.requestId,
        payload,
      }).unwrap();

      alert("Request sent to warehouse successfully");
      closeModal();
    } catch (error) {
      console.error(error);
      alert("Failed to send request");
    }
  };

  if (isLoading) return <p className="text-center py-10">Loading...</p>;
  if (isError) return <p className="text-center py-10 text-red-500">Error fetching depot requests</p>;

  const groupedData = data?.data || {};

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Depot Requests</h1>

      {Object.entries(groupedData).length === 0 && (
        <p className="text-center text-gray-500 mt-10">No pending requests found.</p>
      )}

      {Object.entries(groupedData).map(([date, products]) => (
        <div key={date} className="mb-8">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">{date}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
              <thead className="bg-blue-50">
                <tr>
                  <th className="text-left p-3 border-b">#</th>
                  <th className="text-left p-3 border-b">Name</th>
                  <th className="text-left p-3 border-b">Warehouse Qty</th>
                  <th className="text-left p-3 border-b">Depot Qty</th>
                  <th className="text-left p-3 border-b">Requested Qty</th>
                  <th className="text-left p-3 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(products) ? products : []).map((prod, idx) => (
                  <tr key={prod.productId + idx} className="hover:bg-gray-50 transition">
                    <td className="p-3 border-b">{idx + 1}</td>
                    <td className="p-3 border-b font-medium">{prod.productName}</td>
                    <td className="p-3 border-b">{prod.warehouseQuantity}</td>
                    <td className="p-3 border-b">{prod.depotQuantity}</td>
                    <td className="p-3 border-b">{prod.requestedQuantity}</td>
                    <td className="p-3 border-b">
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
                        onClick={() => openModal(prod)}
                      >
                        View & Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Modal */}
      <Modal
        isOpen={!!selectedProduct}
        onRequestClose={closeModal}
        contentLabel="View & Approve"
        className="bg-white p-6 max-w-4xl mx-auto mt-20 rounded-xl shadow-xl overflow-auto max-h-[80vh]"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50"
      >
        {selectedProduct && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {selectedProduct.productName} - Approve
            </h2>
            <p className="mb-4 text-gray-600">
              Requested Quantity: <span className="font-semibold">{selectedProduct.requestedQuantity}</span>
            </p>

            <h3 className="text-lg font-semibold mb-2 text-gray-700">Warehouse Batches</h3>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full bg-white border rounded-lg">
                <thead className="bg-blue-50">
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

            <h3 className="text-lg font-semibold mb-2 text-gray-700">Depot Batches</h3>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full bg-white border rounded-lg">
                <thead className="bg-blue-50">
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

            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded shadow"
              >
                Close
              </button>
              <button
                onClick={handleRequestToWarehouse}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded shadow"
              >
                Request to Warehouse
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DepotRequestsPage;