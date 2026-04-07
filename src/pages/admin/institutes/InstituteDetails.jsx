import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetInstituteByIdQuery, useUpdateInstituteMutation } from "../../../redux/features/institutes/instituteApi";
import Loader from "../../../component/Loader";
import Card from "../../../component/common/Card";
import Button from "../../../component/common/Button";
import { MdArrowBack, MdEdit } from "react-icons/md";
import { ChevronRight } from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const InstituteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [updateInstitute] = useUpdateInstituteMutation();

  // Fetch institute details
  const { data: response, isLoading, isError, refetch } = useGetInstituteByIdQuery(id);
  const institute = response?.data;

  // Form state for editing
  const [formData, setFormData] = useState({
    instituteName: "",
    tradeLicense: "",
    drugLicense: "",
    address: "",
    mobile: "",
    email: "",
    contactPerson: "",
    discount: 0,
    creditLimit: "",
    dayLimit: "",
  });

  useEffect(() => {
    if (institute) {
      setFormData({
        instituteName: institute.instituteName || "",
        tradeLicense: institute.tradeLicense || "",
        drugLicense: institute.drugLicense || "",
        address: institute.address || "",
        mobile: institute.mobile || "",
        email: institute.email || "",
        contactPerson: institute.contactPerson || "",
        discount: institute.discount || 0,
        creditLimit: institute.creditLimit || "",
        dayLimit: institute.dayLimit || "",
      });
    }
  }, [institute]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.instituteName?.trim()) errors.push("Institute Name is required");
    if (!formData.tradeLicense?.trim()) errors.push("Trade License is required");
    if (!formData.drugLicense?.trim()) errors.push("Drug License is required");
    if (!formData.address?.trim()) errors.push("Address is required");
    if (!formData.mobile?.trim()) errors.push("Mobile is required");
    if (!formData.email?.trim()) errors.push("Email is required");
    if (!formData.contactPerson?.trim()) errors.push("Contact Person is required");
    if (institute?.payMode?.some((mode) => ["credit", "stc", "spic"].includes(mode))) {
      if (!formData.creditLimit || formData.creditLimit <= 0) errors.push("Credit Limit is required");
    }
    if (institute?.payMode?.some((mode) => ["credit", "spic"].includes(mode))) {
      if (!formData.dayLimit || formData.dayLimit <= 0) errors.push("Day Limit is required");
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
      await Swal.fire({
        icon: "error",
        title: "Validation Error",
        html: `
          <div class="text-left">
            <ul class="space-y-2">
              ${validationErrors.map((error) => `<li class="flex items-start gap-2"><span class="text-red-500">•</span><span>${error}</span></li>`).join("")}
            </ul>
          </div>
        `,
        confirmButtonText: "Got it",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    try {
      await updateInstitute({ id, payload: formData }).unwrap();
      toast.success("Institute updated successfully!");
      setIsEditing(false);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update institute");
    }
  };

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center">
          <p className="text-error text-lg">Failed to load institute details.</p>
          <Button variant="primary" className="mt-4" onClick={() => refetch()}>
            Try Again
          </Button>
        </Card>
      </div>
    );

  if (!institute)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center">
          <p className="text-gray-600 text-lg">Institute not found.</p>
          <Button
            variant="primary"
            className="mt-4"
            onClick={() => navigate("/institutes")}
          >
            Back to Institutes
          </Button>
        </Card>
      </div>
    );

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
                <span className="text-gray-900 font-bold">INSTITUTE DETAILS</span>
              </h2>
            </div>
          </div>
          <div className="flex gap-2">
            {!isEditing && (
              <Button
                variant="primary"
                size="small"
                icon={MdEdit}
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Institute Info Card */}
      <Card>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {institute.instituteName}
            </h1>
            <div className="flex gap-4 items-center flex-wrap">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(institute.status)}`}>
                {institute.status?.charAt(0).toUpperCase() + institute.status?.slice(1)}
              </span>
              {institute.instituteId && (
                <span className="text-gray-600 text-sm font-medium">
                  ID: <span className="text-gray-900 font-bold">INS-{institute.instituteId}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {!isEditing ? (
          // View Mode
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-gray-600 text-sm font-medium mb-1">Trade License</p>
                <p className="text-gray-900 font-semibold">{institute.tradeLicense}</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-gray-600 text-sm font-medium mb-1">Drug License</p>
                <p className="text-gray-900 font-semibold">{institute.drugLicense}</p>
              </div>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <p className="text-gray-600 text-sm font-medium mb-1">Address</p>
              <p className="text-gray-900 font-semibold">{institute.address}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-l-4 border-green-500 pl-4">
                <p className="text-gray-600 text-sm font-medium mb-1">Mobile</p>
                <p className="text-gray-900 font-semibold">{institute.mobile}</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <p className="text-gray-600 text-sm font-medium mb-1">Email</p>
                <p className="text-gray-900 font-semibold">{institute.email}</p>
              </div>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <p className="text-gray-600 text-sm font-medium mb-1">Contact Person</p>
              <p className="text-gray-900 font-semibold">{institute.contactPerson}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-l-4 border-purple-500 pl-4">
                <p className="text-gray-600 text-sm font-medium mb-1">Discount</p>
                <p className="text-gray-900 font-semibold">{institute.discount || 0}%</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <p className="text-gray-600 text-sm font-medium mb-1">Pay Mode</p>
                <p className="text-gray-900 font-semibold">
                  {institute.payMode?.map((m) => m.toUpperCase()).join(", ")}
                </p>
              </div>
            </div>

            {institute.payMode?.some((mode) => ["credit", "stc", "spic"].includes(mode)) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="text-gray-600 text-sm font-medium mb-1">Credit Limit</p>
                  <p className="text-gray-900 font-semibold">
                    Rs. {Number(institute.creditLimit).toLocaleString()}
                  </p>
                </div>
                {institute.payMode?.some((mode) => ["credit", "spic"].includes(mode)) && (
                  <div className="border-l-4 border-orange-500 pl-4">
                    <p className="text-gray-600 text-sm font-medium mb-1">Day Limit</p>
                    <p className="text-gray-900 font-semibold">
                      {institute.dayLimit} days
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Created By</p>
                <p className="text-gray-900 font-semibold flex flex-col">
                  <span>{institute.addedBy?.name}</span>
                  <span className="text-xs text-gray-500">{institute.addedBy?.email}</span>
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Created Date</p>
                <p className="text-gray-900 font-semibold">
                  {new Date(institute.createdAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Edit Mode
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Institute Name"
              name="instituteName"
              value={formData.instituteName}
              onChange={handleFormChange}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Trade License"
                name="tradeLicense"
                value={formData.tradeLicense}
                onChange={handleFormChange}
                required
                disabled
              />
              <Input
                label="Drug License"
                name="drugLicense"
                value={formData.drugLicense}
                onChange={handleFormChange}
                required
                disabled
              />
            </div>

            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleFormChange}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleFormChange}
                required
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFormChange}
                required
              />
            </div>

            <Input
              label="Contact Person"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleFormChange}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Discount (%)"
                name="discount"
                type="number"
                value={formData.discount}
                onChange={handleFormChange}
              />
              {institute.payMode?.some((mode) => ["credit", "stc", "spic"].includes(mode)) && (
                <Input
                  label="Credit Limit"
                  name="creditLimit"
                  type="number"
                  value={formData.creditLimit}
                  onChange={handleFormChange}
                  required={institute.payMode?.some((mode) => ["credit", "stc", "spic"].includes(mode))}
                />
              )}
            </div>

            {institute.payMode?.some((mode) => ["credit", "spic"].includes(mode)) && (
              <Input
                label="Day Limit"
                name="dayLimit"
                type="number"
                value={formData.dayLimit}
                onChange={handleFormChange}
                required={institute.payMode?.some((mode) => ["credit", "spic"].includes(mode))}
              />
            )}

            <div className="flex gap-3 pt-4">
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

// Input Component
const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {props.required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      {...props}
      className="w-full border border-gray-300 rounded p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
    />
  </div>
);

export default InstituteDetails;
