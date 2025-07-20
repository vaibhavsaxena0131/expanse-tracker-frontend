import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store/configureStore';

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

interface ExpensesState {
  items: Expense[];
}

const initialState: ExpensesState = {
  items: [],
};

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    setExpenses(state, action: PayloadAction<Expense[]>) {
      state.items = action.payload;
    },
    addExpense(state, action: PayloadAction<Expense>) {
      state.items.push(action.payload);
    },
  },
});

export const { setExpenses, addExpense } = expensesSlice.actions;
export const selectExpenses = (state: RootState) => state.expenses.items;
export default expensesSlice.reducer;
