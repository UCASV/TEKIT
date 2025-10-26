import { Container, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f9fafb' }}>
      <Container>
        <div className="text-center">
          <h1 className="display-1 fw-bold" style={{ fontSize: '8rem', color: '#4f46e5' }}>
            404
          </h1>
          <h2 className="fw-bold mb-3">Página no encontrada</h2>
          <p className="text-muted mb-4">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <Button as={Link} to="/" variant="primary" size="lg">
              Volver al Inicio
            </Button>
            <Button as={Link} to="/contacto" variant="outline-primary" size="lg">
              Contactar Soporte
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default NotFound