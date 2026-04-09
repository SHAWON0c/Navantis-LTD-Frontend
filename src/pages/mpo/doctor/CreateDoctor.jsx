import React, { useState, useEffect } from "react";
import { useCreateDoctorMutation } from "../../../redux/features/doctor/doctorApi";
import { useAuth } from "../../../provider/AuthProvider";
import Loader from "../../../component/Loader";
import Button from "../../../component/common/Button";
import Card from "../../../component/common/Card";
import FormInput from "../../../component/common/FormInput";
import FormSelect from "../../../component/common/FormSelect";
import { MdArrowBack } from "react-icons/md";
import { ChevronRight, Check } from "lucide-react";
import toast from "react-hot-toast";

const STEPS = [
  { id: 1, title: "Personal Information", description: "Basic details" },
  { id: 2, title: "Professional Information", description: "Qualification & License" },
  { id: 3, title: "Practice Information", description: "Practice details" },
  { id: 4, title: "Chamber Information", description: "Chamber address" },
  { id: 5, title: "Location Information", description: "Geographic location" },
  { id: 6, title: "Associated Entities", description: "Chemists & Market Points" },
  { id: 7, title: "Review & Submit", description: "Confirm information" },
];

const CreateDoctor = () => {
  const { userInfo, loading: authLoading } = useAuth();
  const [createDoctor, { isLoading }] = useCreateDoctorMutation();
  const [currentStep, setCurrentStep] = useState(1);

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

  // Validation functions for each step
  const validateStep = (step) => {
    switch (step) {
      case 1: // Personal Information
        if (!formData.doctorName.trim()) {
          toast.error("Doctor name is required");
          return false;
        }
        if (!formData.mobileNo.trim()) {
          toast.error("Mobile number is required");
          return false;
        }
        if (!formData.email.trim()) {
          toast.error("Email is required");
          return false;
        }
        return true;

      case 2: // Professional Information
        if (!formData.qualification.trim()) {
          toast.error("Qualification is required");
          return false;
        }
        return true;

      case 3: // Practice Information
        if (!formData.practiceDay.trim()) {
          toast.error("Practice days are required");
          return false;
        }
        return true;

      case 4: // Chamber Information
        if (formData.hasChamber && !formData.chamberAddress.trim()) {
          toast.error("Chamber address is required if chamber exists");
          return false;
        }
        return true;

      case 5: // Location Information
        if (!formData.location.division) {
          toast.error("Division is required");
          return false;
        }
        return true;

      case 6: // Associated Entities
        if (formData.chemistId.length === 0) {
          toast.error("At least one chemist must be associated");
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation
    if (!validateStep(6)) {
      return;
    }

    try {
      const payload = {
        ...formData,
        passingYear: Number(formData.passingYear),
        avgPatientPerWeek: Number(formData.avgPatientPerWeek),
        avgPatientPerDay: Number(formData.avgPatientPerDay),
        discount: Number(formData.discount),
      };

      const response = await createDoctor(payload).unwrap();

      if (response.success) {
        toast.success(response.message || "Doctor created successfully!");

        // Reset form
        setFormData({
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
        setCurrentStep(1);
      }
    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to create doctor. Please try again."
      );
    }
  };

  if (authLoading) return <Loader />;

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
                <span className="text-gray-900 font-bold">CREATE DOCTOR</span>
              </h2>
            </div>
          </div>
        </div>
      </Card>

      {/* Stepper */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex-1">
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                    currentStep >= step.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check size={20} />
                  ) : (
                    step.id
                  )}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      currentStep > step.id ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
              <p className="text-xs font-semibold text-gray-700 mt-2">
                {step.title}
              </p>
            </div>
          ))}
        </div>

        {/* Step Info */}
        <div className="mb-2">
          <p className="text-sm text-gray-600">
            Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].title}
          </p>
          <p className="text-xs text-gray-500">{STEPS[currentStep - 1].description}</p>
        </div>
      </Card>

      {/* Form Card */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: Personal Information */}
          {currentStep === 1 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b">
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
          )}

          {/* STEP 2: Professional Information */}
          {currentStep === 2 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b">
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
                  label="Qualification *"
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
          )}

          {/* STEP 3: Practice Information */}
          {currentStep === 3 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b">
                Practice Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Practice Days *"
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
          )}

          {/* STEP 4: Chamber Information */}
          {currentStep === 4 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b">
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
              {!formData.hasChamber && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    No chamber information required as you indicated no chamber.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Location Information */}
          {currentStep === 5 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b">
                Location Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Division *"
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
          )}

          {/* STEP 6: Associated Entities */}
          {currentStep === 6 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b">
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
                {formData.chemistId.length > 0 && (
                  <p className="text-xs text-green-600 mt-2">
                    ✓ {formData.chemistId.length} chemist(s) added
                  </p>
                )}
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

              {/* Discount */}
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
          )}

          {/* STEP 7: Review & Submit */}
          {currentStep === 7 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b">
                Review Information
              </h3>

              <div className="space-y-6">
                {/* Personal Info Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Personal Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Doctor Name:</p>
                      <p className="font-semibold text-gray-900">{formData.doctorName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email:</p>
                      <p className="font-semibold text-gray-900">{formData.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Mobile:</p>
                      <p className="font-semibold text-gray-900">{formData.mobileNo}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Designation:</p>
                      <p className="font-semibold text-gray-900">{formData.designation || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* Professional Info Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Professional Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Qualification:</p>
                      <p className="font-semibold text-gray-900">{formData.qualification}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Speciality:</p>
                      <p className="font-semibold text-gray-900">{formData.speciality || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Institute:</p>
                      <p className="font-semibold text-gray-900">{formData.passingInstituteName || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">License:</p>
                      <p className="font-semibold text-gray-900">{formData.doctorLicense || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* Practice Info Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Practice Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Practice Days:</p>
                      <p className="font-semibold text-gray-900">{formData.practiceDay}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Type:</p>
                      <p className="font-semibold text-gray-900 capitalize">{formData.practicingType}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Patients/Week:</p>
                      <p className="font-semibold text-gray-900">{formData.avgPatientPerWeek}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Location:</p>
                      <p className="font-semibold text-gray-900">
                        {formData.location.division}, {formData.location.district}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Associated Entities Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Associated Entities</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-gray-600 text-sm mb-2">Chemists: {formData.chemistId.length}</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.chemistId.map((id, i) => (
                          <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            {id}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm mb-2">Market Points: {formData.marketPointsId.length}</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.marketPointsId.map((id, i) => (
                          <span key={i} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                            {id}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Final Notice */}
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                  <p className="text-sm text-blue-900">
                    <strong>Note:</strong> Once submitted, the doctor will be created with "pending" status and will go through the approval workflow.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 justify-between pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              ← Previous
            </Button>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>

              {currentStep < STEPS.length ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleNext}
                >
                  Next →
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading}
                  loading={isLoading}
                >
                  {isLoading ? "Creating..." : "Create Doctor"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateDoctor;
