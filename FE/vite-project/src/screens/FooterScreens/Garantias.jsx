import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap'
import './StylesFooters.css';

function Garantias() {
  const guarantees = [
    { icon: "🛡️", title: "Protección de Pago", description: "Tu dinero está protegido." },
    { icon: "✓", title: "Perfiles Verificados", description: "Todos los perfiles son revisados y verificados por nuestro equipo"},
    { icon: "⭐", title: "Sistema de Reseñas", description: "Lee opiniones reales de usuarios recientes y relacionados a tu trabajo." },
    { icon: "🔄", title: "Garantía de Satisfacción", description: "Si no estás satisfecho por c" },
    { icon: "💬", title: "Soporte 24/7", description: "Nuestro equipo está disponible..." },
    { icon: "📄", title: "Contratos/Acuerdos Claros", description: "Todos los acuerdos quedan documentados..." }
  ];

  return (
    <>
      <section className="hero-section text-white text-center py-5">
        <Container className="py-5">
          <h2 className="display-4 fw-bold mb-4"> Garantías</h2>
          <p className="lead mb-4">
            Tu seguridad y satisfacción son nuestra prioridad.
          </p>
        </Container>
      </section>

      <section className="py-5">
        <Container>
          <Row className="g-4">
            {guarantees.map((g, i) => (
              <Col key={i} md={6} lg={4}>
                <Card className="guarantee-card h-100">
                  <Card.Body className="text-center p-4">
                    <div className="guarantee-icon">{g.icon}</div>
                    <h4 className="h5 mb-3 fw-bold">{g.title}</h4>
                    <p className="text-muted mb-0">{g.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="cta-section text-white text-center py-5">
        <Container className="py-4">
          <h3 className="h2 mb-3">¿Listo para encontrar el perfil perfecto?</h3>
          <Button className="cta-main-btn">Buscar Servicios</Button>
        </Container>
      </section>
    </>
  );
}

export default Garantias;
