
// import { useState } from "react";
// import { BsArrowLeftSquareFill, BsArrowRightSquareFill } from "react-icons/bs";
// import { ImSearch } from "react-icons/im";
// import { useGetWarehouseProductListQuery } from "../../redux/features/wareHouse/warehouseStockApi";
// import SummaryPanel from "../../component/common/SummaryPanel";
// import WarehouseProductCard from "../../component/common/WarehouseProductCard";

// const WarehouseProductsList = () => {
//     // --- API ---
//     const { data, isLoading } = useGetWarehouseProductListQuery();
//     const whProducts = data?.data || [];

//     // --- State ---
//     const [currentPage, setCurrentPage] = useState(1);
//     const [productsPerPage, setProductsPerPage] = useState(5);
//     const [searchTerm, setSearchTerm] = useState("");

//     // ✅ single selected product + warehouse receive
//     const [selectedProductId, setSelectedProductId] = useState(null);
//     const [selectedWarehouseReceiveId, setSelectedWarehouseReceiveId] = useState(null);

//     // --- Filter + Sort ---
//     const filteredProducts = whProducts
//         .filter(p =>
//             p.productName?.toLowerCase().includes(searchTerm.toLowerCase())
//         )
//         .sort((a, b) => a.productName.localeCompare(b.productName));

//     // --- Pagination ---
//     const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
//     const startIndex = (currentPage - 1) * productsPerPage;
//     const currentProducts = filteredProducts.slice(
//         startIndex,
//         startIndex + productsPerPage
//     );

//     // --- Totals ---
//     const totalUnit = filteredProducts.reduce(
//         (sum, p) => sum + Number(p.totalQuantity || 0),
//         0
//     );

//     const totalTradePrice = filteredProducts.reduce(
//         (sum, p) => sum + (p.tradePrice || 0) * (p.totalQuantity || 0),
//         0
//     );

//     // --- Single select toggle ---
//     const toggleProduct = (product) => {
//         if (selectedProductId === product._id) {
//             setSelectedProductId(null);
//             setSelectedWarehouseReceiveId(null);
//         } else {
//             setSelectedProductId(product._id);
//             setSelectedWarehouseReceiveId(product.warehouseReceiveId || null);
//         }
//     };

//     // --- Damage submit ---
//     const handleDamageSubmit = ({ warehouseProductId, warehouseReceiveId }) => {
//         console.log("Damage submit:");
//         console.log("Product:", warehouseProductId);
//         console.log("Receive:", warehouseReceiveId);
//     };

//     // --- Print ---
//     const handlePrint = () => {
//         console.log("Selected product:", selectedProductId);
//         console.log("Warehouse receive:", selectedWarehouseReceiveId);
//     };

//     if (isLoading) {
//         return <p className="text-center py-10">Loading...</p>;
//     }

//     return (
//         <div className="mx-auto p-2 bg-white">

//               <div className="bg-white text-gray-500 h-12 flex items-center px-6 justify-between border-b border-gray-200">
//         {/* Left side: Title */}
//         <h2 className="text-base font-bold">NPL / Admin / Purchase Order</h2>

//         {/* Right side: Notification ticker (70% width) */}
//         <div className="overflow-hidden w-[80%] h-full relative flex items-center">
//           <div className="absolute whitespace-nowrap animate-slide text-red-600 font-semibold">
//             🚨 নতুন নোটিফিকেশন: প্রোডাক্ট XYZ-এর স্টক সংকটের পর্যায়ে পৌঁছেছে! অনুগ্রহ করে দ্রুত ব্যবস্থা নিন। ⚠️
//             🚨 নতুন নোটিফিকেশন: সার্ভার রক্ষণাবেক্ষণ আপডেট ৫ টায় শুরু হবে।
//           </div>

//         </div>
//       </div>

        

//             {/* Summary */}
//             <div className="m-6 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-md">
//                 <SummaryPanel
//                     totals={{
//                         totalUniqueProducts: filteredProducts.length,
//                         totalUnit,
//                         totalTP: totalTradePrice,
//                         selectedWarehouseProductId: selectedProductId,
//                         warehouseReceiveId: selectedWarehouseReceiveId
//                     }}
//                     onDamageSubmit={handleDamageSubmit}
//                     onPrint={handlePrint}
//                 />
//             </div>

//             {/* Controls */}
//             <div className="px-6 pb-6 flex justify-between items-center">
//                 <select
//                     value={productsPerPage}
//                     onChange={(e) => {
//                         setProductsPerPage(Number(e.target.value));
//                         setCurrentPage(1);
//                     }}
//                     className="border border-gray-500 rounded p-1"
//                 >
//                     {[5, 10, 15, 20, 50].map(v => (
//                         <option key={v} value={v}>{v}</option>
//                     ))}
//                 </select>

//                 <div className="flex">
//                     <div className="border border-gray-500 border-r-0 p-3 rounded-l-full">
//                         <ImSearch />
//                     </div>
//                     <input
//                         value={searchTerm}
//                         onChange={(e) => {
//                             setSearchTerm(e.target.value);
//                             setCurrentPage(1);
//                         }}
//                         placeholder="Search products"
//                         className="border border-gray-500 border-l-0 px-3 rounded-r-full"
//                     />
//                 </div>
//             </div>

//             {/* Table */}
//             <div className="overflow-x-auto px-6">
//                 <table className="table">
//                     <thead>
//                         <tr>
//                             <th className="text-center">✔</th>
//                             <th className="text-center">Sl</th>
//                             <th>Name</th>
//                             <th>Pack Size</th>
//                             <th className="text-center">Batch</th>
//                             <th className="text-center">Exp</th>
//                             <th className="text-center">Qty</th>
//                             <th className="text-right">Price</th>
//                             <th className="text-right">Total</th>
//                             <th className="text-center">Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {currentProducts.map((product, idx) => (
//                             <WarehouseProductCard
//                                 key={product._id}
//                                 idx={startIndex + idx + 1}
//                                 product={product}
//                                 checked={selectedProductId === product._id}
//                                 onToggle={() => toggleProduct(product)}
//                             />
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Pagination */}
//               {totalPages > 1 && (
//                         <div className="flex justify-center items-center gap-1 mt-4 flex-wrap">
//                             <button
//                                 disabled={currentPage === 1}
//                                 onClick={() => changePage(currentPage - 1)}
//                                 className="disabled:opacity-50 hover:text-blue-700 transition-all"
//                             >
//                                 <BsArrowLeftSquareFill className='w-6 h-6' />
//                             </button>

//                             {Array.from({ length: totalPages }, (_, i) => i + 1)
//                                 .filter(page =>
//                                     page === 1 ||
//                                     page === totalPages ||
//                                     Math.abs(currentPage - page) <= 1
//                                 )
//                                 .reduce((acc, page, index, array) => {
//                                     if (index > 0 && page - array[index - 1] > 1) {
//                                         acc.push('...');
//                                     }
//                                     acc.push(page);
//                                     return acc;
//                                 }, [])
//                                 .map((page, index) => (
//                                     <button
//                                         key={index}
//                                         disabled={page === '...'}
//                                         onClick={() => page !== '...' && changePage(page)}
//                                         className={`
//                                             mx-1 h-6 flex items-center justify-center text-xs font-bold border
//                                             ${currentPage === page
//                                                 ? 'bg-[#3B82F6] text-white border-green-900'
//                                                 : 'border-gray-400 hover:bg-blue-100'}
//                                             ${page === '...'
//                                                 ? 'cursor-default text-gray-500 border-none'
//                                                 : ''
//                                             }
//                                             ${String(page).length === 1 ? 'w-6 px-2 rounded-md' : 'px-2 rounded-md'}
//                                         `}
//                                     >
//                                         {page}
//                                     </button>
//                                 ))
//                             }

//                             <button
//                                 disabled={currentPage === totalPages}
//                                 onClick={() => changePage(currentPage + 1)}
//                                 className="disabled:opacity-50 hover:text-blue-700 transition-all"
//                             >
//                                 <BsArrowRightSquareFill className='w-6 h-6' />
//                             </button>
//                         </div>
//                     )}
//         </div>
//     );
// };

// export default WarehouseProductsList;



// import { useState } from "react";
// import { BsArrowLeftSquareFill, BsArrowRightSquareFill } from "react-icons/bs";
// import { ImSearch } from "react-icons/im";
// import { useGetWarehouseProductListQuery } from "../../redux/features/wareHouse/warehouseStockApi";
// import SummaryPanel from "../../component/common/SummaryPanel";
// import WarehouseProductCard from "../../component/common/WarehouseProductCard";

// const WarehouseProductsList = () => {
//   // --- API ---
//   const { data, isLoading } = useGetWarehouseProductListQuery();
//   const whProducts = data?.data || [];

//   // --- State ---
//   const [currentPage, setCurrentPage] = useState(1);
//   const [productsPerPage, setProductsPerPage] = useState(5);
//   const [searchTerm, setSearchTerm] = useState("");

//   const [selectedProductId, setSelectedProductId] = useState(null);
//   const [selectedWarehouseReceiveId, setSelectedWarehouseReceiveId] = useState(null);

//   // --- Filter + Sort ---
//   const filteredProducts = whProducts
//     .filter(p => p.productName?.toLowerCase().includes(searchTerm.toLowerCase()))
//     .sort((a, b) => a.productName.localeCompare(b.productName));

//   // --- Pagination ---
//   const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
//   const startIndex = (currentPage - 1) * productsPerPage;
//   const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);
//   const changePage = (page) => setCurrentPage(page);

//   // --- Totals from backend ---
//   const totalUniqueProducts = data?.uniqueProductsCount || 0;
//   const totalTradePrice = data?.totalTradePrice || 0;
//   const totalUnit = filteredProducts.reduce((sum, p) => sum + Number(p.totalQuantity || 0), 0);

//   // --- Single select toggle ---
//   const toggleProduct = (product) => {
//     if (selectedProductId === product._id) {
//       setSelectedProductId(null);
//       setSelectedWarehouseReceiveId(null);
//     } else {
//       setSelectedProductId(product._id);
//       setSelectedWarehouseReceiveId(product.warehouseReceiveId || null);
//     }
//   };

//   // --- Damage submit ---
//   const handleDamageSubmit = ({ warehouseProductId, warehouseReceiveId }) => {
//     console.log("Damage submit:", warehouseProductId, warehouseReceiveId);
//   };

//   // --- Print ---
//   const handlePrint = () => {
//     console.log("Selected product:", selectedProductId);
//     console.log("Warehouse receive:", selectedWarehouseReceiveId);
//   };

//   if (isLoading) return <p className="text-center py-10">Loading...</p>;

//   return (
//     <div className="mx-auto p-2 bg-white">
//       {/* Header */}
//       <div className="bg-white text-gray-500 h-12 flex items-center px-6 justify-between border-b border-gray-200">
//         <h2 className="text-base font-bold">NPL / Admin / Purchase Order</h2>
//         <div className="overflow-hidden w-[80%] h-full relative flex items-center">
//           <div className="absolute whitespace-nowrap animate-slide text-red-600 font-semibold">
//             🚨 নতুন নোটিফিকেশন: প্রোডাক্ট XYZ-এর স্টক সংকটের পর্যায়ে পৌঁছেছে! ⚠️
//           </div>
//         </div>
//       </div>

//       {/* Summary */}
//       <div className="m-6 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-md">
//         <SummaryPanel
//           totals={{
//             totalUniqueProducts,
//             totalUnit,
//             totalTP: totalTradePrice,
//             selectedWarehouseProductId: selectedProductId,
//             warehouseReceiveId: selectedWarehouseReceiveId
//           }}
//           onDamageSubmit={handleDamageSubmit}
//           onPrint={handlePrint}
//         />
//       </div>

//       {/* Controls */}
//       <div className="px-6 pb-6 flex justify-between items-center">
//         <select
//           value={productsPerPage}
//           onChange={(e) => {
//             setProductsPerPage(Number(e.target.value));
//             setCurrentPage(1);
//           }}
//           className="border border-gray-500 rounded p-1"
//         >
//           {[5, 10, 15, 20, 50].map(v => (
//             <option key={v} value={v}>{v}</option>
//           ))}
//         </select>

//         <div className="flex">
//           <div className="border border-gray-500 border-r-0 p-3 rounded-l-full">
//             <ImSearch />
//           </div>
//           <input
//             value={searchTerm}
//             onChange={(e) => {
//               setSearchTerm(e.target.value);
//               setCurrentPage(1);
//             }}
//             placeholder="Search products"
//             className="border border-gray-500 border-l-0 px-3 rounded-r-full"
//           />
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto px-6">
//         <table className="table">
//           <thead>
//             <tr>
//               <th className="text-center">✔</th>
//               <th className="text-center">Sl</th>
//               <th>Name</th>
//               <th>Pack Size</th>
//               <th className="text-center">Batch</th>
//               <th className="text-center">Exp</th>
//               <th className="text-center">Qty</th>
//               <th className="text-right">Price</th>
//               <th className="text-right">Total</th>
//               <th className="text-center">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentProducts.map((product, idx) => (
//               <WarehouseProductCard
//                 key={product._id}
//                 idx={startIndex + idx + 1}
//                 product={product}
//                 checked={selectedProductId === product._id}
//                 onToggle={() => toggleProduct(product)}
//               />
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-center items-center gap-1 mt-4 flex-wrap">
//           <button
//             disabled={currentPage === 1}
//             onClick={() => changePage(currentPage - 1)}
//             className="disabled:opacity-50 hover:text-blue-700 transition-all"
//           >
//             <BsArrowLeftSquareFill className='w-6 h-6' />
//           </button>

//           {Array.from({ length: totalPages }, (_, i) => i + 1)
//             .filter(page => page === 1 || page === totalPages || Math.abs(currentPage - page) <= 1)
//             .reduce((acc, page, index, array) => {
//               if (index > 0 && page - array[index - 1] > 1) acc.push('...');
//               acc.push(page);
//               return acc;
//             }, [])
//             .map((page, index) => (
//               <button
//                 key={index}
//                 disabled={page === '...'}
//                 onClick={() => page !== '...' && changePage(page)}
//                 className={`mx-1 h-6 flex items-center justify-center text-xs font-bold border
//                   ${currentPage === page ? 'bg-[#3B82F6] text-white border-green-900' : 'border-gray-400 hover:bg-blue-100'}
//                   ${page === '...' ? 'cursor-default text-gray-500 border-none' : ''}
//                   ${String(page).length === 1 ? 'w-6 px-2 rounded-md' : 'px-2 rounded-md'}
//                 `}
//               >
//                 {page}
//               </button>
//             ))
//           }

//           <button
//             disabled={currentPage === totalPages}
//             onClick={() => changePage(currentPage + 1)}
//             className="disabled:opacity-50 hover:text-blue-700 transition-all"
//           >
//             <BsArrowRightSquareFill className='w-6 h-6' />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default WarehouseProductsList;



import { useState } from "react";
import { BsArrowLeftSquareFill, BsArrowRightSquareFill } from "react-icons/bs";
import { ImSearch } from "react-icons/im";
import { useGetWarehouseProductListQuery } from "../../redux/features/wareHouse/warehouseStockApi";
import SummaryPanel from "../../component/common/SummaryPanel";
import WarehouseProductCard from "../../component/common/WarehouseProductCard";

const WarehouseProductsList = () => {
  // --- API Data ---
  const { data, isLoading } = useGetWarehouseProductListQuery();
  const whProducts = data?.data || [];

  // --- State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  // --- Single selection state ---
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedWarehouseReceiveId, setSelectedWarehouseReceiveId] = useState(null);

  // --- Filter + Sort ---
  const filteredProducts = whProducts
    .filter((p) => p.productName?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.productName.localeCompare(b.productName));

  // --- Pagination ---
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  const changePage = (page) => setCurrentPage(page);

  // --- Totals from backend ---
  const totalUniqueProducts = data?.uniqueProductsCount ?? filteredProducts.length;
  const totalTradePrice = data?.totalTradePrice ?? 0;
  const totalUnit = filteredProducts.reduce((sum, p) => sum + Number(p.totalQuantity || 0), 0);

  // --- Toggle selection ---
  const toggleProduct = (product) => {
    if (selectedProductId === product._id) {
      setSelectedProductId(null);
      setSelectedWarehouseReceiveId(null);
    } else {
      setSelectedProductId(product._id);
      setSelectedWarehouseReceiveId(product.warehouseReceiveId || null);
    }
  };

  // --- Damage submit handler ---
  const handleDamageSubmit = ({ warehouseProductId, warehouseReceiveId }) => {
    console.log("Damage submit:", warehouseProductId, warehouseReceiveId);
  };

  // --- Print handler ---
  const handlePrint = () => {
    console.log("Selected product:", selectedProductId);
    console.log("Warehouse receive:", selectedWarehouseReceiveId);
  };

  if (isLoading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="mx-auto p-2 bg-white">
      {/* Header */}
      <div className="bg-white text-gray-500 h-12 flex items-center px-6 justify-between border-b border-gray-200">
        <h2 className="text-base font-bold">NPL / Admin / Purchase Order</h2>
        <div className="overflow-hidden w-[80%] h-full relative flex items-center">
          <div className="absolute whitespace-nowrap animate-slide text-red-600 font-semibold">
            🚨 নতুন নোটিফিকেশন: প্রোডাক্ট XYZ-এর স্টক সংকটের পর্যায়ে পৌঁছেছে! ⚠️
          </div>
        </div>
      </div>

      {/* Summary Panel */}
      <div className="m-6 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-md">
        <SummaryPanel
          totals={{
            totalUniqueProducts,
            totalUnit,
            totalTP: totalTradePrice,
            selectedWarehouseProductId: selectedProductId,
            warehouseReceiveId: selectedWarehouseReceiveId
          }}
          onDamageSubmit={handleDamageSubmit}
          onPrint={handlePrint}
        />
      </div>

      {/* Controls */}
      <div className="px-6 pb-6 flex justify-between items-center">
        <select
          value={productsPerPage}
          onChange={(e) => {
            setProductsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="border border-gray-500 rounded p-1"
        >
          {[5, 10, 15, 20, 50].map(v => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>

        <div className="flex">
          <div className="border border-gray-500 border-r-0 p-3 rounded-l-full">
            <ImSearch />
          </div>
          <input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search products"
            className="border border-gray-500 border-l-0 px-3 rounded-r-full"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto px-6">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="text-center">✔</th>
              <th className="text-center">Sl</th>
              <th>Name</th>
              <th>Pack Size</th>
              <th className="text-center">Batch</th>
              <th className="text-center">Exp</th>
              <th className="text-center">Qty</th>
              <th className="text-right">Price</th>
              <th className="text-right">Total</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product, idx) => (
              <WarehouseProductCard
                key={product._id}
                idx={startIndex + idx + 1}
                product={product}
                checked={selectedProductId === product._id}
                onToggle={() => toggleProduct(product)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1 mt-4 flex-wrap">
          <button
            disabled={currentPage === 1}
            onClick={() => changePage(currentPage - 1)}
            className="disabled:opacity-50 hover:text-blue-700 transition-all"
          >
            <BsArrowLeftSquareFill className='w-6 h-6' />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page => page === 1 || page === totalPages || Math.abs(currentPage - page) <= 1)
            .reduce((acc, page, index, array) => {
              if (index > 0 && page - array[index - 1] > 1) acc.push('...');
              acc.push(page);
              return acc;
            }, [])
            .map((page, index) => (
              <button
                key={index}
                disabled={page === '...'}
                onClick={() => page !== '...' && changePage(page)}
                className={`mx-1 h-6 flex items-center justify-center text-xs font-bold border
                  ${currentPage === page ? 'bg-[#3B82F6] text-white border-green-900' : 'border-gray-400 hover:bg-blue-100'}
                  ${page === '...' ? 'cursor-default text-gray-500 border-none' : ''}
                  ${String(page).length === 1 ? 'w-6 px-2 rounded-md' : 'px-2 rounded-md'}
                `}
              >
                {page}
              </button>
            ))
          }

          <button
            disabled={currentPage === totalPages}
            onClick={() => changePage(currentPage + 1)}
            className="disabled:opacity-50 hover:text-blue-700 transition-all"
          >
            <BsArrowRightSquareFill className='w-6 h-6' />
          </button>
        </div>
      )}
    </div>
  );
};

export default WarehouseProductsList;
