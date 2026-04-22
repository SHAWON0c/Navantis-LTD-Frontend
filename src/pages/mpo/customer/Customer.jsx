import React, { useState } from "react";
import { useGetCustomersByStatusQuery } from "../../../redux/features/customer/customerApi";
import { BsArrowLeftSquareFill, BsArrowRightSquareFill } from "react-icons/bs";
import { ImSearch } from "react-icons/im";
import Card from "../../../component/common/Card";
import Button from "../../../component/common/Button";
import Loader from "../../../component/Loader";
import { ChevronRight } from "lucide-react";
import { MdArrowBack } from "react-icons/md";


const Customer = () => {
  const [statusFilter, setStatusFilter] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage, setCustomersPerPage] = useState(20);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Fetch customers by status
  const { data: response, isLoading, isError } = useGetCustomersByStatusQuery(statusFilter);
  const customers = response?.data || [];

  // Filter by search term
  const filteredCustomers = customers.filter(
    (c) =>
      String(c?.customerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(c?.customerId || "").includes(searchTerm) ||
      String(c?.mobile || "").includes(searchTerm) ||
      String(c?.email || "").toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="min-h-screen flex items-center justify-center">
      <Card className="text-center">
        <p className="text-error text-lg">Failed to load customers.</p>
        <Button variant="primary" className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Card>
    </div>
  );

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
                <span>MPO</span>
                <ChevronRight size={14} className="text-gray-400" />
                <span className="text-gray-900 font-bold">CUSTOMER LIST</span>
              </h2>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-neutral-500 mr-2 sm:mr-4 md:mr-6">
            Total Records: {filteredCustomers.length}
          </div>
        </div>
      </Card>


      {/* Data Table */}
      <Card title="Customers List" subtitle={`Showing ${currentCustomers.length} of ${filteredCustomers.length} records`}>
        <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-4 ml-2">
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
              onClick={() => {
                setStatusFilter("pending");
                setCurrentPage(1);
              }}
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
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Sl</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Customer ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Address</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Details</th>
              </tr>
            </thead>
            <tbody>
              {currentCustomers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    No customers found
                  </td>
                </tr>
              ) : (
                currentCustomers.map((c, idx) => (
                  <tr key={c._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="text-center py-3 px-4">{startIndex + idx + 1}</td>
                    <td className="text-center py-3 px-4">{c.customerId ?? "?"}</td>
                    <td className="text-left py-3 px-4">{c.customerName || "?"}</td>
                    <td className="text-left py-3 px-4">{c.address || "?"}</td>
                    <td className="text-center py-3 px-4">
                      <Button variant="outline" size="small" onClick={() => setSelectedCustomer(c)}>
                        Details
                      </Button>
                    </td>
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

      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSelectedCustomer(null)}
          ></div>

          <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Customer Details</h3>
              <Button variant="outline" size="small" onClick={() => setSelectedCustomer(null)}>
                Close
              </Button>
            </div>

            <div className="p-5 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <DetailItem label="Customer ID" value={selectedCustomer.customerId} />
                <DetailItem label="Customer Name" value={selectedCustomer.customerName} />
                <DetailItem label="Market Point ID" value={selectedCustomer.marketPointId} />
                <DetailItem label="Market Point Name" value={selectedCustomer.marketPointName} />
                <DetailItem label="Trade License" value={selectedCustomer.tradeLicense} />
                <DetailItem label="Drug License" value={selectedCustomer.drugLicense} />
                <DetailItem label="Mobile" value={selectedCustomer.mobile} />
                <DetailItem label="Mobile Normalized" value={selectedCustomer.mobileNormalized} />
                <DetailItem label="Email" value={selectedCustomer.email} />
                <DetailItem label="Email Normalized" value={selectedCustomer.emailNormalized} />
                <DetailItem label="Contact Person" value={selectedCustomer.contactPerson} />
                <DetailItem label="Added By" value={selectedCustomer.addedBy} />
                <DetailItem label="Added By Name" value={selectedCustomer.addedByName} />
                <DetailItem label="Status" value={selectedCustomer.status} />
                <DetailItem label="Discount" value={selectedCustomer.discount} />
                <DetailItem label="Credit Limit" value={selectedCustomer.creditLimit} />
                <DetailItem label="Day Limit" value={selectedCustomer.dayLimit} />
                <DetailItem label="Current Level" value={selectedCustomer?.approvalStatus?.currentLevel} />
                <DetailItem label="Address" value={selectedCustomer.address} className="md:col-span-2" />
                <DetailItem
                  label="Pay Mode"
                  value={Array.isArray(selectedCustomer.payMode) ? selectedCustomer.payMode.join(", ") : "?"}
                  className="md:col-span-2"
                />
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">Approval History</h4>
                {Array.isArray(selectedCustomer?.approvalStatus?.approvedBy) &&
                selectedCustomer.approvalStatus.approvedBy.length > 0 ? (
                  <div className="space-y-2">
                    {selectedCustomer.approvalStatus.approvedBy.map((item) => (
                      <div key={item?._id || item?.user} className="p-3 rounded-lg border border-gray-200 text-sm">
                        <p><span className="font-medium">Role:</span> {item?.role || "?"}</p>
                        <p><span className="font-medium">Approver:</span> {item?.approverName || item?.user || "?"}</p>
                        <p><span className="font-medium">Approved At:</span> {item?.approvedAt || "?"}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">?</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailItem = ({ label, value, className = "" }) => (
  <div className={className}>
    <p className="text-gray-500">{label}</p>
    <p className="font-medium text-gray-800 wrap-break-word">{value !== undefined && value !== null && value !== "" ? String(value) : "?"}</p>
  </div>
);

export default Customer;
