import React from "react";

export default function UserDashboard() {
  // For now, we won't check the user or roles

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl w-full bg-white p-10 rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-3xl font-bold mb-4 text-blue-800">Welcome!</h1>
        <p className="text-gray-700 mb-6">
          This is your professional User Dashboard.
        </p>

        {/* Dashboard Sections */}
        <div className="space-y-6">
          {/* Profile Info */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-2">Profile Information</h2>
            <p><span className="font-medium">Employee ID:</span> EMP-XXXX</p>
            <p><span className="font-medium">Email:</span> user@example.com</p>
            <p><span className="font-medium">Role:</span> user</p>
          </div>

          {/* Professional Guidance */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-2">Professional Access</h2>
            <p>
              Here you can access resources and tools assigned to your role. 
              For any access issues, contact <span className="font-medium">HR</span>, <span className="font-medium">Admin</span>, or <span className="font-medium">IT</span>.
            </p>
          </div>

          {/* Role Update Info */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-2">Role Updates</h2>
            <p>
              If your role is updated in the system, your dashboard will automatically reflect new permissions and available features.
            </p>
          </div>

          {/* Notes / Tips */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-2">Tips & Notes</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Keep your credentials confidential.</li>
              <li>All activities are logged for security.</li>
              <li>Contact Admin/IT for technical support or access issues.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
