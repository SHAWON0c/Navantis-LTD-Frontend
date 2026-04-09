import { baseAPI } from "../../../redux/services/baseApi";

export const doctorAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Create Doctor
    createDoctor: builder.mutation({
      query: (payload) => ({
        url: "/doctors",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Doctors"],
    }),

    // ✅ Get all doctors
    getAllDoctors: builder.query({
      query: () => ({
        url: "/doctors",
        method: "GET",
      }),
      providesTags: ["Doctors"],
    }),

    // ✅ Get pending doctors (by approval level)
    getPendingDoctors: builder.query({
      query: () => ({
        url: "/doctors/pending",
        method: "GET",
      }),
      providesTags: ["Doctors"],
    }),

    // ✅ Get doctors by status
    getDoctorsByStatus: builder.query({
      query: (status) => ({
        url: `/doctors?status=${status}`,
        method: "GET",
      }),
      providesTags: ["Doctors"],
    }),

    // ✅ Get single doctor by ID
    getDoctorById: builder.query({
      query: (id) => ({
        url: `/doctors/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Doctors", id }],
    }),

    // ✅ Update Doctor (individual fields or multiple)
    updateDoctor: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/doctors/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Doctors", id }, "Doctors"],
    }),

    // ✅ Approve Doctor
    approveDoctor: builder.mutation({
      query: (id) => ({
        url: `/doctors/${id}/approve`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: (result, error, id) => [{ type: "Doctors", id }, "Doctors"],
    }),

    // ✅ Reject Doctor
    rejectDoctor: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/doctors/${id}/reject`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Doctors", id }, "Doctors"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateDoctorMutation,
  useGetAllDoctorsQuery,
  useGetPendingDoctorsQuery,
  useGetDoctorsByStatusQuery,
  useGetDoctorByIdQuery,
  useUpdateDoctorMutation,
  useApproveDoctorMutation,
  useRejectDoctorMutation,
} = doctorAPI;
