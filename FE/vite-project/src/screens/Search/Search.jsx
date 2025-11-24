import { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Button, Card, Badge, Spinner, Alert } from 'react-bootstrap'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { professionalAPI, categoryAPI, locationAPI } from '../../services/api' // Importamos locationAPI
import './Search.css'

function Search() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  
  // --- ESTADOS DE DATOS MAESTROS (Combos y Listas) ---
  const [categoriesList, setCategoriesList] = useState([]);
  const [locationsList, setLocationsList] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  
  // --- ESTADOS DE CARGA Y ERROR ---
  const [loadingData, setLoadingData] = useState(true); // Para cargar categorías/ubicaciones
  const [loadingSearch, setLoadingSearch] = useState(false); // Para buscar profesionales
  const [error, setError] = useState(null);

  // --- VALORES INICIALES DE URL ---
  const initialCategory = searchParams.get('category') ? parseInt(searchParams.get('category')) : null;
  const initialQ = searchParams.get('q') || '';
  const initialPriceMin = parseInt(searchParams.get('priceMin')) || 0;
  const initialPriceMax = parseInt(searchParams.get('priceMax')) || 1000;
  const initialRating = parseFloat(searchParams.get('rating')) || 0; // 0 para mostrar todos por defecto
  const initialLocation = searchParams.get('location') || '';

  // --- ESTADOS DE FILTROS ---
  const [searchTerm, setSearchTerm] = useState(initialQ);
  const [filters, setFilters] = useState({
    categoryId: initialCategory,
    priceMin: initialPriceMin,
    priceMax: initialPriceMax,
    rating: initialRating,
    location: initialLocation
  });

  // Estados locales para evitar parpadeo en inputs de precio
  const [localPriceMin, setLocalPriceMin] = useState(initialPriceMin.toString());
  const [localPriceMax, setLocalPriceMax] = useState(initialPriceMax.toString());
  const [sortBy, setSortBy] = useState('relevant');

  // ----------------------------------------------------------------
  // 1. EFECTO DE INICIALIZACIÓN (Carga Categorías y Ubicaciones)
  // ----------------------------------------------------------------
  useEffect(() => {
    const fetchMasterData = async () => {
        try {
            const [catRes, locRes] = await Promise.all([
                categoryAPI.getAll(),
                locationAPI.getAll()
            ]);
            setCategoriesList(catRes.data || []);
            setLocationsList(locRes.data || []);
        } catch (e) {
            console.error("Error cargando datos maestros:", e);
            setError("Error al cargar filtros. Verifica tu conexión.");
        } finally {
            setLoadingData(false);
        }
    };
    fetchMasterData();
  }, []);

  // ----------------------------------------------------------------
  // 2. EFECTO DE BÚSQUEDA (Se ejecuta cuando cambian los filtros)
  // ----------------------------------------------------------------
  useEffect(() => {
    const searchPros = async () => {
        setLoadingSearch(true);
        setError(null);
        
        try {
            // Construir objeto de filtros para el BE
            const apiFilters = {
                busqueda: searchTerm || undefined,
                categoria_id: filters.categoryId || undefined,
                tarifa_min: filters.priceMin > 0 ? filters.priceMin : undefined,
                tarifa_max: filters.priceMax < 1000 ? filters.priceMax : undefined,
                calificacion_min: filters.rating > 0 ? filters.rating : undefined,
                ubicacion: filters.location && filters.location !== 'Toda El Salvador' ? filters.location : undefined
            };

            const response = await professionalAPI.search(apiFilters);
            setProfessionals(response.data.professionals || []);

        } catch (e) {
            console.error("Error buscando profesionales:", e);
            setError("Error al realizar la búsqueda.");
            setProfessionals([]);
        } finally {
            setLoadingSearch(false);
        }
    };

    // Debounce pequeño opcional o llamada directa
    const timer = setTimeout(() => {
        searchPros();
    }, 300);

    return () => clearTimeout(timer);

  }, [searchTerm, filters]); // Se dispara al cambiar texto o filtros

  // ----------------------------------------------------------------
  // HANDLERS
  // ----------------------------------------------------------------

  // Manejo del formulario de búsqueda principal
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Actualizar URL para reflejar la búsqueda
    setSearchParams({ q: searchTerm });
    // El useEffect detectará el cambio en searchTerm y ejecutará la búsqueda
  };

  // Manejo de Categorías (Checkbox tipo Radio: solo una activa)
  const handleCategoryChange = (catId) => {
    setFilters(prev => ({
        ...prev,
        categoryId: prev.categoryId === catId ? null : catId // Toggle: si ya está, lo quita
    }));
  };

  // Manejo de Inputs de Precio (OnBlur para evitar recargas por tecla)
  const handlePriceBlur = () => {
    const min = parseInt(localPriceMin) || 0;
    const max = parseInt(localPriceMax) || 1000;
    if (min !== filters.priceMin || max !== filters.priceMax) {
        setFilters(prev => ({ ...prev, priceMin: min, priceMax: max }));
    }
  };

  // Manejo de Ubicación
  const handleLocationChange = (e) => {
    setFilters(prev => ({ ...prev, location: e.target.value }));
  };

  // Manejo de Calificación
  const handleRatingChange = (rating) => {
    setFilters(prev => ({ ...prev, rating: prev.rating === rating ? 0 : rating })); // Toggle
  };

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({
      categoryId: null,
      priceMin: 0,
      priceMax: 1000,
      rating: 0,
      location: ''
    });
    setLocalPriceMin('0');
    setLocalPriceMax('1000');
    setSearchTerm('');
    setSearchParams({});
  };

  // Ordenamiento local
  const getSortedProfessionals = () => {
    const list = [...professionals];
    switch (sortBy) {
      case 'price-low': return list.sort((a, b) => (a.tarifa_por_hora || 0) - (b.tarifa_por_hora || 0));
      case 'price-high': return list.sort((a, b) => (b.tarifa_por_hora || 0) - (a.tarifa_por_hora || 0));
      case 'rating': return list.sort((a, b) => (b.calificacion_promedio || 0) - (a.calificacion_promedio || 0));
      default: return list;
    }
  };

  const sortedProfessionals = getSortedProfessionals();

  // Helpers visuales
  const renderStars = (rating) => {
    const rounded = Math.round(rating || 0);
    return '★'.repeat(rounded) + '☆'.repeat(5 - rounded);
  };

  const getAvatarClass = (id) => {
    const classes = ['bg-gradient-blue', 'bg-gradient-green', 'bg-gradient-purple', 'bg-gradient-orange', 'bg-gradient-red'];
    return classes[(id || 0) % classes.length];
  };

  if (loadingData) {
    return (
        <Container className="my-5 text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Cargando filtros...</p>
        </Container>
    );
  }

  return (
    <div className="search-page">
      {/* HEADER BÚSQUEDA */}
      <section className="search-header-section">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <Form onSubmit={handleSearchSubmit}>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="text"
                    className="search-input-large"
                    placeholder="¿Qué servicio necesitas?"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button type="submit" variant="light" className="search-button">Buscar</Button>
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="mb-5 mt-4">
        <Row>
          {/* SIDEBAR FILTROS */}
          <Col lg={3}>
            <Card className="filters-card sticky-top">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Filtros</h5>
                  <Button variant="link" size="sm" className="text-danger p-0" onClick={clearFilters}>Limpiar</Button>
                </div>

                {/* FILTRO CATEGORÍA (Dinámico) */}
                <div className="filter-group">
                  <h6 className="filter-label">Categorías</h6>
                  {categoriesList.length > 0 ? categoriesList.map(cat => (
                    <Form.Check
                      key={cat.id}
                      type="checkbox" // Visualmente check, comportamiento lógico switch
                      id={`cat-${cat.id}`}
                      label={
                        <div className="d-flex justify-content-between w-100">
                            <span>{cat.nombre}</span>
                            {/* Muestra 0 si es null/undefined */}
                            <Badge bg="light" text="dark">{cat.total_profesionales || 0}</Badge>
                        </div>
                      }
                      checked={filters.categoryId === cat.id}
                      onChange={() => handleCategoryChange(cat.id)}
                      className="mb-2"
                    />
                  )) : <p className="text-muted small">No hay categorías disponibles</p>}
                </div>

                <hr />

                {/* FILTRO PRECIO */}
                <div className="filter-group">
                  <h6 className="filter-label">Precio por hora ($)</h6>
                  <Row>
                    <Col>
                      <Form.Control
                        type="number" size="sm" placeholder="Min"
                        value={localPriceMin}
                        onChange={(e) => setLocalPriceMin(e.target.value)}
                        onBlur={handlePriceBlur}
                      />
                    </Col>
                    <Col xs="auto" className="px-0">-</Col>
                    <Col>
                      <Form.Control
                        type="number" size="sm" placeholder="Max"
                        value={localPriceMax}
                        onChange={(e) => setLocalPriceMax(e.target.value)}
                        onBlur={handlePriceBlur}
                      />
                    </Col>
                  </Row>
                </div>

                <hr />

                {/* FILTRO ESTRELLAS */}
                <div className="filter-group">
                  <h6 className="filter-label">Calificación Mínima</h6>
                  {[5, 4, 3, 2, 1].map(rating => (
                    <Form.Check
                      key={rating}
                      type="radio"
                      id={`rating-${rating}`}
                      name="rating-filter"
                      label={<span className="text-warning">{renderStars(rating)}</span>}
                      checked={filters.rating === rating}
                      onChange={() => handleRatingChange(rating)}
                      className="mb-2"
                    />
                  ))}
                </div>

                <hr />

                {/* FILTRO UBICACIÓN (Dinámico) */}
                <div className="filter-group">
                  <h6 className="filter-label">Ubicación</h6>
                  <Form.Select size="sm" value={filters.location} onChange={handleLocationChange}>
                    <option value="">Todas las ubicaciones</option>
                    {locationsList.map(loc => (
                      <option key={loc.id} value={loc.nombre}>{loc.nombre}</option>
                    ))}
                  </Form.Select>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* RESULTADOS */}
          <Col lg={9}>
            <Card className="mb-3 border-0 shadow-sm">
              <Card.Body>
                <Row className="align-items-center">
                  <Col>
                    <p className="mb-0 text-muted">
                      {loadingSearch ? 'Buscando...' : 
                        <>Encontrados <strong>{sortedProfessionals.length}</strong> profesionales</>
                      }
                    </p>
                  </Col>
                  <Col xs="auto">
                    <Form.Select size="sm" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                      <option value="relevant">Más relevantes</option>
                      <option value="price-low">Precio: Menor a Mayor</option>
                      <option value="price-high">Precio: Mayor a Menor</option>
                      <option value="rating">Mejor Calificados</option>
                    </Form.Select>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {error && <Alert variant="danger">{error}</Alert>}

            {loadingSearch ? (
                <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
            ) : (
                <Row className="g-3">
                {sortedProfessionals.map(prof => (
                    <Col key={prof.usuario_id} md={6} lg={4}>
                    <Card className="professional-card h-100">
                        <Card.Body>
                        <div className="d-flex align-items-center mb-3">
                            <div className={`avatar ${getAvatarClass(prof.usuario_id)} rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3`}>
                            {prof.nombre?.charAt(0)}{prof.apellido?.charAt(0)}
                            </div>
                            <div className="flex-grow-1">
                            <h5 className="mb-1 fs-6 text-truncate">{prof.nombre} {prof.apellido}</h5>
                            <p className="text-muted mb-1 small text-truncate">{prof.titulo}</p>
                            <div className="rating small">
                                <span className="text-warning">{renderStars(prof.calificacion_promedio)}</span>
                                <span className="text-muted ms-1">({prof.total_resenas})</span>
                            </div>
                            </div>
                        </div>
                        <Card.Text className="text-muted small mb-3 text-truncate-3">
                            {prof.descripcion || "Sin descripción disponible."}
                        </Card.Text>
                        <div className="d-flex justify-content-between align-items-center mt-auto">
                            <span className="text-primary fw-bold">
                                {prof.tarifa_por_hora ? `$${prof.tarifa_por_hora}/h` : 'A convenir'}
                            </span>
                            <Button variant="primary" size="sm" onClick={() => navigate(`/profesional/${prof.usuario_id}`)}>
                                Ver Perfil
                            </Button>
                        </div>
                        </Card.Body>
                    </Card>
                    </Col>
                ))}
                </Row>
            )}

            {!loadingSearch && sortedProfessionals.length === 0 && !error && (
              <div className="text-center py-5 bg-white rounded shadow-sm">
                <h5 className="text-muted">No se encontraron resultados</h5>
                <p className="text-muted small">Intenta ajustar los filtros o buscar con otros términos</p>
                <Button variant="outline-primary" size="sm" onClick={clearFilters}>Limpiar todos los filtros</Button>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Search