import { useUserProfile } from "../hooks/useUserProfile";

const WarehouseRequest = () => {
  const { data, isLoading, error } = useUserProfile();

  if (isLoading) return <p>Loading profile...</p>;
  if (error) return <p>Error loading profile</p>;

  const user = data?.data?.user;
  const org = data?.data?.organizationProfile;

  return (
    <div>
      <h1>Warehouse Request</h1>

      <h2>User Info</h2>
      <p>Email: {user?.email || "N/A"}</p>
      <p>Role: {user?.role || "N/A"}</p>
      <p>Verified: {user?.isVerified ? "Yes" : "No"}</p>

      <h2>Organization Profile</h2>
      <p>Name: {org?.name || "N/A"}</p>
      <p>Designation: {org?.designation || "N/A"}</p>
      <p>Workplace: {org?.workplace || "N/A"}</p>
      <p>Area: {org?.area || "N/A"}</p>
      <p>Area Manager: {org?.areaManager || "N/A"}</p>
      <p>Zonal Manager: {org?.zonalManager || "N/A"}</p>
      <img src={org?.profilePic} alt="Profile Pic" width={80} />

      <h3>History</h3>
      <ul>
        {org?.history?.map((h) => (
          <li key={h._id}>
            {h.action} on {new Date(h.date).toLocaleString()}
          </li>
        )) || <li>No history available</li>}
      </ul>
    </div>
  );
};


export default WarehouseRequest;