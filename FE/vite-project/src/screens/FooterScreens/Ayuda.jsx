import { Container, Row, Col, Accordion, Button } from "react-bootstrap";
import './StylesFooters.css';

function Ayuda() {
  const faqs = [
    {
      question: "¿Cómo puedo registrarme?",
      answer:
        "Puedes registrarte haciendo clic en 'Crear cuenta' y completando tus datos personales. Es rápido y sencillo.",
    },
    {
      question: "¿Es seguro contratar servicios?",
      answer:
        "Sí, totalmente seguro. Todos los pagos están protegidos por nuestro sistema de seguridad y los trabajadores son verificados antes de ofrecer sus servicios.",
    },
    {
      question: "¿Cómo puedo dejar una reseña?",
      answer:
        "Después de que se haya completado un servicio, recibirás una notificación para dejar tu opinión sobre el trabajador. Esto ayuda a otros usuarios a elegir con confianza.",
    },
    {
      question: "¿Qué hago si tengo un problema con un servicio?",
      answer:
        "Contáctanos a través del Centro de Ayuda. Nuestro equipo de soporte analizará el caso y buscará una solución rápida y justa.",
    },
  ];

  const contactOptions = [
    {
      icon: "📧",
      title: "Email",
      description: "soporte@tekit.com",
      action: "Enviar Email",
    },
    {
      icon: "📱",
      title: "WhatsApp",
      description: "+503 1234-5678",
      action: "Contactar",
    },
  ];

  return (
    <>
      <section className="hero-section text-white text-center py-5">
        <Container className="py-5">
          <h2 className="display-4 fw-bold mb-4">Centro de Ayuda</h2>
          <p className="lead mb-4">
            Encuentra respuestas a tus preguntas o comunícate directamente con
            nuestro equipo de soporte.
          </p>
        </Container>
      </section>

      <section className="faq-section py-5">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto">
              <h3 className="text-center mb-4 fw-bold">Preguntas Frecuentes</h3>
              <Accordion defaultActiveKey="0">
                {faqs.map((f, i) => (
                  <Accordion.Item key={i} eventKey={i.toString()}>
                    <Accordion.Header>{f.question}</Accordion.Header>
                    <Accordion.Body>{f.answer}</Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-5 bg-light">
        <Container>
          <h3 className="text-center mb-5 fw-bold">¿Aún necesitas ayuda?</h3>
          <Row className="g-4">
            {contactOptions.map((o, i) => (
              <Col key={i} md={4}>
                <div className="contact-card text-center p-4 shadow-sm rounded-4 bg-white">
                  <div className="contact-icon fs-1 mb-3">{o.icon}</div>
                  <h5 className="fw-bold mb-2">{o.title}</h5>
                  <p className="text-muted mb-3">{o.description}</p>
                  <Button variant="primary">{o.action}</Button>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="cta-section text-white text-center py-5">
        <Container className="py-4">
          <h3 className="h2 mb-3">¿Tienes más preguntas?</h3>
          <Button className="cta-main-btn">Contactar Soporte</Button>
        </Container>
      </section>
    </>
  );
}

export default Ayuda;
