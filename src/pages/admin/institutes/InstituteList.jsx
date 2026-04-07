import React, { useState, useMemo } from "react";
import { useGetInstitutesByStatusQuery, useActivateInstituteMutation } from "../../../redux/features/institutes/instituteApi";
import { BsArrowLeftSquareFill, BsArrowRightSquareFill } from "react-icons/bs";
import { ImSearch } from "react-icons/im";
import { MdArrowBack, MdDelete, MdEdit } from "react-icons/md";
import Card from "../../../component/common/Card";
import Button from "../../../component/common/Button";
import Loader from "../../../component/Loader";
import { ChevronRight } from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const InstituteList = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [institutesPerPage, setInstitutesPerPage] = useState(10);

  // Mutations
  const [activateInstitute] = useActivateInstituteMutation();

  // Fetch institutes by status
  const { data: response, isLoading, isError, refetch } = useGetInstitutesByStatusQuery(statusFilter);
  const institutes = useMemo(() => response?.data || [], [response]);

  // Filter by search term
  const filteredInstitutes = useMemo(() => {
    return institutes.filter(
      (i) =>
        String(i?.instituteName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(i?.instituteId || "").includes(searchTerm) ||
        String(i?.mobile || "").includes(searchTerm) ||
        String(i?.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(i?.contactPerson || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [institutes, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredInstitutes.length / institutesPerPage);
  const startIndex = (currentPage - 1) * institutesPerPage;
  const currentInstitutes = filteredInstitutes.slice(startIndex, startIndex + institutesPerPage);

  // Handlers
  const changePage = (page) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const handleInstitutesPerPageChange = (e) => {
    setInstitutesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleActivate = async (instituteId, instituteName) => {
    const result = await Swal.fire({
      title: `Activate "${instituteName}"?`,
      text: "This institute will be activated and ready for use.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, Activate",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await activateInstitute(instituteId).unwrap();
        toast.success(`${instituteName} activated successfully!`);
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || "Failed to activate institute");
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/institutes/edit/${id}`);
  };

  const handleViewDetails = (id) => {
    navigate(`/admin/institutes/${id}`);
  };

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center">
          <p className="text-error text-lg">Failed to load institutes.</p>
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
                <span>Admin</span>
                <ChevronRight size={14} className="text-gray-400" />
                <span className="text-gray-900 font-bold">INSTITUTE LIST</span>
              </h2>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-neutral-500 mr-2 sm:mr-4 md:mr-6">
            Total Records: {filteredInstitutes.length}
          </div>
        </div>
      </Card>

      {/* Data Table */}
      <Card title="Institutes" subtitle={`Showing ${currentInstitutes.length} of ${filteredInstitutes.length} records`}>
        {/* Status Filters & Search */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={statusFilter === "active" ? "primary" : "outline"}
              size="small"
              onClick={() => {
                setStatusFilter("active");
                setCurrentPage(1);
              }}
            >
              Active
            </Button>
            <Button
              variant={statusFilter === "approved" ? "primary" : "outline"}
              size="small"
              onClick={() => {
                setStatusFilter("approved");
                setCurrentPage(1);
              }}
            >
              Approved
            </Button>
            <Button
              variant={statusFilter === "pending" ? "primary" : "outline"}
              size="small"
              onClick={() => {
                setStatusFilter("pending");
                setCurrentPage(1);
              }}
            >
              Pending
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 md:max-w-sm">
            <ImSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, ID, mobile, email..."
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
                  Institute ID
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">
                  Mobile
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">
                  Email
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">
                  Credit Limit
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentInstitutes.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    No institutes found
                  </td>
                </tr>
              ) : (
                currentInstitutes.map((institute) => (
                  <tr key={institute._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                      {institute.instituteName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {institute.instituteId ? `INS-${institute.instituteId}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {institute.mobile || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {institute.email || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          institute.status === "active"
                            ? "bg-green-100 text-green-800"
                            : institute.status === "approved"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {institute.status?.charAt(0).toUpperCase() + institute.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {institute.creditLimit ? `Rs. ${institute.creditLimit.toLocaleString()}` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => handleViewDetails(institute._id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="small"
                          icon={MdEdit}
                          onClick={() => handleEdit(institute._id)}
                          className="text-blue-600"
                          title="Edit institute"
                        />
                        {institute.status === "approved" && (
                          <Button
                            variant="outline"
                            size="small"
                            onClick={() => handleActivate(institute._id, institute.instituteName)}
                            className="text-green-600"
                            title="Activate institute"
                          >
                            Activate
                          </Button>
                        )}
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
                value={institutesPerPage}
                onChange={handleInstitutesPerPageChange}
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
              <Button
                variant="outline"
                size="small"
                icon={BsArrowLeftSquareFill}
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

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

              <Button
                variant="outline"
                size="small"
                icon={BsArrowRightSquareFill}
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>

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

export default InstituteList;
