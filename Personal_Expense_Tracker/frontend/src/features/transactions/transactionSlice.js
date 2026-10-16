import { createSlice } from "@reduxjs/toolkit";
import { fetchTransactions,createTransaction,updateTransaction,deleteTransaction } from "./transactionThunks";

const initialState = {
  items: [],
  loading: false,
  saving: false,
  error: null,
};

const transactionSlice = createSlice({
  name: "transactions",

  initialState,

  reducers: {
     clearTransactionError: (state) => {
      state.error = null;
    },  
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })

      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(createTransaction.pending, (state) => {
        state.saving = true;
        state.error = null;
      })

      .addCase(createTransaction.fulfilled, (state, action) => {
        state.saving = false;
        state.items.unshift(action.payload);
      })

      .addCase(createTransaction.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Failed to create transaction";
      })  


      .addCase(updateTransaction.pending, (state) => {
        state.saving = true;
        state.error = null;
      })

      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.saving = false;
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      })

      .addCase(updateTransaction.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Failed to update transaction";
      })

      .addCase(deleteTransaction.pending, (state) => {
        state.saving = true;
        state.error = null;
      })

      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.saving = false;
        state.items = state.items.filter(
          (item) => item.id !== action.payload
        );
      })

      .addCase(deleteTransaction.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Failed to delete transaction";
      });
  },
});

export const { clearTransactionError } = transactionSlice.actions;

export default transactionSlice.reducer;