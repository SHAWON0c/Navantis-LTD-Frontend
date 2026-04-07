// import React, { useState, useRef, useEffect } from "react";
// import { useAuth } from "../../../provider/AuthProvider";
// import Loader from "../../../component/Loader";


// const CreateCustomer = ({ territories = [], marketPoints = [] }) => {
//   const { userInfo, loading: authLoading } = useAuth();
//   const [createCustomer, { isLoading }] = useCreateCustomerMutation();

//   // Form state
//   const [formData, setFormData] = useState({
//     customerName: "",
//     territoryId: "",
//     marketPointId: "",
//     tradeLicense: "",
//     drugLicense: "",
//     address: "",
//     mobile: "",
//     mobileNormalized: "",
//     email: "",
//     emailNormalized: "",
//     contactPerson: "",
//     discount: 0,
//     payMode: [],
//     creditLimit: "",
//     dayLimit: "",
//     refundCredit: { amount: 0, updatedAt: null },
//     addedByName: userInfo?.name || "",
//     addedByEmail: userInfo?.email || "",
//   });

//   useEffect(() => {
//     if (userInfo) {
//       setFormData((prev) => ({
//         ...prev,
//         addedByName: userInfo.name || "",
//         addedByEmail: userInfo.email || "",
//       }));
//     }
//   }, [userInfo]);

//   // Dropdown refs
//   const territoryRef = useRef();
//   const marketRef = useRef();
//   const [territoryOpen, setTerritoryOpen] = useState(false);
//   const [marketOpen, setMarketOpen] = useState(false);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (territoryRef.current && !territoryRef.current.contains(e.target)) setTerritoryOpen(false);
//       if (marketRef.current && !marketRef.current.contains(e.target)) setMarketOpen(false);
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleFormChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     if (type === "checkbox") {
//       setFormData((prev) => {
//         let updatedPayMode = [...prev.payMode];
//         if (checked) updatedPayMode.push(value);
//         else updatedPayMode = updatedPayMode.filter((p) => p !== value);
//         return { ...prev, payMode: updatedPayMode };
//       });
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//       if (name === "mobile") setFormData((prev) => ({ ...prev, mobileNormalized: value }));
//       if (name === "email") setFormData((prev) => ({ ...prev, emailNormalized: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await createCustomer(formData).unwrap();
//       alert("Customer created successfully!");
//       setFormData({
//         customerName: "",
//         territoryId: "",
//         marketPointId: "",
//         tradeLicense: "",
//         drugLicense: "",
//         address: "",
//         mobile: "",
//         mobileNormalized: "",
//         email: "",
//         emailNormalized: "",
//         contactPerson: "",
//         discount: 0,
//         payMode: [],
//         creditLimit: "",
//         dayLimit: "",
//         refundCredit: { amount: 0, updatedAt: null },
//         addedByName: userInfo?.name || "",
//         addedByEmail: userInfo?.email || "",
//       });
//       setTerritoryOpen(false);
//       setMarketOpen(false);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to create customer.");
//     }
//   };

//   if (authLoading) return <Loader />;

//   // Filter market points by selected territory
//   const filteredMarketPoints = formData.territoryId
//     ? marketPoints.filter((m) => m.territoryId === formData.territoryId)
//     : marketPoints;

//   return (
//     <div className="mx-auto p-2">
//       <div className="bg-white text-gray-500 h-12 flex items-center px-6">
//         <h2 className="text-base font-bold">NPL / Admin / Create Customer</h2>
//       </div>

//       <div className="mx-auto bg-white rounded-lg shadow-md p-10 space-y-2 mt-4">
//         {/* Customer Name */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Input
//             label="Customer Name"
//             name="customerName"
//             value={formData.customerName}
//             onChange={handleFormChange}
//           />

//           {/* Territory Dropdown */}
//           <div ref={territoryRef} className="relative">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Territory</label>
//             <div className="relative">
//               <input
//                 type="text"
//                 readOnly
//                 value={territories.find((t) => t._id === formData.territoryId)?.name || ""}
//                 placeholder="Select territory"
//                 onClick={() => setTerritoryOpen((p) => !p)}
//                 className="w-full border border-gray-300 rounded p-2 pr-8 cursor-pointer"
//               />
//               <svg
//                 className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//               </svg>
//             </div>

//             {territoryOpen && (
//               <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow max-h-40 overflow-y-auto mt-1">
//                 {territories.length === 0 ? (
//                   <li className="p-2 text-gray-500">No territories</li>
//                 ) : (
//                   territories.map((t) => (
//                     <li
//                       key={t._id}
//                       className="p-2 hover:bg-blue-100 cursor-pointer"
//                       onClick={() => {
//                         setFormData((prev) => ({
//                           ...prev,
//                           territoryId: t._id,
//                           marketPointId: "", // reset market point when territory changes
//                         }));
//                         setTerritoryOpen(false);
//                       }}
//                     >
//                       {t.name}
//                     </li>
//                   ))
//                 )}
//               </ul>
//             )}
//           </div>
//         </div>

//         {/* Market Point Dropdown */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div ref={marketRef} className="relative">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Market Point</label>
//             <div className="relative">
//               <input
//                 type="text"
//                 readOnly
//                 value={filteredMarketPoints.find((m) => m._id === formData.marketPointId)?.name || ""}
//                 placeholder="Select market point"
//                 onClick={() => formData.territoryId && setMarketOpen((p) => !p)}
//                 disabled={!formData.territoryId}
//                 className={`w-full border rounded p-2 pr-8 ${
//                   formData.territoryId
//                     ? "border-gray-300 cursor-pointer"
//                     : "border-gray-200 bg-gray-100 cursor-not-allowed text-gray-400"
//                 }`}
//               />
//               <svg
//                 className={`w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none ${
//                   !formData.territoryId && "text-gray-300"
//                 }`}
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//               </svg>
//             </div>

//             {marketOpen && formData.territoryId && (
//               <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow max-h-40 overflow-y-auto mt-1">
//                 {filteredMarketPoints.length === 0 ? (
//                   <li className="p-2 text-gray-500">No market points</li>
//                 ) : (
//                   filteredMarketPoints.map((m) => (
//                     <li
//                       key={m._id}
//                       className="p-2 hover:bg-blue-100 cursor-pointer"
//                       onClick={() => {
//                         setFormData((prev) => ({ ...prev, marketPointId: m._id }));
//                         setMarketOpen(false);
//                       }}
//                     >
//                       {m.name}
//                     </li>
//                   ))
//                 )}
//               </ul>
//             )}
//           </div>
//         </div>

//         {/* Rest of the form (licenses, contact, credit, pay mode, added by) remains the same... */}
//         {/* You can reuse previous code for the lower sections */}
//       </div>
//     </div>
//   );
// };

// // Input component
// const Input = ({ label, ...props }) => (
//   <div className="mb-2">
//     <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
//     <input {...props} className="w-full border border-gray-300 rounded p-2 bg-white" />
//   </div>
// );

// export default CreateCustomer;


import React, { useState, useRef, useEffect, useMemo } from "react";
import { useAuth } from "../../../provider/AuthProvider";
import Loader from "../../../component/Loader";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import { useCreateCustomerMutation } from "../../../redux/features/customer/customerApi";
import { useGetTerritoriesWithMarketPointsQuery } from "../../../redux/features/teritory/territoryApi";
import { useUserProfile } from "../../../hooks/useUserProfile";
import Card from "../../../component/common/Card";
import { MdArrowBack } from "react-icons/md";
import Button from "../../../component/common/Button";
import { ChevronRight } from "lucide-react";

const CreateCustomer = () => {
  const { userInfo, loading: authLoading } = useAuth();
  const { data: userProfile } = useUserProfile();
  const [createCustomer] = useCreateCustomerMutation();

  // Fetch territories with market points
  const { data: territoryResponse, isLoading: territoriesLoading } = useGetTerritoriesWithMarketPointsQuery();
  const territoryData = territoryResponse?.data || [];

  // Get user role
  const userRole = String(userProfile?.role || localStorage.getItem("role") || "").toLowerCase();
  const isSuperAdmin = userRole === "superadmin";

  // Form state
  const [formData, setFormData] = useState({
    customerName: "",
    territoryId: "",
    marketPointId: "",
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
    mpoId: "",
  });

  // Dropdown refs
  const territoryRef = useRef();
  const marketRef = useRef();
  const [territoryOpen, setTerritoryOpen] = useState(false);
  const [marketOpen, setMarketOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (territoryRef.current && !territoryRef.current.contains(e.target)) setTerritoryOpen(false);
      if (marketRef.current && !marketRef.current.contains(e.target)) setMarketOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    if (!formData.customerName?.trim()) errors.push("Customer Name is required");
    if (!formData.territoryId) errors.push("Territory is required");
    if (!formData.marketPointId) errors.push("Market Point is required");
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
    const fallbackMpoId = userInfo?._id || userInfo?.id || userInfo?.mpoId;
    const resolvedMpoId = (formData.mpoId || "").trim() || fallbackMpoId;

    return {
      customerName: formData.customerName,
      marketPointId: formData.marketPointId,
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
      ...(resolvedMpoId ? { mpoId: resolvedMpoId } : {}),
    };
  }, [formData, userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      // Show professional error modal
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
      await createCustomer(submitPayload).unwrap();
      
      // Show success modal
      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Customer created successfully!",
        confirmButtonColor: "#3b82f6",
      });

      // Reset form
      setFormData({
        customerName: "",
        territoryId: "",
        marketPointId: "",
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
        mpoId: "",
      });
      setTerritoryOpen(false);
      setMarketOpen(false);
    } catch (err) {
      console.error(err);
      const errorMessage = err?.data?.message || "Failed to create customer.";
      
      // Show error modal
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "#ef4444",
      });
    }
  };

  if (authLoading || territoriesLoading) return <Loader />;

  // Filter market points based on selected territory
  const selectedTerritory = territoryData.find((t) => t._id === formData.territoryId);
  const filteredMarketPoints = selectedTerritory?.marketPoints || [];

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
                <span>MPO</span>
                <ChevronRight size={14} className="text-gray-400" />
                <span className="text-gray-900 font-bold">ADD NEW CUSTOMER</span>
              </h2>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-neutral-500 mr-2 sm:mr-4 md:mr-6">
            Total Products:
          </div>
        </div>
      </Card>

      <form onSubmit={handleSubmit} className="mx-auto bg-white rounded-lg shadow-md p-10 space-y-4 mt-4">
        {/* Customer Name */}
        <Input 
          label="Customer Name" 
          name="customerName" 
          value={formData.customerName} 
          onChange={handleFormChange}
          required={true}
          error={getFieldErrorMessage("Customer Name")}
        />

        {/* Territory & Market Point */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Territory */}
          <Dropdown
            label="Territory"
            options={territoryData}
            value={formData.territoryId}
            setValue={(id) => setFormData((prev) => ({ ...prev, territoryId: id, marketPointId: "" }))}
            displayKey="territoryName"
            refElement={territoryRef}
            isOpen={territoryOpen}
            setIsOpen={setTerritoryOpen}
            required={true}
            error={getFieldErrorMessage("Territory")}
          />

          {/* Market Point */}
          <Dropdown
            label="Market Point"
            options={filteredMarketPoints}
            value={formData.marketPointId}
            setValue={(id) => setFormData((prev) => ({ ...prev, marketPointId: id }))}
            displayKey="name"
            refElement={marketRef}
            isOpen={marketOpen}
            setIsOpen={setMarketOpen}
            disabled={!formData.territoryId}
            required={true}
            error={getFieldErrorMessage("Market Point")}
          />
        </div>

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
        />

        {/* Contact & Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Mobile" 
            name="mobile" 
            value={formData.mobile} 
            onChange={handleFormChange}
            required={true}
            error={getFieldErrorMessage("Mobile")}
          />
          <Input 
            label="Email" 
            name="email" 
            value={formData.email} 
            onChange={handleFormChange}
            required={true}
            error={getFieldErrorMessage("Email")}
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
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pay Mode <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              {["cash", "credit", "stc", "spic"].map((mode) => (
                <label key={mode} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name="payMode"
                    value={mode}
                    checked={formData.payMode.includes(mode)}
                    onChange={handleFormChange}
                  />
                  {mode.toUpperCase()}
                </label>
              ))}
            </div>
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

        {/* MPO ID - Only for SuperAdmin */}
        {isSuperAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="MPO ID"
              name="mpoId"
              value={formData.mpoId}
              onChange={handleFormChange}
              placeholder="Leave empty to use logged-in MPO"
              required={false}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Request JSON Preview</label>
          <pre className="w-full rounded border border-gray-200 bg-gray-50 p-3 text-xs overflow-x-auto text-gray-700">
{JSON.stringify(submitPayload, null, 2)}
          </pre>
        </div>

        <div className="flex gap-3">
          <Button
            variant="primary"
            type="submit"
            disabled={territoriesLoading}
          >
            Create Customer
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

// Reusable Dropdown Component
const Dropdown = ({ label, options, value, setValue, displayKey, refElement, isOpen, setIsOpen, disabled, required = false, error = null }) => (
  <div ref={refElement} className="relative">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <div className="relative">
      <input
        type="text"
        readOnly
        value={options.find((o) => o._id === value)?.[displayKey] || ""}
        placeholder={`Select ${label.toLowerCase()}`}
        onClick={() => !disabled && setIsOpen((p) => !p)}
        disabled={disabled}
        className={`w-full border rounded p-2 pr-8 transition-colors ${
          error
            ? "border-red-500 bg-red-50 cursor-pointer"
            : disabled
              ? "border-gray-200 bg-gray-100 cursor-not-allowed text-gray-400"
              : "border-gray-300 cursor-pointer focus:ring-2 focus:ring-blue-300"
        }`}
      />
      <svg
        className={`w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none ${
          error ? "text-red-500" : disabled ? "text-gray-300" : "text-gray-500"
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
    {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span>⚠</span>{error}</p>}

    {isOpen && (
      <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow max-h-40 overflow-y-auto mt-1">
        {options.length === 0 ? (
          <li className="p-2 text-gray-500">No options</li>
        ) : (
          options.map((o) => (
            <li
              key={o._id}
              className="p-2 hover:bg-blue-100 cursor-pointer"
              onClick={() => {
                setValue(o._id);
                setIsOpen(false);
              }}
            >
              {o[displayKey]}
            </li>
          ))
        )}
      </ul>
    )}
  </div>
);

export default CreateCustomer;
