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

export const productSummaryReportAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getProductSummaryReport: builder.query({
      query: (params = {}) => ({
        url: "/reports/order-summary",
        method: "GET",
        params: cleanParams(params),
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useLazyGetProductSummaryReportQuery } = productSummaryReportAPI;
