import React, { useState, useRef, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import {
  useGetBrandsQuery,
  useGetProductsByBrandQuery,
} from "../../redux/features/products/productsApi";
import { useSendProductRequestMutation } from "../../redux/features/depot/depotStockApi";

const DepotProductRequestModal = ({ isOpen, onClose }) => {
  // ---------------- HOOKS (always run) ----------------
  const { data: brands = [], isLoading: brandsLoading } = useGetBrandsQuery();
  const [selectedBrand, setSelectedBrand] = useState("");
  const { data: productsData = {}, isLoading: productsLoading } =
    useGetProductsByBrandQuery(selectedBrand, { skip: !selectedBrand });
  const products = productsData.products || [];

  const [sendProductRequest, { isLoading: isSending }] =
    useSendProductRequestMutation();

  const [brandOpen, setBrandOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [requestQty, setRequestQty] = useState("");

  const brandRef = useRef(null);
  const productRef = useRef(null);

  // Temporary stock info (replace with API if available)
  const warehouseStock = 120;
  const previouslyRequested = 10;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (brandRef.current && !brandRef.current.contains(e.target))
        setBrandOpen(false);
      if (productRef.current && !productRef.current.contains(e.target))
        setProductOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ---------------- EARLY RETURN ----------------
  if (!isOpen) return null;

  // ---------------- HANDLERS ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !requestQty) return;

    const payload = {
      requestedBy: "Depot A", // replace with auth info if needed
      productId: selectedProduct._id,
      quantity: Number(requestQty),
    };

    try {
      await sendProductRequest(payload).unwrap();
      alert("Product request sent successfully ✅");

      // Reset form
      setSelectedBrand("");
      setSelectedProduct(null);
      setRequestQty("");
      setBrandOpen(false);
      setProductOpen(false);
      onClose();
    } catch (error) {
      console.error("SEND PRODUCT REQUEST ERROR ❌", error);
      alert(error?.data?.message || "Failed to send product request");
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg">

        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b">
          <h2 className="text-lg font-semibold">Depot Product Request</h2>
          <button onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">

          {/* Requested By */}
          <div>
            <label className="block text-sm font-medium mb-1">Requested By</label>
            <input
              type="text"
              value="Depot A"
              readOnly
              className="w-full border rounded p-2 bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Brand */}
          <div ref={brandRef} className="relative">
            <label className="block text-sm font-medium mb-1">Brand</label>
            <input
              readOnly
              value={selectedBrand}
              placeholder="Select brand"
              onClick={() => setBrandOpen((p) => !p)}
              className="w-full border rounded p-2 cursor-pointer"
            />
            {brandOpen && (
              <ul className="absolute z-10 w-full bg-white border rounded shadow max-h-40 overflow-y-auto mt-1">
                {brandsLoading ? (
                  <li className="p-2 text-gray-500">Loading...</li>
                ) : (
                  brands.map((brand) => (
                    <li
                      key={brand}
                      onClick={() => {
                        setSelectedBrand(brand);
                        setSelectedProduct(null);
                        setBrandOpen(false);
                      }}
                      className="p-2 hover:bg-blue-100 cursor-pointer"
                    >
                      {brand}
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>

          {/* Product */}
          <div ref={productRef} className="relative">
            <label className="block text-sm font-medium mb-1">Product</label>
            <input
              readOnly
              value={selectedProduct?.productName || ""}
              placeholder={selectedBrand ? "Select product" : "Select brand first"}
              disabled={!selectedBrand}
              onClick={() => selectedBrand && setProductOpen((p) => !p)}
              className={`w-full border rounded p-2 ${!selectedBrand && "bg-gray-100 cursor-not-allowed"}`}
            />
            {productOpen && selectedBrand && (
              <ul className="absolute z-10 w-full bg-white border rounded shadow max-h-40 overflow-y-auto mt-1">
                {productsLoading ? (
                  <li className="p-2 text-gray-500">Loading...</li>
                ) : (
                  products.map((prod) => (
                    <li
                      key={prod._id}
                      onClick={() => {
                        setSelectedProduct(prod);
                        setProductOpen(false);
                      }}
                      className="p-2 hover:bg-blue-100 cursor-pointer"
                    >
                      {prod.productName}
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>

          {/* Stock Info */}
          {selectedProduct && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-green-50 rounded text-center">
              <div>
                <p className="text-sm text-green-700">Available in Warehouse</p>
                <p className="text-2xl font-bold">{warehouseStock}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700">Previously Requested</p>
                <p className="text-2xl font-bold">{previouslyRequested}</p>
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium mb-1">Request Quantity</label>
            <input
              type="number"
              min={1}
              max={warehouseStock}
              value={requestQty}
              onChange={(e) => setRequestQty(e.target.value)}
              disabled={!selectedProduct}
              onWheel={(e) => e.target.blur()}
              className="w-full border rounded p-2"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!selectedProduct || !requestQty || isSending}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded"
          >
            {isSending ? "Sending..." : "Submit Request"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default DepotProductRequestModal;
