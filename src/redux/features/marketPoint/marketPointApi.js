import { baseAPI } from "../../services/baseApi";

export const marketPointAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 Get all market points
    getAllMarketPoints: builder.query({
      query: () => ({
        url: "/market-points",
        method: "GET",
      }),
      providesTags: ["MarketPoints"],
    }),

    // 🔹 Get single market point by ID
    getMarketPointById: builder.query({
      query: (id) => ({
        url: `/market-points/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "MarketPoints", id }],
    }),

    // 🔹 Create market point
    createMarketPoint: builder.mutation({
      query: (payload) => ({
        url: "/market-points",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["MarketPoints"],
    }),

    // 🔹 Update market point
    updateMarketPoint: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/market-points/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        "MarketPoints",
        { type: "MarketPoints", id },
      ],
    }),

    // 🔹 Delete market point
    deleteMarketPoint: builder.mutation({
      query: (id) => ({
        url: `/market-points/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MarketPoints"],
    }),

    // 🔹 Get market points by territory
    getMarketPointsByTerritory: builder.query({
      query: (territoryId) => ({
        url: `/market-points/territory/${territoryId}`,
        method: "GET",
      }),
      providesTags: (result, error, territoryId) => [
        { type: "MarketPoints", territoryId },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllMarketPointsQuery,
  useGetMarketPointByIdQuery,
  useCreateMarketPointMutation,
  useUpdateMarketPointMutation,
  useDeleteMarketPointMutation,
  useGetMarketPointsByTerritoryQuery,
} = marketPointAPI;