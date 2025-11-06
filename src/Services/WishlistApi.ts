import { createApi } from "@reduxjs/toolkit/query/react";
import { BaseApi } from "./BaseApi";
import type {
  ApiResponse,
} from "../common/Common";
import type { WishlistItemBodyRequest } from "../common/WishlistTypes";

export const WishlistApi = createApi({
  reducerPath: "wishlistApi",
  baseQuery: BaseApi,
  endpoints: (builder) => ({
    addToWishListApi: builder.mutation<ApiResponse, WishlistItemBodyRequest>({
      query: (body) => ({
        url: "/Wishlist/AddItemToWishlist",
        method: "POST",
        body,
      }),
    }),
    removeFromWishListApi: builder.mutation< ApiResponse,WishlistItemBodyRequest>({
      query: (body) => ({
        url: "/Wishlist/RemoveItemFromWishlist",
        method: "DELETE",
        body,
      }),
    }),
    clearWishListApi: builder.mutation<ApiResponse, { userId: string; }>({
      query: (body) => ({
        url: "/Wishlist/ClearWishlist",
        method: "DELETE",
        body,
      }),
    }),
    getWishlistForUserApi: builder.query<number[], string >({
      query: (userId) => `/Wishlist/GetWishlist?userId=${userId}`,
    }),
  }),
});

export const { 
  useAddToWishListApiMutation,
  useRemoveFromWishListApiMutation,
  useClearWishListApiMutation,
  useGetWishlistForUserApiQuery
} = WishlistApi;