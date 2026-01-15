import React, { useState } from "react";

import Loader from "../../../component/Loader";
import { BsArrowLeftSquareFill, BsArrowRightSquareFill } from "react-icons/bs";
import { MdPrint } from "react-icons/md";
import { useGetPurchaseOrdersQuery } from "../../../redux/features/HQ/MD/purchaseOrder/purchaseOrderApi";
import AdminPurchaseInvoice from "../../../component/reports/AdminPrintPurchaseProductList";

const PurchaseOrderList = () => {
  const { data, isLoading, isError } = useGetPurchaseOrdersQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);

  const [searchTerm, setSearchTerm] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  if (isLoading) return <Loader />;
  if (isError) return <p className="text-red-500 text-center">Failed to load purchase orders.</p>;

  let purchaseOrders = data?.data || [];

  // --- Filtering ---
  purchaseOrders = purchaseOrders.filter((order) => {
    const orderYear = new Date(order.purchaseDate).getFullYear();
    const orderMonth = new Date(order.purchaseDate).getMonth() + 1;

    const matchesSearch = order.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = year ? orderYear === Number(year) : true;
    const matchesMonth = month ? orderMonth === Number(month) : true;
    const matchesFromDate = fromDate ? new Date(order.purchaseDate) >= new Date(fromDate) : true;
    const matchesToDate = toDate ? new Date(order.purchaseDate) <= new Date(toDate) : true;

    return matchesSearch && matchesYear && matchesMonth && matchesFromDate && matchesToDate;
  });

  // --- Invoice Summary ---
  const totalUniqueProducts = purchaseOrders.length;
  const totalUnit = purchaseOrders.reduce((acc, order) => acc + order.productQuantity, 0);
  const totalTP = purchaseOrders.reduce((acc, order) => acc + order.tradePrice * order.productQuantity, 0);
  const totalAP = purchaseOrders.reduce((acc, order) => acc + order.tradePrice * order.productQuantity, 0);

  const clearFilters = () => {
    setSearchTerm("");
    setYear("");
    setMonth("");
    setFromDate("");
    setToDate("");
  };

  // --- Pagination ---
  const totalPages = Math.ceil(purchaseOrders.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = purchaseOrders.slice(startIndex, startIndex + productsPerPage);

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="mx-auto p-2">
      {/* Top Page Header */}
      <div className="bg-white text-gray-500 h-12 flex items-center px-6">
        <h2 className="text-base font-bold">
          NPL / Admin / Purchase Order List
        </h2>
      </div>

      {/* Filters & Invoice Summary */}
      <div className="flex flex-col md:flex-row gap-6 mt-4">
        {/* Filters */}
        <div className="w-full md:w-1/2 bg-white p-4 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Search */}
            <div>
              <label className="block font-semibold mb-1">Search by name</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            {/* Year */}
            <div>
              <label className="block font-semibold mb-1">Year</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">All Years</option>
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Month */}
            <div>
              <label className="block font-semibold mb-1">Month</label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">All Months</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                  </option>
                ))}
              </select>
            </div>

            {/* From Date */}
            <div>
              <label className="block font-semibold mb-1">From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            {/* To Date */}
            <div>
              <label className="block font-semibold mb-1">To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            {/* Today Button */}
            <div>
               <label className="block font-semibold mb-1">Today</label>
              <button
                type="button"
                onClick={() => {
                  const today = new Date().toISOString().split("T")[0];
                  setFromDate(today);
                  setToDate(today);
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                Today
              </button>
            </div>

            {/* Clear Filters */}
            <div className="md:col-span-3">
              <button
                onClick={clearFilters}
                className="w-full bg-[#0F213D] text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="w-full md:w-3/6 p-4 bg-blue-100 rounded-lg shadow-sm">
          <h3 className="font-bold text-center mb-4">Invoice Summary</h3>

          <div className="flex justify-between mb-4">
            <div className="text-center">
              <p className="font-semibold">Total Products</p>
              <p className="font-bold text-green-600">{totalUniqueProducts}</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">Total Unit</p>
              <p className="font-bold text-blue-600">{totalUnit}</p>
            </div>
          </div>

          <table className="table-auto w-full text-left">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-2 py-1">Price Type</th>
                <th className="px-2 py-1 text-right">Total Price (৳)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-2 py-1">Trade Price (TP)</td>
                <td className="px-2 py-1 text-right">
                  {totalTP.toLocaleString("en-IN")}/-
                </td>
              </tr>
            </tbody>
          </table>

          <button
            onClick={() => AdminPurchaseInvoice({
              purchaseOrders,
              totalUniqueProducts,
              totalUnit,
              totalTP,
              totalAP,
              fromDate,
              toDate
            })()}
            className="w-full bg-[#0F213D] text-white rounded-lg px-4 py-2 mt-4 hover:bg-[#214277] flex items-center justify-center"
          >
            <MdPrint className="mr-2" /> Print Invoice
          </button>
        </div>
      </div>

      {/* Purchase Order Table */}
      <div className="overflow-x-auto mt-10">
        <table className="table-auto w-full border border-gray-300 text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Sl. No.</th>
              <th className="px-4 py-2 border">Product Name</th>
              <th className="px-4 py-2 border">Net Weight</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Quantity</th>
              <th className="px-4 py-2 border">Batch</th>
              <th className="px-4 py-2 border">Expire Date</th>
              <th className="px-4 py-2 border">AP</th>
              <th className="px-4 py-2 border">TP</th>
              <th className="px-4 py-2 border">Added By</th>
              <th className="px-4 py-2 border">Purchase Date</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((order, idx) => (
              <tr key={order._id} className="border-b">
                <td className="px-4 py-2 border text-center">{startIndex + idx + 1}</td>
                <td className="px-4 py-2 border">{order.productName}</td>
                <td className="px-4 py-2 border">{`${order.netWeight.value}${order.netWeight.unit}`}</td>
                <td className="px-4 py-2 border">{order.category}</td>
                <td className="px-4 py-2 border text-center">{order.productQuantity}</td>
                <td className="px-4 py-2 border text-center">{order.batch}</td>
                <td className="px-4 py-2 border text-center">{new Date(order.expireDate).toLocaleDateString()}</td>
                <td className="px-4 py-2 border text-right">{order.actualPrice.toLocaleString('en-IN')}/-</td>
                <td className="px-4 py-2 border text-right">{order.tradePrice.toLocaleString('en-IN')}/-</td>
                <td className="px-4 py-2 border">{order.addedBy.name}</td>
                <td className="px-4 py-2 border">{new Date(order.purchaseDate).toLocaleDateString()}</td>
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
            className="disabled:opacity-50 hover:text-blue-700 transition-all"
          >
            <BsArrowLeftSquareFill className="w-6 h-6" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => changePage(page)}
              className={`px-3 py-1 rounded ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              {page}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => changePage(currentPage + 1)}
            className="disabled:opacity-50 hover:text-blue-700 transition-all"
          >
            <BsArrowRightSquareFill className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrderList;
