// src/redux/features/warehouse/warehouseStockApi.js

import { baseAPI } from "../../services/baseApi";

export const warehouseStockAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({

    // 📦 Warehouse Stock LIST
    getWarehouseStockList: builder.query({
      query: (params) => ({
        url: "/warehouse/stock-in",
        method: "GET",
        params, // optional: pagination, search, filters
      }),
    }),

    // 📦 Warehouse Product LIST
    getWarehouseProductList: builder.query({
      query: (params) => ({
        url: "/warehouse/products",
        method: "GET",
        params, // optional: search, category, stock filter
      }),
    }),

    // ⬇️ Warehouse Stock OUT
    warehouseStockOut: builder.mutation({
      query: (payload) => ({
        url: "/warehouse/stock-out",
        method: "POST",
        body: payload,
      }),
    }),

  }),
  overrideExisting: false,
});

export const {
  useWarehouseStockInMutation,
  useGetWarehouseStockListQuery,
  useGetWarehouseProductListQuery, // ✅ new hook
  useWarehouseStockOutMutation,
} = warehouseStockAPI;
