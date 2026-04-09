import { useState, useRef } from "react";
import { MdDownload, MdPrint, MdFileDownload } from "react-icons/md";
import Card from "../../component/common/Card";
import Table from "../../component/common/Table";
import Button from "../../component/common/Button";
import FormInput from "../../component/common/FormInput";
import FormSelect from "../../component/common/FormSelect";
import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";

export default function NetSales() {
  // Filter States
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    month: "",
    area: "",
    zone: "",
    territory: "",
    areaManager: "",
    zoneManager: "",
  });

  const [groupBy, setGroupBy] = useState("all"); // all, zone, area, zonalManager, manager, orderCreator
  const reportRef = useRef(null);

  // Summary Data
  const [summary] = useState({
    totalSales: 245000,
    totalReturn: 12500,
    totalMPOs: 145,
    marketPointsOrderValue: 89500,
  });

  // Sample Sales Data - in real app, this would come from API
  const [salesData] = useState([
    {
      id: 1,
      date: "2026-04-01",
      mpo: "MPO-001",
      area: "Area A",
      zone: "Zone 1",
      territory: "Territory 1",
      areaManager: "Ahmed Khan",
      zoneManager: "Fatima Ali",
      orderCreator: "Salma Akter",
      totalSales: 15000,
      returns: 500,
      count: 5,
    },
    {
      id: 2,
      date: "2026-04-02",
      mpo: "MPO-002",
      area: "Area A",
      zone: "Zone 1",
      territory: "Territory 2",
      areaManager: "Ahmed Khan",
      zoneManager: "Fatima Ali",
      orderCreator: "Rafiq Hasan",
      totalSales: 12500,
      returns: 300,
      count: 4,
    },
    {
      id: 3,
      date: "2026-04-03",
      mpo: "MPO-003",
      area: "Area B",
      zone: "Zone 2",
      territory: "Territory 3",
      areaManager: "Karim Uddin",
      zoneManager: "Aisha Begum",
      orderCreator: "Hassan Ali",
      totalSales: 18000,
      returns: 800,
      count: 6,
    },
    {
      id: 4,
      date: "2026-04-04",
      mpo: "MPO-004",
      area: "Area B",
      zone: "Zone 2",
      territory: "Territory 4",
      areaManager: "Karim Uddin",
      zoneManager: "Aisha Begum",
      orderCreator: "Nasrin Jahan",
      totalSales: 19500,
      returns: 650,
      count: 7,
    },
    {
      id: 5,
      date: "2026-04-05",
      mpo: "MPO-005",
      area: "Area C",
      zone: "Zone 3",
      territory: "Territory 5",
      areaManager: "Rashid Ahmed",
      zoneManager: "Nadia Khan",
      orderCreator: "Tariq Hassan",
      totalSales: 22000,
      returns: 950,
      count: 8,
    },
  ]);

  // Filter Options - in real app, these would come from API
  const monthOptions = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const areaOptions = [
    { value: "area-a", label: "Area A" },
    { value: "area-b", label: "Area B" },
    { value: "area-c", label: "Area C" },
  ];

  const zoneOptions = [
    { value: "zone-1", label: "Zone 1" },
    { value: "zone-2", label: "Zone 2" },
    { value: "zone-3", label: "Zone 3" },
  ];

  const territoryOptions = [
    { value: "terr-1", label: "Territory 1" },
    { value: "terr-2", label: "Territory 2" },
    { value: "terr-3", label: "Territory 3" },
    { value: "terr-4", label: "Territory 4" },
    { value: "terr-5", label: "Territory 5" },
  ];

  const mpoOptions = [
    { value: "mpo-001", label: "MPO-001" },
    { value: "mpo-002", label: "MPO-002" },
    { value: "mpo-003", label: "MPO-003" },
    { value: "mpo-004", label: "MPO-004" },
    { value: "mpo-005", label: "MPO-005" },
  ];

  const managerOptions = [
    { value: "ahmed-khan", label: "Ahmed Khan" },
    { value: "karim-uddin", label: "Karim Uddin" },
    { value: "rashid-ahmed", label: "Rashid Ahmed" },
  ];

  const zoneManagerOptions = [
    { value: "fatima-ali", label: "Fatima Ali" },
    { value: "aisha-begum", label: "Aisha Begum" },
    { value: "nadia-khan", label: "Nadia Khan" },
  ];

  // Handle Filter Changes
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Apply Filters
  const getFilteredData = () => {
    return salesData.filter((item) => {
      if (filters.startDate && item.date < filters.startDate) return false;
      if (filters.endDate && item.date > filters.endDate) return false;
      if (filters.month && !item.date.includes(`-${filters.month}`)) return false;
      if (filters.area && item.area.toLowerCase() !== filters.area.split("-")[1]) return false;
      if (filters.zone && item.zone.toLowerCase() !== filters.zone.split("-")[1]) return false;
      return true;
    });
  };

  const filteredData = getFilteredData();

  // Group Data
  const groupData = (data) => {
    if (groupBy === "all") return [{ title: "All Sales", items: data }];

    const grouped = {};
    const groupKey = {
      zone: "zone",
      area: "area",
      zonalManager: "zoneManager",
      manager: "areaManager",
      orderCreator: "orderCreator",
    }[groupBy];

    data.forEach((item) => {
      const key = item[groupKey];
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });

    return Object.entries(grouped).map(([title, items]) => ({
      title: `${title} (${items.length} records)`,
      items,
    }));
  };

  const groupedData = groupData(filteredData);

  // Table Columns
  const tableColumns = [
    { key: "id", label: "SL", sortable: true, render: (value) => value },
    { key: "date", label: "Date", sortable: true },
    { key: "mpo", label: "MPO", sortable: true },
    { key: "area", label: "Area", sortable: true },
    { key: "zone", label: "Zone", sortable: true },
    { key: "territory", label: "Territory", sortable: true },
    { key: "areaManager", label: "Area Manager", sortable: true },
    { key: "zoneManager", label: "Zone Manager", sortable: true },
    { key: "orderCreator", label: "Order Creator", sortable: true },
    { key: "totalSales", label: "Total Sales", sortable: true, render: (value) => `৳${value.toLocaleString()}` },
    { key: "returns", label: "Returns", sortable: true, render: (value) => `৳${value.toLocaleString()}` },
    { key: "count", label: "Count", sortable: true },
  ];

  // Export to PDF
  const exportToPDF = () => {
    const element = document.createElement("div");
    element.innerHTML = `
      <div style="padding: 20px; font-family: Arial;">
        <h1 style="text-align: center; margin-bottom: 20px;">Net Sales Report</h1>
        <div style="margin-bottom: 20px;">
          <p><strong>Total Sales:</strong> ৳${summary.totalSales.toLocaleString()}</p>
          <p><strong>Total Returns:</strong> ৳${summary.totalReturn.toLocaleString()}</p>
          <p><strong>Total MPOs:</strong> ${summary.totalMPOs}</p>
          <p><strong>Market Points Order Value:</strong> ৳${summary.marketPointsOrderValue.toLocaleString()}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
          <thead>
            <tr style="background-color: #f0f0f0;">
              <th style="border: 1px solid #ddd; padding: 8px;">SL</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Date</th>
              <th style="border: 1px solid #ddd; padding: 8px;">MPO</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Area</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Zone</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Territory</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Area Mgr</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Zone Mgr</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Creator</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Sales</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Return</th>
              <th style="border: 1px solid #ddd; padding: 8px;">MPO</th>
            </tr>
          </thead>
          <tbody>
            ${filteredData.map((item, idx) => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${idx + 1}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.date}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.mpo}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.area}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.zone}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.territory}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.areaManager}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.zoneManager}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.orderCreator}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">৳${item.totalSales.toLocaleString()}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">৳${item.returns.toLocaleString()}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.count}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    const opt = {
      margin: 10,
      filename: "net-sales-report.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: "landscape", unit: "mm", format: "a4" },
    };

    html2pdf().set(opt).from(element).save();
  };

  // Export to Excel
  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((item, index) => ({
        SL: index + 1,
        Date: item.date,
        "MPO": item.mpo,
        Area: item.area,
        Zone: item.zone,
        Territory: item.territory,
        "Area Manager": item.areaManager,
        "Zone Manager": item.zoneManager,
        "Order Creator": item.orderCreator,
        "Total Sales": item.totalSales,
        Returns: item.returns,
        "Count": item.count,
      }))
    );

    XLSX.utils.book_append_sheet(workbook, worksheet, "Net Sales");
    XLSX.writeFile(workbook, "net-sales-report.xlsx");
  };

  // Print Report
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-neutral-50 dark:bg-neutral-900 min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          Net Sales Report
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="small"
            icon={MdPrint}
            onClick={handlePrint}
          >
            Print
          </Button>
          <Button
            variant="outline"
            size="small"
            icon={MdDownload}
            onClick={exportToPDF}
          >
            PDF
          </Button>
          <Button
            variant="outline"
            size="small"
            icon={MdFileDownload}
            onClick={exportToExcel}
          >
            Excel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          Filters
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <FormInput
            label="Start Date"
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange("startDate", e.target.value)}
          />
          <FormInput
            label="End Date"
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange("endDate", e.target.value)}
          />
          <FormSelect
            label="Month"
            value={filters.month}
            options={monthOptions}
            onChange={(e) => handleFilterChange("month", e.target.value)}
            placeholder="Select Month"
          />
          <FormSelect
            label="Area"
            value={filters.area}
            options={areaOptions}
            onChange={(e) => handleFilterChange("area", e.target.value)}
            placeholder="Select Area"
          />
          <FormSelect
            label="Zone"
            value={filters.zone}
            options={zoneOptions}
            onChange={(e) => handleFilterChange("zone", e.target.value)}
            placeholder="Select Zone"
          />
          <FormSelect
            label="Territory"
            value={filters.territory}
            options={territoryOptions}
            onChange={(e) => handleFilterChange("territory", e.target.value)}
            placeholder="Select Territory"
          />
          <FormSelect
            label="MPO"
            value={filters.mpo}
            options={mpoOptions}
            onChange={(e) => handleFilterChange("mpo", e.target.value)}
            placeholder="Select MPO"
          />
          <FormSelect
            label="Area Manager"
            value={filters.areaManager}
            options={managerOptions}
            onChange={(e) => handleFilterChange("areaManager", e.target.value)}
            placeholder="Select Area Manager"
          />
          <FormSelect
            label="Zone Manager"
            value={filters.zoneManager}
            options={zoneManagerOptions}
            onChange={(e) => handleFilterChange("zoneManager", e.target.value)}
            placeholder="Select Zone Manager"
          />
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center">
          <h3 className="text-neutral-600 dark:text-neutral-400 text-sm uppercase tracking-wide mb-2">
            Total Sales
          </h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            ৳{summary.totalSales.toLocaleString()}
          </p>
        </Card>
        <Card className="text-center">
          <h3 className="text-neutral-600 dark:text-neutral-400 text-sm uppercase tracking-wide mb-2">
            Total Returns
          </h3>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            ৳{summary.totalReturn.toLocaleString()}
          </p>
        </Card>
        <Card className="text-center">
          <h3 className="text-neutral-600 dark:text-neutral-400 text-sm uppercase tracking-wide mb-2">
            Total MPOs
          </h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {summary.totalMPOs}
          </p>
        </Card>
        <Card className="text-center">
          <h3 className="text-neutral-600 dark:text-neutral-400 text-sm uppercase tracking-wide mb-2">
            Market Points Order Value
          </h3>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            ৳{summary.marketPointsOrderValue.toLocaleString()}
          </p>
        </Card>
      </div>

      {/* Group By Buttons */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          View By
        </h2>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={groupBy === "all" ? "primary" : "outline"}
            size="small"
            onClick={() => setGroupBy("all")}
          >
            All Sales
          </Button>
          <Button
            variant={groupBy === "zone" ? "primary" : "outline"}
            size="small"
            onClick={() => setGroupBy("zone")}
          >
            By Zone
          </Button>
          <Button
            variant={groupBy === "area" ? "primary" : "outline"}
            size="small"
            onClick={() => setGroupBy("area")}
          >
            By Area
          </Button>
          <Button
            variant={groupBy === "zonalManager" ? "primary" : "outline"}
            size="small"
            onClick={() => setGroupBy("zonalManager")}
          >
            By Zone Manager
          </Button>
          <Button
            variant={groupBy === "manager" ? "primary" : "outline"}
            size="small"
            onClick={() => setGroupBy("manager")}
          >
            By Area Manager
          </Button>
          <Button
            variant={groupBy === "orderCreator" ? "primary" : "outline"}
            size="small"
            onClick={() => setGroupBy("orderCreator")}
          >
            By Order Creator
          </Button>
        </div>
      </Card>

      {/* Data Tables */}
      <div className="space-y-6">
        {groupedData.map((group, index) => (
          <Card key={index} className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              {group.title}
            </h3>
            <Table
              columns={tableColumns}
              data={group.items}
              striped
              hover
              emptyMessage="No sales data available"
            />
          </Card>
        ))}
      </div>
    </div>
  );
}
