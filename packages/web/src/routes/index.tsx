import { Routes, Route } from 'react-router-dom'
import { authProtectedRoutes, publicRoutes } from './allRoutes'
import PublicLayout from '../layouts/PublicLayout'
import AuthLayout from '../layouts/AuthLayout'

export const Index = () => {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        {publicRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={route.component}
          />
        ))}
      </Route>

      <Route path="/" element={<AuthLayout />}>
        {authProtectedRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={route.component}
          />
        ))}
      </Route>
    </Routes>
  )
}

export default Index