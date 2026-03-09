import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

const OrderProductsDetailsModal = ({
  isOpen,
  order,
  onClose,
  onApprove,
  showApproveButton = true,
  isLoading = false,
}) => {
  const [productsState, setProductsState] = useState([]);

  useEffect(() => {
    if (order) {
      const initProducts = order.products.map((p) => ({
        ...p,
        batches: p.batches.map((b) => ({ ...b, selectedQuantity: 0 })),
      }));
      setProductsState(initProducts);
    }
  }, [order]);

  // Calculate total selected quantity for a product
  const getTotalSelectedQuantity = (product) =>
    product.batches.reduce((sum, b) => sum + b.selectedQuantity, 0);

  const handleBatchChange = (productId, depotProductId, value) => {
    setProductsState((prev) =>
      prev.map((p) =>
        p.productId === productId
          ? {
              ...p,
              batches: p.batches.map((b) =>
                b.depotProductId === depotProductId
                  ? { ...b, selectedQuantity: Number(value) }
                  : b
              ),
            }
          : p
      )
    );
  };

  const handleApproveClick = () => {
    const payload = productsState.map((p) => {
      if (p.batchCount === 1) return { productId: p.productId };
      const selectedBatches = p.batches
        .filter((b) => b.selectedQuantity > 0)
        .map((b) => ({ depotProductId: b.depotProductId, quantity: b.selectedQuantity }));
      return { productId: p.productId, selectedBatches };
    });

    onApprove(payload);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-6 relative"
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition"
            onClick={onClose}
          >
            <FaTimes size={20} />
          </button>

          <h2 className="text-2xl font-semibold mb-6">Ordered Products</h2>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-800">
                  <th className="px-4 py-3 border-b border-gray-300 text-left">Product</th>
                  <th className="px-4 py-3 border-b border-gray-300 text-left">Net Weight</th>
                  <th className="px-4 py-3 border-b border-gray-300 text-left">TP</th>
                  <th className="px-4 py-3 border-b border-gray-300 text-left">Order Qty</th>
                  <th className="px-4 py-3 border-b border-gray-300 text-left">Available Qty</th>
                  <th className="px-4 py-3 border-b border-gray-300 text-left">Expire</th>
                  <th className="px-4 py-3 border-b border-gray-300 text-left">Delivery</th>
                </tr>
              </thead>
              <tbody>
                {productsState.map((p) =>
                  p.batches.map((b, index) => (
                    <tr key={b.depotProductId} className="hover:bg-gray-50">
                      <td className="px-4 py-3 border-b border-gray-300">{p.productName}</td>
                      <td className="px-4 py-3 border-b border-gray-300">{p.packSize}</td>
                      <td className="px-4 py-3 border-b border-gray-300">{p.tradePrice}</td>

                      {/* Show Order Qty once per product */}
                      {index === 0 && (
                        <td
                          className="px-4 py-3 border-b border-gray-300 text-center text-red-500"
                          rowSpan={p.batches.length}
                        >
                          {p.quantity}
                        </td>
                      )}

                      <td className="px-4 py-3 border-b  border-gray-300">{b.totalQuantity}</td>
                      <td className="px-4 py-3 border-b border-gray-300">
                        {new Date(b.expireDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-300">
                        <input
                          type="number"
                          min={0}
                          max={Math.min(
                            b.totalQuantity,
                            p.quantity - getTotalSelectedQuantity(p) + b.selectedQuantity
                          )}
                          value={b.selectedQuantity}
                          onChange={(e) => {
                            let value = Number(e.target.value);
                            const maxAllowed = Math.min(
                              b.totalQuantity,
                              p.quantity - getTotalSelectedQuantity(p) + b.selectedQuantity
                            );
                            if (value > maxAllowed) value = maxAllowed;
                            if (value < 0) value = 0;
                            handleBatchChange(p.productId, b.depotProductId, value);
                          }}
                          className="w-20 border border-gray-300 rounded px-2 py-1 text-center focus:outline-none focus:ring-1 focus:ring-gray-500"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition"
            >
              Close
            </button>
            {showApproveButton && (
              <button
                onClick={handleApproveClick}
                disabled={isLoading}
                className={`px-6 py-2 font-semibold rounded text-white transition ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {isLoading ? "Processing..." : "Deliver"}
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OrderProductsDetailsModal;