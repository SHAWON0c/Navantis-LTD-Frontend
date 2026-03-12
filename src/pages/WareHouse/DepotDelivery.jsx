// import React, { useState, useEffect, useRef } from "react";
// import { ChevronDown } from "lucide-react";
// import toast from "react-hot-toast";
// import { useGetGroupedDepotRequestsQuery, useUpdateDepotRequestStatusMutation } from "../../redux/features/depot/depotStockApi";
// import Card from "../../component/common/Card";
// import Button from "../../component/common/Button";
// import Loader from "../../component/Loader";

// const DepotDelivery = () => {
//   const { data, isLoading, refetch } = useGetGroupedDepotRequestsQuery("requested");
//   const [updateStatus, { isLoading: isSubmitting }] = useUpdateDepotRequestStatusMutation();

//   const [selectedDate, setSelectedDate] = useState("");
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [dateOpen, setDateOpen] = useState(false);
//   const [productOpen, setProductOpen] = useState(false);

//   const dateRef = useRef();
//   const productRef = useRef();

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dateRef.current && !dateRef.current.contains(e.target)) setDateOpen(false);
//       if (productRef.current && !productRef.current.contains(e.target)) setProductOpen(false);
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const groupedData = data?.data || {};
//   const dates = Object.keys(groupedData);
//   const productsForDate = selectedDate ? groupedData[selectedDate] || [] : [];

//   useEffect(() => {
//     if (productsForDate.length > 0) {
//       setSelectedProduct(productsForDate[0]);
//     } else {
//       setSelectedProduct(null);
//     }
//   }, [selectedDate, data]);

//   const handleApprove = async () => {
//     if (!selectedProduct) return toast.error("Please select a product");

//     const confirm = window.confirm(`Are you sure you want to approve "${selectedProduct.productName}"?`);
//     if (!confirm) return;

//     try {
//       await updateStatus({
//         id: selectedProduct._id,
//         status: "accepted"
//       }).unwrap();

//       toast.success(`${selectedProduct.productName} approved successfully!`);
//       setSelectedProduct(null);
//       refetch();
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to approve product");
//     }
//   };

//   if (isLoading) return <Loader />;

//   return (
//     <div className="min-h-screen bg-neutral-50">
//       {/* Header */}
//       <Card className="mb-6">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//              <div className="bg-white text-gray-500 h-12 flex items-center px-6">
//               <h2 className="text-base font-bold">NPL / Admin / Purchase Order</h2>
//             </div>
//           </div>
//           <div className="text-sm text-neutral-500">
//             Total Dates: {dates.length}
//           </div>
//         </div>
//       </Card>

//       {/* Selection Cards */}
//       <Card className="mb-6">
//         <div className="grid md:grid-cols-2 gap-6">
//           {/* Date Selector */}
//           <div ref={dateRef} className="relative">
//             <label className="block text-sm font-semibold mb-2 text-gray-700">Select Date</label>
//             <button
//               onClick={() => setDateOpen(!dateOpen)}
//               className="w-full border border-gray-300 rounded-lg p-3 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
//             >
//               <span className="text-gray-700">
//                 {selectedDate ? new Date(selectedDate).toLocaleDateString() : "-- Select a date --"}
//               </span>
//               <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${dateOpen ? "rotate-180" : ""}`} />
//             </button>
//             {dateOpen && (
//               <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto mt-2">
//                 {dates.map((date) => (
//                   <li
//                     key={date}
//                     className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 transition-colors"
//                     onClick={() => {
//                       setSelectedDate(date);
//                       setDateOpen(false);
//                     }}
//                   >
//                     {new Date(date).toLocaleDateString()}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Product Selector */}
//           <div ref={productRef} className="relative">
//             <label className="block text-sm font-semibold mb-2 text-gray-700">Select Product</label>
//             <button
//               onClick={() => productsForDate.length > 0 && setProductOpen(!productOpen)}
//               disabled={productsForDate.length === 0}
//               className="w-full border border-gray-300 rounded-lg p-3 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <span className="text-gray-700">
//                 {selectedProduct ? selectedProduct.productName : "-- Select a product --"}
//               </span>
//               <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${productOpen ? "rotate-180" : ""}`} />
//             </button>
//             {productOpen && (
//               <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto mt-2">
//                 {productsForDate.map((product) => (
//                   <li
//                     key={product._id}
//                     className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 transition-colors"
//                     onClick={() => {
//                       setSelectedProduct(product);
//                       setProductOpen(false);
//                     }}
//                   >
//                     {product.productName}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       </Card>

//       {/* Product Details */}
//       {selectedProduct && (
//         <Card title="Product Details" subtitle={selectedProduct.productName}>
//           <div className="grid md:grid-cols-2 gap-6 mb-6">
//             <div>
//               <p className="text-sm text-gray-600 mb-1">Pack Size</p>
//               <p className="text-lg font-semibold text-gray-900">{selectedProduct.packSize || "-"}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-600 mb-1">Batch</p>
//               <p className="text-lg font-semibold text-gray-900">{selectedProduct.batch || "-"}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-600 mb-1">Requested Quantity</p>
//               <p className="text-lg font-semibold text-blue-600">{selectedProduct.requestedQuantity || 0}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-600 mb-1">Warehouse Quantity</p>
//               <p className="text-lg font-semibold text-green-600">{selectedProduct.warehouseQuantity || 0}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-600 mb-1">Depot Quantity</p>
//               <p className="text-lg font-semibold text-orange-600">{selectedProduct.depotQuantity || 0}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-600 mb-1">Expire Date</p>
//               <p className="text-lg font-semibold text-gray-900">
//                 {selectedProduct.expireDate ? new Date(selectedProduct.expireDate).toLocaleDateString() : "-"}
//               </p>
//             </div>
//           </div>

//           <div className="flex justify-end gap-3">
//             <Button
//               variant="outline"
//               onClick={() => setSelectedProduct(null)}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="primary"
//               onClick={handleApprove}
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? "Processing..." : "Approve & Deliver"}
//             </Button>
//           </div>
//         </Card>
//       )}

//       {dates.length === 0 && (
//         <Card>
//           <p className="text-center text-gray-500 py-12">
//             No delivery requests pending at this time.
//           </p>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default DepotDelivery;


import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetGroupedDepotRequestsQuery,
  useUpdateDepotRequestStatusMutation,
} from "../../redux/features/depot/depotStockApi";
import Card from "../../component/common/Card";
import Button from "../../component/common/Button";
import Loader from "../../component/Loader";

const DepotDelivery = () => {
  const { data, isLoading, refetch } = useGetGroupedDepotRequestsQuery(
    "requested"
  );
  const [updateStatus, { isLoading: isSubmitting }] =
    useUpdateDepotRequestStatusMutation();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dateOpen, setDateOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);

  const dateRef = useRef();
  const productRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dateRef.current && !dateRef.current.contains(e.target))
        setDateOpen(false);
      if (productRef.current && !productRef.current.contains(e.target))
        setProductOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const groupedData = data?.data || {};
  const dates = Object.keys(groupedData);
  const productsForDate = selectedDate ? groupedData[selectedDate] || [] : [];

  useEffect(() => {
    if (productsForDate.length > 0) {
      setSelectedProduct(productsForDate[0]);
    } else {
      setSelectedProduct(null);
    }
  }, [selectedDate, data]);

  const handleApprove = async () => {
    if (!selectedProduct) return toast.error("Please select a product");

    const confirm = window.confirm(
      `Are you sure you want to approve "${selectedProduct.productName}"?`
    );
    if (!confirm) return;

    try {
      await updateStatus({
        id: selectedProduct.requestId,
        status: "accepted",
      }).unwrap();

      toast.success(`${selectedProduct.productName} approved successfully!`);
      setSelectedProduct(null);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve product");
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white text-gray-500 h-12 flex items-center px-6">
              <h2 className="text-base font-bold">
                NPL / Admin / Purchase Order
              </h2>
            </div>
          </div>
          <div className="text-sm text-neutral-500">Total Dates: {dates.length}</div>
        </div>
      </Card>

      {/* Selection Cards */}
      <Card className="mb-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Date Selector */}
          <div ref={dateRef} className="relative">
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Select Date
            </label>
            <button
              onClick={() => setDateOpen(!dateOpen)}
              className="w-full border border-gray-300 rounded-lg p-3 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
            >
              <span className="text-gray-700">
                {selectedDate
                  ? new Date(selectedDate).toLocaleDateString()
                  : "-- Select a date --"}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-600 transition-transform ${dateOpen ? "rotate-180" : ""
                  }`}
              />
            </button>
            {dateOpen && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto mt-2">
                {dates.map((date) => (
                  <li
                    key={date}
                    className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 transition-colors"
                    onClick={() => {
                      setSelectedDate(date);
                      setDateOpen(false);
                    }}
                  >
                    {new Date(date).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Product Selector */}
          <div ref={productRef} className="relative">
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Select Product
            </label>
            <button
              onClick={() =>
                productsForDate.length > 0 && setProductOpen(!productOpen)
              }
              disabled={productsForDate.length === 0}
              className="w-full border border-gray-300 rounded-lg p-3 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-gray-700">
                {selectedProduct ? selectedProduct.productName : "-- Select a product --"}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-600 transition-transform ${productOpen ? "rotate-180" : ""
                  }`}
              />
            </button>
            {productOpen && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto mt-2">
                {productsForDate.map((product) => (
                  <li
                    key={product.requestId}
                    className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 transition-colors"
                    onClick={() => {
                      setSelectedProduct(product);
                      setProductOpen(false);
                    }}
                  >
                    {product.productName}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Card>

      {/* Product Details */}
      {/* Product Details */}
      {selectedProduct && (
        <Card title="Product Details" subtitle={selectedProduct.productName}>
          {/* Main Info */}
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Pack Size</p>
              <p className="text-lg font-semibold text-gray-900">{selectedProduct.packSize || "-"}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700 mb-1">Requested Quantity</p>
              <p className="text-lg font-semibold text-blue-600">{selectedProduct.requestedQuantity || 0}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-700 mb-1">Warehouse Quantity</p>
              <p className="text-lg font-semibold text-green-600">{selectedProduct.warehouseQuantity || 0}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-orange-700 mb-1">Depot Quantity</p>
              <p className="text-lg font-semibold text-orange-600">{selectedProduct.depotQuantity || 0}</p>
            </div>
          </div>

          {/* Batches Table */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Warehouse Batches */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Warehouse Batches</h3>
              {selectedProduct.warehouseBatches && selectedProduct.warehouseBatches.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-gray-200 rounded-lg">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-3 py-2 text-left">Batch</th>
                        <th className="px-3 py-2 text-left">Expire</th>
                        <th className="px-3 py-2 text-right">Total Qty</th>
                        <th className="px-3 py-2 text-right">Requested</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProduct.warehouseBatches.map((batch) => (
                        <tr key={batch.warehouseProductId} className="border-t border-gray-200 hover:bg-blue-50">
                          <td className="px-3 py-2">{batch.batch}</td>
                          <td className="px-3 py-2">{new Date(batch.expireDate).toLocaleDateString()}</td>
                          <td className="px-3 py-2 text-right">{batch.totalQuantity}</td>
                          <td className="px-3 py-2 text-right">{batch.requestedQuantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No warehouse batches</p>
              )}
            </div>

            {/* Depot Batches */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Depot Batches</h3>
              {selectedProduct.depotBatches && selectedProduct.depotBatches.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-gray-200 rounded-lg">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-3 py-2 text-left">Batch</th>
                        <th className="px-3 py-2 text-left">Expire</th>
                        <th className="px-3 py-2 text-right">Total Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProduct.depotBatches.map((batch) => (
                        <tr key={batch.depotProductId} className="border-t border-gray-200 hover:bg-orange-50">
                          <td className="px-3 py-2">{batch.batch}</td>
                          <td className="px-3 py-2">{new Date(batch.expireDate).toLocaleDateString()}</td>
                          <td className="px-3 py-2 text-right">{batch.totalQuantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No depot batches</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setSelectedProduct(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleApprove} disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Approve & Deliver"}
            </Button>
          </div>
        </Card>
      )}

      {dates.length === 0 && (
        <Card>
          <p className="text-center text-gray-500 py-12">
            No delivery requests pending at this time.
          </p>
        </Card>
      )}
    </div>
  );
};

export default DepotDelivery;