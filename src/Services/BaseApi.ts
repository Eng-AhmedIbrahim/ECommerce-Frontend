import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryApi, FetchArgs } from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import type { LoginResponseDto } from "../common/AuthTypes";
import { logoutAction, setCredentials } from "../features/auth/AuthSlice";

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  // baseUrl: "https://localhost:7019/api",
  baseUrl:"https://menemwebsite.runasp.net/api",
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const BaseApi = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: any
) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshToken = sessionStorage.getItem("refreshToken");

        if (!refreshToken) {
          console.warn("No refresh token found in sessionStorage");
          api.dispatch(logoutAction());
          return result;
        }

        const refreshResult = await baseQuery(
          {
            url: "/auth/refresh-token",
            method: "POST",
          },
          api,
          extraOptions
        );

        const responseData = refreshResult.data as LoginResponseDto;

        const refreshedHeaderToken =
          refreshResult.meta?.response?.headers.get("refreshToken");

        if (responseData && responseData.token) {
          api.dispatch(
            setCredentials({
              user: responseData,
              accessToken: responseData.token,
            })
          );

          localStorage.setItem("accessToken", responseData.token);

          if (refreshedHeaderToken) {
            sessionStorage.setItem("refreshToken", refreshedHeaderToken);
          }

          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logoutAction());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};