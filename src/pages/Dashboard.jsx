import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function Dashboard() {
  const [kpi] = useState({
    totalEmployees: 120,
    activeMPOs: 45,
    activeCustomers: 95,
    doctorsReached: 320,
    totalRevenue: 540000,
    pendingOrders: 12,
    employeesOnLeave: 5,
    totalMaintenanceCost: 35000, // NEW
    monthsRevenue: 95000, // NEW
  });

  const [salesData] = useState([
    { month: "Jan", revenue: 80000, prevRevenue: 70000 },
    { month: "Feb", revenue: 90000, prevRevenue: 85000 },
    { month: "Mar", revenue: 95000, prevRevenue: 90000 },
    { month: "Apr", revenue: 87000, prevRevenue: 88000 },
    { month: "May", revenue: 102000, prevRevenue: 95000 },
    { month: "Jun", revenue: 110000, prevRevenue: 100000 },
  ]);

  const [warehouses] = useState([
    { name: "HQ Warehouse", stock: 1200, deliveriesToday: 50 },
    { name: "Depot 1", stock: 400, deliveriesToday: 20 },
    { name: "Depot 2", stock: 320, deliveriesToday: 15 },
  ]);

  const [fieldForce] = useState([
    { name: "Abdul Karim", visits: 150, revenue: 9500, performance: 95 },
    { name: "Salma Akter", visits: 120, revenue: 8000, performance: 80 },
    { name: "Rafiq Hossain", visits: 90, revenue: 6000, performance: 60 },
  ]);

  const [doctorsPerformance] = useState([
    { name: "Dr. Karim", specialty: "Cardiology", revenue: 5000 },
    { name: "Dr. Salma", specialty: "Neurology", revenue: 4200 },
    { name: "Dr. Rafiq", specialty: "General", revenue: 3800 },
    { name: "Dr. Anika", specialty: "Pediatrics", revenue: 4500 },
  ]);

  const [topCustomers] = useState([
    { name: "Hospital ABC", revenue: 25000 },
    { name: "Clinic XYZ", revenue: 18000 },
    { name: "Pharmacy 123", revenue: 15000 },
  ]);

  const [products] = useState([
    { name: "Paracetamol", brand: "Pfizer", stock: 500, expiry: "2026-12-31", sales: 300 },
    { name: "Aspirin", brand: "Bayer", stock: 320, expiry: "2026-06-30", sales: 150 },
    { name: "Ibuprofen", brand: "GSK", stock: 200, expiry: "2025-12-31", sales: 100 },
  ]);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 p-4 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
        Managing Director Dashboard
      </h2>

      {/* === KPI CARDS === */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.entries(kpi).map(([key, value], i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded shadow text-center">
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              {key.replace(/([A-Z])/g, ' $1')}
            </div>
            <div className="text-xl font-bold mt-1">
              {typeof value === "number" && value > 999 ? `$${value.toLocaleString()}` : value}
            </div>
          </div>
        ))}
      </div>

      {/* === SALES TREND === */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">
          Monthly Sales vs Previous
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={salesData}>
            <XAxis dataKey="month" stroke="#8884d8" />
            <YAxis stroke="#8884d8" />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} name="Current" />
            <Line type="monotone" dataKey="prevRevenue" stroke="#10b981" strokeWidth={2} name="Previous" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* === WAREHOUSE MINI CARDS === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {warehouses.map((w, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-3 rounded shadow text-sm">
            <div className="font-semibold text-gray-700 dark:text-gray-200">{w.name}</div>
            <div className="flex justify-between mt-1"><span>Stock:</span><span>{w.stock}</span></div>
            <div className="flex justify-between"><span>Today:</span><span>{w.deliveriesToday}</span></div>
          </div>
        ))}
      </div>

      {/* === FIELD FORCE PERFORMANCE === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {fieldForce.map((f, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-3 rounded shadow text-sm">
            <div className="font-semibold text-gray-700 dark:text-gray-200">{f.name}</div>
            <div className="flex justify-between mt-1"><span>Visits:</span><span>{f.visits}</span></div>
            <div className="flex justify-between"><span>Revenue:</span><span>${f.revenue}</span></div>
            <div className="flex justify-between">
              <span>Performance:</span>
              <span className={`font-bold ${f.performance>80?'text-green-500':f.performance>60?'text-yellow-500':'text-red-500'}`}>
                {f.performance}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* === DOCTORS PERFORMANCE TABLE === */}
      <div className="bg-white dark:bg-gray-800 p-3 rounded shadow overflow-auto text-sm">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Doctors Performance</h3>
        <table className="w-full text-left">
          <thead className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-2 py-1">Name</th>
              <th className="px-2 py-1">Specialty</th>
              <th className="px-2 py-1">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {doctorsPerformance.map((d,i)=>(
              <tr key={i} className="border-b border-gray-200 dark:border-gray-700">
                <td className="px-2 py-1">{d.name}</td>
                <td className="px-2 py-1">{d.specialty}</td>
                <td className="px-2 py-1">${d.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* === PRODUCTS STOCK TABLE === */}
      <div className="bg-white dark:bg-gray-800 p-3 rounded shadow overflow-auto text-sm">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Products Stock</h3>
        <table className="w-full text-left">
          <thead className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-2 py-1">Product</th>
              <th className="px-2 py-1">Brand</th>
              <th className="px-2 py-1">Stock</th>
              <th className="px-2 py-1">Expiry</th>
              <th className="px-2 py-1">Sales</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p,i)=>(
              <tr key={i} className="border-b border-gray-200 dark:border-gray-700">
                <td className="px-2 py-1">{p.name}</td>
                <td className="px-2 py-1">{p.brand}</td>
                <td className="px-2 py-1">{p.stock}</td>
                <td className="px-2 py-1">{p.expiry}</td>
                <td className="px-2 py-1">{p.sales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
