import React from "react";

/**
 * UniversalSummaryPanel
 * 
 * Props:
 * - totals: object where keys are labels and values are numbers or strings
 * Example:
 *   totals = {
 *     "Total Products": 10,
 *     "Total Order Quantity": 50,
 *     "Total Stock Quantity": 30,
 *     "Total Missing Quantity": 70
 *   }
 */
const UniversalSummaryPanel = ({ totals }) => {
  if (!totals || typeof totals !== "object") return null;

  const entries = Object.entries(totals);

  return (
    <div className="flex flex-nowrap overflow-x-auto gap-4 mt-4">
      {entries.map(([label, value], idx) => (
        <div
          key={idx}
          className="flex-shrink-0 bg-white p-4 rounded shadow text-center min-w-80"
        >
          <p className="text-gray-500 font-medium">{label}</p>
          <p className="text-xl font-bold text-blue-700">{value}</p>
        </div>
      ))}
    </div>
  );
};

export default UniversalSummaryPanel;