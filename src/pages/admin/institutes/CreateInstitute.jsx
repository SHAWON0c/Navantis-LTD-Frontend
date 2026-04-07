import React, { useState, useRef, useEffect, useMemo } from "react";
import { useAuth } from "../../../provider/AuthProvider";
import Loader from "../../../component/Loader";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import { useCreateInstituteMutation } from "../../../redux/features/institutes/instituteApi";
import Card from "../../../component/common/Card";
import { MdArrowBack } from "react-icons/md";
import Button from "../../../component/common/Button";
import { ChevronRight } from "lucide-react";

const CreateInstitute = () => {
  const { userInfo, loading: authLoading } = useAuth();
  const [createInstitute] = useCreateInstituteMutation();

  // Form state
  const [formData, setFormData] = useState({
    instituteName: "",
    tradeLicense: "",
    drugLicense: "",
    address: "",
    mobile: "",
    email: "",
    contactPerson: "",
    discount: 0,
    payMode: [],
    creditLimit: "",
    dayLimit: "",
  });

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => {
        const updatedPayMode = checked
          ? [...prev.payMode, value]
          : prev.payMode.filter((p) => p !== value);
        return { ...prev, payMode: updatedPayMode };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Validation function
  const validateForm = () => {
    const errors = [];

    // Required fields
    if (!formData.instituteName?.trim()) errors.push("Institute Name is required");
    if (!formData.tradeLicense?.trim()) errors.push("Trade License is required");
    if (!formData.drugLicense?.trim()) errors.push("Drug License is required");
    if (!formData.address?.trim()) errors.push("Address is required");
    if (!formData.mobile?.trim()) errors.push("Mobile is required");
    if (!formData.email?.trim()) errors.push("Email is required");
    if (!formData.contactPerson?.trim()) errors.push("Contact Person is required");
    if (formData.payMode.length === 0) errors.push("Pay Mode is required (select at least one)");

    // Conditional validation for Credit/STC/SPIC
    const hasCreditMode = formData.payMode.some((mode) => ["credit", "stc", "spic"].includes(mode));
    const hasCreditOrSpic = formData.payMode.some((mode) => ["credit", "spic"].includes(mode));

    if (hasCreditMode) {
      if (!formData.creditLimit || formData.creditLimit <= 0) errors.push("Credit Limit is required when Credit/STC/SPIC is selected");
    }
    
    if (hasCreditOrSpic) {
      if (!formData.dayLimit || formData.dayLimit <= 0) errors.push("Day Limit is required when Credit/SPIC is selected");
    }

    return errors;
  };

  // Get field error messages
  const getFieldErrorMessage = (fieldName) => {
    const validationErrors = validateForm();
    return validationErrors.find((error) => error.includes(fieldName)) || null;
  };

  const submitPayload = useMemo(() => {
    return {
      instituteName: formData.instituteName,
      tradeLicense: formData.tradeLicense,
      drugLicense: formData.drugLicense,
      address: formData.address,
      mobile: formData.mobile,
      email: formData.email,
      contactPerson: formData.contactPerson,
      discount: Number(formData.discount) || 0,
      payMode: formData.payMode,
      creditLimit: Number(formData.creditLimit) || 0,
      dayLimit: Number(formData.dayLimit) || 0,
    };
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      await Swal.fire({
        icon: "error",
        title: "Validation Error",
        html: `
          <div class="text-left">
            <p class="mb-3 font-semibold text-gray-700">Please fix the following required fields:</p>
            <ul class="space-y-2">
              ${validationErrors.map((error) => `<li class="flex items-start gap-2"><span class="text-red-500 mt-1">•</span><span class="text-gray-700">${error}</span></li>`).join("")}
            </ul>
          </div>
        `,
        confirmButtonText: "Got it",
        confirmButtonColor: "#ef4444",
        allowOutsideClick: false,
      });
      return;
    }

    try {
      await createInstitute(submitPayload).unwrap();
      
      // Show success modal
      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Institute created successfully and sent for MD approval!",
        confirmButtonColor: "#3b82f6",
      });

      // Reset form
      setFormData({
        instituteName: "",
        tradeLicense: "",
        drugLicense: "",
        address: "",
        mobile: "",
        email: "",
        contactPerson: "",
        discount: 0,
        payMode: [],
        creditLimit: "",
        dayLimit: "",
      });
      window.history.back();
    } catch (err) {
      console.error(err);
      const errorMessage = err?.data?.message || "Failed to create institute.";
      
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "#ef4444",
      });
    }
  };

  if (authLoading) return <Loader />;

  return (
    <div className="mx-auto">
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="small" icon={MdArrowBack} onClick={() => window.history.back()}
              className="ml-2">
              Back
            </Button>
            <div className="bg-white text-gray-500 flex items-center px-3 sm:px-4 md:px-6 py-2 sm:h-12">
              <h2 className="flex flex-wrap items-center text-xs sm:text-sm md:text-base font-semibold text-gray-800 gap-1 sm:gap-2">
                <span>EMS</span>
                <ChevronRight size={14} className="text-gray-400" />
                <span>Admin</span>
                <ChevronRight size={14} className="text-gray-400" />
                <span className="text-gray-900 font-bold">CREATE INSTITUTE</span>
              </h2>
            </div>
          </div>
        </div>
      </Card>

      <form onSubmit={handleSubmit} className="mx-auto bg-white rounded-lg shadow-md p-10 space-y-4 mt-4">
        {/* Institute Name */}
        <Input 
          label="Institute Name" 
          name="instituteName" 
          value={formData.instituteName} 
          onChange={handleFormChange}
          required={true}
          error={getFieldErrorMessage("Institute Name")}
        />

        {/* Licenses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Trade License" 
            name="tradeLicense" 
            value={formData.tradeLicense} 
            onChange={handleFormChange}
            required={true}
            error={getFieldErrorMessage("Trade License")}
          />
          <Input 
            label="Drug License" 
            name="drugLicense" 
            value={formData.drugLicense} 
            onChange={handleFormChange}
            required={true}
            error={getFieldErrorMessage("Drug License")}
          />
        </div>

        {/* Address */}
        <Input 
          label="Address" 
          name="address" 
          value={formData.address} 
          onChange={handleFormChange}
          required={true}
          error={getFieldErrorMessage("Address")}
          placeholder="Street address, city, country"
        />

        {/* Mobile & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Mobile" 
            name="mobile" 
            value={formData.mobile} 
            onChange={handleFormChange}
            required={true}
            error={getFieldErrorMessage("Mobile")}
            placeholder="+92-300-1234567"
          />
          <Input 
            label="Email" 
            name="email" 
            value={formData.email} 
            onChange={handleFormChange}
            required={true}
            error={getFieldErrorMessage("Email")}
            type="email"
          />
        </div>

        {/* Contact Person */}
        <Input 
          label="Contact Person" 
          name="contactPerson" 
          value={formData.contactPerson} 
          onChange={handleFormChange}
          required={true}
          error={getFieldErrorMessage("Contact Person")}
        />

        {/* Discount & Pay Mode */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Discount (%)" 
            name="discount" 
            type="number" 
            value={formData.discount} 
            onChange={handleFormChange}
            required={false}
            placeholder="0-100"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pay Mode <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4 flex-wrap">
              {["cash", "credit", "stc", "spic"].map((mode) => (
                <label key={mode} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="payMode"
                    value={mode}
                    checked={formData.payMode.includes(mode)}
                    onChange={handleFormChange}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700 cursor-pointer">
                    {mode.toUpperCase()}
                  </span>
                </label>
              ))}
            </div>
            {getFieldErrorMessage("Pay Mode") && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <span>⚠</span>{getFieldErrorMessage("Pay Mode")}
              </p>
            )}
          </div>
        </div>

        {/* Credit Limit & Day Limit - Conditional Display */}
        {formData.payMode.some((mode) => ["credit", "stc", "spic"].includes(mode)) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Credit Limit - Show for credit, stc, spic */}
            <Input 
              label="Credit Limit" 
              name="creditLimit" 
              type="number" 
              value={formData.creditLimit} 
              onChange={handleFormChange}
              required={true}
              placeholder="Enter credit limit"
              error={getFieldErrorMessage("Credit Limit")}
            />
            
            {/* Day Limit - Show only for credit and spic (NOT for stc) */}
            {formData.payMode.some((mode) => ["credit", "spic"].includes(mode)) && (
              <Input 
                label="Day Limit" 
                name="dayLimit" 
                type="number" 
                value={formData.dayLimit} 
                onChange={handleFormChange}
                required={true}
                placeholder="Enter day limit"
                error={getFieldErrorMessage("Day Limit")}
              />
            )}
          </div>
        )}

        {/* JSON Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Request JSON Preview</label>
          <pre className="w-full rounded border border-gray-200 bg-gray-50 p-3 text-xs overflow-x-auto text-gray-700">
{JSON.stringify(submitPayload, null, 2)}
          </pre>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="primary"
            type="submit"
          >
            Create Institute
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

// Input Component
const Input = ({ label, required = false, error = null, ...props }) => (
  <div className="mb-2">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input 
      {...props} 
      className={`w-full border rounded p-2 bg-white transition-colors ${
        error
          ? "border-red-500 bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300"
          : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
      }`}
    />
    {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span>⚠</span>{error}</p>}
  </div>
);

export default CreateInstitute;
