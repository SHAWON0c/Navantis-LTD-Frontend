// import React, { useState, useEffect, useRef } from "react";
// import { useUserProfile } from "../../hooks/useUserProfile";
// import { useGetAllReceivesQuery } from "../../redux/features/wareHouse/warehouseReceiveApi";
// import { ChevronDown } from "lucide-react";

// const WarehouseAddProduct = () => {
//   const { data: userData } = useUserProfile();
//   const user = userData?.data?.user;
//   const org = userData?.data?.organizationProfile;

//   const { data: receivesData, isLoading } = useGetAllReceivesQuery();

//   // Extract unique dates and counts
//   const dateCounts = {};
//   receivesData?.data?.forEach((item) => {
//     const date = item.purchaseDate.split("T")[0];
//     dateCounts[date] = (dateCounts[date] || 0) + 1;
//   });
//   const uniqueDates = Object.keys(dateCounts);

//   // Dropdown states
//   const [dateOpen, setDateOpen] = useState(false);
//   const [productOpen, setProductOpen] = useState(false);

//   const [selectedDate, setSelectedDate] = useState("");
//   const [productsForDate, setProductsForDate] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   const [formData, setFormData] = useState({
//     productName: "",
//     productShortCode: "",
//     batchNumber: "",
//     expireDate: "",
//     boxQuantity: "",
//     quantityWithBox: "",
//     quantityWithoutBox: "",
//     remarks: "",
//     addedByName: org?.name || "",
//     addedByEmail: user?.email || "",
//   });

//   const dateRef = useRef();
//   const productRef = useRef();

//   // Handle outside click
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dateRef.current && !dateRef.current.contains(e.target)) setDateOpen(false);
//       if (productRef.current && !productRef.current.contains(e.target)) setProductOpen(false);
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Update products when date changes
//   useEffect(() => {
//     if (!selectedDate) return;
//     const products = receivesData?.data?.filter(
//       (item) => item.purchaseDate.split("T")[0] === selectedDate
//     ) || [];
//     setProductsForDate(products);

//     if (products.length > 0) handleProductSelect(products[0]);
//     else {
//       setSelectedProduct(null);
//       setFormData((prev) => ({
//         ...prev,
//         productName: "",
//         productShortCode: "",
//         batchNumber: "",
//         expireDate: "",
//       }));
//     }
//   }, [selectedDate, receivesData]);

//   const handleProductSelect = (product) => {
//     setSelectedProduct(product);
//     setFormData((prev) => ({
//       ...prev,
//       productName: product.productName,
//       productShortCode: product.productShortCode,
//       batchNumber: product.batch,
//       expireDate: product.expireDate.split("T")[0],
//     }));
//     setProductOpen(false);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     for (let key in formData) {
//       if (formData[key] === "") {
//         alert(`Please fill in ${key}`);
//         return;
//       }
//     }
//     const payload = {
//       date: selectedDate,
//       productId: selectedProduct?._id,
//       ...formData,
//     };
//     console.log("Submitting warehouse product:", payload);
//     alert("Warehouse product added successfully!");
//   };

//   if (isLoading) return <div>Loading...</div>;

//   return (
//     <div className="mx-auto p-6">
//       <div className="bg-white text-gray-500 h-12 flex items-center px-6">
//         <h2 className="text-base font-bold">Warehouse / Add Product</h2>
//       </div>

//       <div className="mx-auto bg-white rounded-lg shadow-md p-10 space-y-4 mt-4">
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Date Dropdown */}
//           <div ref={dateRef} className="relative">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
//             <div
//               onClick={() => setDateOpen((p) => !p)}
//               className="w-full border border-gray-300 rounded p-2 flex justify-between items-center cursor-pointer"
//             >
//               <span>{selectedDate || "-- Select a date --"}</span>
//               <ChevronDown className={`w-4 h-4 transition-transform ${dateOpen ? "rotate-180" : ""}`} />
//             </div>
//             {dateOpen && (
//               <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow max-h-40 overflow-y-auto mt-1">
//                 {uniqueDates.map((date) => (
//                   <li
//                     key={date}
//                     className="flex justify-between p-2 hover:bg-blue-100 cursor-pointer"
//                     onClick={() => {
//                       setSelectedDate(date);
//                       setDateOpen(false);
//                       setProductOpen(false);
//                     }}
//                   >
//                     <span>{date}</span>
//                     <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{dateCounts[date]}</span>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Product Dropdown */}
//           {selectedDate && productsForDate.length > 0 && (
//             <div ref={productRef} className="relative">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Select Product</label>
//               <div
//                 onClick={() => setProductOpen((p) => !p)}
//                 className="w-full border border-gray-300 rounded p-2 flex justify-between items-center cursor-pointer"
//               >
//                 <span>{selectedProduct?.productName || "-- Select Product --"}</span>
//                 <ChevronDown className={`w-4 h-4 transition-transform ${productOpen ? "rotate-180" : ""}`} />
//               </div>
//               {productOpen && (
//                 <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow max-h-40 overflow-y-auto mt-1">
//                   {productsForDate.map((prod) => (
//                     <li
//                       key={prod._id}
//                       className="flex justify-between p-2 hover:bg-blue-100 cursor-pointer"
//                       onClick={() => handleProductSelect(prod)}
//                     >
//                       <span>{prod.productName}</span>
//                       {/* <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
//                         {prod.productQuantity}
//                       </span> */}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           )}

//           {/* Form Fields */}
//           <Input label="Product Name" name="productName" value={formData.productName} onChange={handleChange} required />
//           <Input label="Product Short Code" name="productShortCode" value={formData.productShortCode} onChange={handleChange} required />
//           <Input label="Batch Number" name="batchNumber" value={formData.batchNumber} onChange={handleChange} required />
//           <Input label="Expire Date" name="expireDate" value={formData.expireDate} onChange={handleChange} required />
//           <Input label="Box Quantity" type="number" name="boxQuantity" value={formData.boxQuantity} onChange={handleChange} required />
//           <Input label="Quantity (with box)" type="number" name="quantityWithBox" value={formData.quantityWithBox} onChange={handleChange} required />
//           <Input label="Quantity (without box)" type="number" name="quantityWithoutBox" value={formData.quantityWithoutBox} onChange={handleChange} required />

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
//             <textarea
//               name="remarks"
//               value={formData.remarks}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded p-2"
//               required
//             />
//           </div>

//           {/* Added By */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Input label="Added By Name" name="addedByName" value={formData.addedByName} readOnly className="bg-gray-100 cursor-not-allowed" />
//             <Input label="Added By Email" name="addedByEmail" value={formData.addedByEmail} readOnly className="bg-gray-100 cursor-not-allowed" />
//           </div>

//           {/* Submit */}
//           <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded">
//             Submit Warehouse Product
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// // Reusable Input
// const Input = ({ label, ...props }) => (
//   <div className="mb-2">
//     <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
//     <input {...props} className={`w-full border border-gray-300 rounded p-2 ${props.className || ""}`} />
//   </div>
// );

// export default WarehouseAddProduct;



import React, { useState, useEffect, useRef } from "react";
import { useUserProfile } from "../../hooks/useUserProfile";
import { ChevronDown } from "lucide-react";
import { useGetAllReceivesQuery, useSubmitReceiveMutation } from "../../redux/features/wareHouse/warehouseReceiveApi";

const WarehouseAddProduct = () => {
  const { data: userData } = useUserProfile();
  const user = userData?.data?.user;
  const org = userData?.data?.organizationProfile;

  const { data: receivesData, isLoading } = useGetAllReceivesQuery();
  const [submitReceive] = useSubmitReceiveMutation();

  // Extract unique dates and counts
  const dateCounts = {};
  receivesData?.data?.forEach((item) => {
    const date = item.purchaseDate.split("T")[0];
    dateCounts[date] = (dateCounts[date] || 0) + 1;
  });
  const uniqueDates = Object.keys(dateCounts);

  // Dropdown states
  const [dateOpen, setDateOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState("");
  const [productsForDate, setProductsForDate] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [formData, setFormData] = useState({
    productName: "",
    productShortCode: "",
    batchNumber: "",
    expireDate: "",
    boxQuantity: "",
    quantityWithBox: "",
    quantityWithoutBox: "",
    remarks: "",
    addedByName: org?.name || "",
    addedByEmail: user?.email || "",
  });

  const dateRef = useRef();
  const productRef = useRef();

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dateRef.current && !dateRef.current.contains(e.target)) setDateOpen(false);
      if (productRef.current && !productRef.current.contains(e.target)) setProductOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update products when date changes
  useEffect(() => {
    if (!selectedDate) return;
    const products = receivesData?.data?.filter(
      (item) => item.purchaseDate.split("T")[0] === selectedDate
    ) || [];
    setProductsForDate(products);

    if (products.length > 0) handleProductSelect(products[0]);
    else {
      setSelectedProduct(null);
      setFormData((prev) => ({
        ...prev,
        productName: "",
        productShortCode: "",
        batchNumber: "",
        expireDate: "",
      }));
    }
  }, [selectedDate, receivesData]);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setFormData((prev) => ({
      ...prev,
      productName: product.productName,
      productShortCode: product.productShortCode,
      batchNumber: product.batch,
      expireDate: product.expireDate.split("T")[0],
    }));
    setProductOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Submit logic
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    for (let key in formData) {
      if (formData[key] === "") {
        alert(`Please fill in ${key}`);
        return;
      }
    }

    if (!selectedProduct?._id) {
      alert("Please select a product");
      return;
    }

    const payload = {
      purchaseOrderId: selectedProduct._id, // from selected product
      productName: formData.productName,
      productShortCode: formData.productShortCode,
      netWeight: selectedProduct.netWeight || { value: 0, unit: "unit" },
      batch: formData.batchNumber,
      expireDate: formData.expireDate,
      boxQuantity: Number(formData.boxQuantity),
      productQuantityWithBox: Number(formData.quantityWithBox),
      productQuantityWithoutBox: Number(formData.quantityWithoutBox),
      remarks: formData.remarks,
      addedBy: {
        name: formData.addedByName,
        email: formData.addedByEmail,
      },
    };

    try {
      await submitReceive(payload).unwrap();
      alert("Warehouse product submitted successfully!");
      // Reset form
      setSelectedProduct(null);
      setSelectedDate("");
      setFormData((prev) => ({
        ...prev,
        productName: "",
        productShortCode: "",
        batchNumber: "",
        expireDate: "",
        boxQuantity: "",
        quantityWithBox: "",
        quantityWithoutBox: "",
        remarks: "",
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to submit warehouse product.");
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="mx-auto p-6">
      <div className="bg-white text-gray-500 h-12 flex items-center px-6">
        <h2 className="text-base font-bold">Warehouse / Add Product</h2>
      </div>

      <div className="mx-auto bg-white rounded-lg shadow-md p-10 space-y-4 mt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date Dropdown */}
          <div ref={dateRef} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
            <div
              onClick={() => setDateOpen((p) => !p)}
              className="w-full border border-gray-300 rounded p-2 flex justify-between items-center cursor-pointer"
            >
              <span>{selectedDate || "-- Select a date --"}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${dateOpen ? "rotate-180" : ""}`} />
            </div>
            {dateOpen && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow max-h-40 overflow-y-auto mt-1">
                {uniqueDates.map((date) => (
                  <li
                    key={date}
                    className="flex justify-between p-2 hover:bg-blue-100 cursor-pointer"
                    onClick={() => {
                      setSelectedDate(date);
                      setDateOpen(false);
                      setProductOpen(false);
                    }}
                  >
                    <span>{date}</span>
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{dateCounts[date]}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Product Dropdown */}
          {selectedDate && productsForDate.length > 0 && (
            <div ref={productRef} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Product</label>
              <div
                onClick={() => setProductOpen((p) => !p)}
                className="w-full border border-gray-300 rounded p-2 flex justify-between items-center cursor-pointer"
              >
                <span>{selectedProduct?.productName || "-- Select Product --"}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${productOpen ? "rotate-180" : ""}`} />
              </div>
              {productOpen && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow max-h-40 overflow-y-auto mt-1">
                  {productsForDate.map((prod) => (
                    <li
                      key={prod._id}
                      className="flex justify-between p-2 hover:bg-blue-100 cursor-pointer"
                      onClick={() => handleProductSelect(prod)}
                    >
                      <span>{prod.productName}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Form Fields */}
          <Input label="Product Name" name="productName" value={formData.productName} onChange={handleChange} required />
          <Input label="Product Short Code" name="productShortCode" value={formData.productShortCode} onChange={handleChange} required />
          <Input label="Batch Number" name="batchNumber" value={formData.batchNumber} onChange={handleChange} required />
          <Input label="Expire Date" name="expireDate" value={formData.expireDate} onChange={handleChange} required />
          <Input label="Box Quantity" type="number" name="boxQuantity" value={formData.boxQuantity} onChange={handleChange} required />
          <Input label="Quantity (with box)" type="number" name="quantityWithBox" value={formData.quantityWithBox} onChange={handleChange} required />
          <Input label="Quantity (without box)" type="number" name="quantityWithoutBox" value={formData.quantityWithoutBox} onChange={handleChange} required />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2"
              required
            />
          </div>

          {/* Added By */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Added By Name" name="addedByName" value={formData.addedByName} readOnly className="bg-gray-100 cursor-not-allowed" />
            <Input label="Added By Email" name="addedByEmail" value={formData.addedByEmail} readOnly className="bg-gray-100 cursor-not-allowed" />
          </div>

          {/* Submit */}
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded">
            Submit Warehouse Product
          </button>
        </form>
      </div>
    </div>
  );
};

// Reusable Input
const Input = ({ label, ...props }) => (
  <div className="mb-2">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input {...props} className={`w-full border border-gray-300 rounded p-2 ${props.className || ""}`} />
  </div>
);

export default WarehouseAddProduct;
