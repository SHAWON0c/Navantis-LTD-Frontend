// import React, { useState } from "react";
// import { FaEdit, FaTrash, FaUserPlus } from "react-icons/fa";
// import { toast } from "react-toastify";
// import { useDeleteRiderMutation, useGetAllRidersQuery } from "../../redux/features/rider/riderApi";
// import CreateRiderModal from "../../component/modals/CreateRiderModal";
// import Loader from "../../component/Loader";

// const DispatchRidersPage = () => {
//   const { data, isLoading, isError } = useGetAllRidersQuery();
//   const [deleteRider] = useDeleteRiderMutation();
//   const [openModal, setOpenModal] = useState(false);

//   const riders = data?.data || [];

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure to delete this rider?")) return;

//     try {
//       await deleteRider(id).unwrap();
//       toast.success("Rider deleted successfully");
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to delete rider");
//     }
//   };

//   if (isLoading) return <Loader></Loader>
//   if (isError) return <p className="text-center mt-10 text-red-500">Failed to load riders</p>;

//   return (
//     <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      
//       {/* Header with button */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">
//           Dispatch Riders Information
//         </h1>

//         <button
//           onClick={() => setOpenModal(true)}
//           className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
//         >
//           <FaUserPlus /> New Dispatch Rider
//         </button>
//       </div>

//       <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
//         <table className="min-w-full border border-gray-200">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-4 py-3 text-left text-xs font-semibold">Sl. No.</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold">Rider ID</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold">Name</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold">Mobile</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold">Email</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold">NID / License</th>
//               <th className="px-4 py-3 text-center text-xs font-semibold">Actions</th>
//             </tr>
//           </thead>

//           <tbody className="divide-y">
//             {riders.map((rider, index) => (
//               <tr key={rider._id} className="hover:bg-gray-50">
//                 <td className="px-4 py-3">{index + 1}</td>
//                 <td className="px-4 py-3 font-medium">{rider.riderId}</td>
//                 <td className="px-4 py-3">{rider.name}</td>
//                 <td className="px-4 py-3">{rider.mobile}</td>
//                 <td className="px-4 py-3">{rider.email || "-"}</td>
//                 <td className="px-4 py-3">{rider.nidOrLicense}</td>

//                 <td className="px-4 py-3 flex justify-center gap-2">
//                   <button
//                     className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
//                     onClick={() => toast.info("Edit coming soon")}
//                   >
//                     <FaEdit /> Edit
//                   </button>

//                   {/* <button
//                     className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
//                     onClick={() => handleDelete(rider._id)}
//                   >
//                     <FaTrash /> Delete
//                   </button> */}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Create Rider Modal */}
//       <CreateRiderModal isOpen={openModal} onClose={() => setOpenModal(false)} />
//     </div>
//   );
// };

// export default DispatchRidersPage;



import React, { useState } from "react";
import { FaEdit, FaUserPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { useDeleteRiderMutation, useGetAllRidersQuery } from "../../redux/features/rider/riderApi";
import CreateRiderModal from "../../component/modals/CreateRiderModal";
import Loader from "../../component/Loader";

const DispatchRidersPage = () => {
  const { data, isLoading, isError } = useGetAllRidersQuery();
  const [deleteRider] = useDeleteRiderMutation();
  const [openModal, setOpenModal] = useState(false);

  const riders = data?.data || [];

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this rider?")) return;

    try {
      await deleteRider(id).unwrap();
      toast.success("Rider deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete rider");
    }
  };

  if (isLoading) return <Loader />;
  if (isError) return <p className="text-center mt-10 text-red-500">Failed to load riders</p>;

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Dispatch Riders Information</h1>

        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg transition-shadow shadow-sm hover:shadow-md"
        >
          <FaUserPlus /> New Dispatch Rider
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-300 bg-white shadow-sm">
        <table className="min-w-full border-collapse text-gray-800">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-3 text-left text-sm font-semibold border-b">Sl. No.</th>
              <th className="px-4 py-3 text-left text-sm font-semibold border-b">Rider ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold border-b">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold border-b">Mobile</th>
              <th className="px-4 py-3 text-left text-sm font-semibold border-b">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold border-b">NID / License</th>
              <th className="px-4 py-3 text-center text-sm font-semibold border-b">Actions</th>
            </tr>
          </thead>

          <tbody>
            {riders.map((rider, index) => (
              <tr key={rider._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 border text-center">{index + 1}</td>
                <td className="px-4 py-3 border font-medium">{rider.riderId}</td>
                <td className="px-4 py-3 border">{rider.name}</td>
                <td className="px-4 py-3 border">{rider.mobile}</td>
                <td className="px-4 py-3 border">{rider.email || "-"}</td>
                <td className="px-4 py-3 border">{rider.nidOrLicense}</td>

                <td className="px-4 py-3 border flex justify-center gap-2">
                  <button
                    className="bg-gray-800 hover:bg-gray-900 text-white px-3 py-1 rounded flex items-center gap-1 text-sm transition"
                    onClick={() => toast.info("Edit coming soon")}
                  >
                    <FaEdit /> Edit
                  </button>

                  {/* Uncomment if delete is needed */}
                  {/* <button
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded flex items-center gap-1 text-sm transition"
                    onClick={() => handleDelete(rider._id)}
                  >
                    <FaTrash /> Delete
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Rider Modal */}
      <CreateRiderModal isOpen={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
};

export default DispatchRidersPage;