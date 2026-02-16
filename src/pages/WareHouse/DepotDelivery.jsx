import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useGetGroupedDepotRequestsQuery, useUpdateDepotRequestStatusMutation } from "../../redux/features/depot/depotStockApi";

const DepotDelivery = () => {
  const { data, isLoading, refetch } = useGetGroupedDepotRequestsQuery("requested");
  const [updateStatus, { isLoading: isSubmitting }] = useUpdateDepotRequestStatusMutation();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
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

  const groupedData = data?.data || {}; // { "2026-02-15": [...] }
  const dates = Object.keys(groupedData);
  const productsForDate = selectedDate ? groupedData[selectedDate] || [] : [];

  // Auto select first product when date changes
  useEffect(() => {
    if (productsForDate.length > 0) {
      setSelectedProduct(productsForDate[0]);
    } else {
      setSelectedProduct(null);
    }
  }, [selectedDate, data]);

  const handleApprove = async () => {
    if (!selectedProduct) return toast.error("Please select a product");

    const confirm = window.confirm(`Are you sure you want to approve "${selectedProduct.name}"?`);
    if (!confirm) return;

    try {
      await updateStatus({
        id: selectedProduct._id,
        status: "accepted"
      }).unwrap();

      toast.success(`${selectedProduct.name} approved successfully!`);
      setSelectedProduct(null);
      refetch(); // refresh data after approve
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve product");
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="mx-auto p-6">
      {/* Toast container */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="bg-white text-gray-500 h-12 flex items-center px-6">
        <h2 className="text-base font-bold">Depot Delivery Requests</h2>
      </div>

      <div className="w-full mx-auto p-6 mt-4 bg-white rounded shadow space-y-6">

        {/* ================= DATE DROPDOWN ================= */}
        <div ref={dateRef} className="relative">
          <label className="block text-sm font-medium mb-1">Select Date</label>
          <div
            onClick={() => setDateOpen(!dateOpen)}
            className="w-full border rounded p-2 flex justify-between items-center cursor-pointer"
          >
            <span>{selectedDate || "-- Select a date --"}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${dateOpen ? "rotate-180" : ""}`} />
          </div>
          {dateOpen && (
            <ul className="absolute z-10 w-full bg-white border rounded shadow max-h-40 overflow-y-auto mt-1">
              {dates.map((date) => (
                <li
                  key={date}
                  className="p-2 hover:bg-blue-100 cursor-pointer"
                  onClick={() => {
                    setSelectedDate(date);
                    setDateOpen(false);
                    setProductOpen(false);
                  }}
                >
                  {date}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ================= PRODUCT DROPDOWN ================= */}
        {productsForDate.length > 0 && (
          <div ref={productRef} className="relative">
            <label className="block text-sm font-medium mb-1">Select Product</label>
            <div
              onClick={() => setProductOpen(!productOpen)}
              className="w-full border rounded p-2 flex justify-between items-center cursor-pointer"
            >
              <span>{selectedProduct?.name || "-- Select product --"}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${productOpen ? "rotate-180" : ""}`} />
            </div>
            {productOpen && (
              <ul className="absolute z-10 w-full bg-white border rounded shadow max-h-40 overflow-y-auto mt-1">
                {productsForDate.map((p, i) => (
                  <li
                    key={i}
                    className="p-2 hover:bg-blue-100 cursor-pointer"
                    onClick={() => {
                      setSelectedProduct(p);
                      setProductOpen(false);
                    }}
                  >
                    {p.name} (Qty: {p.quantity})
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* ================= SELECTED PRODUCT INFO ================= */}
        {selectedProduct && (
          <div className="grid grid-cols-2 gap-4">
            <InputRow label="Product Name" value={selectedProduct.name} readOnly />
            <InputRow label="Requested Quantity" value={selectedProduct.quantity} readOnly />
            <div className="flex items-end col-span-2">
              <button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition disabled:opacity-50"
              >
                {isSubmitting ? "Approving..." : "Approve"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// Input Row Component
const InputRow = ({ label, ...props }) => (
  <div className="flex items-center space-x-2">
    <span className="w-32 text-gray-700 font-medium">{label}:</span>
    <input
      {...props}
      className="flex-1 border border-gray-300 rounded p-2 bg-gray-50"
    />
  </div>
);

export default DepotDelivery;
