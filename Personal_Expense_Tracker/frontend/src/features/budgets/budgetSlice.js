import { createSlice } from "@reduxjs/toolkit";
import {fetchBudgets,createBudget,updateBudget,deleteBudget} from "./budgetThunks";

const initialState = {
  items: [],
  loading: false,
  saving: false,
  error: null,
};

const budgetSlice = createSlice({
  name: "budgets",

  initialState,

  reducers: {
    clearBudgetError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchBudgets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch budgets";
      })


      .addCase(createBudget.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createBudget.fulfilled, (state, action) => {
        state.saving = false;
        state.items.unshift(action.payload);
      })
      .addCase(createBudget.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Failed to create budget";
      })


      .addCase(updateBudget.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        state.saving = false;
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      })
      .addCase(updateBudget.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Failed to update budget";
      })


      .addCase(deleteBudget.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.saving = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteBudget.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Failed to delete budget";
      });
  },
});

export const { clearBudgetError } = budgetSlice.actions;

export default budgetSlice.reducer;
