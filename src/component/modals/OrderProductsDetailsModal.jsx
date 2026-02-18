// src/components/OrderProductsDetailsModal.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaClipboardList, FaTruck } from "react-icons/fa";
import PropTypes from "prop-types";

const OrderProductsDetailsModal = ({ isOpen, onClose, order, onDeliver }) => {
  const [deliveryQty, setDeliveryQty] = useState({});

  if (!isOpen || !order) return null;

  const handleQtyChange = (productId, value, maxQty) => {
    const qty = Math.min(Math.max(Number(value), 0), maxQty);
    setDeliveryQty((prev) => ({ ...prev, [productId]: qty }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl w-full max-w-5xl p-6 shadow-lg overflow-auto max-h-[90vh]"
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Ordered Products</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b border-gray-300">Product</th>
                <th className="py-2 px-4 border-b border-gray-300">Net Weight</th>
                <th className="py-2 px-4 border-b border-gray-300">TP</th>
                <th className="py-2 px-4 border-b border-gray-300">Order Qty</th>
                <th className="py-2 px-4 border-b border-gray-300">Available Qty</th>
                <th className="py-2 px-4 border-b border-gray-300">Expire</th>
                <th className="py-2 px-4 border-b border-gray-300">Deliver Qty</th>
              </tr>
            </thead>
            <tbody>
              {order.products.map((p) => (
                <tr key={p.productId}>
                  <td className="py-2 px-4 border-b border-gray-300">{p.productName}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{p.packSize}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{p.tradePrice}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{p.quantity}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{p.depotTotalQuantity ?? 0}</td>
                  <td className="py-2 px-4 border-b border-gray-300">
                    {p.earliestExpiryDate
                      ? new Date(p.earliestExpiryDate).toLocaleDateString("en-GB", {
                          month: "2-digit",
                          year: "2-digit",
                        })
                      : "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300">
                    <input
                      type="number"
                      min={0}
                      max={p.quantity}
                      value={deliveryQty[p.productId] ?? p.quantity}
                      onChange={(e) => handleQtyChange(p.productId, e.target.value, p.quantity)}
                      className="w-16 border border-gray-300 rounded px-2 py-1"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Buttons: Close + Deliver aligned right */}
        <div className="mt-6 flex justify-end gap-3 flex-wrap">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-6 py-2 rounded-xl font-semibold flex items-center gap-2"
          >
            <FaClipboardList className="text-white" /> Close
          </button>
          <button
            onClick={() => {
              // Deliver all products with their entered quantities
              order.products.forEach((p) =>
                onDeliver(order.orderId, p.productId, deliveryQty[p.productId] ?? p.quantity)
              );
            }}
            className="bg-green-500 text-white px-6 py-2 rounded-xl font-semibold flex items-center gap-2"
          >
            <FaTruck className="text-white" /> Approve Order
          </button>
        </div>
      </motion.div>
    </div>
  );
};

OrderProductsDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  order: PropTypes.object,
  onDeliver: PropTypes.func.isRequired,
};

export default OrderProductsDetailsModal;
