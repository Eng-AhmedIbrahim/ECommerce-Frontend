import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Cart, CartItem } from "../../common/CartTypes";

const initialState: Cart = {
  items: [],
  totalItems: 0,
  totalQuantity: 0,
  subTotal: 0,
  discountTotal: 0,
  grandTotal: 0,
  userId: null,
  isGuest: true,
  updatedAt: new Date().toISOString(),
};

const calculateTotals = (cart: Cart) => {
  cart.totalItems = cart.items.length;
  cart.totalQuantity = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  cart.subTotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  cart.discountTotal = cart.items.reduce((sum, i) => {
    if (i.discountPercentage)
      return sum + (i.originalPrice ?? 0 - i.price) * i.quantity;
    return sum;
  }, 0);

  cart.grandTotal = cart.subTotal - (cart.discountTotal ?? 0);
  cart.updatedAt = new Date().toISOString();
};

const CartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
    setCart: (_, action: PayloadAction<Cart>) => {
      return { ...action.payload };
    },

    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload;

      const existing = state.items.find((i) => {
        if (i.productId !== newItem.productId) return false;

        const keys1 = Object.keys(i.selectedVariants || {});
        const keys2 = Object.keys(newItem.selectedVariants || {});
        if (keys1.length !== keys2.length) return false;

        return keys1.every(
          (key) =>
            newItem.selectedVariants &&
            i.selectedVariants &&
            JSON.stringify(i.selectedVariants[key]) ===
              JSON.stringify(newItem.selectedVariants[key])
        );
      });

      if (existing) {
        existing.quantity += newItem.quantity;
      } else {
        state.items.push(newItem);
      }

      calculateTotals(state);
    },

    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ id: number; change: number }>
    ) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(1, item.quantity + action.payload.change);
        calculateTotals(state);
      }
    },

    removeItemFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      calculateTotals(state);
    },

    clearCart: () => {
      return { ...initialState, updatedAt: new Date().toISOString() };
    },

    syncCartWithUser: (state, action: PayloadAction<string | null>) => {
      if (action.payload) {
        state.userId = action.payload;
        state.isGuest = false;
      } else {
        state.userId = null;
        state.isGuest = true;
      }
    },
  },
});

export const {
  setCart,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart,
  clearCart,
  syncCartWithUser,
} = CartSlice.actions;

export default CartSlice.reducer;
