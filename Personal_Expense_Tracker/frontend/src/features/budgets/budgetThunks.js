import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchBudgets = createAsyncThunk(
  "budgets/fetchBudgets",
  async (month, { rejectWithValue }) => {
    try {
      const response = await api.get("/budgets/", {
        params: month ? { month } : {},
      });
      return response.data;

    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch budgets"
      );
    }
  }
);

export const createBudget = createAsyncThunk(
  "budgets/createBudget",
  async (budgetData, { rejectWithValue }) => {
    try {
      const response = await api.post("/budgets/", budgetData);
      return response.data;

    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to create budget"
      );
    }
  }
);

export const updateBudget = createAsyncThunk(
  "budgets/updateBudget",
  async ({ id, budgetData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/budgets/${id}/`, budgetData);
      return response.data;

    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update budget"
      );
    }
  }
);

export const deleteBudget = createAsyncThunk(
  "budgets/deleteBudget",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/budgets/${id}/`);
      return id;
      
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete budget"
      );
    }
  }
);
