import { useEffect, useMemo, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import Card from "../../component/common/Card";
import Table from "../../component/common/Table";
import Button from "../../component/common/Button";
import FormSelect from "../../component/common/FormSelect";
import { useLazyGetDeliveryReportQuery } from "../../redux/features/reports/deliveryReportApi";
import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

const EMPTY_TEXT = "--";

const formatText = (value, fallback = EMPTY_TEXT) => {
  if (value === undefined || value === null) return fallback;
  const text = String(value).trim();
  return text.length ? text : fallback;
};

const formatDate = (value) => {
  if (!value) return EMPTY_TEXT;
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return formatText(value);
  return parsedDate.toLocaleDateString("en-GB");
};

const makeNodeValue = (id, prefix, index) => {
  if (id === undefined || id === null || id === "") {
    return `__${prefix}_null_${index}`;
  }

  return String(id);
};

export default function DeliveryReport() {
  const location = useLocation();
  const [fetchReport, reportState] = useLazyGetDeliveryReportQuery();
  const [filters, setFilters] = useState({
    zone: "",
    area: "",
    territory: "",
    marketPoint: "",
  });
  const searchTerm = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("q")?.trim() || "";
  }, [location.search]);

  useEffect(() => {
    fetchReport({ entityType: "all", orderStatus: "delivered" });
  }, [fetchReport]);

  const zones = useMemo(() => {
    const source = reportState?.data?.data?.zones;
    if (!Array.isArray(source)) return [];

    return source.map((zone, index) => ({
      ...zone,
      __value: makeNodeValue(zone?.zoneId, "zone", index),
    }));
  }, [reportState?.data]);

  const selectedZone = useMemo(
    () => zones.find((zone) => zone.__value === filters.zone),
    [zones, filters.zone]
  );

  const areas = useMemo(() => {
    if (!selectedZone || !Array.isArray(selectedZone.areas)) return [];

    return selectedZone.areas.map((area, index) => ({
      ...area,
      __value: makeNodeValue(area?.areaId, "area", index),
    }));
  }, [selectedZone]);

  const selectedArea = useMemo(
    () => areas.find((area) => area.__value === filters.area),
    [areas, filters.area]
  );

  const territories = useMemo(() => {
    if (!selectedArea || !Array.isArray(selectedArea.territories)) return [];

    return selectedArea.territories.map((territory, index) => ({
      ...territory,
      __value: makeNodeValue(territory?.territoryId, "territory", index),
    }));
  }, [selectedArea]);

  const selectedTerritory = useMemo(
    () => territories.find((territory) => territory.__value === filters.territory),
    [territories, filters.territory]
  );

  const marketPoints = useMemo(() => {
    if (!selectedTerritory || !Array.isArray(selectedTerritory.marketPoints)) return [];

    return selectedTerritory.marketPoints.map((marketPoint, index) => ({
      ...marketPoint,
      __value: makeNodeValue(marketPoint?.marketPointId, "marketPoint", index),
    }));
  }, [selectedTerritory]);

  const selectedMarketPoint = useMemo(
    () => marketPoints.find((marketPoint) => marketPoint.__value === filters.marketPoint),
    [marketPoints, filters.marketPoint]
  );

  const filteredRows = useMemo(() => {
    const rows = [];

    const selectedZones = selectedZone ? [selectedZone] : zones;

    selectedZones.forEach((zone) => {
      const zoneAreas = Array.isArray(zone?.areas) ? zone.areas : [];
      const selectedAreas = selectedArea ? [selectedArea] : zoneAreas;

      selectedAreas.forEach((area) => {
        const areaTerritories = Array.isArray(area?.territories) ? area.territories : [];
        const selectedTerritories = selectedTerritory ? [selectedTerritory] : areaTerritories;

        selectedTerritories.forEach((territory) => {
          const territoryMarketPoints = Array.isArray(territory?.marketPoints) ? territory.marketPoints : [];
          const selectedMarketPoints = selectedMarketPoint ? [selectedMarketPoint] : territoryMarketPoints;

          selectedMarketPoints.forEach((marketPoint) => {
            const customers = Array.isArray(marketPoint?.customers) ? marketPoint.customers : [];

            customers.forEach((customer) => {
              const products = Array.isArray(customer?.products) ? customer.products : [];

              products.forEach((product) => {
                const batches = Array.isArray(product?.batches) && product.batches.length
                  ? product.batches
                  : [{
                      batchNo: null,
                      expireDate: null,
                      orderQuantity: product?.totalOrderQuantity || 0,
                      soldQty: product?.totalSoldQty || 0,
                      returnedQuantity: product?.totalReturnedQuantity || 0,
                    }];

                batches.forEach((batch) => {
                  rows.push({
                    productCode: product?.shortCode,
                    productName: product?.productName,
                    packSize: product?.packSize,
                    batch: `${formatText(batch?.batchNo)} / Exp: ${formatDate(batch?.expireDate)}`,
                    orderQuantity: Number(batch?.orderQuantity ?? 0),
                    soldQuantity: Number(batch?.soldQty ?? 0),
                    returnedQuantity: Number(batch?.returnedQuantity ?? 0),
                  });
                });
              });
            });
          });
        });
      });
    });

    return rows;
  }, [zones, selectedZone, selectedArea, selectedTerritory, selectedMarketPoint]);

  const summary = useMemo(() => {
    return filteredRows.reduce(
      (acc, row) => {
        acc.totalOrderQuantity += Number(row.orderQuantity || 0);
        acc.totalSoldQuantity += Number(row.soldQuantity || 0);
        acc.totalReturnedQuantity += Number(row.returnedQuantity || 0);
        return acc;
      },
      { totalOrderQuantity: 0, totalSoldQuantity: 0, totalReturnedQuantity: 0 }
    );
  }, [filteredRows]);

  const highlightText = (value, fallback = EMPTY_TEXT) => {
    const text = formatText(value, fallback);
    if (!searchTerm) return text;

    const escapedSearch = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const matcher = new RegExp(`(${escapedSearch})`, "ig");

    if (!matcher.test(text)) return text;

    return text.split(matcher).map((part, index) => {
      if (!part) return null;
      if (part.toLowerCase() === searchTerm.toLowerCase()) {
        return (
          <mark key={`${part}-${index}`} className="rounded px-1 bg-yellow-200 text-yellow-950">
            {part}
          </mark>
        );
      }

      return <span key={`${part}-${index}`}>{part}</span>;
    });
  };

  const tableColumns = useMemo(
    () => [
      {
        key: "productCode",
        label: "Product Code",
        className: "min-w-[120px]",
        render: (value) => highlightText(value),
      },
      {
        key: "productName",
        label: "Product Name",
        className: "min-w-[260px]",
        render: (value) => highlightText(value),
      },
      {
        key: "packSize",
        label: "Pack Size",
        className: "min-w-[100px]",
        render: (value) => highlightText(value),
      },
      {
        key: "batch",
        label: "Batches",
        className: "min-w-[170px]",
        render: (value) => highlightText(value),
      },
      {
        key: "orderQuantity",
        label: "Order Qty",
        align: "right",
        className: "min-w-[90px]",
      },
      {
        key: "soldQuantity",
        label: "Sold Qty",
        align: "right",
        className: "min-w-[90px]",
      },
      {
        key: "returnedQuantity",
        label: "Returned Qty",
        align: "right",
        className: "min-w-[100px]",
      },
    ],
    []
  );

  const zoneOptions = useMemo(
    () => zones.map((zone) => ({ value: zone.__value, label: formatText(zone.zoneName, "Unmapped Zone") })),
    [zones]
  );

  const areaOptions = useMemo(
    () => areas.map((area) => ({ value: area.__value, label: formatText(area.areaName, "Unmapped Area") })),
    [areas]
  );

  const territoryOptions = useMemo(
    () => territories.map((territory) => ({ value: territory.__value, label: formatText(territory.territoryName, "Unmapped Territory") })),
    [territories]
  );

  const marketPointOptions = useMemo(
    () => marketPoints.map((marketPoint) => ({ value: marketPoint.__value, label: formatText(marketPoint.marketPointName, "Unmapped Market Point") })),
    [marketPoints]
  );

  const handleZoneChange = (value) => {
    setFilters({ zone: value, area: "", territory: "", marketPoint: "" });
  };

  const handleAreaChange = (value) => {
    setFilters((prev) => ({ ...prev, area: value, territory: "", marketPoint: "" }));
  };

  const handleTerritoryChange = (value) => {
    setFilters((prev) => ({ ...prev, territory: value, marketPoint: "" }));
  };

  const handleMarketPointChange = (value) => {
    setFilters((prev) => ({ ...prev, marketPoint: value }));
  };

  const getErrorMessage = () => {
    const error = reportState.error;
    if (!error) return "";
    return error?.data?.message || error?.data?.error || "Failed to load delivery report.";
  };

  const buildFilterSummaryText = () => {
    const parts = [
      `Zone: ${formatText(selectedZone?.zoneName, "All")}`,
      `Area: ${formatText(selectedArea?.areaName, "All")}`,
      `Territory: ${formatText(selectedTerritory?.territoryName, "All")}`,
      `Market Point: ${formatText(selectedMarketPoint?.marketPointName, "All")}`,
    ];

    return parts.join(" | ");
  };

  const renderHighlightedSummary = (text) => {
    if (!searchTerm) return text;

    const escapedSearch = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const matcher = new RegExp(`(${escapedSearch})`, "ig");

    if (!matcher.test(text)) return text;

    return text.split(matcher).map((part, index) => {
      if (!part) return null;
      if (part.toLowerCase() === searchTerm.toLowerCase()) {
        return (
          <mark key={`${part}-${index}`} className="rounded px-1 bg-yellow-200 text-yellow-950">
            {part}
          </mark>
        );
      }

      return <span key={`${part}-${index}`}>{part}</span>;
    });
  };

  const buildPrintHtml = () => {
    const todayText = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const safeText = (value) =>
      String(value ?? EMPTY_TEXT)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");

    const rowsHtml = filteredRows
      .map(
        (row, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${safeText(row.productCode)}</td>
            <td>${safeText(row.productName)}</td>
            <td>${safeText(row.packSize)}</td>
            <td>${safeText(row.batch)}</td>
            <td style="text-align:right">${Number(row.orderQuantity || 0).toLocaleString()}</td>
            <td style="text-align:right">${Number(row.soldQuantity || 0).toLocaleString()}</td>
            <td style="text-align:right">${Number(row.returnedQuantity || 0).toLocaleString()}</td>
          </tr>
        `
      )
      .join("");

    return `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Delivery Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 18px; color: #111827; }
            .meta { font-size: 12px; margin-bottom: 12px; color: #4b5563; }
            .header-wrap { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:2px solid #000; padding-bottom:10px; }
            .header-right { text-align:right; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
            .header-right h2 { margin:0; font-size:20px; font-weight:bold; color:#1a1a1a; }
            .header-right p { margin:2px 0; font-size:10px; color:#555; }
            .report-title { font-size:16px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #d1d5db; padding: 7px 8px; font-size: 12px; vertical-align: top; }
            th { background: #f3f4f6; text-align: left; }
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

          <div class="report-title">Delivery Report</div>
          <div class="meta"><strong>Filters:</strong> ${safeText(buildFilterSummaryText())}</div>
          <div class="meta">Printed on: ${todayText}</div>
          <div class="meta">Records: ${filteredRows.length} | Order Qty: ${summary.totalOrderQuantity.toLocaleString()} | Sold Qty: ${summary.totalSoldQuantity.toLocaleString()} | Returned Qty: ${summary.totalReturnedQuantity.toLocaleString()}</div>

          <table>
            <thead>
              <tr>
                <th>SL</th>
                <th>Product Code</th>
                <th>Product Name</th>
                <th>Pack Size</th>
                <th>Batches</th>
                <th>Order Qty</th>
                <th>Sold Qty</th>
                <th>Returned Qty</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="5">Total</td>
                <td style="text-align:right">${summary.totalOrderQuantity.toLocaleString()}</td>
                <td style="text-align:right">${summary.totalSoldQuantity.toLocaleString()}</td>
                <td style="text-align:right">${summary.totalReturnedQuantity.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </body>
      </html>
    `;
  };

  const handleExcelExport = () => {
    if (!filteredRows.length) {
      toast.warning("No data to export");
      return;
    }

    const excelRows = filteredRows.map((row, index) => ({
      "SL": index + 1,
      "Product Code": formatText(row.productCode),
      "Product Name": formatText(row.productName),
      "Pack Size": formatText(row.packSize),
      "Batches": formatText(row.batch),
      "Order Qty": Number(row.orderQuantity || 0),
      "Sold Qty": Number(row.soldQuantity || 0),
      "Returned Qty": Number(row.returnedQuantity || 0),
    }));

    excelRows.push({
      "SL": "",
      "Product Code": "",
      "Product Name": "",
      "Pack Size": "",
      "Batches": "Total",
      "Order Qty": summary.totalOrderQuantity,
      "Sold Qty": summary.totalSoldQuantity,
      "Returned Qty": summary.totalReturnedQuantity,
    });

    const worksheet = XLSX.utils.json_to_sheet(excelRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Delivery Report");
    XLSX.writeFile(workbook, `delivery-report-${new Date().toISOString().split("T")[0]}.xlsx`);
    toast.success("Report exported to Excel");
  };

  const handlePdfExport = () => {
    if (!filteredRows.length) {
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
            filename: `delivery-report-${new Date().toISOString().split("T")[0]}.pdf`,
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
    } catch (error) {
      console.error(error);
      if (document.body.contains(tempFrame)) {
        document.body.removeChild(tempFrame);
      }
    }
  };

  const handlePrint = () => {
    if (!filteredRows.length) {
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
      } catch (error) {
        console.error(error);
      }
    };

    printWindow.onload = trigger;
    setTimeout(trigger, 500);
  };

  const compactTableClass = "[&_th]:px-2 [&_th]:py-1.5 [&_td]:px-2 [&_td]:py-1.5";

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
        <h1 className="text-2xl font-bold">Delivery Report</h1>
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
                <span className="text-gray-900 font-bold">DELIVERY REPORT</span>
              </h2>
            </div>
          </div>

          {filteredRows.length > 0 && (
            <div className="flex gap-2">
              <Button variant="outline" size="small" onClick={handlePdfExport}>
                Download PDF
              </Button>
              <Button variant="outline" size="small" onClick={handleExcelExport}>
                Download Excel
              </Button>
              <Button variant="outline" size="small" onClick={handlePrint}>
                Print
              </Button>
            </div>
          )}
        </div>
      </Card>

      <Card className="no-print">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <FormSelect
            label="Zone"
            value={filters.zone}
            onChange={(event) => handleZoneChange(event.target.value)}
            options={zoneOptions}
            placeholder="All Zones"
          />

          {filters.zone && (
            <FormSelect
              label="Area"
              value={filters.area}
              onChange={(event) => handleAreaChange(event.target.value)}
              options={areaOptions}
              placeholder="All Areas"
            />
          )}

          {filters.area && (
            <FormSelect
              label="Territory"
              value={filters.territory}
              onChange={(event) => handleTerritoryChange(event.target.value)}
              options={territoryOptions}
              placeholder="All Territories"
            />
          )}

          {filters.territory && (
            <FormSelect
              label="Market Point"
              value={filters.marketPoint}
              onChange={(event) => handleMarketPointChange(event.target.value)}
              options={marketPointOptions}
              placeholder="All Market Points"
            />
          )}
        </div>
      </Card>

      <Card>
        {searchTerm && (
          <div className="mb-3 rounded border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm text-yellow-900">
            Highlighting matches for: <span className="font-semibold">{searchTerm}</span>
          </div>
        )}

        <div className="mb-3 text-sm text-gray-600">
          {renderHighlightedSummary(`Zone: ${formatText(selectedZone?.zoneName, "All")} | Area: ${formatText(selectedArea?.areaName, "All")} | Territory: ${formatText(selectedTerritory?.territoryName, "All")} | Market Point: ${formatText(selectedMarketPoint?.marketPointName, "All")}`)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
          <div className="p-2 rounded border border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500">Rows</p>
            <p className="text-sm font-semibold text-gray-900">{filteredRows.length}</p>
          </div>
          <div className="p-2 rounded border border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500">Total Order Qty</p>
            <p className="text-sm font-semibold text-gray-900">{summary.totalOrderQuantity.toLocaleString()}</p>
          </div>
          <div className="p-2 rounded border border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500">Total Sold Qty</p>
            <p className="text-sm font-semibold text-gray-900">{summary.totalSoldQuantity.toLocaleString()}</p>
          </div>
          <div className="p-2 rounded border border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500">Total Returned Qty</p>
            <p className="text-sm font-semibold text-gray-900">{summary.totalReturnedQuantity.toLocaleString()}</p>
          </div>
        </div>

        {reportState.error ? (
          <div className="text-sm text-red-600 px-2 py-6">{getErrorMessage()}</div>
        ) : (
          <Table
            columns={tableColumns}
            data={filteredRows}
            loading={reportState.isLoading || reportState.isFetching}
            emptyMessage="No delivery report rows found."
            className={compactTableClass}
            size="sm"
            striped={false}
          />
        )}
      </Card>
    </div>
  );
}
