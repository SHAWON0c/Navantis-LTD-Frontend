import { baseAPI } from "../../../redux/services/baseApi";

export const riderAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Create Rider
    createRider: builder.mutation({
      query: (payload) => ({
        url: "/riders",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Riders"],
    }),

    // ✅ Get all riders
    getAllRiders: builder.query({
      query: () => ({
        url: "/riders",
        method: "GET",
      }),
      providesTags: ["Riders"],
    }),

    // ✅ Get single rider
    getRiderById: builder.query({
      query: (id) => ({
        url: `/riders/${id}`,
        method: "GET",
      }),
      providesTags: ["Riders"],
    }),

    // ✅ Update rider
    updateRider: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/riders/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Riders"],
    }),

    // ✅ Delete rider
    deleteRider: builder.mutation({
      query: (id) => ({
        url: `/riders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Riders"],
    }),


    assignRider: builder.mutation({
      query: ({ orderId, riderId }) => ({
        url: `/orders/assign-rider/${orderId}`, // your backend endpoint
        method: "PATCH",
        body: { riderId }, // send rider ID in body
      }),
      invalidatesTags: ["Orders"], // Refetch orders after assignment
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateRiderMutation,
  useGetAllRidersQuery,
  useGetRiderByIdQuery,
  useUpdateRiderMutation,
  useDeleteRiderMutation,
    useAssignRiderMutation, 
} = riderAPI;