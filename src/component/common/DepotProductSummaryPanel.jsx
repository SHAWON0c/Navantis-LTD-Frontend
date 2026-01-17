import React from "react";

const DepotProductSummaryPanel = ({ totals, onRequest, onReturn, onExpireReturn, onPrint }) => {
    const { totalUniqueProducts, totalUnit, totalTP } = totals;

    return (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
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

            {/* Action Buttons (Professional Layout, Left-aligned, Single Row) */}
            <div className="flex flex-wrap md:flex-nowrap items-center gap-3">
                <button
                    onClick={onRequest}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-2 rounded shadow-md transition duration-200 whitespace-nowrap"
                >
                    Request Products
                </button>

                <button
                    onClick={onReturn}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium text-sm px-6 py-2 rounded shadow-md transition duration-200 whitespace-nowrap"
                >
                    Return Product
                </button>

                <button
                    onClick={onExpireReturn}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium text-sm px-6 py-2 rounded shadow-md transition duration-200 whitespace-nowrap"
                >
                    Expire Return
                </button>

                <button
                    onClick={onPrint}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium text-sm px-6 py-2 rounded shadow-md transition duration-200 whitespace-nowrap"
                >
                    Print Current Stock
                </button>
            </div>
        </div>
    );
};

export default DepotProductSummaryPanel;
