import { baseAPI } from "../../../redux/services/baseApi";

export const customerAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Create Customer
    createCustomer: builder.mutation({
      query: (payload) => ({
        url: "/customers",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Customers"],
    }),

    // ✅ Get all customers
    getAllCustomers: builder.query({
      query: () => ({
        url: "/customers",
        method: "GET",
      }),
      providesTags: ["Customers"],
    }),

    // ✅ Get customers by status (pending, active)
    getCustomersByStatus: builder.query({
      query: (status) => ({
        url: `/customers/my-customers?status=${status}`,
        method: "GET",
      }),
      providesTags: ["Customers"],
    }),

    // ✅ Get single customer by ID
    getCustomerById: builder.query({
      query: (id) => ({
        url: `/customers/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Customers", id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateCustomerMutation,
  useGetAllCustomersQuery,
  useGetCustomersByStatusQuery,
  useGetCustomerByIdQuery,
} = customerAPI;
