import { createApi } from "@reduxjs/toolkit/query/react";
import { BaseApi } from "../BaseApi";
import type { BranchToReturnDto } from "../../common/Branch";
import { setBranches } from "../../features/branch/BranchSlice";

export const GetBranchsService = createApi({
  reducerPath: "getBranchsService",
  baseQuery: BaseApi,
  endpoints: (builder) => ({
    getBranches: builder.query<BranchToReturnDto[], void>({
      query: () => ({
        url: `/Branch`,
        method: "GET",
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setBranches(data));
        } catch (err) {
          console.error("Error loading branches", err);
        }
      },
    }),
  }),
});

export const { useGetBranchesQuery } = GetBranchsService;
