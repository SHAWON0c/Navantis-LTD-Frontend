// import React, { useState, useEffect } from "react";
// import { User, Save } from "lucide-react";
// import {
//   useGetAllAreasQuery,
//   useUpdateAreaMutation,
// } from "../redux/features/areas/areaApi";
// import { useGetAreaAndZonalManagersQuery } from "../redux/features/users/usersAPI";


// const AreaPage = () => {
//   const { data, isLoading, isError } = useGetAllAreasQuery();
//   const { data: managerData } = useGetAreaAndZonalManagersQuery();
//   const [updateArea, { isLoading: isUpdating }] = useUpdateAreaMutation();

//   const [selectedAreaId, setSelectedAreaId] = useState("");
//   const [selectedAreaManagerId, setSelectedAreaManagerId] = useState("");
//   const [selectedZonalManagerId, setSelectedZonalManagerId] = useState("");

//   const areas = data?.areas || [];
//   const selectedArea = areas.find((a) => a._id === selectedAreaId);

//   // 🔄 Update form when area changes
//   useEffect(() => {
//     if (!selectedArea) {
//       setSelectedAreaManagerId("");
//       setSelectedZonalManagerId("");
//       return;
//     }

//     setSelectedAreaManagerId(selectedArea.areaManager?.userId || "");
//     setSelectedZonalManagerId(selectedArea.zonalManager?.userId || "");
//   }, [selectedArea]);

//   if (isLoading) return <p className="p-6">Loading areas...</p>;
//   if (isError) return <p className="p-6 text-red-500">Failed to load areas</p>;

//   const handleUpdate = async () => {
//     if (!selectedAreaId) return;

//     await updateArea({
//       areaId: selectedAreaId,
//       data: {
//         areaManagerId: selectedAreaManagerId || null,
//         zonalManagerId: selectedZonalManagerId || null,
//       },
//     });
//   };

//   const areaManagers = managerData?.data?.areaManagers || [];
//   const zonalManagers = managerData?.data?.zonalManagers || [];

//   return (
//     <div className="p-6 max-w-4xl mx-auto space-y-6">
//       <h1 className="text-2xl font-bold">Area Management</h1>

//       {/* 🔽 Area Dropdown */}
//       <div>
//         <label className="text-sm text-gray-500">Select Area</label>
//         <select
//           value={selectedAreaId}
//           onChange={(e) => setSelectedAreaId(e.target.value)}
//           className="w-full mt-1 px-3 py-2 border rounded-lg"
//         >
//           <option value="">-- Select Area --</option>
//           {areas.map((area) => (
//             <option key={area._id} value={area._id}>
//               {area.areaName}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* 🧾 Area Details */}
//       {selectedArea && (
//         <div className="bg-white rounded-2xl shadow p-6 space-y-6">
//           <div>
//             <p className="text-sm text-gray-500">Area ID</p>
//             <p className="text-sm break-all">{selectedArea._id}</p>
//           </div>

//           {/* 👤 Area Manager */}
//           <div className="space-y-1">
//             <label className="text-sm text-gray-500 flex items-center gap-2">
//               <User className="w-4 h-4 text-blue-600" />
//               Area Manager
//             </label>

//             <select
//               value={selectedAreaManagerId}
//               onChange={(e) => setSelectedAreaManagerId(e.target.value)}
//               className="w-full mt-1 px-3 py-2 border rounded-lg"
//             >
//               <option value="">-- Select Area Manager --</option>
//               {areaManagers.map((am) => (
//                 <option key={am.userId} value={am.userId}>
//                   {am.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* 👤 Zonal Manager */}
//           <div className="space-y-1">
//             <label className="text-sm text-gray-500 flex items-center gap-2">
//               <User className="w-4 h-4 text-green-600" />
//               Zonal Manager
//             </label>

//             <select
//               value={selectedZonalManagerId}
//               onChange={(e) => setSelectedZonalManagerId(e.target.value)}
//               className="w-full mt-1 px-3 py-2 border rounded-lg"
//             >
//               <option value="">-- Select Zonal Manager --</option>
//               {zonalManagers.map((zm) => (
//                 <option key={zm.userId} value={zm.userId}>
//                   {zm.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* 💾 Save */}
//           <button
//             onClick={handleUpdate}
//             disabled={isUpdating}
//             className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
//           >
//             <Save className="w-4 h-4" />
//             {isUpdating ? "Updating..." : "Save Changes"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AreaPage;


import React, { useState, useEffect } from "react";
import { User, Save, Mail, Phone } from "lucide-react";
import {
  useGetAllAreasQuery,
  useUpdateAreaMutation,
} from "../redux/features/areas/areaApi";
import { useGetAreaAndZonalManagersQuery } from "../redux/features/users/usersAPI";

const AreaPage = () => {
  const { data, isLoading, isError } = useGetAllAreasQuery();
  const { data: managerData } = useGetAreaAndZonalManagersQuery();
  const [updateArea, { isLoading: isUpdating }] = useUpdateAreaMutation();

  const [selectedAreaId, setSelectedAreaId] = useState("");
  const [selectedAreaManagerId, setSelectedAreaManagerId] = useState("");
  const [selectedZonalManagerId, setSelectedZonalManagerId] = useState("");

  const areas = data?.areas || [];
  const selectedArea = areas.find((a) => a._id === selectedAreaId);

  const areaManagers = managerData?.data?.areaManagers || [];
  const zonalManagers = managerData?.data?.zonalManagers || [];

  // 🔄 Update selected managers when area changes
  useEffect(() => {
    if (!selectedArea) {
      setSelectedAreaManagerId("");
      setSelectedZonalManagerId("");
      return;
    }

    setSelectedAreaManagerId(selectedArea.areaManager?.userId || "");
    setSelectedZonalManagerId(selectedArea.zonalManager?.userId || "");
  }, [selectedArea]);

  if (isLoading) return <p className="p-6">Loading areas...</p>;
  if (isError) return <p className="p-6 text-red-500">Failed to load areas</p>;

  const handleUpdate = async () => {
    if (!selectedAreaId) return;

    await updateArea({
      areaId: selectedAreaId,
      data: {
        areaManagerId: selectedAreaManagerId || null,
        zonalManagerId: selectedZonalManagerId || null,
      },
    });
  };

  // 🔹 Find selected AM/ZM details
  const selectedAreaManager = areaManagers.find(
    (am) => am.user._id === selectedAreaManagerId
  );
  const selectedZonalManager = zonalManagers.find(
    (zm) => zm.user._id === selectedZonalManagerId
  );

  return (
    <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* ---------------- LEFT SIDE ---------------- */}
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Area Management</h1>

        {/* Area Dropdown */}
        <div>
          <label className="text-sm text-gray-500">Select Area</label>
          <select
            value={selectedAreaId}
            onChange={(e) => setSelectedAreaId(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-lg"
          >
            <option value="">-- Select Area --</option>
            {areas.map((area) => (
              <option key={area._id} value={area._id}>
                {area.areaName}
              </option>
            ))}
          </select>
        </div>

        {/* Area Manager */}
        <div>
          <label className="text-sm text-gray-500 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" /> Area Manager
          </label>
          <select
            value={selectedAreaManagerId}
            onChange={(e) => setSelectedAreaManagerId(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-lg"
          >
            <option value="">-- Select Area Manager --</option>
            {areaManagers.map((am) => (
              <option key={am.user._id} value={am.user._id}>
                {am.organizationProfile?.name || am.user.email}
              </option>
            ))}
          </select>
        </div>

        {/* Zonal Manager */}
        <div>
          <label className="text-sm text-gray-500 flex items-center gap-2">
            <User className="w-4 h-4 text-green-600" /> Zonal Manager
          </label>
          <select
            value={selectedZonalManagerId}
            onChange={(e) => setSelectedZonalManagerId(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-lg"
          >
            <option value="">-- Select Zonal Manager --</option>
            {zonalManagers.map((zm) => (
              <option key={zm.user._id} value={zm.user._id}>
                {zm.organizationProfile?.name || zm.user.email}
              </option>
            ))}
          </select>
        </div>

        {/* Save Button */}
        <button
          onClick={handleUpdate}
          disabled={isUpdating}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isUpdating ? "Updating..." : "Save Changes"}
        </button>
      </div>

      {/* ---------------- RIGHT SIDE ---------------- */}
      <div className="space-y-6 bg-white rounded-2xl shadow p-6">
        {/* Area Manager Details */}
        {selectedAreaManager ? (
          <div>
            <h2 className="text-xl font-semibold mb-2">Area Manager Details</h2>
            <p><strong>Name:</strong> {selectedAreaManager.organizationProfile?.name}</p>
            <p><strong>Email:</strong> {selectedAreaManager.user.email}</p>
            <p><strong>Designation:</strong> {selectedAreaManager.organizationProfile?.designation}</p>
            <p><strong>Phone:</strong> {selectedAreaManager.organizationProfile?.phone}</p>
            <p><strong>Workplace:</strong> {selectedAreaManager.organizationProfile?.workplace}</p>
            <p><strong>Area:</strong> {selectedAreaManager.organizationProfile?.area}</p>
          </div>
        ) : (
          <p className="text-gray-400">Select an Area Manager to see details</p>
        )}

        {/* Zonal Manager Details */}
        {selectedZonalManager ? (
          <div>
            <h2 className="text-xl font-semibold mb-2 mt-4">Zonal Manager Details</h2>
            <p><strong>Name:</strong> {selectedZonalManager.organizationProfile?.name}</p>
            <p><strong>Email:</strong> {selectedZonalManager.user.email}</p>
            <p><strong>Designation:</strong> {selectedZonalManager.organizationProfile?.designation}</p>
            <p><strong>Phone:</strong> {selectedZonalManager.organizationProfile?.phone}</p>
            <p><strong>Workplace:</strong> {selectedZonalManager.organizationProfile?.workplace}</p>
            <p><strong>Area:</strong> {selectedZonalManager.organizationProfile?.area}</p>
          </div>
        ) : (
          <p className="text-gray-400 mt-4">Select a Zonal Manager to see details</p>
        )}
      </div>
    </div>
  );
};

export default AreaPage;
