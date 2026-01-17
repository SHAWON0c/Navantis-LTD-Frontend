import { useGetWarehouseReceiveRequestQuery } from "../../redux/features/wareHouse/warehouseReceiveApi";
import WarehouseRequestProductCard from "./WarehouseRequestProductCard";


const WarehouseRequest = () => {
  const { data: whReceiveRequests, isLoading, refetch } = useGetWarehouseReceiveRequestQuery();



  // ✅ Use the array inside `data`
  const filteredProducts = whReceiveRequests?.data || [];

  // Calculate totals based on available fields
  const totalOrderQuantity = filteredProducts.reduce((acc, item) => acc + (item.orderQuantity || 0), 0);
  const totalStockQuantity = filteredProducts.reduce((acc, item) => acc + (item.stockQuantity || 0), 0);
  const totalMissingQuantity = filteredProducts.reduce((acc, item) => acc + (item.missingQuantity || 0), 0);

  return (
    <div className="mx-auto p-2">

      {/* Top Bar */}
      <div className="bg-white text-gray-500 h-12 flex items-center px-6">
        <h2 className="text-base font-bold">NPL / Admin / Purchase Order</h2>
      </div>

      {/* Main Content */}
      <div className="space-y-6 mt-4 "> {/* Adds spacing between sections and moves content slightly down */}
        <div className="bg-white pb-1 rounded-lg">
          {/* Product Info */}
          <div className="m-0 p-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-md ">
            <p className="text-md text-gray-700 text-center mb-4 font-medium">Warehouse Request Summary</p>

            <div className="bg-white p-3 rounded-md rounded-b-none shadow-sm flex flex-col md:flex-row justify-around items-center text-gray-600">
              <p className="text-sm">
                Total Products: <span className="font-medium text-blue-700">{filteredProducts.length}</span>
              </p>
              <p className="text-sm">
                Total Order Quantity: <span className="font-medium text-blue-700">{totalOrderQuantity}</span>
              </p>
              <p className="text-sm">
                Total Stock Quantity: <span className="font-medium text-blue-700">{totalStockQuantity}</span>
              </p>
              <p className="text-sm">
                Total Missing Quantity: <span className="font-medium text-blue-700">{totalMissingQuantity}</span>
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="p-6">
            <div className="overflow-x-auto mb-3">
              <table className="table">
                <thead>
                  <tr>
                    <th className="text-center">Sl. No.</th>
                    <th>Name</th>
                    <th className="text-center">Batch</th>
                    <th className="text-center">Exp.</th>
                    <th className="text-center">Order Quantity</th>
                    <th className="text-center">Stock Quantity</th>
                    <th className="text-center">Missing Quantity</th>
                    <th className="text-center">Details</th>
                    <th className="text-center">Approve</th>
                    <th className="text-center">Deny</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, idx) => (
                    <WarehouseRequestProductCard
                      idx={idx + 1}
                      key={product.purchaseOrderId} // safer unique key
                      product={product}
                      refetch={refetch}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>


      </div>
    </div>

  );
};

export default WarehouseRequest;
