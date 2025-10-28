import { useState } from 'react'
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import './Home.css'

function Home() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    { icon: '🧹', title: 'Limpieza', id: 'limpieza' },
    { icon: '🚿', title: 'Fontanería', id: 'fontaneria' },
    { icon: '🧱', title: 'Construcción', id: 'construccion' },
    { icon: '🧵', title: 'Sastrería & Costurería', id: 'sastreria' },
    { icon: '👞', title: 'Zapatería', id: 'zapateria' },
    { icon: '📚', title: 'Clases Particulares', id: 'clases' }
  ]

  const professionals = [
    {
      id: 1,
      initials: 'LY',
      name: 'Lamine Yamal',
      role: 'Semi jugador profesional',
      rating: 2,
      reviews: 47,
      description: 'Hablo antes del partido y despues no hago nada',
      price: 'Un beso de Nicki Nicole/gol o asistencia',
      avatarClass: 'bg-gradient-purple'
    },
    {
      id: 2,
      initials: 'AA',
      name: 'Andrea Álvarez',
      role: 'Diseñadora UX/UI',
      rating: 5,
      reviews: 32,
      description: 'Diseño experiencias digitales que conectan con los usuarios. Especializado en apps móviles y plataformas web.',
      price: '€40/hora',
      avatarClass: 'bg-gradient-blue'
    },
    {
      id: 3,
      initials: 'KM',
      name: 'Kylian Mbappe',
      role: 'Jugador Profesional',
      rating: 5,
      reviews: 28,
      description: 'Violo equipos a domicilio o en casa (última chamba contra el barca)',
      price: '€60/gol',
      avatarClass: 'bg-gradient-green'
    }
  ]

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

  const handleCategoryClick = (categoryId) => {
    navigate(`/buscar?q=${categoryId}`)
  }

  const handleContact = (professionalId) => {
    navigate(`/profesional/${professionalId}`)
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
            {categories.map((category, index) => (
              <Col key={index} xs={6} md={4} lg={2}>
                <Card
                  className="category-card text-center h-100 border-0"
                  onClick={() => handleCategoryClick(category.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                    <div className="category-icon mb-3">{category.icon}</div>
                    <Card.Title className="h6 mb-0">{category.title}</Card.Title>
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
              <Col key={index} md={6} lg={4}>
                <Card className="professional-card h-100 border-0 shadow-sm">
                  <Card.Body>
                    <div className="d-flex align-items-center mb-3">
                      <div className={`avatar ${prof.avatarClass} rounded-circle d-flex align-items-center justify-content-center text-white fw-bold`}>
                        {prof.initials}
                      </div>
                      <div className="ms-3 flex-grow-1">
                        <h5 className="mb-1">{prof.name}</h5>
                        <p className="text-muted mb-1 small">{prof.role}</p>
                        <div className="rating">
                          <span className="text-warning">{'★'.repeat(prof.rating)}{'☆'.repeat(5 - prof.rating)}</span>
                          <span className="text-muted small ms-2">({prof.reviews} reseñas)</span>
                        </div>
                      </div>
                    </div>
                    <Card.Text className="text-muted mb-3">
                      {prof.description}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="price text-primary fw-bold">Desde {prof.price}</span>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleContact(prof.id)}
                      >
                        Contactar
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
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
          
          {/* Botones experimentales para ver perfiles */}
          <div className="mt-4 pt-4 border-top border-white border-opacity-25">
            <p className="mb-3 text-white-50 small">Vista de Perfiles (Experimental)</p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Button
                variant="outline-light"
                size="sm"
                onClick={() => navigate('/perfil-cliente')}
              >
                👤 Ver Perfil Cliente
              </Button>
              <Button
                variant="outline-light"
                size="sm"
                onClick={() => navigate('/perfil-contratante')}
              >
                💼 Ver Perfil Profesional
              </Button>
            </div>
          </div>
        </Container>
      </section>

    </div>
  )
}

export default Home