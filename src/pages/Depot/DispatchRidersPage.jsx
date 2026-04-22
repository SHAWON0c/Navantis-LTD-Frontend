import React, { useState } from "react";
import { FaEdit, FaTrash, FaUserPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { useDeleteRiderMutation, useGetAllRidersQuery } from "../../redux/features/rider/riderApi";
import CreateRiderModal from "../../component/modals/CreateRiderModal";
import Loader from "../../component/Loader";
import Card from "../../component/common/Card";
import Button from "../../component/common/Button";
import { MdArrowBack } from "react-icons/md";
import { ChevronRight } from "lucide-react";

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
  if (isError) return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="text-center">
        <p className="text-error text-lg">Failed to load riders.</p>
        <Button variant="primary" className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="small" icon={MdArrowBack} onClick={() => window.history.back()}
              className="ml-2">
              Back
            </Button>
            <div className="bg-white text-gray-500 flex items-center px-3 sm:px-4 md:px-6 py-2 sm:h-12">
              <h2 className="flex flex-wrap items-center text-xs md:text-sm font-semibold text-gray-800 gap-1 sm:gap-2">
                <span>EMS</span>
                <ChevronRight size={14} className="text-gray-400" />
                <span>DEPOT</span>
                <ChevronRight size={14} className="text-gray-400" />
                <span className="text-gray-900 font-bold">DISPATCH RIDERS</span>
              </h2>
            </div>
          </div>
          <Button
            variant="primary"
            size="medium"
            icon={FaUserPlus}
            onClick={() => setOpenModal(true)}
            className="mr-2"
          >
            Add Rider
          </Button>
        </div>
      </Card>

      {/* Data Table */}
      <Card title="Riders List" subtitle={`Total Riders: ${riders.length}`}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="text-center py-2 px-2 font-semibold text-gray-700">Sl. No.</th>
                <th className="text-left py-2 px-2 font-semibold text-gray-700">Rider ID</th>
                <th className="text-left py-2 px-2 font-semibold text-gray-700">Name</th>
                <th className="text-left py-2 px-2 font-semibold text-gray-700">Mobile</th>
                <th className="text-left py-2 px-2 font-semibold text-gray-700">Email</th>
                <th className="text-left py-2 px-2 font-semibold text-gray-700">Document</th>
                <th className="text-center py-2 px-2 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {riders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    No riders found
                  </td>
                </tr>
              ) : (
                riders.map((rider, index) => (
                  <tr key={rider._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="text-center py-2 px-2">{index + 1}</td>
                    <td className="text-left py-2 px-2 font-medium">{rider.riderId}</td>
                    <td className="text-left py-2 px-2">{rider.name}</td>
                    <td className="text-left py-2 px-2">{rider.mobile}</td>
                    <td className="text-left py-2 px-2">{rider.email || "-"}</td>
                    <td className="text-left py-2 px-2">{rider.nidOrLicense}</td>
                    <td className="text-center py-2 px-2">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="primary"
                          size="small"
                          icon={FaEdit}
                          onClick={() => toast.info("Edit coming soon")}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="small"
                          icon={FaTrash}
                          onClick={() => handleDelete(rider._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Rider Modal */}
      <CreateRiderModal isOpen={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
};

export default DispatchRidersPage;