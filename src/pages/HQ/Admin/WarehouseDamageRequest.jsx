import React from "react";
import WarehouseDamageRequestCard from "../../WareHouse/WarehouseDamageRequestCard";
import { useGetDamageRequestsQuery } from "../../../redux/features/wareHouse/warehouseDamageApi";

const WarehouseDamageRequest = () => {
  // ✅ Fetch all damage requests
  const { data: whReceiveRequests, isLoading, refetch } = useGetDamageRequestsQuery();

  if (isLoading) {
    return <p className="text-center mt-10">Loading warehouse damage requests...</p>;
  }

  // ✅ Use array inside `data`
  const filteredProducts = whReceiveRequests?.data || [];

  // ✅ Totals
  const totalReceivedQty = filteredProducts.reduce((acc, item) => acc + (item.receivedQty || 0), 0);
  const totalDamageQty = filteredProducts.reduce((acc, item) => acc + (item.damageQty || 0), 0);
  const totalRemainingStock = filteredProducts.reduce((acc, item) => acc + (item.remainingStock || 0), 0);

  return (
    <div className="mx-auto p-2">
      {/* Top Bar */}
      <div className="bg-white text-gray-500 h-12 flex items-center px-6">
        <h2 className="text-base font-bold">NPL / Admin / Warehouse Damage Requests</h2>
      </div>

      {/* Main Content */}
      <div className="space-y-6 mt-4">
        <div className="bg-white pb-1 rounded-lg">
          {/* Summary */}
          <div className="m-0 p-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-md">
            <p className="text-md text-gray-700 text-center mb-4 font-medium">
              Warehouse Damage Summary
            </p>

            <div className="bg-white p-3 rounded-md rounded-b-none shadow-sm flex flex-col md:flex-row justify-around items-center text-gray-600">
              <p className="text-sm">
                Total Products: <span className="font-medium text-blue-700">{filteredProducts.length}</span>
              </p>
              <p className="text-sm">
                Total Received Qty: <span className="font-medium text-blue-700">{totalReceivedQty}</span>
              </p>
              <p className="text-sm ">
                Total Damage Qty: <span className="font-medium text-red-500">{totalDamageQty}</span>
              </p>
              <p className="text-sm">
                Total Remaining Stock: <span className="font-medium text-blue-700">{totalRemainingStock}</span>
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="p-6">
            <div className="overflow-x-auto mb-3">
              <table className="table w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-center">Sl. No.</th>
                    <th>Name</th>
                    <th className="text-center">Batch</th>
                    <th className="text-center">Exp.</th>
                    <th className="text-center">Received Qty</th>
                    <th className="text-center text-red-500 ">Damage Qty</th>
                    <th className="text-center">Remaining Stock</th>
                    <th className="text-center">Details</th>
                    <th className="text-center">Approve</th>
                    <th className="text-center">Deny</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, idx) => (
                    <WarehouseDamageRequestCard
                      key={product.id} // unique key
                      idx={idx + 1}
                      product={product}
                      refetch={refetch}
                    />
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={10} className="text-center py-4 text-gray-500">
                        No damage requests found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseDamageRequest;
