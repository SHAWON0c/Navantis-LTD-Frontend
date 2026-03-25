import { baseAPI } from "../../services/baseApi";

export const territoryAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 Get all territories
    getAllTerritories: builder.query({
      query: () => ({
        url: "/territories",
        method: "GET",
      }),
      providesTags: ["Territories"],
    }),

    // 🔹 Get single territory by ID
    getTerritoryById: builder.query({
      query: (id) => ({
        url: `/territories/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Territories", id }],
    }),

    // 🔹 Create territory
    createTerritory: builder.mutation({
      query: (payload) => ({
        url: "/territories",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Territories"],
    }),

    // 🔹 Update territory
    updateTerritory: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/territories/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Territories",
        { type: "Territories", id },
      ],
    }),

    // 🔹 Delete territory
    deleteTerritory: builder.mutation({
      query: (id) => ({
        url: `/territories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Territories"],
    }),

    // 🔹 Get all territories with market points
    getTerritoriesWithMarketPoints: builder.query({
      query: () => ({
        url: "/market-points/territories-with-market-points",
        method: "GET",
      }),
      providesTags: ["Territories"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllTerritoriesQuery,
  useGetTerritoryByIdQuery,
  useCreateTerritoryMutation,
  useUpdateTerritoryMutation,
  useDeleteTerritoryMutation,
  useGetTerritoriesWithMarketPointsQuery,
} = territoryAPI;

// Backward-compatible alias for older imports
export const useGetTerritoriesQuery = useGetAllTerritoriesQuery;
