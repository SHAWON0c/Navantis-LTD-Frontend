import { useState } from "react";
import { BsArrowLeftSquareFill, BsArrowRightSquareFill } from "react-icons/bs";
import { ImSearch } from "react-icons/im";
import WarehouseProductCard from "../../component/common/WarehouseProductCard";
import DepotProductSummaryPanel from "../../component/common/DepotProductSummaryPanel";
import DepotProductRequestModal from "../../component/modals/DepotProductRequestModal";
import OrderReturnModal from "../../component/modals/OrderReturnModal";
import { useGetDepotProductListQuery } from "../../redux/features/depot/depotStockApi";
import DepotProductCard from "../../component/common/DepotProductCard";
import Card from "../../component/common/Card";
import Button from "../../component/common/Button";
import Loader from "../../component/Loader";
import { MdArrowBack } from "react-icons/md";
import { ChevronRight } from "lucide-react";


const DepotProductsList = () => {
  const { data, isLoading, isError } = useGetDepotProductListQuery();
  const whProducts = data?.data || [];

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [returnModalOpen, setReturnModalOpen] = useState(false);

  const filteredProducts = whProducts
    .filter((product) =>
      product.productName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.productName.localeCompare(b.productName));

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = Math.min(startIndex + productsPerPage, filteredProducts.length);
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const totalUnit = filteredProducts.reduce(
    (sum, p) => sum + Number(p.totalQuantity),
    0
  );

  const totalTradePrice = filteredProducts.reduce(
    (sum, p) => sum + (p.tradePrice || 0) * p.totalQuantity,
    0
  );

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleProductsPerPageChange = (e) => {
    setProductsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  if (isLoading) return <Loader />;
  if (isError) return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="text-center">
        <p className="text-error text-lg">Failed to load depot products.</p>
        <Button variant="primary" className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Card>
    </div>
  );

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
              <h2 className="flex flex-wrap items-center text-xs md:text-sm font-semibold text-gray-800 gap-1 sm:gap-2">
                <span>EMS</span>
                <ChevronRight size={14} className="text-gray-400" />
                <span>DEPOT</span>
                <ChevronRight size={14} className="text-gray-400" />
                <span className="text-gray-900 font-bold">PRODUCT LIST</span>
              </h2>
            </div>
          </div>
          <div className="text-xs text-neutral-500 mr-2 sm:mr-4 md:mr-6">
            Total Products: {filteredProducts.length}
          </div>
        </div>
      </Card>

      {/* Summary Panel */}
      <div className="mb-6">
        <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-md">
          <DepotProductSummaryPanel
            totals={{
              totalUniqueProducts: filteredProducts.length,
              totalUnit,
              totalTP: totalTradePrice,
            }}
            onRequest={() => setRequestModalOpen(true)}
            onReturn={() => setReturnModalOpen(true)}
          />
        </div>
      </div>

      {/* Data Table */}
      <Card title="Depot Product List" subtitle={`Showing ${currentProducts.length} of ${filteredProducts.length} products`}>
        <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 p-2">
            <label className="text-xs font-medium">Show</label>
            <select
              value={productsPerPage}
              onChange={handleProductsPerPageChange}
              className="border border-gray-300 rounded px-2 py-1 text-xs"
            >
              {[5, 10, 15, 20, 50].map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
            <span className="text-xs font-medium">products per page</span>
          </div>

          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <div className="border-r border-gray-300 p-2 bg-gray-50 flex items-center">
              <ImSearch className="text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search products"
              value={searchTerm}
              onChange={handleSearch}
              className="px-2.5 py-1.5 flex-1 focus:outline-none text-xs"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="text-center py-2 px-2 font-semibold text-gray-700">Sl. No.</th>
                <th className="text-left py-2 px-2 font-semibold text-gray-700">Product Name</th>
                <th className="text-center py-2 px-2 font-semibold text-gray-700">Pack Size</th>
                <th className="text-center py-2 px-2 font-semibold text-gray-700">Batch</th>
                <th className="text-center py-2 px-2 font-semibold text-gray-700">Expire</th>
                <th className="text-center py-2 px-2 font-semibold text-gray-700">Quantity</th>
                <th className="text-right py-2 px-2 font-semibold text-gray-700">Price/Unit</th>
                <th className="text-right py-2 px-2 font-semibold text-gray-700">Total Price</th>
                <th className="text-center py-2 px-2 font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                currentProducts.map((product, idx) => (
                  <tr key={product._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="text-center py-2 px-2">{startIndex + idx + 1}</td>
                    <td className="text-left py-2 px-2">{product.productName}</td>
                    <td className="text-center py-2 px-2">{product.packSize || "-"}</td>
                    <td className="text-center py-2 px-2">{product.batch || "-"}</td>
                    <td className="text-center py-2 px-2">
                      {product.expireDate ? new Date(product.expireDate).toLocaleDateString() : "-"}
                    </td>
                    <td className="text-center py-2 px-2">{product.totalQuantity || 0}</td>
                    <td className="text-right py-2 px-2">
                      {(product.tradePrice || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="text-right py-2 px-2">
                      {((product.tradePrice || 0) * (product.totalQuantity || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="text-center py-2 px-2">
                      <Button
                        variant="primary"
                        size="small"
                        onClick={() => setRequestModalOpen(true)}
                      >
                        Request
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="mt-6">
          <div className="flex items-center justify-between">
            <div className="text-xs text-neutral-600">
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

      {/* Modal */}
      <DepotProductRequestModal isOpen={requestModalOpen} onClose={() => setRequestModalOpen(false)} />
      <OrderReturnModal isOpen={returnModalOpen} onClose={() => setReturnModalOpen(false)} />
    </div>
  );
};

export default DepotProductsList;
