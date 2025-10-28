import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap'
import './StylesFooters.css';


function Consejos() {
  const tips = [
    { title: "Crea un Perfil Completo", description: "Incluye una foto de perfil, experiencia previa y trabajos anteriores..." },
    { title: "Establece Precios Competitivos", description: "Investiga el costo de servicios similares y establezca su precio en ese rango..." },
    { title: "Responde Rápidamente", description: "Los clientes valoran la rapidez de respuesta, mantengase activo y con actitud dispuesta..." },
    { title: "Solicita Reseñas", description: "Después de completar un trabajo, solicita la retroalimentación de tu cliente para evaluar tu servicio..." },
  ];

  return (
    <>
      <section className="hero-section text-white text-center py-5">
        <Container className="py-5">
          <h2 className="display-4 fw-bold mb-4">Consejos para Tener Éxito</h2>
        </Container>
      </section>

      <section className="py-5">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto">
              {tips.map((t, i) => (
                <div key={i} className="tip-card">
                  <div className="d-flex">
                    <div className="tip-number me-3">{i + 1}</div>
                    <div>
                      <h4 className="h5 mb-2 fw-bold">{t.title}</h4>
                      <p className="text-muted mb-0">{t.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </Col>
          </Row>
        </Container>
      </section>

      <section className="cta-section text-white text-center py-5">
        <Container className="py-4">
          <h3 className="h2 mb-3">¿Listo para trabajar en un nuevo proyecto?</h3>
          <Button className="cta-main-btn">Crear mi Perfil Profesional </Button>
        </Container>
      </section>
    </>
  );
}

export default Consejos;
