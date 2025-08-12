import React from 'react'
import { useAuthInit } from '../hooks/useAuthInit'

// This component doesn't render anything, it just initializes auth
const AuthInitializer: React.FC = () => {
  useAuthInit()
  return null
}

export default AuthInitializer 