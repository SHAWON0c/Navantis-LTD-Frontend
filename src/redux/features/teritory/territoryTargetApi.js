// territoryTargetAPI.js
import { baseAPI } from "../../services/baseApi";

export const territoryTargetAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 Get territory target summary (product info + totals)
    getTerritoryTargetSummary: builder.query({
      query: () => ({
        url: "/territories/summary/targets", // backend route
        method: "GET",
      }),
      providesTags: ["Territories"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTerritoryTargetSummaryQuery,
} = territoryTargetAPI;
