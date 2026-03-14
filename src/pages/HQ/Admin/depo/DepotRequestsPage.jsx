import React, { useState } from "react";
import Card from "../../../../component/common/Card";
import Button from "../../../../component/common/Button";
import UniversalSummaryPanel from "../../../../component/common/UniversalSummaryPanel";
import {
  useGetGroupedDepotRequestsQuery,
  useSendProductRequestTowarehouseMutation,
} from "../../../../redux/features/depot/depotStockApi";
import Loader from "../../../../component/Loader";
import { ChevronRight } from "lucide-react";
import { MdArrowBack } from "react-icons/md";

const DepotRequestsPage = () => {
  const { data, isLoading, isError, refetch } = useGetGroupedDepotRequestsQuery("pending");
  const [sendProductRequestTowarehouse] = useSendProductRequestTowarehouseMutation();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [batchInputs, setBatchInputs] = useState({});
  const [showModal, setShowModal] = useState(false);

  const openModal = (product) => {
    setSelectedProduct(product);
    const initialInputs = {};
    product.warehouseBatches?.forEach((b) => {
      initialInputs[b.warehouseProductId] = 0;
    });
    setBatchInputs(initialInputs);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setBatchInputs({});
    setShowModal(false);
  };

  const handleBatchChange = (batchId, value) => {
    const numericValue = parseInt(value) || 0;
    const total = Object.entries(batchInputs).reduce((sum, [id, val]) => {
      return id === batchId ? sum + numericValue : sum + val;
    }, 0);
    if (total <= selectedProduct.requestedQuantity) {
      setBatchInputs({ ...batchInputs, [batchId]: numericValue });
    }
  };

  const handleRequestToWarehouse = async () => {
    if (!selectedProduct) return;

    const batches = Object.entries(batchInputs)
      .filter(([_, qty]) => qty > 0)
      .map(([warehouseProductId, quantity]) => ({
        warehouseProductId,
        quantity,
      }));

    if (batches.length === 0) {
      alert("Please select at least one batch");
      return;
    }

    const totalQuantity = batches.reduce((sum, b) => sum + b.quantity, 0);

    const payload = {
      status: "requested",
      quantity: totalQuantity,
      batches,
      addedBy: "69770be5b47a7f9275439da0",
    };

    try {
      await sendProductRequestTowarehouse({
        requestId: selectedProduct.requestId,
        payload,
      }).unwrap();

      alert("Request sent to warehouse successfully");
      closeModal();
      refetch();
    } catch (error) {
      console.error(error);
      alert("Failed to send request");
    }
  };

  if (isLoading) return <Loader />;
  if (isError) return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="text-center">
        <p className="text-error text-lg">Failed to load depot requests.</p>
        <Button variant="primary" className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Card>
    </div>
  );

  const groupedData = data?.data || {};
  const totalRequests = Object.values(groupedData).reduce((sum, requests) => sum + requests.length, 0);

  const totals = {
    "Total Requests": totalRequests,
    "Status": "Pending",
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="small"  onClick={() => window.history.back()}
              className="ml-2">
                 <MdArrowBack className="inline mr-1" />
              Back
            </Button>
            <div className="bg-white text-gray-500 flex items-center px-3 sm:px-4 md:px-6 py-2 sm:h-12">
              <h2 className="flex flex-wrap items-center text-xs sm:text-sm md:text-base font-semibold text-gray-800 gap-1 sm:gap-2">
                <span>EMS</span>
                <ChevronRight size={14} className="text-gray-400" />
                <span>ADMIN</span>
                <ChevronRight size={14} className="text-gray-400" />
                <span className="text-gray-900 font-bold">DEPOT PRODUCT APPROVE</span>
              </h2>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-neutral-500 mr-2 sm:mr-4 md:mr-6">
           Total Pending: {totalRequests}
          </div>
        </div>
      </Card>


      {/* Summary Panel */}
      <div className="mb-6">
        <UniversalSummaryPanel totals={totals} />
      </div>

      {/* Requests by Date */}
      {Object.entries(groupedData).length === 0 ? (
        <Card>
          <p className="text-center text-gray-500 py-8">No pending requests found.</p>
        </Card>
      ) : (
        Object.entries(groupedData).map(([date, requests]) => (
          <div key={date} className="mb-6">
            <Card title={`Requests for ${new Date(date).toLocaleDateString()}`} subtitle={`${requests.length} product(s) requested`}>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200">
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Sl. No.</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Product Name</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Pack Size</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Requested Qty</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Warehouse Qty</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Depot Qty</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req, idx) => (
                      <tr key={req.requestId} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="text-center py-3 px-4">{idx + 1}</td>
                        <td className="text-left py-3 px-4">{req.productName}</td>
                        <td className="text-center py-3 px-4">{req.packSize}</td>
                        <td className="text-center py-3 px-4">{req.requestedQuantity}</td>
                        <td className="text-center py-3 px-4">{req.warehouseQuantity}</td>
                        <td className="text-center py-3 px-4">{req.depotQuantity}</td>
                        <td className="text-center py-3 px-4">
                          <Button
                            variant="primary"
                            size="small"
                            onClick={() => openModal(req)}
                          >
                            Process
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        ))
      )}

      {/* Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <Card className="w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">{selectedProduct.productName} - Select Batches</h2>
            <p className="text-sm text-gray-600 mb-4">Requested Quantity: {selectedProduct.requestedQuantity}</p>

            <div className="overflow-x-auto max-h-60 mb-4">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="text-left py-2 px-4">Batch</th>
                    <th className="text-center py-2 px-4">Expire Date</th>
                    <th className="text-center py-2 px-4">Available</th>
                    <th className="text-center py-2 px-4">Select Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProduct.warehouseBatches?.map((batch) => (
                    <tr key={batch.warehouseProductId} className="border-b border-gray-200">
                      <td className="text-left py-2 px-4">{batch.batch}</td>
                      <td className="text-center py-2 px-4">{new Date(batch.expireDate).toLocaleDateString()}</td>
                      <td className="text-center py-2 px-4">{batch.availableQuantity}</td>
                      <td className="text-center py-2 px-4">
                        <input
                          type="number"
                          min="0"
                          max={batch.availableQuantity}
                          value={batchInputs[batch.warehouseProductId] || 0}
                          onChange={(e) => handleBatchChange(batch.warehouseProductId, e.target.value)}
                          className="w-16 border border-gray-300 rounded px-2 py-1 text-center"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleRequestToWarehouse}>
                Send Request
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DepotRequestsPage;
