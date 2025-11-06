import { createApi } from "@reduxjs/toolkit/query/react";
import { BaseApi } from "./BaseApi";
import type { Product, ProductReviewDto, ProductReviewToReturnDto } from "../common/ProductTypes";

export const ProductApi = createApi({
  reducerPath: "productsApi",
  baseQuery: BaseApi,
  endpoints: (build) => ({
    getProducts: build.query<Product[],void>({
        query : () => '/Product/get-products'
    }),
    addReview : build.mutation<ProductReviewToReturnDto,ProductReviewDto>({
      query:(body :ProductReviewDto) => ({
        url:'/ProductReview/add-review',
        method:'POST',
        body
      })
    })
  }),
});

export const { useGetProductsQuery ,useAddReviewMutation} = ProductApi;