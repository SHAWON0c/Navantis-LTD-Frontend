// src/redux/features/depot/depotProductRequestAPI.js
import { baseAPI } from "../../services/baseApi";

export const depotProductRequestAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({

    // 📊 Get grouped depot requests by status
    getGroupedDepotRequests: builder.query({
      query: (status) => ({
        url: "/depotRequests/grouped",
        method: "GET",
        params: { status }, // e.g., "pending", "requested", "accepted"
      }),
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetGroupedDepotRequestsQuery,
} = depotProductRequestAPI;