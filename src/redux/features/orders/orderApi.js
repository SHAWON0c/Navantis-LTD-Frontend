// src/redux/features/orders/orderApi.js
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
      invalidatesTags: ["Orders"], // you can use this to refetch order list if needed
    }),

    // ✅ Get all orders (optional)
    getAllOrders: builder.query({
      query: () => ({
        url: "/orders",
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),
  }),
  overrideExisting: false,
});

export const { useCreateOrderMutation, useGetAllOrdersQuery } = orderAPI;
