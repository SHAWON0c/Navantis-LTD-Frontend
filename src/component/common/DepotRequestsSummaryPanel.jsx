import React from "react";

const DepotRequestsSummaryPanel = ({ totals }) => {
  const { totalProducts, totalRequestedQty, totalDepotQty, totalWarehouseQty } = totals;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center mt-4">
      {/* Total Products */}
      <div className="bg-white p-4 rounded shadow text-center">
        <p className="text-gray-500 font-medium">Total Products</p>
        <p className="text-xl font-bold text-blue-700">{totalProducts}</p>
      </div>

      {/* Total Requested Quantity */}
      <div className="bg-white p-4 rounded shadow text-center">
        <p className="text-gray-500 font-medium">Total Requested Qty</p>
        <p className="text-xl font-bold text-blue-700">{totalRequestedQty}</p>
      </div>

      {/* Total Depot Quantity */}
      <div className="bg-white p-4 rounded shadow text-center">
        <p className="text-gray-500 font-medium">Total Depot Qty</p>
        <p className="text-xl font-bold text-blue-700">{totalDepotQty}</p>
      </div>

      {/* Total Warehouse Quantity */}
      <div className="bg-white p-4 rounded shadow text-center">
        <p className="text-gray-500 font-medium">Total Warehouse Qty</p>
        <p className="text-xl font-bold text-blue-700">{totalWarehouseQty}</p>
      </div>
    </div>
  );
};

export default DepotRequestsSummaryPanel;