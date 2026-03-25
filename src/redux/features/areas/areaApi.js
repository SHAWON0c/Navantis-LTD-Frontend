import { baseAPI } from "../../services/baseApi";

export const areaAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({

    // 🔹 Get all areas
    getAllAreas: builder.query({
      query: () => ({
        url: "/areas",
        method: "GET",
      }),
      providesTags: ["Areas"],
    }),

    // 🔹 Get single area by ID
    getAreaById: builder.query({
      query: (areaId) => ({
        url: `/areas/${areaId}`,
        method: "GET",
      }),
      providesTags: (result, error, areaId) => [{ type: "Areas", areaId }],
    }),

    // 🔹 Create new area
    createArea: builder.mutation({
      query: (payload) => ({
        url: "/areas",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Areas"],
    }),

    // 🔹 Update area
    updateArea: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/areas/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Areas",
        { type: "Areas", id },
      ],
    }),

    // 🔹 Delete area
    deleteArea: builder.mutation({
      query: (areaId) => ({
        url: `/areas/${areaId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Areas"],
    }),

    // 🔹 Get all area managers
    getAllAreaManagers: builder.query({
      query: () => ({
        url: "/areas/area-managers",
        method: "GET",
      }),
      providesTags: ["AreaManagers"],
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetAllAreasQuery,
  useGetAreaByIdQuery,
  useCreateAreaMutation,
  useUpdateAreaMutation,
  useDeleteAreaMutation,
  useGetAllAreaManagersQuery, // ✅ Added hook
} = areaAPI;