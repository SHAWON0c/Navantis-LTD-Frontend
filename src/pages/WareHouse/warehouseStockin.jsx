import React, { useState } from "react";
import Loader from "../../component/Loader";
import { BsArrowLeftSquareFill, BsArrowRightSquareFill } from "react-icons/bs";
import FiltersAndSummaryPanel from "../../component/common/FiltersAndSummaryPanel";
import { useGetWarehouseStockListQuery } from "../../redux/features/wareHouse/warehouseStockApi";
import PrintWarehouseStockinList from "../../component/reports/printWarehouseStockinList";
import Card from "../../component/common/Card";
import Table from "../../component/common/Table";
import Button from "../../component/common/Button";
import { MdArrowBack } from "react-icons/md";

const WarehouseStockIn = () => {
  // --- API query ---
  const { data, isLoading, isError } = useGetWarehouseStockListQuery(undefined, {
    pollingInterval: 10000,
  });

  // --- Pagination state ---
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(20);

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
    <div className="min-h-screen flex items-center justify-center">
      <Card className="text-center">
        <p className="text-error text-lg">Failed to load warehouse stock data.</p>
        <Button variant="primary" className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Card>
    </div>
  );

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

  // Table columns configuration
  const columns = [
    { key: 'slNo', label: 'Sl. No.', sortable: false, render: (value, row, index) => startIndex + index + 1 },
    { key: 'Name', label: 'Product Name', sortable: true },
    { key: 'PackSize', label: 'Pack Size', sortable: true },
    { key: 'Batch', label: 'Batch', sortable: true },
    { key: 'Quantity', label: 'Quantity', sortable: true, render: (value) => Number(value || 0).toLocaleString() },
    { key: 'Expire', label: 'Expire Date', sortable: true, render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A' },
    { key: 'PriceUnitTP', label: 'TP', sortable: true, render: (value) => `৳${Number(value || 0).toLocaleString()}` },
    { key: 'TotalPrice', label: 'Total Price', sortable: true, render: (value) => `৳${Number(value || 0).toLocaleString()}` },
    { key: 'stockStatus', label: 'Stock Status', sortable: true },
    { key: 'Date', label: 'Stock In Date', sortable: true, render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A' },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="small" icon={MdArrowBack} onClick={() => window.history.back()}>
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Warehouse Stock In</h1>
              <p className="text-neutral-600 text-xs">//warehouse incoming stock inventory</p>
            </div>
          </div>
          <div className="text-xs text-neutral-500">
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
            PrintWarehouseStockinList({
              purchaseOrders: stockList,
              totalUniqueProducts,
              totalUnit,
              totalTP,
              fromDate: filters.fromDate,
              toDate: filters.toDate
            })()
          }
        />
      </div>

      {/* Data Table */}
      <Card title="Warehouse Stock In Records" subtitle={`Showing ${currentItems.length} of ${stockList.length} records`}>
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
    </div>
  );
};

export default WarehouseStockIn;
