import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const API_URL = 'https://memo-app-be.onrender.com';
export const API_URL_LOCAL = 'http://localhost:8081';

const initialState: AuthState = {
  token: null,
  refreshToken: null,
  isFirstTimeUser: false,
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null
};

export const completeOnboarding = createAsyncThunk(
  'auth/completeOnboarding',
  async (_, { rejectWithValue }) => {
    try {
      console.log("complete onboarding");
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Đăng ký thất bại');
    }
  }
);
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { account: string; password: string }, { rejectWithValue }) => {
    try {
      console.log("login credentials", credentials);
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      console.log("login fetch response", response);
      
      const { accessTokenCookie, refreshTokenCookie } = response.data;
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessTokenCookie}`;

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  }
);

export const signup = createAsyncThunk(
  'auth/register',
  async (userData: {
    email?: string;
    phoneNumber?: string;
    password: string;
    firstName: string;
    lastName: string;
    username: string;
  }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Đăng ký thất bại');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      delete axios.defaults.headers.common['Authorization'];
      return null;
    } catch (error: any) {
      return rejectWithValue('Đăng xuất thất bại');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Complete onboarding
      .addCase(completeOnboarding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeOnboarding.fulfilled, (state, action) => {
        state.loading = false;
        state.isFirstTimeUser = false;
      })
      .addCase(completeOnboarding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        console.log("login fulfilled", action.payload);
        state.token = action.payload.accessTokenCookie.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        console.log("login rejected", action.payload);
        state.error = action.payload as string;
      })
      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        console.log("signup fulfilled", action.payload);
        state.user = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        console.log("signup rejected", action.payload);
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.isAuthenticated = false;
        state.user = null;
      });
  }
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;