import { baseAPI } from "../../services/baseApi";

export const productsApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all brands
    getBrands: builder.query({
      query: () => "/products/brands",
      transformResponse: (response) => response.brands,
      providesTags: ["Products"],
    }),

    // ✅ Get products by brand
    getProductsByBrand: builder.query({
      query: (brand) => `/products/brand/${brand}`,
      providesTags: ["Products"],
    }),

    getDepotAvailableProductsByBrand: builder.query({
      query: (brand) => `/products/brand/${brand}/depot-available`,
      providesTags: ["Products"],
    }),

    // ✅ Get single product by ID
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      transformResponse: (response) => response.product,
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBrandsQuery,
  useGetProductsByBrandQuery,
  useGetDepotAvailableProductsByBrandQuery,
  useGetProductByIdQuery, // ✅ export hook
} = productsApi;
