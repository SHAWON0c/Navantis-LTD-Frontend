// import { baseAPI } from "../../services/baseApi";

// export const territoryAPI = baseAPI.injectEndpoints({
//   endpoints: (builder) => ({
//     // 🔹 Get all territories with area & manager info
//     getAllTerritoriesWithManagers: builder.query({
//       query: () => ({
//         url: "/territories/managers", // your backend route
//         method: "GET",
//       }),
//       providesTags: ["Territories"],
//     }),

//     // 🔹 Get single territory by ID
//     getTerritoryById: builder.query({
//       query: (id) => ({
//         url: `/territories/${id}`,
//         method: "GET",
//       }),
//       providesTags: ["Territories"],
//     }),

//     // 🔹 Create a new territory
//     createTerritory: builder.mutation({
//       query: (payload) => ({
//         url: "/territories",
//         method: "POST",
//         body: payload,
//       }),
//       invalidatesTags: ["Territories"],
//     }),

//     // 🔹 Update a territory
//     updateTerritory: builder.mutation({
//       query: ({ id, data }) => ({
//         url: `/territories/${id}`,
//         method: "PUT",
//         body: data,
//       }),
//       invalidatesTags: ["Territories"],
//     }),

//     // 🔹 Delete a territory
//     deleteTerritory: builder.mutation({
//       query: (id) => ({
//         url: `/territories/${id}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["Territories"],
//     }),
//   }),
//   overrideExisting: false,
// });

// export const {
//   useGetAllTerritoriesWithManagersQuery,
//   useGetTerritoryByIdQuery,
//   useCreateTerritoryMutation,
//   useUpdateTerritoryMutation,
//   useDeleteTerritoryMutation,
// } = territoryAPI;


import { baseAPI } from "../../../redux/services/baseApi";

export const territoryAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Create Territory
    createTerritory: builder.mutation({
      query: (payload) => ({
        url: "/territories",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Territories"], // refresh list automatically
    }),

    // ✅ Get all Territories
    getTerritories: builder.query({
      query: () => ({
        url: "/territories",
        method: "GET",
      }),
      providesTags: ["Territories"],
    }),

    // ✅ Get single Territory by ID
    getTerritoryById: builder.query({
      query: (id) => ({
        url: `/territories/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Territories", id }],
    }),

    // ✅ Get all Territories with Market Points (nested)
    getTerritoriesWithMarketPoints: builder.query({
      query: () => ({
        url: "/market-points/territories-with-market-points", // backend endpoint
        method: "GET",
      }),
      providesTags: ["Territories"],
    }),
  }),
  overrideExisting: false,
});

// Correctly export hooks
export const {
  useCreateTerritoryMutation,
  useGetTerritoriesQuery,
  useGetTerritoryByIdQuery,
  useGetTerritoriesWithMarketPointsQuery, // nested API
} = territoryAPI;
