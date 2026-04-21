import { useState } from "react";
import { MdPrint, MdRefresh } from "react-icons/md";
import { useGetDailyCollectionReportQuery } from "../../redux/features/reports/reportsAPI";
import * as XLSX from "xlsx";
import html2pdf from "html2pdf.js";
import { toast } from "react-toastify";
import Card from "../../component/common/Card";
import Button from "../../component/common/Button";
import FormInput from "../../component/common/FormInput";

export default function DailyCollectionReport() {
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [showDaily, setShowDaily] = useState(true);

  // Fetch report data
  const { data: reportData, isLoading, isError, error } = useGetDailyCollectionReportQuery(
    showDaily ? { startDate: null, endDate: null } : { startDate, endDate },
    { skip: false }
  );

  // Build HTML for print
  const buildPrintHtml = () => {
    if (!reportData?.data?.details) return "";

    const logoUrl = "/images/NPL-Updated-Logo.png";
    const todayText = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    let rowsHtml = "";
    let serial = 1;

    reportData.data.details.forEach((item) => {
      const itemTotal = (item.cash || 0) + (item.bank || 0) + (item.cheque || 0) + (item.beftn || 0) + (item.tdsCheque || 0) + (item.tdsBeftn || 0);
      rowsHtml += `
        <tr>
          <td>${serial++}</td>
          <td>${item.customerName || "Unknown"}</td>
          <td style="text-align:center">${item.transactionCount}</td>
          <td style="text-align:right">৳${Number(item.cash || 0).toLocaleString()}</td>
          <td style="text-align:right">৳${Number(item.bank || 0).toLocaleString()}</td>
          <td style="text-align:right">৳${Number(item.cheque || 0).toLocaleString()}</td>
          <td style="text-align:right">৳${Number(item.beftn || 0).toLocaleString()}</td>
          <td style="text-align:right">৳${Number(item.tdsCheque || 0).toLocaleString()}</td>
          <td style="text-align:right">৳${Number(item.tdsBeftn || 0).toLocaleString()}</td>
          <td style="text-align:right;font-weight:bold">৳${itemTotal.toLocaleString()}</td>
        </tr>
      `;
    });

    return `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Daily Collection Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 18px; color: #111827; }
            h1 { margin: 0 0 8px; font-size: 20px; }
            .meta { font-size: 12px; margin-bottom: 12px; color: #4b5563; }
            .header-wrap { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:2px solid #000; padding-bottom:10px; }
            .header-right { text-align:right; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
            .header-right h2 { margin:0; font-size:20px; font-weight:bold; color:#1a1a1a; }
            .header-right p { margin:2px 0; font-size:10px; color:#555; }
            .report-title { font-size:16px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:12px; }
            .report-meta { font-size:11px; color:#666; margin-bottom:8px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #d1d5db; padding: 7px 8px; font-size: 12px; vertical-align: top; }
            th { background: #f3f4f6; text-align: left; font-weight: 600; }
            tfoot td { font-weight: 700; background: #f9fafb; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header-wrap">
            <div>
              <img src='${logoUrl}' alt='Company Logo' style='width:150px; height:auto;' />
            </div>
            <div class="header-right">
              <h2>Navantis Pharma Limited</h2>
              <p>Haque Villa, House No - 4, Block - C, Road No - 3, Section - 1, Kolwalapara, Mirpur - 1, Dhaka - 1216</p>
              <p>Hotline: +880 1322-852183</p>
            </div>
          </div>
          
          <div class="report-title">Daily Collection Report</div>
          <div class="report-meta">Report Date: ${reportData.data.reportDate}</div>
          <div class="report-meta">Generated: ${todayText}</div>
          
          <table>
            <thead>
              <tr>
                <th style="width:5%">S/L</th>
                <th>Customer Name</th>
                <th style="width:10%; text-align:center">Transactions</th>
                <th style="width:9%; text-align:right">Cash</th>
                <th style="width:9%; text-align:right">Bank</th>
                <th style="width:9%; text-align:right">Cheque</th>
                <th style="width:9%; text-align:right">BEFTN</th>
                <th style="width:9%; text-align:right">TDS Cheque</th>
                <th style="width:9%; text-align:right">TDS BEFTN</th>
                <th style="width:9%; text-align:right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="text-align:left">TOTAL</td>
                <td style="text-align:center">${reportData.data.details.reduce((sum, item) => sum + (item.transactionCount || 0), 0)}</td>
                <td style="text-align:right">৳${reportData.data.summary.totalCash.toLocaleString()}</td>
                <td style="text-align:right">৳${reportData.data.summary.totalBank.toLocaleString()}</td>
                <td style="text-align:right">৳${reportData.data.summary.totalCheque.toLocaleString()}</td>
                <td style="text-align:right">৳${reportData.data.summary.totalBeftn.toLocaleString()}</td>
                <td style="text-align:right">৳${reportData.data.summary.totalTdsCheque.toLocaleString()}</td>
                <td style="text-align:right">৳${reportData.data.summary.totalTdsBeftn.toLocaleString()}</td>
                <td style="text-align:right;font-weight:bold">৳${reportData.data.summary.grandTotal.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </body>
      </html>
    `;
  };

  // Export to Excel
  const handleExcelExport = () => {
    if (!reportData?.data?.details) {
      toast.warning("No data to export");
      return;
    }

    const worksheetData = [
      ["Daily Collection Report"],
      ["Report Date", reportData.data.reportDate],
      [],
      ["Details"],
      [
        "S/L",
        "Customer Name",
        "Transaction Count",
        "Cash",
        "Bank",
        "Cheque",
        "BEFTN",
        "TDS Cheque",
        "TDS BEFTN",
        "Total",
      ],
    ];

    let serial = 1;
    reportData.data.details.forEach((item) => {
      const itemTotal = (item.cash || 0) + (item.bank || 0) + (item.cheque || 0) + (item.beftn || 0) + (item.tdsCheque || 0) + (item.tdsBeftn || 0);
      worksheetData.push([
        serial++,
        item.customerName || "Unknown",
        item.transactionCount || 0,
        item.cash || 0,
        item.bank || 0,
        item.cheque || 0,
        item.beftn || 0,
        item.tdsCheque || 0,
        item.tdsBeftn || 0,
        itemTotal,
      ]);
    });

    // Add totals
    worksheetData.push([
      "",
      "TOTAL",
      reportData.data.details.reduce((sum, item) => sum + (item.transactionCount || 0), 0),
      reportData.data.summary.totalCash,
      reportData.data.summary.totalBank,
      reportData.data.summary.totalCheque,
      reportData.data.summary.totalBeftn,
      reportData.data.summary.totalTdsCheque,
      reportData.data.summary.totalTdsBeftn,
      reportData.data.summary.grandTotal,
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Collection Report");
    XLSX.writeFile(workbook, `daily-collection-report-${startDate}.xlsx`);
    toast.success("Report exported to Excel");
  };

  // Export to PDF
  const handlePdfExport = () => {
    if (!reportData?.data) {
      toast.warning("No data to export");
      return;
    }

    const printHtml = buildPrintHtml();
    const tempFrame = document.createElement("iframe");
    tempFrame.style.position = "fixed";
    tempFrame.style.left = "-10000px";
    tempFrame.style.top = "0";
    tempFrame.style.width = "1200px";
    tempFrame.style.height = "900px";
    tempFrame.style.border = "0";
    document.body.appendChild(tempFrame);

    try {
      const frameDoc = tempFrame.contentDocument || tempFrame.contentWindow?.document;
      if (!frameDoc) return;

      frameDoc.open();
      frameDoc.write(printHtml);
      frameDoc.close();

      setTimeout(() => {
        html2pdf()
          .set({
            margin: 8,
            filename: `daily-collection-report-${startDate}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { orientation: "landscape", unit: "mm", format: "a4" },
          })
          .from(frameDoc.body)
          .save()
          .finally(() => {
            if (document.body.contains(tempFrame)) {
              document.body.removeChild(tempFrame);
            }
          });
      }, 500);
    } catch (err) {
      console.error(err);
      if (document.body.contains(tempFrame)) {
        document.body.removeChild(tempFrame);
      }
    }
  };

  // Print report
  const handlePrint = () => {
    if (!reportData?.data) {
      toast.warning("No data to print");
      return;
    }

    const printHtml = buildPrintHtml();
    const printWindow = window.open("", "", "width=1200,height=900");
    if (!printWindow) {
      toast.error("Please allow popups for this site");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(printHtml);
    printWindow.document.close();
    printWindow.focus();

    const trigger = () => {
      try {
        printWindow.print();
      } catch (err) {
        console.error(err);
      }
    };

    printWindow.onload = trigger;
    setTimeout(trigger, 500);
  };

  return (
    <div className="bg-neutral-50 dark:bg-neutral-900 min-h-screen p-6 space-y-6 print:bg-white print:p-2">
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
        <h1 className="text-2xl font-bold">Daily Collection Report</h1>
        <p className="text-sm">Printed on: {new Date().toLocaleString()}</p>
      </div>

      {/* Header with Title and Action Buttons */}
      <div className="flex items-center justify-between no-print">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Daily Collection Report
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Monitor and analyze daily payment collections
          </p>
        </div>

        {/* Action Buttons */}
        {reportData?.data && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="small"
              onClick={handlePdfExport}
            >
              Download PDF
            </Button>
            <Button
              variant="outline"
              size="small"
              onClick={handleExcelExport}
            >
              Download Excel
            </Button>
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
              icon={MdRefresh}
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
          </div>
        )}
      </div>

      {/* Filters Card */}
      <Card className="p-2 no-print">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <div className="flex items-end gap-1">
            <Button
              size="small"
              variant={showDaily ? "default" : "outline"}
              onClick={() => setShowDaily(true)}
              className="text-xs py-1 px-2"
            >
              Today
            </Button>
            <Button
              size="small"
              variant={!showDaily ? "default" : "outline"}
              onClick={() => setShowDaily(false)}
              className="text-xs py-1 px-2"
            >
              Range
            </Button>
          </div>
          
          {!showDaily && (
            <>
              <FormInput
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-xs"
              />
              <FormInput
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-xs"
              />
            </>
          )}
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
        <div style={{ background: "white", borderRadius: "8px", border: "1px solid #fee2e2", padding: "16px" }}>
          <p style={{ color: "#dc2626", fontWeight: "600", margin: "0 0 4px 0" }}>Error loading report</p>
          <p style={{ color: "#991b1b", fontSize: "14px", margin: 0 }}>
            {error?.data?.message || "Something went wrong"}
          </p>
        </div>
      )}

      {/* Report Table */}
      {reportData?.data && (
        <div style={{ background: "white", borderRadius: "8px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden" }}>
          {/* Report Header */}
          <div style={{ borderBottom: "1px solid #e5e7eb", padding: "16px" }}>
            <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827", margin: 0 }}>
              Report Date: {reportData.data.reportDate}
            </p>
            {reportData.warnings && reportData.warnings.length > 0 && (
              <div style={{ marginTop: "12px", padding: "12px", background: "#fef3c7", borderRadius: "6px", fontSize: "13px", color: "#92400e" }}>
                {reportData.warnings.map((warning, idx) => (
                  <p key={idx} style={{ margin: "4px 0" }}>
                    ⚠️ {warning}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "#f3f4f6", borderBottom: "1px solid #e5e7eb" }}>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#374151", width: "5%" }}>S/L</th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#374151" }}>Customer Name</th>
                  <th style={{ padding: "12px", textAlign: "center", fontWeight: "600", color: "#374151", width: "10%" }}>Transactions</th>
                  <th style={{ padding: "12px", textAlign: "right", fontWeight: "600", color: "#374151", width: "9%" }}>Cash</th>
                  <th style={{ padding: "12px", textAlign: "right", fontWeight: "600", color: "#374151", width: "9%" }}>Bank</th>
                  <th style={{ padding: "12px", textAlign: "right", fontWeight: "600", color: "#374151", width: "9%" }}>Cheque</th>
                  <th style={{ padding: "12px", textAlign: "right", fontWeight: "600", color: "#374151", width: "9%" }}>BEFTN</th>
                  <th style={{ padding: "12px", textAlign: "right", fontWeight: "600", color: "#374151", width: "9%" }}>TDS Cheque</th>
                  <th style={{ padding: "12px", textAlign: "right", fontWeight: "600", color: "#374151", width: "9%" }}>TDS BEFTN</th>
                  <th style={{ padding: "12px", textAlign: "right", fontWeight: "600", color: "#374151", width: "9%" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {reportData.data.details.map((item, idx) => {
                  const itemTotal = (item.cash || 0) + (item.bank || 0) + (item.cheque || 0) + (item.beftn || 0) + (item.tdsCheque || 0) + (item.tdsBeftn || 0);
                  return (
                    <tr key={idx} style={{ borderBottom: "1px solid #e5e7eb", background: idx % 2 === 0 ? "#f9fafb" : "white" }}>
                      <td style={{ padding: "12px", color: "#111827" }}>{idx + 1}</td>
                      <td style={{ padding: "12px", color: "#111827", fontWeight: "500" }}>{item.customerName || "Unknown"}</td>
                      <td style={{ padding: "12px", textAlign: "center", color: "#111827" }}>{item.transactionCount}</td>
                      <td style={{ padding: "12px", textAlign: "right", color: "#2563eb", fontWeight: "600" }}>৳{Number(item.cash || 0).toLocaleString()}</td>
                      <td style={{ padding: "12px", textAlign: "right", color: "#16a34a", fontWeight: "600" }}>৳{Number(item.bank || 0).toLocaleString()}</td>
                      <td style={{ padding: "12px", textAlign: "right", color: "#ea580c", fontWeight: "600" }}>৳{Number(item.cheque || 0).toLocaleString()}</td>
                      <td style={{ padding: "12px", textAlign: "right", color: "#7c3aed", fontWeight: "600" }}>৳{Number(item.beftn || 0).toLocaleString()}</td>
                      <td style={{ padding: "12px", textAlign: "right", color: "#dc2626", fontWeight: "600" }}>৳{Number(item.tdsCheque || 0).toLocaleString()}</td>
                      <td style={{ padding: "12px", textAlign: "right", color: "#d97706", fontWeight: "600" }}>৳{Number(item.tdsBeftn || 0).toLocaleString()}</td>
                      <td style={{ padding: "12px", textAlign: "right", color: "#111827", fontWeight: "700" }}>৳{itemTotal.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ background: "#f9fafb", borderTop: "2px solid #d1d5db", fontWeight: "600" }}>
                  <td colSpan="2" style={{ padding: "12px", color: "#111827" }}>TOTAL</td>
                  <td style={{ padding: "12px", textAlign: "center", color: "#111827" }}>
                    {reportData.data.details.reduce((sum, item) => sum + (item.transactionCount || 0), 0)}
                  </td>
                  <td style={{ padding: "12px", textAlign: "right", color: "#2563eb" }}>৳{reportData.data.summary.totalCash.toLocaleString()}</td>
                  <td style={{ padding: "12px", textAlign: "right", color: "#16a34a" }}>৳{reportData.data.summary.totalBank.toLocaleString()}</td>
                  <td style={{ padding: "12px", textAlign: "right", color: "#ea580c" }}>৳{reportData.data.summary.totalCheque.toLocaleString()}</td>
                  <td style={{ padding: "12px", textAlign: "right", color: "#7c3aed" }}>৳{reportData.data.summary.totalBeftn.toLocaleString()}</td>
                  <td style={{ padding: "12px", textAlign: "right", color: "#dc2626" }}>৳{reportData.data.summary.totalTdsCheque.toLocaleString()}</td>
                  <td style={{ padding: "12px", textAlign: "right", color: "#d97706" }}>৳{reportData.data.summary.totalTdsBeftn.toLocaleString()}</td>
                  <td style={{ padding: "12px", textAlign: "right", color: "#111827" }}>৳{reportData.data.summary.grandTotal.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
