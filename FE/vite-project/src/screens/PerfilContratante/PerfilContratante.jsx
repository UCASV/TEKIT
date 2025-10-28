import React, { useState } from 'react';
import { Star, MapPin, Briefcase, Award, Clock, Mail, Phone, Calendar, Edit2, Save, X, Plus, Trash2, Camera } from 'lucide-react';
import './PerfilContratante.css';

const PerfilContratante = () => {
  const [activeTab, setActiveTab] = useState('sobre-mi');
  const [isEditing, setIsEditing] = useState(false);

  const perfilInicial = {
    nombre: "Ana Rodríguez",
    titulo: "Fontanera Certificada",
    ubicacion: "San Salvador, El Salvador",
    foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
    calificacion: 4.8,
    resenas: 45,
    verificado: true,
    miembro_desde: "2022",
    tarifa: "30",
    email: "ana.rodriguez@email.com",
    telefono: "+503 1234-5678",
    sobre_mi: "Fontanera profesional con más de 10 años de experiencia en servicios residenciales y comerciales. Especializada en emergencias 24/7, instalaciones de grifería, reparación de tuberías y sistemas de agua. Comprometida con la calidad y la satisfacción del cliente.",
    experiencia: [
      {
        puesto: "Fontanera Independiente",
        periodo: "2020 - Presente",
        descripcion: "Servicios de fontanería residencial y comercial. Especializada en emergencias, reparaciones e instalaciones."
      },
      {
        puesto: "Técnica Senior - Instalaciones García",
        periodo: "2015 - 2020",
        descripcion: "Responsable de proyectos de instalación de sistemas de agua y calefacción en edificios comerciales."
      },
      {
        puesto: "Aprendiz de Fontanería - Construcciones López",
        periodo: "2013 - 2015",
        descripcion: "Formación técnica en instalaciones sanitarias y sistemas de agua potable."
      }
    ],
    habilidades: [
      "Reparación de tuberías",
      "Instalación de grifería",
      "Sistemas de agua",
      "Calefacción",
      "Emergencias 24/7",
      "Detección de fugas",
      "Instalación de sanitarios",
      "Desatascos"
    ],
    certificaciones: [
      "Certificación Profesional en Fontanería",
      "Licencia Sanitaria",
      "Curso de Seguridad Laboral"
    ],
    proyectos: [
      {
        titulo: "Renovación Sistema de Agua - Edificio Comercial",
        descripcion: "Instalación completa de sistema de agua potable en edificio de 5 plantas.",
        fecha: "2024"
      },
      {
        titulo: "Reparación de Emergencia - Hotel Plaza",
        descripcion: "Solución urgente de fuga mayor en sistema principal de agua.",
        fecha: "2024"
      }
    ],
    resenas_lista: [
      {
        nombre: "Carlos Martínez",
        fecha: "Hace 2 semanas",
        calificacion: 5,
        comentario: "Excelente profesional. Resolvió una emergencia de fontanería rápidamente y con muy buen precio. Muy recomendable."
      },
      {
        nombre: "María González",
        fecha: "Hace 1 mes",
        calificacion: 5,
        comentario: "Muy profesional y eficiente. Instaló toda la grifería de mi cocina nueva. Trabajo impecable."
      },
      {
        nombre: "Juan Pérez",
        fecha: "Hace 2 meses",
        calificacion: 4,
        comentario: "Buen servicio, llegó puntual y solucionó el problema. Precios justos."
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
    if (!perfilTemp.titulo.trim()) {
      alert('El título profesional es obligatorio');
      return;
    }
    if (!perfilTemp.ubicacion.trim()) {
      alert('La ubicación es obligatoria');
      return;
    }

    const perfilLimpio = {
      ...perfilTemp,
      experiencia: perfilTemp.experiencia.filter(exp => 
        exp.puesto.trim() && exp.periodo.trim() && exp.descripcion.trim()
      ),
      proyectos: perfilTemp.proyectos.filter(proj => 
        proj.titulo.trim() && proj.descripcion.trim() && proj.fecha.trim()
      ),
      habilidades: perfilTemp.habilidades.filter(hab => hab.trim()),
      certificaciones: perfilTemp.certificaciones.filter(cert => cert.trim())
    };
    setPerfil(perfilLimpio);
    setPerfilTemp(perfilLimpio);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setPerfilTemp({...perfil});
    setIsEditing(false);
  };

  const updateField = (field, value) => {
    setPerfilTemp({ ...perfilTemp, [field]: value });
  };

  const handleTarifaChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setPerfilTemp({ ...perfilTemp, tarifa: value });
    }
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

  const addExperiencia = () => {
    setPerfilTemp({
      ...perfilTemp,
      experiencia: [...perfilTemp.experiencia, { puesto: "", periodo: "", descripcion: "" }]
    });
  };

  const updateExperiencia = (index, field, value) => {
    const newExp = [...perfilTemp.experiencia];
    newExp[index][field] = value;
    setPerfilTemp({ ...perfilTemp, experiencia: newExp });
  };

  const deleteExperiencia = (index) => {
    const newExp = perfilTemp.experiencia.filter((_, i) => i !== index);
    setPerfilTemp({ ...perfilTemp, experiencia: newExp });
  };

  const [nuevaHabilidad, setNuevaHabilidad] = useState('');
  const [nuevaCertificacion, setNuevaCertificacion] = useState('');
  const [mostrarInputHabilidad, setMostrarInputHabilidad] = useState(false);
  const [mostrarInputCertificacion, setMostrarInputCertificacion] = useState(false);

  const addHabilidad = () => {
    if (nuevaHabilidad.trim()) {
      setPerfilTemp({
        ...perfilTemp,
        habilidades: [...perfilTemp.habilidades, nuevaHabilidad.trim()]
      });
      setNuevaHabilidad('');
      setMostrarInputHabilidad(false);
    }
  };

  const deleteHabilidad = (index) => {
    const newHab = perfilTemp.habilidades.filter((_, i) => i !== index);
    setPerfilTemp({ ...perfilTemp, habilidades: newHab });
  };

  const addCertificacion = () => {
    if (nuevaCertificacion.trim()) {
      setPerfilTemp({
        ...perfilTemp,
        certificaciones: [...perfilTemp.certificaciones, nuevaCertificacion.trim()]
      });
      setNuevaCertificacion('');
      setMostrarInputCertificacion(false);
    }
  };

  const deleteCertificacion = (index) => {
    const newCert = perfilTemp.certificaciones.filter((_, i) => i !== index);
    setPerfilTemp({ ...perfilTemp, certificaciones: newCert });
  };

  const addProyecto = () => {
    setPerfilTemp({
      ...perfilTemp,
      proyectos: [...perfilTemp.proyectos, { titulo: "", descripcion: "", fecha: "" }]
    });
  };

  const updateProyecto = (index, field, value) => {
    const newProj = [...perfilTemp.proyectos];
    newProj[index][field] = value;
    setPerfilTemp({ ...perfilTemp, proyectos: newProj });
  };

  const deleteProyecto = (index) => {
    const newProj = perfilTemp.proyectos.filter((_, i) => i !== index);
    setPerfilTemp({ ...perfilTemp, proyectos: newProj });
  };

  const renderStars = (rating) => {
    return (
      <div className="d-flex align-items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`star-icon ${
              i < Math.floor(rating)
                ? 'star-filled'
                : 'star-empty'
            }`}
          />
        ))}
      </div>
    );
  };

  const currentPerfil = isEditing ? perfilTemp : perfil;

  return (
    <div className="perfil-contratante">
      <div className="perfil-header">
        <div className="header-gradient"></div>
        <div className="container">
          <div className="perfil-info-container">
            <div className="avatar-section">
              <div className="avatar-wrapper">
                <img
                  src={currentPerfil.foto}
                  alt={currentPerfil.nombre}
                  className="avatar-image"
                />
                {isEditing && (
                  <label className="avatar-edit-button">
                    <Camera className="camera-icon" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="file-input-hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="info-section">
              <div className="info-content">
                <div className="info-main">
                  {isEditing ? (
                    <div className="edit-fields">
                      <input
                        type="text"
                        value={currentPerfil.nombre}
                        onChange={(e) => updateField('nombre', e.target.value)}
                        className="input-nombre"
                        placeholder="Nombre completo"
                      />
                      <input
                        type="text"
                        value={currentPerfil.titulo}
                        onChange={(e) => updateField('titulo', e.target.value)}
                        className="input-titulo"
                        placeholder="Título profesional"
                      />
                      <input
                        type="text"
                        value={currentPerfil.ubicacion}
                        onChange={(e) => updateField('ubicacion', e.target.value)}
                        className="input-ubicacion"
                        placeholder="Ubicación"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="nombre-container">
                        <h1 className="nombre">{currentPerfil.nombre}</h1>
                        {currentPerfil.verificado && (
                          <Award className="badge-verificado" />
                        )}
                      </div>
                      <p className="titulo">{currentPerfil.titulo}</p>
                      <div className="metadata">
                        <div className="metadata-item">
                          <MapPin className="metadata-icon" />
                          {currentPerfil.ubicacion}
                        </div>
                        <div className="metadata-item">
                          <Calendar className="metadata-icon" />
                          Miembro desde {currentPerfil.miembro_desde}
                        </div>
                      </div>
                      <div className="rating-container">
                        {renderStars(currentPerfil.calificacion)}
                        <span className="rating-number">{currentPerfil.calificacion}</span>
                        <span className="rating-reviews">({currentPerfil.resenas} reseñas)</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="info-actions">
                  {isEditing ? (
                    <div className="edit-actions">
                      <div className="tarifa-input-container">
                        <span className="tarifa-symbol">$</span>
                        <input
                          type="text"
                          value={currentPerfil.tarifa}
                          onChange={handleTarifaChange}
                          className="input-tarifa"
                          placeholder="0.00"
                        />
                      </div>
                      <button
                        onClick={handleSave}
                        className="btn btn-save"
                      >
                        <Save className="btn-icon" />
                        Guardar
                      </button>
                      <button
                        onClick={handleCancel}
                        className="btn btn-cancel"
                      >
                        <X className="btn-icon" />
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="tarifa-display">
                        Desde ${currentPerfil.tarifa}
                      </div>
                      <button
                        onClick={handleEdit}
                        className="btn btn-edit"
                      >
                        <Edit2 className="btn-icon" />
                        Editar Perfil
                      </button>
                      <button className="btn btn-contact">
                        Contactar
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tabs-container">
        <div className="container">
          <nav className="tabs-nav">
            {[
              { id: 'sobre-mi', label: 'Sobre mí' },
              { id: 'experiencia', label: 'Experiencia' },
              { id: 'habilidades', label: 'Habilidades' },
              { id: 'proyectos', label: 'Proyectos' },
              { id: 'resenas', label: 'Reseñas' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-button ${activeTab === tab.id ? 'tab-active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="container content-container">
        <div className="content-grid">
          <div className="main-content">
            {activeTab === 'sobre-mi' && (
              <div className="card">
                <h2 className="card-title">Sobre mí</h2>
                {isEditing ? (
                  <textarea
                    value={currentPerfil.sobre_mi}
                    onChange={(e) => updateField('sobre_mi', e.target.value)}
                    className="textarea-sobre-mi"
                    placeholder="Describe tu experiencia y especialización..."
                  />
                ) : (
                  <p className="card-text">{currentPerfil.sobre_mi}</p>
                )}
              </div>
            )}

            {activeTab === 'experiencia' && (
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Experiencia Laboral</h2>
                  {isEditing && (
                    <button
                      onClick={addExperiencia}
                      className="btn-add"
                    >
                      <Plus className="btn-icon-small" />
                      Agregar
                    </button>
                  )}
                </div>
                <div className="experiencia-list">
                  {currentPerfil.experiencia.map((exp, index) => (
                    <div key={index} className="experiencia-item">
                      <div className="experiencia-icon">
                        <Briefcase className="icon" />
                      </div>
                      <div className="experiencia-content">
                        {isEditing ? (
                          <div className="edit-experiencia">
                            <div className="edit-row">
                              <input
                                type="text"
                                value={exp.puesto}
                                onChange={(e) => updateExperiencia(index, 'puesto', e.target.value)}
                                className="input-field"
                                placeholder="Puesto"
                              />
                              <button
                                onClick={() => deleteExperiencia(index)}
                                className="btn-delete"
                              >
                                <Trash2 className="icon-delete" />
                              </button>
                            </div>
                            <input
                              type="text"
                              value={exp.periodo}
                              onChange={(e) => updateExperiencia(index, 'periodo', e.target.value)}
                              className="input-field"
                              placeholder="Periodo (ej: 2020 - Presente)"
                            />
                            <textarea
                              value={exp.descripcion}
                              onChange={(e) => updateExperiencia(index, 'descripcion', e.target.value)}
                              className="textarea-field"
                              placeholder="Descripción del puesto..."
                            />
                          </div>
                        ) : (
                          <>
                            <h3 className="experiencia-puesto">{exp.puesto}</h3>
                            <div className="experiencia-periodo">
                              <Clock className="periodo-icon" />
                              {exp.periodo}
                            </div>
                            <p className="experiencia-descripcion">{exp.descripcion}</p>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'habilidades' && (
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Habilidades</h2>
                  {isEditing && (
                    <button
                      onClick={() => setMostrarInputHabilidad(!mostrarInputHabilidad)}
                      className="btn-add"
                    >
                      <Plus className="btn-icon-small" />
                      Agregar
                    </button>
                  )}
                </div>

                {isEditing && mostrarInputHabilidad && (
                  <div className="add-input-container">
                    <input
                      type="text"
                      value={nuevaHabilidad}
                      onChange={(e) => setNuevaHabilidad(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addHabilidad()}
                      className="input-add"
                      placeholder="Escribe una habilidad..."
                      autoFocus
                    />
                    <button
                      onClick={addHabilidad}
                      className="btn-confirm"
                    >
                      <Plus className="btn-icon-small" />
                    </button>
                    <button
                      onClick={() => {
                        setMostrarInputHabilidad(false);
                        setNuevaHabilidad('');
                      }}
                      className="btn-cancel-add"
                    >
                      <X className="btn-icon-small" />
                    </button>
                  </div>
                )}

                <div className="habilidades-grid">
                  {currentPerfil.habilidades.map((habilidad, index) => (
                    <span
                      key={index}
                      className="habilidad-tag"
                    >
                      {habilidad}
                      {isEditing && (
                        <button
                          onClick={() => deleteHabilidad(index)}
                          className="habilidad-delete"
                        >
                          <X className="icon-small" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>

                <div className="certificaciones-section">
                  <div className="card-header">
                    <h3 className="section-subtitle">Certificaciones</h3>
                    {isEditing && (
                      <button
                        onClick={() => setMostrarInputCertificacion(!mostrarInputCertificacion)}
                        className="btn-add"
                      >
                        <Plus className="btn-icon-small" />
                        Agregar
                      </button>
                    )}
                  </div>

                  {isEditing && mostrarInputCertificacion && (
                    <div className="add-input-container">
                      <input
                        type="text"
                        value={nuevaCertificacion}
                        onChange={(e) => setNuevaCertificacion(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addCertificacion()}
                        className="input-add"
                        placeholder="Escribe una certificación..."
                        autoFocus
                      />
                      <button
                        onClick={addCertificacion}
                        className="btn-confirm"
                      >
                        <Plus className="btn-icon-small" />
                      </button>
                      <button
                        onClick={() => {
                          setMostrarInputCertificacion(false);
                          setNuevaCertificacion('');
                        }}
                        className="btn-cancel-add"
                      >
                        <X className="btn-icon-small" />
                      </button>
                    </div>
                  )}

                  <ul className="certificaciones-list">
                    {currentPerfil.certificaciones.map((cert, index) => (
                      <li key={index} className="certificacion-item">
                        <div className="certificacion-content">
                          <Award className="certificacion-icon" />
                          {cert}
                        </div>
                        {isEditing && (
                          <button
                            onClick={() => deleteCertificacion(index)}
                            className="btn-delete-cert"
                          >
                            <Trash2 className="icon-delete" />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'proyectos' && (
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Proyectos Destacados</h2>
                  {isEditing && (
                    <button
                      onClick={addProyecto}
                      className="btn-add"
                    >
                      <Plus className="btn-icon-small" />
                      Agregar
                    </button>
                  )}
                </div>
                <div className="proyectos-list">
                  {currentPerfil.proyectos.map((proyecto, index) => (
                    <div key={index} className="proyecto-card">
                      {isEditing ? (
                        <div className="edit-proyecto">
                          <div className="edit-row">
                            <input
                              type="text"
                              value={proyecto.titulo}
                              onChange={(e) => updateProyecto(index, 'titulo', e.target.value)}
                              className="input-proyecto-titulo"
                              placeholder="Título del proyecto"
                            />
                            <input
                              type="text"
                              value={proyecto.fecha}
                              onChange={(e) => updateProyecto(index, 'fecha', e.target.value)}
                              className="input-proyecto-fecha"
                              placeholder="Año"
                            />
                            <button
                              onClick={() => deleteProyecto(index)}
                              className="btn-delete"
                            >
                              <Trash2 className="icon-delete" />
                            </button>
                          </div>
                          <textarea
                            value={proyecto.descripcion}
                            onChange={(e) => updateProyecto(index, 'descripcion', e.target.value)}
                            className="textarea-proyecto"
                            placeholder="Descripción del proyecto..."
                          />
                        </div>
                      ) : (
                        <>
                          <div className="proyecto-header">
                            <h3 className="proyecto-titulo">{proyecto.titulo}</h3>
                            <span className="proyecto-fecha">{proyecto.fecha}</span>
                          </div>
                          <p className="proyecto-descripcion">{proyecto.descripcion}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'resenas' && (
              <div className="card">
                <h2 className="card-title">
                  Reseñas ({currentPerfil.resenas})
                </h2>
                <div className="resenas-list">
                  {currentPerfil.resenas_lista.map((resena, index) => (
                    <div key={index} className="resena-item">
                      <div className="resena-content">
                        <div className="resena-avatar">
                          {resena.nombre.charAt(0)}
                        </div>
                        <div className="resena-info">
                          <div className="resena-header">
                            <div>
                              <h4 className="resena-nombre">{resena.nombre}</h4>
                              <p className="resena-fecha">{resena.fecha}</p>
                            </div>
                            {renderStars(resena.calificacion)}
                          </div>
                          <p className="resena-comentario">{resena.comentario}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="sidebar-content">
            <div className="card sidebar-card">
              <h3 className="card-title-small">Información de Contacto</h3>
              {isEditing ? (
                <div className="contacto-edit">
                  <div className="contacto-field">
                    <label className="contacto-label">
                      <Mail className="label-icon" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={currentPerfil.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className="input-contacto"
                      placeholder="Email"
                    />
                  </div>
                  <div className="contacto-field">
                    <label className="contacto-label">
                      <Phone className="label-icon" />
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={currentPerfil.telefono}
                      onChange={(e) => updateField('telefono', e.target.value)}
                      className="input-contacto"
                      placeholder="Teléfono"
                    />
                  </div>
                </div>
              ) : (
                <div className="contacto-info">
                  <div className="contacto-item">
                    <Mail className="contacto-icon" />
                    <span className="contacto-text">{currentPerfil.email}</span>
                  </div>
                  <div className="contacto-item">
                    <Phone className="contacto-icon" />
                    <span className="contacto-text">{currentPerfil.telefono}</span>
                  </div>
                </div>
              )}

              <hr className="divider" />

              <h3 className="card-title-small">Disponibilidad</h3>
              <div className="disponibilidad-info">
                <div className="status-indicator"></div>
                <span>Disponible para nuevos proyectos</span>
              </div>

              {!isEditing && (
                <button className="btn-mensaje">
                  Enviar Mensaje
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilContratante;