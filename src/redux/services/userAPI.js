// src/redux/services/userAPI.js
import { baseAPI } from "./baseApi";

export const userAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getUserById: builder.query({
      query: (userId) => `/users/${userId}`,
    }),
  }),
});

export const { useGetUserByIdQuery } = userAPI;
