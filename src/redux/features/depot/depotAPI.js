// src/redux/features/depot/depotAPI.js
import { baseAPI } from "../../services/baseApi";

export const depotAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({

    // 📄 Get all depots
    getDepots: builder.query({
      query: () => ({
        url: "/depots",
        method: "GET",
      }),
      providesTags: ["Depots"],
    }),

    // 📄 Get single depot by ID
    getDepotById: builder.query({
      query: (id) => ({
        url: `/depots/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Depots", id }],
    }),

    // ➕ Create new depot
    createDepot: builder.mutation({
      query: (body) => ({
        url: "/depots",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Depots"],
    }),

    // ✏ Update depot by ID
    updateDepot: builder.mutation({
      query: ({ id, body }) => ({
        url: `/depots/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Depots", id }],
    }),

    // ❌ Delete depot by ID
    deleteDepot: builder.mutation({
      query: (id) => ({
        url: `/depots/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Depots"],
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetDepotsQuery,
  useGetDepotByIdQuery,
  useCreateDepotMutation,
  useUpdateDepotMutation,
  useDeleteDepotMutation,
} = depotAPI;