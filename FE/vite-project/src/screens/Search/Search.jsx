import { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Button, Card, Badge, Spinner, Alert } from 'react-bootstrap'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { professionalAPI, categoryAPI } from '../../services/api'
import './Search.css'

function Search() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  
  // Initialize from URL params or default values
  const initialCategory = searchParams.get('category') 
    ? [parseInt(searchParams.get('category'))] 
    : [] 
  const initialQ = searchParams.get('q') || ''
  const initialPriceMin = parseInt(searchParams.get('priceMin')) || 10
  const initialPriceMax = parseInt(searchParams.get('priceMax')) || 100
  const initialRating = parseFloat(searchParams.get('rating')) || 4
  const initialLocation = searchParams.get('location') || 'Toda El Salvador'
  
  const [searchTerm, setSearchTerm] = useState(initialQ)
  const [professionals, setProfessionals] = useState([]) 
  const [categories, setCategories] = useState([]) 
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ESTADOS LOCALES PARA CORREGIR EL PARPADEO (Bug de filtros)
  const [localPriceMin, setLocalPriceMin] = useState(initialPriceMin.toString());
  const [localPriceMax, setLocalPriceMax] = useState(initialPriceMax.toString());
  
  const [filters, setFilters] = useState({
    categories: initialCategory,
    priceMin: initialPriceMin,
    priceMax: initialPriceMax,
    rating: initialRating,
    location: initialLocation,
    availability: []
  })

  const [sortBy, setSortBy] = useState('relevant')

  // Efecto para sincronizar estados locales cuando los filtros cambian externamente
  useEffect(() => {
    setLocalPriceMin(filters.priceMin.toString());
    setLocalPriceMax(filters.priceMax.toString());
  }, [filters.priceMin, filters.priceMax]);


  // Handler para actualizar el estado de filtros (y disparar el fetch) en evento ONBLUR
  const handlePriceBlur = () => {
    const min = parseInt(localPriceMin) || 0;
    const max = parseInt(localPriceMax) || 1000;
    
    // Solo actualiza si los valores cambiaron para evitar re-render innecesarios
    if (min !== filters.priceMin || max !== filters.priceMax) {
        setFilters(prev => ({ 
            ...prev, 
            priceMin: min, 
            priceMax: max 
        }));
    }
  };

  // --- API FETCHING ---
  const fetchProfessionalsAndCategories = async () => {
    setLoading(true)
    setError(null)
    
    // 1. Fetch Categories
    try {
      const catResponse = await categoryAPI.getAll();
      setCategories(catResponse.data || []);
    } catch (e) {
      console.error('Error fetching categories:', e)
    }

    // 2. Fetch Professionals
    try {
      const apiFilters = {
        busqueda: searchTerm || undefined, 
        categoria_id: filters.categories.length ? filters.categories[0] : undefined, 
        tarifa_min: filters.priceMin,
        tarifa_max: filters.priceMax,
        calificacion_min: filters.rating,
        ubicacion: filters.location === 'Toda El Salvador' ? undefined : filters.location,
      }
      
      const cleanedFilters = Object.fromEntries(
        Object.entries(apiFilters).filter(([_, v]) => v !== undefined && v !== null && v !== '' && (typeof v === 'number' ? true : v.toString().trim() !== ''))
      )

      const profResponse = await professionalAPI.search(cleanedFilters);

      setProfessionals(profResponse.data.professionals || [])

    } catch (e) {
      console.error('Error fetching professionals:', e)
      setError(e.message || 'Error al cargar los profesionales.')
      setProfessionals([])
    } finally {
      setLoading(false)
    }
  }

  // Effect to re-fetch when filters or search term changes
  useEffect(() => {
    fetchProfessionalsAndCategories()
  }, [searchTerm, filters]) 


  const handleSearch = (e) => {
    e.preventDefault()
    setSearchParams({ q: searchTerm })
  }

  const handleCategoryChange = (categoryId) => {
    setFilters(prev => {
      const isSelected = prev.categories.includes(categoryId)
      const newCategories = isSelected
        ? prev.categories.filter(c => c !== categoryId) 
        : [categoryId] 
      
      return { ...prev, categories: newCategories }
    })
  }
  
  const handleRatingChange = (rating) => {
    setFilters(prev => ({ ...prev, rating }));
  }

  const handleLocationChange = (e) => {
    setFilters(prev => ({ ...prev, location: e.target.value }));
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
    setSearchTerm('')
    setSearchParams({})
  }

  const sortProfessionals = (list) => {
    switch (sortBy) {
      case 'price-low':
        return [...list].sort((a, b) => (a.tarifa_por_hora || 0) - (b.tarifa_por_hora || 0))
      case 'price-high':
        return [...list].sort((a, b) => (b.tarifa_por_hora || 0) - (a.tarifa_por_hora || 0))
      case 'rating':
        return [...list].sort((a, b) => (b.calificacion_promedio || 0) - (a.calificacion_promedio || 0))
      case 'relevant':
      default:
        return list
    }
  }
  
  const sortedProfessionals = sortProfessionals(professionals)

  const renderStars = (rating) => {
    const roundedRating = Math.round(rating || 0)
    return '★'.repeat(roundedRating) + '☆'.repeat(5 - roundedRating)
  }
  
  const totalResults = sortedProfessionals.length

  const getAvatarClass = (id) => {
    const classes = ['bg-gradient-blue', 'bg-gradient-green', 'bg-gradient-purple', 'bg-gradient-orange', 'bg-gradient-red'];
    return classes[id % classes.length];
  }


  if (loading) {
    return (
      <Container className="my-5 text-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Buscando profesionales...</p>
      </Container>
    )
  }
  
  if (error && totalResults === 0) {
    return (
        <Container className="my-5 text-center">
            <Alert variant="danger">
                {error}
                <p className="mt-2 text-muted">Asegúrate de que el backend esté funcionando y tenga datos.</p>
            </Alert>
        </Container>
    )
  }

  return (
    <div className="search-page">
      <section className="search-header-section">
        {/* ... (Search bar remains the same) */}
      </section>

      <Container className="my-3">
        {/* ... (Breadcrumb remains the same) */}
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
                      id={`cat-${cat.id}`}
                      label={
                        <span>
                          {cat.nombre} <Badge bg="secondary" className="ms-2">{cat.total_servicios || 0}</Badge>
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
                        value={localPriceMin} // USA ESTADO LOCAL
                        onChange={(e) => setLocalPriceMin(e.target.value)} // CAMBIA ESTADO LOCAL
                        onBlur={handlePriceBlur} // ACTIVA BÚSQUEDA EN BLUR
                      />
                    </Col>
                    <Col xs="auto" className="px-0">-</Col>
                    <Col>
                      <Form.Control
                        type="number"
                        size="sm"
                        placeholder="Max $"
                        value={localPriceMax} // USA ESTADO LOCAL
                        onChange={(e) => setLocalPriceMax(e.target.value)} // CAMBIA ESTADO LOCAL
                        onBlur={handlePriceBlur} // ACTIVA BÚSQUEDA EN BLUR
                      />
                    </Col>
                  </Row>
                </div>

                <hr />

                <div className="filter-group">
                  <h6 className="filter-label">Calificación Mínima</h6>
                  {[5, 4, 3, 2, 1].map(rating => (
                    <Form.Check
                      key={rating}
                      type="radio"
                      id={`rating-${rating}`}
                      name="rating"
                      label={<span className="text-warning">{renderStars(rating)}</span>}
                      checked={filters.rating === rating}
                      onChange={() => handleRatingChange(rating)} // Llama a setFilters directamente
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
                    onChange={handleLocationChange} // Llama a setFilters directamente
                  >
                    {['Toda El Salvador', 'San Salvador', 'Santa Ana', 'San Miguel', 'Sonsonate', 'La Libertad'].map(loc => (
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
            {/* ... (Result display remains the same) */}
            <Row className="g-3">
              {sortedProfessionals.map(prof => (
                <Col key={prof.usuario_id} md={6} lg={4}>
                  <Card className="professional-card h-100">
                    <Card.Body>
                      <div className="d-flex align-items-center mb-3">
                        <div className={`avatar ${getAvatarClass(prof.usuario_id)} rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3`}>
                          {prof.nombre.charAt(0)}{prof.apellido.charAt(0)}
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="mb-1 fs-6">{prof.nombre} {prof.apellido}</h5>
                          <p className="text-muted mb-1 small">{prof.titulo}</p>
                          <div className="rating">
                            <span className="text-warning small">{renderStars(prof.calificacion_promedio)}</span>
                            <span className="text-muted ms-1" style={{ fontSize: '0.75rem' }}>
                              ({prof.total_resenas})
                            </span>
                          </div>
                        </div>
                      </div>
                      <Card.Text className="text-muted small mb-3">
                        {prof.descripcion.substring(0, 100)}{prof.descripcion.length > 100 ? '...' : ''}
                      </Card.Text>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-primary fw-bold">Desde ${prof.tarifa_por_hora || 0}/h</span>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => navigate(`/profesional/${prof.usuario_id}`)}
                        >
                          Ver Perfil
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {totalResults === 0 && (
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