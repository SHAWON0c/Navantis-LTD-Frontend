import { baseAPI } from "../../services/baseApi";

export const territoryAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 Get all territories with area & manager info
    getAllTerritoriesWithManagers: builder.query({
      query: () => ({
        url: "/territories/managers", // your backend route
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
      providesTags: ["Territories"],
    }),

    // 🔹 Create a new territory
    createTerritory: builder.mutation({
      query: (payload) => ({
        url: "/territories",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Territories"],
    }),

    // 🔹 Update a territory
    updateTerritory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/territories/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Territories"],
    }),

    // 🔹 Delete a territory
    deleteTerritory: builder.mutation({
      query: (id) => ({
        url: `/territories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Territories"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllTerritoriesWithManagersQuery,
  useGetTerritoryByIdQuery,
  useCreateTerritoryMutation,
  useUpdateTerritoryMutation,
  useDeleteTerritoryMutation,
} = territoryAPI;
