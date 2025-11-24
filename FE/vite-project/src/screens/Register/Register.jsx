import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { categoryAPI, locationAPI } from '../../services/api' //APIs para listas dinámicas
import './Register.css'

function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [categories, setCategories] = useState([])
  const [locations, setLocations] = useState([])

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    accountType: 'client',
    profession: '',
    categoryId: '',
    location: '',
    experience: '',
    description: '',
    hourlyRate: '',
    acceptTerms: false
  })

  //Cargar listas desde la BD al iniciar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, locRes] = await Promise.all([
          categoryAPI.getAll(),
          locationAPI.getAll()
        ]);
        setCategories(catRes.data || []);
        setLocations(locRes.data || []);
      } catch (err) {
        console.error("Error cargando listas:", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    //Telefono: Solo números y máximo 8 dígitos
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '').slice(0, 8);
      setFormData({ ...formData, [name]: numericValue });
    }

    else if (name === 'professionSelect') {
      const selectedCat = categories.find(c => c.id === parseInt(value));
      setFormData({
        ...formData,
        categoryId: value,
        profession: selectedCat ? selectedCat.nombre : ''
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
    setError('')
  }

  const validateStep1 = () => {
    if (!formData.firstName || !formData.lastName) { setError('Por favor completa tu nombre'); return false; }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) { setError('Por favor ingresa un email válido'); return false; }


    if (!formData.phone || formData.phone.length !== 8) { setError('El teléfono debe tener exactamente 8 dígitos numéricos'); return false; }

    if (!formData.password || formData.password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return false; }
    if (formData.password !== formData.confirmPassword) { setError('Las contraseñas no coinciden'); return false; }
    return true;
  }

  const validateStep2 = () => {
    if (formData.accountType === 'professional') {
      if (!formData.categoryId || !formData.experience || !formData.description || !formData.location) {
        setError('Por favor completa todos los campos profesionales');
        return false;
      }
      if (!formData.hourlyRate || parseFloat(formData.hourlyRate) <= 0) {
        setError('Por favor ingresa una tarifa válida');
        return false;
      }
    }
    if (!formData.acceptTerms) { setError('Debes aceptar los términos y condiciones'); return false; }
    return true;
  }

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) setStep(2);
  }

  const handlePrevStep = () => {
    setStep(1);
    setError('');
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateStep2()) return

    setLoading(true)
    setError('')

    try {

      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        accountType: formData.accountType,

        profession: formData.profession,
        categoryId: formData.categoryId,
        location: formData.location,
        experience: formData.experience,
        description: formData.description,
        hourlyRate: parseFloat(formData.hourlyRate) || 0
      })

      navigate('/login', { state: { message: '¡Registro exitoso! Por favor inicia sesión.' } })
    } catch (err) {
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
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-2">Crear Cuenta</h2>
                  <p className="text-muted">{step === 1 ? 'Completa tus datos personales' : 'Configura tu perfil'}</p>
                </div>

                <div className="mb-4">
                  <div className="progress" style={{ height: '4px' }}>
                    <div className="progress-bar" role="progressbar" style={{ width: `${(step / 2) * 100}%` }} />
                  </div>
                </div>

                {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  {step === 1 && (
                    <>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Nombre *</Form.Label>
                            <Form.Control type="text" name="firstName" placeholder="Tu nombre" value={formData.firstName} onChange={handleChange} required />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Apellido *</Form.Label>
                            <Form.Control type="text" name="lastName" placeholder="Tu apellido" value={formData.lastName} onChange={handleChange} required />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Form.Group className="mb-3">
                        <Form.Label>Email *</Form.Label>
                        <Form.Control type="email" name="email" placeholder="tu@email.com" value={formData.email} onChange={handleChange} required />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Teléfono *</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          placeholder="12345678"
                          value={formData.phone}
                          onChange={handleChange}
                          maxLength={8}
                          required
                        />
                        <Form.Text className="text-muted">
                          Sin guiones ni espacios, máximo 8 números.
                        </Form.Text>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Contraseña *</Form.Label>
                        <Form.Control type="password" name="password" placeholder="Mínimo 6 caracteres" value={formData.password} onChange={handleChange} required />
                      </Form.Group>
                      <Form.Group className="mb-4">
                        <Form.Label>Confirmar Contraseña *</Form.Label>
                        <Form.Control type="password" name="confirmPassword" placeholder="Repite tu contraseña" value={formData.confirmPassword} onChange={handleChange} required />
                      </Form.Group>
                      <Button variant="primary" className="w-100" onClick={handleNextStep}>Siguiente</Button>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold">Tipo de Cuenta *</Form.Label>
                        <div className="d-flex gap-3">
                          <Card className={`flex-fill account-type-card ${formData.accountType === 'client' ? 'selected' : ''}`} onClick={() => handleChange({ target: { name: 'accountType', value: 'client' } })} style={{ cursor: 'pointer' }}>
                            <Card.Body className="text-center py-4">
                              <div className="fs-2 mb-2">👤</div>
                              <div className="fw-semibold">Cliente</div>
                              <small className="text-muted">Busco contratar servicios</small>
                            </Card.Body>
                          </Card>
                          <Card className={`flex-fill account-type-card ${formData.accountType === 'professional' ? 'selected' : ''}`} onClick={() => handleChange({ target: { name: 'accountType', value: 'professional' } })} style={{ cursor: 'pointer' }}>
                            <Card.Body className="text-center py-4">
                              <div className="fs-2 mb-2">💼</div>
                              <div className="fw-semibold">Profesional</div>
                              <small className="text-muted">Ofrezco servicios</small>
                            </Card.Body>
                          </Card>
                        </div>
                      </Form.Group>

                      {formData.accountType === 'professional' && (
                        <>
                          <Form.Group className="mb-3">
                            <Form.Label>Profesión / Categoría *</Form.Label>
                            <Form.Select name="professionSelect" value={formData.categoryId} onChange={handleChange} required>
                              <option value="">Selecciona tu profesión</option>
                              {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                              ))}
                            </Form.Select>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Ubicación *</Form.Label>
                            <Form.Select name="location" value={formData.location} onChange={handleChange} required>
                              <option value="">Selecciona tu ubicación</option>
                              {locations.map(loc => (
                                <option key={loc.id} value={loc.nombre}>{loc.nombre}</option>
                              ))}
                            </Form.Select>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Años de Experiencia *</Form.Label>
                            <Form.Select name="experience" value={formData.experience} onChange={handleChange} required>
                              <option value="">Selecciona tu experiencia</option>
                              <option value="0">Menos de 1 año</option>
                              <option value="2">1-3 años</option>
                              <option value="4">3-5 años</option>
                              <option value="7">5-10 años</option>
                              <option value="10">Más de 10 años</option>
                            </Form.Select>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Descripción de tus Servicios *</Form.Label>
                            <Form.Control as="textarea" rows={3} name="description" placeholder="Describe tus servicios..." value={formData.description} onChange={handleChange} required />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Tarifa por Hora ($) *</Form.Label>
                            <Form.Control type="number" name="hourlyRate" placeholder="Ej: 25" min="1" value={formData.hourlyRate} onChange={handleChange} required />
                          </Form.Group>
                        </>
                      )}

                      <Form.Group className="mb-4">
                        <Form.Check type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange} label={<span>Acepto los <Link to="/terminos">términos y condiciones</Link></span>} required />
                      </Form.Group>

                      <div className="d-flex gap-2">
                        <Button variant="outline-secondary" className="w-50" onClick={handlePrevStep} disabled={loading}>Atrás</Button>
                        <Button variant="primary" type="submit" className="w-50" disabled={loading}>{loading ? <><Spinner animation="border" size="sm" className="me-2" />Registrando...</> : 'Crear Cuenta'}</Button>
                      </div>
                    </>
                  )}
                </Form>

                <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="text-decoration-none fw-semibold">Inicia Sesión</Link>
                  </p>
                </div>
              </Card.Body>
            </Card>

            {/* BOTÓN VOLVER AL INICIO */}
            <div className="text-center mt-4 pb-5">
              <Link to="/" className="btn btn-link text-muted text-decoration-none">
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