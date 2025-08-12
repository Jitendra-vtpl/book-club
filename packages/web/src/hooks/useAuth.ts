import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store'
import { refreshToken } from '../store/slices/authSlice'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const { user, accessToken, isAuthenticated, isLoading } = useAppSelector((state: any) => state.auth)

  useEffect(() => {
    if (accessToken && !user) {
      // refresh token in case of no user
      dispatch(refreshToken())
    }
  }, [dispatch, accessToken, user])

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
  }
}

export default useAuth 