import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppProduct } from "../../common/ProductTypes";

interface ProductState {
  value: AppProduct[];
}

const initialState: ProductState = {
  value: [],
};

const ProductSlice = createSlice({
  name: "productData",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<AppProduct[]>) => {
      state.value = action.payload;
    },
    addProduct: (state, action: PayloadAction<AppProduct>) => {
      state.value.push(action.payload);
    },
    updateProduct: (state, action: PayloadAction<AppProduct>) => {
      const index = state.value.findIndex(
        (p) => p.Product.id === action.payload.Product.id
      );
      if (index !== -1) state.value[index] = action.payload;
    },
    removeProduct: (state, action: PayloadAction<number>) => {
      state.value = state.value.filter((p) => p.Product.id !== action.payload);
    },
    updateProductLove: (
      state,
      action: PayloadAction<{ id: number; love: boolean }>
    ) => {
      const { id, love } = action.payload;
      const product = state.value.find((p) => p.Product.id === id);
      if (product) product.Love = love;
    }
  },
});

export const {
  setProducts,
  addProduct,
  updateProduct,
  removeProduct,
  updateProductLove,
} = ProductSlice.actions;

export default ProductSlice.reducer;
