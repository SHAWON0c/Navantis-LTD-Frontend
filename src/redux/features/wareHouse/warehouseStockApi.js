// src/redux/features/warehouse/warehouseStockApi.js

import { baseAPI } from "../../services/baseApi";

export const warehouseStockAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({

    // 📦 Warehouse Stock IN LIST
    getWarehouseStockList: builder.query({
      query: (params) => ({
        url: "/warehouse/stock-in",
        method: "GET",
        params, // pagination, search, filters
      }),
    }),

    // 📦 Warehouse Product LIST
    getWarehouseProductList: builder.query({
      query: (params) => ({
        url: "/warehouse/products",
        method: "GET",
        params, // search, category, stock filter
      }),
    }),

    // 📤 Warehouse Stock OUT LIST ✅
    getWarehouseStockOutList: builder.query({
      query: (params) => ({
        url: "/warehouse/stockout",
        method: "GET",
        params, // pagination, date range, search
      }),
    }),

    // ⬇️ Warehouse Stock OUT (Create)
    warehouseStockOut: builder.mutation({
      query: (payload) => ({
        url: "/warehouse/stockout",
        method: "POST",
        body: payload,
      }),
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetWarehouseStockListQuery,
  useGetWarehouseProductListQuery,
  useGetWarehouseStockOutListQuery, // ✅ export hook
  useWarehouseStockOutMutation,
} = warehouseStockAPI;
