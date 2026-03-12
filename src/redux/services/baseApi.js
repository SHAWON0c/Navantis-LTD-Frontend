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
  baseUrl: "http://localhost:5000/api",

  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");

    if (token) {
      headers.set("Authorization", token); // your backend expects raw token
    }

    return headers;
  },
});

const baseQueryWithAuth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  // ✅ if JWT invalid / expired
  if (result.error && result.error.status === 401) {
    localStorage.removeItem("token");

    // reset redux auth
    api.dispatch(resetAuthState());

    // redirect to login
    window.location.href = "/login";
  }

  return result;
};

export const baseAPI = createApi({
  reducerPath: "baseAPI",
  baseQuery: baseQueryWithAuth,
  endpoints: () => ({}),
});