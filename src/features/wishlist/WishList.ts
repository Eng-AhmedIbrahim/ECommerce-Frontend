import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserWishlist } from "../../common/AuthTypes";
import type { Product } from "../../common/ProductTypes";

const initialState: UserWishlist = {
  user: null,
  products: [],
};

const WishList = createSlice({
  name: "whislistSlice",
  initialState,
  reducers: {
    removeFromWishlist: (state, action: PayloadAction<Product>) => {
      state.products =
        state.products?.filter((p) => p.id !== action.payload.id) ?? [];
    },
    addToWishlist: (state, action: PayloadAction<Product>) => {
      const newProduct = action.payload;
      const exists = state.products?.some((p) => p.id === newProduct.id);
      if (!exists) {
        state.products?.unshift(newProduct);
      }
    },
    removeWishlist: (state) => {
      state.products = [];
    },
  },
});

export const {removeFromWishlist,addToWishlist,removeWishlist} = WishList.actions;
export default WishList.reducer;