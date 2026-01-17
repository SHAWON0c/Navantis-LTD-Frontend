// src/redux/features/depot/depotStockApi.js

import { baseAPI } from "../../services/baseApi";

export const depotStockAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({

    // 📦 Depot Stock LIST
    getDepotStockList: builder.query({
      query: (params) => ({
        url: "/depot/stock",
        method: "GET",
        params, // optional: pagination, search, filters
      }),
    }),

    // 📦 Depot Product LIST
    getDepotProductList: builder.query({
      query: (params) => ({
        url: "/depot/products",
        method: "GET",
        params, // optional: search, category, stock filter
      }),
    }),

    // ⬇️ Depot Stock OUT (Request / Return / Expire)
    depotStockOut: builder.mutation({
      query: (payload) => ({
        url: "/depot/stock-out",
        method: "POST",
        body: payload,
      }),
    }),

    // 🔄 Optional: Depot Stock Return
    depotStockReturn: builder.mutation({
      query: (payload) => ({
        url: "/depot/stock-return",
        method: "POST",
        body: payload,
      }),
    }),

    // ⏰ Optional: Expire Return
    depotExpireReturn: builder.mutation({
      query: (payload) => ({
        url: "/depot/expire-return",
        method: "POST",
        body: payload,
      }),
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetDepotStockListQuery,
  useGetDepotProductListQuery,
  useDepotStockOutMutation,
  useDepotStockReturnMutation,
  useDepotExpireReturnMutation,
} = depotStockAPI;
