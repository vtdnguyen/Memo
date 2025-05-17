import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
// import CookieManager from '@react-native-cookies/cookies';

export const API_URL = 'https://memo-app-be.onrender.com';
export const LOCAL_URL = 'http://localhost:8081';

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

export const getUser = createAsyncThunk(
  'user/me',
  async (_, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    console.log("token", token);
    if (!token) return rejectWithValue('Token không tồn tại');

    try {
      console.log("get user");
      const response = await axios.get(
        `${API_URL}/user/me`,
        { withCredentials: true, },
      );      
      console.log("get user response", response);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lấy thông tin người dùng thất bại');
    }
  }
);

export const uploadAvatar = createAsyncThunk(
  'user/avatar',
  async (formData: FormData, { rejectWithValue, getState }) => {
    // const cookies = await CookieManager.get(API_URL);
    // const cookieStr = Object.entries(cookies)
    //   .map(([k, v]) => `${k}=${v.value}`)
    //   .join('; ');

    try {
      const response = await axios.post(
        `${API_URL}/user/avatar`, 
        formData, 
        { 
          withCredentials: true,
          //headers: { Cookie: cookieStr }
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const apiError = error.response.data;
        return rejectWithValue(apiError.message || 'Upload avatar thất bại');
      }
      return rejectWithValue('Upload avatar thất bại');
    }
  } 
);

export const getCookie = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/refresh`,  { withCredentials: true, });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lấy cookie thất bại');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { account: string; password: string }, { rejectWithValue }) => {
    try {
      console.log("login credentials", credentials);
      const response = await axios.post(
        `${API_URL}/auth/login`, 
        credentials,
        { withCredentials: true, }
      );
      console.log("login fetch response", response);
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
      const response = await axios.post(
        `${API_URL}/auth/register`, 
        userData,
        { withCredentials: true, }
      );
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
      // Get user
      .addCase(getUser.pending, (state) => {
        // TODO: get user and navigate to profile so must be async loading
        state.loading = false;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        console.log("get user fulfilled action.payload", action.payload);
        state.user = action.payload;
        console.log("state.user", state.user);
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Upload avatar
      .addCase(uploadAvatar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.loading = false;
        console.log("upload avatar fulfilled", action.payload);
        if (state.user) {
          state.user.avatar.url = action.payload.avatarUrl;
        }
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get cookie
      .addCase(getCookie.fulfilled, (state, action) => {
        state.token = action.payload.accessTokenCookie.token;
      })
      .addCase(getCookie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        // TODO: get user and navigate to profile so must be async loading
        state.loading = true;
        state.isAuthenticated = true;
        console.log("isAuthenticated", state.isAuthenticated);
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
        // state.user = action.payload; // use to skip user interaction
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