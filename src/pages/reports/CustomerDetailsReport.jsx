import { useState } from "react";
import { useGetCustomerDetailsReportQuery } from "../../redux/features/reports/reportsAPI";
import Card from "../../component/common/Card";
import Button from "../../component/common/Button";
import FormSelect from "../../component/common/FormSelect";
import { MdArrowBack, MdExpandMore, MdExpandLess } from "react-icons/md";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import html2pdf from "html2pdf.js";
import { ChevronRight } from "lucide-react";

export default function CustomerDetailsReport() {
  const [payMode, setPayMode] = useState("");
  const [expandedTerritories, setExpandedTerritories] = useState({});

  const { data: reportData, isLoading, isError, error } = useGetCustomerDetailsReportQuery({
    payMode: payMode || undefined,
    status: "active",
  });

  const payModeOptions = [
    { label: "All Pay Modes", value: "" },
    { label: "Cash", value: "cash" },
    { label: "Credit", value: "credit" },
    { label: "STC", value: "stc" },
    { label: "SPIC", value: "spic" },
  ];

  const toggleTerritory = (territoryName) => {
    setExpandedTerritories((prev) => ({
      ...prev,
      [territoryName]: !prev[territoryName],
    }));
  };

  const buildPrintHtml = () => {
    if (!reportData?.data) return "";

    const todayText = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    let bodyHtml = "";
    let globalSerialNumber = 1;
    let grandTotalCredit = 0;

    reportData.data.forEach((territory) => {
      grandTotalCredit += territory.totalCreditLimit;

      let territoryRows = "";
      territory.customers.forEach((customer) => {
        territoryRows += `
          <tr>
            <td style="text-align:center">${globalSerialNumber}</td>
            <td>${customer.customerId}</td>
            <td>${customer.customerName}</td>
            <td>${customer.address}</td>
            <td>${customer.phone}</td>
            <td>${customer.payMode.join(", ")}</td>
            <td style="text-align:right">৳${customer.creditLimit.toLocaleString()}</td>
            <td style="text-align:right">৳${customer.dayLimit.toLocaleString()}</td>
          </tr>
        `;
        globalSerialNumber++;
      });

      const territoryTotalCredit = territory.customers.reduce((sum, customer) => sum + customer.creditLimit, 0);

      bodyHtml += `
        <tr class="section-row">
          <td colspan="8" style="font-weight: 700; background: #e5e7eb; text-transform: uppercase; letter-spacing: 0.04em;">
            ${territory.territoryName} (${territory.customerCount} customers)
          </td>
        </tr>
        ${territoryRows}
        <tr class="subtotal">
          <td colspan="6" style="text-align:right; font-weight: 700; background: #f9fafb;">Territory Total</td>
          <td style="text-align:right; font-weight: 700; background: #f9fafb;">৳${territoryTotalCredit.toLocaleString()}</td>
          <td style="background: #f9fafb;"></td>
        </tr>
      `;
    });

    return `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Customer Details Report Print</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 18px; color: #111827; }
            h1 { margin: 0 0 8px; font-size: 20px; }
            .meta { font-size: 12px; margin-bottom: 12px; color: #4b5563; }
            .header-wrap { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:2px solid #000; padding-bottom:10px; }
            .header-right { text-align:right; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
            .header-right h2 { margin:0; font-size:20px; font-weight:bold; color:#1a1a1a; }
            .header-right p { margin:2px 0; font-size:10px; color:#555; }
            .report-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; }
            .report-title { font-size:16px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #d1d5db; padding: 7px 8px; font-size: 12px; vertical-align: top; }
            th { background: #f3f4f6; text-align: left; font-weight: 600; }
            .section-row td { font-weight: 700; background: #e5e7eb; text-transform: uppercase; letter-spacing: 0.04em; }
            .subtotal td { font-weight: 700; background: #f9fafb; }
            tfoot td { font-weight: 700; background: #f9fafb; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header-wrap">
            <div>
              <img src='/images/NPL-Updated-Logo.png' alt='Company Logo' style='width:150px; height:auto;' />
            </div>
            <div class="header-right">
              <h2>Navantis Pharma Limited</h2>
              <p>Haque Villa, House No - 4, Block - C, Road No - 3, Section - 1, Kolwalapara, Mirpur - 1, Dhaka - 1216</p>
              <p>Hotline: +880 1322-852183</p>
            </div>
          </div>

          <div class="report-row">
            <div class="report-title">Customer Details Report</div>
            <div class="meta">Printed on: <b>${todayText}</b></div>
          </div>

          <div class="meta">
            Total Customers: ${reportData.summary.totalCustomers} | 
            Total Territories: ${reportData.summary.totalTerritories} |
            Total Credit Limit: ৳${reportData.summary.totalCreditLimit.toLocaleString()}
          </div>

          <table>
            <thead>
              <tr>
                <th style="width:4%; text-align:center">S/L</th>
                <th style="width:8%">Customer ID</th>
                <th style="width:14%">Customer Name</th>
                <th style="width:22%">Address</th>
                <th style="width:10%">Phone</th>
                <th style="width:12%">Pay Mode</th>
                <th style="width:15%; text-align:right">Credit Limit</th>
                <th style="width:15%; text-align:right">Day Limit</th>
              </tr>
            </thead>
            <tbody>
              ${bodyHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="6" style="text-align:right">Grand Total Credit Limit</td>
                <td style="text-align:right">৳${grandTotalCredit.toLocaleString()}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </body>
      </html>
    `;
  };

  const handlePdfExport = () => {
    try {
      const element = document.createElement("div");
      element.innerHTML = buildPrintHtml();

      const options = {
        margin: 10,
        filename: `Customer-Details-Report-${new Date().toISOString().split("T")[0]}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: "landscape", unit: "mm", format: "a4" },
      };

      html2pdf().set(options).from(element).save();
      toast.success("PDF exported successfully");
    } catch (err) {
      toast.error("Failed to export PDF");
      console.error(err);
    }
  };

  const handleExcelExport = () => {
    try {
      const worksheetData = [];

      worksheetData.push(["Customer Details Report", "", "", "", "", "", "", ""]);
      worksheetData.push(["Generated on", new Date().toLocaleString(), "", "", "", "", "", ""]);
      worksheetData.push([]);

      worksheetData.push(["Summary"]);
      worksheetData.push(["Total Customers", reportData.summary.totalCustomers]);
      worksheetData.push(["Total Territories", reportData.summary.totalTerritories]);
      worksheetData.push(["Total Credit Limit", reportData.summary.totalCreditLimit]);
      worksheetData.push([]);

      reportData.data.forEach((territory) => {
        worksheetData.push([territory.territoryName, "", "", "", "", "", "", ""]);
        worksheetData.push([
          "Customer ID",
          "Customer Name",
          "Address",
          "Phone",
          "Pay Mode",
          "Credit Limit",
          "Day Limit",
          "Status",
        ]);

        territory.customers.forEach((customer) => {
          worksheetData.push([
            customer.customerId,
            customer.customerName,
            customer.address,
            customer.phone,
            customer.payMode.join(", "),
            customer.creditLimit,
            customer.dayLimit,
            customer.status,
          ]);
        });

        worksheetData.push(["Territory Total", "", "", "", "", territory.totalCreditLimit, "", ""]);
        worksheetData.push([]);
      });

      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet["!cols"] = [{ wch: 12 }, { wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 12 }];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
      XLSX.writeFile(workbook, `Customer-Details-Report-${new Date().toISOString().split("T")[0]}.xlsx`);

      toast.success("Excel exported successfully");
    } catch (err) {
      toast.error("Failed to export Excel");
      console.error(err);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(buildPrintHtml());
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 250);
  };

  return (
    <div className="bg-neutral-50 dark:bg-neutral-900 min-h-screen p-0 space-y-3 print:bg-white print:p-2">
      <style>
        {`
          @media print {
            .no-print { display: none !important; }
            .print-title { display: block !important; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        `}
      </style>

      <div className="hidden print-title text-center mb-4">
        <h1 className="text-2xl font-bold">Customer Details Report</h1>
        <p className="text-sm">Printed on: {new Date().toLocaleString()}</p>
      </div>

      <Card className="mb-2 no-print">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="small" onClick={() => window.history.back()} className="ml-2">
              <MdArrowBack className="inline mr-1" />
              Back
            </Button>
            <div className="bg-white text-gray-500 flex items-center px-2 sm:px-3 md:px-4 py-1.5 sm:h-10">
              <h2 className="flex flex-wrap items-center text-xs md:text-sm font-semibold text-gray-800 gap-1 sm:gap-2">
                <span>EMS</span>
                <ChevronRight size={14} className="text-gray-400" />
                <span>REPORTS</span>
                <ChevronRight size={14} className="text-gray-400" />
                <span className="text-gray-900 font-bold">CUSTOMER DETAILS</span>
              </h2>
            </div>
          </div>
          {reportData?.data && (
            <div className="flex gap-2">
              <Button variant="outline" size="small" onClick={handlePdfExport}>
                Download PDF
              </Button>
              <Button variant="outline" size="small" onClick={handleExcelExport}>
                Download Excel
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Filters Card */}
      <Card className="p-2 no-print">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <FormSelect
            label="Pay Mode"
            value={payMode}
            options={payModeOptions}
            onChange={(e) => setPayMode(e.target.value)}
            className="text-xs"
          />
        </div>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card className="p-8 text-center">
          <div className="inline-block mb-4">
            <div className="w-10 h-10 border-4 border-neutral-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400">Loading report...</p>
        </Card>
      )}

      {/* Error State */}
      {isError && (
        <Card className="p-4 border-2 border-red-200 bg-red-50 dark:bg-red-900/20">
          <p className="text-red-600 dark:text-red-400 font-semibold mb-1">Error loading report</p>
          <p className="text-red-700 dark:text-red-300 text-sm">
            {error?.data?.message || "Something went wrong"}
          </p>
        </Card>
      )}

      {/* Summary Stats */}
      {reportData?.summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <Card className="p-4">
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Total Customers</p>
            <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              {reportData.summary.totalCustomers}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Total Territories</p>
            <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              {reportData.summary.totalTerritories}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Total Credit Limit</p>
            <p className="text-base font-bold text-blue-600 dark:text-blue-400">
              ৳{reportData.summary.totalCreditLimit.toLocaleString()}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Pay Mode Breakdown</p>
            <div className="text-xs mt-2 space-y-1">
              <p>Cash: {reportData.summary.payModeBreakdown.cash}</p>
              <p>Credit: {reportData.summary.payModeBreakdown.credit}</p>
            </div>
          </Card>
        </div>
      )}

      {/* Report Content - Territories with Expandable Customers */}
      {reportData?.data && (
        <div className="space-y-3">
          {reportData.data.map((territory) => (
            <Card key={territory.territoryName} className="p-0 overflow-hidden">
              {/* Territory Header */}
              <button
                onClick={() => toggleTerritory(territory.territoryName)}
                className="w-full flex items-center justify-between p-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors no-print"
              >
                <div className="text-left">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {territory.territoryName}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    {territory.customerCount} customers • Credit Limit: <span className="text-blue-600 dark:text-blue-400 font-semibold">৳{territory.totalCreditLimit.toLocaleString()}</span>
                  </p>
                </div>
                <div className="text-neutral-600 dark:text-neutral-400">
                  {expandedTerritories[territory.territoryName] ? (
                    <MdExpandLess size={24} />
                  ) : (
                    <MdExpandMore size={24} />
                  )}
                </div>
              </button>

              {/* Customers Table */}
              {expandedTerritories[territory.territoryName] && (
                <div className="px-4 pb-4 pt-0 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-neutral-200 dark:border-neutral-700">
                        <th className="text-left py-2 px-2 font-semibold text-neutral-700 dark:text-neutral-300">ID</th>
                        <th className="text-left py-2 px-2 font-semibold text-neutral-700 dark:text-neutral-300">Name</th>
                        <th className="text-left py-2 px-2 font-semibold text-neutral-700 dark:text-neutral-300">Address</th>
                        <th className="text-left py-2 px-2 font-semibold text-neutral-700 dark:text-neutral-300">Phone</th>
                        <th className="text-left py-2 px-2 font-semibold text-neutral-700 dark:text-neutral-300">Pay Mode</th>
                        <th className="text-right py-2 px-2 font-semibold text-neutral-700 dark:text-neutral-300">Credit Limit</th>
                        <th className="text-right py-2 px-2 font-semibold text-neutral-700 dark:text-neutral-300">Day Limit</th>
                        <th className="text-center py-2 px-2 font-semibold text-neutral-700 dark:text-neutral-300">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {territory.customers.map((customer, idx) => (
                        <tr
                          key={customer.customerId}
                          className={`border-b border-neutral-200 dark:border-neutral-700 ${
                            idx % 2 === 0
                              ? "bg-neutral-50 dark:bg-neutral-900/30"
                              : "bg-white dark:bg-neutral-800/30"
                          }`}
                        >
                          <td className="py-2 px-2 text-neutral-900 dark:text-neutral-100">
                            {customer.customerId}
                          </td>
                          <td className="py-2 px-2 font-medium text-neutral-900 dark:text-neutral-100">
                            {customer.customerName}
                          </td>
                          <td className="py-2 px-2 text-neutral-700 dark:text-neutral-300">
                            {customer.address}
                          </td>
                          <td className="py-2 px-2 text-neutral-700 dark:text-neutral-300">
                            {customer.phone}
                          </td>
                          <td className="py-2 px-2 text-neutral-700 dark:text-neutral-300">
                            {customer.payMode.join(", ")}
                          </td>
                          <td className="py-2 px-2 text-right font-semibold text-blue-600 dark:text-blue-400">
                            ৳{customer.creditLimit.toLocaleString()}
                          </td>
                          <td className="py-2 px-2 text-right font-semibold text-blue-600 dark:text-blue-400">
                            ৳{customer.dayLimit.toLocaleString()}
                          </td>
                          <td className="py-2 px-2 text-center">
                            <span
                              className={`text-xs font-medium px-2 py-1 rounded ${
                                customer.status === "active"
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                  : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                              }`}
                            >
                              {customer.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
