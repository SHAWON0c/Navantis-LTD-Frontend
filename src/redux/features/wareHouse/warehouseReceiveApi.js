// import { baseAPI } from "../../services/baseApi";

// export const warehouseReceiveAPI = baseAPI.injectEndpoints({
//   endpoints: (builder) => ({
//     // Fetch all warehouse receives
//     getAllReceives: builder.query({
//       query: () => ({
//         url: "/purchase-orders/pending",
//         method: "GET",
//       }),
//     }),

//     // Submit a received warehouse product
//     submitReceive: builder.mutation({
//       query: (payload) => ({
//         url: "/warehouse-receives", // your backend endpoint
//         method: "POST",
//         body: payload,
//       }),
//     }),
//   }),
//   overrideExisting: false,
// });

// export const {
//   useGetAllReceivesQuery,
//   useSubmitReceiveMutation, // ✅ export the submit mutation
// } = warehouseReceiveAPI;




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

    // Submit a received warehouse product
    submitReceive: builder.mutation({
      query: (payload) => ({
        url: "/warehouse-receives",
        method: "POST",
        body: payload,
      }),
    }),

    // ✅ New: Warehouse Receive Request list (previously 'differences')
    getWarehouseReceiveRequest: builder.query({
      query: () => ({
        url: "/purchase-orders/differences", // your backend endpoint
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllReceivesQuery,
  useSubmitReceiveMutation,
  useGetWarehouseReceiveRequestQuery, // ✅ new query hook
} = warehouseReceiveAPI;
