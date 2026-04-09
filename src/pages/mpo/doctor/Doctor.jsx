import React, { useState } from "react";
import { useGetPendingDoctorsQuery, useApproveDoctorMutation, useRejectDoctorMutation } from "../../../redux/features/doctor/doctorApi";
import { BsArrowLeftSquareFill, BsArrowRightSquareFill } from "react-icons/bs";
import { ImSearch } from "react-icons/im";
import Card from "../../../component/common/Card";
import Button from "../../../component/common/Button";
import Loader from "../../../component/Loader";
import { ChevronRight } from "lucide-react";
import { MdArrowBack } from "react-icons/md";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const PendingDoctor = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [doctorsPerPage, setDoctorsPerPage] = useState(5);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingDoctorId, setRejectingDoctorId] = useState(null);

  // Fetch pending doctors
  const { data: response, isLoading, isError, refetch } = useGetPendingDoctorsQuery();
  const doctors = response?.data || [];

  const [approveDoctor, { isLoading: isApproving }] = useApproveDoctorMutation();
  const [rejectDoctor, { isLoading: isRejecting }] = useRejectDoctorMutation();

  // Filter by search term
  const filteredDoctors = doctors.filter(
    (d) =>
      String(d?.doctorName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(d?.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(d?.speciality || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(d?.mobileNo || "").includes(searchTerm)
  );

  // Pagination
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);
  const startIndex = (currentPage - 1) * doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(startIndex, startIndex + doctorsPerPage);

  // Handlers
  const changePage = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDoctorsPerPageChange = (e) => {
    setDoctorsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleViewDetails = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleApprove = async (doctorId) => {
    try {
      const response = await approveDoctor(doctorId).unwrap();
      if (response.success) {
        toast.success(response.message || "Doctor approved successfully!");
        refetch();
        setSelectedDoctor(null);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to approve doctor");
    }
  };

  const handleRejectClick = (doctorId) => {
    setRejectingDoctorId(doctorId);
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      const response = await rejectDoctor({
        id: rejectingDoctorId,
        payload: { reason: rejectReason },
      }).unwrap();

      if (response.success) {
        toast.success(response.message || "Doctor rejected successfully!");
        setShowRejectModal(false);
        setRejectReason("");
        setRejectingDoctorId(null);
        refetch();
        setSelectedDoctor(null);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to reject doctor");
    }
  };

  const handleEditDoctor = (doctorId) => {
    navigate(`/mpo/doctor/edit/${doctorId}`);
  };

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center">
          <p className="text-error text-lg">Failed to load pending doctors.</p>
          <Button
            variant="primary"
            className="mt-4"
            onClick={() => refetch()}
          >
            Try Again
          </Button>
        </Card>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="small"
              icon={MdArrowBack}
              onClick={() => window.history.back()}
              className="ml-2"
            >
              Back
            </Button>
            <div className="bg-white text-gray-500 flex items-center px-3 sm:px-4 md:px-6 py-2 sm:h-12">
              <h2 className="flex flex-wrap items-center text-xs sm:text-sm md:text-base font-semibold text-gray-800 gap-1 sm:gap-2">
                <span>EMS</span>
                <ChevronRight size={14} className="text-gray-400" />
                <span>MPO</span>
                <ChevronRight size={14} className="text-gray-400" />
                <span className="text-gray-900 font-bold">PENDING DOCTORS</span>
              </h2>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-neutral-500 mr-2 sm:mr-4 md:mr-6">
            Total Records: {filteredDoctors.length}
          </div>
        </div>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Section */}
        <div className="lg:col-span-2">
          <Card title="Pending Doctors" subtitle={`Showing ${currentDoctors.length} of ${filteredDoctors.length} records`}>
            {/* Search and Filter */}
            <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="relative w-full md:w-1/2">
                <ImSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, speciality..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={doctorsPerPage}
                onChange={handleDoctorsPerPageChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Doctor Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Email</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Speciality</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Approval Level</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDoctors.length > 0 ? (
                    currentDoctors.map((doctor) => (
                      <tr key={doctor._id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-800 font-medium">{doctor.doctorName}</td>
                        <td className="px-4 py-3 text-gray-600">{doctor.email}</td>
                        <td className="px-4 py-3 text-gray-600">{doctor.speciality || "N/A"}</td>
                        <td className="px-4 py-3">
                          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                            {doctor.approvalStatus?.currentLevel || "N/A"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Button
                            variant="primary"
                            size="small"
                            onClick={() => handleViewDetails(doctor)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                        No pending doctors found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  <BsArrowLeftSquareFill /> Previous
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => changePage(page)}
                        className={`px-3 py-2 rounded-lg font-semibold ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Next <BsArrowRightSquareFill />
                </button>
              </div>
            )}
          </Card>
        </div>

        {/* Details Panel */}
        <div className="lg:col-span-1">
          {selectedDoctor ? (
            <Card title="Doctor Details">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Doctor Name</p>
                  <p className="font-semibold text-gray-800">{selectedDoctor.doctorName}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-800">{selectedDoctor.email}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Mobile</p>
                  <p className="font-semibold text-gray-800">{selectedDoctor.mobileNo}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Designation</p>
                  <p className="font-semibold text-gray-800">{selectedDoctor.designation || "N/A"}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Speciality</p>
                  <p className="font-semibold text-gray-800">{selectedDoctor.speciality || "N/A"}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Qualification</p>
                  <p className="font-semibold text-gray-800">{selectedDoctor.qualification || "N/A"}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold text-gray-800">
                    {selectedDoctor.location?.division}, {selectedDoctor.location?.district}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Approval Status</p>
                  <p className="font-semibold text-yellow-600 capitalize">
                    {selectedDoctor.approvalStatus?.currentLevel || "N/A"}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-3">Associated Chemists: {selectedDoctor.chemistId?.length || 0}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedDoctor.chemistId?.map((id, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                      >
                        {id}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-4 border-t">
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => handleApprove(selectedDoctor._id)}
                    disabled={isApproving}
                    loading={isApproving}
                  >
                    {isApproving ? "Approving..." : "Approve"}
                  </Button>

                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => handleRejectClick(selectedDoctor._id)}
                  >
                    Reject
                  </Button>

                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() => handleEditDoctor(selectedDoctor._id)}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="ghost"
                    fullWidth
                    onClick={() => setSelectedDoctor(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="text-center py-8">
                <p className="text-gray-500">Select a doctor to view details</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Reject Doctor</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
              rows="4"
            />
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                  setRejectingDoctorId(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleRejectSubmit}
                disabled={isRejecting}
                loading={isRejecting}
              >
                {isRejecting ? "Rejecting..." : "Reject"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PendingDoctor;
