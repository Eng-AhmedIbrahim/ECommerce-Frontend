import { createApi } from "@reduxjs/toolkit/query/react";
import { BaseApi } from "./BaseApi";
import type { Category } from "../common/CategoryType";

export const CategoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: BaseApi,
  endpoints: (build) => ({
    getCategories: build.query<Category[], void>({
      query: () => "/Category/getAllCategoires",
    }),
  }),
});

export const { useGetCategoriesQuery } = CategoryApi;