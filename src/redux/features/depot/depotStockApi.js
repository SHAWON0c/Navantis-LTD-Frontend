import { baseAPI } from "../../services/baseApi";

export const depotStockAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({

    // 📦 Depot Stock IN LIST
    // 🟢 Daily Stock-In List
    getDailyStockInList: builder.query({
      query: (params) => ({
        url: "/depot-products/daily-stockin/", // backend route for dailyStockIn controller
        method: "GET",
        params, // optional filters
      }),
    }),

    // 🟢 Daily Stock-Out List
    getDailyStockOutList: builder.query({
      query: (params) => ({
        url: "/depot-products/daily-stockout", // backend route for dailyStockOut controller
        method: "GET",
        params, // optional filters
      }),
    }),

    // 🟢 ✅ Depot Receive Stock Report
    getDepotReceiveStock: builder.query({
      query: (params) => ({
        url: "/depot-products/receive-stock", // backend route
        method: "GET",
        params, // optional query params
      }),
    }),

    // 📦 Depot Product LIST
    getDepotProductList: builder.query({
      query: (params) => ({
        url: "/depot-products",
        method: "GET",
        params,
      }),
    }),

    // 📤 Depot Stock OUT LIST
    getDepotStockOutList: builder.query({
      query: (params) => ({
        url: "/depot/stockout",
        method: "GET",
        params,
      }),
    }),

    // ⬇️ Depot Stock OUT (Create)
    depotStockOut: builder.mutation({
      query: (payload) => ({
        url: "/depot/stockout",
        method: "POST",
        body: payload,
      }),
    }),

    // 📑 Depot Requests by Status
    getDepotRequestsByStatus: builder.query({
      query: (status) => ({
        url: `/depot/requests/${status}`,
        method: "GET",
      }),
    }),

    // ✅ Update Depot Request Status
    updateDepotRequestStatus: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/depotRequests/${id}/status`,
        method: "PATCH",
        body: payload,
      }),
    }),

    // 📊 Grouped Depot Requests by Status (Date Wise)
    getGroupedDepotRequests: builder.query({
      query: (status) => ({
        url: "/depotRequests/grouped",
        method: "GET",
        params: { status }, // "accepted", "requested", "pending"
      }),
    }),


    getDepotProductStockCount: builder.query({
      query: (productId) => ({
        url: `/depot-products/stock-count/${productId}`,
        method: "GET",
      }),
    }),

    // 🟢 ✅ Depot Receive Stock Report
    getDepotReceiveStock: builder.query({
      query: (params) => ({
        url: "/depot-products/receive-stock", // backend route for depotReceiveStock
        method: "GET",
        params, // optional query params if needed
      }),
    }),

    // 📝 Send a new Depot Product Request
    sendProductRequest: builder.mutation({
      query: (payload) => ({
        url: "/depotRequests",
        method: "POST",
        body: payload,
      }),
    }),

    sendProductRequestTowarehouse: builder.mutation({
      query: ({ requestId, payload }) => ({
        url: `/depotRequests/${requestId}/status`,
        method: "PATCH",
        body: payload,
      }),
    }),

  }),
  overrideExisting: false,
});

export const {
  // 📦 Depot stock
  useGetDailyStockInListQuery,

  useGetDepotProductListQuery,
  useGetDailyStockOutListQuery,
  useDepotStockOutMutation,

  // 📑 Depot Requests
  useGetDepotRequestsByStatusQuery,
  useUpdateDepotRequestStatusMutation,

  // ✅ Grouped Depot Requests
  useGetGroupedDepotRequestsQuery,

  // ✅ Approve Mutation
  useApproveDepotRequestMutation,

  // 📝 Send new request
  useSendProductRequestMutation,
  useGetDepotProductStockCountQuery,


  useGetDepotReceiveStockQuery,

  useSendProductRequestTowarehouseMutation
} = depotStockAPI;
