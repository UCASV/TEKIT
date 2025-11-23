import { Link, useNavigate } from 'react-router-dom'
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap'
import { User, Briefcase, LogIn } from 'lucide-react' 
import { useAuth } from '../../../context/AuthContext'
import './Navbar.css'

function Navbar() {
  const { user, isAuthenticated, hasRole, logout } = useAuth()
  const navigate = useNavigate()
  
  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // ROLES.PROFESIONAL = 2
  const isProfessional = hasRole(2) 

  return (
    <BootstrapNavbar bg="white" expand="lg" className="navbar-custom border-bottom shadow-sm">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <span className="brand-logo fw-bold">TEKIT</span>
          <span className="brand-tagline ms-2 text-muted small d-none d-md-inline">
            Marketplace Profesional
          </span>
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/buscar" className="nav-link-custom">
              Explorar
            </Nav.Link>
            <Nav.Link as={Link} to="/categorias" className="nav-link-custom">
              Categorías
            </Nav.Link>
            <Nav.Link as={Link} to="/ayuda" className="nav-link-custom">
              Ayuda
            </Nav.Link>
            
            {isAuthenticated ? (
                <>
                    {/* Botón de Mi Perfil (para ambos roles) */}
                    <Nav.Link as={Link} to="/profile" className="nav-link-custom ms-lg-3">
                        <User size={20} className="me-1" />
                        Mi Perfil
                    </Nav.Link>
                    
                    {/* Botón de Publicar Servicio (solo para profesionales) */}
                    {isProfessional && (
                        <Button 
                            as={Link} 
                            to="/ofrecer-servicios" 
                            variant="primary" 
                            className="ms-lg-2 mt-2 mt-lg-0 btn-custom"
                        >
                            <Briefcase size={16} className="me-1" />
                            Publicar Servicio
                        </Button>
                    )}
                    
                    {/* Botón de Logout */}
                    <Button 
                        variant="link" 
                        onClick={handleLogout}
                        className="ms-lg-2 mt-2 mt-lg-0 text-danger text-decoration-none"
                    >
                        Salir
                    </Button>
                </>
            ) : (
                <>
                    <Nav.Link as={Link} to="/login" className="nav-link-custom ms-lg-3">
                        <LogIn size={20} className="me-1" />
                        Iniciar Sesión
                    </Nav.Link>
                    
                    <Button 
                        as={Link} 
                        to="/register" 
                        variant="primary" 
                        className="ms-lg-2 mt-2 mt-lg-0 btn-custom"
                    >
                        Regístrate
                    </Button>
                </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  )
}

export default Navbar