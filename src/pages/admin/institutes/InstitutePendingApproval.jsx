import React, { useState, useMemo } from "react";
import { useGetPendingInstitutesQuery, useApproveInstituteMutation } from "../../../redux/features/institutes/instituteApi";
import { ImSearch } from "react-icons/im";
import { MdArrowBack } from "react-icons/md";
import Card from "../../../component/common/Card";
import Button from "../../../component/common/Button";
import Loader from "../../../component/Loader";
import { ChevronRight } from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const InstitutePendingApproval = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [approvalPerPage, setApprovalPerPage] = useState(20);
  const [approveInstitute] = useApproveInstituteMutation();

  // Fetch pending institutes for MD approval
  const { data: response, isLoading, isError, refetch } = useGetPendingInstitutesQuery("pending");
  const institutions = useMemo(() => response?.data || [], [response]);

  // Filter by search term
  const filteredInstitutions = useMemo(() => {
    return institutions.filter(
      (i) =>
        String(i?.instituteName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(i?.mobile || "").includes(searchTerm) ||
        String(i?.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(i?.contactPerson || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [institutions, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredInstitutions.length / approvalPerPage);
  const startIndex = (currentPage - 1) * approvalPerPage;
  const currentApprovals = filteredInstitutions.slice(startIndex, startIndex + approvalPerPage);

  const changePage = (page) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const handleApprovalPerPageChange = (e) => {
    setApprovalPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleApprove = async (instituteId, instituteName) => {
    const result = await Swal.fire({
      title: `Approve "${instituteName}"?`,
      text: "This institute will be marked as approved and ready for activation.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, Approve",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await approveInstitute(instituteId).unwrap();
        toast.success(`${instituteName} approved successfully!`);
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || "Failed to approve institute");
      }
    }
  };

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center">
          <p className="text-error text-lg">Failed to load pending approvals.</p>
          <Button variant="primary" className="mt-4" onClick={() => refetch()}>
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
                <span>MD Dashboard</span>
                <ChevronRight size={14} className="text-gray-400" />
                <span className="text-gray-900 font-bold">PENDING APPROVALS</span>
              </h2>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-neutral-500 mr-2 sm:mr-4 md:mr-6">
            Pending: {filteredInstitutions.length}
          </div>
        </div>
      </Card>

      {/* Data Table */}
      <Card
        title="Institute Approvals"
        subtitle={`Showing ${currentApprovals.length} of ${filteredInstitutions.length} pending institutes`}
      >
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <ImSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, mobile, email, contact person..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-max border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">
                  Institute Name
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">
                  Contact Person
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">
                  Mobile
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">
                  Email
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">
                  Created By
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">
                  Created Date
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentApprovals.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    No pending institutes for approval
                  </td>
                </tr>
              ) : (
                currentApprovals.map((institute) => (
                  <tr key={institute._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                      <div>
                        <p className="font-semibold">{institute.instituteName}</p>
                        <p className="text-xs text-gray-500">{institute.address}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {institute.contactPerson || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {institute.mobile || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {institute.email || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <div>
                        <p>{institute.addedBy?.name || "—"}</p>
                        <p className="text-xs text-gray-500">{institute.addedBy?.email || ""}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(institute.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <Button
                          variant="primary"
                          size="small"
                          onClick={() => handleApprove(institute._id, institute.instituteName)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Show:</label>
              <select
                value={approvalPerPage}
                onChange={handleApprovalPerPageChange}
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
              <span className="text-sm text-gray-600">per page</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = currentPage > 2 ? currentPage - 2 + i : i + 1;
                  return page <= totalPages ? (
                    <button
                      key={page}
                      onClick={() => changePage(page)}
                      className={`px-3 py-1 rounded transition ${
                        currentPage === page
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  ) : null;
                })}
              </div>

              <button
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>

              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default InstitutePendingApproval;
