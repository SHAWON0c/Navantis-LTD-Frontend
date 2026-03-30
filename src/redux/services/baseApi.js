// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const baseAPI = createApi({
//   reducerPath: "baseAPI",
//   baseQuery: fetchBaseQuery({
//     baseUrl: "http://localhost:5000/api", 

//     prepareHeaders: (headers) => {
//       const token = localStorage.getItem("token");
//       if (token) {
//         headers.set("Authorization", token); // ✅ just the token, no "Bearer "
//       }
//       return headers;
//     },
//   }),
//   endpoints: () => ({}),
// });



// // https://testbackend2.navantispharma.com/



import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { resetAuthState } from "../features/auth/authSlice"; // adjust path

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,

  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");

    if (token) {
      headers.set("Authorization", token); // your backend expects raw token
    }

    return headers;
  },
});

const isSuspensionSignal = (errorData) => {
  const code = String(errorData?.code || errorData?.errorCode || "").toUpperCase();
  const message = String(errorData?.message || errorData?.error || "").toUpperCase();

  if (errorData?.forceLogout === true || errorData?.force_logout === true) {
    return true;
  }

  return /SUSPEND|DEACTIVAT/.test(code) || /SUSPEND|DEACTIVAT/.test(message);
};

const isLoginRequest = (args) => {
  if (typeof args === "string") {
    return args.includes("/auth/login");
  }

  return typeof args?.url === "string" && args.url.includes("/auth/login");
};

const baseQueryWithAuth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  const status = result?.error?.status;
  const errorData = result?.error?.data;

  const shouldForceLogout =
    status === 401 || (status === 403 && isSuspensionSignal(errorData));

  // Auto logout on invalid token, suspension, or deactivation signals.
  if (result.error && shouldForceLogout && !isLoginRequest(args)) {
    const message =
      errorData?.message || "Your account session is no longer valid. Please login again.";

    sessionStorage.setItem("authLogoutReason", message);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("employeeId");

    // reset all RTK Query cached data so next login never sees stale previous-user data
    api.dispatch(baseAPI.util.resetApiState());

    // reset redux auth
    api.dispatch(resetAuthState());

    // redirect to login
    window.location.replace("/login");
  }

  return result;
};

export const baseAPI = createApi({
  reducerPath: "baseAPI",
  baseQuery: baseQueryWithAuth,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: () => ({}),
});