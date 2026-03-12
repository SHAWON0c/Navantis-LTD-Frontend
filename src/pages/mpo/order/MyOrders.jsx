import React, { useEffect, useState } from "react";
import {
  useGetMpoPendingOrdersQuery,
  useGetMpoDeliveredOrdersQuery,
} from "../../../redux/features/orders/orderApi";
import Loader from "../../../component/Loader";
import Card from "../../../component/common/Card";
import Button from "../../../component/common/Button";
import { MdArrowBack } from "react-icons/md";
import { ChevronRight } from "lucide-react";

export default function MyOrders() {
  const [status, setStatus] = useState("pending");
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [showModal, setShowModal] = useState(false);

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

  const orders =
    status === "pending" ? pendingData?.data || [] : deliveredData?.data || [];

  const isLoading =
    status === "pending" ? isLoadingPending || isFetchingPending : isLoadingDelivered || isFetchingDelivered;

  useEffect(() => {
    // Clear old modal data when status changes
    setSelectedBatches([]);
    setShowModal(false);

    // Refetch fresh data
    if (status === "pending") refetchPending();
    else refetchDelivered();
  }, [status]);

  const handleBatchesClick = (batches) => {
    setSelectedBatches(batches || []);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
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
                <span className="text-gray-900 font-bold">PLACE ORDER</span>
              </h2>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-neutral-500 mr-2 sm:mr-4 md:mr-6">
            Total Products: {orders.length}
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
      ) : (
        <Card title={status === "pending" ? "Pending Orders" : "Delivered Orders"} subtitle={`Showing ${orders.length} order(s)`}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">SL No</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer Name / ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">MarketPoint</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Territory</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Order Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Product</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Quantity</th>
                  {status === "delivered" && (
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Batches</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={status === "delivered" ? 8 : 7} className="text-center py-8 text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order, idx) =>
                    order.products.map((prod, pIdx) => (
                      <tr key={`${order._id}-${prod.productId}`} className="border-b border-gray-200 hover:bg-gray-50">
                        {pIdx === 0 && (
                          <>
                            <td className="text-center py-3 px-4" rowSpan={order.products.length}>
                              {idx + 1}
                            </td>
                            <td className="text-left py-3 px-4" rowSpan={order.products.length}>
                              {order.customerName || "-"} / {order.customerNumericId || "-"}
                            </td>
                            <td className="text-left py-3 px-4" rowSpan={order.products.length}>
                              {order.marketPointName || "-"}
                            </td>
                            <td className="text-left py-3 px-4" rowSpan={order.products.length}>
                              {order.territoryName || "-"}
                            </td>
                            <td className="text-center py-3 px-4" rowSpan={order.products.length}>
                              {new Date(order.orderDate).toLocaleDateString()}
                            </td>
                          </>
                        )}
                        <td className="text-left py-3 px-4">{prod.productName}</td>
                        <td className="text-center py-3 px-4">{prod.quantity}</td>
                        {status === "delivered" && (
                          <td className="text-center py-3 px-4">
                            {prod.selectedBatches?.length > 0 ? (
                              <Button
                                variant="primary"
                                size="small"
                                onClick={() => handleBatchesClick(prod.selectedBatches)}
                              >
                                View Batches
                              </Button>
                            ) : (
                              "-"
                            )}
                          </td>
                        )}
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Batch Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <Card className="w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">Selected Batches</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="text-left py-2 px-4 font-semibold">Batch No</th>
                    <th className="text-center py-2 px-4 font-semibold">Expire Date</th>
                    <th className="text-center py-2 px-4 font-semibold">Quantity</th>
                    <th className="text-center py-2 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedBatches.map((b) => (
                    <tr key={b._id} className="border-b border-gray-200">
                      <td className="text-left py-3 px-4">{b.batchNo}</td>
                      <td className="text-center py-3 px-4">{new Date(b.expireDate).toLocaleDateString()}</td>
                      <td className="text-center py-3 px-4">{b.quantity}</td>
                      <td className="text-center py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${b.isExpired ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {b.isExpired ? "Expired" : "Valid"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="danger"
                onClick={() => setShowModal(false)}
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}