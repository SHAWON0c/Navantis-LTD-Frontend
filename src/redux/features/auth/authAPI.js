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
        body: payload, // { email, otp, employeeId }
      }),
    }),
    login: builder.mutation({
      query: (payload) => ({
        url: "/auth/login",
        method: "POST",
        body: payload, // { employeeId, password }
      }),
    }),
    resendOtp: builder.mutation({
      query: (payload) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: payload, // { email }
      }),
    }),
    forgotPassword: builder.mutation({
      query: (payload) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: payload, // { email }
      }),
    }),
    verifyPasswordOtp: builder.mutation({
      query: (payload) => ({
        url: "/auth/verify-password-otp",
        method: "POST",
        body: payload, // { email, otp, employeeId }
      }),
    }),
    resetPassword: builder.mutation({
      query: (payload) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: payload, // { email, newPassword, confirmPassword }
      }),
    }),
  }),
  overrideExisting: false,
});

export const { 
  useSignUpMutation, 
  useVerifyEmailMutation, 
  useLoginMutation, 
  useResendOtpMutation,
  useForgotPasswordMutation,
  useVerifyPasswordOtpMutation,
  useResetPasswordMutation
} = authAPI;
