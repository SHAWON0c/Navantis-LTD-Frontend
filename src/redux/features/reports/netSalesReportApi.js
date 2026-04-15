import { baseAPI } from "../../services/baseApi";

const cleanParams = (params = {}) => {
  const query = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    query[key] = value;
  });

  return query;
};

export const netSalesReportAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getNetSalesReport: builder.query({
      query: (params = {}) => ({
        url: "/reports/sales/net-sales/report",
        method: "GET",
        params: cleanParams(params),
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useLazyGetNetSalesReportQuery } = netSalesReportAPI;
