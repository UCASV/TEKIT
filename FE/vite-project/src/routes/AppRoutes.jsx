import { Routes, Route } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout/MainLayout'
import Home from '../screens/Home/Home'
import Search from '../screens/Search/Search'
import Login from '../screens/Login/Login'
import Register from '../screens/Register/Register'
import Dashboard from '../screens/Dashboard/Dashboard'
import PerfilCliente from '../screens/PerfilCliente/PerfilCliente'
import PerfilContratante from '../screens/PerfilContratante/PerfilContratante'
import NotFound from '../screens/NotFound/NotFound'
import Garantias from '../screens/FooterScreens/Garantias';
import Consejos from '../screens/FooterScreens/Consejos';
import Ayuda from '../screens/FooterScreens/Ayuda';
import Terminos from '../screens/FooterScreens/Terminos';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/buscar" element={<Search />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/perfil-cliente" element={<PerfilCliente/>} />
        <Route path="/perfil-contratante" element={<PerfilContratante/>} />
      </Route>

      <Route path="*" element={<NotFound />} />

      <Route path="/garantias" element={<Garantias />} />
      <Route path="/consejos" element={<Consejos />} />
      <Route path="/ayuda" element={<Ayuda />} />
      <Route path="/terminos" element={<Terminos />} />


    </Routes>
  )
}

export default AppRoutes