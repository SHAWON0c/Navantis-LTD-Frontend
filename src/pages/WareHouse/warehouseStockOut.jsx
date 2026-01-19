import React, { useState } from "react";
import { BsArrowLeftSquareFill, BsArrowRightSquareFill } from "react-icons/bs";
import { useGetWarehouseStockOutListQuery } from "../../redux/features/wareHouse/warehouseStockApi";
import FiltersAndSummaryPanel from "../../component/common/FiltersAndSummaryPanel";
// import WhSinDetailsModal from "../../component/modals/WhSinDetailsModal";

const WarehouseStockOut = () => {
  // --- API ---
  const { data, isLoading, isError } = useGetWarehouseStockOutListQuery();

  // --- Pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(5);

  // --- Filters ---
  const [filters, setFilters] = useState({
    searchTerm: "",
    year: "",
    month: "",
    fromDate: "",
    toDate: ""
  });

  // --- Modal ---
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  let stockList = data?.data || [];

  /* ================= FILTERING ================= */
  stockList = stockList.filter((item) => {
    const date = new Date(item.createdAt);
    const itemYear = date.getFullYear();
    const itemMonth = date.getMonth() + 1;

    const matchesSearch = item.productName
      .toLowerCase()
      .includes(filters.searchTerm.toLowerCase());

    const matchesYear = filters.year ? itemYear === Number(filters.year) : true;
    const matchesMonth = filters.month ? itemMonth === Number(filters.month) : true;
    const matchesFromDate = filters.fromDate
      ? date >= new Date(filters.fromDate)
      : true;
    const matchesToDate = filters.toDate
      ? date <= new Date(filters.toDate)
      : true;

    return (
      matchesSearch &&
      matchesYear &&
      matchesMonth &&
      matchesFromDate &&
      matchesToDate
    );
  });

  /* ================= SUMMARY ================= */
  const totalUniqueProducts = stockList.length;
  const totalUnit = stockList.reduce(
    (acc, item) => acc + item.totalQuantity,
    0
  );
  const totalTP = 0;
  const totalAP = 0;

  const clearFilters = () =>
    setFilters({
      searchTerm: "",
      year: "",
      month: "",
      fromDate: "",
      toDate: ""
    });

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(stockList.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = stockList.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (isLoading) return <p className="p-4">Loading...</p>;
  if (isError) return <p className="p-4 text-red-600">Failed to load data</p>;

  return (
    <div className="mx-auto p-2">

      {/* Header */}
      <div className="bg-white text-gray-500 h-12 flex items-center px-6 border-b">
        <h2 className="text-base font-bold">
          NPL / Admin / Warehouse / Stock Out
        </h2>
      </div>

      {/* Filters + Summary */}
      <FiltersAndSummaryPanel
        filters={filters}
        setFilters={setFilters}
        totals={{ totalUniqueProducts, totalUnit, totalTP }}
        onClear={clearFilters}
      />

      {/* Items per page */}
      <div className="mt-4 flex items-center gap-2">
        <label>Show</label>
        <select
          value={productsPerPage}
          onChange={(e) => {
            setProductsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="border rounded px-2 py-1"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <span>entries</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-6">
        <table className="table-auto w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">Sl</th>
              <th className="border px-3 py-2">Product Name</th>
              <th className="border px-3 py-2">Net Weight</th>
              <th className="border px-3 py-2">Batch</th>
              <th className="border px-3 py-2">Expire Date</th>
              <th className="border px-3 py-2">Qty</th>
              <th className="border px-3 py-2">Reason</th>
              <th className="border px-3 py-2">Stock Out Date</th>
              <th className="border px-3 py-2 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {currentProducts.map((item, idx) => (
              <tr key={item._id}>
                <td className="border px-3 py-2 text-center">
                  {startIndex + idx + 1}
                </td>

                <td className="border px-3 py-2">{item.productName}</td>

                <td className="border px-3 py-2">
                  {item.netWeight?.value} {item.netWeight?.unit}
                </td>

                <td className="border px-3 py-2">{item.batch}</td>

                <td className="border px-3 py-2">
                  {new Date(item.expireDate).toLocaleDateString()}
                </td>

                <td className="border px-3 py-2 text-center">
                  {item.totalQuantity}
                </td>

                <td className="border px-3 py-2">
                  {item.remarks || "-"}
                </td>

                <td className="border px-3 py-2">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>

                <td className="border px-3 py-2 text-center">
                  <button
                    onClick={() => {
                      setSelectedProduct(item);
                      setDetailsModalOpen(true);
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
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
            className="disabled:opacity-50"
          >
            <BsArrowLeftSquareFill size={22} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => changePage(page)}
              className={`px-3 py-1 rounded ${
                page === currentPage
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => changePage(currentPage + 1)}
            className="disabled:opacity-50"
          >
            <BsArrowRightSquareFill size={22} />
          </button>
        </div>
      )}

      {/* Details Modal (optional) */}
      {/* {isDetailsModalOpen && (
        <WhSinDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          product={selectedProduct}
        />
      )} */}
    </div>
  );
};

export default WarehouseStockOut;
