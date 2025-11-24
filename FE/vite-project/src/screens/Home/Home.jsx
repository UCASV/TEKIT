import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Form, InputGroup, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { professionalAPI, categoryAPI } from '../../services/api' // Importar APIs
import './Home.css'

function Home() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [categories, setCategories] = useState([])
  const [professionals, setProfessionals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catResponse = await categoryAPI.getAll()
        setCategories(catResponse.data || [])

        //Obtener los 3 mejores profesionales por calificación
        const profResponse = await professionalAPI.search({})
        setProfessionals((profResponse.data.professionals || []).slice(0, 3))
      } catch (e) {
        console.error('Error fetching data for Home:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  //Lógica para estrellas (extraída de PerfilContratante.jsx)
  const renderStars = (rating) => {
    const roundedRating = Math.round(rating || 0)
    return '★'.repeat(roundedRating) + '☆'.repeat(5 - roundedRating)
  }


  const steps = [
    {
      icon: '🔍',
      title: '1. Busca el Servicio',
      description: 'Explora miles de perfiles especializados en diferentes áreas y encuentra el que mejor se adapte a tus necesidades.'
    },
    {
      icon: '💬',
      title: '2. Conecta y Negocia',
      description: 'Contacta directamente con el perfil, discute los detalles del proyecto y acuerda términos y precios.'
    },
    {
      icon: '✅',
      title: '3. Recibe tu Proyecto',
      description: 'Trabaja con el perfil elegido y recibe tu proyecto completado con la calidad que esperas.'
    }
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleCategoryClick = (categoryId, categoryName) => {
    navigate(`/buscar?category=${categoryId}&name=${encodeURIComponent(categoryName)}`)
  }

  const handleProfessionalClick = (professionalId) => {
    navigate(`/profesional/${professionalId}`)
  }


  const getRandomGradient = () => {
    const gradients = ['bg-gradient-purple', 'bg-gradient-blue', 'bg-gradient-green'];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  if (loading) {
    return (
      <Container className="my-5 text-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Cargando datos...</p>
      </Container>
    )
  }

  return (
    <div className="home-page">
      <section className="hero-section text-white text-center py-5">
        <Container className="py-5">
          <h2 className="display-4 fw-bold mb-4">Contrata tu solución a un clic</h2>
          <p className="lead mb-5">
            Encuentra el servicio que necesitas o comparte tu expertise con miles de clientes potenciales
          </p>
          <Form onSubmit={handleSearch} className="search-form mx-auto">
            <InputGroup size="lg">
              <Form.Control
                type="text"
                placeholder="¿Qué servicio necesitas?"
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="light" type="submit" className="search-btn fw-semibold">
                Buscar
              </Button>
            </InputGroup>
          </Form>
        </Container>
      </section>

      <section className="categories-section py-5 bg-white">
        <Container>
          <h3 className="section-title text-center mb-5">Categorías Populares</h3>
          <Row className="g-4">
            {categories.slice(0, 6).map((category, index) => (
              <Col key={index} xs={6} md={4} lg={2}>
                <Card
                  className="category-card text-center h-100 border-0"
                  onClick={() => handleCategoryClick(category.id, category.nombre)}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                    <div className="category-icon mb-3">{category.icono || '❓'}</div>
                    <Card.Title className="h6 mb-0">{category.nombre}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="professionals-section py-5">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-5">
            <h3 className="section-title mb-0">Perfiles Destacados</h3>
            <Button
              variant="link"
              className="text-primary fw-semibold text-decoration-none"
              onClick={() => navigate('/buscar')}
            >
              Ver todos →
            </Button>
          </div>
          <Row className="g-4">
            {professionals.map((prof, index) => (
              <Col key={prof.usuario_id} md={6} lg={4}>
                <Card className="professional-card h-100 border-0 shadow-sm">
                  <Card.Body>
                    <div className="d-flex align-items-center mb-3">
                      <div className={`avatar ${getRandomGradient()} rounded-circle d-flex align-items-center justify-content-center text-white fw-bold`}>
                        {prof.nombre.charAt(0)}{prof.apellido.charAt(0)}
                      </div>
                      <div className="ms-3 flex-grow-1">
                        <h5 className="mb-1">{prof.nombre} {prof.apellido}</h5>
                        <p className="text-muted mb-1 small">{prof.titulo}</p>
                        <div className="rating">
                          <span className="text-warning">{renderStars(prof.calificacion_promedio)}</span>
                          <span className="text-muted small ms-2">({prof.total_resenas} reseñas)</span>
                        </div>
                      </div>
                    </div>
                    <Card.Text className="text-muted mb-3">
                      {prof.descripcion.substring(0, 100)}{prof.descripcion.length > 100 ? '...' : ''}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="price text-primary fw-bold">Desde ${prof.tarifa_por_hora}/hora</span>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleProfessionalClick(prof.usuario_id)}
                      >
                        Contactar
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          {professionals.length === 0 && (
            <div className="text-center text-muted py-4">
              Aún no hay profesionales destacados. ¡Sé el primero!
            </div>
          )}
        </Container>
      </section>

      <section className="how-it-works-section py-5 bg-white">
        <Container>
          <h3 className="section-title text-center mb-5">¿Cómo Funciona?</h3>
          <Row className="g-4">
            {steps.map((step, index) => (
              <Col key={index} md={4}>
                <div className="step text-center">
                  <div className="step-icon mx-auto mb-3">
                    <span>{step.icon}</span>
                  </div>
                  <h4 className="h5 mb-3">{step.title}</h4>
                  <p className="text-muted">{step.description}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="cta-section text-white text-center py-5">
        <Container className="py-4">
          <h3 className="h2 mb-3">
            ¿Buscas sacar provecho de tus habilidades o conocimientos?
          </h3>
          <p className="lead mb-4">
            Únete a nuestra comunidad y comienza a ofrecer tus servicios a miles de clientes potenciales
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button
              variant="light"
              size="lg"
              className="cta-main-btn fw-semibold"
              onClick={() => navigate('/register')}
            >
              Crear mi Perfil
            </Button>
          </div>
        </Container>
      </section>

    </div>
  )
}

export default Home