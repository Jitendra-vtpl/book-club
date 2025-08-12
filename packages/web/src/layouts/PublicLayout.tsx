import { Outlet } from 'react-router-dom'
import Header from '../components/Header'

const PublicLayout = () => {
  return (
    <div className="public">
      <Header />
      <Outlet/>
    </div>
  )
}

export default PublicLayout