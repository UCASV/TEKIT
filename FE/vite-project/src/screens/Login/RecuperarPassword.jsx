import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Mail } from 'lucide-react';

function RecuperarPassword() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Por favor, ingresa un email válido.');
      setLoading(false);
      return;
    }

    //Simulación de llamada API (no hay endpoint de recuperación de contraseña)
    setTimeout(() => {
        setLoading(false);
        if (email === 'error@example.com') {
            setError('No pudimos encontrar una cuenta con ese email.');
        } else {
            setSuccess(`Si la dirección de correo ${email} está en nuestro sistema, recibirás un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada.`);
            setEmail('');
        }
    }, 1500);
  };

  return (
    <div className="login-page min-vh-100 d-flex align-items-center" style={{ backgroundColor: '#f9fafb' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <Mail size={32} className="text-primary mb-3" />
                  <h2 className="fw-bold mb-2">Recuperar Contraseña</h2>
                  <p className="text-muted">Ingresa tu email y te enviaremos instrucciones.</p>
                </div>

                {success && <Alert variant="success">{success}</Alert>}
                {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </Form.Group>

                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? <><Spinner animation="border" size="sm" className="me-2" />Enviando...</> : 'Restablecer Contraseña'}
                  </Button>

                  <div className="text-center">
                    <Link to="/login" className="text-decoration-none small">
                      ← Volver a Iniciar Sesión
                    </Link>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default RecuperarPassword