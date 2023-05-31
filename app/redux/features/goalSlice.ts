import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Goal } from '@prisma/client';
import axios from 'axios';

interface GoalsState {
  budgets: Goal[] | null;
  isLoading: boolean;
}

const initialState: GoalsState = {
  budgets: null,
  isLoading: false,
};

export const fetchGoals = createAsyncThunk('goals/fetchGoals', async () => {
  const response = await axios.get(`/api/user/goals`);
  return response.data.goals;
});

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.budgets = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchGoals.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default goalsSlice.reducer;