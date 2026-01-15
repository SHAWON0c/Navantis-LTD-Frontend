import React from "react";

const ProfilePage = () => {
  // 🔹 Static user data
  const user = {
    employeeId: "EMP-1023",
    email: "shawon@example.com",
    role: "Sales Officer",
    isVerified: true,
  };

  // 🔹 Static organization profile data
  const organizationProfile = {
    profilePic:
      "https://i.pravatar.cc/150?img=12",
    name: "Shawon Ahmed",
    designation: "Medical Promotion Officer",
    workplace: "Square Pharmaceuticals",
    territory: "Dhaka North",
    phone: "+880 17XXXXXXX",
    area: "Gulshan",
    areaManager: "Rahim Uddin",
    zonalManager: "Karim Hossain",
    joinedAt: "2022-06-15",
    history: [
      {
        _id: "1",
        action: "Joined as MPO",
        date: "2022-06-15",
      },
      {
        _id: "2",
        action: "Promoted to Senior MPO",
        date: "2023-08-10",
      },
      {
        _id: "3",
        action: "Territory Changed to Dhaka North",
        date: "2024-02-05",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row items-center gap-6">
        <img
          src={organizationProfile.profilePic}
          alt="Profile"
          className="w-24 h-24 rounded-full border"
        />

        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold text-gray-800">
            {organizationProfile.name}
          </h1>
          <p className="text-gray-600">
            {organizationProfile.designation}
          </p>

          <div className="flex gap-2 justify-center md:justify-start mt-2">
            <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">
              {organizationProfile.workplace}
            </span>
            <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">
              {organizationProfile.territory}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Personal Info */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Info label="Employee ID" value={user.employeeId} />
            <Info label="Email" value={user.email} />
            <Info label="Phone" value={organizationProfile.phone} />
            <Info label="Area" value={organizationProfile.area} />
            <Info
              label="Area Manager"
              value={organizationProfile.areaManager}
            />
            <Info
              label="Zonal Manager"
              value={organizationProfile.zonalManager}
            />
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            Account
          </h2>

          <Info label="Role" value={user.role} />
          <Info
            label="Verified"
            value={user.isVerified ? "Yes" : "No"}
          />
          <Info
            label="Joined At"
            value={new Date(
              organizationProfile.joinedAt
            ).toDateString()}
          />

          <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            Edit Profile
          </button>
        </div>
      </div>

      {/* History */}
      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <h2 className="text-lg font-semibold mb-4">
          Profile History
        </h2>

        <div className="space-y-4">
          {organizationProfile.history.map((item) => (
            <div
              key={item._id}
              className="border-l-4 border-blue-500 pl-4"
            >
              <p className="font-medium">
                {item.action}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(item.date).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">
      {label}
    </p>
    <p className="font-medium text-gray-800">
      {value || "-"}
    </p>
  </div>
);

export default ProfilePage;
