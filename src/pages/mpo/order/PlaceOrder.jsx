// // import React, { useState, useEffect, useRef } from "react";
// // import { useAuth } from "../../../provider/AuthProvider";
// // import ProductSelectModal from "../../../component/modals/ProductSelectModal";
// // import Loader from "../../../component/Loader";
// // import {
// //     useGetBrandsQuery,
// //     useGetProductsByBrandQuery,
// // } from "../../../redux/features/products/productsApi";

// // import { skipToken } from "@reduxjs/toolkit/query/react";
// // import { useGetCustomersByStatusQuery } from "../../../redux/features/customer/customerApi";
// // import Select from "react-select";

// // const PlaceOrder = () => {
// //     const { userInfo, loading: authLoading } = useAuth();

// //     const [modalOpen, setModalOpen] = useState(false);
// //     const [products, setProducts] = useState([]);
// //     const [formData, setFormData] = useState({
// //         customerName: "",
// //         customerId: "",
// //         payMode: "",
// //         brand: "",
// //         orderedByName: "",
// //         orderedByEmail: "",
// //     });
// //     const [selectedAddress, setSelectedAddress] = useState(""); // 👈 store selected address

// //     const [brandOpen, setBrandOpen] = useState(false);
// //     const [productOpen, setProductOpen] = useState(false);

// //     const brandRef = useRef();
// //     const productRef = useRef();

// //     // Fetch brands
// //     const { data: brandsData = [], isLoading: brandsLoading } = useGetBrandsQuery();
// //     const brands = brandsData; // ['BIONIKE', 'NOIDERMA']

// //     // Fetch products by selected brand
// //     const { data: productsData = {}, isLoading: productsLoading } = useGetProductsByBrandQuery(
// //         formData.brand || skipToken
// //     );
// //     const apiProducts = productsData.products || [];

// //     // Fetch active customers
// //     const { data: customersData = {}, isLoading: customersLoading } = useGetCustomersByStatusQuery(
// //         "active"
// //     );
// //     const customers = customersData.data || [];

// //     // Update user info
// //     useEffect(() => {
// //         if (userInfo) {
// //             setFormData((prev) => ({
// //                 ...prev,
// //                 orderedByName: userInfo.name || "",
// //                 orderedByEmail: userInfo.email || "",
// //             }));
// //         }
// //     }, [userInfo]);

// //     // Close dropdowns on outside click
// //     useEffect(() => {
// //         const handleClickOutside = (e) => {
// //             if (brandRef.current && !brandRef.current.contains(e.target)) setBrandOpen(false);
// //             if (productRef.current && !productRef.current.contains(e.target)) setProductOpen(false);
// //         };
// //         document.addEventListener("mousedown", handleClickOutside);
// //         return () => document.removeEventListener("mousedown", handleClickOutside);
// //     }, []);

// //     const handleChange = (e) => {
// //         const { name, value } = e.target;
// //         setFormData((prev) => ({ ...prev, [name]: value }));
// //     };

// //     const handleCustomerChange = (e) => {
// //         const customerId = e.target.value;
// //         const customer = customers.find((c) => c._id === customerId);
// //         if (customer) {
// //             setFormData((prev) => ({
// //                 ...prev,
// //                 customerName: `${customer.customerName} - ${customer.customerId}`,
// //                 customerId: customer._id,
// //                 payMode: "", // reset paymode
// //             }));
// //             setSelectedAddress(customer.address || "");
// //         } else {
// //             setFormData((prev) => ({ ...prev, customerName: "", customerId: "", payMode: "" }));
// //             setSelectedAddress("");
// //         }
// //     };

// //     const handleAddProduct = (data) => {
// //         setProducts((prev) => [...prev, { ...data, key: Date.now() }]);
// //     };

// //     const removeProduct = (key) => {
// //         setProducts(products.filter((p) => p.key !== key));
// //     };

// //     const handleProductSelect = (prod) => {
// //         setFormData((prev) => ({
// //             ...prev,
// //             brand: prod.brand,
// //             productId: prod._id,
// //             productName: prod.productName,
// //             productShortCode: prod.productShortCode,
// //             packSize: prod.packSize,
// //             category: prod.category,
// //         }));
// //         setProductOpen(false);
// //     };

// //     // Totals
// //     const totalAmount = products.reduce((acc, p) => acc + p.price * p.quantity, 0);
    
// //     const discount = totalAmount * 0.05;
// //     const grandTotal = totalAmount - discount;

// //     const handleSubmit = (e) => {
// //         e.preventDefault();
// //         if (!products.length) return alert("Add at least one product");
// //         if (!formData.customerId) return alert("Select a customer");

// //         const payload = { ...formData, products, totalAmount, discount, grandTotal };
// //         console.log("ORDER DATA:", payload);
// //         alert(`Order placed successfully! Grand Total: ৳${grandTotal.toFixed(2)}`);

// //         setFormData({
// //             customerName: "",
// //             customerId: "",
// //             payMode: "",
// //             brand: "",
// //             orderedByName: userInfo?.name || "",
// //             orderedByEmail: userInfo?.email || "",
// //         });
// //         setProducts([]);
// //         setSelectedAddress("");
// //     };

// //     if (authLoading || brandsLoading || customersLoading) return <Loader />;

// //     return (
// //         <div className="w-full mx-auto p-6 space-y-6">
// //             {/* Header */}
// //             <div className="bg-white text-gray-500 h-12 flex items-center px-6">
// //                 <h2 className="text-base font-bold">NPL / Admin / Purchase Order</h2>
// //             </div>

// //             {/* Customer Info */}
// //         {/* Customer Info */}
// // <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-lg shadow-md p-6">
// //   {/* Customer dropdown */}
// //   <div className="flex flex-col mb-2">
// //     <label className="text-sm font-medium text-gray-700 mb-1">Customer</label>
// //     <Select
// //       options={customers.map((c) => ({
// //         value: c._id,
// //         label: (
// //           <div className="flex flex-col">
// //             <span>{`${c.customerName} - ${c.customerId}`}</span>
// //             {c.address && <span className="text-gray-500 text-xs">{c.address}</span>}
// //           </div>
// //         ),
// //       }))}
// //       value={
// //         formData.customerId
// //           ? {
// //               value: formData.customerId,
// //               label: (
// //                 <div className="flex flex-col">
// //                   <span>{formData.customerName}</span>
// //                   {selectedAddress && <span className="text-gray-500 text-xs">{selectedAddress}</span>}
// //                 </div>
// //               ),
// //             }
// //           : null
// //       }
// //       onChange={(option) => {
// //         const customer = customers.find((c) => c._id === option.value);
// //         if (customer) {
// //           setFormData((prev) => ({
// //             ...prev,
// //             customerName: `${customer.customerName} - ${customer.customerId}`,
// //             customerId: customer._id,
// //             payMode: "",
// //           }));
// //           setSelectedAddress(customer.address || "");
// //         }
// //       }}
// //       placeholder="Select Customer"
// //       isClearable
// //       styles={{
// //         control: (base) => ({ ...base, minHeight: "40px" }),
// //         menu: (base) => ({ ...base, zIndex: 50 }),
// //       }}
// //     />
// //   </div>

// //   {/* Payment Mode */}
// //   <SelectInput
// //     label="Payment Mode"
// //     name="payMode"
// //     value={formData.payMode}
// //     onChange={handleChange}
// //     options={
// //       formData.customerId
// //         ? customers.find((c) => c._id === formData.customerId)?.payMode || []
// //         : []
// //     }
// //     disabled={!formData.customerId}
// //   />

// //   {/* Brand dropdown */}
// //   <div ref={brandRef} className="relative">
// //     <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
// //     <input
// //       type="text"
// //       readOnly
// //       value={formData.brand}
// //       placeholder="Select brand"
// //       onClick={() => setBrandOpen((p) => !p)}
// //       className="w-full border border-gray-300 rounded p-2 cursor-pointer"
// //     />
// //     {brandOpen && (
// //       <ul className="absolute z-10 w-full bg-white border rounded shadow max-h-40 overflow-y-auto mt-1">
// //         {brands.map((brand) => (
// //           <li
// //             key={brand}
// //             className="p-2 hover:bg-blue-100 cursor-pointer"
// //             onClick={() => {
// //               setFormData((prev) => ({
// //                 ...prev,
// //                 brand,
// //                 productId: "",
// //                 productName: "",
// //                 productShortCode: "",
// //                 packSize: "",
// //               }));
// //               setBrandOpen(false);
// //             }}
// //           >
// //             {brand}
// //           </li>
// //         ))}
// //       </ul>
// //     )}
// //   </div>

// //   <Input label="Ordered By" value={formData.orderedByName} disabled />
// // </div>


// //             {/* Products Section */}
// //             <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
// //                 <div className="flex justify-between items-center">
// //                     <h3 className="text-lg font-semibold text-gray-700">Products</h3>
// //                     <button
// //                         onClick={() => setModalOpen(true)}
// //                         className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
// //                     >
// //                         + Add Products
// //                     </button>
// //                 </div>

// //                 <div className="overflow-x-auto border rounded-lg shadow-sm">
// //                     <table className="w-full border-collapse border border-gray-300 text-sm">
// //                         <thead className="bg-gray-100 sticky top-0 z-10 border-b border-gray-300">
// //                             <tr>
// //                                 <th className="p-3 text-left font-semibold text-gray-600 border-r border-gray-300">
// //                                     Product
// //                                 </th>
// //                                 <th className="p-3 text-center font-semibold text-gray-600 border-r border-gray-300">
// //                                     Quantity
// //                                 </th>
// //                                 <th className="p-3 text-center font-semibold text-gray-600 border-r border-gray-300">
// //                                     Price (৳)
// //                                 </th>
// //                                 <th className="p-3 text-center font-semibold text-gray-600">Action</th>
// //                             </tr>
// //                         </thead>
// //                         <tbody>
// //                             {products.length === 0 && (
// //                                 <tr>
// //                                     <td colSpan="4" className="p-4 text-center text-gray-400 border-t border-gray-300">
// //                                         No products added
// //                                     </td>
// //                                 </tr>
// //                             )}
// //                             {products.map((p) => (
// //                                 <tr key={p.key} className="hover:bg-blue-50 transition">
// //                                     <td className="p-3 border-b border-gray-300">{p.product}</td>
// //                                     <td className="p-3 text-center border-b border-gray-300">{p.quantity}</td>
// //                                     <td className="p-3 text-center border-b border-gray-300">
// //                                         ৳ {(p.price * p.quantity).toFixed(2)}
// //                                     </td>
// //                                     <td className="p-3 text-center border-b border-gray-300">
// //                                         <button
// //                                             onClick={() => removeProduct(p.key)}
// //                                             className="text-red-600 font-medium hover:underline"
// //                                         >
// //                                             Remove
// //                                         </button>
// //                                     </td>
// //                                 </tr>
// //                             ))}
// //                         </tbody>
// //                     </table>
// //                 </div>

// //                 {/* Totals */}
// //                 {products.length > 0 && (
// //                     <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 max-w-md mx-auto space-y-2">
// //                         <div className="flex justify-between text-gray-700">
// //                             <span>Total:</span>
// //                             <span>৳ {totalAmount.toFixed(2)}</span>
// //                         </div>
// //                         <div className="flex justify-between text-green-600">
// //                             <span>Discount (5%):</span>
// //                             <span>-৳ {discount.toFixed(2)}</span>
// //                         </div>
// //                         <div className="flex justify-between text-lg font-semibold text-gray-900">
// //                             <span>Grand Total:</span>
// //                             <span>৳ {grandTotal.toFixed(2)}</span>
// //                         </div>
// //                     </div>
// //                 )}

// //                 {/* Submit */}
// //                 <div className="flex justify-center mt-4">
// //                     <button
// //                         onClick={handleSubmit}
// //                         className="bg-[#0F213D] hover:bg-[#183461] text-white font-semibold px-8 py-3 rounded-lg transition"
// //                     >
// //                         🚀 Place Order
// //                     </button>
// //                 </div>
// //             </div>

// //             {/* Product Modal */}
// //             <ProductSelectModal
// //                 open={modalOpen}
// //                 onClose={() => setModalOpen(false)}
// //                 onAdd={handleAddProduct}
// //                 products={apiProducts} // API products for selected brand
// //                 loading={productsLoading}
// //             />
// //         </div>
// //     );
// // };

// // export default PlaceOrder;

// // // Input Components
// // const Input = ({ label, ...props }) => (
// //     <div className="flex flex-col mb-2">
// //         <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
// //         <input
// //             {...props}
// //             className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
// //         />
// //     </div>
// // );

// // const SelectInput = ({ label, options, ...props }) => (
// //     <div className="flex flex-col mb-2">
// //         <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
// //         <select
// //             {...props}
// //             className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
// //         >
// //             <option value="">Select {label}</option>
// //             {options.map((o) => (
// //                 <option key={o} value={o}>
// //                     {o}
// //                 </option>
// //             ))}
// //         </select>
// //     </div>
// // );


// import React, { useState, useEffect, useRef } from "react";
// import { useAuth } from "../../../provider/AuthProvider";
// import ProductSelectModal from "../../../component/modals/ProductSelectModal";
// import Loader from "../../../component/Loader";
// import {
//   useGetBrandsQuery,
//   useGetProductsByBrandQuery,
// } from "../../../redux/features/products/productsApi";
// import { useGetCustomersByStatusQuery } from "../../../redux/features/customer/customerApi";
// import { skipToken } from "@reduxjs/toolkit/query/react";
// import Select from "react-select";

// const PlaceOrder = () => {
//   const { userInfo, loading: authLoading } = useAuth();

//   const [modalOpen, setModalOpen] = useState(false);
//   const [products, setProducts] = useState([]);
//   const [formData, setFormData] = useState({
//     customerName: "",
//     customerId: "",
//     payMode: "",
//     brand: "",
//     orderedByName: "",
//     orderedByEmail: "",
//   });
//   const [selectedAddress, setSelectedAddress] = useState(""); // store selected address

//   const [brandOpen, setBrandOpen] = useState(false);
//   const [productOpen, setProductOpen] = useState(false);

//   const brandRef = useRef();
//   const productRef = useRef();

//   // Fetch brands
//   const { data: brandsData = [], isLoading: brandsLoading } = useGetBrandsQuery();
//   const brands = brandsData;

//   // Fetch products by selected brand
//   const { data: productsData = {}, isLoading: productsLoading } = useGetProductsByBrandQuery(
//     formData.brand || skipToken
//   );
//   const apiProducts = productsData.products || [];

//   // Fetch active customers
//   const { data: customersData = {}, isLoading: customersLoading } = useGetCustomersByStatusQuery(
//     "active"
//   );
//   const customers = customersData.data || [];

//   // Update user info
//   useEffect(() => {
//     if (userInfo) {
//       setFormData((prev) => ({
//         ...prev,
//         orderedByName: userInfo.name || "",
//         orderedByEmail: userInfo.email || "",
//       }));
//     }
//   }, [userInfo]);

//   // Close dropdowns on outside click
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (brandRef.current && !brandRef.current.contains(e.target)) setBrandOpen(false);
//       if (productRef.current && !productRef.current.contains(e.target)) setProductOpen(false);
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddProduct = (data) => {
//     setProducts((prev) => [...prev, { ...data, key: Date.now() }]);
//   };

//   const removeProduct = (key) => {
//     setProducts(products.filter((p) => p.key !== key));
//   };

//   const handleProductSelect = (prod) => {
//     setFormData((prev) => ({
//       ...prev,
//       brand: prod.brand,
//       productId: prod._id,
//       productName: prod.productName,
//       productShortCode: prod.productShortCode,
//       packSize: prod.packSize,
//       category: prod.category,
//     }));
//     setProductOpen(false);
//   };

//   // Get selected customer discount
//   const selectedCustomer = customers.find((c) => c._id === formData.customerId);
//   const discountPercent = selectedCustomer?.discount || 0; // from JSON
//   const discountDecimal = discountPercent / 100;

//   // Totals
//   const totalAmount = products.reduce((acc, p) => acc + p.price * p.quantity, 0);
//   const discount = totalAmount * discountDecimal;
//   const grandTotal = totalAmount - discount;

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!products.length) return alert("Add at least one product");
//     if (!formData.customerId) return alert("Select a customer");

//     const payload = { ...formData, products, totalAmount, discount, grandTotal };
//     console.log("ORDER DATA:", payload);
//     alert(`Order placed successfully! Grand Total: ৳${grandTotal.toFixed(2)}`);

//     // Reset form
//     setFormData({
//       customerName: "",
//       customerId: "",
//       payMode: "",
//       brand: "",
//       orderedByName: userInfo?.name || "",
//       orderedByEmail: userInfo?.email || "",
//     });
//     setProducts([]);
//     setSelectedAddress("");
//   };

//   if (authLoading || brandsLoading || customersLoading) return <Loader />;

//   return (
//     <div className="w-full mx-auto p-6 space-y-6">
//       {/* Header */}
//       <div className="bg-white text-gray-500 h-12 flex items-center px-6">
//         <h2 className="text-base font-bold">NPL / Admin / Purchase Order</h2>
//       </div>

//       {/* Customer Info */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-lg shadow-md p-6">
//         {/* Customer dropdown */}
//         <div className="flex flex-col mb-2">
//           <label className="text-sm font-medium text-gray-700 mb-1">Customer</label>
//           <Select
//             options={customers.map((c) => ({
//               value: c._id,
//               label: (
//                 <div className="flex flex-col">
//                   <span>{`${c.customerName} - ${c.customerId}`}</span>
//                   {c.address && <span className="text-gray-500 text-xs">{c.address}</span>}
//                 </div>
//               ),
//             }))}
//             value={
//               formData.customerId
//                 ? {
//                     value: formData.customerId,
//                     label: (
//                       <div className="flex flex-col">
//                         <span>{formData.customerName}</span>
//                         {selectedAddress && <span className="text-gray-500 text-xs">{selectedAddress}</span>}
//                       </div>
//                     ),
//                   }
//                 : null
//             }
//             onChange={(option) => {
//               const customer = customers.find((c) => c._id === option.value);
//               if (customer) {
//                 setFormData((prev) => ({
//                   ...prev,
//                   customerName: `${customer.customerName} - ${customer.customerId}`,
//                   customerId: customer._id,
//                   payMode: "",
//                 }));
//                 setSelectedAddress(customer.address || "");
//               } else {
//                 setFormData((prev) => ({ ...prev, customerName: "", customerId: "", payMode: "" }));
//                 setSelectedAddress("");
//               }
//             }}
//             placeholder="Select Customer"
//             isClearable
//             styles={{
//               control: (base) => ({ ...base, minHeight: "40px" }),
//               menu: (base) => ({ ...base, zIndex: 50 }),
//             }}
//           />
//         </div>

//         {/* Payment Mode */}
//         <SelectInput
//           label="Payment Mode"
//           name="payMode"
//           value={formData.payMode}
//           onChange={handleChange}
//           options={formData.customerId ? selectedCustomer?.payMode || [] : []}
//           disabled={!formData.customerId}
//         />

//         {/* Brand dropdown */}
//         <div ref={brandRef} className="relative">
//           <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
//           <input
//             type="text"
//             readOnly
//             value={formData.brand}
//             placeholder="Select brand"
//             onClick={() => setBrandOpen((p) => !p)}
//             className="w-full border border-gray-300 rounded p-2 cursor-pointer"
//           />
//           {brandOpen && (
//             <ul className="absolute z-10 w-full bg-white border rounded shadow max-h-40 overflow-y-auto mt-1">
//               {brands.map((brand) => (
//                 <li
//                   key={brand}
//                   className="p-2 hover:bg-blue-100 cursor-pointer"
//                   onClick={() => {
//                     setFormData((prev) => ({
//                       ...prev,
//                       brand,
//                       productId: "",
//                       productName: "",
//                       productShortCode: "",
//                       packSize: "",
//                     }));
//                     setBrandOpen(false);
//                   }}
//                 >
//                   {brand}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         <Input label="Ordered By" value={formData.orderedByName} disabled />
//       </div>

//       {/* Products Section */}
//       <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
//         <div className="flex justify-between items-center">
//           <h3 className="text-lg font-semibold text-gray-700">Products</h3>
//           <button
//             onClick={() => setModalOpen(true)}
//             className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
//           >
//             + Add Products
//           </button>
//         </div>

//         <div className="overflow-x-auto border rounded-lg shadow-sm">
//           <table className="w-full border-collapse border border-gray-300 text-sm">
//             <thead className="bg-gray-100 sticky top-0 z-10 border-b border-gray-300">
//               <tr>
//                 <th className="p-3 text-left font-semibold text-gray-600 border-r border-gray-300">Product</th>
//                 <th className="p-3 text-center font-semibold text-gray-600 border-r border-gray-300">Quantity</th>
//                 <th className="p-3 text-center font-semibold text-gray-600 border-r border-gray-300">Price (৳)</th>
//                 <th className="p-3 text-center font-semibold text-gray-600">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {products.length === 0 && (
//                 <tr>
//                   <td colSpan="4" className="p-4 text-center text-gray-400 border-t border-gray-300">
//                     No products added
//                   </td>
//                 </tr>
//               )}
//               {products.map((p) => (
//                 <tr key={p.key} className="hover:bg-blue-50 transition">
//                   <td className="p-3 border-b border-gray-300">{p.product}</td>
//                   <td className="p-3 text-center border-b border-gray-300">{p.quantity}</td>
//                   <td className="p-3 text-center border-b border-gray-300">
//                     ৳ {(p.price * p.quantity).toFixed(2)}
//                   </td>
//                   <td className="p-3 text-center border-b border-gray-300">
//                     <button
//                       onClick={() => removeProduct(p.key)}
//                       className="text-red-600 font-medium hover:underline"
//                     >
//                       Remove
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Totals */}
//         {products.length > 0 && (
//           <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 max-w-md mx-auto space-y-2">
//             <div className="flex justify-between text-gray-700">
//               <span>Total:</span>
//               <span>৳ {totalAmount.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between text-green-600">
//               <span>Discount ({discountPercent}%):</span>
//               <span>-৳ {discount.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between text-lg font-semibold text-gray-900">
//               <span>Grand Total:</span>
//               <span>৳ {grandTotal.toFixed(2)}</span>
//             </div>
//           </div>
//         )}

//         {/* Submit */}
//         <div className="flex justify-center mt-4">
//           <button
//             onClick={handleSubmit}
//             className="bg-[#0F213D] hover:bg-[#183461] text-white font-semibold px-8 py-3 rounded-lg transition"
//           >
//             🚀 Place Order
//           </button>
//         </div>
//       </div>

//       {/* Product Modal */}
//       <ProductSelectModal
//         open={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onAdd={handleAddProduct}
//         products={apiProducts} // API products for selected brand
//         loading={productsLoading}
//       />
//     </div>
//   );
// };

// export default PlaceOrder;

// // Input Components
// const Input = ({ label, ...props }) => (
//   <div className="flex flex-col mb-2">
//     <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
//     <input
//       {...props}
//       className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
//     />
//   </div>
// );

// const SelectInput = ({ label, options, ...props }) => (
//   <div className="flex flex-col mb-2">
//     <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
//     <select
//       {...props}
//       className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
//     >
//       <option value="">Select {label}</option>
//       {options.map((o) => (
//         <option key={o} value={o}>
//           {o}
//         </option>
//       ))}
//     </select>
//   </div>
// );



// src/pages/orders/PlaceOrder.jsx
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../provider/AuthProvider";
import ProductSelectModal from "../../../component/modals/ProductSelectModal";
import Loader from "../../../component/Loader";
import { useGetBrandsQuery, useGetProductsByBrandQuery } from "../../../redux/features/products/productsApi";
import { useGetCustomersByStatusQuery } from "../../../redux/features/customer/customerApi";
import { useCreateOrderMutation } from "../../../redux/features/orders/orderApi";
import { skipToken } from "@reduxjs/toolkit/query/react";
import Select from "react-select";

const PlaceOrder = () => {
  const { userInfo, loading: authLoading } = useAuth();
  const [createOrder, { isLoading: creating }] = useCreateOrderMutation();

  // =================== STATE ===================
  const [modalOpen, setModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    customerName: "",
    customerId: "",
    payMode: "",
    brand: "",
    orderedByName: "",
    orderedByEmail: "",
  });
  const [selectedAddress, setSelectedAddress] = useState("");

  const [brandOpen, setBrandOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);

  const brandRef = useRef();
  const productRef = useRef();

  // =================== API ===================
  const { data: brandsData = [], isLoading: brandsLoading } = useGetBrandsQuery();
  const brands = brandsData;

  const { data: productsData = {}, isLoading: productsLoading } = useGetProductsByBrandQuery(
    formData.brand || skipToken
  );
  const apiProducts = productsData.products || [];

  const { data: customersData = {}, isLoading: customersLoading } = useGetCustomersByStatusQuery("active");
  const customers = customersData.data || [];

  // =================== EFFECTS ===================
  useEffect(() => {
    if (userInfo) {
      setFormData((prev) => ({
        ...prev,
        orderedByName: userInfo.name || "",
        orderedByEmail: userInfo.email || "",
      }));
    }
  }, [userInfo]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (brandRef.current && !brandRef.current.contains(e.target)) setBrandOpen(false);
      if (productRef.current && !productRef.current.contains(e.target)) setProductOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // =================== HANDLERS ===================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = (data) => {
    setProducts((prev) => [...prev, { ...data, key: Date.now() }]);
  };

  const removeProduct = (key) => {
    setProducts(products.filter((p) => p.key !== key));
  };

  const handleProductSelect = (prod) => {
    setFormData((prev) => ({
      ...prev,
      brand: prod.brand,
      productId: prod._id,
      productName: prod.productName,
      productShortCode: prod.productShortCode,
      packSize: prod.packSize,
      category: prod.category,
    }));
    setProductOpen(false);
  };

  // Selected customer
  const selectedCustomer = customers.find((c) => c._id === formData.customerId);
  const discountPercent = selectedCustomer?.discount || 0;
  const discountDecimal = discountPercent / 100;

  // =================== TOTALS ===================
  const totalAmount = products.reduce((acc, p) => acc + p.price * p.quantity, 0);
  const discount = totalAmount * discountDecimal;
  const grandTotal = totalAmount - discount;

  // =================== SUBMIT ===================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!products.length) return alert("Add at least one product");
    if (!formData.customerId) return alert("Select a customer");

    const payload = {
      customerId: formData.customerId,
      products: products.map((p) => ({ productId: p.productId || p._id, quantity: p.quantity })),
      payMode: formData.payMode,
    };

    try {
      const res = await createOrder(payload).unwrap();
      console.log("Order Created:", res);
      alert(`Order placed successfully! Grand Total: ৳${grandTotal.toFixed(2)}`);

      // Reset form
      setFormData({
        customerName: "",
        customerId: "",
        payMode: "",
        brand: "",
        orderedByName: userInfo?.name || "",
        orderedByEmail: userInfo?.email || "",
      });
      setProducts([]);
      setSelectedAddress("");
    } catch (err) {
      console.error("Failed to create order:", err);
      alert("Failed to place order. Please try again.");
    }
  };

  // =================== LOADER ===================
  if (authLoading || brandsLoading || customersLoading) return <Loader />;

  // =================== RENDER ===================
  return (
    <div className="w-full mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white text-gray-500 h-12 flex items-center px-6">
        <h2 className="text-base font-bold">NPL / Admin / Purchase Order</h2>
      </div>

      {/* Customer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-lg shadow-md p-6">
        {/* Customer dropdown */}
        <div className="flex flex-col mb-2">
          <label className="text-sm font-medium text-gray-700 mb-1">Customer</label>
          <Select
            options={customers.map((c) => ({
              value: c._id,
              label: (
                <div className="flex flex-col">
                  <span>{`${c.customerName} - ${c.customerId}`}</span>
                  {c.address && <span className="text-gray-500 text-xs">{c.address}</span>}
                </div>
              ),
            }))}
            value={
              formData.customerId
                ? {
                    value: formData.customerId,
                    label: (
                      <div className="flex flex-col">
                        <span>{formData.customerName}</span>
                        {selectedAddress && <span className="text-gray-500 text-xs">{selectedAddress}</span>}
                      </div>
                    ),
                  }
                : null
            }
            onChange={(option) => {
              const customer = customers.find((c) => c._id === option.value);
              if (customer) {
                setFormData((prev) => ({
                  ...prev,
                  customerName: `${customer.customerName} - ${customer.customerId}`,
                  customerId: customer._id,
                  payMode: "",
                }));
                setSelectedAddress(customer.address || "");
              } else {
                setFormData((prev) => ({ ...prev, customerName: "", customerId: "", payMode: "" }));
                setSelectedAddress("");
              }
            }}
            placeholder="Select Customer"
            isClearable
            styles={{
              control: (base) => ({ ...base, minHeight: "40px" }),
              menu: (base) => ({ ...base, zIndex: 50 }),
            }}
          />
        </div>

        {/* Payment Mode */}
        <SelectInput
          label="Payment Mode"
          name="payMode"
          value={formData.payMode}
          onChange={handleChange}
          options={formData.customerId ? selectedCustomer?.payMode || [] : []}
          disabled={!formData.customerId}
        />

        {/* Brand dropdown */}
        <div ref={brandRef} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
          <input
            type="text"
            readOnly
            value={formData.brand}
            placeholder="Select brand"
            onClick={() => setBrandOpen((p) => !p)}
            className="w-full border border-gray-300 rounded p-2 cursor-pointer"
          />
          {brandOpen && (
            <ul className="absolute z-10 w-full bg-white border rounded shadow max-h-40 overflow-y-auto mt-1">
              {brands.map((brand) => (
                <li
                  key={brand}
                  className="p-2 hover:bg-blue-100 cursor-pointer"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      brand,
                      productId: "",
                      productName: "",
                      productShortCode: "",
                      packSize: "",
                    }));
                    setBrandOpen(false);
                  }}
                >
                  {brand}
                </li>
              ))}
            </ul>
          )}
        </div>

        <Input label="Ordered By" value={formData.orderedByName} disabled />
      </div>

      {/* Products Section */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-700">Products</h3>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            + Add Products
          </button>
        </div>

        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10 border-b border-gray-300">
              <tr>
                <th className="p-3 text-left font-semibold text-gray-600 border-r border-gray-300">Product</th>
                <th className="p-3 text-center font-semibold text-gray-600 border-r border-gray-300">Quantity</th>
                <th className="p-3 text-center font-semibold text-gray-600 border-r border-gray-300">Price (৳)</th>
                <th className="p-3 text-center font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-400 border-t border-gray-300">
                    No products added
                  </td>
                </tr>
              )}
              {products.map((p) => (
                <tr key={p.key} className="hover:bg-blue-50 transition">
                  <td className="p-3 border-b border-gray-300">{p.product}</td>
                  <td className="p-3 text-center border-b border-gray-300">{p.quantity}</td>
                  <td className="p-3 text-center border-b border-gray-300">৳ {(p.price * p.quantity).toFixed(2)}</td>
                  <td className="p-3 text-center border-b border-gray-300">
                    <button
                      onClick={() => removeProduct(p.key)}
                      className="text-red-600 font-medium hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        {products.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 max-w-md mx-auto space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Total:</span>
              <span>৳ {totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Discount ({discountPercent}%):</span>
              <span>-৳ {discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold text-gray-900">
              <span>Grand Total:</span>
              <span>৳ {grandTotal.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleSubmit}
            disabled={creating}
            className={`bg-[#0F213D] hover:bg-[#183461] text-white font-semibold px-8 py-3 rounded-lg transition ${
              creating ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {creating ? "Placing Order..." : "🚀 Place Order"}
          </button>
        </div>
      </div>

      {/* Product Modal */}
      <ProductSelectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddProduct}
        products={apiProducts}
        loading={productsLoading}
      />
    </div>
  );
};

export default PlaceOrder;

// =================== Input Components ===================
const Input = ({ label, ...props }) => (
  <div className="flex flex-col mb-2">
    <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      {...props}
      className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
    />
  </div>
);

const SelectInput = ({ label, options, ...props }) => (
  <div className="flex flex-col mb-2">
    <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      {...props}
      className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
    >
      <option value="">Select {label}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </div>
);
