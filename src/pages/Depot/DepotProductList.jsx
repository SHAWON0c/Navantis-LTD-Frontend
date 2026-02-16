// import { useState } from "react";
// import { BsArrowLeftSquareFill, BsArrowRightSquareFill } from "react-icons/bs";
// import { ImSearch } from "react-icons/im";
// import WarehouseProductCard from "../../component/common/WarehouseProductCard";
// import DepotProductSummaryPanel from "../../component/common/DepotProductSummaryPanel";
// import DepotProductRequestModal from "../../component/modals/DepotProductRequestModal";
// import { useGetDepotProductListQuery } from "../../redux/features/depot/depotStockApi";
// import DepotProductCard from "../../component/common/DepotProductCard";


// const DepotProductsList = () => {
//   // --- API Data ---
//   const { data, isLoading, isError } = useGetDepotProductListQuery();
//   const whProducts = data?.data || [];

//   // --- Pagination & Filters ---
//   const [currentPage, setCurrentPage] = useState(1);
//   const [productsPerPage, setProductsPerPage] = useState(5);
//   const [searchTerm, setSearchTerm] = useState("");

//   // --- Modal State ---
//   const [requestModalOpen, setRequestModalOpen] = useState(false);

//   // --- Filtering & Sorting ---
//   const filteredProducts = whProducts
//     .filter((product) =>
//       product.productName?.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//     .sort((a, b) => a.productName.localeCompare(b.productName));

//   const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
//   const startIndex = (currentPage - 1) * productsPerPage;
//   const endIndex = Math.min(
//     startIndex + productsPerPage,
//     filteredProducts.length
//   );
//   const currentProducts = filteredProducts.slice(startIndex, endIndex);

//   // --- Totals ---
//   const totalUnit = filteredProducts.reduce(
//     (sum, p) => sum + Number(p.totalQuantity),
//     0
//   );

//   const totalTradePrice = filteredProducts.reduce(
//     (sum, p) => sum + (p.tradePrice || 0) * p.totalQuantity,
//     0
//   );

//   // --- Handlers ---
//   const changePage = (page) => setCurrentPage(page);

//   const handleProductsPerPageChange = (e) => {
//     setProductsPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//     setCurrentPage(1);
//   };

//   const handlePrint = () => {
//     CurrentWarehouseStockInvoice({
//       invoiceWithAP: 0,
//       totalUnit,
//       totalActualPrice: 0,
//       totalTradePrice,
//       filteredProducts,
//     });
//   };

//   if (isLoading) return <p className="text-center py-10">Loading...</p>;
//   if (isError) return <p className="text-center py-10">Failed to load data</p>;

//   return (
//     <>
//       <div className="bg-white pb-1">
//         <div>
//           <h1 className="px-6 py-3 font-bold">Warehouse products list</h1>
//           <hr className="text-center border border-gray-500 mb-5" />
//         </div>

//         {/* Summary */}
//         <div className="m-6 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-md">
//           <p className="text-md text-gray-700 text-center mb-4 font-medium">
//             Warehouse Summary
//           </p>

//           <DepotProductSummaryPanel
//             totals={{
//               totalUniqueProducts: filteredProducts.length,
//               totalUnit,
//               totalTP: totalTradePrice,
//             }}
//             onRequest={() => setRequestModalOpen(true)}
//             onPrint={handlePrint}
//           />
//         </div>

//         {/* Controls */}
//         <div className="px-6 pb-6">
//           <div className="mb-5 flex flex-col-reverse md:flex-row justify-center md:justify-between items-center">
//             <div className="mt-5 md:mt-0">
//               <label>Show</label>
//               <select
//                 value={productsPerPage}
//                 onChange={handleProductsPerPageChange}
//                 className="border border-gray-500 rounded p-1 mx-2"
//               >
//                 <option value={5}>5</option>
//                 <option value={10}>10</option>
//                 <option value={15}>15</option>
//                 <option value={20}>20</option>
//                 <option value={50}>50</option>
//               </select>
//               <label>products per page</label>
//             </div>

//             {/* Search */}
//             <div className="flex justify-center rounded-l-lg">
//               <div className="flex items-center border border-gray-500 border-r-0 p-3 rounded-l-full">
//                 <ImSearch />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search products"
//                 value={searchTerm}
//                 onChange={handleSearch}
//                 className="border border-gray-500 border-l-0 px-3 py-1 rounded-r-full focus:outline-none"
//               />
//             </div>
//           </div>

//           {/* Table */}
//           <div className="overflow-x-auto mb-3">
//             <table className="table-auto w-full border-collapse">
//               <thead>
//                 <tr className=" border-gray-400 bg-gray-100">
//                   <th className="text-center py-2 px-4">Sl. No.</th>
//                   <th className="text-left py-2 px-4">Name</th>
//                   <th className="text-center py-2 px-4">Pack Size</th>
//                   <th className="text-center py-2 px-4">Batch</th>
//                   <th className="text-center py-2 px-4">Exp.</th>
//                   <th className="text-center py-2 px-4">Quantity</th>
//                   <th className="text-right py-2 px-4">Price/Unit</th>
//                   <th className="text-right py-2 px-4">Total Price</th>
//                   <th className="text-center py-2 px-4">Action</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {currentProducts.map((product, idx) => (
//                   <DepotProductCard
//                     key={product._id}
//                     product={product}
//                     slNo={startIndex + idx + 1} // Serial number
//                   />
//                 ))}
//               </tbody>
//             </table>
//           </div>


//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex justify-center items-center gap-1 mt-4 flex-wrap">
//               <button
//                 disabled={currentPage === 1}
//                 onClick={() => changePage(currentPage - 1)}
//               >
//                 <BsArrowLeftSquareFill className="w-6 h-6" />
//               </button>

//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                 (page) => (
//                   <button
//                     key={page}
//                     onClick={() => changePage(page)}
//                     className={`mx-1 px-2 h-6 text-xs font-bold border rounded-md ${currentPage === page
//                       ? "bg-blue-600 text-white"
//                       : "border-gray-400"
//                       }`}
//                   >
//                     {page}
//                   </button>
//                 )
//               )}

//               <button
//                 disabled={currentPage === totalPages}
//                 onClick={() => changePage(currentPage + 1)}
//               >
//                 <BsArrowRightSquareFill className="w-6 h-6" />
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* MODAL */}
//       <DepotProductRequestModal
//         isOpen={requestModalOpen}
//         onClose={() => setRequestModalOpen(false)}
//       />
//     </>
//   );
// };

// export default DepotProductsList;


import { useState } from "react";
import { BsArrowLeftSquareFill, BsArrowRightSquareFill } from "react-icons/bs";
import { ImSearch } from "react-icons/im";

import DepotProductSummaryPanel from "../../component/common/DepotProductSummaryPanel";
import DepotProductRequestModal from "../../component/modals/DepotProductRequestModal";
import DepotProductCard from "../../component/common/DepotProductCard";

import { useGetDepotProductListQuery } from "../../redux/features/depot/depotStockApi";
import PrintDepotStockList from "../../component/reports/PrintDepotStockList";

const DepotProductsList = () => {
  // --- API Data ---
  const { data, isLoading, isError } = useGetDepotProductListQuery();

  const products = data?.data || [];
  const summary = {
    totalUniqueProducts: data?.totalUniqueProducts || 0,
    totalUnit: data?.totalUnits || 0,
    totalTP: data?.totalTradePrice || 0,
  };

  // --- Pagination & Filters ---
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  // --- Modal ---
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  // --- Filter + Sort ---
  const filteredProducts = products
    .filter((p) =>
      p.productName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.productName.localeCompare(b.productName));

  // --- Pagination ---
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  // --- Handlers ---
  const changePage = (page) => setCurrentPage(page);

  const handleProductsPerPageChange = (e) => {
    setProductsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  const handlePrint = () => {
    // Call the print component and pass the data
    PrintDepotStockList({
      products: products,  // filtered products for current view
      summary: {
        totalUniqueProducts: data?.totalUniqueProducts || 0,
        totalUnits: data?.totalUnits || 0,
        totalTradePrice: data?.totalTradePrice || 0,
      },
    });
  };

  if (isLoading) return <p className="text-center py-10">Loading...</p>;
  if (isError) return <p className="text-center py-10">Failed to load data</p>;

  return (
    <>
      <div className="bg-white pb-1">
        <div>
          <h1 className="px-6 py-3 font-bold">Depot products list</h1>
          <hr className="border border-gray-500 mb-5" />
        </div>

        {/* Summary */}
        <div className="m-6 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-md">
          <p className="text-md text-gray-700 text-center mb-4 font-medium">
            Depot Summary
          </p>

          <DepotProductSummaryPanel
            totals={summary}
            onRequest={() => setRequestModalOpen(true)}
            onPrint={handlePrint}
          />
        </div>

        {/* Controls */}
        <div className="px-6 pb-6">
          <div className="mb-5 flex flex-col-reverse md:flex-row justify-between items-center">
            {/* Pagination Control */}
            <div className="mt-5 md:mt-0">
              <label>Show</label>
              <select
                value={productsPerPage}
                onChange={handleProductsPerPageChange}
                className="border border-gray-500 rounded p-1 mx-2"
              >
                {[5, 10, 15, 20, 50].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <label>products per page</label>
            </div>

            {/* Search */}
            <div className="flex items-center">
              <div className="border border-gray-500 border-r-0 p-2 rounded-l-full">
                <ImSearch />
              </div>
              <input
                type="text"
                placeholder="Search products"
                value={searchTerm}
                onChange={handleSearch}
                className="border border-gray-500 border-l-0 px-3 py-1 rounded-r-full focus:outline-none"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto mb-3">
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-gray-400">
                  <th className="py-2 px-4 text-center">Sl</th>
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-center">Pack</th>
                  <th className="py-2 px-4 text-center">Batch</th>
                  <th className="py-2 px-4 text-center">Exp</th>
                  <th className="py-2 px-4 text-center">Qty</th>
                  <th className="py-2 px-4 text-right">TP/Unit</th>
                  <th className="py-2 px-4 text-right">Total TP</th>
                  <th className="py-2 px-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {currentProducts.map((product, idx) => (
                  <DepotProductCard
                    key={product._id}
                    product={product}
                    slNo={startIndex + idx + 1}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-1 mt-4 flex-wrap">
              <button disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>
                <BsArrowLeftSquareFill className="w-6 h-6" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => changePage(page)}
                  className={`mx-1 px-2 h-6 text-xs font-bold border rounded-md ${currentPage === page ? "bg-blue-600 text-white" : "border-gray-400"
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
      </div>

      {/* Modal */}
      <DepotProductRequestModal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
      />
    </>
  );
};

export default DepotProductsList;
