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
      invalidatesTags: ["Orders"], // Refetch orders list after creation
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
      providesTags: ["Orders"], // Optional: allows cache updates
    }),

    // ✅ Approve Order
    approveOrder: builder.mutation({
      query: (orderId) => ({
        url: `/orders/approve/${orderId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Orders"], // Refetch order list after approval
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useGetPendingOrdersQuery, // ✅ new hook for pending orders
  useApproveOrderMutation,
} = orderAPI;
