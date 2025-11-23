import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext' // ¡IMPORTANTE: Añadir!
import './Register.css'

function Register() {
  const navigate = useNavigate()
  const { register } = useAuth() // Usar la función de registro real
  const [step, setStep] = useState(1) // Para formulario multi-paso
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    // Datos personales
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    
    // Tipo de cuenta
    accountType: 'client', // 'client' o 'professional'
    
    // Datos profesionales (solo si es profesional)
    profession: '',
    experience: '',
    description: '',
    hourlyRate: '',
    
    // Términos
    acceptTerms: false
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
    setError('')
  }

  const validateStep1 = () => {
    if (!formData.firstName || !formData.lastName) {
      setError('Por favor completa tu nombre')
      return false
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Por favor ingresa un email válido')
      return false
    }
    if (!formData.phone || formData.phone.length < 8) {
      setError('Por favor ingresa un teléfono válido')
      return false
    }
    if (!formData.password || formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (formData.accountType === 'professional') {
      if (!formData.profession || !formData.experience || !formData.description) {
        setError('Por favor completa todos los campos profesionales')
        return false
      }
      if (!formData.hourlyRate || parseFloat(formData.hourlyRate) <= 0) {
        setError('Por favor ingresa una tarifa válida')
        return false
      }
    }
    if (!formData.acceptTerms) {
      setError('Debes aceptar los términos y condiciones')
      return false
    }
    return true
  }

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    }
  }

  const handlePrevStep = () => {
    setStep(1)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateStep2()) return

    setLoading(true)
    setError('')

    try {
      // LLAMADA REAL A LA API
      const { 
        firstName, 
        lastName, 
        email, 
        phone, 
        password, 
        accountType, 
        profession, 
        experience, 
        description, 
        hourlyRate 
      } = formData;

      await register({
        firstName, 
        lastName, 
        email, 
        phone, 
        password,
        accountType,
        profession,
        experience,
        description,
        hourlyRate: parseFloat(hourlyRate) || 0
      })
      
      // Redirigir al login con un mensaje de éxito
      navigate('/login', { 
        state: { message: '¡Registro exitoso! Por favor inicia sesión.' }
      })
    } catch (err) {
      // Manejo de errores de la API
      const errorMessage = err.message || err.data?.message || 'Error al registrar. Intenta nuevamente.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-page min-vh-100 d-flex align-items-center" style={{ backgroundColor: '#f9fafb' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={7}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-2">Crear Cuenta</h2>
                  <p className="text-muted">
                    {step === 1 ? 'Completa tus datos personales' : 'Configura tu perfil'}
                  </p>
                </div>

                {/* Progress indicator */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <small className={`fw-semibold ${step === 1 ? 'text-primary' : 'text-muted'}`}>
                      Paso 1: Datos básicos
                    </small>
                    <small className={`fw-semibold ${step === 2 ? 'text-primary' : 'text-muted'}`}>
                      Paso 2: Tipo de cuenta
                    </small>
                  </div>
                  <div className="progress" style={{ height: '4px' }}>
                    <div 
                      className="progress-bar" 
                      role="progressbar" 
                      style={{ width: `${(step / 2) * 100}%` }}
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="danger" dismissible onClose={() => setError('')}>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {/* PASO 1: Datos Personales */}
                  {step === 1 && (
                    <>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Nombre *</Form.Label>
                            <Form.Control
                              type="text"
                              name="firstName"
                              placeholder="Tu nombre"
                              value={formData.firstName}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Apellido *</Form.Label>
                            <Form.Control
                              type="text"
                              name="lastName"
                              placeholder="Tu apellido"
                              value={formData.lastName}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label>Email *</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="tu@email.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Teléfono *</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          placeholder="7123-4567"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Contraseña *</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          placeholder="Mínimo 6 caracteres"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label>Confirmar Contraseña *</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          placeholder="Repite tu contraseña"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

                      <Button 
                        variant="primary" 
                        className="w-100"
                        onClick={handleNextStep}
                        disabled={loading}
                      >
                        Siguiente
                      </Button>
                    </>
                  )}

                  {/* PASO 2: Tipo de Cuenta y Datos Profesionales */}
                  {step === 2 && (
                    <>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold">Tipo de Cuenta *</Form.Label>
                        <div className="d-flex gap-3">
                          <Card 
                            className={`flex-fill account-type-card ${formData.accountType === 'client' ? 'selected' : ''}`}
                            onClick={() => handleChange({ target: { name: 'accountType', value: 'client' }})}
                            style={{ cursor: 'pointer' }}
                          >
                            <Card.Body className="text-center py-4">
                              <div className="fs-2 mb-2">👤</div>
                              <div className="fw-semibold">Cliente</div>
                              <small className="text-muted">Busco contratar servicios</small>
                            </Card.Body>
                          </Card>
                          
                          <Card 
                            className={`flex-fill account-type-card ${formData.accountType === 'professional' ? 'selected' : ''}`}
                            onClick={() => handleChange({ target: { name: 'accountType', value: 'professional' }})}
                            style={{ cursor: 'pointer' }}
                          >
                            <Card.Body className="text-center py-4">
                              <div className="fs-2 mb-2">💼</div>
                              <div className="fw-semibold">Profesional</div>
                              <small className="text-muted">Ofrezco servicios</small>
                            </Card.Body>
                          </Card>
                        </div>
                      </Form.Group>

                      {/* Campos adicionales si es profesional */}
                      {formData.accountType === 'professional' && (
                        <>
                          <Form.Group className="mb-3">
                            <Form.Label>Profesión / Servicio *</Form.Label>
                            <Form.Select
                              name="profession"
                              value={formData.profession}
                              onChange={handleChange}
                              required
                            >
                              <option value="">Selecciona tu profesión</option>
                              <option value="Fontanería">Fontanería</option>
                              <option value="Electricidad">Electricidad</option>
                              <option value="Limpieza">Limpieza</option>
                              <option value="Carpintería">Carpintería</option>
                              <option value="Pintura">Pintura</option>
                              <option value="Mecánica">Mecánica</option>
                              <option value="Otro">Otro</option>
                            </Form.Select>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Años de Experiencia *</Form.Label>
                            <Form.Select
                              name="experience"
                              value={formData.experience}
                              onChange={handleChange}
                              required
                            >
                              <option value="">Selecciona tu experiencia</option>
                              <option value="0-1">Menos de 1 año</option>
                              <option value="1-3">1-3 años</option>
                              <option value="3-5">3-5 años</option>
                              <option value="5-10">5-10 años</option>
                              <option value="10+">Más de 10 años</option>
                            </Form.Select>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Descripción de tus Servicios *</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              name="description"
                              placeholder="Describe tu experiencia y los servicios que ofreces..."
                              value={formData.description}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Tarifa por Hora (USD) *</Form.Label>
                            <Form.Control
                              type="number"
                              name="hourlyRate"
                              placeholder="Ej: 25"
                              min="1"
                              value={formData.hourlyRate}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                        </>
                      )}

                      <Form.Group className="mb-4">
                        <Form.Check
                          type="checkbox"
                          name="acceptTerms"
                          checked={formData.acceptTerms}
                          onChange={handleChange}
                          label={
                            <span>
                              Acepto los{' '}
                              <Link to="/terminos" target="_blank">
                                términos y condiciones
                              </Link>
                              {' '}y la{' '}
                              <Link to="/privacidad" target="_blank">
                                política de privacidad
                              </Link>
                            </span>
                          }
                          required
                        />
                      </Form.Group>

                      <div className="d-flex gap-2">
                        <Button 
                          variant="outline-secondary" 
                          className="w-50"
                          onClick={handlePrevStep}
                          disabled={loading}
                        >
                          Atrás
                        </Button>
                        <Button 
                          variant="primary" 
                          type="submit" 
                          className="w-50"
                          disabled={loading}
                        >
                          {loading ? <><Spinner animation="border" size="sm" className="me-2" />Registrando...</> : 'Crear Cuenta'}
                        </Button>
                      </div>
                    </>
                  )}
                </Form>

                <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="text-decoration-none fw-semibold">
                      Inicia Sesión
                    </Link>
                  </p>
                </div>
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

export default Register