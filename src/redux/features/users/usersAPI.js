import { baseAPI } from "../../services/baseApi";

export const usersAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({

    // 🔹 Get all users
    getAllUsers: builder.query({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
    }),

    // 🔹 Get single user by ID
    getUserById: builder.query({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "GET",
      }),
    }),

    // 🔹 Create a new user
    createUser: builder.mutation({
      query: (payload) => ({
        url: "/users",
        method: "POST",
        body: payload,
      }),
    }),

    // 🔹 Update user
    updateUser: builder.mutation({
      query: ({ userId, data }) => ({
        url: `/users/${userId}`,
        method: "PUT",
        body: data,
      }),
    }),

    // 🔹 Delete user
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
    }),

    // 🔹 Get Area Managers (AM) and Zonal Managers (ZM)
    getAreaAndZonalManagers: builder.query({
      query: () => ({
        url: "/users/managers",
        method: "GET",
      }),
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetAreaAndZonalManagersQuery,
} = usersAPI;
