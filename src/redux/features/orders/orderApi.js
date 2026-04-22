


// import { baseAPI } from "../../../redux/services/baseApi";

// export const orderAPI = baseAPI.injectEndpoints({
//   endpoints: (builder) => ({
//     // ✅ Create Order
//     createOrder: builder.mutation({
//       query: (payload) => ({
//         url: "/orders",
//         method: "POST",
//         body: payload,
//       }),
//       invalidatesTags: ["Orders"],
//     }),

//     // ✅ Get all orders
//     getAllOrders: builder.query({
//       query: () => ({
//         url: "/orders",
//         method: "GET",
//       }),
//       providesTags: ["Orders"],
//     }),

//     // ✅ Get pending orders
//     getPendingOrders: builder.query({
//       query: () => ({
//         url: "/orders/pending",
//         method: "GET",
//       }),
//       providesTags: ["Orders"],
//     }),

//     // ✅ Approve Order
//     approveOrder: builder.mutation({
//       query: (orderId) => ({
//         url: `/orders/approve/${orderId}`,
//         method: "PATCH",
//       }),
//       invalidatesTags: ["Orders"],
//     }),

//     // ✅ Deliver Order
//     deliverOrder: builder.mutation({
//       query: (orderId) => ({
//         url: `/orders/deliver/${orderId}`,
//         method: "PATCH",
//       }),
//       invalidatesTags: ["Orders"],
//     }),

//     // ✅ Search Order by Invoice Number
//     searchOrder: builder.query({
//       query: (invoiceNo) => ({
//         url: `/orders/search`,
//         method: "GET",
//         params: { invoiceNo },
//       }),
//       providesTags: ["Orders"],
//     }),

//     // ✅ Get Orders by Status
//     getOrderStatusInfo: builder.query({
//       query: (status) => ({
//         url: `/orders/status-info`,
//         method: "GET",
//         params: { status }, // status = "delivered" | "pending" | "paid" | "outstanding" | "returned"
//       }),
//       providesTags: ["Orders"],
//     }),
//   }),
//   overrideExisting: false,
// });

// export const {
//   useCreateOrderMutation,
//   useGetAllOrdersQuery,
//   useGetPendingOrdersQuery,
//   useApproveOrderMutation,
//   useDeliverOrderMutation,
//   useSearchOrderQuery,
//   useGetOrderStatusInfoQuery, // ✅ new hook for status info
// } = orderAPI;


import { baseAPI } from "../../../redux/services/baseApi";

export const orderAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Create Order
    createOrder: builder.mutation({
      query: (payload) => ({
        url: "/orders",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Orders"],
    }),

    // ✅ Get all orders
    getAllOrders: builder.query({
      query: () => ({
        url: "/orders",
        method: "GET",
      }),
      keepUnusedDataFor: 0,
      providesTags: ["Orders"],
    }),

    // ✅ Get pending orders
    getPendingOrders: builder.query({
      query: () => ({
        url: "/orders/pending",
        method: "GET",
      }),
      keepUnusedDataFor: 0,
      providesTags: ["Orders"],
    }),

    // ✅ Approve Order
    approveOrder: builder.mutation({
      query: ({ orderId, products }) => ({
        url: `/orders/approve/${orderId}`,
        method: "PATCH",
        body: { products }, // optional for single-batch auto assign
      }),
      invalidatesTags: ["Orders"],
    }),

    // ✅ Deliver Order
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `/orders/deliver/${orderId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Orders"],
    }),

    // ✅ Update pending order product quantities
    updateOrderQuantity: builder.mutation({
      query: ({ orderId, payload }) => ({
        url: `/orders/${orderId}/update-quantity`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Orders"],
    }),

    // ✅ Delete pending order
    deleteOrder: builder.mutation({
      query: (orderId) => ({
        url: `/orders/${orderId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Orders"],
    }),

    // ✅ Search Order by Invoice Number (Lazy query)
    searchOrder: builder.query({
      query: (invoiceNo) => `/orders/search?invoiceNo=${invoiceNo}`,
      keepUnusedDataFor: 0,
      providesTags: ["Orders"],
    }),

    // ✅ Return Order Product
    orderReturn: builder.mutation({
      query: (payload) => ({
        url: "/orders/returns/request",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Orders"],
    }),

    // ✅ Get pending return requests
    getPendingReturns: builder.query({
      query: () => ({
        url: "/orders/returns/pending",
        method: "GET",
      }),
      keepUnusedDataFor: 0,
      providesTags: ["Orders"],
    }),

    // // ✅ Approve return request
    // approveReturn: builder.mutation({
    //   query: (returnId) => ({
    //     url: `/orders/returns/approve/${returnId}`,
    //     method: "PATCH",
    //   }),
    //   invalidatesTags: ["Orders"],
    // }),


    // ✅ Get Orders by Status
    getOrderStatusInfo: builder.query({
      query: (status) => ({
        url: `/orders/status-info`,
        method: "GET",
        params: { status }, // status = "delivered" | "pending" | "paid" | "outstanding" | "returned"
      }),
      keepUnusedDataFor: 0,
      providesTags: ["Orders"],
    }),

    // ✅ Submit payment against an order/payment record
    submitPayment: builder.mutation({
      query: ({ paymentId, payload }) => ({
        url: `/payments/${paymentId}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Orders"],
    }),



    getMpoPendingOrders: builder.query({
      query: () => ({
        url: "/orders/mpo-orders/pending",
        method: "GET",
      }),
      keepUnusedDataFor: 0,
      providesTags: ["Orders"],
    }),

    // MPO DELIVERED ORDERS
    getMpoDeliveredOrders: builder.query({
      query: () => ({
        url: "/orders/mpo-orders/delivered",
        method: "GET",
      }),
      keepUnusedDataFor: 0,
      providesTags: ["Orders"],
    }),
    getSingleOrder: builder.query({
      query: (orderId) => ({
        url: `/orders/${orderId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
      providesTags: ["Orders"],
    }),


  }),
  overrideExisting: false,
});

export const {
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useGetPendingOrdersQuery,
  useApproveOrderMutation,
  useDeliverOrderMutation,
  useUpdateOrderQuantityMutation,
  useDeleteOrderMutation,
  useGetOrderStatusInfoQuery,
  useSubmitPaymentMutation,
  useLazySearchOrderQuery, // ✅ lazy search hook for Quick Pay
  useOrderReturnMutation,
  useGetPendingReturnsQuery,
  useApproveReturnMutation,
  useGetMpoPendingOrdersQuery,
  useGetMpoDeliveredOrdersQuery,
  useGetSingleOrderQuery,
} = orderAPI;