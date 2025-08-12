import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authAPI } from '../../services/api'

// Async thunk for signup
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (userData: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.signup(userData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(        
        error.response?.data || error.message || 'Signup failed',
      )      
    }
  },
)

// Login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || error.message || 'Login failed',
      )
    }
  },
)

// Logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout()
      return null
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || error.message || 'Logout failed',
      )
    }
  },
)

// Refresh token
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.refresh()
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || error.message || 'Token refresh failed',
      )
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null as any | null,
    accessToken: null as string | null,
    isAuthenticated: false as boolean,
    isLoading: false as boolean,
    error: null as string | object | null,
  },
  reducers: {
    clearError: state => {
      state.error = null
    },
    setCredentials: (state, action: any) => {
      // console.log('action', action)
      state.user = action.payload?.user
      state.accessToken = action.payload?.accessToken
      state.isAuthenticated = true
      state.error = null
    },
    clearCredentials: state => {
      state.user = null
      state.accessToken = null
      state.isAuthenticated = false
      state.error = null
      localStorage.removeItem('auth')
    },
    logout: state => {
      state.user = null
      state.accessToken = null
      state.isAuthenticated = false
      state.error = null
      localStorage.removeItem('auth')
    },
    initializeAuth: (state, action: { payload: { user: any; accessToken: string | null } }) => {
      state.user = action.payload?.user || null
      state.accessToken = action.payload?.accessToken || null
      state.isAuthenticated = !!action.payload?.accessToken
      state.error = null
    },
  },
  extraReducers: builder => {
    builder
      // Signup
      .addCase(signupUser.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.error = null
      })
      .addCase(signupUser.rejected, (state, action: any) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Login
      .addCase(loginUser.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action: any) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload?.data?.user
        state.accessToken = action.payload?.data?.accessToken
        state.error = null
      
        // Persist to localStorage
        localStorage.setItem('auth', JSON.stringify({
          user: action.payload?.data?.user,
          accessToken: action.payload?.data?.accessToken,
        }))
      })
      .addCase(loginUser.rejected, (state, action: any) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Logout
      .addCase(logoutUser.fulfilled, state => {
        state.user = null
        state.accessToken = null
        state.isAuthenticated = false
        state.error = null
        localStorage.removeItem('auth')
      })
      // Refresh Token
      .addCase(refreshToken.fulfilled, (state, action: any) => {
        state.accessToken = action.payload?.data?.accessToken
        state.isAuthenticated = true
        state.error = null
        
        // Persist updated token to localStorage
        if (state.user) {
          localStorage.setItem('auth', JSON.stringify({
            user: state.user,
            accessToken: action.payload?.data?.accessToken,
          }))
        }
      })
      .addCase(refreshToken.rejected, state => {
        state.user = null
        state.accessToken = null
        state.isAuthenticated = false
        state.error = null
      })
  },
})

export const { clearError, setCredentials, clearCredentials, initializeAuth, logout } = authSlice.actions
export default authSlice.reducer 