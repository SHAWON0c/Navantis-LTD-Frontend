import { useEffect, useMemo, useState } from "react";
import { MdArrowBack, MdExpandMore, MdExpandLess } from "react-icons/md";
import { ChevronRight } from "lucide-react";
import Card from "../../component/common/Card";
import Table from "../../component/common/Table";
import Button from "../../component/common/Button";
import FormInput from "../../component/common/FormInput";
import FormSelect from "../../component/common/FormSelect";
import { useLazyGetNetSalesReportQuery } from "../../redux/features/reports/netSalesReportApi";
import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";

const BASE_LIMIT_OPTIONS = [
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
];

const EMPTY_TEXT = "--";

export default function NetSales() {
  const initialFilters = {
    reportType: "all",
    filter: "",
    value: "",
    entityType: "",
    startDate: "",
    endDate: "",
    sort: "amount",
    limit: 20,
    skip: 0,
  };

  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [isTopDataExpanded, setIsTopDataExpanded] = useState(false);

  const [fetchNetSalesReport, reportState] = useLazyGetNetSalesReportQuery();
  const [fetchDashboardReport, dashboardState] = useLazyGetNetSalesReportQuery();

  const reportTypeOptions = [
    { value: "overview", label: "Overview" },
    { value: "all", label: "All Orders" },
    { value: "territory", label: "By Territory" },
    { value: "zone", label: "By Zone" },
    { value: "area", label: "By Area" },
    { value: "marketpoint", label: "By Market Point" },
    { value: "areaManager", label: "By Area Manager" },
    { value: "zonalManager", label: "By Zonal Manager" },
    { value: "creator", label: "By Creator" },
    { value: "detailed", label: "Detailed Dashboard" },
  ];

  const filterByOptions = [
    { value: "", label: "No Dimension Filter" },
    { value: "customerId", label: "Customer ID" },
    { value: "territoryId", label: "Territory ID" },
    { value: "zoneId", label: "Zone ID" },
    { value: "areaId", label: "Area ID" },
    { value: "marketPointId", label: "Market Point ID" },
    { value: "areaManagerId", label: "Area Manager ID" },
    { value: "zonalManagerId", label: "Zonal Manager ID" },
    { value: "createdBy", label: "Creator ID" },
    { value: "dateRange", label: "Date Range" },
  ];

  const entityTypeOptions = [
    { value: "", label: "All Entities" },
    { value: "customer", label: "Customer" },
    { value: "institute", label: "Institute" },
  ];

  const sortOptions = [
    { value: "amount", label: "Amount (High to Low)" },
    { value: "orders", label: "Orders (High to Low)" },
    { value: "name", label: "Name (A-Z)" },
  ];

  const formatCurrency = (value) => {
    const amount = Number(value || 0);
    return `৳${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const renderAmount = (value) => (
    <span className="text-blue-600 dark:text-blue-400 font-semibold">{formatCurrency(value)}</span>
  );

  const formatDate = (value) => {
    if (!value) return EMPTY_TEXT;
    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) return String(value || EMPTY_TEXT);
    return parsedDate.toLocaleDateString();
  };

  const formatText = (value, fallback = EMPTY_TEXT) => {
    if (value === undefined || value === null) return fallback;
    const text = String(value).trim();
    return text.length ? text : fallback;
  };

  const getErrorMessage = (error) => {
    if (!error) return "";
    return error?.data?.error || error?.data?.message || "Failed to load report data.";
  };

  const toNumber = (value, fallback) => {
    const parsedValue = Number(value);
    if (Number.isNaN(parsedValue) || parsedValue < 0) return fallback;
    return parsedValue;
  };

  const pickLabel = (...values) => {
    const found = values.find((value) => {
      if (value === undefined || value === null) return false;
      return String(value).trim().length > 0;
    });

    return found === undefined || found === null ? "Total" : String(found).trim();
  };

  const buildParams = (sourceFilters) => {
    const params = {
      reportType: sourceFilters.reportType,
      filter: sourceFilters.filter,
      value: sourceFilters.value,
      entityType: sourceFilters.entityType,
      startDate: sourceFilters.startDate,
      endDate: sourceFilters.endDate,
      sort: sourceFilters.sort,
      limit: toNumber(sourceFilters.limit, 50),
      skip: toNumber(sourceFilters.skip, 0),
    };

    if (["overview", "detailed"].includes(sourceFilters.reportType)) {
      delete params.sort;
    }

    return params;
  };

  const buildDashboardParams = (sourceFilters) => ({
    reportType: "detailed",
    entityType: sourceFilters.entityType,
    startDate: sourceFilters.startDate,
    endDate: sourceFilters.endDate,
    limit: 20,
    skip: 0,
  });

  const loadReports = (nextFilters, resetPage = false) => {
    const mergedFilters = {
      ...nextFilters,
      limit: toNumber(nextFilters.limit, 50),
      skip: resetPage ? 0 : toNumber(nextFilters.skip, 0),
    };

    setFilters(mergedFilters);
    setAppliedFilters(mergedFilters);

    fetchNetSalesReport(buildParams(mergedFilters));
    fetchDashboardReport(buildDashboardParams(mergedFilters));
  };

  useEffect(() => {
    loadReports(initialFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApply = () => {
    loadReports(filters, true);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    loadReports(initialFilters);
  };

  const handlePageChange = (direction) => {
    const limit = toNumber(appliedFilters.limit, 50);
    const currentSkip = toNumber(appliedFilters.skip, 0);
    const nextSkip = direction === "next" ? currentSkip + limit : Math.max(0, currentSkip - limit);

    loadReports({ ...appliedFilters, skip: nextSkip });
  };

  const reportPayload = reportState.data || {};
  const dashboardPayload = dashboardState.data || {};
  const reportRows = useMemo(() => {
    return Array.isArray(reportPayload.data) ? reportPayload.data : [];
  }, [reportPayload.data]);
  const summary = reportPayload.grandTotals || reportPayload.summary || {};
  const dashboardSummary = dashboardPayload.summary || {};
  const totalOrderCount = Number(summary.totalOrders ?? summary.totalRecords ?? 0);
  const isAllOrdersReport = filters.reportType === "all";
  const limitOptions = useMemo(() => {
    const options = [...BASE_LIMIT_OPTIONS];

    if (
      isAllOrdersReport &&
      totalOrderCount > 0 &&
      !options.some((option) => Number(option.value) === totalOrderCount)
    ) {
      options.push({ value: totalOrderCount, label: "All" });
    }

    return options;
  }, [isAllOrdersReport, totalOrderCount]);

  // Auto-set limit to "all" when reportType is "all"
  useEffect(() => {
    if (filters.reportType === "all" && totalOrderCount > 0 && Number(filters.limit) !== totalOrderCount) {
      setFilters((prev) => ({
        ...prev,
        limit: totalOrderCount,
      }));
    }
  }, [filters.reportType, totalOrderCount]);

  const canGoNext = reportRows.length >= toNumber(appliedFilters.limit, 50);
  const isAllOrdersLimitSelected =
    appliedFilters.reportType === "all" &&
    totalOrderCount > 0 &&
    Number(appliedFilters.limit) === totalOrderCount;
  const canExportAllOrders = appliedFilters.reportType === "all" && reportRows.length > 0 && !reportState.isFetching;
  const isPrintEnabled = canExportAllOrders;

  const normalizedReportRows = useMemo(() => {
    return reportRows.map((row, index) => {
      const fallbackLabel = pickLabel(
        row?.reportLabel,
        row?._id,
        row?.entityType,
        row?.territoryName,
        row?.zoneName,
        row?.areaName,
        row?.marketPointName,
        row?.areaManagerName,
        row?.zonalManagerName,
        row?.createdByName,
        row?.entityName,
        index === 0 ? "Total" : EMPTY_TEXT
      );

      return {
        ...row,
        reportLabel: fallbackLabel,
      };
    });
  }, [reportRows]);

  const primaryColumns = useMemo(() => {
    if (appliedFilters.reportType === "all") {
      return [
        { key: "invoiceNo", label: "Invoice", render: (value) => formatText(value) },
        { key: "entityType", label: "Type", render: (value) => formatText(value) },
        { key: "entityName", label: "Customer Name", render: (value) => formatText(value) },
        { key: "territoryName", label: "Territory", render: (value) => formatText(value) },
        { key: "zoneName", label: "Zone", render: (value) => formatText(value) },
        { key: "areaName", label: "Area", render: (value) => formatText(value) },
        { key: "marketPointName", label: "Market Point", render: (value) => formatText(value) },
        { key: "createdByName", label: "Creator", render: (value) => formatText(value) },
        { key: "createdAt", label: "Created", render: (value) => formatDate(value) },
        { key: "soldAmount", label: "Sold", align: "right", render: (value) => renderAmount(value) },
        { key: "discount", label: "Discount", align: "right", render: (value) => renderAmount(value) },
        { key: "adjustedAmount", label: "Adjustment", align: "right", render: (value) => renderAmount(value) },
        { key: "refundApplied", label: "Refund", align: "right", render: (value) => renderAmount(value) },
        { key: "netSales", label: "Net Sales", align: "right", render: (value) => renderAmount(value) },
      ];
    }

    if (appliedFilters.reportType === "overview") {
      return [
        {
          key: "_id",
          label: "Entity",
          className: "min-w-[180px]",
          render: (_value, row) => pickLabel(row?.reportLabel, row?._id, row?.entityType, "Total"),
        },
        { key: "totalOrders", label: "Orders", align: "right", className: "min-w-[100px]" },
        { key: "totalSoldAmount", label: "Sold", align: "right", className: "min-w-[140px]", render: (value) => renderAmount(value) },
        { key: "totalDiscount", label: "Discount", align: "right", className: "min-w-[140px]", render: (value) => renderAmount(value) },
        { key: "totalAdjustment", label: "Adjustment", align: "right", className: "min-w-[140px]", render: (value) => renderAmount(value) },
        { key: "totalRefund", label: "Refund", align: "right", className: "min-w-[140px]", render: (value) => renderAmount(value) },
        { key: "totalNetSales", label: "Net Sales", align: "right", className: "min-w-[150px]", render: (value) => renderAmount(value) },
      ];
    }

    if (appliedFilters.reportType === "detailed") {
      return [
        {
          key: "_id",
          label: "Entity",
          className: "min-w-[180px]",
          render: (_value, row) => pickLabel(row?.reportLabel, row?._id, row?.entityType, EMPTY_TEXT),
        },
        { key: "totalOrders", label: "Orders", align: "right", className: "min-w-[100px]" },
        { key: "totalNetSales", label: "Net Sales", align: "right", className: "min-w-[150px]", render: (value) => renderAmount(value) },
      ];
    }

    const nameFieldMap = {
      territory: "territoryName",
      zone: "zoneName",
      area: "areaName",
      marketpoint: "marketPointName",
      areaManager: "areaManagerName",
      zonalManager: "zonalManagerName",
      creator: "createdByName",
    };

    return [
      {
        key: nameFieldMap[appliedFilters.reportType] || "_id",
        label: "Name",
        className: "min-w-[180px]",
        render: (_value, row) =>
          pickLabel(row?.reportLabel, row?.[nameFieldMap[appliedFilters.reportType]], row?._id, EMPTY_TEXT),
      },
      { key: "totalOrders", label: "Orders", align: "right", className: "min-w-[100px]" },
      { key: "totalSoldAmount", label: "Sold", align: "right", className: "min-w-[140px]", render: (value) => renderAmount(value) },
      { key: "totalDiscount", label: "Discount", align: "right", className: "min-w-[140px]", render: (value) => renderAmount(value) },
      { key: "totalAdjustment", label: "Adjustment", align: "right", className: "min-w-[140px]", render: (value) => renderAmount(value) },
      { key: "totalRefund", label: "Refund", align: "right", className: "min-w-[140px]", render: (value) => renderAmount(value) },
      { key: "totalNetSales", label: "Net Sales", align: "right", className: "min-w-[150px]", render: (value) => renderAmount(value) },
      { key: "averageOrderValue", label: "Avg Order", align: "right", className: "min-w-[150px]", render: (value) => (value ? renderAmount(value) : EMPTY_TEXT) },
    ];
  }, [appliedFilters.reportType]);

  const detailEntityRows =
    appliedFilters.reportType === "detailed"
      ? dashboardPayload.byEntityType || reportPayload.byEntityType || []
      : [];

  const topSections = [
    { title: "Top Territories", items: dashboardPayload.topTerritories || [], key: "territoryName" },
    { title: "Top Zones", items: dashboardPayload.topZones || [], key: "zoneName" },
    { title: "Top Areas", items: dashboardPayload.topAreas || [], key: "areaName" },
    { title: "Top Market Points", items: dashboardPayload.topMarketPoints || [], key: "marketPointName" },
    { title: "Top Area Managers", items: dashboardPayload.topAreaManagers || [], key: "areaManagerName" },
    { title: "Top Zonal Managers", items: dashboardPayload.topZonalManagers || [], key: "zonalManagerName" },
    { title: "Top Creators", items: dashboardPayload.topCreators || [], key: "createdByName" },
  ];

  const compactTableClass = "[&_th]:px-2 [&_th]:py-1.5 [&_td]:px-2 [&_td]:py-1.5";

  const renderTopTable = (title, items, nameKey) => {
    if (!items.length) {
      return null;
    }

    return (
      <Card key={title} title={title} className="print:break-inside-avoid">
        <Table
          columns={[
            { key: nameKey, label: "Name", className: "min-w-[180px]" },
            { key: "totalNetSales", label: "Net Sales", align: "right", className: "min-w-[150px]", render: (value) => renderAmount(value) },
            { key: "totalOrders", label: "Orders", align: "right", className: "min-w-[100px]" },
          ]}
          data={items}
          striped
          hover
          size="sm"
          className={compactTableClass}
          emptyMessage="No data"
        />
      </Card>
    );
  };

  const buildAllOrdersPrintHtml = (rows) => {
    const safeText = (value) => {
      const text = value === null || value === undefined ? EMPTY_TEXT : String(value).trim() || EMPTY_TEXT;
      return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
    };

    const createTotals = () => ({
      soldAmount: 0,
      adjustedAmount: 0,
      discount: 0,
      refundApplied: 0,
      netSales: 0,
      orderCount: 0,
    });

    const addTotals = (target, source) => {
      target.soldAmount += source.soldAmount;
      target.adjustedAmount += source.adjustedAmount;
      target.discount += source.discount;
      target.refundApplied += source.refundApplied;
      target.netSales += source.netSales;
      target.orderCount += source.orderCount;
    };

    const normalizeEntityType = (value) => String(value || "customer").trim().toLowerCase();

    const getSectionTitle = (entityType) => {
      if (entityType === "institute") return "Institute Orders";
      if (entityType === "customer") return "Customer Orders";
      return `${entityType.charAt(0).toUpperCase()}${entityType.slice(1)} Orders`;
    };

    const buildEntitySection = (entityType, sectionRows) => {
      const isInstitute = entityType === "institute";
      const totals = createTotals();
      let serial = 1;
      let rowsHtml = "";

      if (isInstitute) {
        const instituteMap = new Map();

        sectionRows.forEach((row) => {
          const instituteName = pickLabel(row?.entityName, row?.customerName, row?.customerId, EMPTY_TEXT);

          if (!instituteMap.has(instituteName)) {
            instituteMap.set(instituteName, createTotals());
          }

          const currentTotals = instituteMap.get(instituteName);
          currentTotals.soldAmount += Number(row?.soldAmount || 0);
          currentTotals.adjustedAmount += Number(row?.adjustedAmount || 0);
          currentTotals.discount += Number(row?.discount || 0);
          currentTotals.refundApplied += Number(row?.refundApplied || 0);
          currentTotals.netSales += Number(row?.netSales || 0);
          currentTotals.orderCount += 1;
        });

        Array.from(instituteMap.entries()).forEach(([instituteName, currentTotals]) => {
          rowsHtml += `
            <tr>
              <td>${serial++}</td>
              <td>${EMPTY_TEXT}</td>
              <td>${EMPTY_TEXT}</td>
              <td>${safeText(instituteName)}</td>
              <td style="text-align:right">${formatCurrency(currentTotals.soldAmount)}</td>
              <td style="text-align:right">${formatCurrency(currentTotals.adjustedAmount)}</td>
              <td style="text-align:right">${formatCurrency(currentTotals.discount)}</td>
              <td style="text-align:right">${formatCurrency(currentTotals.refundApplied)}</td>
              <td style="text-align:right">${formatCurrency(currentTotals.netSales)}</td>
            </tr>
          `;

          addTotals(totals, currentTotals);
        });

        return { rowsHtml, totals };
      }

      const groups = new Map();

      sectionRows.forEach((row) => {
        const zoneName = pickLabel(row?.zoneName, EMPTY_TEXT);
        const territoryName = pickLabel(row?.territoryName, EMPTY_TEXT);
        const customerName = pickLabel(row?.entityName, row?.customerName, row?.customerId, EMPTY_TEXT);

        if (!groups.has(zoneName)) {
          groups.set(zoneName, new Map());
        }

        const territoryMap = groups.get(zoneName);
        if (!territoryMap.has(territoryName)) {
          territoryMap.set(territoryName, new Map());
        }

        const customerMap = territoryMap.get(territoryName);
        if (!customerMap.has(customerName)) {
          customerMap.set(customerName, createTotals());
        }

        const currentTotals = customerMap.get(customerName);
        currentTotals.soldAmount += Number(row?.soldAmount || 0);
        currentTotals.adjustedAmount += Number(row?.adjustedAmount || 0);
        currentTotals.discount += Number(row?.discount || 0);
        currentTotals.refundApplied += Number(row?.refundApplied || 0);
        currentTotals.netSales += Number(row?.netSales || 0);
        currentTotals.orderCount += 1;
      });

      Array.from(groups.entries()).forEach(([zoneName, territoryMap]) => {
        const zoneTotals = createTotals();
        const zoneCustomerCount = Array.from(territoryMap.values()).reduce(
          (count, customerMap) => count + customerMap.size,
          0
        );

        let zonePrinted = false;

        Array.from(territoryMap.entries()).forEach(([territoryName, customerMap]) => {
          const customers = Array.from(customerMap.entries());
          customers.forEach(([customerName, currentTotals], index) => {
            rowsHtml += `
              <tr>
                <td>${serial++}</td>
                ${!zonePrinted && index === 0 ? `<td rowspan="${zoneCustomerCount}">${safeText(zoneName)}</td>` : ""}
                ${index === 0 ? `<td rowspan="${customers.length}">${safeText(territoryName)}</td>` : ""}
                <td>${safeText(customerName)}</td>
                <td style="text-align:right">${formatCurrency(currentTotals.soldAmount)}</td>
                <td style="text-align:right">${formatCurrency(currentTotals.adjustedAmount)}</td>
                <td style="text-align:right">${formatCurrency(currentTotals.discount)}</td>
                <td style="text-align:right">${formatCurrency(currentTotals.refundApplied)}</td>
                <td style="text-align:right">${formatCurrency(currentTotals.netSales)}</td>
              </tr>
            `;

            addTotals(zoneTotals, currentTotals);
          });

          zonePrinted = true;
        });

        rowsHtml += `
          <tr class="subtotal zone-subtotal">
            <td colspan="4">Zone Total</td>
            <td style="text-align:right">${formatCurrency(zoneTotals.soldAmount)}</td>
            <td style="text-align:right">${formatCurrency(zoneTotals.adjustedAmount)}</td>
            <td style="text-align:right">${formatCurrency(zoneTotals.discount)}</td>
            <td style="text-align:right">${formatCurrency(zoneTotals.refundApplied)}</td>
            <td style="text-align:right">${formatCurrency(zoneTotals.netSales)}</td>
          </tr>
        `;

        addTotals(totals, zoneTotals);
      });

      return { rowsHtml, totals };
    };

    const sections = new Map();
    const todayText = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    rows.forEach((row) => {
      const entityType = normalizeEntityType(row?.entityType);

      if (!sections.has(entityType)) {
        sections.set(entityType, []);
      }

      sections.get(entityType).push(row);
    });

    const grandTotals = createTotals();
    const sectionOrder = ["customer", "institute"];
    const orderedSections = [
      ...sectionOrder.filter((entityType) => sections.has(entityType)),
      ...Array.from(sections.keys()).filter((entityType) => !sectionOrder.includes(entityType)),
    ];

    let bodyRows = "";

    orderedSections.forEach((entityType) => {
      const sectionRows = sections.get(entityType) || [];
      if (!sectionRows.length) return;

      const section = buildEntitySection(entityType, sectionRows);
      bodyRows += `
        <tr class="section-row">
          <td colspan="9">${safeText(getSectionTitle(entityType))}</td>
        </tr>
      `;
      bodyRows += section.rowsHtml;
      addTotals(grandTotals, section.totals);
    });

    return `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>All Orders - Net Sales Print</title>
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
            <div class="report-title">All Orders Net Sales Report</div>
            <div class="meta">Printed on: <b>${todayText}</b></div>
          </div>

          <div class="meta">Total Orders: ${rows.length}</div>
          <table>
            <thead>
              <tr>
                <th>SL</th>
                <th>Zone</th>
                <th>Territory</th>
                <th>Customer</th>
                <th>Sold Amount</th>
                <th>Adjustment</th>
                <th>Discount</th>
                <th>Return Amount</th>
                <th>Net Sales</th>
              </tr>
            </thead>
            <tbody>
              ${bodyRows}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4">Grand Total</td>
                <td style="text-align:right">${formatCurrency(grandTotals.soldAmount)}</td>
                <td style="text-align:right">${formatCurrency(grandTotals.adjustedAmount)}</td>
                <td style="text-align:right">${formatCurrency(grandTotals.discount)}</td>
                <td style="text-align:right">${formatCurrency(grandTotals.refundApplied)}</td>
                <td style="text-align:right">${formatCurrency(grandTotals.netSales)}</td>
              </tr>
            </tfoot>
          </table>
        </body>
      </html>
    `;
  };

  const buildAllOrdersFlatRows = (rows) => {
    const safeValue = (value) => (value === null || value === undefined || value === "" ? EMPTY_TEXT : String(value));

    return rows.map((row, index) => ({
      "SL": index + 1,
      "Invoice": safeValue(row?.invoiceNo),
      "Zone": safeValue(row?.zoneName),
      "Territory": safeValue(row?.territoryName),
      "Customer": safeValue(row?.entityName),
      "Sold Amount": Number(row?.soldAmount || 0),
      "Adjustment": Number(row?.adjustedAmount || 0),
      "Discount": Number(row?.discount || 0),
      "Return Amount": Number(row?.refundApplied || 0),
      "Net Sales": Number(row?.netSales || 0),
    }));
  };

  const handleDownloadPdf = async () => {
    if (!canExportAllOrders) return;

    const tempFrame = document.createElement("iframe");
    tempFrame.style.position = "fixed";
    tempFrame.style.left = "-10000px";
    tempFrame.style.top = "0";
    tempFrame.style.width = "1200px";
    tempFrame.style.height = "900px";
    tempFrame.style.border = "0";
    document.body.appendChild(tempFrame);

    const printHtml = buildAllOrdersPrintHtml(reportRows);

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
          filename: "all-orders-net-sales-report.pdf",
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
    if (!canExportAllOrders) return;

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(buildAllOrdersFlatRows(reportRows));
    const columnWidths = [
      { wch: 6 },
      { wch: 16 },
      { wch: 18 },
      { wch: 20 },
      { wch: 28 },
      { wch: 14 },
      { wch: 14 },
      { wch: 14 },
      { wch: 14 },
      { wch: 14 },
    ];
    worksheet["!cols"] = columnWidths;
    XLSX.utils.book_append_sheet(workbook, worksheet, "All Orders Net Sales");
    XLSX.writeFile(workbook, "all-orders-net-sales-report.xlsx");
  };

  const handlePrint = () => {
    if (!isPrintEnabled) {
      return;
    }

    const printWindow = window.open("", "_blank", "width=1200,height=900");
    if (!printWindow) {
      return;
    }

    const html = buildAllOrdersPrintHtml(reportRows);

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

  const topSummary = {
    totalOrders: dashboardSummary.totalOrders,
    totalSoldAmount: dashboardSummary.totalSoldAmount,
    totalDiscount: dashboardSummary.totalDiscount,
    totalAdjustment: dashboardSummary.totalAdjustment,
    totalRefund: dashboardSummary.totalRefund,
    totalNetSales: dashboardSummary.totalNetSales,
  };

  return (
    <div className="bg-neutral-50 dark:bg-neutral-900 min-h-screen p-0 space-y-3 print:bg-white print:p-2">
      <style>
        {`
          @media print {
            .no-print { display: none !important; }
            .print-title { display: block !important; }
            .print\\:break-inside-avoid { break-inside: avoid; }
            .print\\:grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        `}
      </style>

      <div className="hidden print-title text-center mb-4">
        <h1 className="text-xl font-bold">Unified Net Sales Report</h1>
        <p className="text-xs">Printed on: {new Date().toLocaleString()}</p>
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
                <span className="text-gray-900 font-bold">NET SALES</span>
              </h2>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="small" onClick={handleDownloadPdf} disabled={!canExportAllOrders}>
              Download PDF
            </Button>
            <Button variant="outline" size="small" onClick={handleDownloadExcel} disabled={!canExportAllOrders}>
              Download Excel
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-2 no-print">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <FormSelect
            label="Report Type"
            value={filters.reportType}
            options={reportTypeOptions}
            onChange={(e) => handleFilterChange("reportType", e.target.value)}
            placeholder="Select report type"
            className="text-xs"
          />
          <FormInput
            label="Start Date"
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange("startDate", e.target.value)}
            className="text-xs"
          />
          <FormInput
            label="End Date"
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange("endDate", e.target.value)}
            className="text-xs"
          />
          <div className="flex gap-1 items-end">
            <Button size="small" onClick={handleApply} className="text-xs py-1 px-2">Apply</Button>
            <Button size="small" variant="outline" onClick={handleReset} className="text-xs py-1 px-2">Reset</Button>
          </div>
        </div>
      </Card>

      {(reportState.error || dashboardState.error) && (
        <Card className="p-4 border-red-200" borderColor="red">
          <p className="text-red-600 text-xs">
            {getErrorMessage(reportState.error) || getErrorMessage(dashboardState.error)}
          </p>
        </Card>
      )}

      <Card className="print:break-inside-avoid rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <button
          onClick={() => setIsTopDataExpanded(!isTopDataExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Top Data
            </h2>
            <span className="text-xs text-gray-500">
              {isTopDataExpanded ? "Hide" : "Show"} key metrics and top performers
            </span>
          </div>
          <div className="text-gray-500">
            {isTopDataExpanded ? (
              <MdExpandLess size={24} />
            ) : (
              <MdExpandMore size={24} />
            )}
          </div>
        </button>

        {isTopDataExpanded && (
          <div className="border-t border-slate-200 p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="rounded-lg border border-neutral-200 bg-white dark:bg-neutral-900/30 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-600 dark:text-neutral-400 mb-1">
                  Orders
                </p>
                <p className="text-base font-extrabold text-neutral-900 dark:text-neutral-100 tabular-nums leading-tight">
                  {topSummary.totalOrders || 0}
                </p>
              </div>
              <div className="rounded-lg border border-neutral-200 bg-white dark:bg-neutral-900/30 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-600 dark:text-neutral-400 mb-1">
                  Sold
                </p>
                <p className="text-base font-extrabold text-blue-600 dark:text-blue-400 tabular-nums leading-tight">
                  {formatCurrency(topSummary.totalSoldAmount)}
                </p>
              </div>
              <div className="rounded-lg border border-neutral-200 bg-white dark:bg-neutral-900/30 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-600 dark:text-neutral-400 mb-1">
                  Net Sales
                </p>
                <p className="text-base font-extrabold text-blue-600 dark:text-blue-400 tabular-nums leading-tight">
                  {formatCurrency(topSummary.totalNetSales)}
                </p>
              </div>
              <div className="rounded-lg border border-neutral-200 bg-white dark:bg-neutral-900/30 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-600 dark:text-neutral-400 mb-1">
                  Discount
                </p>
                <p className="text-base font-extrabold text-blue-600 dark:text-blue-400 tabular-nums leading-tight">
                  {formatCurrency(topSummary.totalDiscount)}
                </p>
              </div>
              <div className="rounded-lg border border-neutral-200 bg-white dark:bg-neutral-900/30 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-600 dark:text-neutral-400 mb-1">
                  Adjustment
                </p>
                <p className="text-base font-extrabold text-blue-600 dark:text-blue-400 tabular-nums leading-tight">
                  {formatCurrency(topSummary.totalAdjustment)}
                </p>
              </div>
              <div className="rounded-lg border border-neutral-200 bg-white dark:bg-neutral-900/30 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-600 dark:text-neutral-400 mb-1">
                  Return
                </p>
                <p className="text-base font-extrabold text-blue-600 dark:text-blue-400 tabular-nums leading-tight">
                  {formatCurrency(topSummary.totalRefund)}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                Top Performers
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 print:grid-cols-1">
                {topSections.map((section) => renderTopTable(section.title, section.items, section.key))}
              </div>
            </div>
          </div>
        )}
      </Card>

      {detailEntityRows.length > 0 && (
        <Card title="Entity Breakdown" className="print:break-inside-avoid">
          <Table
            columns={[
              { key: "_id", label: "Entity" },
              { key: "totalOrders", label: "Orders", align: "right" },
              { key: "totalNetSales", label: "Net Sales", align: "right", render: (value) => renderAmount(value) },
            ]}
            data={detailEntityRows}
            striped
            hover
            size="sm"
            className={compactTableClass}
            emptyMessage="No entity breakdown"
          />
        </Card>
      )}

      <Card title="Report Data" className="print:break-inside-avoid" subtitle={`Type: ${appliedFilters.reportType}`}>
        <Table
          columns={primaryColumns}
          data={normalizedReportRows}
          striped
          hover
          size="sm"
          className={compactTableClass}
          loading={reportState.isFetching}
          emptyMessage="No records found"
        />

        <div className="mt-4 flex items-center justify-between no-print">
          <p className="text-xs text-gray-600">
            Skip: {appliedFilters.skip} | Limit: {appliedFilters.limit} | Rows: {reportRows.length}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="small"
              onClick={() => handlePageChange("prev")}
              disabled={appliedFilters.skip === 0 || reportState.isFetching}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="small"
              onClick={() => handlePageChange("next")}
              disabled={!canGoNext || reportState.isFetching}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
