import React from "react";

export default function HRStaticPage({ title, description }) {
  return (
    <div className="min-h-[70vh] rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <p className="mt-3 text-gray-600">{description}</p>
      <div className="mt-6 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500">
        Static placeholder page for HR module.
      </div>
    </div>
  );
}
