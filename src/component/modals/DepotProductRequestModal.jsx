// import React, { useState, useRef, useEffect } from "react";
// import { FaTimes } from "react-icons/fa";
// import toast from "react-hot-toast";

// import {
//   useGetBrandsQuery,
//   useGetProductsByBrandQuery,
// } from "../../redux/features/products/productsApi";

// import {
//   useSendProductRequestMutation,
//   useGetDepotProductStockCountQuery,
// } from "../../redux/features/depot/depotStockApi";

// const DepotProductRequestModal = ({ isOpen, onClose }) => {
//   // ---------------- API ----------------
//   const { data: brands = [], isLoading: brandsLoading } = useGetBrandsQuery();
//   const [selectedBrand, setSelectedBrand] = useState("");

//   const { data: productsData = {}, isLoading: productsLoading } =
//     useGetProductsByBrandQuery(selectedBrand, { skip: !selectedBrand });

//   const products = productsData.products || [];

//   const [sendProductRequest, { isLoading: isSending }] =
//     useSendProductRequestMutation();

//   // ---------------- STATES ----------------
//   const [brandOpen, setBrandOpen] = useState(false);
//   const [productOpen, setProductOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [requestQty, setRequestQty] = useState("");
//   const [submitted, setSubmitted] = useState(false); // ✅ lock UI after submit

//   // Stock info
//   const { data: stockData, refetch } = useGetDepotProductStockCountQuery(
//     selectedProduct?._id,
//     { skip: !selectedProduct }
//   );

//   const depotStock = stockData?.totalDepotQuantity || 0;
//   const previouslyRequested = stockData?.totalPendingQuantity || 0;

//   const brandRef = useRef(null);
//   const productRef = useRef(null);

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handler = (e) => {
//       if (brandRef.current && !brandRef.current.contains(e.target))
//         setBrandOpen(false);
//       if (productRef.current && !productRef.current.contains(e.target))
//         setProductOpen(false);
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   // Refetch stock when product changes
//   useEffect(() => {
//     if (selectedProduct) refetch();
//   }, [selectedProduct, refetch]);

//   if (!isOpen) return null;

//   // ---------------- SUBMIT ----------------
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedProduct || !requestQty) return;

//     const payload = {
//       requestedBy: "Depot A",
//       productId: selectedProduct._id,
//       quantity: Number(requestQty),
//     };

//     try {
//       await sendProductRequest(payload).unwrap();

//       // ✅ Success Toast
//       toast.success("✅ Product request submitted successfully!", {
//         duration: 2500,
//       });

//       // Lock UI
//       setSubmitted(true);
//       setRequestQty("");

//       // Smooth reload after toast
//       setTimeout(() => {
//         window.location.reload();
//       }, 1500);

//     } catch (err) {
//       console.error("REQUEST ERROR ❌", err);
//       toast.error(err?.data?.message || "Failed to submit request");
//     }
//   };

//   // Disable submit if pending exists
//   const disableSubmit = previouslyRequested > 0 || submitted;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//       <div className="bg-white w-full max-w-xl rounded-xl shadow-xl 
//                       animate-[scaleIn_0.2s_ease-out]">

//         {/* HEADER */}
//         <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50 rounded-t-xl">
//           <h2 className="text-lg font-semibold">Depot Product Request</h2>
//           <button onClick={onClose} className="text-gray-600 hover:text-red-500">
//             <FaTimes size={18} />
//           </button>
//         </div>

//         {/* BODY */}
//         <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">

//           {/* Requested By */}
//           <div>
//             <label className="text-sm font-medium">Requested By</label>
//             <input
//               value="Depot A"
//               readOnly
//               className="w-full border rounded-md p-2 bg-gray-100"
//             />
//           </div>

//           {/* BRAND DROPDOWN */}
//           <div ref={brandRef} className="relative">
//             <label className="text-sm font-medium">Brand</label>
//             <input
//               readOnly
//               value={selectedBrand}
//               placeholder="Select Brand"
//               onClick={() => setBrandOpen(!brandOpen)}
//               className="w-full border rounded-md p-2 cursor-pointer bg-white"
//             />

//             {brandOpen && (
//               <ul className="absolute z-20 w-full bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto mt-1">
//                 {brandsLoading ? (
//                   <li className="p-2 text-gray-400">Loading...</li>
//                 ) : (
//                   brands.map((b) => (
//                     <li
//                       key={b}
//                       className="p-2 hover:bg-blue-100 cursor-pointer"
//                       onClick={() => {
//                         setSelectedBrand(b);
//                         setSelectedProduct(null);
//                         setBrandOpen(false);
//                       }}
//                     >
//                       {b}
//                     </li>
//                   ))
//                 )}
//               </ul>
//             )}
//           </div>

//           {/* PRODUCT DROPDOWN */}
//           <div ref={productRef} className="relative">
//             <label className="text-sm font-medium">Product</label>
//             <input
//               readOnly
//               value={selectedProduct?.productName || ""}
//               placeholder="Select Product"
//               disabled={!selectedBrand}
//               onClick={() => selectedBrand && setProductOpen(!productOpen)}
//               className={`w-full border rounded-md p-2 cursor-pointer ${
//                 !selectedBrand && "bg-gray-100"
//               }`}
//             />

//             {productOpen && selectedBrand && (
//               <ul className="absolute z-20 w-full bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto mt-1">
//                 {productsLoading ? (
//                   <li className="p-2 text-gray-400">Loading...</li>
//                 ) : (
//                   products.map((p) => (
//                     <li
//                       key={p._id}
//                       className="p-2 hover:bg-blue-100 cursor-pointer"
//                       onClick={() => {
//                         setSelectedProduct(p);
//                         setProductOpen(false);
//                       }}
//                     >
//                       {p.productName}
//                     </li>
//                   ))
//                 )}
//               </ul>
//             )}
//           </div>

//           {/* STOCK INFO */}
//           {selectedProduct && (
//             <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border">
//               <div className="text-center">
//                 <p className="text-sm text-green-700">Available in Depot</p>
//                 <p className="text-2xl font-bold">{depotStock}</p>
//               </div>
//               <div className="text-center">
//                 <p className="text-sm text-red-600">Previously Requested</p>
//                 <p className="text-2xl font-bold">{previouslyRequested}</p>
//               </div>
//             </div>
//           )}

//           {/* REQUEST QTY */}
//           <div>
//             <label className="text-sm font-medium">Request Quantity</label>
//             <input
//               type="number"
//               min={1}
//               max={depotStock}
//               value={requestQty}
//               onChange={(e) => setRequestQty(e.target.value)}
//               disabled={!selectedProduct || disableSubmit}
//               className="w-full border rounded-md p-2"
//             />
//           </div>

//           {/* WARNING */}
//           {previouslyRequested > 0 && (
//             <p className="text-sm text-red-600 font-medium">
//               ⚠ Request already pending. Cannot submit again.
//             </p>
//           )}

//           {submitted && (
//             <p className="text-sm text-green-600 font-medium">
//               ✅ Request submitted successfully. Reloading...
//             </p>
//           )}

//           {/* SUBMIT BUTTON */}
//           <button
//             type="submit"
//             disabled={!selectedProduct || !requestQty || disableSubmit || isSending}
//             className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 
//                        text-white font-semibold py-2 rounded-md transition"
//           >
//             {isSending ? "Sending..." : submitted ? "Submitted" : "Submit Request"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default DepotProductRequestModal;





// src/components/DepotProductRequestModal.jsx
// import React, { useState, useRef, useEffect } from "react";
// import { FaTimes } from "react-icons/fa";
// import toast from "react-hot-toast";

// import { useGetBrandsQuery, useGetProductsByBrandQuery } from "../../redux/features/products/productsApi";
// import { useSendProductRequestMutation, useGetDepotProductStockCountQuery } from "../../redux/features/depot/depotStockApi";
// import { useGetDepotsQuery } from "../../redux/features/depot/depotAPI";


// const DepotProductRequestModal = ({ isOpen, onClose }) => {
//   // ---------------- API ----------------
//   const { data: brands = [], isLoading: brandsLoading } = useGetBrandsQuery();
//   const [selectedBrand, setSelectedBrand] = useState("");

//   const { data: productsData = {}, isLoading: productsLoading } = useGetProductsByBrandQuery(selectedBrand, { skip: !selectedBrand });
//   const products = productsData.products || [];
//   const { data: depotsResponse, isLoading: depotsLoading } = useGetDepotsQuery();
//   const depots = depotsResponse?.data || []; // <-- ensure it's always an array
//   const [selectedDepot, setSelectedDepot] = useState(null);

//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [requestQty, setRequestQty] = useState("");
//   const [submitted, setSubmitted] = useState(false);

//   const [sendProductRequest, { isLoading: isSending }] = useSendProductRequestMutation();

//   // Stock info
//   const { data: stockData, refetch } = useGetDepotProductStockCountQuery(selectedProduct?._id, { skip: !selectedProduct });
//   const depotStock = stockData?.totalDepotQuantity || 0;
//   const previouslyRequested = stockData?.totalPendingQuantity || 0;

//   const brandRef = useRef(null);
//   const productRef = useRef(null);
//   const depotRef = useRef(null);

//   const [brandOpen, setBrandOpen] = useState(false);
//   const [productOpen, setProductOpen] = useState(false);
//   const [depotOpen, setDepotOpen] = useState(false);

//   // ---------------- EFFECTS ----------------
//   useEffect(() => {
//     const handler = (e) => {
//       if (brandRef.current && !brandRef.current.contains(e.target)) setBrandOpen(false);
//       if (productRef.current && !productRef.current.contains(e.target)) setProductOpen(false);
//       if (depotRef.current && !depotRef.current.contains(e.target)) setDepotOpen(false);
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   useEffect(() => {
//     if (selectedProduct) refetch();
//   }, [selectedProduct, refetch]);

//   if (!isOpen) return null;

//   const disableSubmit = previouslyRequested > 0 || submitted;

//   // ---------------- SUBMIT ----------------
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedDepot || !selectedProduct || !requestQty) return;

//     const payload = {
//       depotId: selectedDepot._id,
//       productId: selectedProduct._id,
//       quantity: Number(requestQty),
//     };

//     try {
//       await sendProductRequest(payload).unwrap();
//       toast.success("✅ Product request submitted successfully!", { duration: 2500 });
//       setSubmitted(true);
//       setRequestQty("");
//       setTimeout(() => window.location.reload(), 1500);
//     } catch (err) {
//       console.error("REQUEST ERROR ❌", err);
//       toast.error(err?.data?.message || "Failed to submit request");
//     }
//   };

//   // ---------------- RENDER ----------------
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//       <div className="bg-white w-full max-w-xl rounded-xl shadow-xl animate-[scaleIn_0.2s_ease-out]">

//         {/* HEADER */}
//         <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50 rounded-t-xl">
//           <h2 className="text-lg font-semibold">Depot Product Request</h2>
//           <button onClick={onClose} className="text-gray-600 hover:text-red-500">
//             <FaTimes size={18} />
//           </button>
//         </div>

//         {/* BODY */}
//         <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">

//           {/* DEPOT DROPDOWN */}
//           <div ref={depotRef} className="relative">
//             <label className="text-sm font-medium">Depot</label>
//             <input
//               readOnly
//               value={selectedDepot?.name || ""}
//               placeholder="Select Depot"
//               onClick={() => setDepotOpen(!depotOpen)}
//               className="w-full border rounded-md p-2 cursor-pointer bg-white"
//             />
//             {depotOpen && (
//               <ul className="absolute z-20 w-full bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto mt-1">
//                 {depotsLoading ? (
//                   <li className="p-2 text-gray-400">Loading...</li>
//                 ) : (
//                   depots.map((d) => (
//                     <li
//                       key={d._id}
//                       className="p-2 hover:bg-blue-100 cursor-pointer"
//                       onClick={() => {
//                         setSelectedDepot(d);
//                         setDepotOpen(false);
//                       }}
//                     >
//                       {d.name} {d.manager ? `(${d.manager.name})` : "(No Manager)"}
//                     </li>
//                   ))
//                 )}
//               </ul>
//             )}
//           </div>

//           {/* BRAND DROPDOWN */}
//           <div ref={brandRef} className="relative">
//             <label className="text-sm font-medium">Brand</label>
//             <input
//               readOnly
//               value={selectedBrand}
//               placeholder="Select Brand"
//               onClick={() => setBrandOpen(!brandOpen)}
//               className="w-full border rounded-md p-2 cursor-pointer bg-white"
//             />
//             {brandOpen && (
//               <ul className="absolute z-20 w-full bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto mt-1">
//                 {brandsLoading ? (
//                   <li className="p-2 text-gray-400">Loading...</li>
//                 ) : (
//                   brands.map((b) => (
//                     <li
//                       key={b}
//                       className="p-2 hover:bg-blue-100 cursor-pointer"
//                       onClick={() => {
//                         setSelectedBrand(b);
//                         setSelectedProduct(null);
//                         setBrandOpen(false);
//                       }}
//                     >
//                       {b}
//                     </li>
//                   ))
//                 )}
//               </ul>
//             )}
//           </div>

//           {/* PRODUCT DROPDOWN */}
//           <div ref={productRef} className="relative">
//             <label className="text-sm font-medium">Product</label>
//             <input
//               readOnly
//               value={selectedProduct?.productName || ""}
//               placeholder="Select Product"
//               disabled={!selectedBrand}
//               onClick={() => selectedBrand && setProductOpen(!productOpen)}
//               className={`w-full border rounded-md p-2 cursor-pointer ${!selectedBrand && "bg-gray-100"}`}
//             />
//             {productOpen && selectedBrand && (
//               <ul className="absolute z-20 w-full bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto mt-1">
//                 {productsLoading ? (
//                   <li className="p-2 text-gray-400">Loading...</li>
//                 ) : (
//                   products.map((p) => (
//                     <li
//                       key={p._id}
//                       className="p-2 hover:bg-blue-100 cursor-pointer"
//                       onClick={() => {
//                         setSelectedProduct(p);
//                         setProductOpen(false);
//                       }}
//                     >
//                       {p.productName}
//                     </li>
//                   ))
//                 )}
//               </ul>
//             )}
//           </div>

//           {/* STOCK INFO */}
//           {selectedProduct && (
//             <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border">
//               <div className="text-center">
//                 <p className="text-sm text-green-700">Available in depot</p>
//                 <p className="text-2xl font-bold">{depotStock}</p>
//               </div>
//               <div className="text-center">
//                 <p className="text-sm text-red-600">Previously Requested</p>
//                 <p className="text-2xl font-bold">{previouslyRequested}</p>
//               </div>
//             </div>
//           )}

//           {/* REQUEST QTY */}
//           <div>
//             <label className="text-sm font-medium">Request Quantity</label>
//             <input
//               type="number"
//               min={1}
//               max={depotStock}
//               value={requestQty}
//               onChange={(e) => setRequestQty(e.target.value)}
//               disabled={!selectedProduct || disableSubmit}
//               className="w-full border rounded-md p-2"
//             />
//           </div>

//           {/* WARNINGS */}
//           {previouslyRequested > 0 && (
//             <p className="text-sm text-red-600 font-medium">
//               ⚠ Request already pending. Cannot submit again.
//             </p>
//           )}
//           {submitted && (
//             <p className="text-sm text-green-600 font-medium">
//               ✅ Request submitted successfully. Reloading...
//             </p>
//           )}

//           {/* SUBMIT BUTTON */}
//           <button
//             type="submit"
//             disabled={!selectedDepot || !selectedProduct || !requestQty || disableSubmit || isSending}
//             className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-md transition"
//           >
//             {isSending ? "Sending..." : submitted ? "Submitted" : "Submit Request"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default DepotProductRequestModal;


import React, { useState, useRef, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";

import { useGetBrandsQuery, useGetProductsByBrandQuery } from "../../redux/features/products/productsApi";
import { useSendProductRequestMutation, useGetDepotProductStockCountQuery } from "../../redux/features/depot/depotStockApi";
import { useGetDepotsQuery } from "../../redux/features/depot/depotAPI";

const DepotProductRequestModal = ({ isOpen, onClose }) => {
  // ---------------- API ----------------
  const { data: brands = [], isLoading: brandsLoading } = useGetBrandsQuery();
  const [selectedBrand, setSelectedBrand] = useState("");

  const { data: productsData = {}, isLoading: productsLoading } = useGetProductsByBrandQuery(selectedBrand, { skip: !selectedBrand });
  const products = productsData.products || [];

  const { data: depotsResponse, isLoading: depotsLoading } = useGetDepotsQuery();
  const depots = depotsResponse?.data || [];
  const [selectedDepot, setSelectedDepot] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [requestQty, setRequestQty] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [sendProductRequest, { isLoading: isSending }] = useSendProductRequestMutation();

  // Stock info
  const { data: stockData, refetch } = useGetDepotProductStockCountQuery(selectedProduct?._id, { skip: !selectedProduct });
  const depotStock = stockData?.totalDepotQuantity || 0;
  const previouslyRequested = stockData?.totalPendingQuantity || 0;

  const brandRef = useRef(null);
  const productRef = useRef(null);
  const depotRef = useRef(null);

  const [brandOpen, setBrandOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [depotOpen, setDepotOpen] = useState(false);

  // ---------------- EFFECTS ----------------
  useEffect(() => {
    const handler = (e) => {
      if (brandRef.current && !brandRef.current.contains(e.target)) setBrandOpen(false);
      if (productRef.current && !productRef.current.contains(e.target)) setProductOpen(false);
      if (depotRef.current && !depotRef.current.contains(e.target)) setDepotOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (selectedProduct) refetch();
  }, [selectedProduct, refetch]);

  if (!isOpen) return null;

  // Disable submit if pending request exists
  const disableSubmit = previouslyRequested > 0;

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDepot || !selectedProduct || !requestQty || disableSubmit) return;

    const payload = {
      depotId: selectedDepot._id,
      productId: selectedProduct._id,
      quantity: Number(requestQty),
    };

    try {
      await sendProductRequest(payload).unwrap();
      toast.success("✅ Product request submitted successfully!", { duration: 2500 });
      setSubmitted(true);
      setRequestQty("");
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      console.error("REQUEST ERROR ❌", err);
      toast.error(err?.data?.message || "Failed to submit request");
    }
  };

  // ---------------- RENDER ----------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-xl animate-[scaleIn_0.2s_ease-out]">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50 rounded-t-xl">
          <h2 className="text-lg font-semibold">Depot Product Request</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-red-500">
            <FaTimes size={18} />
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">

          {/* DEPOT DROPDOWN */}
          <div ref={depotRef} className="relative">
            <label className="text-sm font-medium">Depot</label>
            <input
              readOnly
              value={selectedDepot?.name || ""}
              placeholder="Select Depot"
              onClick={() => setDepotOpen(!depotOpen)}
              className="w-full border rounded-md p-2 cursor-pointer bg-white"
            />
            {depotOpen && (
              <ul className="absolute z-20 w-full bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto mt-1">
                {depotsLoading ? (
                  <li className="p-2 text-gray-400">Loading...</li>
                ) : (
                  depots.map((d) => (
                    <li
                      key={d._id}
                      className="p-2 hover:bg-blue-100 cursor-pointer"
                      onClick={() => {
                        setSelectedDepot(d);
                        setDepotOpen(false);
                      }}
                    >
                      {d.name} {d.manager ? `(${d.manager.name})` : "(No Manager)"}
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>

          {/* BRAND DROPDOWN */}
          <div ref={brandRef} className="relative">
            <label className="text-sm font-medium">Brand</label>
            <input
              readOnly
              value={selectedBrand}
              placeholder="Select Brand"
              onClick={() => setBrandOpen(!brandOpen)}
              className="w-full border rounded-md p-2 cursor-pointer bg-white"
            />
            {brandOpen && (
              <ul className="absolute z-20 w-full bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto mt-1">
                {brandsLoading ? (
                  <li className="p-2 text-gray-400">Loading...</li>
                ) : (
                  brands.map((b) => (
                    <li
                      key={b}
                      className="p-2 hover:bg-blue-100 cursor-pointer"
                      onClick={() => {
                        setSelectedBrand(b);
                        setSelectedProduct(null);
                        setBrandOpen(false);
                      }}
                    >
                      {b}
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>

          {/* PRODUCT DROPDOWN */}
          <div ref={productRef} className="relative">
            <label className="text-sm font-medium">Product</label>
            <input
              readOnly
              value={selectedProduct?.productName || ""}
              placeholder="Select Product"
              disabled={!selectedBrand}
              onClick={() => selectedBrand && setProductOpen(!productOpen)}
              className={`w-full border rounded-md p-2 cursor-pointer ${!selectedBrand && "bg-gray-100"}`}
            />
            {productOpen && selectedBrand && (
              <ul className="absolute z-20 w-full bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto mt-1">
                {productsLoading ? (
                  <li className="p-2 text-gray-400">Loading...</li>
                ) : (
                  products.map((p) => (
                    <li
                      key={p._id}
                      className="p-2 hover:bg-blue-100 cursor-pointer"
                      onClick={() => {
                        setSelectedProduct(p);
                        setProductOpen(false);
                      }}
                    >
                      {p.productName}
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>

          {/* STOCK INFO */}
          {selectedProduct && (
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border">
              <div className="text-center">
                <p className="text-sm text-green-700">Available in depot</p>
                <p className="text-2xl font-bold">{depotStock}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-red-600">Previously Requested</p>
                <p className="text-2xl font-bold">{previouslyRequested}</p>
              </div>
            </div>
          )}

          {/* REQUEST QTY */}
          <div>
            <label className="text-sm font-medium">Request Quantity</label>
            <input
              type="number"
              min={1}
              value={requestQty}
              onChange={(e) => setRequestQty(e.target.value)}
              disabled={!selectedProduct || disableSubmit}
              className="w-full border rounded-md p-2"
            />
          </div>

          {/* WARNINGS */}
          {previouslyRequested > 0 && (
            <p className="text-sm text-red-600 font-medium">
              ⚠ Request already pending. Cannot submit again.
            </p>
          )}
          {submitted && (
            <p className="text-sm text-green-600 font-medium">
              ✅ Request submitted successfully. Reloading...
            </p>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={!selectedDepot || !selectedProduct || !requestQty || disableSubmit || isSending}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-md transition"
          >
            {isSending ? "Sending..." : submitted ? "Submitted" : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DepotProductRequestModal;