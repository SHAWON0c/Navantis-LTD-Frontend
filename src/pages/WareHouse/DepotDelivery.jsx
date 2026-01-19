// import React, { useState, useEffect, useRef } from "react";
// import { ChevronDown } from "lucide-react";
// import { useGetSentProductRequestsByStatusQuery } from "../../redux/features/depot/depotStockApi";
// import { div } from "framer-motion/client";

// const DepotDelivery = () => {
//     const { data, isLoading } = useGetSentProductRequestsByStatusQuery("requested");

//     const [selectedDate, setSelectedDate] = useState("");
//     const [selectedRequest, setSelectedRequest] = useState(null);
//     const [approvedQty, setApprovedQty] = useState("");
//     const [dateOpen, setDateOpen] = useState(false);
//     const [productOpen, setProductOpen] = useState(false);

//     const dateRef = useRef();
//     const productRef = useRef();

//     // Close dropdowns on outside click
//     useEffect(() => {
//         const handleClickOutside = (e) => {
//             if (dateRef.current && !dateRef.current.contains(e.target)) setDateOpen(false);
//             if (productRef.current && !productRef.current.contains(e.target)) setProductOpen(false);
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     const requests = data?.requests || [];

//     // Extract unique dates
//     const dateCounts = {};
//     requests.forEach((req) => {
//         const date = req.createdAt.split("T")[0];
//         dateCounts[date] = (dateCounts[date] || 0) + 1;
//     });
//     const uniqueDates = Object.keys(dateCounts);

//     // Filter requests by selected date
//     const requestsForDate = selectedDate
//         ? requests.filter((r) => r.createdAt.split("T")[0] === selectedDate)
//         : [];

//     // Auto-select first product when date changes
//     useEffect(() => {
//         if (requestsForDate.length > 0) {
//             setSelectedRequest(requestsForDate[0]);
//             setApprovedQty("");
//         } else {
//             setSelectedRequest(null);
//             setApprovedQty("");
//         }
//     }, [selectedDate, data]);

//     const handleSubmit = () => {
//         if (!selectedRequest) return alert("Please select a product");
//         if (!approvedQty) return alert("Please enter approved quantity");

//         console.log("Submitting:", {
//             requestId: selectedRequest._id,
//             approvedQuantity: approvedQty,
//         });

//         alert(`Approved Quantity ${approvedQty} submitted for ${selectedRequest.productName}`);
//         setApprovedQty("");
//     };

//     if (isLoading) return <div>Loading...</div>;

//     return (
//    <div className="mx-auto p-6">

//       {/* Top Page Header */}
//       <div className="bg-white text-gray-500 h-12 flex items-center px-6">
//         <h2 className="text-base font-bold">NPL / Admin / Purchase Order List</h2>
//       </div>
//             <div className="w-full mx-auto p-6 mt-4 bg-white rounded shadow space-y-6">


//                 {/* Date Dropdown */}
//                 <div ref={dateRef} className="relative">
//                     <label className="block text-sm font-medium mb-1">Select Date</label>
//                     <div
//                         onClick={() => setDateOpen((p) => !p)}
//                         className="w-full border rounded p-2 flex justify-between items-center cursor-pointer"
//                     >
//                         <span>{selectedDate || "-- Select a date --"}</span>
//                         <ChevronDown className={`w-4 h-4 transition-transform ${dateOpen ? "rotate-180" : ""}`} />
//                     </div>
//                     {dateOpen && (
//                         <ul className="absolute z-10 w-full bg-white border rounded shadow max-h-40 overflow-y-auto mt-1">
//                             {uniqueDates.map((date) => (
//                                 <li
//                                     key={date}
//                                     className="flex justify-between p-2 hover:bg-blue-100 cursor-pointer"
//                                     onClick={() => {
//                                         setSelectedDate(date);
//                                         setDateOpen(false);
//                                         setProductOpen(false);
//                                     }}
//                                 >
//                                     <span>{date}</span>
//                                     <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
//                                         {dateCounts[date]}
//                                     </span>
//                                 </li>
//                             ))}
//                         </ul>
//                     )}
//                 </div>

//                 {/* Product Dropdown */}
//                 {requestsForDate.length > 0 && (
//                     <div ref={productRef} className="relative">
//                         <label className="block text-sm font-medium mb-1">Select Product</label>
//                         <div
//                             onClick={() => setProductOpen((p) => !p)}
//                             className="w-full border rounded p-2 flex justify-between items-center cursor-pointer"
//                         >
//                             <span>{selectedRequest?.productName || "-- Select a product --"}</span>
//                             <ChevronDown className={`w-4 h-4 transition-transform ${productOpen ? "rotate-180" : ""}`} />
//                         </div>
//                         {productOpen && (
//                             <ul className="absolute z-10 w-full bg-white border rounded shadow max-h-40 overflow-y-auto mt-1">
//                                 {requestsForDate.map((req) => (
//                                     <li
//                                         key={req._id}
//                                         className="p-2 hover:bg-blue-100 cursor-pointer"
//                                         onClick={() => {
//                                             setSelectedRequest(req);
//                                             setApprovedQty("");
//                                             setProductOpen(false);
//                                         }}
//                                     >
//                                         {req.productName} (Qty: {req.quantity})
//                                     </li>
//                                 ))}
//                             </ul>
//                         )}
//                     </div>
//                 )}

//                 {/* Display Selected Product Details in two-column rows with label + input side by side */}
//                 {selectedRequest && (
//                     <div className="grid grid-cols-2 gap-4">
//                         <InputRow label="Product Name" value={selectedRequest.productName} readOnly />
//                         <InputRow label="Pack Size" value={selectedRequest.packSize} readOnly />
//                         <InputRow label="Requested By" value={selectedRequest.requestedBy} readOnly />
//                         <InputRow label="Requested Quantity" value={selectedRequest.quantity} readOnly />
//                         <InputRow
//                             label="Approved Quantity"
//                             type="number"
//                             value={approvedQty}
//                             onChange={(e) => setApprovedQty(e.target.value)}
//                         />
//                         <div className="flex items-end">
//                             <button
//                                 onClick={handleSubmit}
//                                 className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
//                             >
//                                 Submit
//                             </button>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// // Reusable Input Component with label + input in one row
// const InputRow = ({ label, ...props }) => (
//     <div className="flex items-center space-x-2">
//         <span className="w-32 text-gray-700 font-medium">{label}:</span>
//         <input
//             {...props}
//             className={`flex-1 border border-gray-300 rounded p-2 ${props.className || ""}`}
//         />
//     </div>
// );

// export default DepotDelivery;



import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useGetSentProductRequestsByStatusQuery, useUpdateSendProductRequestStatusMutation } from "../../redux/features/depot/depotStockApi";

const DepotDelivery = () => {
  const { data, isLoading } = useGetSentProductRequestsByStatusQuery("requested");

  const [updateStatus, { isLoading: isSubmitting }] = useUpdateSendProductRequestStatusMutation();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [approvedQty, setApprovedQty] = useState("");
  const [dateOpen, setDateOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);

  const dateRef = useRef();
  const productRef = useRef();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dateRef.current && !dateRef.current.contains(e.target)) setDateOpen(false);
      if (productRef.current && !productRef.current.contains(e.target)) setProductOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const requests = data?.requests || [];

  // Extract unique dates
  const dateCounts = {};
  requests.forEach((req) => {
    const date = req.createdAt.split("T")[0];
    dateCounts[date] = (dateCounts[date] || 0) + 1;
  });
  const uniqueDates = Object.keys(dateCounts);

  // Filter requests by selected date
  const requestsForDate = selectedDate
    ? requests.filter((r) => r.createdAt.split("T")[0] === selectedDate)
    : [];

  // Auto-select first product when date changes
  useEffect(() => {
    if (requestsForDate.length > 0) {
      setSelectedRequest(requestsForDate[0]);
      setApprovedQty(requestsForDate[0].quantity); // prefill with requested quantity
    } else {
      setSelectedRequest(null);
      setApprovedQty("");
    }
  }, [selectedDate, data]);

  const handleSubmit = async () => {
    if (!selectedRequest) return alert("Please select a product");
    if (!approvedQty) return alert("Please enter approved quantity");

    try {
      await updateStatus({
        id: selectedRequest._id,
        status: "approved",
        quantity: Number(approvedQty),
      }).unwrap();

      alert(`Approved Quantity ${approvedQty} submitted for ${selectedRequest.productName}`);
      setApprovedQty("");
    } catch (error) {
      console.error(error);
      alert("Failed to submit approved quantity");
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="mx-auto p-6">
      <div className="bg-white text-gray-500 h-12 flex items-center px-6">
        <h2 className="text-base font-bold">NPL / Admin / Purchase Order List</h2>
      </div>
      <div className="w-full mx-auto p-6 mt-4 bg-white rounded shadow space-y-6">
        {/* Date Dropdown */}
        <div ref={dateRef} className="relative">
          <label className="block text-sm font-medium mb-1">Select Date</label>
          <div
            onClick={() => setDateOpen((p) => !p)}
            className="w-full border rounded p-2 flex justify-between items-center cursor-pointer"
          >
            <span>{selectedDate || "-- Select a date --"}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${dateOpen ? "rotate-180" : ""}`} />
          </div>
          {dateOpen && (
            <ul className="absolute z-10 w-full bg-white border rounded shadow max-h-40 overflow-y-auto mt-1">
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
        {requestsForDate.length > 0 && (
          <div ref={productRef} className="relative">
            <label className="block text-sm font-medium mb-1">Select Product</label>
            <div
              onClick={() => setProductOpen((p) => !p)}
              className="w-full border rounded p-2 flex justify-between items-center cursor-pointer"
            >
              <span>{selectedRequest?.productName || "-- Select a product --"}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${productOpen ? "rotate-180" : ""}`} />
            </div>
            {productOpen && (
              <ul className="absolute z-10 w-full bg-white border rounded shadow max-h-40 overflow-y-auto mt-1">
                {requestsForDate.map((req) => (
                  <li
                    key={req._id}
                    className="p-2 hover:bg-blue-100 cursor-pointer"
                    onClick={() => {
                      setSelectedRequest(req);
                      setApprovedQty(req.quantity);
                      setProductOpen(false);
                    }}
                  >
                    {req.productName} (Qty: {req.quantity})
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Selected Product Details */}
        {selectedRequest && (
          <div className="grid grid-cols-2 gap-4">
            <InputRow label="Product Name" value={selectedRequest.productName} readOnly />
            <InputRow label="Pack Size" value={selectedRequest.packSize} readOnly />
            <InputRow label="Requested By" value={selectedRequest.requestedBy} readOnly />
            <InputRow label="Requested Quantity" value={selectedRequest.quantity} readOnly />
            <InputRow
              label="Approved Quantity"
              type="number"
              value={approvedQty}
              onChange={(e) => setApprovedQty(e.target.value)}
            />
            <div className="flex items-end">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// InputRow Component
const InputRow = ({ label, ...props }) => (
  <div className="flex items-center space-x-2">
    <span className="w-32 text-gray-700 font-medium">{label}:</span>
    <input
      {...props}
      className={`flex-1 border border-gray-300 rounded p-2 ${props.className || ""}`}
    />
  </div>
);

export default DepotDelivery;
