import { useState } from "react";
import { BsArrowLeftSquareFill, BsArrowRightSquareFill } from "react-icons/bs";
import { ImSearch } from 'react-icons/im';
import { useGetWarehouseProductListQuery } from "../../redux/features/wareHouse/warehouseStockApi";
import SummaryPanel from "../../component/common/SummaryPanel";
import WarehouseProductCard from "../../component/common/WarehouseProductCard";

const WarehouseProductsList = () => {
    // --- API Data ---
    const { data, isLoading, isError } = useGetWarehouseProductListQuery();
    const whProducts = data?.data || [];

    // --- Pagination & Filters ---
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');

    // --- Filtering & Sorting ---
    const filteredProducts = whProducts
        .filter(product =>
            product.productName?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => a.productName.localeCompare(b.productName));

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = Math.min(startIndex + productsPerPage, filteredProducts.length);
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    // --- Totals for Summary ---
    const totalUnit = filteredProducts.reduce((sum, p) => sum + Number(p.totalQuantity), 0);
    const totalTradePrice = filteredProducts.reduce((sum, p) => sum + (p.tradePrice || 0) * p.totalQuantity, 0);

    // --- Pagination Handlers ---
    const changePage = (page) => setCurrentPage(page);
    const handleProductsPerPageChange = (e) => {
        setProductsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    // --- Print Handler ---
    const handlePrint = () => {
        CurrentWarehouseStockInvoice({
            invoiceWithAP: 0,
            totalUnit,
            totalActualPrice: 0,
            totalTradePrice,
            filteredProducts
        });
    };

    return (
        <>
            <div className="bg-white pb-1">
                <div>
                    <h1 className="px-6 py-3 font-bold">Warehouse products list</h1>
                    <hr className='text-center border border-gray-500 mb-5' />
                </div>

                {/* Summary */}
                <div className="m-6 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-md">
                    <p className="text-md text-gray-700 text-center mb-4 font-medium">Warehouse Summary</p>

                    <SummaryPanel
                        totals={{
                            totalUniqueProducts: filteredProducts.length,
                            totalUnit,
                            totalTP: totalTradePrice
                        }}
                        onPrint={handlePrint}
                    />
                </div>

                {/* Controls */}
                <div className="px-6 pb-6">
                    <div className="mb-5 flex flex-col-reverse md:flex-row justify-center md:justify-between items-center">
                        <div className="mt-5 md:mt-0">
                            <label htmlFor="productsPerPage">Show</label>
                            <select
                                id="productsPerPage"
                                value={productsPerPage}
                                onChange={handleProductsPerPageChange}
                                className="border border-gray-500 rounded p-1 pointer-cursor mx-2"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                            <label htmlFor="productsPerPage">products per page</label>
                        </div>

                        {/* Search Input */}
                        <div className="flex justify-center rounded-l-lg group">
                            <div className='flex justify-center items-center border border-gray-500 border-r-0 p-3 rounded-l-full text-black font-extrabold'>
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

                    {/* Product Table */}
                    <div className="overflow-x-auto mb-3">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th className="text-center">Sl. No.</th>
                                    <th>Name</th>
                                    <th>Pack Size</th>
                                    <th className='text-center'>Batch</th>
                                    <th className='text-center'>Exp.</th>
                                    <th className='text-center'>Quantity</th>
                                    <th className='text-right'>Price/Unit</th>
                                    <th className='text-right'>Total Price</th>
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentProducts.map((product, idx) => (
                                    <WarehouseProductCard
                                        idx={startIndex + idx + 1}
                                        key={product._id}
                                        product={product}
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
                                .filter(page =>
                                    page === 1 ||
                                    page === totalPages ||
                                    Math.abs(currentPage - page) <= 1
                                )
                                .reduce((acc, page, index, array) => {
                                    if (index > 0 && page - array[index - 1] > 1) {
                                        acc.push('...');
                                    }
                                    acc.push(page);
                                    return acc;
                                }, [])
                                .map((page, index) => (
                                    <button
                                        key={index}
                                        disabled={page === '...'}
                                        onClick={() => page !== '...' && changePage(page)}
                                        className={`
                                            mx-1 h-6 flex items-center justify-center text-xs font-bold border
                                            ${currentPage === page
                                                ? 'bg-[#3B82F6] text-white border-green-900'
                                                : 'border-gray-400 hover:bg-blue-100'}
                                            ${page === '...'
                                                ? 'cursor-default text-gray-500 border-none'
                                                : ''
                                            }
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
            </div>
        </>
    );
};

export default WarehouseProductsList;
