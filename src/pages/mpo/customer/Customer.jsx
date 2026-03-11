import React, { useState } from "react";
import { useGetCustomersByStatusQuery } from "../../../redux/features/customer/customerApi";
import { BsArrowLeftSquareFill, BsArrowRightSquareFill } from "react-icons/bs";
import { ImSearch } from "react-icons/im";
import Card from "../../../component/common/Card";
import Button from "../../../component/common/Button";
import Loader from "../../../component/Loader";


const Customer = () => {
  const [statusFilter, setStatusFilter] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage, setCustomersPerPage] = useState(5);

  // Fetch customers by status
  const { data: response, isLoading, isError } = useGetCustomersByStatusQuery(statusFilter);
  const customers = response?.data || [];

  // Filter by search term
  const filteredCustomers = customers.filter(
    (c) =>
      c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(c.customerId).includes(searchTerm)
  );

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
  const startIndex = (currentPage - 1) * customersPerPage;
  const currentCustomers = filteredCustomers.slice(startIndex, startIndex + customersPerPage);

  // Handlers
  const changePage = (page) => setCurrentPage(page);

  const handleCustomersPerPageChange = (e) => {
    setCustomersPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  if (isLoading) return <Loader />;
  if (isError) return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <Card className="text-center">
        <p className="text-error text-lg">Failed to load customers.</p>
        <Button variant="primary" className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Customers</h1>
              <p className="text-neutral-600 text-sm">Manage customer information and status</p>
            </div>
          </div>
          <div className="text-sm text-neutral-500">
            Total Records: {filteredCustomers.length}
          </div>
        </div>
      </Card>

      {/* Data Table */}
      <Card title="Customers List" subtitle={`Showing ${currentCustomers.length} of ${filteredCustomers.length} records`}>
        <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-2">
            <Button
              variant={statusFilter === "active" ? "primary" : "outline"}
              size="small"
              onClick={() => setStatusFilter("active")}
            >
              Active
            </Button>
            <Button
              variant={statusFilter === "pending" ? "danger" : "outline"}
              size="small"
              onClick={() => setStatusFilter("pending")}
            >
              Pending
            </Button>
          </div>

          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <div className="border-r border-gray-300 p-2 bg-gray-50 flex items-center">
              <ImSearch className="text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search by name or ID"
              value={searchTerm}
              onChange={handleSearch}
              className="px-3 py-2 flex-1 focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Sl</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Customer ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Address</th>
              </tr>
            </thead>
            <tbody>
              {currentCustomers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-500">
                    No customers found
                  </td>
                </tr>
              ) : (
                currentCustomers.map((c, idx) => (
                  <tr key={c._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="text-center py-3 px-4">{startIndex + idx + 1}</td>
                    <td className="text-center py-3 px-4">{c.customerId}</td>
                    <td className="text-left py-3 px-4">{c.customerName}</td>
                    <td className="text-left py-3 px-4">{c.address}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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

export default Customer;
