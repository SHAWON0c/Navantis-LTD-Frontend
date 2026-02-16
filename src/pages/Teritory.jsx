// import React from "react";

// import { User, Mail, Calendar } from "lucide-react";
// import { useGetAllTerritoriesWithManagersQuery } from "../redux/features/teritory/territoryApi";

// const TerritoryPage = () => {
//   const { data, isLoading, isError } = useGetAllTerritoriesWithManagersQuery();
//   const territories = data?.data || [];

//   if (isLoading) return <p className="p-6">Loading territories...</p>;
//   if (isError) return <p className="p-6 text-red-500">Failed to load territories</p>;

//   return (
//     <div className="p-6 max-w-6xl mx-auto space-y-6">
//       <h1 className="text-2xl font-bold mb-4">Territories</h1>

//       {territories.map((territory) => (
//         <div key={territory._id} className="bg-white rounded-2xl shadow p-6 space-y-4">
//           {/* Area & Managers */}
//           <div className="flex flex-col md:flex-row md:justify-between gap-4">
//             <div>
//               <p className="text-gray-500 text-sm">Area</p>
//               <p className="font-medium">{territory.area || "—"}</p>
//             </div>

//             {/* Area Manager */}
//             <div>
//               <p className="text-gray-500 text-sm flex items-center gap-1">
//                 <User className="w-4 h-4 text-blue-600" /> Area Manager
//               </p>
//               <p className="font-medium">{territory.areaManager?.name || "—"}</p>
//               <p className="text-sm flex items-center gap-1">
//                 <Mail className="w-4 h-4 text-gray-400" /> {territory.areaManager?.email || "—"}
//               </p>
//               <p className="text-sm">{territory.areaManager?.designation || "—"}</p>
//             </div>

//             {/* Zonal Manager */}
//             <div>
//               <p className="text-gray-500 text-sm flex items-center gap-1">
//                 <User className="w-4 h-4 text-green-600" /> Zonal Manager
//               </p>
//               <p className="font-medium">{territory.zonalManager?.name || "—"}</p>
//               <p className="text-sm flex items-center gap-1">
//                 <Mail className="w-4 h-4 text-gray-400" /> {territory.zonalManager?.email || "—"}
//               </p>
//               <p className="text-sm">{territory.zonalManager?.designation || "—"}</p>
//             </div>
//           </div>

//           {/* Market Points */}
//           <div>
//             <p className="text-gray-500 text-sm">Market Points</p>
//             <ul className="list-disc list-inside mt-1">
//               {territory.marketPoints.map((mp, i) => (
//                 <li key={i}>{mp}</li>
//               ))}
//             </ul>
//           </div>

//           {/* Targets */}
//           <div>
//             <p className="text-gray-500 text-sm">Targets for {territory.targetMonth}</p>
//             <table className="w-full mt-2 border border-gray-200 rounded-lg">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-3 py-2 text-left text-sm">Product</th>
//                   <th className="px-3 py-2 text-left text-sm">Quantity</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {territory.targets.map((t) => (
//                   <tr key={t._id} className="border-t border-gray-200">
//                     <td className="px-3 py-2">{t.productId?.productName || "—"}</td>
//                     <td className="px-3 py-2">{t.quantity}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Target Month */}
//           <div className="flex items-center gap-2 text-sm text-gray-500">
//             <Calendar className="w-4 h-4" /> Target Month: {territory.targetMonth || "—"}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default TerritoryPage;
