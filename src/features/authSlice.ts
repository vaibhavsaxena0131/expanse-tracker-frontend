import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store/configureStore';
import api from '../api/axios';

interface User {
  id: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

/**
 * Async thunk: login
 */
export const login = createAsyncThunk<
  { user: User }, // Only user is returned
  { email: string; password: string },
  { rejectValue: string }
>(
  '/auth/login',
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      return {
        user: res.data.user,
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Login failed'
      );
    }
  }
);
// export const login = createAsyncThunk<
//   User, // return type
//   { email: string; password: string },
//   { rejectValue: string }
// >(
//   '/auth/login',
//   async ({ email, password }, thunkAPI) => {
//     try {
//       const res = await api.post('/auth/login', { email, password });
//       console.log("this is the response", res);
      
//       return res.data.user; // adjust if backend returns differently
//     } catch (err: any) {
//       return thunkAPI.rejectWithValue(
//         err.response?.data?.message || 'Login failed'
//       );
//     }
//   }
// );

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
  builder
    .addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(login.fulfilled, (state, action: PayloadAction<{ user: User }>) => {
  state.isLoading = false;
  state.user = action.payload.user;
})
    .addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Login failed';
    });
},
});

export const { logout } = authSlice.actions;
export const selectUser = (state: RootState) => state.auth.user;
export default authSlice.reducer;
