
import React, { useState, useRef, useEffect } from "react";
import { useGetBrandsQuery, useGetProductsByBrandQuery } from "../../../redux/features/products/productsApi";
import { useCreatePurchaseOrderMutation } from "../../../redux/features/HQ/MD/purchaseOrder/purchaseOrderApi";
import { useAuth } from "../../../provider/AuthProvider"; // ✅ use AuthProvider
import Loader from "../../../component/Loader";

const PurchaseOrder = () => {
  // 1️⃣ Get user info from AuthProvider
  const { userInfo, loading: authLoading } = useAuth();

  // 2️⃣ Fetch brands
  const { data: brands = [], isLoading: brandsLoading } = useGetBrandsQuery();

  const [brandOpen, setBrandOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("");

  // Fetch products by brand
  const { data: productsData = {}, isLoading: productsLoading } =
    useGetProductsByBrandQuery(selectedBrand, { skip: !selectedBrand });

  const products = productsData.products || [];
  const [productOpen, setProductOpen] = useState(false);

  // RTK mutation
  const [createPurchaseOrder, { isLoading }] = useCreatePurchaseOrderMutation();

  // Form state
  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    productShortCode: "",
    packSize: "",
    category: "",
    productQuantity: "",
    batchNumber: "",
    expireDate: "",
    actualPrice: "",
    tradePrice: "",
    addedByName: userInfo?.name || "",   // ✅ default from AuthProvider
    addedByEmail: userInfo?.email || "", // ✅ default from AuthProvider
  });

  // Update form when userInfo changes
  useEffect(() => {
    if (userInfo) {
      setFormData((prev) => ({
        ...prev,
        addedByName: userInfo.name || "",
        addedByEmail: userInfo.email || "",
      }));
    }
  }, [userInfo]);

  const brandRef = useRef();
  const productRef = useRef();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (brandRef.current && !brandRef.current.contains(e.target)) setBrandOpen(false);
      if (productRef.current && !productRef.current.contains(e.target)) setProductOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle input change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle product select
  const handleProductSelect = (prod) => {
    setFormData((prev) => ({
      ...prev,
      productId: prod._id || "",
      productName: prod.productName || "",
      productShortCode: prod.productShortCode || "",
      packSize: prod.packSize || "",
      category: prod.category || "",
    }));
    setProductOpen(false);
  };

  // Parse packSize into numeric value + unit
  const parsePackSize = (packSize) => {
    const match = packSize.match(/^(\d+)([a-zA-Z]+)$/);
    if (match) return { value: Number(match[1]), unit: match[2] };
    return { value: 0, unit: "" };
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const netWeight = parsePackSize(formData.packSize);

    const payload = {
      productId: formData.productId,
      productQuantity: Number(formData.productQuantity),
      batch: formData.batchNumber,
      expireDate: new Date(formData.expireDate).toISOString(),
      actualPrice: Number(formData.actualPrice),
      tradePrice: Number(formData.tradePrice),
    };

    try {
      await createPurchaseOrder(payload).unwrap();
      alert("Purchase order created successfully!");
      setFormData({
        productId: "",
        productName: "",
        productShortCode: "",
        packSize: "",
        category: "",
        productQuantity: "",
        batchNumber: "",
        expireDate: "",
        actualPrice: "",
        tradePrice: "",
        addedByName: userInfo?.name || "",
        addedByEmail: userInfo?.email || "",
      });
      setSelectedBrand("");
    } catch (err) {
      console.error(err);
      alert("Failed to create purchase order.");
    }
  };

  if (authLoading) return <Loader/>;

  return (
    <div className="mx-auto p-2">
      {/* Top Bar */}
      <div className="bg-white text-gray-500 h-12 flex items-center px-6">
        <h2 className="text-base font-bold">NPL / Admin / Purchase Order</h2>
      </div>

      {/* Main Form */}
      <div className="mx-auto bg-white rounded-lg shadow-md p-10 space-y-2 mt-4">
        {/* Brand & Product */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Brand */}
          <div ref={brandRef} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={selectedBrand}
                placeholder="Select brand"
                onClick={() => setBrandOpen((p) => !p)}
                className="w-full border border-gray-300 rounded p-2 pr-8 cursor-pointer"
              />
              {/* Down Arrow */}
              <svg
                className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {brandOpen && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow max-h-40 overflow-y-auto mt-1">
                {brandsLoading ? (
                  <li className="p-2 text-gray-500">Loading...</li>
                ) : (
                  brands.map((brand) => (
                    <li
                      key={brand}
                      className="p-2 hover:bg-blue-100 cursor-pointer"
                      onClick={() => {
                        setSelectedBrand(brand);
                        setBrandOpen(false);
                        setFormData((prev) => ({
                          ...prev,
                          productId: "",
                          productName: "",
                          productShortCode: "",
                          packSize: "",
                        }));
                      }}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={formData.productName}
                placeholder={selectedBrand ? "Select product" : "Select a brand first"}
                onClick={() => selectedBrand && setProductOpen((p) => !p)}
                disabled={!selectedBrand}
                className={`w-full border rounded p-2 pr-8 ${
                  selectedBrand ? "border-gray-300 cursor-pointer" : "border-gray-200 bg-gray-100 cursor-not-allowed text-gray-400"
                }`}
              />
              {/* Down Arrow */}
              <svg
                className={`w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none ${
                  !selectedBrand && "text-gray-300"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {productOpen && selectedBrand && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow max-h-40 overflow-y-auto mt-1">
                {productsLoading ? (
                  <li className="p-2 text-gray-500">Loading...</li>
                ) : (
                  products.map((prod) => (
                    <li
                      key={prod._id}
                      className="p-2 hover:bg-blue-100 cursor-pointer"
                      onClick={() => handleProductSelect(prod)}
                    >
                      {prod.productName}
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>

        {/* Auto fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Product Short Code" value={formData.productShortCode} readOnly />
          <Input label="Pack Size" value={formData.packSize} readOnly />
        </div>

        {/* Purchase Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Category" name="category" value={formData.category} readOnly className="bg-gray-100 cursor-not-allowed" />
          <Input label="Quantity" name="productQuantity" value={formData.productQuantity} onChange={handleFormChange} />
          <Input label="Batch Number" name="batchNumber" value={formData.batchNumber} onChange={handleFormChange} />
          <Input label="Expire Date" type="date" name="expireDate" value={formData.expireDate} onChange={handleFormChange} />
          <Input label="Actual Price" type="number" name="actualPrice" value={formData.actualPrice} onChange={handleFormChange} />
          <Input label="Trade Price" type="number" name="tradePrice" value={formData.tradePrice} onChange={handleFormChange} />
        </div>

        {/* Added By */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Added By Name" name="addedByName" value={formData.addedByName} disabled className="bg-gray-100 cursor-not-allowed" />
          <Input label="Added By Email" name="addedByEmail" value={formData.addedByEmail} disabled className="bg-gray-100 cursor-not-allowed" />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-1/2 mx-auto justify-center items-center flex bg-[#0F213D] hover:bg-[#183461] text-blue-400 font-semibold p-3 rounded"
        >
          {isLoading ? "Submitting..." : "Submit Purchase Order"}
        </button>
      </div>
    </div>
  );
};

// Input component
const Input = ({ label, ...props }) => (
  <div className="mb-2">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input {...props} className="w-full border border-gray-300 rounded p-2 bg-white" />
  </div>
);

export default PurchaseOrder;
