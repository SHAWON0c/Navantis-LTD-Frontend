// import { baseAPI } from "../../../../services/baseApi";

// export const purchaseOrderAPI = baseAPI.injectEndpoints({
//   endpoints: (builder) => ({
//     // ✅ Create Purchase Order
//     createPurchaseOrder: builder.mutation({
//       query: (payload) => ({
//         url: "/purchase-orders",
//         method: "POST",
//         body: payload,
//       }),
//       // 🔹 Invalidate the list so it auto-refreshes
//       invalidatesTags: ["PurchaseOrders"],
//     }),

//     // ✅ Get all Purchase Orders
//     getPurchaseOrders: builder.query({
//       query: () => ({
//         url: "/purchase-orders",
//         method: "GET",
//       }),
//       providesTags: ["PurchaseOrders"], // 🔹 enables auto invalidation
//     }),

//     // ✅ Get single Purchase Order by ID
//     getPurchaseOrderById: builder.query({
//       query: (id) => ({
//         url: `/purchase-orders/${id}`,
//         method: "GET",
//       }),
//       providesTags: (result, error, id) => [{ type: "PurchaseOrders", id }],
//     }),
//   }),
//   overrideExisting: false,
// });

// export const {
//   useCreatePurchaseOrderMutation,
//   useGetPurchaseOrdersQuery,
//   useGetPurchaseOrderByIdQuery,
// } = purchaseOrderAPI;



import { baseAPI } from "../../../../services/baseApi";

export const purchaseOrderAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Create Purchase Order
    createPurchaseOrder: builder.mutation({
      query: (payload) => ({
        url: "/purchase-orders",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["PurchaseOrders"],
    }),

    // ✅ Get all Purchase Orders
    // getPurchaseOrders: builder.query({
    //   query: ({ page = 1, limit = 10, year, month, fromDate, toDate, today } = {}) => {
    //     // Build query params dynamically
    //     const params = new URLSearchParams();
    //     params.append("page", page);
    //     params.append("limit", limit);

    //     if (year) params.append("year", year);
    //     if (month) params.append("month", month);
    //     if (fromDate) params.append("fromDate", fromDate);
    //     if (toDate) params.append("toDate", toDate);
    //     if (today) params.append("today", true);

    //     return {
    //       url: `/purchase-orders?${params.toString()}`,
    //       method: "GET",
    //     };
    //   },
    //   providesTags: ["PurchaseOrders"],
    // }),


    getPurchaseOrders: builder.query({
  query: ({ page = 1, limit = 10, year, month, fromDate, toDate, today } = {}) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);

    if (year) params.append("year", year);
    if (month) params.append("month", month);
    if (fromDate) params.append("fromDate", fromDate);
    if (toDate) params.append("toDate", toDate);
    if (today) params.append("today", true);

    return {
      url: `/purchase-orders?${params.toString()}`,
      method: "GET",
    };
  },
  providesTags: ["PurchaseOrders"],
}),

    // ✅ Get single Purchase Order by ID
    getPurchaseOrderById: builder.query({
      query: (id) => ({
        url: `/purchase-orders/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "PurchaseOrders", id }],
    }),

    // ✅ New: Get all Pending Purchase Orders
    getPendingPurchaseOrders: builder.query({
      query: () => ({
        url: "/purchase-orders/pending", // backend endpoint
        method: "GET",
      }),
      providesTags: ["PurchaseOrders"], // allows auto-refresh when something changes
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreatePurchaseOrderMutation,
  useGetPurchaseOrdersQuery,
  useGetPurchaseOrderByIdQuery,
  useGetPendingPurchaseOrdersQuery, // 🔹 new hook
} = purchaseOrderAPI;
