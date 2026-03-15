


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
      providesTags: ["Orders"],
    }),

    // ✅ Get pending orders
    getPendingOrders: builder.query({
      query: () => ({
        url: "/orders/pending",
        method: "GET",
      }),
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

    // ✅ Search Order by Invoice Number (Lazy query)
    searchOrder: builder.query({
      query: (invoiceNo) => `/orders/search?invoiceNo=${invoiceNo}`,
      providesTags: ["Orders"],
    }),

    // ✅ Return Order Product
    orderReturn: builder.mutation({
      query: ({ orderId, payload }) => ({
        url: `/orders/returns/${orderId}`,
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
      providesTags: ["Orders"],
    }),

    // ✅ Approve return request
    approveReturn: builder.mutation({
      query: (returnId) => ({
        url: `/orders/returns/approve/${returnId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Orders"],
    }),


    // ✅ Get Orders by Status
    getOrderStatusInfo: builder.query({
      query: (status) => ({
        url: `/orders/status-info`,
        method: "GET",
        params: { status }, // status = "delivered" | "pending" | "paid" | "outstanding" | "returned"
      }),
      providesTags: ["Orders"],
    }),



    getMpoPendingOrders: builder.query({
      query: () => ({
        url: "/orders/mpo-orders/pending",
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),

    // MPO DELIVERED ORDERS
    getMpoDeliveredOrders: builder.query({
      query: () => ({
        url: "/orders/mpo-orders/delivered",
        method: "GET",
      }),
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
  useGetOrderStatusInfoQuery,
  useLazySearchOrderQuery, // ✅ lazy search hook for Quick Pay
  useOrderReturnMutation,
  useGetPendingReturnsQuery,
  useApproveReturnMutation,
  useGetMpoPendingOrdersQuery,
  useGetMpoDeliveredOrdersQuery,
} = orderAPI;