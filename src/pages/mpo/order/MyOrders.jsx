import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  useGetMpoPendingOrdersQuery,
  useGetMpoDeliveredOrdersQuery,
  useUpdateOrderQuantityMutation,
  useDeleteOrderMutation,
} from "../../../redux/features/orders/orderApi";
import Loader from "../../../component/Loader";
import Card from "../../../component/common/Card";
import Button from "../../../component/common/Button";
import { MdArrowBack } from "react-icons/md";
import { ChevronRight } from "lucide-react";

export default function MyOrders() {
  const [status, setStatus] = useState("pending");
  const [pendingOrders, setPendingOrders] = useState([]);

  const [selectedOrderProducts, setSelectedOrderProducts] = useState([]);
  const [selectedOrderInfo, setSelectedOrderInfo] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [updateOrderQuantity, { isLoading: isUpdatingOrder }] = useUpdateOrderQuantityMutation();
  const [deleteOrderApi, { isLoading: isDeletingOrder }] = useDeleteOrderMutation();

  // Fetch only when needed
  const {
    data: pendingData,
    isLoading: isLoadingPending,
    isFetching: isFetchingPending,
    refetch: refetchPending,
  } = useGetMpoPendingOrdersQuery(undefined, {
    skip: status !== "pending",
  });

  const {
    data: deliveredData,
    isLoading: isLoadingDelivered,
    isFetching: isFetchingDelivered,
    refetch: refetchDelivered,
  } = useGetMpoDeliveredOrdersQuery(undefined, {
    skip: status !== "delivered",
  });

  const deliveredOrders = deliveredData?.data || [];
  const orders = status === "pending" ? pendingOrders : deliveredOrders;

  const isLoading =
    status === "pending" ? isLoadingPending || isFetchingPending : isLoadingDelivered || isFetchingDelivered;

  const formatOrderDate = (dateValue) => {
    if (!dateValue) return "-";
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString();
  };

  useEffect(() => {
    setPendingOrders(pendingData?.data || []);
  }, [pendingData]);

  useEffect(() => {
    // Clear old modal data when status changes
    setSelectedOrderProducts([]);
    setSelectedOrderInfo(null);
    setSelectedOrderId("");
    setIsEditingDetails(false);
    setShowDetailsModal(false);

    // Refetch fresh data
    if (status === "pending") refetchPending();
    else refetchDelivered();
  }, [status]);

  const handleViewDetails = (order) => {
    setSelectedOrderProducts(
      (order?.products || []).map((product) => ({
        ...product,
        productId:
          typeof product.productId === "string"
            ? product.productId
            : product.productId?._id || product._id,
        quantity: Number(product.quantity || 0),
      }))
    );
    setSelectedOrderInfo({
      customerName: order?.customerName || "-",
      customerId: order?.customerNumericId || order?.customerId || "-",
      marketPoint: order?.marketPointName || "-",
      territory: order?.territoryName || "-",
      orderDate: formatOrderDate(order?.orderDate || order?.createdAt),
    });
    setSelectedOrderId(order?._id || "");
    setIsEditingDetails(false);
    setShowDetailsModal(true);
  };

  const handleEditQuantity = (index, value) => {
    const parsedQty = Number(value);
    const safeQty = Number.isNaN(parsedQty) ? 0 : parsedQty;

    setSelectedOrderProducts((prev) =>
      prev.map((product, productIndex) =>
        productIndex === index
          ? { ...product, quantity: Math.max(1, safeQty) }
          : product
      )
    );
  };

  const handleSaveDetailsEdit = async () => {
    if (!selectedOrderId) return;

    try {
      const products = selectedOrderProducts
        .map((product) => ({
          productId:
            typeof product.productId === "string"
              ? product.productId
              : product.productId?._id || product._id,
          quantity: Math.max(1, Number(product.quantity || 1)),
        }))
        .filter((product) => Boolean(product.productId));

      if (products.length === 0) {
        toast.error("❌ No valid productId found for update.");
        return;
      }

      // Backend expects one product update payload at a time:
      // { productId: "...", quantity: number }
      for (const product of products) {
        await updateOrderQuantity({
          orderId: selectedOrderId,
          payload: {
            productId: product.productId,
            quantity: product.quantity,
          },
        }).unwrap();
      }

      setPendingOrders((prev) =>
        prev.map((order) =>
          order._id === selectedOrderId
            ? {
                ...order,
                products: selectedOrderProducts.map((product) => ({
                  ...product,
                  quantity: Math.max(1, Number(product.quantity || 1)),
                })),
              }
            : order
        )
      );

      refetchPending();
      setIsEditingDetails(false);
    } catch (error) {
      console.error("Update order quantity failed", error);
      toast.error(`❌ ${error?.data?.message || "Failed to update order quantities."}`);
    }
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrderId) return;

    try {
      await deleteOrderApi(selectedOrderId).unwrap();

      setPendingOrders((prev) => prev.filter((order) => order._id !== selectedOrderId));
      setShowDetailsModal(false);
      setSelectedOrderProducts([]);
      setSelectedOrderInfo(null);
      setSelectedOrderId("");
      setIsEditingDetails(false);
      refetchPending();
    } catch (error) {
      console.error("Delete order failed", error);
      toast.error(`❌ ${error?.data?.message || "Failed to delete order."}`);
    }
  };

  const handleDeleteOrderById = async (orderId) => {
    if (!orderId) return;

    const isConfirmed = window.confirm("Are you sure you want to delete this order?");
    if (!isConfirmed) return;

    try {
      await deleteOrderApi(orderId).unwrap();
      setPendingOrders((prev) => prev.filter((order) => order._id !== orderId));

      if (selectedOrderId === orderId) {
        setShowDetailsModal(false);
        setSelectedOrderProducts([]);
        setSelectedOrderInfo(null);
        setSelectedOrderId("");
        setIsEditingDetails(false);
      }

      refetchPending();
    } catch (error) {
      console.error("Delete order failed", error);
      toast.error(`❌ ${error?.data?.message || "Failed to delete order."}`);
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
                <span>MPO</span>
                <ChevronRight size={14} className="text-gray-400" />
                <span className="text-gray-900 font-bold">MY ORDERS</span>
              </h2>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-neutral-500 mr-2 sm:mr-4 md:mr-6">
            Total Orders: {orders.length}
          </div>
        </div>
      </Card>

      {/* Status Tabs */}
      <Card className="mb-6">
        <div className="flex gap-3">
          <Button
            variant={status === "pending" ? "primary" : "outline"}
            size="small"
            onClick={() => setStatus("pending")}
          >
            Pending Orders
          </Button>
          <Button
            variant={status === "delivered" ? "primary" : "outline"}
            size="small"
            onClick={() => setStatus("delivered")}
          >
            Delivered Orders
          </Button>
        </div>
      </Card>

      {/* Data Table */}
      {isLoading ? (
        <Loader />
      ) : status === "pending" ? (
        <Card title={status === "pending" ? "Pending Orders" : "Delivered Orders"} subtitle={`Showing ${orders.length} order(s)`}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">SL No</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer Name / ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">MarketPoint</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Territory</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Order Date</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order, idx) => (
                    <tr key={order._id || idx} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="text-center py-3 px-4">{idx + 1}</td>
                      <td className="text-left py-3 px-4">
                        {order.customerName || "-"} / {order.customerNumericId || order.customerId || "-"}
                      </td>
                      <td className="text-left py-3 px-4">{order.marketPointName || "-"}</td>
                      <td className="text-left py-3 px-4">{order.territoryName || "-"}</td>
                      <td className="text-center py-3 px-4">
                        {formatOrderDate(order.orderDate || order.createdAt)}
                      </td>
                      <td className="text-center py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="primary"
                            size="small"
                            onClick={() => handleViewDetails(order)}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="danger"
                            size="small"
                            disabled={isDeletingOrder}
                            onClick={() => handleDeleteOrderById(order._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card title="Delivered Orders" subtitle={`Showing ${deliveredOrders.length} order(s)`}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">SL No</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer Name / ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">MarketPoint</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Territory</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Order Date</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Total Orders</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Details</th>
                </tr>
              </thead>
              <tbody>
                {deliveredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      No delivered orders found
                    </td>
                  </tr>
                ) : (
                  deliveredOrders.map((order, idx) => {
                    const totalQty = (order.products || []).reduce(
                      (sum, product) => sum + Number(product?.quantity || 0),
                      0
                    );

                    return (
                      <tr key={order._id || idx} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="text-center py-3 px-4">{idx + 1}</td>
                        <td className="text-left py-3 px-4">
                          {order.customerName || "-"} / {order.customerNumericId || order.customerId || "-"}
                        </td>
                        <td className="text-left py-3 px-4">{order.marketPointName || "-"}</td>
                        <td className="text-left py-3 px-4">{order.territoryName || "-"}</td>
                        <td className="text-center py-3 px-4">
                          {formatOrderDate(order.orderDate || order.createdAt)}
                        </td>
                        <td className="text-center py-3 px-4">{totalQty}</td>
                        <td className="text-center py-3 px-4">
                          <Button
                            variant="primary"
                            size="small"
                            onClick={() => handleViewDetails(order)}
                          >
                            Details
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Order Products Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 flex items-start sm:items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-lg border border-gray-200 shadow-md p-4 flex flex-col overflow-hidden my-auto">
            <h2 className="text-xl font-semibold mb-4 shrink-0">Order Details</h2>

            <div className="flex-1 min-h-0 overflow-y-auto pr-1">

              {selectedOrderInfo && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mb-4 bg-gray-50 rounded-lg p-3">
                  <p>
                    <span className="font-semibold">Customer:</span> {selectedOrderInfo.customerName} / {selectedOrderInfo.customerId}
                  </p>
                  <p>
                    <span className="font-semibold">MarketPoint:</span> {selectedOrderInfo.marketPoint}
                  </p>
                  <p>
                    <span className="font-semibold">Territory:</span> {selectedOrderInfo.territory}
                  </p>
                  <p>
                    <span className="font-semibold">Order Date:</span> {selectedOrderInfo.orderDate}
                  </p>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200">
                      <th className="text-left py-2 px-4 font-semibold">Product</th>
                      <th className="text-center py-2 px-4 font-semibold">Quantity</th>
                      <th className="text-left py-2 px-4 font-semibold">Batches</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrderProducts.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center py-6 text-gray-500">
                          No products found
                        </td>
                      </tr>
                    ) : (
                      selectedOrderProducts.map((product, index) => (
                        <tr
                          key={product.productId || product._id || `${product.productName}-${index}`}
                          className="border-b border-gray-200"
                        >
                          <td className="text-left py-3 px-4">{product.productName || "-"}</td>
                          <td className="text-center py-3 px-4">
                            {isEditingDetails ? (
                              <input
                                type="number"
                                min={1}
                                value={product.quantity ?? 1}
                                onChange={(event) => handleEditQuantity(index, event.target.value)}
                                className="w-20 border border-gray-300 rounded px-2 py-1 text-center"
                              />
                            ) : (
                              product.quantity ?? 0
                            )}
                          </td>
                          <td className="text-left py-3 px-4">
                            {product.selectedBatches?.length ? (
                              <ul className="space-y-1">
                                {product.selectedBatches.map((batch, batchIndex) => (
                                  <li key={batch._id || `${batch.batchNo}-${batchIndex}`} className="text-xs sm:text-sm">
                                    <span className="font-medium">{batch.batchNo || "-"}</span>
                                    {" "}
                                    ({Number(batch.quantity || 0)})
                                    {" - "}
                                    {batch.expireDate
                                      ? new Date(batch.expireDate).toLocaleDateString()
                                      : "-"}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              "-"
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-2 mt-6 shrink-0">
              {status === "pending" && (
                <>
                  <Button
                    variant={isEditingDetails ? "secondary" : "outline"}
                    disabled={isUpdatingOrder}
                    onClick={() => {
                      if (!isEditingDetails) {
                        setIsEditingDetails(true);
                        return;
                      }
                      handleSaveDetailsEdit();
                    }}
                  >
                    {isEditingDetails ? "Save" : "Edit"}
                  </Button>

                  {isEditingDetails && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        const order = pendingOrders.find((item) => item._id === selectedOrderId);
                        setSelectedOrderProducts(
                          (order?.products || []).map((product) => ({
                            ...product,
                            quantity: Number(product.quantity || 0),
                          }))
                        );
                        setIsEditingDetails(false);
                      }}
                    >
                      Cancel Edit
                    </Button>
                  )}

                  <Button
                    variant="danger"
                    disabled={isDeletingOrder}
                    onClick={handleDeleteOrder}
                  >
                    Delete Order
                  </Button>
                </>
              )}

              <Button
                variant="danger"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}