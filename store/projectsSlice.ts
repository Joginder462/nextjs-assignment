"use client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

type Project = {
  _id: string;
  title: string;
  description: string;
  status: "active" | "completed";
};

type State = {
  items: Project[];
  loading: boolean;
  error: string | null;
};

const initialState: State = { items: [], loading: false, error: null };

export const fetchProjects = createAsyncThunk("projects/fetch", async () => {
  const { data } = await axios.get("/api/projects");
  return data.projects as Project[];
});

const slice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load";
      });
  },
});

export default slice.reducer;
