import { createApi } from "@reduxjs/toolkit/query/react";
import { BaseApi } from "./BaseApi";
import { setCredentials, logoutAction } from "../features/auth/AuthSlice";
import type { LoginResponseDto } from "../common/AuthTypes";

export const AuthApi = createApi({
  reducerPath: "authApi",
  baseQuery: BaseApi,
  endpoints: (builder) => ({
    loginApi: builder.mutation<LoginResponseDto,{ credentials: { email: string; password: string }; rememberMe: boolean }>({
      query: ({ credentials }) => ({
        url: "/Account/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted({ rememberMe }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const storage = rememberMe ? localStorage : sessionStorage;

          storage.setItem(
            "authUser",
            JSON.stringify({
              user: data,
              accessToken: data.token,
            })
          );

          dispatch(
            setCredentials({
              user: data,
              accessToken: data.token,
            })
          );
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
    }),

    logoutApi: builder.mutation<void, void>({
      query: () => ({
        url: "/Account/logout",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logoutAction());
          localStorage.removeItem("authUser");
          sessionStorage.removeItem("authUser");
          localStorage.removeItem("persist:root");
        } catch (err) {
          console.error("Logout failed", err);
        }
      },
    }),

    registerApi: builder.mutation<LoginResponseDto, FormData>({
      query: (credentials: FormData) => ({
        url: "/Account/register",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const {
  useLoginApiMutation,
  useLogoutApiMutation,
  useRegisterApiMutation,
} = AuthApi;
