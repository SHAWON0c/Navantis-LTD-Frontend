
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaClipboardList, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  useGetPendingOrdersQuery,
  useApproveOrderMutation,
  useDeliverOrderMutation,
} from "../../redux/features/orders/orderApi";
import {
  useGetPendingInstituteOrdersQuery,
  useApproveInstituteOrderMutation,
  useDeliverInstituteOrderMutation,
  useAssignRiderToInstituteOrderMutation,
} from "../../redux/features/institutes/instituteOrderApi";

import { useAssignRiderMutation, useGetAllRidersQuery } from "../../redux/features/rider/riderApi";
import Loader from "../../component/Loader";
import OrderProductsDetailsModal from "../../component/modals/OrderProductsDetailsModal";
import { ChevronRight } from "lucide-react";
import Card from "../../component/common/Card";
import Button from "../../component/common/Button";
import { MdArrowBack } from "react-icons/md";
import getErrorMessage from "../../utils/getErrorMessage";

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const getErrorDetails = (error) => {
  if (!error) return "No extra error details were provided.";

  if (Array.isArray(error?.data?.errors) && error.data.errors.length > 0) {
    return error.data.errors
      .map((item) => {
        if (typeof item === "string") return item;
        if (item?.message) return item.message;
        return JSON.stringify(item);
      })
      .join("\n");
  }

  if (typeof error?.data === "string") return error.data;
  if (error?.error && typeof error.error === "string") return error.error;
  if (error?.message && typeof error.message === "string") return error.message;

  try {
    return JSON.stringify(error?.data || error, null, 2);
  } catch {
    return "No extra error details were provided.";
  }
};

const showErrorPopup = (title, error) => {
  const primaryMessage = getErrorMessage(error);
  const details = getErrorDetails(error);

  Swal.fire({
    icon: "error",
    title,
    text: primaryMessage,
    html: `
      <div class="text-left mt-2">
        <p class="font-semibold mb-2">Error details</p>
        <pre style="max-height: 180px; overflow: auto; text-align: left; white-space: pre-wrap; word-break: break-word; background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px; font-size: 12px;">${escapeHtml(details)}</pre>
      </div>
    `,
    confirmButtonText: "OK",
  });
};

const PendingOrdersCard = () => {
  const [orderType, setOrderType] = useState("customer");

  // Customer Orders
  const { data: customerData, isLoading: isCustomerLoading, refetch: refetchCustomer } = useGetPendingOrdersQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const customerOrders = customerData?.data || [];

  // Institute Orders
  const { data: instituteData, isLoading: isInstituteLoading, refetch: refetchInstitute } = useGetPendingInstituteOrdersQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  
  // Handle institute data - it could be directly an array or wrapped in .data
  const instituteOrders = Array.isArray(instituteData) 
    ? instituteData 
    : (instituteData?.data || []);

  const orders = orderType === "customer" ? customerOrders : instituteOrders;
  const isLoading = orderType === "customer" ? isCustomerLoading : isInstituteLoading;
  const refetch = orderType === "customer" ? refetchCustomer : refetchInstitute;

  const { data: ridersData } = useGetAllRidersQuery();
  const riders = ridersData?.data || [];

  const [selectedProductOrder, setSelectedProductOrder] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);

  // Customer mutations
  const [approveOrder, { isLoading: isApproving }] = useApproveOrderMutation();
  const [deliverOrder] = useDeliverOrderMutation();
  const [assignRiderApi] = useAssignRiderMutation();

  // Institute mutations
  const [approveInstituteOrder, { isLoading: isApprovingInstitute }] = useApproveInstituteOrderMutation();
  const [deliverInstituteOrder] = useDeliverInstituteOrderMutation();
  const [assignRiderToInstitute] = useAssignRiderToInstituteOrderMutation();

  const navigate = useNavigate();

  if (isLoading) return <Loader />;

  const handleDeliver = (order) => {
    if (orderType === "institute") {
      navigate("/institutes/invoice-print", { state: { orderId: order._id, orderType: "institute" } });
    } else {
      navigate("/invoice-print", { state: { orderId: order._id, orderType: "customer" } });
    }
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
      showErrorPopup("Failed to refresh order", error);
      const fallbackOrder = orders.find((item) => item._id === orderId);
      if (fallbackOrder) setSelectedProductOrder(fallbackOrder);
    }
  };

  const assignRider = async (orderId, riderId) => {
    if (!riderId) return;
    try {
      if (orderType === "customer") {
        await assignRiderApi({ orderId, riderId, orderStatus: "assigned" }).unwrap();
      } else {
        await assignRiderToInstitute({ orderId, riderId }).unwrap();
      }
      toast.success("✅ Rider assigned successfully!");
      refetch();
    } catch (err) {
      console.error("Assign rider error", err);
      toast.error(`❌ Failed to assign rider: ${err?.data?.message || err.message}`);
      showErrorPopup("Failed to assign rider", err);
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
                <span className="text-gray-900 font-bold">ORDER DELIVERY</span>
              </h2>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-neutral-500 mr-2 sm:mr-4 md:mr-6">
            Total {orderType === "customer" ? "Customer" : "Institute"} Orders: {orders.length}
          </div>
        </div>
      </Card>

      {/* Order Type Toggle */}
      <Card className="mb-6">
        <div className="flex gap-3">
          <button
            onClick={() => setOrderType("customer")}
            className={`px-6 py-2 rounded-md font-semibold transition-colors ${
              orderType === "customer"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
           Customer Orders ({customerOrders.length})
          </button>
          <button
            onClick={() => setOrderType("institute")}
            className={`px-6 py-2 rounded-md font-semibold transition-colors ${
              orderType === "institute"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
             Institute Orders ({instituteOrders.length})
          </button>
        </div>
      </Card>

      {!orders.length ? (
        <div className="text-center p-8 bg-white shadow rounded-xl">
          <p className="text-gray-500 mb-4">No pending {orderType} orders</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {orderType === "customer"
                ? ["#", "Customer", "Customer ID", "Territory", "Order Date", "Payment Mode", "Phone", "Actions"].map((th) => (
                    <th
                      key={th}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {th}
                    </th>
                  ))
                : ["#", "Institute", "Order Date", "Total Items", "Payment Status", "Order Status", "Actions"].map((th) => (
                    <th
                      key={th}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {th}
                    </th>
                  ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order, index) => {
              const isExpanded = expandedRows.includes(order._id);

              if (orderType === "customer") {
                // Customer Order Row
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
                            Deliver & Invoice
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
              } else {
                // Institute Order Row
                return (
                  <React.Fragment key={order._id}>
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.institute?.instituteName || "N/A"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(order.createdAt || order.orderDate).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {order.products?.length || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          order.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {order.paymentStatus || "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          order.orderStatus === "pending" ? "bg-red-100 text-red-700" :
                          order.orderStatus === "confirmed" ? "bg-blue-100 text-blue-700" :
                          order.orderStatus === "assigned" ? "bg-purple-100 text-purple-700" :
                          "bg-green-100 text-green-700"
                        }`}>
                          {order.orderStatus || "Unknown"}
                        </span>
                      </td>
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
                            Deliver & Invoice
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
              }
            })}
          </tbody>
        </table>
        </div>
      )}

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
                if (orderType === "customer") {
                  await approveOrder({
                    orderId: selectedProductOrder._id,
                    products: productsPayload,
                  }).unwrap();
                } else {
                  // Institute order approval
                  await approveInstituteOrder({
                    orderId: selectedProductOrder._id,
                    products: productsPayload,
                  }).unwrap();
                }
                toast.success("✅ Order approved successfully!");
                setSelectedProductOrder(null);
                refetch();
              } catch (err) {
                console.error("Approve order error", err);
                toast.error(`❌ Failed to approve order: ${err?.data?.message || err.message}`);
                showErrorPopup("Failed to approve order", err);
              }
            }}
            isLoading={orderType === "customer" ? isApproving : isApprovingInstitute}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PendingOrdersCard;

