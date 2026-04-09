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
  striped = true,
  hover = true,
  loading = false,
  emptyMessage = 'No data available',
  size = 'md',
  ...props
}) => {
  const handleSort = (column) => {
    if (!sortable || !onSort) return;
    const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(column, direction);
  };

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const tableClasses = `w-full text-left border-collapse ${sizeClasses[size]} ${className}`;

  const headerClasses = 'px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50 border-b-2 border-gray-200';

  const cellClasses = 'px-4 py-3 text-gray-900 border-b border-gray-200';

  const rowClasses = `${striped ? 'even:bg-gray-50' : ''} ${hover ? 'hover:bg-blue-50 transition-colors duration-150' : ''}`;

  if (loading) {
    return (
      <div className="overflow-x-auto">
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
      <div className="overflow-x-auto">
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
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className={tableClasses} {...props}>
        <thead>
          <tr className="bg-gray-50">
            {columns.map((column, index) => (
              <th
                key={index}
                className={`${headerClasses} ${
                  column.sortable ? 'cursor-pointer select-none hover:bg-gray-100' : ''
                } ${column.width ? `w-${column.width}` : ''}`}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center justify-between">
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
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={`${cellClasses} ${
                    column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'
                  } ${column.className || ''}`}
                >
                  {column.render ? column.render(row[column.key], row, rowIndex) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;