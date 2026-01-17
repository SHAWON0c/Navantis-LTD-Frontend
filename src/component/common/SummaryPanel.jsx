import React from "react";

const SummaryPanel = ({ totals, onPrint, onDamageRequest }) => {
    const { totalUniqueProducts, totalUnit, totalTP } = totals;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Total Unique Products */}
            <div className="bg-white p-4 rounded shadow text-center">
                <p className="text-gray-500 font-medium">Unique Products</p>
                <p className="text-xl font-bold">{totalUniqueProducts}</p>
            </div>

            {/* Total Units */}
            <div className="bg-white p-4 rounded shadow text-center">
                <p className="text-gray-500 font-medium">Total Units</p>
                <p className="text-xl font-bold">{totalUnit}</p>
            </div>

            {/* Total Trade Price */}
            <div className="bg-white p-4 rounded shadow text-center">
                <p className="text-gray-500 font-medium">Total Trade Price</p>
                <p className="text-xl font-bold">৳ {totalTP.toFixed(2)}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center md:justify-end gap-2">
                <button
                    onClick={onPrint}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded shadow transition-all"
                >
                    Print product list
                </button>

                <button
                    onClick={onDamageRequest}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 text-sm py-2 rounded shadow transition-all"
                >
                    Submit Damage Request
                </button>
            </div>
        </div>
    );
};

export default SummaryPanel;
