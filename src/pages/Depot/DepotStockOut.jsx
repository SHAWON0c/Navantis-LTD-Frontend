import React, { useState } from "react";
import { BsArrowLeftSquareFill, BsArrowRightSquareFill } from "react-icons/bs";
import FiltersAndSummaryPanel from "../../component/common/FiltersAndSummaryPanel";
import { useGetDailyStockOutListQuery } from "../../redux/features/depot/depotStockApi";
import Loader from "../../component/Loader";
import Card from "../../component/common/Card";
import Table from "../../component/common/Table";
import Button from "../../component/common/Button";
import { MdArrowBack } from "react-icons/md";
import { ChevronRight } from "lucide-react";

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

  if (isLoading) return <Loader />;
  if (isError) return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="text-center">
        <p className="text-error text-lg">Failed to load depot stock out data.</p>
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
  console.log (startIndex)
  const currentItems = stockList.slice(startIndex, startIndex + productsPerPage);

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Table columns configuration
  const columns = [
    { key: 'slNo', label: 'Sl. No.', sortable: false, render: (value, row, index) => startIndex + index + 1 },
    { key: 'productName', label: 'Product Name', sortable: true },
    { key: 'brand', label: 'Brand', sortable: true },
    { key: 'productShortCode', label: 'Short Code', sortable: true },
    { key: 'packSize', label: 'Pack Size', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'actualPrice', label: 'Actual Price', sortable: true, render: (value) => `৳${Number(value || 0).toLocaleString()}` },
    { key: 'batch', label: 'Batch', sortable: true },
    { key: 'expireDate', label: 'Expire Date', sortable: true, render: (value) => new Date(value).toLocaleDateString() },
    { key: 'quantityOut', label: 'Quantity Out', sortable: true, render: (value) => Number(value || 0).toLocaleString() },
    { key: 'stockAvailableBefore', label: 'Stock Before', sortable: true, render: (value) => Number(value || 0).toLocaleString() },
    { key: 'stockAvailableAfter', label: 'Stock After', sortable: true, render: (value) => Number(value || 0).toLocaleString() },
    { key: 'stockOutDate', label: 'Stock Out Date', sortable: true, render: (value) => new Date(value).toLocaleDateString() },
  ];

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
              <h2 className="flex flex-wrap items-center text-xs sm:text-sm md:text-base font-semibold text-gray-800 gap-1 sm:gap-2">
                <span>EMS</span>
                <ChevronRight size={14} className="text-gray-400" />
                <span>DEPOT</span>
                <ChevronRight size={14} className="text-gray-400" />
                <span className="text-gray-900 font-bold">STOCK OUT</span>
              </h2>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-neutral-500 mr-2 sm:mr-4 md:mr-6">
            Total Products: {totalUniqueProducts}
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
      </div>

      {/* Data Table */}
      <Card title="Stock Out Records" subtitle={`Showing ${currentItems.length} of ${stockList.length} records`}>
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

export default DepotStockOut;