import React, { useState } from "react";
import DamageRequestModal from "../modals/DamageRequestModal";


const SummaryPanel = ({ totals, onPrint }) => {
    const {
        totalUniqueProducts,
        totalUnit,
        totalTP,
        selectedWarehouseProductId,
        warehouseReceiveId
    } = totals;

    const [isModalOpen, setIsModalOpen] = useState(false);

    const addedBy = { name: "Warehouse Manager", email: "warehouse@navantis.com" };

    const handleDamageClick = () => {
        if (!selectedWarehouseProductId || !warehouseReceiveId) {
            console.warn("No warehouse product or receive selected");
            return;
        }

        // ✅ console log as requested
        console.log("Damage request submitted for:");
        console.log("WarehouseProductId:", selectedWarehouseProductId);
        console.log("WarehouseReceiveId:", warehouseReceiveId);

        // Open the damage modal
        setIsModalOpen(true);
    };

    return (
        <>
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
                    <p className="text-xl font-bold">
                        ৳ {Number(totalTP || 0).toFixed(2)}
                    </p>
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
                        onClick={handleDamageClick}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded shadow transition-all"
                    >
                        Submit Damage Request
                    </button>
                </div>
            </div>

            {/* Damage Modal */}
            <DamageRequestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                warehouseReceiveId={warehouseReceiveId}
                addedBy={addedBy}
            />
        </>
    );
};

export default SummaryPanel;
