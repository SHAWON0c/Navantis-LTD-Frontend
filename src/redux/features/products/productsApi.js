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
  useGetProductByIdQuery, // ✅ export hook
} = productsApi;
