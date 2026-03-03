import React, { useState } from "react";
import { useGetGroupedDepotRequestsQuery } from "../../redux/features/depot/depotProductRequestAPI";

const STATUS_OPTIONS = ["pending", "requested", "accepted"];

const DepotRequests = () => {
  const [selectedStatus, setSelectedStatus] = useState("pending");

  // Fetch grouped requests
  const { data, isLoading, isError } = useGetGroupedDepotRequestsQuery(selectedStatus);

  if (isLoading) return <p className="text-center mt-4">Loading requests...</p>;
  if (isError) return <p className="text-center text-red-500 mt-4">Failed to load requests!</p>;

  // Transform data: convert object to array of { date, requests }
  const groupedRequests = data?.data
    ? Object.entries(data.data).map(([date, requests]) => ({ date, requests }))
    : [];

  return (
    <div className="p-4">
      {/* ====== Top Bar: Status Filters ====== */}
      <div className="flex gap-4 mb-6">
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded font-semibold ${
              selectedStatus === status
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* ====== Requests Table ====== */}
      {groupedRequests.length > 0 ? (
        groupedRequests.map(({ date, requests }) => (
          <div key={date} className="mb-6">
            <h3 className="font-bold mb-2">Date: {new Date(date).toLocaleDateString()}</h3>
            <table className="table-auto w-full border border-gray-300 text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">#</th>
                  <th className="px-4 py-2 border">Product Name</th>
                  <th className="px-4 py-2 border text-center">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req, idx) => (
                  <tr key={req._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 text-center">{idx + 1}</td>
                    <td className="px-4 py-2">{req.name}</td>
                    <td className="px-4 py-2 text-center">{req.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No requests found for "{selectedStatus}" status.</p>
      )}
    </div>
  );
};

export default DepotRequests;