import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMessage] = useState(location.state?.message || '')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(formData)
      navigate('/dashboard')
    } catch (err) {
      const errorMessage = err.message || err.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page min-vh-100 d-flex align-items-center" style={{ backgroundColor: '#f9fafb' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-2">Bienvenido de nuevo</h2>
                  <p className="text-muted">Inicia sesión en tu cuenta</p>
                </div>

                {successMessage && (
                  <Alert variant="success" dismissible>
                    {successMessage}
                  </Alert>
                )}

                {error && (
                  <Alert variant="danger" dismissible onClose={() => setError('')}>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check type="checkbox" label="Recuérdame" />
                    <Link to="/recuperar-password" className="text-decoration-none small"> {/* CORRECCIÓN: Enlace a RecuperarPassword */}
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>

                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </Button>

                  <div className="text-center">
                    <p className="text-muted mb-0">
                      ¿No tienes cuenta?{' '}
                      <Link to="/register" className="text-decoration-none fw-semibold">
                        Regístrate
                      </Link>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            <div className="text-center mt-4">
              <Link to="/" className="text-muted text-decoration-none">
                ← Volver al inicio
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Login