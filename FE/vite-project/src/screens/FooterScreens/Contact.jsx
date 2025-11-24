import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { Send, Phone, Mail } from 'lucide-react';
import './StylesFooters.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError("Por favor, completa todos los campos.");
      setSubmitting(false);
      return;
    }

    //Simulación de envío de formulario de contacto general
    setTimeout(() => {
        if (Math.random() > 0.1) {
            setSuccess("¡Mensaje enviado con éxito! Te responderemos pronto.");
            setFormData({ name: '', email: '', subject: '', message: '' });
        } else {
            setError("Error al enviar el mensaje. Intenta de nuevo más tarde.");
        }
        setSubmitting(false);
    }, 1500);
  };

  return (
    <>
      <section className="hero-section text-white text-center py-5">
        <Container className="py-5">
          <h2 className="display-4 fw-bold mb-4">Contáctanos</h2>
          <p className="lead mb-4">
            Estamos aquí para ayudarte. Envíanos un mensaje o usa nuestros contactos directos.
          </p>
        </Container>
      </section>

      <section className="py-5 bg-white">
        <Container>
          <Row className="g-5">
            {/* Contact Form */}
            <Col lg={7}>
                <Card className="border-0 shadow-sm">
                    <Card.Body className="p-4">
                        <h3 className="fw-bold mb-4">Envía un Mensaje</h3>
                        
                        {success && <Alert variant="success">{success}</Alert>}
                        {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group className="mb-3 mb-md-0">
                                        <Form.Label>Nombre Completo</Form.Label>
                                        <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label>Asunto</Form.Label>
                                <Form.Control type="text" name="subject" value={formData.subject} onChange={handleChange} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Mensaje</Form.Label>
                                <Form.Control as="textarea" rows={4} name="message" value={formData.message} onChange={handleChange} required />
                            </Form.Group>

                            <Button variant="primary" type="submit" disabled={submitting}>
                                <Send size={16} className="me-2" />
                                {submitting ? 'Enviando...' : 'Enviar Mensaje'}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>

            {/* Direct Contacts */}
            <Col lg={5}>
                <h3 className="fw-bold mb-4">Información de Contacto Directo</h3>
                <div className="vstack gap-3">
                    <Card className="border-0 shadow-sm p-3">
                        <div className="d-flex align-items-center gap-3">
                            <Mail size={24} className="text-primary" />
                            <div>
                                <p className="fw-bold mb-0">Email de Soporte</p>
                                <a href="mailto:soporte@tekit.com" className="text-muted small text-decoration-none">soporte@tekit.com</a>
                            </div>
                        </div>
                    </Card>
                    <Card className="border-0 shadow-sm p-3">
                        <div className="d-flex align-items-center gap-3">
                            <Phone size={24} className="text-primary" />
                            <div>
                                <p className="fw-bold mb-0">WhatsApp</p>
                                <span className="text-muted small">+503 1234-5678</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Contact;