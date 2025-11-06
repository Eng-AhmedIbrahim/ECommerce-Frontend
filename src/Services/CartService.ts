import { createApi } from "@reduxjs/toolkit/query/react";
import { BaseApi } from "./BaseApi";
import type { Cart, CartItem } from "../common/CartTypes";

export const CartService = createApi({
  reducerPath: "cartService",
  baseQuery: BaseApi,
  endpoints: (builder) => ({
    getCart: builder.query<Cart, string>({
      query: (userId) => ({
        url: `/cart/${userId}`,
        method: "GET",
      }),
    }),

    addToCart: builder.mutation<Cart, { userId: string; item: CartItem }>({
      query: ({ userId, item }) => ({
        url: `/cart/${userId}/add`,
        method: "POST",
        body: item,
      }),
    }),

    updateCartItem: builder.mutation<Cart, { userId: string; item: CartItem }>({
      query: ({ userId, item }) => ({
        url: `/cart/${userId}/update`,
        method: "PUT",
        body: item,
      }),
    }),

    removeCartItem: builder.mutation<Cart, { userId: string; productId: number }>({
      query: ({ userId, productId }) => ({
        url: `/cart/${userId}/remove/${productId}`,
        method: "DELETE",
      }),
    }),

    clearCartApi: builder.mutation<Cart, string>({
      query: (userId) => ({
        url: `/cart/${userId}/clear`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartApiMutation,
} = CartService;
