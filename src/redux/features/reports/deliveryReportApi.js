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

export const deliveryReportAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getDeliveryReport: builder.query({
      query: (params = {}) => ({
        url: "/reports/order-summary/delivery-report",
        method: "GET",
        params: cleanParams(params),
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useLazyGetDeliveryReportQuery } = deliveryReportAPI;
