import axios from 'axios'
import CONSTANTS from './constants'
import { store } from '../store'
import { setCredentials, clearCredentials } from '../store/slices/authSlice'

const { API_URL } = CONSTANTS

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: any) => {
    const state = store.getState()
    const accessToken = state.auth.accessToken    
    // console.log('state', state)
    
    if (accessToken) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    
    return config
  },
  (error: any) => Promise.reject(error),
)

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response: any) => response,
  async (error: any) => {
    const originalRequest = error.config
    
    // If error is 401 and we haven't tried to refresh yet
    if (
      error.response?.status === 401
      && error.response?.data?.code === 'INVALID_TOKEN'
      && !originalRequest._retry
    ) {
      originalRequest._retry = true
      
      try {
        // Refresh token
        const refreshRes = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        ) as any

        const accessToken = refreshRes?.data?.data?.accessToken
        
        if (accessToken) {
          // update new access token to store
          store.dispatch(setCredentials({
            user: store.getState().auth.user,
            accessToken: accessToken,
          } as any))
          
          // replace new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return axiosInstance(originalRequest)
        }
      } catch (refreshError) {        
        // Refresh failed, logout user
        store.dispatch(clearCredentials())
        return Promise.reject(refreshError)
      }
    }
    
    return Promise.reject(error)
  },
)

export default axiosInstance 