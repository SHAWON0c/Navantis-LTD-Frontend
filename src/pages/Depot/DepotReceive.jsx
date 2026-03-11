import React, { useState } from "react";
import Loader from "../../component/Loader";
import { BsArrowLeftSquareFill, BsArrowRightSquareFill } from "react-icons/bs";
import FiltersAndSummaryPanel from "../../component/common/FiltersAndSummaryPanel";
import { useGetDepotReceiveStockQuery } from "../../redux/features/depot/depotStockApi";
import Card from "../../component/common/Card";
import Table from "../../component/common/Table";
import Button from "../../component/common/Button";
import { MdArrowBack } from "react-icons/md";
import { ChevronRight } from "lucide-react";

const DepotReceive = () => {
  // --- API query ---
  const { data: apiData, isLoading, isError } = useGetDepotReceiveStockQuery();

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
  if (isError) return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <Card className="text-center">
        <p className="text-error text-lg">Failed to load depot received stock data.</p>
        <Button variant="primary" className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Card>
    </div>
  );

  // --- Raw API Data ---
  let stockList = apiData?.data || [];

  // ---------------- FILTERING ----------------
  stockList = stockList.filter((item) => {
    const stockDate = new Date(item.stockInDate);
    const stockYear = stockDate.getFullYear();
    const stockMonth = stockDate.getMonth() + 1;

    const matchesSearch = item.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
    const matchesYear = filters.year ? stockYear === Number(filters.year) : true;
    const matchesMonth = filters.month ? stockMonth === Number(filters.month) : true;
    const matchesFromDate = filters.fromDate ? stockDate >= new Date(filters.fromDate) : true;
    const matchesToDate = filters.toDate ? stockDate <= new Date(filters.toDate) : true;

    return matchesSearch && matchesYear && matchesMonth && matchesFromDate && matchesToDate;
  });

  // ---------------- TOTALS ----------------
  const totalUniqueProducts = apiData?.totalUniqueProducts ?? stockList.length;
  const totalUnit = apiData?.totalUnits ?? stockList.reduce((sum, p) => sum + Number(p.quantity || 0), 0);
  const totalTP = apiData?.totalTradePrice ?? stockList.reduce((sum, p) => sum + Number(p.totalPrice || 0), 0);

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

  // Table columns configuration
  const columns = [
    { key: 'slNo', label: 'Sl. No.', sortable: false, render: (value, row, index) => startIndex + index + 1 },
    { key: 'name', label: 'Product Name', sortable: true },
    { key: 'packSize', label: 'Pack Size', sortable: true },
    { key: 'batch', label: 'Batch', sortable: true },
    { key: 'quantity', label: 'Quantity', sortable: true, render: (value) => Number(value || 0).toLocaleString() },
    { key: 'pricePerUnit', label: 'Price/Unit', sortable: true, render: (value) => `₹${Number(value || 0).toLocaleString()}` },
    { key: 'actualPrice', label: 'Actual Price', sortable: true, render: (value) => `₹${Number(value || 0).toLocaleString()}` },
    { key: 'totalPrice', label: 'Total Price', sortable: true, render: (value) => `₹${Number(value || 0).toLocaleString()}` },
    { key: 'expireDate', label: 'Expire Date', sortable: true, render: (value) => new Date(value).toLocaleDateString() },
    { key: 'stockInDate', label: 'Stock In Date', sortable: true, render: (value) => new Date(value).toLocaleDateString() },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="small" icon={MdArrowBack} onClick={() => window.history.back()}
              className="ml-2">
              Back
            </Button>
            <div className="bg-white text-gray-500 flex items-center px-3 sm:px-4 md:px-6 py-2 sm:h-12">
              <h2 className="flex flex-wrap items-center text-xs sm:text-sm md:text-base font-semibold text-gray-800 gap-1 sm:gap-2">
                <span>EMS</span>
                <ChevronRight size={14} className="text-gray-400" />
                <span>DEPOT</span>
                <ChevronRight size={14} className="text-gray-400" />
                <span className="text-gray-900 font-bold">RECEIVED PRODUCTS</span>
              </h2>
            </div>
          </div>
          <div className="text-sm text-neutral-500 mr-2">
            Total Records: {stockList.length}
          </div>
        </div>
      </Card>

      {/* Filters + Summary */}
      <div className="mb-6">
        <FiltersAndSummaryPanel
          filters={filters}
          setFilters={setFilters}
          totals={{ totalUniqueProducts, totalUnit, totalTP }}
          onClear={clearFilters}
          onPrint={() =>
            console.log("Print logic here", {
              stockList,
              totalUniqueProducts,
              totalUnit,
              totalTP,
              fromDate: filters.fromDate,
              toDate: filters.toDate
            })
          }
        />
      </div>

      {/* Data Table */}
      <Card title="Depot Received Stock Records" subtitle={`Showing ${currentItems.length} of ${stockList.length} records`}>
        <Table
          columns={columns}
          data={currentItems}
          sortable
          striped
          hover
        />
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

export default DepotReceive;