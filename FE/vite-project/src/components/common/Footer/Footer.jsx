import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer bg-dark text-white">
      <Container className="py-5">
        <Row className="g-4">

          <Col md={6} lg={3}>
            <h4 className="footer-title mb-3">TEKIT</h4>
            <p className="footer-description text-muted">
              La plataforma ideal para ofrecer y contratar servicios de todo tipo.
            </p>
          </Col>

          <Col md={6} lg={3}>
            <h5 className="footer-subtitle mb-3">Para Clientes</h5>
            <ul className="footer-list list-unstyled">
              <li className="mb-2">
                <Link to="/buscar" className="footer-link text-muted text-decoration-none">
                  Buscar Servicios
                </Link>
              </li>
              
              <li className="mb-2">
                <Link to="/garantias" className="footer-link text-muted text-decoration-none">
                  Garantías
                </Link>
              </li>
            </ul>
          </Col>

          <Col md={6} lg={3}>
            <h5 className="footer-subtitle mb-3">Para Profesionales</h5>
            <ul className="footer-list list-unstyled">
              <li className="mb-2">
                <Link to="/crear-perfil" className="footer-link text-muted text-decoration-none">
                  Crear Perfil
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/consejos" className="footer-link text-muted text-decoration-none">
                  Consejos
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/comunidad" className="footer-link text-muted text-decoration-none">
                  Comunidad
                </Link>
              </li>
            </ul>
          </Col>

          <Col md={6} lg={3}>
            <h5 className="footer-subtitle mb-3">Soporte</h5>
            <ul className="footer-list list-unstyled">
              <li className="mb-2">
                <Link to="/ayuda" className="footer-link text-muted text-decoration-none">
                  Centro de Ayuda
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contacto" className="footer-link text-muted text-decoration-none">
                  Contacto
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/terminos" className="footer-link text-muted text-decoration-none">
                  Términos
                </Link>
              </li>
            </ul>
          </Col>
        </Row>

        <Row className="mt-4 pt-4 border-top border-secondary">
          <Col className="text-center">
            <p className="copyright text-muted mb-0">
              © 2025 TEKIT. Todos los derechos reservados.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer