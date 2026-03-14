import React, { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import Loader from "../component/Loader";
import { useUserProfile } from "../hooks/useUserProfile";

const formatLabel = (key = "") => {
  return String(key)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[._-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());
};

const isDateLike = (value) => {
  if (typeof value !== "string") return false;
  if (!value.includes("-") && !value.includes("T")) return false;
  return !Number.isNaN(Date.parse(value));
};

const parseJSONSafe = (value) => {
  if (typeof value !== "string") return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const renderValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return <span className="text-gray-400">N/A</span>;
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "number") {
    return value.toLocaleString();
  }

  if (isDateLike(value)) {
    return new Date(value).toLocaleString();
  }

  if (Array.isArray(value)) {
    if (!value.length) return <span className="text-gray-400">N/A</span>;
    return value.join(", ");
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value).trim() || <span className="text-gray-400">N/A</span>;
};

const FieldGrid = ({ fields }) => {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {fields.map((field) => (
        <div key={field.label} className="rounded-lg border border-gray-200 bg-white p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{field.label}</p>
          <p className="mt-1 text-sm font-semibold text-gray-800">{renderValue(field.value)}</p>
        </div>
      ))}
    </div>
  );
};

const UserProfile = () => {
  const { data, error, isLoading } = useUserProfile();

  const profile = data?.data || null;
  const org = profile?.organizationProfile || {};

  const sections = useMemo(() => {
    if (!profile) return [];

    const knownRootKeys = new Set([
      "_id",
      "employeeId",
      "email",
      "role",
      "isVerified",
      "createdAt",
      "updatedAt",
      "__v",
      "organizationProfile",
    ]);

    const knownOrgKeys = new Set([
      "_id",
      "userId",
      "identity",
      "education",
      "employment",
      "payroll",
      "leaveInfo",
      "shiftInfo",
      "healthInfo",
      "emergencyContact",
      "assets",
      "exitInfo",
      "history",
      "name",
      "phone",
      "email",
      "profilePic",
      "fathersName",
      "mothersName",
      "dateOfBirth",
      "bloodGroup",
      "presentAddress",
      "permanentAddress",
      "createdAt",
      "updatedAt",
      "__v",
    ]);

    const rootExtras = Object.entries(profile).filter(([key]) => !knownRootKeys.has(key));
    const orgExtras = Object.entries(org).filter(([key]) => !knownOrgKeys.has(key));

    return [
      {
        id: "basic-info",
        title: "Basic Info",
        fields: [
          { label: "User ID", value: profile._id },
          { label: "Employee ID", value: profile.employeeId },
          { label: "Email", value: profile.email },
          { label: "Role", value: profile.role },
          { label: "Verified", value: profile.isVerified },
          { label: "Created At", value: profile.createdAt },
          { label: "Updated At", value: profile.updatedAt },
          { label: "Version", value: profile.__v },
        ],
      },
      {
        id: "personal-info",
        title: "Personal Info",
        fields: [
          { label: "Name", value: org.name },
          { label: "Phone", value: org.phone },
          { label: "Email", value: org.email },
          { label: "Father's Name", value: org.fathersName },
          { label: "Mother's Name", value: org.mothersName },
          { label: "Date of Birth", value: org.dateOfBirth },
          { label: "Blood Group", value: org.bloodGroup },
          { label: "Present Address", value: org.presentAddress },
          { label: "Permanent Address", value: org.permanentAddress },
        ],
      },
      {
        id: "identity",
        title: "Identity",
        fields: [
          { label: "NID Number", value: org.identity?.nidNumber },
          { label: "Passport Number", value: org.identity?.passportNumber },
          { label: "Driving License", value: org.identity?.drivingLicenseNumber },
          { label: "TIN Number", value: org.identity?.tinNumber },
          { label: "NID Verified", value: org.identity?.isNidVerified },
        ],
      },
      {
        id: "education",
        title: "Education",
        fields: [
          { label: "Highest Education", value: org.education?.highestEducation },
          { label: "Institution", value: org.education?.institution },
          { label: "Passing Year", value: org.education?.passingYear },
        ],
      },
      {
        id: "employment",
        title: "Employment",
        fields: [
          { label: "Employee Code", value: org.employment?.employeeCode },
          { label: "Designation", value: org.employment?.designation },
          { label: "Department", value: org.employment?.department },
          { label: "Grade", value: org.employment?.grade },
          { label: "Workplace", value: org.employment?.workplace },
          { label: "Employment Type", value: org.employment?.employmentType },
          { label: "Reporting Manager ID", value: org.employment?.reportingManagerId },
          { label: "Territory ID", value: org.employment?.territoryId },
          { label: "Market Points", value: org.employment?.marketPoints },
          { label: "Joined At", value: org.employment?.joinedAt },
          { label: "Probation End Date", value: org.employment?.probationEndDate },
          { label: "Confirmation Date", value: org.employment?.confirmationDate },
          { label: "Employment Status", value: org.employment?.employmentStatus },
        ],
      },
      {
        id: "payroll",
        title: "Payroll",
        fields: [
          { label: "Basic Salary", value: org.payroll?.basicSalary },
          { label: "Gross Salary", value: org.payroll?.grossSalary },
          { label: "Payment Method", value: org.payroll?.paymentMethod },
          { label: "Bank Name", value: org.payroll?.bankName },
          { label: "Account Number", value: org.payroll?.accountNumber },
          { label: "Salary Hold", value: org.payroll?.isSalaryHold },
        ],
      },
      {
        id: "leave-info",
        title: "Leave Info",
        fields: [
          { label: "Casual", value: org.leaveInfo?.casual },
          { label: "Sick", value: org.leaveInfo?.sick },
          { label: "Annual", value: org.leaveInfo?.annual },
        ],
      },
      {
        id: "shift-info",
        title: "Shift Info",
        fields: [
          { label: "Shift Name", value: org.shiftInfo?.shiftName },
          { label: "Weekly Off", value: org.shiftInfo?.weeklyOff },
        ],
      },
      {
        id: "health-info",
        title: "Health Info",
        fields: [
          { label: "Medical Conditions", value: org.healthInfo?.medicalConditions },
          { label: "Allergies", value: org.healthInfo?.allergies },
          { label: "Insurance Policy No", value: org.healthInfo?.insurancePolicyNo },
        ],
      },
      {
        id: "emergency-contact",
        title: "Emergency Contact",
        fields: [
          { label: "Name", value: org.emergencyContact?.name },
          { label: "Relation", value: org.emergencyContact?.relation },
          { label: "Phone", value: org.emergencyContact?.phone },
        ],
      },
      {
        id: "assets",
        title: "Assets",
        fields: [
          { label: "Laptop Serial", value: org.assets?.laptopSerial },
          { label: "Mobile IMEI", value: org.assets?.mobileIMEI },
          { label: "SIM Number", value: org.assets?.simNumber },
          { label: "Company Email", value: org.assets?.companyEmail },
          { label: "Access Card ID", value: org.assets?.accessCardId },
        ],
      },
      {
        id: "exit-info",
        title: "Exit Info",
        fields: [
          { label: "Resignation Date", value: org.exitInfo?.resignationDate },
          { label: "Last Working Day", value: org.exitInfo?.lastWorkingDay },
          { label: "Exit Reason", value: org.exitInfo?.exitReason },
          { label: "Clearance Status", value: org.exitInfo?.clearanceStatus },
        ],
      },
      {
        id: "history",
        title: "Profile History",
        history: org.history || [],
      },
      ...rootExtras.map(([key, value]) => ({
        id: `root-extra-${key}`,
        title: `Root Extra: ${formatLabel(key)}`,
        fields: [{ label: formatLabel(key), value }],
      })),
      ...orgExtras.map(([key, value]) => ({
        id: `org-extra-${key}`,
        title: `Profile Extra: ${formatLabel(key)}`,
        fields: [{ label: formatLabel(key), value }],
      })),
      {
        id: "raw-json",
        title: "Raw JSON",
        raw: profile,
      },
    ];
  }, [profile, org]);

  const [activeId, setActiveId] = useState("basic-info");

  const activeSection =
    sections.find((section) => section.id === activeId) || sections[0];

  if (isLoading) return <Loader />;

  if (error || !profile) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">
        No user profile data found.
      </div>
    );
  }

  return (
<div className="min-h-[calc(100vh-7rem)] bg-gray-100 p-2 md:p-4">
  <div className="grid grid-cols-1 gap-4 md:grid-cols-[300px_1fr]">
       <aside className="h-fit rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:sticky md:top-4">
          <div className="mb-4 border-b border-gray-200 pb-4">
            <div className="flex items-center gap-3">
              <img
                src={org.profilePic || "/images/NPL-Logo2.png"}
                alt="Profile"
                className="h-14 w-14 rounded-full border border-gray-200 object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900">{renderValue(org.name || profile.email)}</p>
                <p className="text-xs text-gray-500">{renderValue(profile.employeeId)}</p>
              </div>
            </div>
          </div>

          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">Profile Topics</h2>
          <nav className="space-y-1">
            {sections.map((section) => {
              const isActive = section.id === activeId;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveId(section.id)}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition ${
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span>{section.title}</span>
                  {isActive && <CheckCircle2 size={16} className="text-primary-600" />}
                </button>
              );
            })}
          </nav>
        </aside>

         <main className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 border-b border-gray-200 pb-4">
            <h3 className="text-2xl font-semibold text-gray-900">{activeSection?.title}</h3>
            <p className="mt-1 text-sm text-gray-500">Topic-wise data from your API JSON.</p>
          </div>

          {!!activeSection?.fields && <FieldGrid fields={activeSection.fields} />}

          {!!activeSection?.history && (
            <div className="space-y-3">
              {activeSection.history.length ? (
                activeSection.history.map((item, index) => {
                  const parsed = parseJSONSafe(item?.newValue);
                  return (
                    <div key={item?._id || index} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-500">Action</p>
                          <p className="text-sm font-semibold text-gray-800">{renderValue(item?.action)}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-500">Date</p>
                          <p className="text-sm font-semibold text-gray-800">{renderValue(item?.date)}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-500">Updated By</p>
                          <p className="text-sm font-semibold text-gray-800">{renderValue(item?.updatedBy)}</p>
                        </div>
                      </div>

                      {parsed ? (
                        <details className="mt-3 rounded-md border border-gray-200 bg-white p-3">
                          <summary className="cursor-pointer text-sm font-semibold text-primary-700">
                            View Parsed newValue JSON
                          </summary>
                          <pre className="mt-3 overflow-auto rounded bg-gray-900 p-3 text-xs text-green-200">
                            {JSON.stringify(parsed, null, 2)}
                          </pre>
                        </details>
                      ) : (
                        <div className="mt-3">
                          <p className="text-xs uppercase tracking-wide text-gray-500">newValue</p>
                          <p className="break-all text-sm text-gray-700">{renderValue(item?.newValue)}</p>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500">No history available.</p>
              )}
            </div>
          )}

          {!!activeSection?.raw && (
            <pre className="max-h-140 overflow-auto rounded-lg border border-gray-200 bg-gray-900 p-4 text-xs text-green-200">
              {JSON.stringify(activeSection.raw, null, 2)}
            </pre>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserProfile;
