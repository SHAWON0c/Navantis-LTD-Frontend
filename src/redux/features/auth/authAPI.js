import { baseAPI } from "../../services/baseApi";

export const authAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (payload) => ({
        url: "/auth/register",
        method: "POST",
        body: payload,
      }),
    }),
    verifyEmail: builder.mutation({
      query: (payload) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: payload, // { email, otp }
      }),
    }),
    login: builder.mutation({
      query: (payload) => ({
        url: "/auth/login",
        method: "POST",
        body: payload, // { employeeId, password }
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useSignUpMutation, useVerifyEmailMutation, useLoginMutation } = authAPI;
