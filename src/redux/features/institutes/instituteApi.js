import { baseAPI } from "../../../redux/services/baseApi";

export const instituteAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Create Institute
    createInstitute: builder.mutation({
      query: (payload) => ({
        url: "/institutes",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Institutes"],
    }),

    // ✅ Get all institutes
    getAllInstitutes: builder.query({
      query: () => ({
        url: "/institutes",
        method: "GET",
      }),
      providesTags: ["Institutes"],
    }),

    // ✅ Get institutes by status (pending, approved, active)
    getInstitutesByStatus: builder.query({
      query: (status) => ({
        url: `/institutes/status/${status}`,
        method: "GET",
      }),
      providesTags: ["Institutes"],
    }),

    // ✅ Get pending institutes for MD approval
    getPendingInstitutes: builder.query({
      query: (status) => ({
        url: `/institutes/pending/list?status=${status}`,
        method: "GET",
      }),
      providesTags: ["Institutes"],
    }),

    // ✅ Get single institute by ID
    getInstituteById: builder.query({
      query: (id) => ({
        url: `/institutes/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Institutes", id }],
    }),

    // ✅ Approve institute (MD only)
    approveInstitute: builder.mutation({
      query: (instituteId) => ({
        url: `/institutes/approve/${instituteId}`,
        method: "PUT",
      }),
      invalidatesTags: ["Institutes"],
    }),

    // ✅ Activate institute
    activateInstitute: builder.mutation({
      query: (instituteId) => ({
        url: `/institutes/activate/${instituteId}`,
        method: "PUT",
      }),
      invalidatesTags: ["Institutes"],
    }),

    // ✅ Update institute details
    updateInstitute: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/institutes/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Institutes"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateInstituteMutation,
  useGetAllInstitutesQuery,
  useGetInstitutesByStatusQuery,
  useGetPendingInstitutesQuery,
  useGetInstituteByIdQuery,
  useApproveInstituteMutation,
  useActivateInstituteMutation,
  useUpdateInstituteMutation,
} = instituteAPI;
