import React from 'react';
import { MdArrowUpward, MdArrowDownward } from 'react-icons/md';

const Table = ({
  columns,
  data,
  sortable = false,
  onSort,
  sortColumn,
  sortDirection,
  className = '',
  striped = true,
  hover = true,
  ...props
}) => {
  const handleSort = (column) => {
    if (!sortable || !onSort) return;
    const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(column, direction);
  };

  const tableClasses = `w-full text-sm text-left border-collapse ${className}`;

  const headerClasses = 'px-4 py-3 text-xs font-medium text-neutral-700 uppercase tracking-wider bg-neutral-50 border-b border-neutral-200';

  const cellClasses = 'px-4 py-3 text-neutral-900 border-b border-neutral-200';

  const rowClasses = `${striped ? 'even:bg-neutral-50' : ''} ${hover ? 'hover:bg-neutral-100' : ''}`;

  return (
    <div className="overflow-x-auto">
      <table className={tableClasses} {...props}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={`${headerClasses} ${column.sortable ? 'cursor-pointer select-none' : ''}`}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center">
                  {column.label}
                  {column.sortable && sortColumn === column.key && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? <MdArrowUpward className="w-4 h-4" /> : <MdArrowDownward className="w-4 h-4" />}
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
                <td key={colIndex} className={cellClasses}>
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
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