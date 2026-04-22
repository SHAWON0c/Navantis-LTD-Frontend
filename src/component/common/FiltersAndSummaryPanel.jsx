// import React, { useState } from 'react';
// import { MdPrint, MdFilterList, MdClear, MdRefresh } from 'react-icons/md';
// import { FiChevronDown } from 'react-icons/fi';

// const FiltersAndSummaryPanel = ({ id, filters, setFilters, totals, onClear, onPrint }) => {
//   const { searchTerm, year, month, fromDate, toDate, today } = filters;
//   const [showFilters, setShowFilters] = useState(false);

//   const handleToday = () => {
//     const t = new Date().toISOString().split('T')[0];
//     setFilters({ ...filters, fromDate: t, toDate: t, today: true });
//   };

//   return (
//     <div id={id} className="space-y-4 mt-6 mb-10">
//       {/* ================= FILTERS SECTION ================= */}
//       <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
//         {/* Filter Header */}
//         <div className="bg-gradient-to-r from-slate-400 via-slate-500 to-slate-400 px-5 py-4">
//           <button
//             onClick={() => setShowFilters(!showFilters)}
//             className="w-full flex items-center justify-between text-white hover:opacity-90 transition-opacity gap-3"
//           >
//             <div className="flex items-center gap-3">
//               <MdFilterList className="w-5 h-5" />
//               <span className="font-semibold text-sm tracking-wide">ADVANCED FILTERS</span>
//             </div>
//             <FiChevronDown className={`w-5 h-5 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
//           </button>
//         </div>

//         {/* Search Bar */}
//         <div className="px-5 py-4 bg-slate-50 border-b border-gray-200">
//           <input
//             type="text"
//             placeholder="Search products, orders, or references..."
//             value={searchTerm}
//             onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
//             className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//           />
//         </div>

//         {/* Expandable Filters */}
//         {showFilters && (
//           <div className="px-5 py-5 bg-white border-t border-gray-100">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//               {/* Year Filter */}
//               <div>
//                 <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Year</label>
//                 <select
//                   value={year}
//                   onChange={(e) => setFilters({ ...filters, year: e.target.value })}
//                   className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2.5 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
//                 >
//                   <option value="">All Years</option>
//                   {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
//                     <option key={y} value={y}>{y}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Month Filter */}
//               <div>
//                 <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Month</label>
//                 <select
//                   value={month}
//                   onChange={(e) => setFilters({ ...filters, month: e.target.value })}
//                   className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2.5 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
//                 >
//                   <option value="">All Months</option>
//                   {Array.from({ length: 12 }, (_, i) => (
//                     <option key={i + 1} value={i + 1}>
//                       {new Date(0, i).toLocaleString('default', { month: 'long' })}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* From Date Filter */}
//               <div>
//                 <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">From Date</label>
//                 <input
//                   type="date"
//                   value={fromDate}
//                   onChange={(e) => setFilters({ ...filters, fromDate: e.target.value, today: false })}
//                   className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2.5 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
//                 />
//               </div>

//               {/* To Date Filter */}
//               <div>
//                 <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">To Date</label>
//                 <input
//                   type="date"
//                   value={toDate}
//                   onChange={(e) => setFilters({ ...filters, toDate: e.target.value, today: false })}
//                   className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2.5 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
//                 />
//               </div>

//               {/* Action Buttons */}
//               <div className="flex gap-2 items-end">
//                 <button 
//                   onClick={handleToday}
//                   className="flex-1 px-3 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 uppercase tracking-wide shadow-sm hover:shadow-md"
//                 >
//                   Today
//                 </button>
//                 <button
//                   onClick={onClear}
//                   className="px-3 py-2.5 text-xs font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
//                   title="Reset all filters"
//                 >
//                   <MdClear className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ================= SUMMARY SECTION ================= */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//         {/* KPI Card 1 - Products */}
//         <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md border border-green-200 p-4 hover:shadow-lg transition-all duration-300 group">
//           <div className="flex items-start justify-between mb-3">
//             <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Total Products</p>
//             <div className="px-2 py-1 bg-green-200 rounded-md text-green-700 text-xs font-bold">📦</div>
//           </div>
//           <p className="text-2xl lg:text-3xl font-bold text-green-700 group-hover:text-green-800 transition-colors">
//             {totals.totalUniqueProducts || 0}
//           </p>
//           <p className="text-xs text-gray-600 mt-2">Active SKUs</p>
//         </div>

//         {/* KPI Card 2 - Units */}
//         <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md border border-blue-200 p-4 hover:shadow-lg transition-all duration-300 group">
//           <div className="flex items-start justify-between mb-3">
//             <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Total Units</p>
//             <div className="px-2 py-1 bg-blue-200 rounded-md text-blue-700 text-xs font-bold">📊</div>
//           </div>
//           <p className="text-2xl lg:text-3xl font-bold text-blue-700 group-hover:text-blue-800 transition-colors">
//             {totals.totalUnit ? totals.totalUnit.toLocaleString('en-IN') : 0}
//           </p>
//           <p className="text-xs text-gray-600 mt-2">Units in stock</p>
//         </div>

//         {/* KPI Card 3 - Trade Price */}
//         <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-md border border-orange-200 p-4 hover:shadow-lg transition-all duration-300 group">
//           <div className="flex items-start justify-between mb-3">
//             <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Trade Price</p>
//             <div className="px-2 py-1 bg-orange-200 rounded-md text-orange-700 text-xs font-bold">💰</div>
//           </div>
//           <p className="text-2xl lg:text-3xl font-bold text-orange-700 group-hover:text-orange-800 transition-colors">
//             {totals.totalTP ? totals.totalTP.toLocaleString('en-IN') : 0}
//           </p>
//           <p className="text-xs text-gray-600 mt-2">৳ Bengali Taka</p>
//         </div>

//         {/* Print Current Page Button */}
//         <button
//           onClick={() => onPrint({ all: false })}
//           className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl shadow-md border border-blue-800 p-4 hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex flex-col items-center justify-center font-semibold text-sm gap-2 group"
//         >
//           <MdPrint className="w-6 h-6 group-hover:scale-110 transition-transform" />
//           <span className="uppercase tracking-wide text-xs">Print Page</span>
//         </button>

//         {/* Print All Data Button */}
//         <button
//           onClick={() => onPrint({ all: true })}
//           className="bg-gradient-to-br from-slate-700 to-slate-800 text-white rounded-xl shadow-md border border-slate-900 p-4 hover:shadow-lg hover:from-slate-800 hover:to-slate-900 transition-all duration-300 flex flex-col items-center justify-center font-semibold text-sm gap-2 group"
//         >
//           <MdRefresh className="w-6 h-6 group-hover:scale-110 transition-transform" />
//           <span className="uppercase tracking-wide text-xs">Print All</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default FiltersAndSummaryPanel;


import React, { useState } from "react";
import {
  MdPrint,
  MdFilterList,
  MdClear,
  MdRefresh,
  MdInventory,
  MdBarChart,
  MdAttachMoney,
  MdSearch
} from "react-icons/md";
import { FiChevronDown } from "react-icons/fi";

const FiltersAndSummaryPanel = ({
  id,
  filters,
  setFilters,
  totals,
  onClear,
  onPrint
}) => {
  const { searchTerm, year, month, fromDate, toDate } = filters;
  const [showFilters, setShowFilters] = useState(false);

  const handleToday = () => {
    const t = new Date().toISOString().split("T")[0];
    setFilters({ ...filters, fromDate: t, toDate: t, today: true });
  };

  return (
    <div
      id={id}
      className="bg-white rounded-md shadow-sm border border-gray-200 p-1 mb-0.5"
    >
      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">

        {/* LEFT SIDE - FILTERS */}
        <div className="w-full flex flex-col justify-center h-full">

          <div className="flex flex-wrap justify-center items-center gap-1.5 w-full">

            {/* Search */}
            <div className="relative flex-1 min-w-32">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />

              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) =>
                  setFilters({ ...filters, searchTerm: e.target.value })
                }
                className="w-full pl-8 pr-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Year */}
            <select
              value={year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              className="px-2 py-1.5 border border-gray-200 rounded-md text-xs"
            >
              <option value="">Year</option>
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            {/* Month */}
            <select
              value={month}
              onChange={(e) => setFilters({ ...filters, month: e.target.value })}
              className="px-2 py-1.5 border border-gray-200 rounded-md text-xs"
            >
              <option value="">Month</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "short" })}
                </option>
              ))}
            </select>

            {/* Filters toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 px-2 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-xs"
            >
              <MdFilterList />
              Filters
              <FiChevronDown
                className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
              />
            </button>

            {/* Today */}
            <button
              onClick={handleToday}
              className="px-2 py-1.5 bg-blue-600 text-white rounded-md text-xs"
            >
              Today
            </button>

            {/* Clear */}
            <button onClick={onClear} className="p-1.5 bg-red-400 rounded-md text-white">
              <MdClear />
            </button>
          </div>

          {/* ADVANCED FILTERS */}
          {showFilters && (
            <div className="mt-1.5 p-2 bg-gray-50 rounded-md border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-600">From Date</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) =>
                      setFilters({ ...filters, fromDate: e.target.value, today: false })
                    }
                    className="w-full border px-2 py-1.5 rounded-md text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-600">To Date</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) =>
                      setFilters({ ...filters, toDate: e.target.value, today: false })
                    }
                    className="w-full border px-2 py-1.5 rounded-md text-xs"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDE - SUMMARY */}
        <div className="w-full flex flex-col justify-center gap-2">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-2">

            {/* Products */}
            <div className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-200 rounded-md px-2.5 py-1.5 w-full">
              <MdInventory className="text-green-600 text-xl" />
              <div>
                <p className="text-xs text-neutral-600">Products</p>
                <p className="text-base font-bold text-neutral-900">{totals.totalUniqueProducts || 0}</p>
              </div>
            </div>

            {/* Units */}
            <div className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-200 rounded-md px-2.5 py-1.5 w-full">
              <MdBarChart className="text-blue-600 text-xl" />
              <div>
                <p className="text-xs text-neutral-600">Units</p>
                <p className="text-base font-bold text-neutral-900">{totals.totalUnit ? totals.totalUnit.toLocaleString() : 0}</p>
              </div>
            </div>

            {/* Trade Price */}
            <div className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-200 rounded-md px-2.5 py-1.5 w-full">
              <MdAttachMoney className="text-orange-600 text-xl" />
              <div>
                <p className="text-xs text-neutral-600">Trade Price</p>
                <p className="text-base font-bold text-blue-600">৳{totals.totalTP ? totals.totalTP.toLocaleString() : 0}</p>
              </div>
            </div>

            {/* Print Buttons */}
            <div className="flex items-center justify-center gap-1 bg-neutral-50 border border-neutral-200 rounded-md px-2 py-1.5 w-full">
              <button onClick={() => onPrint(false)} className="flex items-center gap-1 px-2 py-1.5 bg-blue-600 text-white rounded-md text-xs">
                <MdPrint />
              </button>
              <button onClick={() => onPrint(true)} className="flex items-center gap-1 px-2 py-1.5 bg-slate-600 text-white rounded-md text-xs">
                <MdRefresh />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default FiltersAndSummaryPanel;
