import { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Button, Card, Badge } from 'react-bootstrap'
import { useNavigate, useSearchParams } from 'react-router-dom'
import './Search.css'

function Search() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '')
  
  const [filters, setFilters] = useState({
    categories: ['fontaneria'],
    priceMin: 10,
    priceMax: 100,
    rating: 4,
    location: 'Toda El Salvador',
    availability: []
  })

  const [sortBy, setSortBy] = useState('relevant')

  const professionals = [
    {
      id: 1,
      name: "Juan Martínez",
      role: "Fontanero Profesional",
      rating: 5,
      reviews: 28,
      price: 25,
      category: "fontaneria",
      location: "San Salvador",
      initials: "JM",
      avatarClass: "bg-gradient-blue",
      description: "Especialista en reparaciones de tuberías, instalación de grifos y sistemas de agua. 15 años de experiencia."
    },
    {
      id: 2,
      name: "Ana Rodríguez",
      role: "Fontanera Certificada",
      rating: 5,
      reviews: 45,
      price: 30,
      category: "fontaneria",
      location: "Santa Ana",
      initials: "AR",
      avatarClass: "bg-gradient-green",
      description: "Servicios de fontanería residencial y comercial. Especializada en emergencias 24/7."
    },
    {
      id: 3,
      name: "Carlos López",
      role: "Técnico en Fontanería",
      rating: 4,
      reviews: 19,
      price: 20,
      category: "fontaneria",
      location: "San Salvador",
      initials: "CL",
      avatarClass: "bg-gradient-purple",
      description: "Reparación de fugas, destapado de cañerías y mantenimiento preventivo de sistemas hidráulicos."
    }
  ]

  const categories = [
    { id: 'fontaneria', name: 'Fontanería', count: 23 },
    { id: 'limpieza', name: 'Limpieza', count: 15 },
    { id: 'construccion', name: 'Construcción', count: 9 },
    { id: 'electricidad', name: 'Electricidad', count: 12 }
  ]

  const locations = [
    'Toda El Salvador',
    'San Salvador',
    'Santa Ana',
    'San Miguel',
    'Sonsonate',
    'La Libertad'
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchParams({ q: searchTerm })
  }

  const handleCategoryChange = (categoryId) => {
    setFilters(prev => {
      const newCategories = prev.categories.includes(categoryId)
        ? prev.categories.filter(c => c !== categoryId)
        : [...prev.categories, categoryId]
      return { ...prev, categories: newCategories }
    })
  }

  const handleAvailabilityChange = (availId) => {
    setFilters(prev => {
      const newAvailability = prev.availability.includes(availId)
        ? prev.availability.filter(a => a !== availId)
        : [...prev.availability, availId]
      return { ...prev, availability: newAvailability }
    })
  }

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceMin: 0,
      priceMax: 1000,
      rating: 1,
      location: 'Toda El Salvador',
      availability: []
    })
  }

  const filteredProfessionals = professionals.filter(prof => {
    if (filters.categories.length && !filters.categories.includes(prof.category)) return false
    if (prof.price < filters.priceMin || prof.price > filters.priceMax) return false
    if (prof.rating < filters.rating) return false
    if (filters.location !== 'Toda El Salvador' && prof.location !== filters.location) return false
    return true
  })

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  return (
    <div className="search-page">
      <section className="search-header-section">
        <Container>
          <Row className="align-items-center justify-content-center">
            <Col lg={8}>
              <Form onSubmit={handleSearch}>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="text"
                    className="search-input-large"
                    placeholder="¿Qué servicio necesitas?"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button type="submit" variant="light" className="search-button">
                    Buscar
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="my-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/" onClick={(e) => { e.preventDefault(); navigate('/') }}>Inicio</a>
            </li>
            <li className="breadcrumb-item active">
              "{searchTerm}" ({filteredProfessionals.length} resultados)
            </li>
          </ol>
        </nav>
      </Container>

      <Container className="mb-5">
        <Row>
          <Col lg={3}>
            <Card className="filters-card sticky-top">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Filtros</h5>
                  <Button variant="link" size="sm" className="text-danger p-0" onClick={clearFilters}>
                    Limpiar
                  </Button>
                </div>

                <div className="filter-group">
                  <h6 className="filter-label">Categorías</h6>
                  {categories.map(cat => (
                    <Form.Check
                      key={cat.id}
                      type="checkbox"
                      id={cat.id}
                      label={
                        <span>
                          {cat.name} <Badge bg="secondary" className="ms-2">{cat.count}</Badge>
                        </span>
                      }
                      checked={filters.categories.includes(cat.id)}
                      onChange={() => handleCategoryChange(cat.id)}
                      className="mb-2"
                    />
                  ))}
                </div>

                <hr />

                <div className="filter-group">
                  <h6 className="filter-label">Precio por hora</h6>
                  <Row>
                    <Col>
                      <Form.Control
                        type="number"
                        size="sm"
                        placeholder="Min $"
                        value={filters.priceMin}
                        onChange={(e) => setFilters(prev => ({ ...prev, priceMin: parseInt(e.target.value) || 0 }))}
                      />
                    </Col>
                    <Col xs="auto" className="px-0">-</Col>
                    <Col>
                      <Form.Control
                        type="number"
                        size="sm"
                        placeholder="Max $"
                        value={filters.priceMax}
                        onChange={(e) => setFilters(prev => ({ ...prev, priceMax: parseInt(e.target.value) || 1000 }))}
                      />
                    </Col>
                  </Row>
                </div>

                <hr />

                <div className="filter-group">
                  <h6 className="filter-label">Calificación Mínima</h6>
                  {[5, 4, 3].map(rating => (
                    <Form.Check
                      key={rating}
                      type="radio"
                      id={`rating-${rating}`}
                      name="rating"
                      label={<span className="text-warning">{renderStars(rating)}</span>}
                      checked={filters.rating === rating}
                      onChange={() => setFilters(prev => ({ ...prev, rating }))}
                      className="mb-2"
                    />
                  ))}
                </div>

                <hr />

                <div className="filter-group">
                  <h6 className="filter-label">Ubicación</h6>
                  <Form.Select
                    size="sm"
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  >
                    {locations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </Form.Select>
                </div>

                <hr />

                <div className="filter-group">
                  <h6 className="filter-label">Disponibilidad</h6>
                  <Form.Check
                    type="checkbox"
                    id="available-now"
                    label="Disponible ahora"
                    checked={filters.availability.includes('available-now')}
                    onChange={() => handleAvailabilityChange('available-now')}
                    className="mb-2"
                  />
                  <Form.Check
                    type="checkbox"
                    id="weekend"
                    label="Fines de semana"
                    checked={filters.availability.includes('weekend')}
                    onChange={() => handleAvailabilityChange('weekend')}
                    className="mb-2"
                  />
                  <Form.Check
                    type="checkbox"
                    id="emergency"
                    label="Servicio de emergencia"
                    checked={filters.availability.includes('emergency')}
                    onChange={() => handleAvailabilityChange('emergency')}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={9}>
            <Card className="mb-3">
              <Card.Body>
                <Row className="align-items-center">
                  <Col>
                    <p className="mb-0 text-muted">
                      Mostrando <strong>1-{filteredProfessionals.length}</strong> de{' '}
                      <strong>{filteredProfessionals.length}</strong> resultados para{' '}
                      <strong>"{searchTerm}"</strong>
                    </p>
                  </Col>
                  <Col xs="auto">
                    <Form.Select
                      size="sm"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      style={{ minWidth: '200px' }}
                    >
                      <option value="relevant">Más relevantes</option>
                      <option value="price-low">Precio: menor a mayor</option>
                      <option value="price-high">Precio: mayor a menor</option>
                      <option value="rating">Mejor calificados</option>
                    </Form.Select>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Row className="g-3">
              {filteredProfessionals.map(prof => (
                <Col key={prof.id} md={6} lg={4}>
                  <Card className="professional-card h-100">
                    <Card.Body>
                      <div className="d-flex align-items-center mb-3">
                        <div className={`avatar ${prof.avatarClass} rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3`}>
                          {prof.initials}
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="mb-1 fs-6">{prof.name}</h5>
                          <p className="text-muted mb-1 small">{prof.role}</p>
                          <div className="rating">
                            <span className="text-warning small">{renderStars(prof.rating)}</span>
                            <span className="text-muted ms-1" style={{ fontSize: '0.75rem' }}>
                              ({prof.reviews})
                            </span>
                          </div>
                        </div>
                      </div>
                      <Card.Text className="text-muted small mb-3">
                        {prof.description}
                      </Card.Text>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-primary fw-bold">Desde ${prof.price}/h</span>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => navigate(`/profesional/${prof.id}`)}
                        >
                          Ver Perfil
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {filteredProfessionals.length === 0 && (
              <Card>
                <Card.Body className="text-center py-5">
                  <h5 className="text-muted">No se encontraron resultados</h5>
                  <p className="text-muted">Intenta ajustar los filtros o busca otro servicio</p>
                  <Button variant="primary" onClick={clearFilters}>
                    Limpiar Filtros
                  </Button>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Search