import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetDoctorByIdQuery, useUpdateDoctorMutation } from "../../../redux/features/doctor/doctorApi";
import { useAuth } from "../../../provider/AuthProvider";
import Loader from "../../../component/Loader";
import Button from "../../../component/common/Button";
import Card from "../../../component/common/Card";
import FormInput from "../../../component/common/FormInput";
import FormSelect from "../../../component/common/FormSelect";
import { MdArrowBack } from "react-icons/md";
import { ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

const EditDoctor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo, loading: authLoading } = useAuth();

  const { data: response, isLoading: isFetching } = useGetDoctorByIdQuery(id);
  const doctor = response?.data || null;

  const [updateDoctor, { isLoading: isUpdating }] = useUpdateDoctorMutation();

  const [formData, setFormData] = useState({
    doctorName: "",
    designation: "",
    contactNo: "",
    mobileNo: "",
    email: "",
    dateOfBirth: "",
    isMarried: false,
    religion: "",
    speciality: "",
    qualification: "",
    passingInstituteName: "",
    passingYear: new Date().getFullYear(),
    practiceDay: "",
    avgPatientPerWeek: 0,
    avgPatientPerDay: 0,
    practicingType: "regular",
    location: {
      division: "",
      district: "",
      upazila: "",
      union: "",
    },
    territoryId: "",
    jointInstituteName: "",
    visitingAddress: "",
    chemistId: [],
    marketPointsId: [],
    hasChamber: false,
    chamberAddress: "",
    discount: 0,
    doctorLicense: "",
  });

  const [chemistInput, setChemistInput] = useState("");
  const [marketPointInput, setMarketPointInput] = useState("");

  // Populate form when doctor data is fetched
  useEffect(() => {
    if (doctor) {
      setFormData({
        doctorName: doctor.doctorName || "",
        designation: doctor.designation || "",
        contactNo: doctor.contactNo || "",
        mobileNo: doctor.mobileNo || "",
        email: doctor.email || "",
        dateOfBirth: doctor.dateOfBirth ? doctor.dateOfBirth.split("T")[0] : "",
        isMarried: doctor.isMarried || false,
        religion: doctor.religion || "",
        speciality: doctor.speciality || "",
        qualification: doctor.qualification || "",
        passingInstituteName: doctor.passingInstituteName || "",
        passingYear: doctor.passingYear || new Date().getFullYear(),
        practiceDay: doctor.practiceDay || "",
        avgPatientPerWeek: doctor.avgPatientPerWeek || 0,
        avgPatientPerDay: doctor.avgPatientPerDay || 0,
        practicingType: doctor.practicingType || "regular",
        location: {
          division: doctor.location?.division || "",
          district: doctor.location?.district || "",
          upazila: doctor.location?.upazila || "",
          union: doctor.location?.union || "",
        },
        territoryId: doctor.territoryId || "",
        jointInstituteName: doctor.jointInstituteName || "",
        visitingAddress: doctor.visitingAddress || "",
        chemistId: doctor.chemistId || [],
        marketPointsId: doctor.marketPointsId || [],
        hasChamber: doctor.hasChamber || false,
        chamberAddress: doctor.chamberAddress || "",
        discount: doctor.discount || 0,
        doctorLicense: doctor.doctorLicense || "",
      });
    }
  }, [doctor]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (name.startsWith("location.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "number" ? (value === "" ? 0 : Number(value)) : value,
      }));
    }
  };

  const addChemistId = () => {
    if (chemistInput.trim() && !formData.chemistId.includes(chemistInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        chemistId: [...prev.chemistId, chemistInput.trim()],
      }));
      setChemistInput("");
    }
  };

  const removeChemistId = (index) => {
    setFormData((prev) => ({
      ...prev,
      chemistId: prev.chemistId.filter((_, i) => i !== index),
    }));
  };

  const addMarketPointId = () => {
    if (marketPointInput.trim() && !formData.marketPointsId.includes(marketPointInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        marketPointsId: [...prev.marketPointsId, marketPointInput.trim()],
      }));
      setMarketPointInput("");
    }
  };

  const removeMarketPointId = (index) => {
    setFormData((prev) => ({
      ...prev,
      marketPointsId: prev.marketPointsId.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.doctorName.trim()) {
      toast.error("Doctor name is required");
      return;
    }

    if (formData.chemistId.length === 0) {
      toast.error("At least one chemist must be associated");
      return;
    }

    if (!formData.mobileNo.trim()) {
      toast.error("Mobile number is required");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      const payload = {
        doctorName: formData.doctorName,
        designation: formData.designation,
        contactNo: formData.contactNo,
        mobileNo: formData.mobileNo,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
        isMarried: formData.isMarried,
        religion: formData.religion,
        speciality: formData.speciality,
        qualification: formData.qualification,
        passingInstituteName: formData.passingInstituteName,
        passingYear: Number(formData.passingYear),
        practiceDay: formData.practiceDay,
        avgPatientPerWeek: Number(formData.avgPatientPerWeek),
        avgPatientPerDay: Number(formData.avgPatientPerDay),
        practicingType: formData.practicingType,
        location: formData.location,
        territoryId: formData.territoryId,
        jointInstituteName: formData.jointInstituteName,
        visitingAddress: formData.visitingAddress,
        chemistId: formData.chemistId,
        marketPointsId: formData.marketPointsId,
        hasChamber: formData.hasChamber,
        chamberAddress: formData.chamberAddress,
        discount: Number(formData.discount),
        doctorLicense: formData.doctorLicense,
      };

      const response = await updateDoctor({ id, payload }).unwrap();

      if (response.success) {
        toast.success(response.message || "Doctor updated successfully!");
        setTimeout(() => navigate(-1), 1500);
      }
    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to update doctor. Please try again."
      );
    }
  };

  if (authLoading || isFetching) return <Loader />;

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center">
          <p className="text-error text-lg">Doctor not found</p>
          <Button
            variant="primary"
            className="mt-4"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="small"
              icon={MdArrowBack}
              onClick={() => navigate(-1)}
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
                <span className="text-gray-900 font-bold">EDIT DOCTOR</span>
              </h2>
            </div>
          </div>
        </div>
      </Card>

      {/* Approval Status Alert */}
      <Card className="mb-6 bg-cyan-50 border border-cyan-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-cyan-900">Approval Status</p>
            <p className="text-cyan-700">
              Current Level: <span className="font-bold capitalize">{doctor.approvalStatus?.currentLevel}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-cyan-600">Status: {doctor.status}</p>
            <p className="text-xs text-cyan-600">
              Created: {new Date(doctor.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </Card>

      {/* Form */}
      <Card title="Edit Doctor Information">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Doctor Name *"
                name="doctorName"
                type="text"
                value={formData.doctorName}
                onChange={handleFormChange}
                placeholder="Enter doctor's full name"
              />
              <FormInput
                label="Designation"
                name="designation"
                type="text"
                value={formData.designation}
                onChange={handleFormChange}
                placeholder="e.g. General Practitioner"
              />
              <FormInput
                label="Email *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFormChange}
                placeholder="Enter email"
              />
              <FormInput
                label="Mobile Number *"
                name="mobileNo"
                type="text"
                value={formData.mobileNo}
                onChange={handleFormChange}
                placeholder="+880987654321"
              />
              <FormInput
                label="Contact Number"
                name="contactNo"
                type="text"
                value={formData.contactNo}
                onChange={handleFormChange}
                placeholder="+880123456789"
              />
              <FormInput
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleFormChange}
              />

              <FormSelect
                label="Religion"
                name="religion"
                value={formData.religion}
                onChange={handleFormChange}
                options={[
                  { label: "Select Religion", value: "" },
                  { label: "Islam", value: "Islam" },
                  { label: "Hinduism", value: "Hinduism" },
                  { label: "Christianity", value: "Christianity" },
                  { label: "Buddhism", value: "Buddhism" },
                  { label: "Other", value: "Other" },
                ]}
              />

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isMarried"
                    checked={formData.isMarried}
                    onChange={handleFormChange}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">Married</span>
                </label>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Professional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Speciality"
                name="speciality"
                type="text"
                value={formData.speciality}
                onChange={handleFormChange}
                placeholder="e.g. General Medicine"
              />
              <FormInput
                label="Qualification"
                name="qualification"
                type="text"
                value={formData.qualification}
                onChange={handleFormChange}
                placeholder="e.g. MBBS"
              />
              <FormInput
                label="Passing Institute Name"
                name="passingInstituteName"
                type="text"
                value={formData.passingInstituteName}
                onChange={handleFormChange}
                placeholder="e.g. Dhaka Medical College"
              />
              <FormInput
                label="Passing Year"
                name="passingYear"
                type="number"
                value={formData.passingYear}
                onChange={handleFormChange}
              />
              <FormInput
                label="Doctor License"
                name="doctorLicense"
                type="text"
                value={formData.doctorLicense}
                onChange={handleFormChange}
                placeholder="e.g. DL-2024-00123"
              />
              <FormInput
                label="Joint Institute Name"
                name="jointInstituteName"
                type="text"
                value={formData.jointInstituteName}
                onChange={handleFormChange}
                placeholder="e.g. Dhaka General Hospital"
              />
            </div>
          </div>

          {/* Practice Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Practice Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Practice Days"
                name="practiceDay"
                type="text"
                value={formData.practiceDay}
                onChange={handleFormChange}
                placeholder="e.g. Monday-Friday"
              />
              <FormSelect
                label="Practicing Type"
                name="practicingType"
                value={formData.practicingType}
                onChange={handleFormChange}
                options={[
                  { label: "Regular", value: "regular" },
                  { label: "Part-time", value: "part-time" },
                  { label: "Consultant", value: "consultant" },
                ]}
              />
              <FormInput
                label="Average Patients Per Week"
                name="avgPatientPerWeek"
                type="number"
                value={formData.avgPatientPerWeek}
                onChange={handleFormChange}
              />
              <FormInput
                label="Average Patients Per Day"
                name="avgPatientPerDay"
                type="number"
                value={formData.avgPatientPerDay}
                onChange={handleFormChange}
              />
              <FormInput
                label="Visiting Address"
                name="visitingAddress"
                type="text"
                value={formData.visitingAddress}
                onChange={handleFormChange}
                placeholder="Enter practice address"
              />
              <FormInput
                label="Territory ID"
                name="territoryId"
                type="text"
                value={formData.territoryId}
                onChange={handleFormChange}
                placeholder="Enter territory ID"
              />
            </div>
          </div>

          {/* Chamber Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Chamber Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="hasChamber"
                  checked={formData.hasChamber}
                  onChange={handleFormChange}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">Has Chamber</span>
              </label>

              {formData.hasChamber && (
                <FormInput
                  label="Chamber Address"
                  name="chamberAddress"
                  type="text"
                  value={formData.chamberAddress}
                  onChange={handleFormChange}
                  placeholder="Enter chamber address"
                />
              )}
            </div>
          </div>

          {/* Location Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Location Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Division"
                name="location.division"
                type="text"
                value={formData.location.division}
                onChange={handleFormChange}
                placeholder="e.g. Dhaka"
              />
              <FormInput
                label="District"
                name="location.district"
                type="text"
                value={formData.location.district}
                onChange={handleFormChange}
                placeholder="e.g. Dhaka"
              />
              <FormInput
                label="Upazila"
                name="location.upazila"
                type="text"
                value={formData.location.upazila}
                onChange={handleFormChange}
                placeholder="e.g. Gulshan"
              />
              <FormInput
                label="Union"
                name="location.union"
                type="text"
                value={formData.location.union}
                onChange={handleFormChange}
                placeholder="e.g. Banani"
              />
            </div>
          </div>

          {/* Associated Entities */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Associated Entities
            </h3>

            {/* Chemists */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Associated Chemists * (At least one required)
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={chemistInput}
                  onChange={(e) => setChemistInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addChemistId()}
                  placeholder="Enter Chemist ID and press Add"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  type="button"
                  variant="primary"
                  onClick={addChemistId}
                  size="small"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.chemistId.map((id, index) => (
                  <div
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    <span className="text-sm">{id}</span>
                    <button
                      type="button"
                      onClick={() => removeChemistId(index)}
                      className="text-blue-600 hover:text-blue-900 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Points */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Associated Market Points
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={marketPointInput}
                  onChange={(e) => setMarketPointInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addMarketPointId()}
                  placeholder="Enter Market Point ID and press Add"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  type="button"
                  variant="primary"
                  onClick={addMarketPointId}
                  size="small"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.marketPointsId.map((id, index) => (
                  <div
                    key={index}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    <span className="text-sm">{id}</span>
                    <button
                      type="button"
                      onClick={() => removeMarketPointId(index)}
                      className="text-green-600 hover:text-green-900 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Additional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Discount (%)"
                name="discount"
                type="number"
                value={formData.discount}
                onChange={handleFormChange}
                step="0.1"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 justify-end pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isUpdating}
              loading={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update Doctor"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditDoctor;
