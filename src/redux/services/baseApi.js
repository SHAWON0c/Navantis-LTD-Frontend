import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseAPI = createApi({
  reducerPath: "baseAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/", 

    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", token); // ✅ just the token, no "Bearer "
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
});



// https://testbackend2.navantispharma.com/



