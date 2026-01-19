// src/redux/features/depot/depotStockApi.js

import { baseAPI } from "../../services/baseApi";

export const depotStockAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({

    // 📦 Depot Stock IN LIST
    getDepotStockInList: builder.query({
      query: (params) => ({
        url: "/depot/stock-in",
        method: "GET",
        params,
      }),
    }),

    // 📦 Depot Product LIST
    getDepotProductList: builder.query({
      query: (params) => ({
        url: "/depot/products",
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
        url: `/depot/requests/${id}`,
        method: "PATCH",
        body: payload,
      }),
    }),

    // =====================================================
    // 📦 SEND PRODUCT REQUEST APIs (DEPOT → WAREHOUSE)
    // =====================================================

    // 📤 Send Product Request (Create)
    sendProductRequest: builder.mutation({
      query: (payload) => ({
        url: "/depotRequests",
        method: "POST",
        body: payload,
      }),
    }),

    // 📑 Sent Product Requests by Status
    getSentProductRequestsByStatus: builder.query({
      query: (status) => ({
        url: `/depot/send-product-request/${status}`,
        method: "GET",
      }),
    }),

    // 📑 All Sent Product Requests (filterable)
    getSentProductRequestList: builder.query({
      query: (params) => ({
        url: "/depot/send-product-request",
        method: "GET",
        params, // status, pagination, date range
      }),
    }),

    // ✅ Update Send Product Request Status
    updateSendProductRequestStatus: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/depot/send-product-request/${id}`,
        method: "PATCH",
        body: payload, // { status, approvedQty? }
      }),
    }),

  }),
  overrideExisting: false,
});



export const {
  // 📦 Depot stock
  useGetDepotStockInListQuery,
  useGetDepotProductListQuery,
  useGetDepotStockOutListQuery,
  useDepotStockOutMutation,

  // 📑 Depot request
  useGetDepotRequestsByStatusQuery,
  useUpdateDepotRequestStatusMutation,

  // 📦 Send product request (Depot → Warehouse)
  useSendProductRequestMutation,
  useGetSentProductRequestsByStatusQuery,
  useGetSentProductRequestListQuery,
  useUpdateSendProductRequestStatusMutation,
} = depotStockAPI;
