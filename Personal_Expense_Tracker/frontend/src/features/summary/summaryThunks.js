import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchMonthlySummary = createAsyncThunk(
  "summary/fetchMonthlySummary",
  async (month, { rejectWithValue }) => {
    try {
      const response = await api.get("/summary/", {
        params: { month },
      });
      return response.data;
      
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch monthly summary"
      );
    }
  }
);
