import { useEffect, useMemo, useState } from "react";
import { MdPrint, MdRefresh, MdDownload, MdExpandMore, MdExpandLess } from "react-icons/md";
import Card from "../../component/common/Card";
import Table from "../../component/common/Table";
import Button from "../../component/common/Button";
import FormInput from "../../component/common/FormInput";
import FormSelect from "../../component/common/FormSelect";
import { useLazyGetProductSummaryReportQuery } from "../../redux/features/reports/productSummaryReportApi";
import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";

const EMPTY_TEXT = "--";

export default function ProductSummary() {
  const initialFilters = {
    reportType: "product",
    entityType: "all",
    fromDate: "",
    toDate: "",
    orderStatus: "delivered",
  };

  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [isDetailExpanded, setIsDetailExpanded] = useState(false);

  const [fetchReport, reportState] = useLazyGetProductSummaryReportQuery();

  const entityTypeOptions = [
    { value: "all", label: "All Entities" },
    { value: "customer", label: "Customer" },
    { value: "institute", label: "Institute" },
  ];

  const orderStatusOptions = [
    { value: "delivered", label: "Delivered" },
    { value: "pending", label: "Pending" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const formatCurrency = (value) => {
    const amount = Number(value || 0);
    return `৳${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const renderAmount = (value) => (
    <span className="text-blue-600 dark:text-blue-400 font-semibold">{formatCurrency(value)}</span>
  );

  const formatText = (value, fallback = EMPTY_TEXT) => {
    if (value === undefined || value === null) return fallback;
    const text = String(value).trim();
    return text.length ? text : fallback;
  };

  const getErrorMessage = (error) => {
    if (!error) return "";
    return error?.data?.error || error?.data?.message || "Failed to load report data.";
  };

  const loadReport = (nextFilters, fetchFromApi = true) => {
    setFilters(nextFilters);
    
    if (fetchFromApi) {
      setAppliedFilters({
        ...nextFilters,
        entityType: "all",
      });

      const params = {
        reportType: "product",
        entityType: "all",
        fromDate: nextFilters.fromDate,
        toDate: nextFilters.toDate,
        orderStatus: nextFilters.orderStatus,
      };

      fetchReport(params);
    } else {
      setAppliedFilters(nextFilters);
    }
  };

  useEffect(() => {
    loadReport(initialFilters, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApply = () => {
    const onlyEntityTypeChanged =
      filters.fromDate === appliedFilters.fromDate &&
      filters.toDate === appliedFilters.toDate &&
      filters.orderStatus === appliedFilters.orderStatus;

    loadReport(filters, !onlyEntityTypeChanged);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    loadReport(initialFilters, true);
  };

  const reportData = reportState.data || {};
  const dataByType = useMemo(() => reportData.data || {}, [reportData.data]);
  const summaryByType = useMemo(() => reportData.summaryByType || {}, [reportData.summaryByType]);
  const totalSummary = useMemo(() => reportData.summary || {}, [reportData.summary]);

  const currentEntityType = appliedFilters.entityType === "all" ? "all" : appliedFilters.entityType;
  const tableData = useMemo(() => {
    return Array.isArray(dataByType[currentEntityType]) ? dataByType[currentEntityType] : [];
  }, [dataByType, currentEntityType]);

  const currentSummary = useMemo(() => {
    if (currentEntityType === "all") {
      return totalSummary;
    }
    return summaryByType[currentEntityType] || totalSummary;
  }, [currentEntityType, totalSummary, summaryByType]);

  const compactTableClass = "[&_th]:px-2 [&_th]:py-1.5 [&_td]:px-2 [&_td]:py-1.5";

  const tableColumns = useMemo(
    () => [
      {
        key: "productName",
        label: "Product Name",
        className: "min-w-[220px]",
        render: (value) => formatText(value),
      },
      {
        key: "packSize",
        label: "Pack Size",
        className: "min-w-[100px]",
        render: (value) => formatText(value),
      },
      {
        key: "entityType",
        label: "Entity Type",
        className: "min-w-[100px]",
        render: (value) => formatText(value),
      },
      {
        key: "orderCount",
        label: "Orders",
        align: "right",
        className: "min-w-[80px]",
      },
      {
        key: "quantity",
        label: "Quantity",
        align: "right",
        className: "min-w-[80px]",
      },
      {
        key: "returnedQuantity",
        label: "Returned",
        align: "right",
        className: "min-w-[80px]",
      },
      {
        key: "price",
        label: "Unit Price",
        align: "right",
        className: "min-w-[120px]",
        render: (value) => renderAmount(value),
      },
      {
        key: "totalPrice",
        label: "Total Price",
        align: "right",
        className: "min-w-[120px]",
        render: (value) => renderAmount(value),
      },
    ],
    []
  );

  const buildPrintHtml = () => {
    const safeText = (value) => {
      const text = value === null || value === undefined ? EMPTY_TEXT : String(value).trim() || EMPTY_TEXT;
      return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
    };

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
    tableData.forEach((row, index) => {
      rowsHtml += `
        <tr>
          <td>${index + 1}</td>
          <td>${safeText(row.productName)}</td>
          <td>${safeText(row.packSize)}</td>
          <td>${safeText(row.entityType)}</td>
          <td style="text-align:right">${row.orderCount || 0}</td>
          <td style="text-align:right">${row.quantity || 0}</td>
          <td style="text-align:right">${row.returnedQuantity || 0}</td>
          <td style="text-align:right">${formatCurrency(row.price)}</td>
          <td style="text-align:right">${formatCurrency(row.totalPrice)}</td>
        </tr>
      `;
    });

    return `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Product Summary Report</title>
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
            th { background: #f3f4f6; text-align: left; }
            tfoot td { font-weight: 700; background: #f9fafb; }
            .summary-row { margin: 15px 0; }
            .summary-row h3 { font-size: 13px; font-weight: 700; margin-bottom: 8px; }
            .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
            .summary-item { padding: 10px; background: #f9fafb; border: 1px solid #e5e7eb; }
            .summary-item strong { display: block; font-size: 14px; }
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
            <div class="report-title">Product Summary Report</div>
            <div class="meta">Printed on: <b>${todayText}</b></div>
          </div>

          <div class="summary-row">
            <h3>Summary</h3>
            <div class="summary-grid">
              <div class="summary-item">
                <strong>${currentSummary.totalProducts || 0}</strong>
                <small>Total Products</small>
              </div>
              <div class="summary-item">
                <strong>${currentSummary.totalQuantity || 0}</strong>
                <small>Total Quantity</small>
              </div>
              <div class="summary-item">
                <strong>${currentSummary.totalReturned || 0}</strong>
                <small>Total Returned</small>
              </div>
              <div class="summary-item">
                <strong>${formatCurrency(currentSummary.grandTotal)}</strong>
                <small>Grand Total</small>
              </div>
            </div>
          </div>

          <div class="meta">
            Date Range: ${appliedFilters.fromDate || "N/A"} to ${appliedFilters.toDate || "N/A"} | 
            Status: ${appliedFilters.orderStatus || "N/A"} | 
            Entity Type: ${appliedFilters.entityType || "All"}
          </div>

          <table>
            <thead>
              <tr>
                <th>SL</th>
                <th>Product Name</th>
                <th>Pack Size</th>
                <th>Entity Type</th>
                <th>Orders</th>
                <th>Quantity</th>
                <th>Returned</th>
                <th>Unit Price</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4">Total</td>
                <td style="text-align:right">${tableData.length}</td>
                <td style="text-align:right">${currentSummary.totalQuantity || 0}</td>
                <td style="text-align:right">${currentSummary.totalReturned || 0}</td>
                <td></td>
                <td style="text-align:right">${formatCurrency(currentSummary.grandTotal)}</td>
              </tr>
            </tfoot>
          </table>
        </body>
      </html>
    `;
  };

  const buildExcelRows = () => {
    const safeValue = (value) => (value === null || value === undefined || value === "" ? EMPTY_TEXT : String(value));

    return tableData.map((row, index) => ({
      "SL": index + 1,
      "Product Name": safeValue(row.productName),
      "Pack Size": safeValue(row.packSize),
      "Entity Type": safeValue(row.entityType),
      "Orders": Number(row.orderCount || 0),
      "Quantity": Number(row.quantity || 0),
      "Returned": Number(row.returnedQuantity || 0),
      "Unit Price": Number(row.price || 0),
      "Total Price": Number(row.totalPrice || 0),
    }));
  };

  const handleDownloadPdf = async () => {
    if (tableData.length === 0) return;

    const tempFrame = document.createElement("iframe");
    tempFrame.style.position = "fixed";
    tempFrame.style.left = "-10000px";
    tempFrame.style.top = "0";
    tempFrame.style.width = "1200px";
    tempFrame.style.height = "900px";
    tempFrame.style.border = "0";
    document.body.appendChild(tempFrame);

    const printHtml = buildPrintHtml();

    try {
      const frameDoc = tempFrame.contentDocument || tempFrame.contentWindow?.document;
      if (!frameDoc) return;

      frameDoc.open();
      frameDoc.write(printHtml);
      frameDoc.close();

      await new Promise((resolve) => {
        tempFrame.onload = () => resolve(true);
        setTimeout(() => resolve(true), 500);
      });

      await html2pdf()
        .set({
          margin: 8,
          filename: "product-summary-report.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { orientation: "landscape", unit: "mm", format: "a4" },
        })
        .from(frameDoc.body)
        .save();
    } finally {
      document.body.removeChild(tempFrame);
    }
  };

  const handleDownloadExcel = () => {
    if (tableData.length === 0) return;

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(buildExcelRows());
    const columnWidths = [
      { wch: 6 },
      { wch: 28 },
      { wch: 12 },
      { wch: 14 },
      { wch: 10 },
      { wch: 12 },
      { wch: 12 },
      { wch: 14 },
      { wch: 14 },
    ];
    worksheet["!cols"] = columnWidths;
    XLSX.utils.book_append_sheet(workbook, worksheet, "Product Summary");
    XLSX.writeFile(workbook, "product-summary-report.xlsx");
  };

  const handlePrint = () => {
    if (tableData.length === 0) return;

    const printWindow = window.open("", "_blank", "width=1200,height=900");
    if (!printWindow) return;

    const html = buildPrintHtml();
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();

    const trigger = () => {
      try {
        printWindow.print();
      } catch {
        return;
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
            .print\\:break-inside-avoid { break-inside: avoid; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        `}
      </style>

      <div className="hidden print-title text-center mb-4">
        <h1 className="text-xl font-bold">Product Summary Report</h1>
        <p className="text-xs">Printed on: {new Date().toLocaleString()}</p>
      </div>

      <div className="flex items-center justify-between no-print">
        <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
          Product Summary Report
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="small"
            onClick={handleDownloadPdf}
            disabled={tableData.length === 0}
            icon={MdDownload}
          >
            Download PDF
          </Button>
          <Button
            variant="outline"
            size="small"
            onClick={handleDownloadExcel}
            disabled={tableData.length === 0}
            icon={MdDownload}
          >
            Download Excel
          </Button>
          <Button
            variant="outline"
            size="small"
            icon={MdPrint}
            onClick={handlePrint}
            disabled={tableData.length === 0}
          >
            Print
          </Button>
          <Button
            variant="outline"
            size="small"
            icon={MdRefresh}
            onClick={() => loadReport(appliedFilters, true)}
            loading={reportState.isFetching}
          >
            Refresh
          </Button>
        </div>
      </div>

      <Card className="p-6 no-print">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          Filters
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormSelect
            label="Entity Type"
            value={filters.entityType}
            options={entityTypeOptions}
            onChange={(e) => handleFilterChange("entityType", e.target.value)}
            placeholder="All entities"
          />
          <FormSelect
            label="Order Status"
            value={filters.orderStatus}
            options={orderStatusOptions}
            onChange={(e) => handleFilterChange("orderStatus", e.target.value)}
            placeholder="Select status"
          />
          <FormInput
            label="From Date"
            type="date"
            value={filters.fromDate}
            onChange={(e) => handleFilterChange("fromDate", e.target.value)}
          />
          <FormInput
            label="To Date"
            type="date"
            value={filters.toDate}
            onChange={(e) => handleFilterChange("toDate", e.target.value)}
          />
        </div>
        <div className="mt-4 flex gap-2">
          <Button size="small" onClick={handleApply}>
            Apply Filters
          </Button>
          <Button size="small" variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </Card>

      {reportState.error && (
        <Card className="p-4 border-red-200" borderColor="red">
          <p className="text-red-600 text-xs">{getErrorMessage(reportState.error)}</p>
        </Card>
      )}

      <Card className="print:break-inside-avoid rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <button
          onClick={() => setIsDetailExpanded(!isDetailExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Summary
            </h2>
            <span className="text-xs text-gray-500">
              {isDetailExpanded ? "Hide" : "Show"} report summary
            </span>
          </div>
          <div className="text-gray-500">
            {isDetailExpanded ? <MdExpandLess size={24} /> : <MdExpandMore size={24} />}
          </div>
        </button>

        {isDetailExpanded && (
          <div className="border-t border-slate-200 p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-lg border border-neutral-200 bg-white dark:bg-neutral-900/30 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-600 dark:text-neutral-400 mb-1">
                  Total Products
                </p>
                <p className="text-base font-extrabold text-neutral-900 dark:text-neutral-100 tabular-nums leading-tight">
                  {currentSummary.totalProducts || 0}
                </p>
              </div>
              <div className="rounded-lg border border-neutral-200 bg-white dark:bg-neutral-900/30 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-600 dark:text-neutral-400 mb-1">
                  Total Quantity
                </p>
                <p className="text-base font-extrabold text-neutral-900 dark:text-neutral-100 tabular-nums leading-tight">
                  {currentSummary.totalQuantity || 0}
                </p>
              </div>
              <div className="rounded-lg border border-neutral-200 bg-white dark:bg-neutral-900/30 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-600 dark:text-neutral-400 mb-1">
                  Total Returned
                </p>
                <p className="text-base font-extrabold text-neutral-900 dark:text-neutral-100 tabular-nums leading-tight">
                  {currentSummary.totalReturned || 0}
                </p>
              </div>
              <div className="rounded-lg border border-neutral-200 bg-white dark:bg-neutral-900/30 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-600 dark:text-neutral-400 mb-1">
                  Grand Total
                </p>
                <p className="text-base font-extrabold text-blue-600 dark:text-blue-400 tabular-nums leading-tight">
                  {formatCurrency(currentSummary.grandTotal)}
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>

      <Card title="Product Details" className="print:break-inside-avoid">
        <Table
          columns={tableColumns}
          data={tableData}
          striped
          hover
          size="sm"
          className={compactTableClass}
          loading={reportState.isFetching}
          emptyMessage="No records found"
        />
      </Card>
    </div>
  );
}
