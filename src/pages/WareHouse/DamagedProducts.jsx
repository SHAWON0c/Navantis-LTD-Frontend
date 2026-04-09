import React, { useState } from "react";
import { BsArrowLeftSquareFill, BsArrowRightSquareFill } from "react-icons/bs";
import Loader from "../../component/Loader";
import FiltersAndSummaryPanel from "../../component/common/FiltersAndSummaryPanel";
import { useGetAllDamageReportsQuery } from "../../redux/features/wareHouse/warehouseDamageApi";
import Card from "../../component/common/Card";
import Table from "../../component/common/Table";
import Button from "../../component/common/Button";
import { MdArrowBack } from "react-icons/md";

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

  if (isLoading) return <Loader />;
  if (isError) return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="text-center">
        <p className="text-error text-lg">Failed to load damaged products data.</p>
        <Button variant="primary" className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Card>
    </div>
  );

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

  // Table columns configuration
  const columns = [
    { key: 'slNo', label: 'Sl. No.', sortable: false, render: (value, row, index) => startIndex + index + 1 },
    { key: 'productName', label: 'Product Name', sortable: true },
    { key: 'batch', label: 'Batch', sortable: true },
    { key: 'receivedQty', label: 'Received Qty', sortable: true, render: (value) => Number(value || 0).toLocaleString() },
    { key: 'damageQty', label: 'Damage Qty', sortable: true, render: (value) => Number(value || 0).toLocaleString() },
    { key: 'remainingStock', label: 'Remaining Stock', sortable: true, render: (value) => Number(value || 0).toLocaleString() },
    { key: 'createdAt', label: 'Damage Date', sortable: true, render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A' },
    { key: 'addedBy', label: 'Added By', sortable: false, render: (value) => value?.name || 'N/A' },
    {
      key: 'actions',
      label: 'Action',
      sortable: false,
      render: (value, row) => (
        <Button
          variant="primary"
          size="small"
          onClick={() => {
            setDetailsModalOpen(true);
            setSelectedProduct(row);
          }}
          disabled
        >
          Details
        </Button>
      )
    },
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
              <h1 className="text-2xl font-bold text-neutral-900">Damaged Products</h1>
              <p className="text-neutral-600 text-sm">//damaged product reports and inventory</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-neutral-500">
              Total Records: {damagedList.length}
            </div>
            <Button
              variant="danger"
              size="small"
              onClick={() => setDamageRequestsOpen(true)}
            >
              Pending Damage Requests
            </Button>
          </div>
        </div>
      </Card>

      {/* Filters + Summary */}
      <div className="mb-6">
        <FiltersAndSummaryPanel
          filters={filters}
          setFilters={setFilters}
          totals={{ totalUniqueProducts, totalUnit }}
          onClear={clearFilters}
        />
      </div>

      {/* Items per page selector */}
      <Card className="mb-6">
        <div className="flex items-center gap-2">
          <label htmlFor="productsPerPage" className="text-sm font-medium text-neutral-700">Show</label>
          <select
            id="productsPerPage"
            value={productsPerPage}
            onChange={handleProductsPerPageChange}
            className="border border-neutral-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-neutral-600">products per page</span>
        </div>
      </Card>

      {/* Data Table */}
      <Card title="Damaged Products Records" subtitle={`Showing ${currentProducts.length} of ${damagedList.length} records`}>
        <Table
          columns={columns}
          data={currentProducts}
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

      {/* Modals */}
      {/* Modals will be implemented when the modal components are available */}
      {/* {isDetailsModalOpen && (
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
      )} */}
    </div>
  );
};

export default DamagedProducts;
