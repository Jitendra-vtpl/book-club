import { Navigate, Outlet } from 'react-router-dom'
import Header from '../components/Header'
import { useAuth } from '../hooks/useAuth'

const AuthLayout = () => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return (
    <div className="main">
      <Header />
      <Outlet/>
    </div>
  )
}

export default AuthLayout