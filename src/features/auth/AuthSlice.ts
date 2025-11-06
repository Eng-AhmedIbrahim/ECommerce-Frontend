import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, LoginResponseDto } from "../../common/AuthTypes";

const storedAuth =
  localStorage.getItem("authUser") || sessionStorage.getItem("authUser");

const initialState: AuthState = storedAuth
  ? {
      user: JSON.parse(storedAuth).user,
      accessToken: JSON.parse(storedAuth).accessToken,
      isAuthenticated: true,
    }
  : {
      user: null,
      accessToken: null,
      isAuthenticated: false,
    };


const AuthSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: LoginResponseDto;
        accessToken: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;

    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
  },
});

export default AuthSlice.reducer;

export const { setCredentials, logout: logoutAction } = AuthSlice.actions;
