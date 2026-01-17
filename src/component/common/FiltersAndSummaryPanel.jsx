import { MdPrint } from "react-icons/md";

const FiltersAndSummaryPanel = ({
  id,
  filters,
  setFilters,
  totals,
  onClear,
  onPrint
}) => {
  const {
    searchTerm,
    year,
    month,
    fromDate,
    toDate
  } = filters;

  return (
    <div
      id={id}
      className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-4"
    >
      {/* ================= FILTERS ================= */}
      <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-sm">
        <h3 className="font-bold mb-4">Filters</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <input
            placeholder="Search"
            value={searchTerm}
            onChange={(e) =>
              setFilters({ ...filters, searchTerm: e.target.value })
            }
            className="border rounded px-3 py-2"
          />

          <select
            value={year}
            onChange={(e) =>
              setFilters({ ...filters, year: e.target.value })
            }
            className="border rounded px-3 py-2"
          >
            <option value="">All Years</option>
            {Array.from({ length: 5 }, (_, i) =>
              new Date().getFullYear() - i
            ).map(y => (
              <option key={y}>{y}</option>
            ))}
          </select>

          <select
            value={month}
            onChange={(e) =>
              setFilters({ ...filters, month: e.target.value })
            }
            className="border rounded px-3 py-2"
          >
            <option value="">All Months</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={fromDate}
            onChange={(e) =>
              setFilters({ ...filters, fromDate: e.target.value })
            }
            className="border rounded px-3 py-2"
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) =>
              setFilters({ ...filters, toDate: e.target.value })
            }
            className="border rounded px-3 py-2"
          />

          <button
            onClick={() => {
              const t = new Date().toISOString().split("T")[0];
              setFilters({ ...filters, fromDate: t, toDate: t });
            }}
            className="border rounded px-3 py-2"
          >
            Today
          </button>

          <button
            onClick={onClear}
            className="md:col-span-3 bg-[#0F213D] text-white py-2 rounded"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* ================= SUMMARY ================= */}
       <div className="lg:col-span-2 bg-blue-100 p-4 rounded-lg shadow-sm">
      <h3 className="font-bold text-center mb-4">Summary</h3>

      <div className="flex justify-between mb-4">
        <div className="text-center">
          <p>Total Products</p>
          <p className="font-bold text-green-600">{totals.totalUniqueProducts}</p>
        </div>
        <div className="text-center">
          <p>Total Units</p>
          <p className="font-bold text-blue-600">{totals.totalUnit.toLocaleString("en-IN")}</p>
        </div>
      </div>

      <div className="overflow-x-auto mb-4">
        <table className="table-auto w-full text-left border border-gray-200">
          <thead>
            <tr className="bg-blue-200">
              <th className="px-4 py-2 border">Price Type</th>
              <th className="px-4 py-2 border text-right">Total Price (৳)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 border">Trade Price (TP)</td>
              <td className="px-4 py-2 border text-right">
                {totals.totalTP?.toLocaleString("en-IN")}/-
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <button
        onClick={onPrint}
        className="w-full bg-[#0F213D] text-white py-2 rounded flex items-center justify-center"
      >
        <MdPrint className="mr-2" /> Print
      </button>
    </div>
    </div>
  );
};

export default FiltersAndSummaryPanel;
