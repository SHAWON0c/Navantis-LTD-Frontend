import { baseAPI } from "../../services/baseApi";

export const warehouseReceiveAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all warehouse receives (pending)
    getAllReceives: builder.query({
      query: () => ({
        url: "/purchase-orders/pending",
        method: "GET",
      }),
      providesTags: ['WarehouseReceive'], // ✅ tag for invalidation
    }),

    // Submit a new warehouse receive
    submitReceive: builder.mutation({
      query: (payload) => ({
        url: "/warehouse/receive",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ['WarehouseReceive', 'PurchaseOrders'], // ✅ triggers refetch for receive + pending PO list
    }),

    // Get differences / warehouse receive requests
    getWarehouseReceiveRequest: builder.query({
      query: () => ({
        url: "/warehouse/receive/pending",
        method: "GET",
      }),
      providesTags: ['WarehouseReceive'], // ✅ this tag is used for automatic refetch
      // Optional: auto-refetch every 5s for live updates
      // keepUnusedDataFor: 0, // remove cached data immediately if unused
    }),

    // Update warehouse receive
    updateReceive: builder.mutation({
      query: ({ receiveId, data }) => ({
        url: `/warehouse/receive/${receiveId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ['WarehouseReceive'], // ✅ triggers refetch
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllReceivesQuery,
  useSubmitReceiveMutation,
  useGetWarehouseReceiveRequestQuery,
  useUpdateReceiveMutation,
} = warehouseReceiveAPI;
