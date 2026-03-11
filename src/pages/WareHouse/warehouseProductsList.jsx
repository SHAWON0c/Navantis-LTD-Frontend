import { useState } from "react";
import { BsArrowLeftSquareFill, BsArrowRightSquareFill } from "react-icons/bs";
import { ImSearch } from "react-icons/im";
import { useGetWarehouseProductListQuery } from "../../redux/features/wareHouse/warehouseStockApi";
import SummaryPanel from "../../component/common/SummaryPanel";
import WarehouseProductCard from "../../component/common/WarehouseProductCard";
import PrintWarehouseStockList from "../../component/reports/PrintWarehouseStockList";
import Card from "../../component/common/Card";
import Button from "../../component/common/Button";
import Loader from "../../component/Loader";

const WarehouseProductsList = () => {
  // --- API Data ---
  const { data, isLoading } = useGetWarehouseProductListQuery();

  // --- State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  // --- Single selection state ---
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedWarehouseReceiveId, setSelectedWarehouseReceiveId] = useState(null);

  if (isLoading) return <Loader />;

  // --- Use backend data directly ---
  const whProducts = data?.data || [];
  const totalUniqueProducts = data?.totalUniqueProducts ?? 0;
  const totalTradePrice = data?.totalTradePrice ?? 0;
  const totalUnits = data?.totalUnits ?? 0;

  // --- Filter + Sort ---
  const filteredProducts = whProducts
    .filter((p) => p.productName?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.productName.localeCompare(b.productName));

  // --- Pagination ---
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  const changePage = (page) => setCurrentPage(page);

  // --- Toggle selection ---
  const toggleProduct = (product) => {
    if (selectedProductId === product._id) {
      setSelectedProductId(null);
      setSelectedWarehouseReceiveId(null);
    } else {
      setSelectedProductId(product._id);
      setSelectedWarehouseReceiveId(product.warehouseReceiveId || null);
    }
  };

  const handlePrint = () => {
    PrintWarehouseStockList({
      products: whProducts,
      summary: {
        totalUniqueProducts,
        totalUnits,
        totalTradePrice,
      },
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-white text-gray-500 h-12 flex items-center px-6">
              <h2 className="text-base font-bold">NPL / Admin / Purchase Order</h2>
            </div>
          </div>
          <div className="text-sm text-neutral-500">
            Total Records: {filteredProducts.length}
          </div>
        </div>
      </Card>

      {/* Summary Panel */}
      <div className="mb-6">
        <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-md">
          <SummaryPanel
            totals={{
              totalUniqueProducts,
              totalUnit: totalUnits,
              totalTP: totalTradePrice,
              selectedWarehouseProductId: selectedProductId,
              warehouseReceiveId: selectedWarehouseReceiveId
            }}
            onPrint={handlePrint}
          />
        </div>
      </div>

      {/* Data Table */}
      <Card title="Warehouse Products" subtitle={`Showing ${currentProducts.length} of ${filteredProducts.length} records`}>
        <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Show</label>
            <select
              value={productsPerPage}
              onChange={(e) => {
                setProductsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              {[5, 10, 15, 20, 50].map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
            <span className="text-sm font-medium">products per page</span>
          </div>

          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <div className="border-r border-gray-300 p-2 bg-gray-50 flex items-center">
              <ImSearch className="text-gray-500" />
            </div>
            <input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search products"
              className="px-3 py-2 flex-1 focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="text-center py-3 px-4 font-semibold text-gray-700">✔</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Sl</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Product Name</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Pack Size</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Batch</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Expire</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Qty</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Price/Unit</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Total</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product, idx) => (
                <WarehouseProductCard
                  key={product._id}
                  idx={startIndex + idx + 1}
                  product={product}
                  checked={selectedProductId === product._id}
                  onToggle={() => toggleProduct(product)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="mt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-neutral-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="small"
                disabled={currentPage === 1}
                onClick={() => changePage(currentPage - 1)}
                icon={BsArrowLeftSquareFill}
              >
                Previous
              </Button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "primary" : "outline"}
                      size="small"
                      onClick={() => changePage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="small"
                disabled={currentPage === totalPages}
                onClick={() => changePage(currentPage + 1)}
                icon={BsArrowRightSquareFill}
                iconPosition="right"
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default WarehouseProductsList;
