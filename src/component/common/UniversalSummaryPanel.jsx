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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 mt-4 mb-6">
      {entries.map(([label, value], idx) => {
        const colorClass = getColorClass(label);
        const emoji = getIconEmoji(label);
        
        return (
          <div
            key={idx}
            className={`bg-gradient-to-br ${colorClass} rounded-lg shadow-sm border p-3 hover:shadow-md transition-all duration-300 group`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-widest flex-1">{label}</p>
              <div className="px-1.5 py-0.5 bg-white/60 rounded text-base ml-1 flex-shrink-0">{emoji}</div>
            </div>
            <p className={`text-xl font-bold ${colorClass.split(' ')[2]} group-hover:opacity-80 transition-opacity`}>
              {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default UniversalSummaryPanel;