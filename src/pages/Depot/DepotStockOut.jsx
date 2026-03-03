import React, { useState } from "react";
import { BsArrowLeftSquareFill, BsArrowRightSquareFill } from "react-icons/bs";

import FiltersAndSummaryPanel from "../../component/common/FiltersAndSummaryPanel";
import { useGetDailyStockOutListQuery } from "../../redux/features/depot/depotStockApi";

const DepotStockOut = () => {
  // --- API Data ---
  const { data: apiData, isLoading, isError } = useGetDailyStockOutListQuery();

  // --- Pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  // --- Filters ---
  const [filters, setFilters] = useState({
    searchTerm: "",
    year: "",
    month: "",
    fromDate: "",
    toDate: ""
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p className="text-red-500 text-center">Error loading stock-out data!</p>;

  // --- Raw API Data ---
  let stockList = apiData?.data || [];

  // ---------------- FILTERING ----------------
  stockList = stockList.filter((item) => {
    const stockDate = new Date(item.stockOutDate);
    const stockYear = stockDate.getFullYear();
    const stockMonth = stockDate.getMonth() + 1;

    const matchesSearch = item.productName.toLowerCase().includes(filters.searchTerm.toLowerCase());
    const matchesYear = filters.year ? stockYear === Number(filters.year) : true;
    const matchesMonth = filters.month ? stockMonth === Number(filters.month) : true;
    const matchesFromDate = filters.fromDate ? stockDate >= new Date(filters.fromDate) : true;
    const matchesToDate = filters.toDate ? stockDate <= new Date(filters.toDate) : true;

    return matchesSearch && matchesYear && matchesMonth && matchesFromDate && matchesToDate;
  });

  // ---------------- TOTALS ----------------
  const totalUniqueProducts = apiData?.totalUniqueProducts ?? stockList.length;
  const totalUnit = apiData?.totalUnits ?? stockList.reduce((sum, p) => sum + Number(p.quantityOut || 0), 0);
  const totalTP = apiData?.totalTradePrice ?? stockList.reduce((sum, p) => sum + Number(p.actualPrice || 0), 0);

  const clearFilters = () =>
    setFilters({ searchTerm: "", year: "", month: "", fromDate: "", toDate: "" });

  // ---------------- PAGINATION ----------------
  const totalPages = Math.ceil(stockList.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentItems = stockList.slice(startIndex, startIndex + productsPerPage);

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="mx-auto p-2">
      <h1 className="text-xl font-semibold mb-4">Daily Stock Out</h1>

      {/* Filters + Summary */}
      <FiltersAndSummaryPanel
        filters={filters}
        setFilters={setFilters}
        totals={{ totalUniqueProducts, totalUnit, totalTP }}
        onClear={clearFilters}
        onPrint={() =>
          console.log("Print stock-out report", {
            stockList,
            totalUniqueProducts,
            totalUnit,
            totalTP,
            fromDate: filters.fromDate,
            toDate: filters.toDate
          })
        }
      />

      {/* Table */}
      <div className="overflow-x-auto mt-6">
        <table className="table-auto w-full border border-gray-300 text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Sl. No.</th>
              <th className="px-4 py-2 border">Product Name</th>
              <th className="px-4 py-2 border">Brand</th>
              <th className="px-4 py-2 border">Short Code</th>
              <th className="px-4 py-2 border">Pack Size</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Actual Price</th>
              <th className="px-4 py-2 border">Batch</th>
              <th className="px-4 py-2 border">Expire Date</th>
              <th className="px-4 py-2 border">Quantity Out</th>
              <th className="px-4 py-2 border">Stock Before</th>
              <th className="px-4 py-2 border">Stock After</th>
              <th className="px-4 py-2 border">Stock Out Date</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, idx) => (
              <tr key={item._id || startIndex + idx} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 border text-center">{startIndex + idx + 1}</td>
                <td className="px-4 py-2 border">{item.productName}</td>
                <td className="px-4 py-2 border">{item.brand}</td>
                <td className="px-4 py-2 border">{item.productShortCode}</td>
                <td className="px-4 py-2 border">{item.packSize}</td>
                <td className="px-4 py-2 border">{item.category}</td>
                <td className="px-4 py-2 border text-right">{item.actualPrice?.toLocaleString()}</td>
                <td className="px-4 py-2 border">{item.batch}</td>
                <td className="px-4 py-2 border text-center">{new Date(item.expireDate).toLocaleDateString()}</td>
                <td className="px-4 py-2 border text-center">{item.quantityOut}</td>
                <td className="px-4 py-2 border text-center">{item.stockAvailableBefore}</td>
                <td className="px-4 py-2 border text-center">{item.stockAvailableAfter}</td>
                <td className="px-4 py-2 border">{new Date(item.stockOutDate).toLocaleDateString()}</td>
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
          >
            <BsArrowLeftSquareFill className="w-6 h-6" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => changePage(page)}
              className={`px-3 py-1 rounded ${currentPage === page ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              {page}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => changePage(currentPage + 1)}
          >
            <BsArrowRightSquareFill className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default DepotStockOut;