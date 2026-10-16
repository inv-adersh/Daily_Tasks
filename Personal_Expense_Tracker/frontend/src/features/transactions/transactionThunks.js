import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";


export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/transactions/", {
        params: filters,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch transactions"
      );
    }
  }
);


export const createTransaction = createAsyncThunk(
  "transactions/createTransaction",

  async (transactionData, { rejectWithValue }) => {
    try {
      const response = await api.post("/transactions/",transactionData);
      return response.data;

    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to create transaction"
      );
    }
  }
);

export const updateTransaction = createAsyncThunk(
  "transactions/updateTransaction",

  async ({ id, transactionData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/transactions/${id}/`,transactionData);
      return response.data;

    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update transaction"
      );
    }
  }
);


export const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",

  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/transactions/${id}/`);
      return id;
      
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete transaction"
      );
    }
  }
);