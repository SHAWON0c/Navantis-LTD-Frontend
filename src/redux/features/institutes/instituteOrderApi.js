import { baseAPI } from "../../../redux/services/baseApi";

export const instituteOrderAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Create Institute Order
    createInstituteOrder: builder.mutation({
      query: (payload) => ({
        url: "/institute-orders",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["InstituteOrders"],
    }),

    // ✅ Get All Institute Orders (with filters)
    getAllInstituteOrders: builder.query({
      query: (params) => ({
        url: "/institute-orders",
        method: "GET",
        params,
      }),
      keepUnusedDataFor: 0,
      providesTags: ["InstituteOrders"],
    }),

    // ✅ Get Pending Institute Orders
    getPendingInstituteOrders: builder.query({
      query: () => ({
        url: "/institute-orders?status=pending",
        method: "GET",
      }),
      keepUnusedDataFor: 0,
      providesTags: ["InstituteOrders"],
    }),

    // ✅ Get Institute Order by ID
    getInstituteOrderById: builder.query({
      query: (orderId) => ({
        url: `/institute-orders/${orderId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
      providesTags: ["InstituteOrders"],
    }),

    // ✅ Get Orders by Institute
    getOrdersByInstitute: builder.query({
      query: (customerId) => ({
        url: `/institute-orders/institute/${customerId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
      providesTags: ["InstituteOrders"],
    }),

    // ✅ Approve Institute Order (with batch assignment)
    approveInstituteOrder: builder.mutation({
      query: ({ orderId, products }) => ({
        url: `/institute-orders/${orderId}/approve`,
        method: "PATCH",
        body: { products }, // optional for manual batch selection
      }),
      invalidatesTags: ["InstituteOrders"],
    }),

    // ✅ Assign Rider to Order
    assignRiderToInstituteOrder: builder.mutation({
      query: ({ orderId, riderId }) => ({
        url: `/institute-orders/${orderId}/assign-rider`,
        method: "PATCH",
        body: { riderId },
      }),
      invalidatesTags: ["InstituteOrders"],
    }),

    // ✅ Mark Institute Order as Delivered
    deliverInstituteOrder: builder.mutation({
      query: (orderId) => ({
        url: `/institute-orders/${orderId}/deliver`,
        method: "PATCH",
      }),
      invalidatesTags: ["InstituteOrders"],
    }),

    // ✅ Cancel Institute Order
    cancelInstituteOrder: builder.mutation({
      query: (orderId) => ({
        url: `/institute-orders/${orderId}/cancel`,
        method: "POST",
      }),
      invalidatesTags: ["InstituteOrders"],
    }),

    // ✅ Delete Institute Order
    deleteInstituteOrder: builder.mutation({
      query: (orderId) => ({
        url: `/institute-orders/${orderId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["InstituteOrders"],
    }),

    // ✅ Request Return
    requestInstituteReturn: builder.mutation({
      query: (payload) => ({
        url: "/instituteReturns/request",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["InstituteOrders", "InstituteReturns"],
    }),

    // ✅ Get All Returns
    getAllInstituteReturns: builder.query({
      query: (params) => ({
        url: "/instituteReturns",
        method: "GET",
        params,
      }),
      keepUnusedDataFor: 0,
      providesTags: ["InstituteReturns"],
    }),

    // ✅ Approve Return
    approveInstituteReturn: builder.mutation({
      query: (returnId) => ({
        url: `/instituteReturns/approve/${returnId}`,
        method: "POST",
      }),
      invalidatesTags: ["InstituteReturns", "InstituteOrders"],
    }),

    // ✅ Reject Return
    rejectInstituteReturn: builder.mutation({
      query: ({ returnId, reason }) => ({
        url: `/instituteReturns/reject/${returnId}`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: ["InstituteReturns", "InstituteOrders"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateInstituteOrderMutation,
  useGetAllInstituteOrdersQuery,
  useGetPendingInstituteOrdersQuery,
  useGetInstituteOrderByIdQuery,
  useGetOrdersByInstituteQuery,
  useApproveInstituteOrderMutation,
  useAssignRiderToInstituteOrderMutation,
  useDeliverInstituteOrderMutation,
  useCancelInstituteOrderMutation,
  useDeleteInstituteOrderMutation,
  useRequestInstituteReturnMutation,
  useGetAllInstituteReturnsQuery,
  useApproveInstituteReturnMutation,
  useRejectInstituteReturnMutation,
} = instituteOrderAPI;
