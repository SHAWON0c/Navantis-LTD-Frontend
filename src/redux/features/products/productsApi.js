import { baseAPI } from "../../services/baseApi";

export const productsApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query({
      query: () => "/products/brands",
      transformResponse: (response) => response.brands,
      providesTags: ["Products"],
    }),
    getProductsByBrand: builder.query({
      query: (brand) => `products/brand/${brand}`, // endpoint with brand param
      providesTags: ["Products"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBrandsQuery,
  useGetProductsByBrandQuery,
} = productsApi;
