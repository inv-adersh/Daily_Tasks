import { createSlice } from "@reduxjs/toolkit";
import { fetchMonthlySummary } from "./summaryThunks";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const summarySlice = createSlice({
  name: "summary",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonthlySummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlySummary.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchMonthlySummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load summary";
      });
  },
});

export default summarySlice.reducer;
