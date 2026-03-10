import React from "react";

/**
 * UniversalSummaryPanel
 * Professional KPI Cards for all request pages
 * 
 * Props:
 * - totals: object where keys are labels and values are numbers/strings
 * Example:
 *   totals = {
 *     "Total Products": 10,
 *     "Total Order Quantity": 50
 *   }
 */
const UniversalSummaryPanel = ({ totals }) => {
  if (!totals || typeof totals !== "object") return null;

  const entries = Object.entries(totals);
  
  // Color mapping for different metric types
  const getColorClass = (label) => {
    const lower = label.toLowerCase();
    if (lower.includes('product')) return 'from-green-50 to-green-100 border-green-200 text-green-700';
    if (lower.includes('quantity') || lower.includes('qty')) return 'from-blue-50 to-blue-100 border-blue-200 text-blue-700';
    if (lower.includes('damage') || lower.includes('deny')) return 'from-red-50 to-red-100 border-red-200 text-red-700';
    if (lower.includes('stock') || lower.includes('received')) return 'from-orange-50 to-orange-100 border-orange-200 text-orange-700';
    if (lower.includes('request') || lower.includes('order')) return 'from-purple-50 to-purple-100 border-purple-200 text-purple-700';
    return 'from-slate-50 to-slate-100 border-slate-200 text-slate-700';
  };

  const getIconEmoji = (label) => {
    const lower = label.toLowerCase();
    if (lower.includes('product')) return '📦';
    if (lower.includes('quantity') || lower.includes('qty')) return '📊';
    if (lower.includes('damage') || lower.includes('deny')) return '⚠️';
    if (lower.includes('stock') || lower.includes('received')) return '📥';
    if (lower.includes('request') || lower.includes('order')) return '📋';
    return '💼';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 mb-8">
      {entries.map(([label, value], idx) => {
        const colorClass = getColorClass(label);
        const emoji = getIconEmoji(label);
        
        return (
          <div
            key={idx}
            className={`bg-gradient-to-br ${colorClass} rounded-xl shadow-md border p-4 hover:shadow-lg transition-all duration-300 group`}
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{label}</p>
              <div className="px-2 py-1 bg-white/50 rounded-md text-lg">{emoji}</div>
            </div>
            <p className={`text-2xl lg:text-3xl font-bold ${colorClass.split(' ')[2]} group-hover:opacity-80 transition-opacity`}>
              {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default UniversalSummaryPanel;