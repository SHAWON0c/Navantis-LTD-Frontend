// // // import { useGetSentProductRequestsByStatusQuery } from "../../../redux/features/depot/depotStockApi";
// // // import DepotRequestProductCard from "../../Depot/DepotRequestProductCard";
// // // import WarehouseRequestProductCard from "../../WareHouse/WarehouseRequestProductCard";
// // // const DepotProductRequest = () => {
// // //   // Fetch only pending product requests
// // //   const { data: productRequestsData, isLoading, refetch } = useGetSentProductRequestsByStatusQuery("pending");

// // //   // Use only the "requests" array from the API response
// // //   const filteredProducts = productRequestsData?.requests || [];

// // //   // Totals (only available fields for now)
// // //   const totalOrderQuantity = filteredProducts.reduce((acc, item) => acc + (item.quantity || 0), 0);
// // //   const totalStockQuantity = 0; // placeholder for now
// // //   const totalMissingQuantity = 0; // placeholder for now

// // //   if (isLoading) return <p className="text-center mt-6">Loading...</p>;

// // //   return (
// // //     <div className="mx-auto p-2">

// // //       {/* Top Bar */}
// // //       <div className="bg-white text-gray-500 h-12 flex items-center px-6">
// // //         <h2 className="text-base font-bold">NPL / Admin / Purchase Order</h2>
// // //       </div>

// // //       {/* Main Content */}
// // //       <div className="space-y-6 mt-4">
// // //         <div className="bg-white pb-1 rounded-lg">
// // //           {/* Product Info */}
// // //           <div className="m-0 p-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-md ">
// // //             <p className="text-md text-gray-700 text-center mb-4 font-medium">Warehouse Request Summary</p>

// // //             <div className="bg-white p-3 rounded-md rounded-b-none shadow-sm flex flex-col md:flex-row justify-around items-center text-gray-600">
// // //               <p className="text-sm">
// // //                 Total Products: <span className="font-medium text-blue-700">{filteredProducts.length}</span>
// // //               </p>
// // //               <p className="text-sm">
// // //                 Total Order Quantity: <span className="font-medium text-blue-700">{totalOrderQuantity}</span>
// // //               </p>
// // //               {/* <p className="text-sm">
// // //                 Total Stock Quantity: <span className="font-medium text-blue-700">{totalStockQuantity}</span>
// // //               </p>
// // //               <p className="text-sm">
// // //                 Total Missing Quantity: <span className="font-medium text-blue-700">{totalMissingQuantity}</span>
// // //               </p> */}
// // //             </div>
// // //           </div>

// // //           {/* Table */}
// // //           <div className="p-6">
// // //             <div className="overflow-x-auto mb-3">
// // //               <table className="table">
// // //                 <thead>
// // //                   <tr>
// // //                     <th className="text-center">Sl. No.</th>
// // //                     <th>Product Name</th>
// // //                     <th className="text-center">warehouse Quantity</th>
// // //                     <th className="text-center">Depot Quantity</th>
// // //                     <th className="text-center">Requested Quantity</th>
// // //                     <th className="text-center">Date</th>
// // //                     <th className="text-center">Requested from</th>
// // //                     <th className="text-center">View details</th>
// // //                     <th className="text-center">Deny</th>
// // //                   </tr>
// // //                 </thead>
// // //                 <tbody>
// // //                   {filteredProducts.map((product, idx) => (
// // //                     <DepotRequestProductCard
// // //                       idx={idx + 1}
// // //                       key={product._id} // use request _id as key
// // //                       product={product}
// // //                       refetch={refetch}
// // //                     />
// // //                   ))}
// // //                 </tbody>
// // //               </table>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default DepotProductRequest;



// // import React, { useState } from "react";
// // import { useGetSentProductRequestsByStatusQuery } from "../../../redux/features/depot/depotStockApi";
// // import DepotRequestProductCard from "../../Depot/DepotRequestProductCard";
// // import DepotReceiveRequestModal from "../../../component/modals/DepotReceiveRequestModal";


// // const DepotProductRequest = () => {
// //   const { data: productRequestsData, isLoading, refetch } = useGetSentProductRequestsByStatusQuery("pending");

// //   const filteredProducts = productRequestsData?.requests || [];

// //   const totalOrderQuantity = filteredProducts.reduce((acc, item) => acc + (item.quantity || 0), 0);

// //   // Modal state
// //   const [selectedProduct, setSelectedProduct] = useState(null);
// //   const [isModalOpen, setIsModalOpen] = useState(false);

// //   // Handle modal open
// //   const openModal = (product) => {
// //     setSelectedProduct(product);
// //     setIsModalOpen(true);
// //   };

// //   // Handle modal close
// //   const closeModal = () => {
// //     setSelectedProduct(null);
// //     setIsModalOpen(false);
// //   };

// //   // Handle submit from modal
// //   const handleSubmitRequest = (requestData) => {
// //     console.log("Request submitted:", requestData);
// //     // ✅ Call your API/mutation here if needed
// //     alert(`Request for ${requestData.quantity} units submitted!`);
// //     refetch(); // Refresh list
// //   };

// //   if (isLoading) return <p className="text-center mt-6">Loading...</p>;

// //   return (
// //     <div className="mx-auto p-2">

// //       {/* Top Bar */}
// //       <div className="bg-white text-gray-500 h-12 flex items-center px-6">
// //         <h2 className="text-base font-bold">NPL / Admin / Purchase Order</h2>
// //       </div>

// //       {/* Main Content */}
// //       <div className="space-y-6 mt-4">
// //         <div className="bg-white pb-1 rounded-lg">
// //           {/* Product Info */}
// //           <div className="m-0 p-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-md ">
// //             <p className="text-md text-gray-700 text-center mb-4 font-medium">Warehouse Request Summary</p>

// //             <div className="bg-white p-3 rounded-md rounded-b-none shadow-sm flex flex-col md:flex-row justify-around items-center text-gray-600">
// //               <p className="text-sm">
// //                 Total Products: <span className="font-medium text-blue-700">{filteredProducts.length}</span>
// //               </p>
// //               <p className="text-sm">
// //                 Total Order Quantity: <span className="font-medium text-blue-700">{totalOrderQuantity}</span>
// //               </p>
// //             </div>
// //           </div>

// //           {/* Table */}
// //           <div className="p-6">
// //             <div className="overflow-x-auto mb-3">
// //               <table className="table">
// //                 <thead>
// //                   <tr>
// //                     <th className="text-center">Sl. No.</th>
// //                     <th>Product Name</th>
// //                     <th className="text-center">Warehouse Quantity</th>
// //                     <th className="text-center">Depot Quantity</th>
// //                     <th className="text-center">Requested Quantity</th>
// //                     <th className="text-center">Date</th>
// //                     <th className="text-center">Requested from</th>
// //                     <th className="text-center">View details</th>
// //                     <th className="text-center">Deny</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {filteredProducts.map((product, idx) => (
// //                     <DepotRequestProductCard
// //                       idx={idx + 1}
// //                       key={product._id}
// //                       product={product}
// //                       refetch={refetch}
// //                       onViewDetails={() => openModal(product)} // pass modal trigger
// //                     />
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Depot Receive Request Modal */}
// //       {selectedProduct && (
// //         <DepotReceiveRequestModal
// //           isOpen={isModalOpen}
// //           onClose={closeModal}
// //           productData={selectedProduct}
// //           addedBy={{ name: "Depot Manager", email: "depot@navantis.com" }} // replace with actual user
// //           onSubmit={handleSubmitRequest}
// //         />
// //       )}
// //     </div>
// //   );
// // };

// // export default DepotProductRequest;



// import React, { useState } from "react";
// // Comment out real API hook for now
// // import { useGetSentProductRequestsByStatusQuery } from "../../../redux/features/depot/depotStockApi";
// import DepotRequestProductCard from "../../Depot/DepotRequestProductCard";
// import DepotReceiveRequestModal from "../../../component/modals/DepotReceiveRequestModal";

// const DepotProductRequest = () => {
//   // --- MOCKED DATA ---
//   const productRequestsData = {
//     requests: [
//       {
//         _id: "6970a0cf52f5c102d25400ac",
//         requestedBy: "Depot A",
//         warehouseProductId: {
//           _id: "697098db218f230e8b49b2d6",
//           productName: "NOIDERMA BRILLIANT WHITE EMULSION",
//           batch: "bTCH-100000",
//           totalQuantity: 490,
//         },
//         quantity: 10,
//         status: "pending",
//         createdAt: "2026-01-21T09:48:00.005Z",
//         updatedAt: "2026-01-21T09:48:00.005Z",
//         __v: 0,
//       },
//     ],
//   };
//   const isLoading = false;
//   const refetch = () => console.log("Refetch called!");

//   const filteredProducts = productRequestsData?.requests || [];
//   const totalOrderQuantity = filteredProducts.reduce(
//     (acc, item) => acc + (item.quantity || 0),
//     0
//   );

//   // Modal state
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const openModal = (product) => {
//     setSelectedProduct(product);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setSelectedProduct(null);
//     setIsModalOpen(false);
//   };

//   const handleSubmitRequest = (requestData) => {
//     console.log("Request submitted:", requestData);
//     alert(`Request for ${requestData.quantity} units submitted!`);
//     refetch();
//   };

//   if (isLoading) return <p className="text-center mt-6">Loading...</p>;

//   return (
//     <div className="mx-auto p-2">
//       <div className="bg-white text-gray-500 h-12 flex items-center px-6">
//         <h2 className="text-base font-bold">NPL / Admin / Purchase Order</h2>
//       </div>

//       <div className="space-y-6 mt-4">
//         <div className="bg-white pb-1 rounded-lg">
//           <div className="m-0 p-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-md">
//             <p className="text-md text-gray-700 text-center mb-4 font-medium">
//               Warehouse Request Summary
//             </p>

//             <div className="bg-white p-3 rounded-md rounded-b-none shadow-sm flex flex-col md:flex-row justify-around items-center text-gray-600">
//               <p className="text-sm">
//                 Total Products:{" "}
//                 <span className="font-medium text-blue-700">
//                   {filteredProducts.length}
//                 </span>
//               </p>
//               <p className="text-sm">
//                 Total Order Quantity:{" "}
//                 <span className="font-medium text-blue-700">
//                   {totalOrderQuantity}
//                 </span>
//               </p>
//             </div>
//           </div>

//           <div className="p-6">
//             <div className="overflow-x-auto mb-3">
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th className="text-center">Sl. No.</th>
//                     <th>Product Name</th>
//                     <th className="text-center">Warehouse Quantity</th>
//                     <th className="text-center">Depot Quantity</th>
//                     <th className="text-center">Requested Quantity</th>
//                     <th className="text-center">Date</th>
//                     <th className="text-center">Requested from</th>
//                     <th className="text-center">View details</th>
//                     <th className="text-center">Deny</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredProducts.map((product, idx) => (
//                     <DepotRequestProductCard
//                       idx={idx + 1}
//                       key={product._id}
//                       product={product}
//                       refetch={refetch}
//                       onViewDetails={() => openModal(product)}
//                     />
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>

//       {selectedProduct && (
//         <DepotReceiveRequestModal
//           isOpen={isModalOpen}
//           onClose={closeModal}
//           productData={selectedProduct}
//           addedBy={{ name: "Depot Manager", email: "depot@navantis.com" }}
//           onSubmit={handleSubmitRequest}
//         />
//       )}
//     </div>
//   );
// };

// export default DepotProductRequest;
