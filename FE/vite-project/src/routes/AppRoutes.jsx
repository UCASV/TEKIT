import { Routes, Route } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout/MainLayout'
import Home from '../screens/Home/Home'
import Search from '../screens/Search/Search'
import Login from '../screens/Login/Login'
import Register from '../screens/Register/Register'
import NotFound from '../screens/NotFound/NotFound'
import Ayuda from '../screens/FooterScreens/Ayuda'
import Consejos from '../screens/FooterScreens/Consejos'
import Garantias from '../screens/FooterScreens/Garantias'
import Terminos from '../screens/FooterScreens/Terminos'
import Categories from '../screens/Categories/Categories'
import Contact from '../screens/FooterScreens/Contact'
import Comunidad from '../screens/FooterScreens/Comunidad'
import RecuperarPassword from '../screens/Login/RecuperarPassword'
import ServiceForm from '../screens/ServiceForm/ServiceForm'
import ProfilePage from '../screens/Profile/ProfilePage' // NUEVA VISTA CENTRAL DE PERFIL
import PerfilContratante from '../screens/PerfilContratante/PerfilContratante' // Reutilizada para perfil público

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/recuperar-password" element={<RecuperarPassword />} />
      
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/buscar" element={<Search />} />
        
        {/* Rutas de Perfil Centralizadas */}
        <Route path="/profile" element={<ProfilePage />} />             {/* Nuevo punto de acceso Mi Perfil */}
        <Route path="/dashboard" element={<ProfilePage />} />           {/* Redirige dashboard al ProfilePage */}
        <Route path="/perfil-cliente" element={<ProfilePage />} />       {/* Redirige perfil-cliente al ProfilePage */}

        {/* Ruta de Perfil Público (para ver perfiles de otros) */}
        <Route path="/profesional/:id" element={<PerfilContratante/>} /> 

        {/* Rutas de Servicio Profesional */}
        <Route path="/ofrecer-servicios" element={<ServiceForm />} />
        
        {/* Rutas de Información y Footer */}
        <Route path="/ayuda" element={<Ayuda />} />
        <Route path="/consejos" element={<Consejos />} />
        <Route path="/garantias" element={<Garantias />} />
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/privacidad" element={<Terminos />} />
        <Route path="/categorias" element={<Categories />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/comunidad" element={<Comunidad />} />
        <Route path="/crear-perfil" element={<Register />} />
        
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes