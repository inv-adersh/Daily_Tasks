import { configureStore } from "@reduxjs/toolkit";
import transactionReducer from "../features/transactions/transactionSlice";
import summaryReducer from "../features/summary/summarySlice";
import budgetReducer from "../features/budgets/budgetSlice";

export const store = configureStore({
  reducer: {
    transactions: transactionReducer,
    summary: summaryReducer,
    budgets: budgetReducer,
  },
});