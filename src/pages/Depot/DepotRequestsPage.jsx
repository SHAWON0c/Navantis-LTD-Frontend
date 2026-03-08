// import React, { useState } from "react";
// import Modal from "react-modal";

// const mockData = {
//   "2026-03-08": [
//     {
//       productId: "69880f6b0de8f25e8ef8fda1",
//       productName: "AKNET PURIFYING CLEANSING GEL",
//       packSize: "30ml",
//       tradePrice: 750,
//       requestedQuantity: 10,
//       batchCount: 3,
//       warehouseQuantity: 1893,
//       depotQuantity: 106,
//       warehouseBatches: [
//         { batch: "batch-test", totalQuantity: 20, warehouseProductId: "69a26320ae4cd9542dd75783" },
//         { batch: "B-7", totalQuantity: 1832, warehouseProductId: "69a515a36eb505f50aede689" },
//         { batch: "B-8", totalQuantity: 41, warehouseProductId: "69abc7a85d4684007650e8e9" }
//       ],
//       depotBatches: [
//         { batch: "B-7", totalQuantity: 5, depotProductId: "69abbed758bab0d515dd7717" },
//         { batch: "batch-test", totalQuantity: 101, depotProductId: "69abc6525d4684007650e81e" }
//       ],
//       requestedDate: "2026-03-08T05:35:09.309Z"
//     }
//   ]
// };

// Modal.setAppElement("#root");

// const DepotRequestsPage = () => {
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [batchInputs, setBatchInputs] = useState({});

//   const openModal = (product) => {
//     setSelectedProduct(product);
//     // Initialize input quantities to 0
//     const init = {};
//     product.warehouseBatches.forEach(b => {
//       init[b.warehouseProductId] = 0;
//     });
//     setBatchInputs(init);
//     setModalOpen(true);
//   };

//   const closeModal = () => setModalOpen(false);

//   const handleInputChange = (id, value) => {
//     value = Number(value);
//     if (isNaN(value)) return;

//     // Check total not exceed requestedQuantity
//     const total = Object.entries(batchInputs).reduce(
//       (sum, [k, v]) => k === id ? sum + value : sum + v, 0
//     );

//     if (total <= selectedProduct.requestedQuantity) {
//       setBatchInputs({ ...batchInputs, [id]: value });
//     } else {
//       alert("Total selected quantity cannot exceed requested quantity");
//     }
//   };

//   const handleRequestToWarehouse = () => {
//     const selectedBatches = Object.entries(batchInputs)
//       .filter(([id, qty]) => qty > 0)
//       .map(([id, qty]) => ({ warehouseProductId: id, quantity: qty }));

//     console.log("Request to Warehouse:", selectedBatches);
//     alert("Request sent! (Check console for data)");
//   };

//   let serial = 1;

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold mb-4">Depot Requests</h1>
//       <table className="w-full border-collapse border border-gray-300">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="border p-2">Sl. No.</th>
//             <th className="border p-2">Name</th>
//             <th className="border p-2">Warehouse Quantity</th>
//             <th className="border p-2">Depot Quantity</th>
//             <th className="border p-2">Requested Quantity</th>
//             <th className="border p-2">Date</th>
//             <th className="border p-2">View & Approve</th>
//           </tr>
//         </thead>
//         <tbody>
//           {Object.entries(mockData).map(([date, products]) =>
//             products.map(product => (
//               <tr key={product.productId}>
//                 <td className="border p-2">{serial++}</td>
//                 <td className="border p-2">{product.productName}</td>
//                 <td className="border p-2">{product.warehouseQuantity}</td>
//                 <td className="border p-2">{product.depotQuantity}</td>
//                 <td className="border p-2">{product.requestedQuantity}</td>
//                 <td className="border p-2">{new Date(product.requestedDate).toLocaleDateString()}</td>
//                 <td className="border p-2">
//                   <button
//                     className="bg-blue-500 text-white px-2 py-1 rounded"
//                     onClick={() => openModal(product)}
//                   >
//                     View & Approve
//                   </button>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>

//       {/* Modal */}
//       {selectedProduct && (
//         <Modal
//           isOpen={modalOpen}
//           onRequestClose={closeModal}
//           className="bg-white p-6 max-w-xl mx-auto mt-20 rounded shadow-lg"
//           overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50"
//         >
//           <h2 className="text-lg font-bold mb-4">{selectedProduct.productName} - Select Batches</h2>

//           <table className="w-full border-collapse border border-gray-300 mb-4">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="border p-2">Batch</th>
//                 <th className="border p-2">Available Quantity</th>
//                 <th className="border p-2">Select Quantity</th>
//               </tr>
//             </thead>
//             <tbody>
//               {selectedProduct.warehouseBatches.map(batch => (
//                 <tr key={batch.warehouseProductId}>
//                   <td className="border p-2">{batch.batch}</td>
//                   <td className="border p-2">{batch.totalQuantity}</td>
//                   <td className="border p-2">
//                     <input
//                       type="number"
//                       min={0}
//                       max={batch.totalQuantity}
//                       value={batchInputs[batch.warehouseProductId]}
//                       onChange={e => handleInputChange(batch.warehouseProductId, e.target.value)}
//                       className="border p-1 w-20"
//                     />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <div className="flex justify-end gap-2">
//             <button className="bg-gray-400 px-3 py-1 rounded" onClick={closeModal}>
//               Close
//             </button>
//             <button
//               className="bg-green-500 text-white px-3 py-1 rounded"
//               onClick={handleRequestToWarehouse}
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

import Modal from "react-modal"; // or your preferred modal library
import { useGetGroupedDepotRequestsQuery } from "../../redux/features/depot/depotStockApi";

Modal.setAppElement("#root"); // for accessibility

const DepotRequestsPage = () => {
  const { data, isLoading, isError } = useGetGroupedDepotRequestsQuery(
    "pending"
  );

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [batchInputs, setBatchInputs] = useState({}); // { batchId: quantity }

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

  const handleRequestToWarehouse = () => {
    console.log("Request to warehouse:", batchInputs);
    // API integration will go here later
    alert("Request sent to warehouse (static for now)");
    closeModal();
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching depot requests</p>;

  const groupedData = data?.data || {};

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Depot Requests</h1>

      {Object.entries(groupedData).length === 0 && (
        <p>No pending requests found.</p>
      )}

      {Object.entries(groupedData).map(([date, products]) => (
        <div key={date} className="mb-6">
          <h2 className="font-semibold text-lg mb-2">{date}</h2>
          <table className="w-full text-left border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Sl. No.</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Warehouse Quantity</th>
                <th className="p-2 border">Depot Quantity</th>
                <th className="p-2 border">Requested Quantity</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(products) ? products : []).map((prod, idx) => (
                <tr key={prod.productId + idx}>
                  <td className="p-2 border">{idx + 1}</td>
                  <td className="p-2 border">{prod.productName}</td>
                  <td className="p-2 border">{prod.warehouseQuantity}</td>
                  <td className="p-2 border">{prod.depotQuantity}</td>
                  <td className="p-2 border">{prod.requestedQuantity}</td>
                  <td className="p-2 border">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded"
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
      ))}

      {/* Modal */}
      <Modal
        isOpen={!!selectedProduct}
        onRequestClose={closeModal}
        contentLabel="View & Approve"
        className="bg-white p-6 max-w-3xl mx-auto mt-20 rounded shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start"
      >
        {selectedProduct && (
          <div>
            <h2 className="text-xl font-bold mb-4">
              {selectedProduct.productName} - Approve
            </h2>
            <p className="mb-2">
              Requested Quantity: {selectedProduct.requestedQuantity}
            </p>

            <h3 className="font-semibold mb-1">Warehouse Batches</h3>
            <table className="w-full text-left border mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Batch</th>
                  <th className="p-2 border">Expire Date</th>
                  <th className="p-2 border">Available Quantity</th>
                  <th className="p-2 border">Select Quantity</th>
                </tr>
              </thead>
              <tbody>
                {selectedProduct.warehouseBatches.map((b) => (
                  <tr key={b.warehouseProductId}>
                    <td className="p-2 border">{b.batch}</td>
                    <td className="p-2 border">
                      {new Date(b.expireDate).toLocaleDateString()}
                    </td>
                    <td className="p-2 border">{b.totalQuantity}</td>
                    <td className="p-2 border">
                      <input
                        type="number"
                        min={0}
                        max={b.totalQuantity}
                        value={batchInputs[b.warehouseProductId]}
                        onChange={(e) =>
                          handleBatchChange(b.warehouseProductId, e.target.value)
                        }
                        className="border p-1 w-20"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 className="font-semibold mb-1">Depot Batches</h3>
            <table className="w-full text-left border mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Batch</th>
                  <th className="p-2 border">Expire Date</th>
                  <th className="p-2 border">Total Quantity</th>
                </tr>
              </thead>
              <tbody>
                {selectedProduct.depotBatches.map((b) => (
                  <tr key={b.depotProductId}>
                    <td className="p-2 border">{b.batch}</td>
                    <td className="p-2 border">
                      {new Date(b.expireDate).toLocaleDateString()}
                    </td>
                    <td className="p-2 border">{b.totalQuantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Close
              </button>
              <button
                onClick={handleRequestToWarehouse}
                className="bg-green-500 text-white px-4 py-2 rounded"
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