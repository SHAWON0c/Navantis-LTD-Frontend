import React, { useEffect, useState } from "react";
import {
  useGetMpoPendingOrdersQuery,
  useGetMpoDeliveredOrdersQuery,
} from "../../../redux/features/orders/orderApi";
import Loader from "../../../component/Loader";

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
    <div className="p-4">
      {/* Tabs */}
      <div className="flex gap-3 mb-4">
        <button
          className={`px-4 py-2 rounded-lg font-semibold ${
            status === "pending" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setStatus("pending")}
        >
          Pending
        </button>

        <button
          className={`px-4 py-2 rounded-lg font-semibold ${
            status === "delivered" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setStatus("delivered")}
        >
          Delivered
        </button>
      </div>

      {/* Loading */}
      {isLoading ? (
       <Loader></Loader>
      ) : orders.length === 0 ? (
        <p className="text-center py-8 text-gray-500">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border border-gray-300 text-sm md:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">SL No</th>
                <th className="border px-3 py-2">Customer Name / ID</th>
                <th className="border px-3 py-2">MarketPoint</th>
                <th className="border px-3 py-2">Territory</th>
                <th className="border px-3 py-2">Order Date</th>
                <th className="border px-3 py-2">Product</th>
                <th className="border px-3 py-2">Quantity</th>
                {status === "delivered" && (
                  <th className="border px-3 py-2">Selected Batches</th>
                )}
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) =>
                order.products.map((prod, pIdx) => (
                  <tr key={`${order._id}-${prod.productId}`}>
                    {pIdx === 0 && (
                      <>
                        <td className="border px-3 py-2" rowSpan={order.products.length}>
                          {idx + 1}
                        </td>
                        <td className="border px-3 py-2" rowSpan={order.products.length}>
                          {order.customerName || "-"} / {order.customerNumericId || "-"}
                        </td>
                        <td className="border px-3 py-2" rowSpan={order.products.length}>
                          {order.marketPointName || "-"}
                        </td>
                        <td className="border px-3 py-2" rowSpan={order.products.length}>
                          {order.territoryName || "-"}
                        </td>
                        <td className="border px-3 py-2" rowSpan={order.products.length}>
                          {new Date(order.orderDate).toLocaleDateString()}
                        </td>
                      </>
                    )}
                    <td className="border px-3 py-2">{prod.productName}</td>
                    <td className="border px-3 py-2">{prod.quantity}</td>
                    {status === "delivered" && (
                      <td className="border px-3 py-2">
                        {prod.selectedBatches?.length > 0 ? (
                          <button
                            className="bg-yellow-500 text-white px-2 py-1 rounded text-xs md:text-sm"
                            onClick={() => handleBatchesClick(prod.selectedBatches)}
                          >
                            View Batches
                          </button>
                        ) : (
                          "-"
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Batch Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-2">
          <div className="bg-white w-full max-w-md rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">Selected Batches</h2>
            <div className="overflow-x-auto max-h-60">
              <table className="w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">Batch No</th>
                    <th className="border px-2 py-1">Expire Date</th>
                    <th className="border px-2 py-1">Quantity</th>
                    <th className="border px-2 py-1">Expired</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedBatches.map((b) => (
                    <tr key={b._id}>
                      <td className="border px-2 py-1">{b.batchNo}</td>
                      <td className="border px-2 py-1">
                        {new Date(b.expireDate).toLocaleDateString()}
                      </td>
                      <td className="border px-2 py-1">{b.quantity}</td>
                      <td className="border px-2 py-1">{b.isExpired ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}