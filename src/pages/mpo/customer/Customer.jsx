import React, { useState } from "react";
import { useGetCustomersByStatusQuery } from "../../../redux/features/customer/customerApi";
import { BsArrowLeftSquareFill, BsArrowRightSquareFill } from "react-icons/bs";
import { ImSearch } from "react-icons/im";


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

  if (isLoading) return <p className="text-center py-10">Loading...</p>;
  if (isError) return <p className="text-center py-10">Failed to load customers</p>;

  return (
    <div className="bg-white pb-6">
      <div>
        <h1 className="px-6 py-3 font-bold">Customers List</h1>
        <hr className="border border-gray-500 mb-5" />
      </div>

      {/* Controls */}
      <div className="px-6 mb-5 flex flex-col-reverse md:flex-row justify-between items-center">
        <div className="space-x-2 mt-5 md:mt-0">
          <button
            className={`px-4 py-2 rounded ${
              statusFilter === "active" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setStatusFilter("active")}
          >
            Active Customers
          </button>
          <button
            className={`px-4 py-2 rounded ${
              statusFilter === "pending" ? "bg-red-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setStatusFilter("pending")}
          >
            Pending Customers
          </button>
        </div>

        <div className="flex items-center">
          <div className="border border-gray-500 border-r-0 p-2 rounded-l-full">
            <ImSearch />
          </div>
          <input
            type="text"
            placeholder="Search by name or ID"
            value={searchTerm}
            onChange={handleSearch}
            className="border border-gray-500 border-l-0 px-3 py-1 rounded-r-full focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto px-6">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 border-gray-400">
              <th className="py-2 px-4 text-center">Sl</th>
              <th className="py-2 px-4 text-center">Customer ID</th>
              <th className="py-2 px-4 text-left">Customer Name</th>
              <th className="py-2 px-4 text-left">Address</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No customers found
                </td>
              </tr>
            ) : (
              currentCustomers.map((c, idx) => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 text-center">{startIndex + idx + 1}</td>
                  <td className="py-2 px-4 text-center">{c.customerId}</td>
                  <td className="py-2 px-4">{c.customerName}</td>
                  <td className="py-2 px-4">{c.address}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1 mt-4 flex-wrap px-6">
          <button disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>
            <BsArrowLeftSquareFill className="w-6 h-6" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => changePage(page)}
              className={`mx-1 px-2 h-6 text-xs font-bold border rounded-md ${
                currentPage === page ? "bg-blue-600 text-white" : "border-gray-400"
              }`}
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

export default Customer;
