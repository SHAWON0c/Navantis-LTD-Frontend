import { baseAPI } from "../../services/baseApi";

export const areaAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({

    // 🔹 Get all areas
    getAllAreas: builder.query({
      query: () => ({
        url: "/areas",
        method: "GET",
      }),
    }),

    // 🔹 Get single area by ID
    getAreaById: builder.query({
      query: (areaId) => ({
        url: `/areas/${areaId}`,
        method: "GET",
      }),
    }),

    // 🔹 Create new area
    createArea: builder.mutation({
      query: (payload) => ({
        url: "/areas",
        method: "POST",
        body: payload,
      }),
    }),

    // 🔹 Update area manager / zonal manager
    updateArea: builder.mutation({
      query: ({ areaId, data }) => ({
        url: `/areas/${areaId}`,
        method: "PATCH",
        body: data,
      }),
    }),

    // 🔹 Delete area
    deleteArea: builder.mutation({
      query: (areaId) => ({
        url: `/areas/${areaId}`,
        method: "DELETE",
      }),
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
} = areaAPI;
