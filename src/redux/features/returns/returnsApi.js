import { baseAPI } from "../../../redux/services/baseApi";

export const returnsAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get pending returns list
    getPendingReturnsList: builder.query({
      query: () => ({
        url: "/orders/returns/pending/list",
        method: "GET",
      }),
      keepUnusedDataFor: 0,
      providesTags: ["Returns"],
    }),

    // ✅ Approve return request
    approveReturn: builder.mutation({
      query: (returnId) => ({
        url: `/orders/returns/approve/${returnId}`,
        method: "POST",
      }),
      invalidatesTags: ["Returns"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPendingReturnsListQuery,
  useApproveReturnMutation,
} = returnsAPI;
