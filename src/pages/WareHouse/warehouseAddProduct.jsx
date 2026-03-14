import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useGetPendingPurchaseOrdersQuery } from "../../redux/features/HQ/MD/purchaseOrder/purchaseOrderApi";
import { useAuth } from "../../provider/AuthProvider";
import { useSubmitReceiveMutation } from "../../redux/features/wareHouse/warehouseReceiveApi";
import { showToast } from "../../component/common/toastService"; // ✅ import custom toast
import Loader from "../../component/Loader";
import Card from "../../component/common/Card";
import Button from "../../component/common/Button";
import { MdArrowBack } from "react-icons/md";

const WarehouseAddProduct = () => {
  const { data, isLoading } = useGetPendingPurchaseOrdersQuery();
  const [submitReceive, { isLoading: submitting }] = useSubmitReceiveMutation();

  const [dateOpen, setDateOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { userInfo } = useAuth();

  const [formData, setFormData] = useState({
    productName: "",
    productShortCode: "",
    batchNumber: "",
    expireDate: "",
    boxQuantity: "",
    quantityWithBox: "",
    quantityWithoutBox: "",
    remarks: "",
    addedByName: userInfo?.name || "",
    addedByEmail: userInfo?.email || "",
  });

  useEffect(() => {
    if (userInfo) {
      setFormData((prev) => ({
        ...prev,
        addedByName: userInfo.name,
        addedByEmail: userInfo.email,
      }));
    }
  }, [userInfo]);

  const dateRef = useRef(null);
  const productRef = useRef(null);

  const uniqueDates = Object.keys(data?.data || {});
  const dateCounts = {};
  uniqueDates.forEach((d) => {
    dateCounts[d] = data.data[d].length;
  });

  const productsForSelectedDate = selectedDate ? data.data[selectedDate] : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (selectedProduct) {
      setFormData((prev) => ({
        ...prev,
        productName: selectedProduct.productName,
        productShortCode: selectedProduct.productShortCode,
        batchNumber: selectedProduct.batch,
        expireDate: selectedProduct.expire,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        productName: "",
        productShortCode: "",
        batchNumber: "",
        expireDate: "",
      }));
    }
  }, [selectedProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProduct) {
      showToast("Please select a product first!", "warn");
      return;
    }

    const payload = {
      purchaseOrderId: selectedProduct.purchaseOrderId,
      boxQuantity: Number(formData.boxQuantity),
      productQuantityWithBox: Number(formData.quantityWithBox),
      productQuantityWithoutBox: Number(formData.quantityWithoutBox),
      remarks: formData.remarks,
    };

    try {
      await submitReceive(payload).unwrap();
      showToast("Warehouse product received successfully!", "success");

      setFormData({
        productName: "",
        productShortCode: "",
        batchNumber: "",
        expireDate: "",
        boxQuantity: "",
        quantityWithBox: "",
        quantityWithoutBox: "",
        remarks: "",
        addedByName: userInfo?.name || "",
        addedByEmail: userInfo?.email || "",
      });
      setSelectedProduct(null);
      setSelectedDate("");
    } catch (err) {
      console.error(err);
      showToast("Failed to submit warehouse receive.", "error");
    }
  };

  const preventScrollAndArrow = (e) => {
    if (e.type === "wheel") e.target.blur();
    if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
  };

  if (isLoading) return <Loader></Loader>;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="small"  onClick={() => window.history.back()}
              className="ml-2">
                 <MdArrowBack className="inline mr-1" />
              Back
            </Button>
            <div className="bg-white text-gray-500 flex items-center px-3 sm:px-4 md:px-6 py-2 sm:h-12">
              <h2 className="flex flex-wrap items-center text-xs sm:text-sm md:text-base font-semibold text-gray-800 gap-1 sm:gap-2">
                <span>EMS</span>
                <ChevronRight size={14} className="text-gray-400" />
                <span>WAREHOUSE</span>
                <ChevronRight size={14} className="text-gray-400" />
                <span className="text-gray-900 font-bold">WAREHOUSE RECEIVE</span>
              </h2>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-neutral-500 mr-2 sm:mr-4 md:mr-6">
           WAREHOUSE RECEIVE
          </div>
        </div>
      </Card>

      <div className="mx-auto bg-white rounded-lg shadow-md p-10 space-y-4 mt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Dropdown
              label="Select Date"
              options={uniqueDates}
              counts={dateCounts}
              selected={selectedDate}
              onSelect={(d) => {
                setSelectedDate(d);
                setDateOpen(false);
                setProductOpen(true);
                setSelectedProduct(null);
              }}
              open={dateOpen}
              setOpen={setDateOpen}
            />
            <Dropdown
              label="Product Name"
              options={productsForSelectedDate}
              selected={formData.productName}
              onSelect={(p) => {
                setSelectedProduct(p);
                setProductOpen(false);
              }}
              open={productOpen}
              setOpen={setProductOpen}
              disabled={!selectedDate}
              displayKey="productName"
              extraInfo={(p) => `Batch: ${p.batch} | Exp: ${p.expire}`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Product Short Code" name="productShortCode" value={formData.productShortCode} readOnly className="bg-gray-100 cursor-not-allowed" />
            <Input label="Batch Number" name="batchNumber" value={formData.batchNumber} readOnly className="bg-gray-100 cursor-not-allowed" />
            <Input label="Expire Date" name="expireDate" value={formData.expireDate} readOnly className="bg-gray-100 cursor-not-allowed" />
            <Input label="Box Quantity" type="number" name="boxQuantity" value={formData.boxQuantity} onChange={handleChange} onWheel={preventScrollAndArrow} onKeyDown={preventScrollAndArrow} />
            <Input label="Quantity (with box)" type="number" name="quantityWithBox" value={formData.quantityWithBox} onChange={handleChange} onWheel={preventScrollAndArrow} onKeyDown={preventScrollAndArrow} />
            <Input label="Quantity (without box)" type="number" name="quantityWithoutBox" value={formData.quantityWithoutBox} onChange={handleChange} onWheel={preventScrollAndArrow} onKeyDown={preventScrollAndArrow} />
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
              <textarea name="remarks" value={formData.remarks} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
            </div>
            <Input label="Added By Name" name="addedByName" value={formData.addedByName} readOnly className="bg-gray-100 cursor-not-allowed" />
            <Input label="Added By Email" name="addedByEmail" value={formData.addedByEmail} readOnly className="bg-gray-100 cursor-not-allowed" />
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Warehouse Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

// -------------------- Input Component --------------------
const Input = ({ label, ...props }) => (
  <div className="mb-2">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input {...props} className={`w-full border border-gray-300 rounded p-2 ${props.className || ""}`} style={{ MozAppearance: props.type === "number" ? "textfield" : undefined }} />
  </div>
);

// -------------------- Dropdown Component --------------------
const Dropdown = ({ label, options, counts, selected, onSelect, open, setOpen, disabled = false, displayKey, extraInfo }) => (
  <div className="relative">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div onClick={() => !disabled && setOpen((p) => !p)} className={`w-full border border-gray-300 rounded p-2 flex justify-between items-center cursor-pointer ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}>
      <span>{selected || `-- Select ${label.toLowerCase()} --`}</span>
      <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
    </div>
    {open && options.length > 0 && (
      <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow max-h-40 overflow-y-auto mt-1">
        {options.map((opt, idx) => (
          <li key={idx} className="flex justify-between p-2 hover:bg-blue-100 cursor-pointer" onClick={() => onSelect(opt)}>
            <span>{displayKey ? opt[displayKey] : opt}</span>
            {counts || extraInfo ? <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">{counts ? counts[opt] : extraInfo(opt)}</span> : null}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default WarehouseAddProduct;
