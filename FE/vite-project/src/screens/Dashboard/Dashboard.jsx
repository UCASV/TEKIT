import { Container, Row, Col, Card, Button } from 'react-bootstrap'

function Dashboard() {
  const stats = [
    { title: 'Servicios Activos', value: '12', icon: '📋', color: '#4f46e5' },
    { title: 'Solicitudes Pendientes', value: '5', icon: '⏳', color: '#f59e0b' },
    { title: 'Completados', value: '47', icon: '✅', color: '#10b981' },
    { title: 'Ingresos del Mes', value: '$2,450', icon: '💰', color: '#8b5cf6' }
  ]

  return (
    <Container className="py-5">
      <div className="mb-4">
        <h2 className="fw-bold mb-2">Dashboard</h2>
        <p className="text-muted">Bienvenido de nuevo, aquí está tu resumen</p>
      </div>

      <Row className="g-4 mb-5">
        {stats.map((stat, index) => (
          <Col key={index} sm={6} lg={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <p className="text-muted small mb-1">{stat.title}</p>
                    <h3 className="fw-bold mb-0">{stat.value}</h3>
                  </div>
                  <div 
                    className="rounded-circle p-3"
                    style={{ backgroundColor: `${stat.color}20`, fontSize: '1.5rem' }}
                  >
                    {stat.icon}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="fw-bold mb-4">Actividad Reciente</h5>
              <div className="text-center text-muted py-5">
                <p>No hay actividad reciente</p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="fw-bold mb-4">Acciones Rápidas</h5>
              <div className="d-grid gap-2">
                <Button variant="primary">Crear Nuevo Servicio</Button>
                <Button variant="outline-primary">Ver Solicitudes</Button>
                <Button variant="outline-secondary">Mi Perfil</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Dashboard