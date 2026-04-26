import React from 'react';
import { MdArrowUpward, MdArrowDownward } from 'react-icons/md';

const Table = ({
  columns = [],
  data = [],
  sortable = false,
  onSort,
  sortColumn,
  sortDirection,
  className = '',
  wrapperClassName = '',
  stickyHeader = false,
  striped = true,
  hover = true,
  loading = false,
  emptyMessage = 'No data available',
  size = 'sm',
  ...props
}) => {
  const handleSort = (column) => {
    if (!sortable || !onSort) return;
    const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(column, direction);
  };

  const sizeClasses = {
    sm: {
      table: 'text-xs',
      header: 'px-2 py-1.5 text-[11px]',
      cell: 'px-2 py-1.5',
    },
    md: {
      table: 'text-sm',
      header: 'px-4 py-3 text-xs',
      cell: 'px-4 py-3',
    },
    lg: {
      table: 'text-base',
      header: 'px-5 py-4 text-sm',
      cell: 'px-5 py-4',
    },
  };

  const selectedSize = sizeClasses[size] || sizeClasses.sm;

  const tableClasses = `min-w-full w-full text-left border-collapse table-auto ${selectedSize.table} ${className}`;

  const headerClasses = `${selectedSize.header} font-semibold text-gray-700 uppercase tracking-wider bg-gray-50 border-b-2 border-gray-200 whitespace-nowrap align-middle ${stickyHeader ? 'sticky top-0 z-20' : ''}`;

  const cellClasses = `${selectedSize.cell} text-gray-900 border-b border-gray-200 whitespace-nowrap overflow-hidden text-ellipsis align-middle tabular-nums`;

  const rowClasses = `${striped ? 'even:bg-gray-50' : ''} ${hover ? 'hover:bg-blue-50 transition-colors duration-150' : ''}`;

  if (loading) {
    return (
      <div className={`overflow-x-auto ${wrapperClassName}`}>
        <table className={tableClasses} {...props}>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index} className={headerClasses}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-r-transparent"></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={`overflow-x-auto ${wrapperClassName}`}>
        <table className={tableClasses} {...props}>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index} className={headerClasses}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto rounded-lg border border-gray-200 ${wrapperClassName}`}>
      <table className={tableClasses} {...props}>
        <thead>
          <tr className="bg-gray-50">
              {columns.map((column, index) => (
              <th
                key={index}
                  className={`${headerClasses} ${column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'} ${column.className || ''} ${
                  column.sortable ? 'cursor-pointer select-none hover:bg-gray-100' : ''
                }`}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className={`flex items-center ${column.align === 'right' ? 'justify-end' : column.align === 'center' ? 'justify-center' : 'justify-between'}`}>
                  <span>{column.label}</span>
                  {column.sortable && (
                    <span className="ml-2 opacity-50">
                      {sortColumn === column.key ? (
                        sortDirection === 'asc' ? (
                          <MdArrowUpward className="w-4 h-4 text-blue-600" />
                        ) : (
                          <MdArrowDownward className="w-4 h-4 text-blue-600" />
                        )
                      ) : (
                        <div className="w-4 h-4 opacity-30">⟷</div>
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowClasses}>
              {columns.map((column, colIndex) => {
                const rawValue = row[column.key];
                const renderedValue = column.render ? column.render(rawValue, row, rowIndex) : rawValue;
                const textValue = typeof renderedValue === 'string' ? renderedValue : typeof rawValue === 'string' ? rawValue : '';
                const currencyKeyPattern = /(price|amount|netsales|sold|discount|refund|credit|tp|grandtotal|unitprice|totalprice|tradeprice)/i;
                const isCurrencyCell = textValue.includes('৳') || currencyKeyPattern.test(String(column.key || ''));

                return (
                  <td
                    key={colIndex}
                    className={`${cellClasses} ${
                      column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'
                    } ${isCurrencyCell ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''} ${column.className || ''}`}
                  >
                    {renderedValue}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;