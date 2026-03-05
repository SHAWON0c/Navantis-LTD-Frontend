import React from "react";
import { useAuth } from "../../provider/AuthProvider";


export default function UserDashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600 text-lg">Loading user info...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-red-600 text-lg">You are not logged in.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Sticky Header */}
      {/* <header className="w-full bg-blue-800 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">welcome</h1>
          <span className="font-medium">{user.name || "User"}</span>
        </div>
      </header> */}

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Profile Information</h2>
            <div className="space-y-2 text-gray-700">
              <p><span className="font-medium">Name:</span> {user.name || "N/A"}</p>
              <p><span className="font-medium">Employee ID:</span> {user.employeeId}</p>
              <p><span className="font-medium">Email:</span> {user.email}</p>
              <p><span className="font-medium">Role:</span> {user.role}</p>
            </div>
          </div>

          {/* Professional Access Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Professional Access</h2>
            <p className="text-gray-700">
              Here you can access resources and tools assigned to your role. 
              For any access issues, contact <span className="font-medium">HR</span>, <span className="font-medium">Admin</span>, or <span className="font-medium">IT</span>.
            </p>
          </div>

          {/* Role Updates Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Role Updates</h2>
            <p className="text-gray-700">
              Your role and permissions are updated automatically in the system. Any new features or tools will appear here when available.
            </p>
          </div>

          {/* Tips & Notes Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Tips & Notes</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Keep your credentials confidential.</li>
              <li>All activities are logged for security.</li>
              <li>Contact Admin/IT for technical support or access issues.</li>
              <li>Regularly update your password and profile info.</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-200 text-gray-700 py-4 text-center mt-auto">
        &copy; {new Date().getFullYear()} Your Organization. All rights reserved.
      </footer>
    </div>
  );
}