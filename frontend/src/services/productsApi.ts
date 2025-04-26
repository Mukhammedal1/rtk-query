import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Product {
  _id: string;
  name: string;
  price: number;
}

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/" }),
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => "products",
    }),
    addProduct: builder.mutation<void, Product>({
      query: (newProduct) => ({
        url: "products",
        method: "POST",
        body: newProduct,
      }),
    }),
    updateProduct: builder.mutation<
      void,
      { _id: string; updatedProduct: Product }
    >({
      query: ({ _id, updatedProduct }) => ({
        url: `products/${_id}`,
        method: "PATCH",
        body: updatedProduct,
      }),
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (_id) => ({
        url: `products/${_id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
