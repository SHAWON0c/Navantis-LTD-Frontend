import React, { useState, useEffect, useRef } from "react";
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
  const scrollBodyRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !order) return;

    const initProducts = (order.products || []).map((p) => {
      const sourceBatches = Array.isArray(p.batches)
        ? p.batches
        : Array.isArray(p.selectedBatches)
        ? p.selectedBatches
        : [];

      return {
        ...p,
        batches: sourceBatches.map((b) => ({
          ...b,
          depotProductId: b.depotProductId || b._id,
          totalQuantity: Number(b.totalQuantity ?? b.quantity ?? 0),
          selectedQuantity: 0,
        })),
      };
    });

    setProductsState(initProducts);
  }, [isOpen, order]);

  useEffect(() => {
    if (!isOpen) {
      setProductsState([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [isOpen]);

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
      // Extract product ID if it's an object, otherwise use as string
      const productId = typeof p.productId === "object" ? p.productId._id : p.productId;
      
      if (p.batchCount === 1) return { productId };
      
      const selectedBatches = p.batches
        .filter((b) => b.selectedQuantity > 0)
        .map((b) => ({ depotProductId: b.depotProductId, quantity: b.selectedQuantity }));
      return { productId, selectedBatches };
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
        className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-3 sm:p-5 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-5xl relative overflow-hidden flex flex-col my-auto"
          style={{ height: "70vh", maxHeight: "70vh", minHeight: "420px" }}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition"
            onClick={onClose}
          >
            <FaTimes size={20} />
          </button>

          <div className="px-6 pt-6 pb-4 border-b border-gray-200 shrink-0">
            <h2 className="text-2xl font-semibold">Ordered Products</h2>
          </div>

          <div
            ref={scrollBodyRef}
            className="flex-1 min-h-0 overflow-y-scroll overscroll-contain px-6 py-4"
          >
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-800">
                  <th className="px-4 py-3 border-b border-gray-300 text-left">Product</th>
                  <th className="px-4 py-3 border-b border-gray-300 text-left">Net Weight</th>
                  <th className="px-4 py-3 border-b border-gray-300 text-left">TP</th>
                  <th className="px-4 py-3 border-b border-gray-300 text-left">Order Qty</th>
                  <th className="px-4 py-3 border-b border-gray-300 text-left">Delivered Qty</th>
                  <th className="px-4 py-3 border-b border-gray-300 text-left">Available Qty</th>
                  <th className="px-4 py-3 border-b border-gray-300 text-left">Expire</th>
                  <th className="px-4 py-3 border-b border-gray-300 text-left">Delivery</th>
                </tr>
              </thead>
              <tbody>
                {productsState.map((p) => {
                  const hasAnySelection = p.batches.some((batch) => batch.selectedQuantity > 0);
                  const deliveredQty = getTotalSelectedQuantity(p);
                  const orderQty = Number(p.quantity) || 0;
                  const isMatched = deliveredQty === orderQty;

                  return p.batches.map((b, index) => (
                    <tr
                      key={b.depotProductId}
                      className={`${
                        b.selectedQuantity > 0
                          ? "bg-amber-50 hover:bg-amber-100"
                          : "hover:bg-gray-50"
                      } ${index === 0 ? "border-t-2 border-t-gray-200" : ""}`}
                    >
                      {index === 0 && (
                        <>
                          <td
                            rowSpan={p.batches.length}
                            className={`px-4 py-3 border-b border-gray-300 align-top font-medium ${
                              hasAnySelection ? "bg-amber-50" : ""
                            }`}
                          >
                            {p.productName}
                          </td>
                          <td
                            rowSpan={p.batches.length}
                            className={`px-4 py-3 border-b border-gray-300 align-top ${
                              hasAnySelection ? "bg-amber-50" : ""
                            }`}
                          >
                            {p.packSize}
                          </td>
                          <td
                            rowSpan={p.batches.length}
                            className={`px-4 py-3 border-b border-gray-300 align-top ${
                              hasAnySelection ? "bg-amber-50" : ""
                            }`}
                          >
                            {p.tradePrice}
                          </td>
                          <td
                            rowSpan={p.batches.length}
                            className={`px-4 py-3 border-b border-gray-300 text-center text-red-500 align-top ${
                              hasAnySelection ? "bg-amber-50" : ""
                            }`}
                          >
                            {p.quantity}
                          </td>
                          <td
                            rowSpan={p.batches.length}
                            className={`px-4 py-3 border-b border-gray-300 text-center align-top ${
                              hasAnySelection ? "bg-amber-50" : ""
                            }`}
                          >
                            <div className="font-semibold text-gray-800">
                              {deliveredQty} / {orderQty}
                            </div>
                            <div
                              className={`text-xs font-medium mt-1 ${
                                isMatched ? "text-green-600" : "text-orange-600"
                              }`}
                            >
                              {isMatched ? "Matched" : "Not Matched"}
                            </div>
                          </td>
                        </>
                      )}

                      <td className="px-4 py-3 border-b border-gray-300">{b.totalQuantity}</td>
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
                          onChange={(e) => {
                            const rawValue = e.target.value;
                            if (rawValue === "") {
                              handleBatchChange(p.productId, b.depotProductId, 0);
                              return;
                            }

                            let value = Number(rawValue);
                            const maxAllowed = Math.min(
                              b.totalQuantity,
                              p.quantity - getTotalSelectedQuantity(p) + b.selectedQuantity
                            );
                            if (value > maxAllowed) value = maxAllowed;
                            if (value < 0) value = 0;
                            handleBatchChange(p.productId, b.depotProductId, value);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                              e.preventDefault();
                            }
                          }}
                          onWheel={(e) => e.currentTarget.blur()}
                          className={`w-20 border rounded px-2 py-1 text-center focus:outline-none focus:ring-2 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
                            b.selectedQuantity > 0
                              ? "border-amber-600 bg-amber-100 text-amber-900 focus:ring-amber-500"
                              : "border-gray-400 bg-white text-gray-900 focus:ring-blue-500"
                          }`}
                          value={b.selectedQuantity === 0 ? "" : b.selectedQuantity}
                        />
                      </td>
                    </tr>
                  ));
                })}
              </tbody>
              </table>
            </div>
          </div>

          {/* Buttons */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-4 shrink-0">
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