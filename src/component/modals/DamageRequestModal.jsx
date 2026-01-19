import React, { useState, useEffect } from "react";
import { useSubmitDamageRequestMutation } from "../../redux/features/wareHouse/warehouseDamageApi";

const DamageRequestModal = ({
  isOpen,
  onClose,
  addedBy,
  warehouseReceiveId, // ✅ receive from parent
}) => {
  const [damageQuantity, setDamageQuantity] = useState("");
  const [remarks, setRemarks] = useState("");

  const [submitDamageRequest, { isLoading }] =
    useSubmitDamageRequestMutation();

  // Lock background scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

//   const handleSubmit = async () => {
//     if (!warehouseReceiveId) {
//       alert("Warehouse Receive ID missing");
//       return;
//     }

//     if (!damageQuantity || Number(damageQuantity) <= 0) {
//       alert("Please enter valid damage quantity");
//       return;
//     }

//     try {
//       await submitDamageRequest({
//         warehouseReceiveId, // ✅ FIXED
//         damageQuantity: Number(damageQuantity),
//         remarks,
//         addedBy,
//       }).unwrap();

//       alert("Damage request submitted successfully!");
//       setDamageQuantity("");
//       setRemarks("");
//       onClose();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to submit damage request");
//     }
//   };

const handleSubmit = async () => {
  if (!warehouseReceiveId) {
    alert("Warehouse Receive ID missing");
    return;
  }

  if (!damageQuantity || Number(damageQuantity) <= 0) {
    alert("Please enter valid damage quantity");
    return;
  }

  try {
    await submitDamageRequest({
      warehouseReceiveId,
      damageQuantity: Number(damageQuantity),
      remarks,
      addedBy,
    }).unwrap();

    alert("Damage request submitted successfully!");
    setDamageQuantity("");
    setRemarks("");
    onClose();
  } catch (err) {
    console.error(err);

    // ✅ SHOW BACKEND MESSAGE
    const errorMessage =
      err?.data?.message || "Failed to submit damage request";

    alert(errorMessage);
  }
};


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
      <div className="bg-white rounded-xl shadow-2xl w-96 p-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Product Name */}
        <h2 className="text-2xl font-bold text-[#0F213D] mb-1 text-center">
          Alknet Azelike Plus Cream
        </h2>
        <p className="text-center text-gray-600 font-medium mb-6">30 ML</p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <InfoCard label="Code" value="ACNAP" />
          <InfoCard label="Batch" value="0705" />
          <InfoCard label="Expire" value="03/28" danger />
          <InfoCard label="Total Units" value="715" />
        </div>

        {/* Damage Quantity */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1 font-medium">
            Damage Quantity
          </label>
          <input
            type="number"
            min="1"
            value={damageQuantity}
            onChange={(e) => setDamageQuantity(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Remarks */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1 font-medium">
            Remarks
          </label>
          <textarea
            rows={2}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Added By */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <input
            readOnly
            value={addedBy?.name || "Warehouse Manager"}
            className="border rounded px-3 py-2 bg-gray-100"
          />
          <input
            readOnly
            value={addedBy?.email || "warehouse@navantis.com"}
            className="border rounded px-3 py-2 bg-gray-100"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
        >
          {isLoading ? "Submitting..." : "Submit Damage Request"}
        </button>
      </div>
    </div>
  );
};

const InfoCard = ({ label, value, danger }) => (
  <div className="border p-4 rounded-lg shadow">
    <p className="text-gray-400 text-xs uppercase">{label}</p>
    <p className={`font-semibold text-lg ${danger ? "text-red-500" : ""}`}>
      {value}
    </p>
  </div>
);

export default DamageRequestModal;
