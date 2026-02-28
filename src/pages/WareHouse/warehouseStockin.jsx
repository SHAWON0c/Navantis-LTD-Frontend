import React, { useState } from "react";
import Loader from "../../component/Loader";
import { BsArrowLeftSquareFill, BsArrowRightSquareFill } from "react-icons/bs";

import FiltersAndSummaryPanel from "../../component/common/FiltersAndSummaryPanel";
import { useGetWarehouseStockListQuery } from "../../redux/features/wareHouse/warehouseStockApi"; // ✅ new API
import PrintWarehouseStockinList from "../../component/reports/printWarehouseStockinList";

const WarehouseStockIn = () => {
  // --- API query ---
  const { data, isLoading, isError } = useGetWarehouseStockListQuery(undefined, {
    pollingInterval: 10000, // 🔹 optional auto-refresh every 10s
  });

  // --- Pagination state ---
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  // --- Filters state ---
  const [filters, setFilters] = useState({
    searchTerm: "",
    year: "",
    month: "",
    fromDate: "",
    toDate: ""
  });

  if (isLoading) return <Loader />;
  if (isError) return <p className="text-red-500 text-center">Failed to load warehouse stock.</p>;

  // --- Raw API Data ---
  let stockList = data?.data || [];

  // ---------------- FILTERING ----------------
  stockList = stockList.filter((item) => {
    const stockDate = new Date(item.Date);
    const stockYear = stockDate.getFullYear();
    const stockMonth = stockDate.getMonth() + 1;

    const matchesSearch = item.Name.toLowerCase().includes(filters.searchTerm.toLowerCase());
    const matchesYear = filters.year ? stockYear === Number(filters.year) : true;
    const matchesMonth = filters.month ? stockMonth === Number(filters.month) : true;
    const matchesFromDate = filters.fromDate ? stockDate >= new Date(filters.fromDate) : true;
    const matchesToDate = filters.toDate ? stockDate <= new Date(filters.toDate) : true;

    return matchesSearch && matchesYear && matchesMonth && matchesFromDate && matchesToDate;
  });

  // ---------------- TOTALS ----------------
  const totalUniqueProducts = data?.totalUniqueProducts ?? stockList.length;
  const totalUnit = data?.totalUnits ?? stockList.reduce((sum, p) => sum + Number(p.Quantity || 0), 0);
  const totalTP = data?.totalTradePrice ?? stockList.reduce((sum, p) => sum + Number(p.TotalPrice || 0), 0);

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

      {/* Header */}
      <div className="bg-white text-gray-500 h-12 flex items-center px-6">
        <h2 className="text-base font-bold">NPL / Admin / Warehouse Stock In</h2>
      </div>

      {/* Filters + Summary */}
      <FiltersAndSummaryPanel
        filters={filters}
        setFilters={setFilters}
        totals={{ totalUniqueProducts, totalUnit, totalTP }}
        onClear={clearFilters}
        onPrint={() =>
          PrintWarehouseStockinList({
            purchaseOrders: stockList, // keep same naming for print
            totalUniqueProducts,
            totalUnit,
            totalTP,
            fromDate: filters.fromDate,
            toDate: filters.toDate
          })()
        }
      />

      {/* TABLE */}
      <div className="overflow-x-auto mt-10">
        <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-center">Sl. No.</th>
              <th className="px-4 py-2">Product Name</th>
              <th className="px-4 py-2">Pack Size</th>
              <th className="px-4 py-2">Batch</th>
              <th className="px-4 py-2 text-center">Quantity</th>
              <th className="px-4 py-2 text-center">Expire Date</th>
              <th className="px-4 py-2 text-right">TP</th>
              <th className="px-4 py-2 text-right">Total Price</th>
              <th className="px-4 py-2 text-center">Stock Status</th>
              <th className="px-4 py-2">Stock In Date</th>
            </tr>
          </thead>

          <tbody>
            {currentItems.map((item, idx) => (
              <tr key={item._id || startIndex + idx} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-center">{startIndex + idx + 1}</td>
                <td className="px-4 py-2">{item.Name}</td>
                <td className="px-4 py-2">{item.PackSize}</td>
                <td className="px-4 py-2">{item.Batch}</td>
                <td className="px-4 py-2 text-center">{item.Quantity}</td>
                <td className="px-4 py-2 text-center">{new Date(item.Expire).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-right">{item?.PriceUnitTP?.toLocaleString()}</td>
                <td className="px-4 py-2 text-right">{item?.TotalPrice?.toLocaleString()}</td>
                <td className="px-4 py-2 text-center">{item.stockStatus}</td>
                <td className="px-4 py-2">{new Date(item.Date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>
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

          <button disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)}>
            <BsArrowRightSquareFill className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default WarehouseStockIn;
