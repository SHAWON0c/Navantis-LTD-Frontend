import React from "react";
import WarehouseDamageRequestCard from "../../WareHouse/WarehouseDamageRequestCard";
import { useGetDamageRequestsQuery } from "../../../redux/features/wareHouse/warehouseDamageApi";
import Card from "../../../component/common/Card";
import UniversalSummaryPanel from "../../../component/common/UniversalSummaryPanel";
import Loader from "../../../component/Loader";
import Button from "../../../component/common/Button";
import { MdArrowBack } from "react-icons/md";
import { ChevronRight } from "lucide-react";

const WarehouseDamageRequest = () => {
  const { data: whReceiveRequests, isLoading, refetch } = useGetDamageRequestsQuery();

  if (isLoading) return <Loader />;

  const filteredProducts = whReceiveRequests?.data || [];

  const totalProducts = whReceiveRequests?.totalProducts || 0;
  const totalReceivedQty = whReceiveRequests?.totalReceivedQty || 0;
  const totalDamageQty = whReceiveRequests?.totalDamageQty || 0;
  const totalRemainingStock = whReceiveRequests?.totalRemainingStock || 0;

  const totals = {
    "Total Products": totalProducts,
    "Total Received Qty": totalReceivedQty,
    "Total Damage Qty": totalDamageQty,
    "Total Remaining Stock": totalRemainingStock,
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
                <span className="text-gray-900 font-bold">WAREHOUSE DAMAGE REQUEST</span>
              </h2>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-neutral-500 mr-2 sm:mr-4 md:mr-6">
            Total Requests: {filteredProducts.length}
          </div>
        </div>
      </Card>

      {/* Summary Panel */}
      <div className="mb-6">
        <UniversalSummaryPanel totals={totals} />
      </div>

      {/* Data Table */}
      <Card title="Damage Requests" subtitle={`Showing ${filteredProducts.length} request(s)`}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Sl. No.</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Product Name</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Batch</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Expire</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Received Qty</th>
                <th className="text-center py-3 px-4 font-semibold text-red-700">Damage Qty</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Remaining Stock</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Details</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Approve</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Deny</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-8 text-gray-500">
                    No damage requests found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, idx) => (
                  <WarehouseDamageRequestCard
                    key={product._id}
                    idx={idx + 1}
                    product={product}
                    refetch={refetch}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default WarehouseDamageRequest;