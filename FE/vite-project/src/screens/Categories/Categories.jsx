import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Tag,
  Briefcase,
  ChevronRight,
  Users,
  TrendingUp
} from 'lucide-react';

const CategoriesClient = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const categorias = [
    {
      id: 1,
      nombre: "Fontanería",
      descripcion: "Servicios de instalación y reparación de tuberías, grifos y sistemas de agua",
      icono: "🔧",
      profesionales: 45,
      servicios: 128,
      popularidad: "alta"
    },
    {
      id: 2,
      nombre: "Electricidad",
      descripcion: "Instalación eléctrica, reparaciones y mantenimiento de sistemas eléctricos",
      icono: "⚡",
      profesionales: 38,
      servicios: 156,
      popularidad: "alta"
    },
    {
      id: 3,
      nombre: "Carpintería",
      descripcion: "Fabricación y reparación de muebles, puertas, ventanas y estructuras de madera",
      icono: "🪵",
      profesionales: 32,
      servicios: 94,
      popularidad: "media"
    },
    {
      id: 4,
      nombre: "Limpieza",
      descripcion: "Servicios de limpieza residencial y comercial, limpieza profunda",
      icono: "🧹",
      profesionales: 67,
      servicios: 203,
      popularidad: "alta"
    },
    {
      id: 5,
      nombre: "Pintura",
      descripcion: "Pintura de interiores y exteriores, acabados decorativos",
      icono: "🎨",
      profesionales: 29,
      servicios: 87,
      popularidad: "media"
    },
    {
      id: 6,
      nombre: "Jardinería",
      descripcion: "Mantenimiento de jardines, poda, diseño de espacios verdes",
      icono: "🌱",
      profesionales: 24,
      servicios: 56,
      popularidad: "media"
    },
    {
      id: 7,
      nombre: "Albañilería",
      descripcion: "Construcción, remodelaciones y reparaciones estructurales",
      icono: "🧱",
      profesionales: 41,
      servicios: 112,
      popularidad: "alta"
    },
    {
      id: 8,
      nombre: "Mecánica",
      descripcion: "Reparación y mantenimiento de vehículos",
      icono: "🔩",
      profesionales: 33,
      servicios: 98,
      popularidad: "media"
    }
  ];

  // Filtrar categorías por búsqueda
  const categoriasFiltradas = categorias.filter(cat =>
    cat.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Categorías más populares (top 4)
  const categoriasPopulares = [...categorias]
    .sort((a, b) => b.profesionales - a.profesionales)
    .slice(0, 4);

  // Manejar clic en categoría
  const handleCategoryClick = (categoriaId, categoriaNombre) => {
    // Navegar a la búsqueda de profesionales filtrada por categoría
    navigate(`/search?category=${categoriaId}&name=${encodeURIComponent(categoriaNombre)}`);
  };

  const getBadgePopularidad = (popularidad) => {
    if (popularidad === 'alta') {
      return (
        <span className="badge bg-danger d-inline-flex align-items-center gap-1">
          <TrendingUp size={12} />
          Popular
        </span>
      );
    }
    return null;
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f9fafb' }}>
      <div className="container py-4">
        {/* Header con búsqueda */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center justify-content-center mb-3 p-3 rounded-circle" 
                   style={{ backgroundColor: '#eef2ff' }}>
                <Tag size={32} style={{ color: '#312e81' }} />
              </div>
              <h1 className="h2 fw-bold mb-2">Explora Nuestras Categorías</h1>
              <p className="text-muted mb-0">
                Encuentra el profesional perfecto para tu necesidad
              </p>
            </div>

            {/* Buscador */}
            <div className="position-relative" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <Search
                className="position-absolute text-muted"
                size={20}
                style={{ left: '16px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                className="form-control form-control-lg ps-5 pe-4"
                placeholder="Buscar categorías..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ borderRadius: '50px' }}
              />
            </div>
          </div>
        </div>

        {/* Categorías Populares */}
        {!searchTerm && (
          <div className="mb-4">
            <h2 className="h5 fw-bold mb-3 d-flex align-items-center gap-2">
              <TrendingUp size={20} className="text-danger" />
              Más Populares
            </h2>
            <div className="row g-3">
              {categoriasPopulares.map((categoria) => (
                <div key={categoria.id} className="col-md-6 col-lg-3">
                  <div 
                    className="card border-0 shadow-sm h-100 cursor-pointer hover-lift"
                    onClick={() => handleCategoryClick(categoria.id, categoria.nombre)}
                    style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div className="card-body p-3 text-center">
                      <div className="fs-1 mb-2">{categoria.icono}</div>
                      <h3 className="h6 fw-bold mb-1">{categoria.nombre}</h3>
                      <div className="small text-muted">
                        <Users size={14} className="me-1" />
                        {categoria.profesionales} profesionales
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Todas las Categorías */}
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <h2 className="h5 fw-bold mb-4">
              {searchTerm ? 'Resultados de búsqueda' : 'Todas las Categorías'} 
              <span className="text-muted fw-normal ms-2">({categoriasFiltradas.length})</span>
            </h2>
            
            {categoriasFiltradas.length === 0 ? (
              <div className="text-center py-5">
                <div className="mb-3">🔍</div>
                <h3 className="h5 text-muted mb-2">No se encontraron categorías</h3>
                <p className="text-muted small mb-0">
                  Intenta con otros términos de búsqueda
                </p>
              </div>
            ) : (
              <div className="row g-3">
                {categoriasFiltradas.map((categoria) => (
                  <div key={categoria.id} className="col-12">
                    <div 
                      className="border rounded p-3 cursor-pointer"
                      onClick={() => handleCategoryClick(categoria.id, categoria.nombre)}
                      style={{ 
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: '#fff'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f8f9fa';
                        e.currentTarget.style.borderColor = '#351491';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#fff';
                        e.currentTarget.style.borderColor = '#dee2e6';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <div className="d-flex align-items-start gap-3">
                        {/* Icono */}
                        <div
                          className="rounded d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{
                            width: '70px',
                            height: '70px',
                            background: 'linear-gradient(135deg, #351491 0%, #101728 100%)',
                            fontSize: '2.5rem'
                          }}
                        >
                          {categoria.icono}
                        </div>
                        
                        {/* Contenido */}
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div className="flex-grow-1">
                              <h3 className="h6 fw-bold mb-1 d-flex align-items-center gap-2">
                                {categoria.nombre}
                                {getBadgePopularidad(categoria.popularidad)}
                              </h3>
                              <p className="text-muted small mb-2">
                                {categoria.descripcion}
                              </p>
                              <div className="d-flex gap-4 text-muted small">
                                <div className="d-flex align-items-center gap-1">
                                  <Users size={16} />
                                  <strong className="text-primary">{categoria.profesionales}</strong> profesionales
                                </div>
                                <div className="d-flex align-items-center gap-1">
                                  <Briefcase size={16} />
                                  <strong className="text-success">{categoria.servicios}</strong> servicios
                                </div>
                              </div>
                            </div>
                            
                            {/* Flecha */}
                            <div className="d-flex align-items-center ps-3">
                              <ChevronRight size={24} className="text-primary" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Información adicional */}
        <div className="row g-4 mt-2">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: '#eef2ff' }}>
              <div className="card-body p-4 text-center">
                <div className="fs-2 mb-2">🎯</div>
                <h3 className="h6 fw-bold mb-2">Encuentra Fácilmente</h3>
                <p className="text-muted small mb-0">
                  Busca por categoría y encuentra el profesional que necesitas
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: '#dcfce7' }}>
              <div className="card-body p-4 text-center">
                <div className="fs-2 mb-2">⭐</div>
                <h3 className="h6 fw-bold mb-2">Profesionales Verificados</h3>
                <p className="text-muted small mb-0">
                  Todos nuestros profesionales están verificados y calificados
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: '#fef3c7' }}>
              <div className="card-body p-4 text-center">
                <div className="fs-2 mb-2">💬</div>
                <h3 className="h6 fw-bold mb-2">Lee Reseñas</h3>
                <p className="text-muted small mb-0">
                  Revisa las opiniones de otros clientes antes de contratar
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesClient;