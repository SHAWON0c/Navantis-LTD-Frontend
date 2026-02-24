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
      query: (orderId) => ({
        url: `/orders/approve/${orderId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Orders"],
    }),

    // ✅ Deliver Order
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `/orders/deliver/${orderId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Orders"], // Refetch orders after delivery
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useGetPendingOrdersQuery,
  useApproveOrderMutation,
  useDeliverOrderMutation, // ✅ new hook for delivering orders
} = orderAPI;