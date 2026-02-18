// src/components/PendingOrdersCard.jsx



import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaIdBadge,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaHome,
  FaMoneyBillWave,
  FaPhone,
  FaBoxOpen,
  FaHistory,
  FaClipboardList,
} from "react-icons/fa";

import OrderProductsDetailsModal from "../../component/modals/OrderProductsDetailsModal";
import {
  useGetPendingOrdersQuery,
  useApproveOrderMutation,
} from "../../redux/features/orders/orderApi";
import Loader from "../../component/Loader";

// Info Cell Component
const InfoCell = ({ icon, label, value }) => (
  <div className="flex items-center gap-2">
    {icon && <span className="text-lg">{icon}</span>}
    <div className="flex flex-col">
      <span className="uppercase tracking-wide text-gray-400 text-xs md:text-sm">{label}</span>
      <span className="text-gray-700 font-medium text-sm md:text-base">{value}</span>
    </div>
  </div>
);

const PendingOrdersCard = () => {
  const { data, isLoading, refetch } = useGetPendingOrdersQuery();
  const orders = data?.data || [];

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProductOrder, setSelectedProductOrder] = useState(null);
  const [approveOrder] = useApproveOrderMutation();

const handleApprove = async (orderId) => {
  try {
    await approveOrder(orderId).unwrap(); // PATCH request

    // Close any open modal if the approved order is selected
    if (selectedOrder?.orderId === orderId) setSelectedOrder(null);
    if (selectedProductOrder?.orderId === orderId) setSelectedProductOrder(null);

    alert("✅ Order approved successfully!"); // show success alert
    refetch(); // Refetch pending orders
  } catch (err) {
    console.error(err);
    alert("❌ Failed to approve order");
  }
};


  if (isLoading)
    return <Loader></Loader>
  if (!orders.length)
    return <p className="text-center mt-12 text-gray-500">No pending orders</p>;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen space-y-6">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-6">
        Pending Orders
      </h1>

      {orders.map((order, index) => (
        <motion.div
          key={order.orderId}
          className="bg-white rounded-2xl shadow-md p-6 border border-gray-300 relative"
        >
          {/* Serial Number */}
          <div className="absolute top-3 left-3 bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
            {index + 1}
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 border border-gray-300 p-4 rounded-lg">
            <InfoCell icon={<FaUser className="text-pink-500" />} label="Customer Name" value={order.customer.customerName} />
            <InfoCell icon={<FaIdBadge className="text-indigo-500" />} label="Customer ID" value={order.customer.customerId} />
            <InfoCell icon={<FaMapMarkerAlt className="text-green-500" />} label="Territory" value={order.territory.territoryName} />
            <InfoCell icon={<FaCalendarAlt className="text-yellow-500" />} label="Order Date" value={new Date(order.orderDate).toLocaleDateString("en-GB")} />
            <InfoCell icon={<FaHome className="text-purple-500" />} label="Address" value={order.customer.address} />
            <InfoCell icon={<FaMoneyBillWave className="text-teal-500" />} label="Payment Mode" value={order.payMode} />
            <InfoCell icon={<FaPhone className="text-orange-500" />} label="Order By" value={order.customer.phoneNumber} />
            <InfoCell icon={<FaPhone className="text-red-500" />} label="Phone" value={order.customer.phoneNumber} />
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex flex-wrap justify-between items-center">
            {/* Left Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedOrder(order)}
                className="bg-blue-500 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2"
              >
                <FaClipboardList className="text-yellow-300" /> View Details
              </button>
              <button
                onClick={() => setSelectedOrder(order)}
                className="bg-blue-500 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2"
              >
                <FaHistory className="text-pink-300" /> Customer History
              </button>
            </div>

            {/* Right Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedProductOrder(order)}
                className="bg-blue-500 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2"
              >
                <FaBoxOpen className="text-green-300" /> View Products
              </button>
              <button
                onClick={() => handleApprove(order.orderId)}
                className="bg-green-500 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2"
              >
                Approve
              </button>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Modals */}
      <AnimatePresence>
        {selectedOrder && (
          <ModalDummy
            isOpen={!!selectedOrder}
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
        {selectedProductOrder && (
          <OrderProductsDetailsModal
            isOpen={!!selectedProductOrder}
            order={selectedProductOrder}
            onClose={() => setSelectedProductOrder(null)}
            onDeliver={handleApprove} // PATCH call
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Temporary modal for View Details / History
const ModalDummy = ({ isOpen, order, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Order Details (Dummy)</h2>
        <p>Customer: {order.customer.customerName}</p>
        <p>Customer ID: {order.customer.customerId}</p>
        <p>Territory: {order.territory.territoryName}</p>
        <p>Order Date: {new Date(order.orderDate).toLocaleDateString("en-GB")}</p>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-6 py-2 rounded-xl font-semibold flex items-center gap-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendingOrdersCard;
