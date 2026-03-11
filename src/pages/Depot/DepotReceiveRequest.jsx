import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetGroupedDepotRequestsQuery } from "../../redux/features/depot/depotProductRequestAPI";
import Card from "../../component/common/Card";
import Button from "../../component/common/Button";
import Loader from "../../component/Loader";

const STATUS_OPTIONS = ["pending", "requested", "accepted"];

const DepotReceiveRequest = () => {
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [expandedRows, setExpandedRows] = useState({});
  const { data, isLoading, isError } = useGetGroupedDepotRequestsQuery(selectedStatus);

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Card className="text-center">
          <p className="text-error text-lg">Failed to load requests.</p>
        </Card>
      </div>
    );

  const groupedRequests = data?.data
    ? Object.entries(data.data).map(([date, requests]) => ({ date, requests }))
    : [];
  const totalRequests = groupedRequests.reduce((sum, grp) => sum + grp.requests.length, 0);

  const toggleRow = (id) =>
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Depot Receive Requests</h1>
            <p className="text-neutral-600 text-sm">Review and manage incoming depot requests</p>
          </div>
          <div className="text-sm text-neutral-500 mt-2 md:mt-0">
            Total: {totalRequests}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {STATUS_OPTIONS.map((status) => (
            <Button
              key={status}
              variant={selectedStatus === status ? "primary" : "outline"}
              size="small"
              onClick={() => setSelectedStatus(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </Card>

      {groupedRequests.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500 py-8">
            No requests found for "{selectedStatus}" status.
          </p>
        </Card>
      ) : (
        groupedRequests.map(({ date, requests }) => (
          <div key={date} className="mb-6">
            <Card
              title={`Date: ${new Date(date).toLocaleDateString()}`}
              subtitle={`${requests.length} item(s)`}
            >
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200">
                      <th className="text-center py-3 px-4 font-semibold">#</th>
                      <th className="py-3 px-4 font-semibold">Product Name</th>
                      <th className="text-center py-3 px-4 font-semibold">Pack Size</th>
                      <th className="text-center py-3 px-4 font-semibold">Requested Qty</th>
                      <th className="text-center py-3 px-4 font-semibold">Warehouse Qty</th>
                      <th className="text-center py-3 px-4 font-semibold">Depot Qty</th>
                      <th className="text-center py-3 px-4 font-semibold">Batches</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req, idx) => {
                      const isExpanded = expandedRows[req.requestId] || false;
                      return (
                        <React.Fragment key={req.requestId}>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="text-center py-3 px-4">{idx + 1}</td>
                            <td className="py-3 px-4">{req.productName}</td>
                            <td className="text-center py-3 px-4">{req.packSize}</td>
                            <td className="text-center py-3 px-4">{req.requestedQuantity}</td>
                            <td className="text-center py-3 px-4">{req.warehouseQuantity}</td>
                            <td className="text-center py-3 px-4">{req.depotQuantity}</td>
                            <td
                              className="text-center py-3 px-4 cursor-pointer"
                              onClick={() => toggleRow(req.requestId)}
                            >
                              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </td>
                          </tr>
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.tr
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <td colSpan={7} className="p-4 bg-gray-50">
                                  <div className="flex flex-wrap gap-6">
                                    <div className="flex-1 min-w-[250px]">
                                      <h4 className="font-bold mb-2 text-center">
                                        Warehouse Batches
                                      </h4>
                                      <table className="w-full border border-gray-200 text-sm">
                                        <thead>
                                          <tr className="bg-gray-100">
                                            <th className="px-2 py-1 border text-center">Batch</th>
                                            <th className="px-2 py-1 border text-center">Expire Date</th>
                                            <th className="px-2 py-1 border text-center">Total Qty</th>
                                            {req.status !== "pending" && (
                                              <th className="px-2 py-1 border text-center">Requested Qty</th>
                                            )}
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {req.warehouseBatches.map((b) => (
                                            <tr key={b.warehouseProductId}>
                                              <td className="px-2 py-1 border text-center">{b.batch}</td>
                                              <td className="px-2 py-1 border text-center">
                                                {new Date(b.expireDate).toLocaleDateString()}
                                              </td>
                                              <td className="px-2 py-1 border text-center">{b.totalQuantity}</td>
                                              {req.status !== "pending" && (
                                                <td className="px-2 py-1 border text-center">
                                                  {b.requestedQuantity || 0}
                                                </td>
                                              )}
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                    <div className="flex-1 min-w-[250px]">
                                      <h4 className="font-bold mb-2 text-center">Depot Batches</h4>
                                      <table className="w-full border border-gray-200 text-sm">
                                        <thead>
                                          <tr className="bg-gray-100">
                                            <th className="px-2 py-1 border text-center">Batch</th>
                                            <th className="px-2 py-1 border text-center">Expire Date</th>
                                            <th className="px-2 py-1 border text-center">Total Qty</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {req.depotBatches.map((b) => (
                                            <tr key={b.depotProductId}>
                                              <td className="px-2 py-1 border text-center">{b.batch}</td>
                                              <td className="px-2 py-1 border text-center">
                                                {new Date(b.expireDate).toLocaleDateString()}
                                              </td>
                                              <td className="px-2 py-1 border text-center">{b.totalQuantity}</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </td>
                              </motion.tr>
                            )}
                          </AnimatePresence>
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        ))
      )}
    </div>
  );
};

export default DepotReceiveRequest;
