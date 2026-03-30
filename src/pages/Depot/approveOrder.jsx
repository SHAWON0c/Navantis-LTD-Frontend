
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaClipboardList, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetPendingOrdersQuery,
  useApproveOrderMutation,
  useDeliverOrderMutation,
} from "../../redux/features/orders/orderApi";

import { useAssignRiderMutation, useGetAllRidersQuery } from "../../redux/features/rider/riderApi";
import Loader from "../../component/Loader";
import OrderProductsDetailsModal from "../../component/modals/OrderProductsDetailsModal";
import { ChevronRight } from "lucide-react";
import Card from "../../component/common/Card";
import Button from "../../component/common/Button";
import { MdArrowBack } from "react-icons/md";

const PendingOrdersCard = () => {
  const { data, isLoading, refetch } = useGetPendingOrdersQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const orders = data?.data || [];

  const { data: ridersData } = useGetAllRidersQuery();
  const riders = ridersData?.data || [];

  const [selectedProductOrder, setSelectedProductOrder] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);

  const [approveOrder, { isLoading: isApproving }] = useApproveOrderMutation();
  const [deliverOrder] = useDeliverOrderMutation();
  const [assignRiderApi] = useAssignRiderMutation();
  const navigate = useNavigate();

  if (isLoading) return <Loader />;

  if (!orders.length) {
    return (
      <div className="text-center mt-12">
        <p className="text-gray-500 mb-4 mt-60">No pending orders</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Refresh
        </button>
      </div>
    );
  }

  const handleDeliver = (order) => {
    navigate("/invoice-print", { state: { orderId: order._id } });
  };

  const handleOpenOrderModal = async (orderId) => {
    try {
      const latestResult = await refetch();
      const latestOrders = latestResult?.data?.data || orders;
      const latestOrder = latestOrders.find((item) => item._id === orderId);

      if (!latestOrder) {
        toast.warning("Order is no longer available or already updated.");
        return;
      }

      setSelectedProductOrder(latestOrder);
    } catch (error) {
      console.error("Failed to refresh latest order", error);
      const fallbackOrder = orders.find((item) => item._id === orderId);
      if (fallbackOrder) setSelectedProductOrder(fallbackOrder);
    }
  };

  const assignRider = async (orderId, riderId) => {
    if (!riderId) return;
    try {
      await assignRiderApi({ orderId, riderId, orderStatus: "assigned" }).unwrap();
      toast.success("✅ Rider assigned successfully!");
      refetch();
    } catch (err) {
      console.error("Assign rider error", err);
      toast.error(`❌ Failed to assign rider: ${err?.data?.message || err.message}`);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="small" icon={MdArrowBack} onClick={() => window.history.back()}
              className="ml-2">
              Back
            </Button>
            <div className="bg-white text-gray-500 flex items-center px-3 sm:px-4 md:px-6 py-2 sm:h-12">
              <h2 className="flex flex-wrap items-center text-xs sm:text-sm md:text-base font-semibold text-gray-800 gap-1 sm:gap-2">
                <span>EMS</span>
                <ChevronRight size={14} className="text-gray-400" />
                <span>DEPOT</span>
                <ChevronRight size={14} className="text-gray-400" />
                <span className="text-gray-900 font-bold">PENDING ORDERS</span>
              </h2>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-neutral-500 mr-2 sm:mr-4 md:mr-6">
            Total Products:
          </div>
        </div>
      </Card>

      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {["#", "Customer", "Customer ID", "Territory", "Order Date", "Payment Mode", "Phone", "Actions"].map(
                (th) => (
                  <th
                    key={th}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {th}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order, index) => {
              const isExpanded = expandedRows.includes(order._id);

              return (
                <React.Fragment key={order._id}>
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customer.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customer.customerId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.territory.territoryName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(order.orderDate).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.payMode}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customer.mobile}</td>
                    <td className="px-6 py-4 flex flex-wrap gap-2">
                      {order.orderStatus === "pending" && (
                        <button
                          onClick={() => handleOpenOrderModal(order._id)}
                          className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs md:text-sm transition-colors"
                        >
                          <FaCheck /> Approve
                        </button>
                      )}

                      {order.orderStatus === "confirmed" && !order.assignedRiderId && (
                        <select
                          onChange={(e) => assignRider(order._id, e.target.value)}
                          className="px-3 py-1 text-sm rounded-md border border-gray-300"
                        >
                          <option value="">Assign Rider</option>
                          {riders.map((r) => (
                            <option key={r._id} value={r._id}>{r.name}</option>
                          ))}
                        </select>
                      )}

                      {(order.orderStatus === "assigned" ||
                        (order.orderStatus === "confirmed" && order.assignedRiderId)) && (
                        <button
                          onClick={() => handleDeliver(order)}
                          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs md:text-sm transition-colors"
                        >
                          Deliver & Download Invoice
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenOrderModal(order._id)}
                        className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-xs md:text-sm transition-colors"
                      >
                        <FaClipboardList /> Details
                      </button>
                    </td>
                  </motion.tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProductOrder && (
          <OrderProductsDetailsModal
            isOpen={!!selectedProductOrder}
            order={selectedProductOrder}
            onClose={() => setSelectedProductOrder(null)}
            showApproveButton={true}
            onApprove={async (productsPayload) => {
              try {
                await approveOrder({
                  orderId: selectedProductOrder._id,
                  products: productsPayload,
                }).unwrap();
                toast.success("✅ Order approved successfully!");
                setSelectedProductOrder(null);
                refetch();
              } catch (err) {
                console.error("Approve order error", err);
                toast.error(`❌ Failed to approve order: ${err?.data?.message || err.message}`);
              }
            }}
            isLoading={isApproving}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PendingOrdersCard;

