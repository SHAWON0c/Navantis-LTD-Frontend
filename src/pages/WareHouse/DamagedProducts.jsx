import React, { useState } from "react";
import { BsArrowLeftSquareFill, BsArrowRightSquareFill } from "react-icons/bs";

import FiltersAndSummaryPanel from "../../component/common/FiltersAndSummaryPanel";
import { useGetAllDamageReportsQuery } from "../../redux/features/wareHouse/warehouseDamageApi";
// import DamageDetailsModal from "../../component/modals/DamageDetailsModal";
// import DamageRequestsModal from "../../component/modals/DamageRequestsModal";

const DamagedProducts = () => {
  // --- API Data ---
  const { data, isLoading, isError } = useGetAllDamageReportsQuery();

  // --- Pagination State ---
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

  // --- Modals ---
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDamageRequestsOpen, setDamageRequestsOpen] = useState(false);

  const handleProductsPerPageChange = (e) => {
    setProductsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  let damagedList = data?.data || [];

  // --- Filtering Logic ---
  damagedList = damagedList.filter((item) => {
    const itemYear = new Date(item.createdAt).getFullYear();
    const itemMonth = new Date(item.createdAt).getMonth() + 1;

    const matchesSearch = item.productName.toLowerCase().includes(filters.searchTerm.toLowerCase());
    const matchesYear = filters.year ? itemYear === Number(filters.year) : true;
    const matchesMonth = filters.month ? itemMonth === Number(filters.month) : true;
    const matchesFromDate = filters.fromDate ? new Date(item.createdAt) >= new Date(filters.fromDate) : true;
    const matchesToDate = filters.toDate ? new Date(item.createdAt) <= new Date(filters.toDate) : true;

    return matchesSearch && matchesYear && matchesMonth && matchesFromDate && matchesToDate;
  });

  // --- Totals ---
  const totalUniqueProducts = damagedList.length;
  const totalUnit = damagedList.reduce((acc, item) => acc + item.damageQty, 0);

  const clearFilters = () =>
    setFilters({
      searchTerm: "",
      year: "",
      month: "",
      fromDate: "",
      toDate: ""
    });

  // --- Pagination ---
  const totalPages = Math.ceil(damagedList.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = damagedList.slice(startIndex, startIndex + productsPerPage);

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading data.</p>;

  return (
    <div className="mx-auto p-2">

      {/* Page Header */}
      <div className="bg-white text-gray-500 h-12 flex items-center px-6 justify-between border-b border-gray-200">
        <h2 className="text-base font-bold">NPL / Admin / Damaged Products</h2>
        <button
          onClick={() => setDamageRequestsOpen(true)}
          className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition"
        >
          pending Damage Requests
        </button>
      </div>

      {/* Filters + Summary */}
      <FiltersAndSummaryPanel
        filters={filters}
        setFilters={setFilters}
        totals={{ totalUniqueProducts, totalUnit }}
        onClear={clearFilters}
      />

      {/* Items per page */}
      <div className="mt-5 md:mt-0 flex items-center gap-2">
        <label htmlFor="productsPerPage">Show</label>
        <select
          id="productsPerPage"
          value={productsPerPage}
          onChange={handleProductsPerPageChange}
          className="border border-gray-500 rounded p-1 cursor-pointer"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <span>products per page</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-6">
        <table className="table-auto w-full border border-gray-300 text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Sl. No.</th>
              <th className="px-4 py-2 border">Product Name</th>
              <th className="px-4 py-2 border">Batch</th>
              <th className="px-4 py-2 border">Received Qty</th>
              <th className="px-4 py-2 border">Damage Qty</th>
              <th className="px-4 py-2 border">Remaining Stock</th>
              <th className="px-4 py-2 border">Damage Date</th>
              <th className="px-4 py-2 border">Added By</th>
              <th className="px-4 py-2 border text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((item, idx) => (
              <tr key={item.id} className="border-b">
                <td className="px-4 py-2 border text-center">{startIndex + idx + 1}</td>
                <td className="px-4 py-2 border">{item.productName}</td>
                <td className="px-4 py-2 border">{item.batch}</td>
                <td className="px-4 py-2 border text-center">{item.receivedQty}</td>
                <td className="px-4 py-2 border text-center">{item.damageQty}</td>
                <td className="px-4 py-2 border text-center">{item.remainingStock}</td>
                <td className="px-4 py-2 border">{new Date(item.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2 border">{item.addedBy.name}</td>
                <td className="px-4 py-2 border text-center">
                  <button
                    onClick={() => {
                      setDetailsModalOpen(true);
                      setSelectedProduct(item);
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
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
              className={`px-3 py-1 rounded ${currentPage === page ? "bg-blue-600 text-white" : "bg-gray-200"}`}
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

      {/* Modals */}
      {isDetailsModalOpen && (
        <DamageDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          product={selectedProduct}
        />
      )}

      {isDamageRequestsOpen && (
        <DamageRequestsModal
          isOpen={isDamageRequestsOpen}
          onClose={() => setDamageRequestsOpen(false)}
        />
      )}
    </div>
  );
};

export default DamagedProducts;
