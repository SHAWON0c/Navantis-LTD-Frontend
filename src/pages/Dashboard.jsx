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
import Card from "../component/common/Card";
import Table from "../component/common/Table";
import Button from "../component/common/Button";
import { MdTrendingUp, MdPeople, MdShoppingCart, MdLocalShipping } from "react-icons/md";

export default function Dashboard() {
  const [kpi] = useState({
    totalEmployees: 120,
    activeMPOs: 45,
    activeCustomers: 95,
    doctorsReached: 320,
    totalRevenue: 540000,
    pendingOrders: 12,
    employeesOnLeave: 5,
    totalMaintenanceCost: 35000,
    monthsRevenue: 95000,
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

  const doctorsColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'specialty', label: 'Specialty', sortable: true },
    { key: 'revenue', label: 'Revenue ($)', sortable: true, render: (value) => `$${value.toLocaleString()}` },
  ];

  const productColumns = [
    { key: 'name', label: 'Product', sortable: true },
    { key: 'brand', label: 'Brand', sortable: true },
    { key: 'stock', label: 'Stock', sortable: true },
    { key: 'expiry', label: 'Expiry', sortable: true },
    { key: 'sales', label: 'Sales', sortable: true },
  ];

  return (
    <div className="bg-neutral-50 dark:bg-neutral-900 min-h-screen p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          Managing Director Dashboard
        </h1>
        <Button variant="primary" icon={MdTrendingUp}>
          View Reports
        </Button>
      </div>

      {/* === KPI CARDS === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(kpi).map(([key, value], i) => (
          <Card key={i} className="text-center">
            <div className="text-neutral-600 dark:text-neutral-400 text-sm uppercase tracking-wide">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </div>
            <div className="text-2xl font-bold text-primary-600 mt-2">
              {typeof value === "number" && value > 999 ? `$${value.toLocaleString()}` : value}
            </div>
          </Card>
        ))}
      </div>

      {/* === SALES TREND === */}
      <Card title="Monthly Sales Trend" className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={salesData}>
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={3} name="Current Year" />
            <Line type="monotone" dataKey="prevRevenue" stroke="#0ea5e9" strokeWidth={2} name="Previous Year" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* === WAREHOUSE OVERVIEW === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {warehouses.map((w, i) => (
          <Card key={i} title={w.name} className="text-center">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Total Stock</span>
                <span className="font-semibold text-primary-600">{w.stock.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Deliveries Today</span>
                <span className="font-semibold text-secondary-600">{w.deliveriesToday}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* === FIELD FORCE PERFORMANCE === */}
      <Card title="Field Force Performance" subtitle="Top performers this month">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {fieldForce.map((f, i) => (
            <div key={i} className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg">
              <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">{f.name}</h4>
              <div className="space-y-1 mt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Visits</span>
                  <span className="font-medium">{f.visits}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Revenue</span>
                  <span className="font-medium">${f.revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Performance</span>
                  <span className={`font-bold ${
                    f.performance > 80 ? 'text-success' :
                    f.performance > 60 ? 'text-warning' : 'text-error'
                  }`}>
                    {f.performance}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* === DOCTORS PERFORMANCE TABLE === */}
      <Card title="Doctors Performance" subtitle="Revenue by specialty">
        <Table
          columns={doctorsColumns}
          data={doctorsPerformance}
          sortable
        />
      </Card>

      {/* === PRODUCTS STOCK TABLE === */}
      <Card title="Product Inventory" subtitle="Current stock levels and sales">
        <Table
          columns={productColumns}
          data={products}
          sortable
        />
      </Card>
    </div>
  );
}
