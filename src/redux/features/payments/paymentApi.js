import { baseAPI } from "../../../redux/services/baseApi";

export const paymentAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Submit Payment for a specific order
    recordPayment: builder.mutation({
      query: ({ orderId, body }) => ({
        url: `/payments/${orderId}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Payments", "Orders"], // Refresh orders/payments after submission
    }),
  }),
  overrideExisting: false,
});

export const { useRecordPaymentMutation } = paymentAPI;