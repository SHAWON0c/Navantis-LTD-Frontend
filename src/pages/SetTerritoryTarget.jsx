import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const SetTerritoryTarget = () => {
  const location = useLocation();
  const territory = location.state?.territory;

  const [targets, setTargets] = useState(
    territory?.targets.map((t) => ({ ...t, newQuantity: t.quantity })) || []
  );

  const handleChange = (idx, value) => {
    const updated = [...targets];
    updated[idx].newQuantity = Number(value);
    setTargets(updated);
  };

  const handleSave = () => {
    console.log("Updated targets:", targets);
    // 🔹 Call API to save updated target
  };

  return (
    <div className="bg-white p-6">
      <h2 className="text-xl font-bold mb-4">
        Set Target For {territory?.territoryName}
      </h2>
      <p className="mb-2">
        Total Products: {territory?.totalProduct} | Total Target Quantity:{" "}
        {territory?.totalTargetQty}
      </p>

      <div className="overflow-x-auto">
        <table className="table w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th>Sl. No.</th>
              <th>Product Name</th>
              <th>Brand</th>
              <th>Pack Size</th>
              <th className="text-right">Trade Price</th>
              <th className="text-right">Previous Target</th>
              <th className="text-right">New Target</th>
              <th className="text-right">Total TP</th>
            </tr>
          </thead>
          <tbody>
            {targets.map((t, idx) => (
              <tr key={t.productId}>
                <td>{idx + 1}</td>
                <td>{t.productName}</td>
                <td>{t.brand}</td>
                <td>{t.packSize}</td>
                <td className="text-right">{t.tradePrice}</td>
                <td className="text-right">{t.quantity}</td>
                <td className="text-right">
                  <input
                    type="number"
                    value={t.newQuantity}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    className="border border-gray-400 rounded px-2 py-1 w-20 text-right"
                  />
                </td>
                <td className="text-right">{(t.tradePrice * t.newQuantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleSave}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Save Targets
      </button>
    </div>
  );
};

export default SetTerritoryTarget;
