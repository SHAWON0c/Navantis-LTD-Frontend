import { useMemo, useState } from "react";
import { Building2, Filter, Phone, Search, Users } from "lucide-react";

const employeeSeed = [
  { id: 1, name: "Imran Hossain", dept: "Sales", role: "MPO", extension: "221", mobile: "01710-456789" },
  { id: 2, name: "Nadia Islam", dept: "HR", role: "HR Officer", extension: "142", mobile: "01855-222333" },
  { id: 3, name: "Rafiq Ahmed", dept: "Warehouse", role: "Warehouse Manager", extension: "305", mobile: "01911-777888" },
  { id: 4, name: "Shawon Das", dept: "Finance", role: "Accounts Executive", extension: "188", mobile: "01677-123456" },
  { id: 5, name: "Mim Akter", dept: "Operations", role: "Dispatcher", extension: "267", mobile: "01533-777123" },
  { id: 6, name: "Tania Rahman", dept: "Sales", role: "Area Manager", extension: "229", mobile: "01799-102938" },
];

const departmentOptions = ["All", "Sales", "HR", "Warehouse", "Finance", "Operations"];

export default function EmployeeNumbersPage() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");

  const filteredEmployees = useMemo(() => {
    const q = search.trim().toLowerCase();

    return employeeSeed.filter((item) => {
      const matchesDepartment = department === "All" || item.dept === department;
      if (!matchesDepartment) return false;

      if (!q) return true;

      return [item.name, item.role, item.mobile, item.extension, item.dept]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [department, search]);

  const groupedByDepartment = useMemo(() => {
    return filteredEmployees.reduce((acc, item) => {
      acc[item.dept] = acc[item.dept] ? [...acc[item.dept], item] : [item];
      return acc;
    }, {});
  }, [filteredEmployees]);

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gray-100 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">Employee Numbers</h1>
          <p className="mt-1 text-sm text-gray-500">Internal directory for extensions and mobile contacts.</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr,220px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 text-gray-400" size={16} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, role, number or department"
                className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm"
              />
            </div>
            <div className="relative">
              <Filter className="pointer-events-none absolute left-3 top-2.5 text-gray-400" size={16} />
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm"
              >
                {departmentOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {Object.keys(groupedByDepartment).length ? (
            Object.entries(groupedByDepartment).map(([deptName, members]) => (
              <section key={deptName} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <Building2 size={18} /> {deptName}
                </h2>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {members.map((employee) => (
                    <article key={employee.id} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                      <p className="text-sm font-semibold text-gray-800">{employee.name}</p>
                      <p className="text-xs text-gray-600">{employee.role}</p>

                      <div className="mt-2 space-y-1 text-xs text-gray-700">
                        <p className="flex items-center gap-1">
                          <Phone size={13} /> Mobile: {employee.mobile}
                        </p>
                        <p className="flex items-center gap-1">
                          <Users size={13} /> Ext: {employee.extension}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
              No employee matched your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
