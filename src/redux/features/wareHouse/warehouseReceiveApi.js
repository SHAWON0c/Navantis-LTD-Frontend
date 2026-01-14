import { baseAPI } from "../../services/baseApi";

export const warehouseReceiveAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all warehouse receives
    getAllReceives: builder.query({
      query: () => ({
        url: "/purchase-orders/pending",
        method: "GET",
      }),
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetAllReceivesQuery,
  useGetReceiveByIdQuery,
  useCreateReceiveMutation,
  useUpdateReceiveMutation,
  useDeleteReceiveMutation,
} = warehouseReceiveAPI;
