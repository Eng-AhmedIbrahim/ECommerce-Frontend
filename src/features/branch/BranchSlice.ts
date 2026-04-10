import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { BranchToReturnDto } from "../../common/Branch";

const BranchSlice = createSlice({
  name: "brancheSlice",
  initialState: [] as BranchToReturnDto[],
  reducers: {
    setBranches: (_, action: PayloadAction<BranchToReturnDto[]>) => {
      return { ...action.payload };
    },
  },
});

export default BranchSlice.reducer;
export const { setBranches } = BranchSlice.actions;
