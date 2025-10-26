import { Link } from 'react-router-dom'
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap'
import './Navbar.css'

function Navbar() {
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
            <Nav.Link as={Link} to="/" className="nav-link-custom">
              Explorar
            </Nav.Link>
            <Nav.Link as={Link} to="/categorias" className="nav-link-custom">
              Categorías
            </Nav.Link>
            <Nav.Link as={Link} to="/como-funciona" className="nav-link-custom">
              Cómo funciona
            </Nav.Link>
            
            <Nav.Link as={Link} to="/login" className="nav-link-custom ms-lg-3">
              Iniciar Sesión
            </Nav.Link>
            
            <Button 
              as={Link} 
              to="/ofrecer-servicios" 
              variant="primary" 
              className="ms-lg-2 mt-2 mt-lg-0 btn-custom"
            >
              Ofrecer Servicios
            </Button>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  )
}

export default Navbar