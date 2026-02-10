// import { baseAPI } from "../../services/baseApi";

// export const warehouseDamageAPI = baseAPI.injectEndpoints({
//     endpoints: (builder) => ({
//         // Fetch all damage requests
//         getDamageRequests: builder.query({
//             query: () => ({
//                 url: "/warehouse/damage-report", // your backend GET endpoint
//                 method: "GET",
//             }),
//         }),

//         // Submit a new damage request
//         submitDamageRequest: builder.mutation({
//             query: ({ warehouseReceiveId, damageQuantity, remarks, addedBy }) => ({
//                 url: "/warehouse/damage", // backend POST endpoint
//                 method: "POST",
//                 body: {
//                     warehouseReceiveId,
//                     damageQuantity,
//                     remarks,
//                     addedBy, // { name, email }
//                 },
//             }),
//         }),


//         // Optionally: Approve / Deny a damage request
//         updateDamageRequestStatus: builder.mutation({
//             query: ({ damageRequestId, status }) => ({
//                 url: `/warehouse/damage/${damageRequestId}`, // PUT endpoint
//                 method: "PUT",
//                 body: { status },
//             }),
//         }),
//     }),
//     overrideExisting: false,
// });


// add another api /warehouse/damage-report-all  for daage api 

// =http://localhost:5000/api/warehouse/damage-report-all    wil be ?status-penidng / approved 


// export const {
//     useGetDamageRequestsQuery,
//     useSubmitDamageRequestMutation,
//     useUpdateDamageRequestStatusMutation,
// } = warehouseDamageAPI;



import { baseAPI } from "../../services/baseApi";

export const warehouseDamageAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        // Fetch all damage requests (default)
        getDamageRequests: builder.query({
            query: () => ({
                url: "warehouse/damage/pending", // GET endpoint
                method: "GET",
            }),
        }),

        // Fetch all damage reports (with optional status filter)
        getAllDamageReports: builder.query({
            query: (status) => ({
                url: `/warehouse/damage-report-all${status ? `?status=${status}` : ""}`,
                method: "GET",
            }),
        }),

        // Submit a new damage request
        submitDamageRequest: builder.mutation({
            query: ({ warehouseReceiveId, damageQuantity, remarks, addedBy }) => ({
                url: "/warehouse/damage", // POST endpoint
                method: "POST",
                body: { warehouseReceiveId, damageQuantity, remarks, addedBy },
            }),
        }),

        // Approve / Deny a damage request
        updateDamageRequestStatus: builder.mutation({
            query: ({ damageRequestId, status }) => ({
                url: `/warehouse/damage/${damageRequestId}`, // PUT endpoint
                method: "PUT",
                body: { status },
            }),
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetDamageRequestsQuery,
    useGetAllDamageReportsQuery, // <-- added new hook
    useSubmitDamageRequestMutation,
    useUpdateDamageRequestStatusMutation,
} = warehouseDamageAPI;
