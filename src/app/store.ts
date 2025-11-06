import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import productData from "../features/product/ProductSlice";
import authSlice from "../features/auth/AuthSlice";
import whislistSlice from "../features/wishlist/WishList";
import cartSlice from "../features/cart/CartSlice";

import { ProductApi } from "../Services/Product";
import { CategoryApi } from "../Services/Category";
import { AuthApi } from "../Services/AuthApi";
import { WishlistApi } from "../Services/WishlistApi";
import { CartService } from "../Services/CartService";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["whislistSlice", "cartSlice","productData"],
};

const rootReducer = combineReducers({
  productData,
  authSlice,
  whislistSlice,
  cartSlice,
  [ProductApi.reducerPath]: ProductApi.reducer,
  [CategoryApi.reducerPath]: CategoryApi.reducer,
  [AuthApi.reducerPath]: AuthApi.reducer,
  [WishlistApi.reducerPath]: WishlistApi.reducer,
  [CartService.reducerPath]: CartService.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(ProductApi.middleware)
      .concat(CategoryApi.middleware)
      .concat(AuthApi.middleware)
      .concat(WishlistApi.middleware)
      .concat(CartService.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
