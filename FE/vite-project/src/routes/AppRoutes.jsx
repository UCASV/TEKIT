import { Routes, Route } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout/MainLayout'
import Home from '../screens/Home/Home'
import Search from '../screens/Search/Search'
import Login from '../screens/Login/Login'
import Dashboard from '../screens/Dashboard/Dashboard'
import NotFound from '../screens/NotFound/NotFound'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/buscar" element={<Search />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes