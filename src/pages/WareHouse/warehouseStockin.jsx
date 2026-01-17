import React, { useState } from "react";
import { BsArrowLeftSquareFill, BsArrowRightSquareFill } from "react-icons/bs";
import { useGetWarehouseStockListQuery } from "../../redux/features/wareHouse/warehouseStockApi";
import FiltersAndSummaryPanel from "../../component/common/FiltersAndSummaryPanel";

const StockIn = () => {
  // --- API Data ---
  const { data, isLoading, isError } = useGetWarehouseStockListQuery();

  // --- Pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);

  // --- Filters ---
  const [filters, setFilters] = useState({
    searchTerm: "",
    year: "",
    month: "",
    fromDate: "",
    toDate: ""
  });

  // --- Details Modal ---
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);


  let stockList = data?.data || [];

  // --- Filtering Logic ---
  stockList = stockList.filter((item) => {
    const itemYear = new Date(item.stockInDate).getFullYear();
    const itemMonth = new Date(item.stockInDate).getMonth() + 1;

    const matchesSearch = item.productName.toLowerCase().includes(filters.searchTerm.toLowerCase());
    const matchesYear = filters.year ? itemYear === Number(filters.year) : true;
    const matchesMonth = filters.month ? itemMonth === Number(filters.month) : true;
    const matchesFromDate = filters.fromDate ? new Date(item.stockInDate) >= new Date(filters.fromDate) : true;
    const matchesToDate = filters.toDate ? new Date(item.stockInDate) <= new Date(filters.toDate) : true;

    return matchesSearch && matchesYear && matchesMonth && matchesFromDate && matchesToDate;
  });

  // --- Invoice Summary Totals ---
  const totalUniqueProducts = stockList.length;
  const totalUnit = stockList.reduce((acc, item) => acc + item.totalStockQuantity, 0);
  const totalTP = stockList.reduce((acc, item) => acc + item.totalStockQuantity * 0, 0); // replace 0 if you have a price
  const totalAP = stockList.reduce((acc, item) => acc + item.totalStockQuantity * 0, 0); // replace 0 if needed

  const clearFilters = () => setFilters({
    searchTerm: "",
    year: "",
    month: "",
    fromDate: "",
    toDate: ""
  });

  // --- Pagination ---
  const totalPages = Math.ceil(stockList.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = stockList.slice(startIndex, startIndex + productsPerPage);

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="mx-auto p-2">

      {/* Page Title */}

      {/* Filters + Summary */}
    <FiltersAndSummaryPanel
        filters={filters}
        setFilters={setFilters}
        totals={{ totalUniqueProducts, totalUnit, totalTP }}
        onClear={clearFilters}
        onPrint={() => AdminPurchaseInvoice({
          purchaseOrders,
          totalUniqueProducts,
          totalUnit,
          totalTP,
          totalAP,
          fromDate: filters.fromDate,
          toDate: filters.toDate
        })()}
      />

      {/* Table */}
      <div className="overflow-x-auto mt-6">
        <table className="table-auto w-full border border-gray-300 text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Sl. No.</th>
              <th className="px-4 py-2 border">Product Name</th>
              <th className="px-4 py-2 border">Net Weight</th>
              <th className="px-4 py-2 border">Batch</th>
              <th className="px-4 py-2 border">Expire Date</th>
              <th className="px-4 py-2 border">Total Qty</th>
              <th className="px-4 py-2 border">Added By</th>
              <th className="px-4 py-2 border">Stock In Date</th>
              <th className="px-4 py-2 border text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((item, idx) => (
              <tr key={item._id} className="border-b">
                <td className="px-4 py-2 border text-center">{startIndex + idx + 1}</td>
                <td className="px-4 py-2 border">{item.productName}</td>
                <td className="px-4 py-2 border">{item.netWeight}</td>
                <td className="px-4 py-2 border">{item.batch}</td>
                <td className="px-4 py-2 border">{new Date(item.expireDate).toLocaleDateString()}</td>
                <td className="px-4 py-2 border text-center">{item.totalStockQuantity}</td>
                <td className="px-4 py-2 border">{item.addedByName}</td>
                <td className="px-4 py-2 border">{new Date(item.stockInDate).toLocaleDateString()}</td>
                <td className="px-4 py-2 border text-center">
                  <button
                    onClick={() => {
                      setDetailsModalOpen(true);
                      setSelectedProduct(item);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => changePage(currentPage - 1)}
            className="disabled:opacity-50 hover:text-blue-700 transition"
          >
            <BsArrowLeftSquareFill className="w-6 h-6" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => changePage(page)}
              className={`px-3 py-1 rounded ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              {page}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => changePage(currentPage + 1)}
            className="disabled:opacity-50 hover:text-blue-700 transition"
          >
            <BsArrowRightSquareFill className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Details Modal */}
      {isDetailsModalOpen && (
        <WhSinDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default StockIn;
