import React, { useState } from 'react';
import { Star, MapPin, Calendar, Edit2, Save, X, Camera, FileText, CheckCircle, Clock } from 'lucide-react';

const PerfilCliente = () => {
  const [isEditing, setIsEditing] = useState(false);

  const perfilInicial = {
    nombre: "Roberto Hernández",
    ubicacion: "San Salvador, El Salvador",
    foto: null,
    calificacion: 4.9,
    resenas: 12,
    miembro_desde: "2023",
    servicios_contratados: [
      {
        id: 1,
        servicio: "Fontanería - Reparación de tubería",
        profesional: "Ana Rodríguez",
        fecha: "15 de Octubre, 2024",
        monto: "$45.00",
        estado: "completado",
        calificacion: 5,
        comentario: "Excelente trabajo, muy profesional y rápida."
      },
      {
        id: 2,
        servicio: "Electricidad - Instalación de luminarias",
        profesional: "Carlos Martínez",
        fecha: "28 de Septiembre, 2024",
        monto: "$80.00",
        estado: "completado",
        calificacion: 5,
        comentario: "Muy buen servicio, llegó puntual y trabajó limpiamente."
      },
      {
        id: 3,
        servicio: "Carpintería - Reparación de puerta",
        profesional: "Luis García",
        fecha: "10 de Septiembre, 2024",
        monto: "$60.00",
        estado: "completado",
        calificacion: 4,
        comentario: "Buen trabajo en general, quedé satisfecho."
      },
      {
        id: 4,
        servicio: "Limpieza - Limpieza profunda",
        profesional: "María González",
        fecha: "5 de Agosto, 2024",
        monto: "$35.00",
        estado: "completado",
        calificacion: 5,
        comentario: "Excelente servicio, muy detallista y profesional."
      }
    ],
    resenas_recibidas: [
      {
        profesional: "Ana Rodríguez",
        servicio: "Fontanería",
        fecha: "Hace 2 semanas",
        calificacion: 5,
        comentario: "Cliente muy amable y comunicativo. Pago puntual. Recomendado."
      },
      {
        profesional: "Carlos Martínez",
        servicio: "Electricidad",
        fecha: "Hace 1 mes",
        calificacion: 5,
        comentario: "Excelente cliente, muy claro con sus necesidades. Todo muy bien."
      },
      {
        profesional: "Luis García",
        servicio: "Carpintería",
        fecha: "Hace 1 mes",
        calificacion: 5,
        comentario: "Cliente responsable y puntual con los pagos. Muy recomendable."
      }
    ]
  };

  const [perfil, setPerfil] = useState(perfilInicial);
  const [perfilTemp, setPerfilTemp] = useState(perfilInicial);

  const handleEdit = () => {
    setPerfilTemp({...perfil});
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!perfilTemp.nombre.trim()) {
      alert('El nombre completo es obligatorio');
      return;
    }
    if (!perfilTemp.ubicacion.trim()) {
      alert('La ubicación es obligatoria');
      return;
    }

    setPerfil(perfilTemp);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setPerfilTemp({...perfil});
    setIsEditing(false);
  };

  const updateField = (field, value) => {
    setPerfilTemp({ ...perfilTemp, [field]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField('foto', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="d-flex align-items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < Math.floor(rating) ? 'text-warning' : 'text-muted'}
            fill={i < Math.floor(rating) ? 'currentColor' : 'none'}
          />
        ))}
      </div>
    );
  };

  const getEstadoBadge = (estado) => {
    if (estado === 'completado') {
      return (
        <span className="badge bg-success d-inline-flex align-items-center gap-1">
          <CheckCircle size={12} />
          Completado
        </span>
      );
    }
    return (
      <span className="badge bg-primary d-inline-flex align-items-center gap-1">
        <Clock size={12} />
        En proceso
      </span>
    );
  };

  const currentPerfil = isEditing ? perfilTemp : perfil;

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f9fafb' }}>
      <div className="container py-4">
        <div className="card border-0 shadow-sm mb-4">
          <div style={{ height: '128px', background: 'linear-gradient(135deg, #351491 0%, #101728 100%)' }}></div>
          <div className="card-body px-4 pb-4">
            <div className="row g-4" style={{ marginTop: '-64px' }}>
              <div className="col-auto">
                <div className="position-relative">
                  {currentPerfil.foto ? (
                    <img
                      src={currentPerfil.foto}
                      alt={currentPerfil.nombre}
                      className="rounded-circle border border-4 border-white shadow-lg bg-white"
                      style={{ width: '128px', height: '128px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div 
                      className="rounded-circle border border-4 border-white shadow-lg d-flex align-items-center justify-content-center text-white fw-bold"
                      style={{ width: '128px', height: '128px', background: 'linear-gradient(135deg, #351491 0%, #101728 100%)', fontSize: '3rem' }}
                    >
                      {currentPerfil.nombre.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {isEditing && (
                    <label 
                      className="position-absolute bottom-0 end-0 btn btn-primary rounded-circle p-2 shadow-lg"
                      style={{ cursor: 'pointer' }}
                    >
                      <Camera size={20} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="d-none"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="col pt-5">
                <div className="d-flex flex-column flex-sm-row justify-content-between">
                  <div className="flex-grow-1">
                    {isEditing ? (
                      <div className="mb-3">
                        <input
                          type="text"
                          value={currentPerfil.nombre}
                          onChange={(e) => updateField('nombre', e.target.value)}
                          className="form-control form-control-lg fw-bold mb-2"
                          placeholder="Nombre completo"
                        />
                        <input
                          type="text"
                          value={currentPerfil.ubicacion}
                          onChange={(e) => updateField('ubicacion', e.target.value)}
                          className="form-control"
                          placeholder="Ubicación"
                        />
                      </div>
                    ) : (
                      <>
                        <h1 className="h2 fw-bold text-dark mb-1">{currentPerfil.nombre}</h1>
                        <p className="text-muted mb-2">Cliente</p>
                        <div className="d-flex flex-wrap gap-3 text-muted small mb-2">
                          <div className="d-flex align-items-center gap-1">
                            <MapPin size={16} />
                            {currentPerfil.ubicacion}
                          </div>
                          <div className="d-flex align-items-center gap-1">
                            <Calendar size={16} />
                            Miembro desde {currentPerfil.miembro_desde}
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          {renderStars(currentPerfil.calificacion)}
                          <span className="fw-semibold text-dark">{currentPerfil.calificacion}</span>
                          <span className="text-muted">({currentPerfil.resenas} reseñas)</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mt-3 mt-sm-0">
                    {isEditing ? (
                      <div className="d-flex flex-column gap-2">
                        <button onClick={handleSave} className="btn btn-success d-flex align-items-center justify-content-center gap-2">
                          <Save size={16} />
                          Guardar
                        </button>
                        <button onClick={handleCancel} className="btn btn-secondary d-flex align-items-center justify-content-center gap-2">
                          <X size={16} />
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button onClick={handleEdit} className="btn btn-primary d-flex align-items-center gap-2">
                        <Edit2 size={16} />
                        Editar Perfil
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-2 mb-4">
                  <FileText size={24} className="text-primary" />
                  <h2 className="h5 fw-bold mb-0">Comprobantes de Servicios</h2>
                </div>
                <div className="vstack gap-3">
                  {currentPerfil.servicios_contratados.map((servicio) => (
                    <div key={servicio.id} className="border rounded p-3 hover-shadow">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h3 className="h6 fw-semibold text-dark mb-1">{servicio.servicio}</h3>
                          <p className="text-muted small mb-0">
                            Profesional: {servicio.profesional}
                          </p>
                        </div>
                        {getEstadoBadge(servicio.estado)}
                      </div>
                      <div className="row g-3 text-muted small mb-3">
                        <div className="col-sm-6 d-flex align-items-center gap-2">
                          <Calendar size={16} />
                          {servicio.fecha}
                        </div>
                        <div className="col-sm-6 fw-semibold text-primary">
                          {servicio.monto}
                        </div>
                      </div>
                      {servicio.calificacion && (
                        <div className="pt-3 border-top">
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <span className="text-muted small">Mi calificación:</span>
                            {renderStars(servicio.calificacion)}
                          </div>
                          {servicio.comentario && (
                            <p className="text-muted small fst-italic mb-0">"{servicio.comentario}"</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h2 className="h5 fw-bold mb-2">Reseñas de Profesionales</h2>
                <p className="text-muted small mb-4">
                  Opiniones de los profesionales que han trabajado conmigo
                </p>
                <div className="vstack gap-3">
                  {currentPerfil.resenas_recibidas.map((resena, index) => (
                    <div key={index} className="pb-3 border-bottom">
                      <div className="d-flex align-items-start gap-3">
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center text-white fw-semibold flex-shrink-0"
                          style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #351491 0%, #101728 100%)' }}
                        >
                          {resena.profesional.charAt(0)}
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <div>
                              <h4 className="h6 fw-semibold mb-0">{resena.profesional}</h4>
                              <p className="text-muted small mb-0">{resena.servicio} • {resena.fecha}</p>
                            </div>
                            {renderStars(resena.calificacion)}
                          </div>
                          <p className="text-muted mt-2 mb-0">{resena.comentario}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm sticky-top" style={{ top: '1.5rem' }}>
              <div className="card-body p-4">
                <h3 className="h5 fw-bold mb-4">Estadísticas</h3>
                <div className="vstack gap-3">
                  <div className="p-3 rounded" style={{ backgroundColor: '#eef2ff' }}>
                    <div className="h3 fw-bold mb-0" style={{ color: '#312e81' }}>
                      {currentPerfil.servicios_contratados.length}
                    </div>
                    <div className="text-muted small mt-1">Servicios Contratados</div>
                  </div>
                  <div className="p-3 rounded" style={{ backgroundColor: '#dcfce7' }}>
                    <div className="h3 fw-bold mb-0 text-success">
                      {currentPerfil.calificacion}
                    </div>
                    <div className="text-muted small mt-1">Calificación Promedio</div>
                  </div>
                  <div className="p-3 rounded" style={{ backgroundColor: '#fae8ff' }}>
                    <div className="h3 fw-bold mb-0" style={{ color: '#7c3aed' }}>
                      {currentPerfil.resenas}
                    </div>
                    <div className="text-muted small mt-1">Reseñas Recibidas</div>
                  </div>
                </div>

                <hr className="my-4" />

                <div className="mb-3">
                  <h3 className="h5 fw-bold mb-3">Verificación</h3>
                  <div className="vstack gap-2">
                    <div className="d-flex align-items-center gap-2 text-muted small">
                      <CheckCircle size={20} className="text-success" />
                      <span>Email verificado</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 text-muted small">
                      <CheckCircle size={20} className="text-success" />
                      <span>Teléfono verificado</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 text-muted small">
                      <CheckCircle size={20} className="text-success" />
                      <span>Identidad verificada</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilCliente;