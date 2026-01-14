import { baseAPI } from "../../../../services/baseApi";

export const purchaseOrderAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // Create Purchase Order
    createPurchaseOrder: builder.mutation({
      query: (payload) => ({
        url: "/purchase-orders",
        method: "POST",
        body: payload,
      }),
    }),

    // (optional) Get all purchase orders
    getPurchaseOrders: builder.query({
      query: () => ({
        url: "purchase-orders",
        method: "GET",
      }),
    }),

    // (optional) Get single purchase order
    getPurchaseOrderById: builder.query({
      query: (id) => ({
        url: `/purchase-orders/${id}`,
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreatePurchaseOrderMutation,
  useGetPurchaseOrdersQuery,
  useGetPurchaseOrderByIdQuery,
} = purchaseOrderAPI;
