import React, { useMemo, useState } from "react";
import { FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import {
  useLazySearchOrderQuery,
  useOrderReturnMutation,
} from "../../redux/features/orders/orderApi";

const getBatchKey = (orderId, batch, index) =>
  `${orderId}-${batch?.depotProductId || "batch"}-${index}`;

const formatDate = (dateValue) => {
  if (!dateValue) return "-";
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString();
};

const parseSafeQty = (value) => {
  if (value === "") return "";
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return Math.floor(parsed);
};

const OrderReturnModal = ({ isOpen, onClose }) => {
  const [invoiceNo, setInvoiceNo] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [batchReturnQty, setBatchReturnQty] = useState({});
  const [reasons, setReasons] = useState({});
  const [submittingOrderId, setSubmittingOrderId] = useState("");

  const [triggerSearch, { isLoading: isSearchLoading }] = useLazySearchOrderQuery();
  const [orderReturn, { isLoading: isReturnLoading }] = useOrderReturnMutation();

  const resetModalState = () => {
    setInvoiceNo("");
    setOrderItems([]);
    setBatchReturnQty({});
    setReasons({});
    setSubmittingOrderId("");
  };

  const closeModal = () => {
    resetModalState();
    onClose();
  };

  const handleSearch = async () => {
    const trimmedInvoice = invoiceNo.trim();
    if (!trimmedInvoice) {
      toast.error("Please enter an invoice number");
      return;
    }

    try {
      const response = await triggerSearch(trimmedInvoice).unwrap();
      const searchData = response?.data;
      const normalizedItems = Array.isArray(searchData)
        ? searchData
        : searchData
          ? [searchData]
          : [];

      setOrderItems(normalizedItems);
      setBatchReturnQty({});
      setReasons({});

      if (!normalizedItems.length) {
        toast.error("No order found for this invoice");
        return;
      }

      toast.success("Order found");
    } catch (error) {
      const errMessage =
        error?.data?.message || error?.message || "Invoice search failed";
      toast.error(errMessage);
    }
  };

  const handleBatchQtyChange = ({ orderId, batch, index, value }) => {
    const parsedValue = parseSafeQty(value);
    const maxQty = Number(batch?.quantity || 0);
    const batchKey = getBatchKey(orderId, batch, index);

    if (parsedValue === "") {
      setBatchReturnQty((prev) => ({ ...prev, [batchKey]: "" }));
      return;
    }

    const clampedQty = Math.min(parsedValue, maxQty);

    setBatchReturnQty((prev) => ({
      ...prev,
      [batchKey]: clampedQty,
    }));
  };

  const getOrderReturnSummary = (order) => {
    const selectedBatches = order?.selectedBatches || [];

    const returnedBatches = selectedBatches
      .map((batch, index) => {
        const batchKey = getBatchKey(order._id, batch, index);
        const quantity = Number(batchReturnQty[batchKey] || 0);

        return {
          depotProductId: batch?.depotProductId,
          quantity,
        };
      })
      .filter((batch) => batch.depotProductId && batch.quantity > 0);

    const totalQuantity = returnedBatches.reduce(
      (sum, batch) => sum + Number(batch.quantity || 0),
      0
    );

    return { returnedBatches, totalQuantity };
  };

  const totalReturnQuantityByOrder = useMemo(() => {
    const totals = {};

    orderItems.forEach((order) => {
      totals[order._id] = getOrderReturnSummary(order).totalQuantity;
    });

    return totals;
  }, [orderItems, batchReturnQty]);

  const handleSubmitReturn = async (order) => {
    const { returnedBatches, totalQuantity } = getOrderReturnSummary(order);
    const reason = (reasons[order._id] || "").trim();

    if (!returnedBatches.length || totalQuantity <= 0) {
      toast.error("Please enter at least one return quantity");
      return;
    }

    if (!reason) {
      toast.error("Please provide a return reason");
      return;
    }

    const payload = {
      productId: order.productId,
      totalQuantity,
      reason,
      returnedBatches,
    };

    try {
      setSubmittingOrderId(order._id);
      await orderReturn({ orderId: order._id, payload }).unwrap();
      toast.success("Product return submitted successfully");

      setOrderItems((prev) => prev.filter((item) => item._id !== order._id));
      setReasons((prev) => {
        const next = { ...prev };
        delete next[order._id];
        return next;
      });
    } catch (error) {
      const errMessage =
        error?.data?.message || error?.message || "Failed to submit return";
      toast.error(errMessage);
    } finally {
      setSubmittingOrderId("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-xl max-h-[92vh] overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold">Return Product</h2>
          <button onClick={closeModal} className="text-gray-600 hover:text-red-500">
            <FaTimes size={18} />
          </button>
        </div>

        <div className="px-6 py-5 overflow-y-auto max-h-[calc(92vh-70px)] space-y-6">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
              placeholder="Search order by invoice"
              className="w-full border rounded-md p-2"
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={isSearchLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold px-5 py-2 rounded-md transition"
            >
              {isSearchLoading ? "Searching..." : "Search"}
            </button>
          </div>

          {orderItems.length === 0 ? (
            <p className="text-sm text-gray-500 border border-dashed rounded-md p-4 text-center">
              Search by invoice to view order products and batch details.
            </p>
          ) : (
            <div className="space-y-5">
              {orderItems.map((order) => {
                const selectedBatches = order?.selectedBatches || [];
                const isSubmitting =
                  isReturnLoading && submittingOrderId === order._id;

                return (
                  <div key={order._id} className="border rounded-lg p-4 bg-gray-50 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">Invoice</p>
                        <p className="font-medium">{order.invoiceNo || "-"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Product Name</p>
                        <p className="font-medium">{order.productName || "-"}</p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="bg-white border-b">
                            <th className="text-left py-2 px-3">Batch</th>
                            <th className="text-left py-2 px-3">Expire Date</th>
                            <th className="text-center py-2 px-3">Selected Qty</th>
                            <th className="text-center py-2 px-3">Return Qty</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedBatches.length === 0 ? (
                            <tr>
                              <td colSpan="4" className="text-center py-3 text-gray-500">
                                No batch details found
                              </td>
                            </tr>
                          ) : (
                            selectedBatches.map((batch, index) => {
                              const batchKey = getBatchKey(order._id, batch, index);
                              const maxQty = Number(batch?.quantity || 0);

                              return (
                                <tr key={batchKey} className="bg-white border-b last:border-b-0">
                                  <td className="py-2 px-3">{batch?.batchNo || "-"}</td>
                                  <td className="py-2 px-3">{formatDate(batch?.expireDate)}</td>
                                  <td className="py-2 px-3 text-center">{maxQty}</td>
                                  <td className="py-2 px-3 text-center">
                                    <input
                                      type="number"
                                      min={0}
                                      max={maxQty}
                                      value={batchReturnQty[batchKey] ?? ""}
                                      onChange={(e) =>
                                        handleBatchQtyChange({
                                          orderId: order._id,
                                          batch,
                                          index,
                                          value: e.target.value,
                                        })
                                      }
                                      className="w-24 border rounded-md px-2 py-1 text-center"
                                    />
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Return Reason</label>
                      <textarea
                        rows={3}
                        value={reasons[order._id] || ""}
                        onChange={(e) =>
                          setReasons((prev) => ({
                            ...prev,
                            [order._id]: e.target.value,
                          }))
                        }
                        placeholder="Write return reason"
                        className="w-full border rounded-md p-2 mt-1"
                      />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <p className="text-sm text-gray-700">
                        Total return quantity: {totalReturnQuantityByOrder[order._id] || 0}
                      </p>

                      <button
                        type="button"
                        onClick={() => handleSubmitReturn(order)}
                        disabled={isSubmitting || selectedBatches.length === 0}
                        className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white font-semibold px-5 py-2 rounded-md transition"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Return"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderReturnModal;
