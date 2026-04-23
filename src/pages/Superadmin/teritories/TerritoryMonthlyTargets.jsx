import React, { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { MdArrowBack } from "react-icons/md";
import { ChevronRight } from "lucide-react";
import Card from "../../../component/common/Card";
import Button from "../../../component/common/Button";
import toast from "../../../utils/toast";

const monthOptions = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const getCellValueByAliases = (row, aliases) => {
  const entries = Object.entries(row || {});

  for (const alias of aliases) {
    const normalizedAlias = String(alias).replace(/[^a-z0-9]/gi, "").toLowerCase();
    const match = entries.find(([key]) => {
      const normalizedKey = String(key).replace(/[^a-z0-9]/gi, "").toLowerCase();
      return normalizedKey === normalizedAlias;
    });
    if (match) return match[1];
  }

  return "";
};

const buildMockProducts = (territoryCode) => {
  const packSizes = ["1x10", "3x10", "5x10", "10x10", "1x6"];

  return Array.from({ length: 40 }, (_, i) => {
    const idx = i + 1;
    return {
      productId: `P-${territoryCode}-${String(idx).padStart(3, "0")}`,
      productName: `Product ${idx}`,
      packSize: packSizes[i % packSizes.length],
      targetCount: 100 + idx * 10,
    };
  });
};

const getDefaultPackSize = (index) => {
  const packSizes = ["1x10", "3x10", "5x10", "10x10", "1x6"];
  return packSizes[index % packSizes.length];
};

const mockTerritories = [
  { id: "T-001", name: "Mirpur-1" },
  { id: "T-002", name: "Mirpur-2" },
  { id: "T-003", name: "Uttara-5" },
  { id: "T-004", name: "Banasree" },
  { id: "T-005", name: "Jatrabari" },
  { id: "T-006", name: "Shantinagar" },
  { id: "T-007", name: "Comilla Sadar" },
  { id: "T-008", name: "Chandpur Town" },
].map((t) => ({
  ...t,
  products: buildMockProducts(t.id.replace("T-", "")),
}));

const TerritoryMonthlyTargets = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());

  const [territories, setTerritories] = useState(mockTerritories);
  const [selectedTerritoryId, setSelectedTerritoryId] = useState("");
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [updateMode, setUpdateMode] = useState("manual");

  const [manualProducts, setManualProducts] = useState([]);
  const [excelProducts, setExcelProducts] = useState([]);
  const [excelFileName, setExcelFileName] = useState("");

  const selectedTerritory = useMemo(
    () => territories.find((t) => t.id === selectedTerritoryId) || null,
    [territories, selectedTerritoryId]
  );

  const openUpdate = (territoryId) => {
    const territory = territories.find((t) => t.id === territoryId);
    if (!territory) return;

    setSelectedTerritoryId(territoryId);
    setManualProducts(
      territory.products.map((p) => ({
        productId: p.productId,
        productName: p.productName,
        packSize: p.packSize || "",
        targetCount: p.targetCount,
      }))
    );
    setExcelProducts([]);
    setExcelFileName("");
    setUpdateMode("manual");
    setIsUpdateOpen(true);
  };

  const closeUpdate = () => {
    setIsUpdateOpen(false);
    setSelectedTerritoryId("");
    setManualProducts([]);
    setExcelProducts([]);
    setExcelFileName("");
  };

  const updateManualTarget = (productId, value) => {
    const nextValue = Number(value);
    setManualProducts((prev) =>
      prev.map((p) =>
        p.productId === productId
          ? { ...p, targetCount: Number.isNaN(nextValue) ? 0 : Math.max(0, nextValue) }
          : p
      )
    );
  };

  const parseExcelFile = async (file) => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(firstSheet, { defval: "" });

    const parsed = rows
      .map((row) => {
        // Ignore any extra columns (e.g., productName, packSize) and only consume these two.
        const productId = String(
          getCellValueByAliases(row, ["productId", "product_id", "Product ID"])
        ).trim();
        const targetCountRaw = getCellValueByAliases(row, [
          "targetCount",
          "target_count",
          "Target Count",
        ]);
        const targetCount = Number(targetCountRaw);

        if (!productId || Number.isNaN(targetCount)) return null;

        return {
          productId,
          targetCount: Math.max(0, targetCount),
        };
      })
      .filter(Boolean);

    return parsed;
  };

  const downloadExcelTemplate = () => {
    const sourceTerritory = selectedTerritory || territories[0];

    const templateRows = (sourceTerritory?.products || []).map((product, index) => ({
      productId: product.productId || "",
      productName: product.productName || "",
      packSize: product.packSize || getDefaultPackSize(index),
      targetCount: "",
    }));

    if (!templateRows.length) {
      templateRows.push({
        productId: "",
        productName: "",
        packSize: "",
        targetCount: "",
      });
    }

    const worksheet = XLSX.utils.json_to_sheet(templateRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "TargetsTemplate");
    XLSX.writeFile(workbook, "territory-targets-template.xlsx");
  };

  const handleExcelChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const parsedProducts = await parseExcelFile(file);
      if (!parsedProducts.length) {
        toast.error(
          "No valid rows found. Keep productId and targetCount columns (extra columns are allowed)."
        );
        return;
      }

      setExcelProducts(parsedProducts);
      setExcelFileName(file.name);
      toast.success(`Loaded ${parsedProducts.length} rows from Excel`);
    } catch (error) {
      toast.error("Failed to parse Excel file");
    }
  };

  const payload = useMemo(() => {
    if (!selectedTerritoryId) return null;

    const products = updateMode === "manual" ? manualProducts : excelProducts;

    return {
      territoryId: selectedTerritoryId,
      month,
      year,
      products: products.map((p) => ({
        productId: p.productId,
        targetCount: Number(p.targetCount) || 0,
      })),
    };
  }, [selectedTerritoryId, month, year, updateMode, manualProducts, excelProducts]);

  const submitUpdate = () => {
    if (!payload) return;

    if (!payload.products.length) {
      toast.error("No products to submit");
      return;
    }

    // Mock update: update UI state only.
    setTerritories((prev) =>
      prev.map((territory) => {
        if (territory.id !== payload.territoryId) return territory;

        const updatedMap = payload.products.reduce((acc, item) => {
          acc[item.productId] = item.targetCount;
          return acc;
        }, {});

        return {
          ...territory,
          products: territory.products.map((p) => ({
            ...p,
            targetCount:
              Object.prototype.hasOwnProperty.call(updatedMap, p.productId)
                ? updatedMap[p.productId]
                : p.targetCount,
          })),
        };
      })
    );

    // This payload is exactly what backend expects.
    console.log("Monthly Target Payload:", payload);
    toast.success("Targets updated (mock) and payload logged in console");
    closeUpdate();
  };

  return (
    <div className="min-h-screen p-2 sm:p-4 space-y-3">
      <Card className="mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="small"
              onClick={() => window.history.back()}
              className="text-[11px] h-7 px-2"
            >
              <MdArrowBack className="inline mr-1" />
              Back
            </Button>
            <div className="bg-white text-gray-500 flex items-center px-2 py-1 sm:h-9">
              <h2 className="flex flex-wrap items-center text-[10px] md:text-[11px] font-semibold text-gray-800 gap-1 leading-tight">
                <span>EMS</span>
                <ChevronRight size={11} className="text-gray-400" />
                <span>SUPERADMIN</span>
                <ChevronRight size={11} className="text-gray-400" />
                <span className="text-gray-900 font-bold">TERRITORY MONTHLY TARGETS</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="small"
              className="text-[11px] h-8 px-3"
              onClick={downloadExcelTemplate}
            >
              Download Excel Format
            </Button>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-[11px]"
            >
              {monthOptions.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value) || today.getFullYear())}
              className="w-20 border border-gray-300 rounded px-2 py-1 text-[11px]"
            />
          </div>
        </div>
      </Card>

      <Card
        title="Territory Monthly Product Targets"
        subtitle="Each territory contains 40 products with monthly target counts"
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[11px]">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="text-center py-1.5 px-2">SL</th>
                <th className="text-left py-1.5 px-2">Territory</th>
                <th className="text-center py-1.5 px-2">Products</th>
                <th className="text-right py-1.5 px-2">Total Monthly Target</th>
                <th className="text-center py-1.5 px-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {territories.map((territory, idx) => {
                const totalTarget = territory.products.reduce(
                  (sum, p) => sum + (Number(p.targetCount) || 0),
                  0
                );

                return (
                  <tr key={territory.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="text-center py-1.5 px-2">{idx + 1}</td>
                    <td className="py-1.5 px-2 font-medium">{territory.name}</td>
                    <td className="text-center py-1.5 px-2">40</td>
                    <td className="text-right py-1.5 px-2">{totalTarget.toLocaleString()}</td>
                    <td className="text-center py-1.5 px-2">
                      <Button
                        variant="primary"
                        size="small"
                        className="text-[10px] px-2 py-1"
                        onClick={() => openUpdate(territory.id)}
                      >
                        Update
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {isUpdateOpen && selectedTerritory && (
        <Card
          title={`Update Targets - ${selectedTerritory.name}`}
          subtitle="Choose Manual Update or Excel Upload"
        >
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <button
              onClick={() => setUpdateMode("manual")}
              className={`px-3 py-1 rounded text-[11px] border ${
                updateMode === "manual"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              Manual Update
            </button>
            <button
              onClick={() => setUpdateMode("excel")}
              className={`px-3 py-1 rounded text-[11px] border ${
                updateMode === "excel"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              Upload Excel
            </button>
          </div>

          {updateMode === "manual" ? (
            <div className="overflow-x-auto border rounded-md">
              <table className="w-full border-collapse text-[11px]">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="text-left py-1.5 px-2">Product ID</th>
                    <th className="text-left py-1.5 px-2">Product Name</th>
                    <th className="text-left py-1.5 px-2">Pack Size</th>
                    <th className="text-right py-1.5 px-2">Target Count</th>
                  </tr>
                </thead>
                <tbody>
                  {manualProducts.map((product) => (
                    <tr key={product.productId} className="border-b border-gray-100">
                      <td className="py-1.5 px-2">{product.productId}</td>
                      <td className="py-1.5 px-2">{product.productName}</td>
                      <td className="py-1.5 px-2">{product.packSize || "-"}</td>
                      <td className="py-1.5 px-2 text-right">
                        <input
                          type="number"
                          min={0}
                          value={product.targetCount}
                          onChange={(e) => updateManualTarget(product.productId, e.target.value)}
                          className="w-24 border border-gray-300 rounded px-2 py-1 text-[11px] text-right"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="space-y-2">
              <div>
                <Button
                  variant="outline"
                  size="small"
                  className="text-[11px]"
                  onClick={downloadExcelTemplate}
                >
                  Download Excel Format
                </Button>
              </div>
              <div className="text-[11px] text-gray-600">
                Upload file with <strong>productId</strong> and <strong>targetCount</strong>. Extra columns
                like <strong>productName</strong> and <strong>packSize</strong> are allowed and ignored.
              </div>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleExcelChange}
                className="text-[11px]"
              />
              {excelFileName && (
                <p className="text-[11px] text-green-700">Loaded file: {excelFileName}</p>
              )}
              {!!excelProducts.length && (
                <p className="text-[11px] text-blue-700">Parsed rows: {excelProducts.length}</p>
              )}
            </div>
          )}

          <div className="mt-3 p-2 bg-gray-50 border rounded text-[11px]">
            <div className="font-semibold mb-1">Payload Preview</div>
            <pre className="whitespace-pre-wrap break-all">
{JSON.stringify(payload, null, 2)}
            </pre>
          </div>

          <div className="mt-3 flex gap-2">
            <Button variant="outline" size="small" className="text-[11px]" onClick={closeUpdate}>
              Cancel
            </Button>
            <Button variant="primary" size="small" className="text-[11px]" onClick={submitUpdate}>
              Submit Update
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TerritoryMonthlyTargets;
