import { useEffect } from 'react'
import { useAppDispatch } from '../store'
import { initializeAuth } from '../store/slices/authSlice'

export const useAuthInit = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const initializeAuthState = async () => {
      try {
        // Check if we have a stored token
        const stored = localStorage.getItem('auth')
        if (stored) {
          const parsed = JSON.parse(stored)
          
          if (parsed.accessToken && parsed.user) {
            // Initialize with stored data
            dispatch(initializeAuth({
              user: parsed.user,
              accessToken: parsed.accessToken,
            }))
            
            // Try to refresh the token to ensure it's still valid
            // try {
            //   await dispatch(refreshToken()).unwrap()
            // } catch (error) {
            //   // If refresh fails, clear the stored auth
            //   localStorage.removeItem('auth')
            //   dispatch(initializeAuth({ user: null, accessToken: null }))
            // }
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        localStorage.removeItem('auth')
        dispatch(initializeAuth({ user: null, accessToken: null }))
      }
    }

    // Only run once on mount
    initializeAuthState()
  }, [dispatch])

  return { isInitialized: true }
}

export default useAuthInit 