import { baseAPI } from "../../services/baseApi";

export const warehouseReceiveAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all warehouse receives (pending)
    getAllReceives: builder.query({
      query: () => ({
        url: "/purchase-orders/pending",
        method: "GET",
      }),
    }),

    // Submit a new warehouse receive
    submitReceive: builder.mutation({
      query: (payload) => ({
        url: "/warehouse/receive",
        method: "POST",
        body: payload,
      }),
    }),

    // Get differences / warehouse receive requests
    getWarehouseReceiveRequest: builder.query({
      query: () => ({
        url: "/purchase-orders/differences",
        method: "GET",
      }),
    }),

    // ✅ Update warehouse receive (PUT)
    updateReceive: builder.mutation({
      query: ({ purchaseOrderId, data }) => ({
        url: `warehouse/${purchaseOrderId}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllReceivesQuery,
  useSubmitReceiveMutation,
  useGetWarehouseReceiveRequestQuery,
  useUpdateReceiveMutation, // ✅ added mutation hook
} = warehouseReceiveAPI;
