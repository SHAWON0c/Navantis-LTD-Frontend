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
    <div className="min-h-screen text-xs">
      {/* Header */}
      <Card className="mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="small" icon={MdArrowBack} onClick={() => window.history.back()}
              className="ml-1 text-[11px] h-7 px-2">
              Back
            </Button>
            <div className="bg-white text-gray-500 flex items-center px-2 py-1 sm:h-9">
              <h2 className="flex flex-wrap items-center text-[10px] md:text-[11px] font-semibold text-gray-800 gap-1 leading-tight">
                <span>EMS</span>
                <ChevronRight size={11} className="text-gray-400" />
                <span>DEPOT</span>
                <ChevronRight size={11} className="text-gray-400" />
                <span className="text-gray-900 font-bold">PRODUCT LIST</span>
              </h2>
            </div>
          </div>
          <div className="text-[10px] text-neutral-500 mr-1 sm:mr-2">
            Total Products: {filteredProducts.length}
          </div>
        </div>
      </Card>

      {/* Summary Panel */}
      <div className="mb-3">
        <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-md shadow-sm">
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
        <div className="mb-2 flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-1.5 p-1">
            <label className="text-[11px] font-medium">Show</label>
            <select
              value={productsPerPage}
              onChange={handleProductsPerPageChange}
              className="border border-gray-300 rounded px-1.5 py-0.5 text-[11px]"
            >
              {[5, 10, 15, 20, 50].map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
            <span className="text-[11px] font-medium">products per page</span>
          </div>

          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <div className="border-r border-gray-300 p-1.5 bg-gray-50 flex items-center">
              <ImSearch className="text-gray-500 text-[11px]" />
            </div>
            <input
              type="text"
              placeholder="Search products"
              value={searchTerm}
              onChange={handleSearch}
              className="px-2 py-1 flex-1 focus:outline-none text-[11px]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[11px]">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="text-center py-1.5 px-1.5 font-semibold text-gray-700">Sl. No.</th>
                <th className="text-left py-1.5 px-1.5 font-semibold text-gray-700">Product Name</th>
                <th className="text-center py-1.5 px-1.5 font-semibold text-gray-700">Pack Size</th>
                <th className="text-center py-1.5 px-1.5 font-semibold text-gray-700">Batch</th>
                <th className="text-center py-1.5 px-1.5 font-semibold text-gray-700">Expire</th>
                <th className="text-center py-1.5 px-1.5 font-semibold text-gray-700">Quantity</th>
                <th className="text-right py-1.5 px-1.5 font-semibold text-gray-700">Price/Unit</th>
                <th className="text-right py-1.5 px-1.5 font-semibold text-gray-700">Total Price</th>
                <th className="text-center py-1.5 px-1.5 font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-6 text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                currentProducts.map((product, idx) => (
                  <tr key={product._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="text-center py-1.5 px-1.5">{startIndex + idx + 1}</td>
                    <td className="text-left py-1.5 px-1.5">{product.productName}</td>
                    <td className="text-center py-1.5 px-1.5">{product.packSize || "-"}</td>
                    <td className="text-center py-1.5 px-1.5">{product.batch || "-"}</td>
                    <td className="text-center py-1.5 px-1.5">
                      {product.expireDate ? new Date(product.expireDate).toLocaleDateString() : "-"}
                    </td>
                    <td className="text-center py-1.5 px-1.5">{product.totalQuantity || 0}</td>
                    <td className="text-right py-1.5 px-1.5">
                      {(product.tradePrice || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="text-right py-1.5 px-1.5">
                      {((product.tradePrice || 0) * (product.totalQuantity || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="text-center py-1.5 px-1.5">
                      <Button
                        variant="primary"
                        size="small"
                        className="text-[10px] px-2 py-1"
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
        <Card className="mt-3">
          <div className="flex items-center justify-between">
            <div className="text-[11px] text-neutral-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="small"
                className="text-[11px] h-7 px-2"
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
                      className="text-[11px] h-7 min-w-7 px-2"
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
                className="text-[11px] h-7 px-2"
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
