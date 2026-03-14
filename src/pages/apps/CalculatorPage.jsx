import { useMemo, useState } from "react";
import { Calculator, RotateCcw } from "lucide-react";

const buttons = [
  "7",
  "8",
  "9",
  "/",
  "4",
  "5",
  "6",
  "*",
  "1",
  "2",
  "3",
  "-",
  "0",
  ".",
  "=",
  "+",
];

const evaluateExpression = (exp) => {
  const safe = exp.replace(/[^0-9+\-*/.() ]/g, "");
  if (!safe.trim()) return "";

  try {
    const result = Function(`"use strict"; return (${safe})`)();
    return Number.isFinite(result) ? String(result) : "Error";
  } catch {
    return "Error";
  }
};

export default function CalculatorPage() {
  const [expression, setExpression] = useState("");

  const preview = useMemo(() => {
    if (!expression) return "";
    return evaluateExpression(expression);
  }, [expression]);

  const onPress = (value) => {
    if (value === "=") {
      setExpression((prev) => evaluateExpression(prev));
      return;
    }

    setExpression((prev) => `${prev}${value}`);
  };

  const onClear = () => setExpression("");
  const onBackspace = () => setExpression((prev) => prev.slice(0, -1));

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gray-100 p-4 md:p-6">
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">Calculator</h1>
          <p className="mt-1 text-sm text-gray-500">Quick calculations for day-to-day operations.</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Expression</p>
            <p className="mt-1 min-h-8 break-all text-2xl font-semibold text-gray-900">
              {expression || "0"}
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Preview: <span className="font-semibold">{preview || "-"}</span>
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <button
              type="button"
              onClick={onClear}
              className="flex items-center justify-center gap-1 rounded-md border border-gray-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
            >
              <RotateCcw size={14} /> Clear
            </button>
            <button
              type="button"
              onClick={onBackspace}
              className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
            >
              Backspace
            </button>
            <button
              type="button"
              onClick={() => setExpression((prev) => `${prev}(`)}
              className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
            >
              (
            </button>
            <button
              type="button"
              onClick={() => setExpression((prev) => `${prev})`)}
              className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
            >
              )
            </button>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {buttons.map((btn) => (
              <button
                key={btn}
                type="button"
                onClick={() => onPress(btn)}
                className={`rounded-md px-4 py-3 text-sm font-semibold transition ${
                  btn === "="
                    ? "bg-primary-600 text-white hover:bg-primary-700"
                    : /[+\-*/]/.test(btn)
                    ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                    : "bg-gray-50 text-gray-800 hover:bg-gray-100"
                }`}
              >
                {btn}
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600">
            <Calculator size={14} />
            Use only basic math operators: + - * / and parentheses.
          </div>
        </div>
      </div>
    </div>
  );
}
