import { baseAPI } from "../../services/baseApi";

export const reportsAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getDailyCollectionReport: builder.query({
      query: ({ startDate, endDate }) => {
        let url = "/reports/payments/daily-collection";
        const params = [];
        
        if (startDate) params.push(`startDate=${startDate}`);
        if (endDate) params.push(`endDate=${endDate}`);
        
        if (params.length > 0) {
          url += "?" + params.join("&");
        }
        
        return url;
      },
    }),
    getCustomerDetailsReport: builder.query({
      query: ({ payMode, status }) => {
        let url = "/reports/customers/details";
        const params = [];
        
        if (payMode) params.push(`payMode=${payMode}`);
        if (status) params.push(`status=${status}`);
        
        if (params.length > 0) {
          url += "?" + params.join("&");
        }
        
        return url;
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetDailyCollectionReportQuery, useGetCustomerDetailsReportQuery } = reportsAPI;
