import { baseAPI } from "../../services/baseApi";

export const zoneAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({

    // ✅ Create Zone
    createZone: builder.mutation({
      query: (payload) => ({
        url: "/zones",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Zones"],
    }),

    // ✅ Get All Zones
    getZones: builder.query({
      query: () => ({
        url: "/zones",
        method: "GET",
      }),
      providesTags: ["Zones"],
    }),

    // ✅ Get Single Zone
    getZoneById: builder.query({
      query: (id) => ({
        url: `/zones/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Zones", id }],
    }),

    // ✅ Update Zone
    updateZone: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/zones/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Zones",
        { type: "Zones", id },
      ],
    }),

    // ✅ Delete Zone
    deleteZone: builder.mutation({
      query: (id) => ({
        url: `/zones/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Zones"],
    }),

    // ✅ Get All Zonal Managers
    getZonalManagers: builder.query({
      query: () => ({
        url: "/zones/zonal-managers", // create this endpoint in backend
        method: "GET",
      }),
      providesTags: ["ZonalManagers"],
    }),

  }),
  overrideExisting: false,
});

// ✅ Hooks
export const {
  useCreateZoneMutation,
  useGetZonesQuery,
  useGetZoneByIdQuery,
  useUpdateZoneMutation,
  useDeleteZoneMutation,
  useGetZonalManagersQuery, // <-- new hook
} = zoneAPI;