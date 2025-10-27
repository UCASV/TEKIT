import { Routes, Route } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout/MainLayout'
import Home from '../screens/Home/Home'
import Login from '../screens/Login/Login'
import Register from '../screens/Register/Register'
import Dashboard from '../screens/Dashboard/Dashboard'
import NotFound from '../screens/NotFound/NotFound'

function AppRoutes() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Rutas con layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* Ruta 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes