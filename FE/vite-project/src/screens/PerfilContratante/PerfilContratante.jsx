import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { professionalAPI, reviewAPI, authAPI } from '../../services/api'; 
import { Star, MapPin, Briefcase, Award, Clock, Mail, Phone, Calendar, Edit2, Save, X, Plus, Trash2, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotFound from '../NotFound/NotFound'; 
import { Alert, Spinner, Button } from 'react-bootstrap'; 
import './PerfilContratante.css';

const PerfilContratante = ({ editingMode = false, profileUserId }) => { 
  const { id } = useParams(); 
  
  const targetId = profileUserId || id;
  const navigate = useNavigate();
  const { user, updateProfile: updateAuthProfile } = useAuth();
  
  // ===============================================
  // HOOKS (TODOS ARRIBA)
  // ===============================================
  const [activeTab, setActiveTab] = useState('sobre-mi');
  const [isEditing, setIsEditing] = useState(editingMode);
  
  const [perfil, setPerfil] = useState(null); 
  const [perfilTemp, setPerfilTemp] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hooks para la lógica de edición de arrays
  const [nuevaHabilidad, setNuevaHabilidad] = useState('');
  const [nuevaCertificacion, setNuevaCertificacion] = useState('');
  const [mostrarInputHabilidad, setMostrarInputHabilidad] = useState(false);
  const [mostrarInputCertificacion, setMostrarInputCertificacion] = useState(false);
  // ===============================================

  const isMyProfile = user?.rol_id === 2 && user?.id === parseInt(targetId); 

  // ===============================================
  // UTILIDADES Y HANDLERS (DEFINIDOS AQUÍ PARA EL SCOPE)
  // ===============================================
  const updateField = (field, value) => {
    setPerfilTemp({ ...perfilTemp, [field]: value });
  };

  const handleTarifaChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setPerfilTemp({ ...perfilTemp, tarifa: value });
    }
  };

  const handleImageUpload = (e) => { // <--- FUNCIÓN CORREGIDA
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
    setPerfilTemp({ ...perfilTemp, experiencia: [...perfilTemp.experiencia, { puesto: "", periodo: "", descripcion: "" }] });
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

  const addHabilidad = () => {
    if (nuevaHabilidad.trim() && !perfilTemp.habilidades.includes(nuevaHabilidad.trim())) {
      setPerfilTemp({ ...perfilTemp, habilidades: [...perfilTemp.habilidades, nuevaHabilidad.trim()] });
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
      setPerfilTemp({ ...perfilTemp, certificaciones: [...perfilTemp.certificaciones, nuevaCertificacion.trim()] });
      setNuevaCertificacion('');
      setMostrarInputCertificacion(false);
    }
  };

  const deleteCertificacion = (index) => {
    const newCert = perfilTemp.certificaciones.filter((_, i) => i !== index);
    setPerfilTemp({ ...perfilTemp, certificaciones: newCert });
  };

  const addProyecto = () => {
    setPerfilTemp({ ...perfilTemp, proyectos: [...perfilTemp.proyectos, { titulo: "", descripcion: "", fecha: "" }] });
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
  // ===============================================

  useEffect(() => {
    // Si se usa en modo edición, forzar la pestaña de detalles
    if (editingMode) {
        setActiveTab('sobre-mi');
        setIsEditing(true);
    }
    
    // Si no hay targetId, no hacer fetch (ej: error 404)
    if (!targetId) {
        setLoading(false);
        setError('ID de perfil no especificado.');
        return;
    }

    const fetchData = async () => {
      try {
        const [profResponse, reviewResponse] = await Promise.all([
          professionalAPI.getById(targetId),
          reviewAPI.getByProfessional(targetId)
        ]);

        const profileData = profResponse.data;
        const reviewsData = reviewResponse.data.reviews || [];

        // Mapear BE data
        const mappedProfile = {
            id: profileData.usuario_id,
            perfil_id: profileData.perfil_id,
            nombre: `${profileData.nombre} ${profileData.apellido}`,
            titulo: profileData.titulo,
            ubicacion: profileData.ubicacion,
            foto: profileData.foto_perfil || `https://api.dicebear.com/7.x/initials/svg?seed=${profileData.nombre}+${profileData.apellido}`,
            calificacion: profileData.calificacion_promedio,
            resenas: profileData.total_resenas,
            verificado: profileData.verificado,
            miembro_desde: new Date(profileData.fecha_registro).getFullYear().toString(),
            tarifa: profileData.tarifa_por_hora,
            email: profileData.email,
            telefono: profileData.telefono,
            sobre_mi: profileData.descripcion,
            experiencia: profileData.experiencias || [],
            habilidades: (profileData.habilidades || []).map(h => h.nombre),
            certificaciones: (profileData.certificaciones || []).map(c => c.nombre),
            proyectos: profileData.proyectos || [],
        };

        setPerfil(mappedProfile);
        setPerfilTemp(mappedProfile);
        setReviews(reviewsData.map(r => ({
            nombre: `${r.calificador_nombre} ${r.calificador_apellido}`,
            fecha: new Date(r.createdAt).toLocaleDateString('es-ES'),
            calificacion: r.calificacion,
            comentario: r.comentario
        })));
        
      } catch (err) {
        console.error('Error fetching professional profile:', err);
        if (err && err.message && err.message.includes('404')) {
             setError('Perfil no encontrado');
        } else {
            setError(err.message || 'No se pudo cargar el perfil profesional.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [targetId, user, editingMode]); 

  // ... (Conditional returns for loading/error remain)
  if (loading) {
    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center">
            <Spinner animation="border" variant="primary" />
            <span className="visually-hidden">Cargando perfil...</span>
        </div>
    );
  }

  if (error || !perfil) {
    if (editingMode) {
        return <Alert variant="warning">Aún no tienes un perfil público completo. Completa los campos para publicarlo.</Alert>;
    }
    return <NotFound />;
  }

  // Lógica de edición
  const handleEdit = () => {
    if (isMyProfile) {
        setPerfilTemp({...perfil});
        setIsEditing(true);
    } else {
        alert('Solo puedes editar tu propio perfil.');
    }
  };

  const handleSave = async () => {
    if (!perfilTemp.nombre.trim() || !perfilTemp.titulo.trim() || !perfilTemp.ubicacion.trim()) {
      alert('Los campos Nombre, Título y Ubicación son obligatorios');
      return;
    }

    // Preparar datos para API
    const nombreCompleto = perfilTemp.nombre.trim();
    const partesNombre = nombreCompleto.split(/\s+/);
    const firstName = partesNombre[0];
    const lastName = partesNombre.length > 1 ? partesNombre.slice(1).join(' ') : '';
    
    const profileUpdates = {
        titulo: perfilTemp.titulo,
        descripcion: perfilTemp.sobre_mi,
        ubicacion: perfilTemp.ubicacion,
        tarifa_por_hora: parseFloat(perfilTemp.tarifa) || 0,
    };
    
    const userUpdates = {
        nombre: firstName,
        apellido: lastName,
        telefono: perfilTemp.telefono,
        foto_perfil: perfilTemp.foto 
    };

    try {
        await professionalAPI.updateProfile(profileUpdates); 
        await authAPI.updateProfile(userUpdates); 
        await updateAuthProfile(); 

        const updatedPerfil = { ...perfilTemp, nombre: nombreCompleto };
        setPerfil(updatedPerfil);
        setPerfilTemp(updatedPerfil);
        setIsEditing(false);

    } catch (apiError) {
        alert(`Error al guardar: ${apiError.message || apiError.data?.message || 'Error desconocido'}`);
    }
  };

  const handleCancel = () => {
    setPerfilTemp({...perfil});
    setIsEditing(false);
  };
  
  const handleContact = () => {
    if (!user) {
        navigate('/login', { state: { message: 'Inicia sesión para contactar a este profesional.' } });
        return;
    }
    
    const whatsappNumber = perfil.telefono ? perfil.telefono.replace(/\s|-/g, '') : '';
    if (whatsappNumber) {
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hola, estoy interesado en tus servicios de ${perfil.titulo} en TEKIT.`;
        window.open(whatsappUrl, '_blank');
    } else {
        alert('Este profesional no tiene un número de teléfono de contacto registrado.');
    }
  };

  const renderStars = (rating) => {
    const roundedRating = Math.round(rating || 0)
    return (
      <div className="d-flex align-items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`star-icon ${
              i < roundedRating
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
                        <span className="rating-number">{currentPerfil.calificacion ? currentPerfil.calificacion.toFixed(1) : '0.0'}</span>
                        <span className="rating-reviews">({currentPerfil.resenas || 0} reseñas)</span>
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
                      <Button
                        onClick={handleSave}
                        className="btn btn-save"
                      >
                        <Save className="btn-icon" />
                        Guardar
                      </Button>
                      <Button
                        onClick={handleCancel}
                        className="btn btn-cancel"
                      >
                        <X className="btn-icon" />
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="tarifa-display">
                        Desde ${currentPerfil.tarifa || '0.00'}
                      </div>
                      
                      {isMyProfile ? (
                        /* Lógica: Si es MI perfil, muestro el indicador */
                        <Alert variant="info" className="py-2 px-3 text-center" style={{ fontSize: '0.9rem' }}>
                            Este es tu perfil público.
                        </Alert>
                      ) : (
                        /* Lógica: Si NO es mi perfil, muestro Contactar */
                        <>
                            <Button className="btn btn-contact" onClick={handleContact}>
                                Contactar
                            </Button>
                        </>
                      )}
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
                {currentPerfil.sobre_mi.length === 0 && !isEditing && (
                    <p className="text-muted fst-italic">Este profesional aún no ha escrito una descripción.</p>
                )}
              </div>
            )}

            {activeTab === 'experiencia' && (
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Experiencia Laboral</h2>
                  {isEditing && (
                    <Button
                      onClick={addExperiencia}
                      className="btn-add"
                    >
                      <Plus className="btn-icon-small" />
                      Agregar
                    </Button>
                  )}
                </div>
                <div className="experiencia-list">
                  {currentPerfil.experiencia.length > 0 ? currentPerfil.experiencia.map((exp, index) => (
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
                              <Button
                                onClick={() => deleteExperiencia(index)}
                                className="btn-delete"
                              >
                                <Trash2 className="icon-delete" />
                              </Button>
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
                  )) : (
                    <p className="text-muted fst-italic text-center">Sin experiencia registrada.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'habilidades' && (
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Habilidades</h2>
                  {isEditing && (
                    <Button
                      onClick={() => setMostrarInputHabilidad(!mostrarInputHabilidad)}
                      className="btn-add"
                    >
                      <Plus className="btn-icon-small" />
                      Agregar
                    </Button>
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
                    <Button
                      onClick={addHabilidad}
                      className="btn-confirm"
                    >
                      <Plus className="btn-icon-small" />
                    </Button>
                    <Button
                      onClick={() => {
                        setMostrarInputHabilidad(false);
                        setNuevaHabilidad('');
                      }}
                      className="btn-cancel-add"
                    >
                      <X className="btn-icon-small" />
                    </Button>
                  </div>
                )}

                <div className="habilidades-grid">
                  {currentPerfil.habilidades.length > 0 ? currentPerfil.habilidades.map((habilidad, index) => (
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
                  )) : (
                    <p className="text-muted fst-italic w-100 text-center">Sin habilidades registradas.</p>
                  )}
                </div>

                <div className="certificaciones-section">
                  <div className="card-header">
                    <h3 className="section-subtitle">Certificaciones</h3>
                    {isEditing && (
                      <Button
                        onClick={() => setMostrarInputCertificacion(!mostrarInputCertificacion)}
                        className="btn-add"
                      >
                        <Plus className="btn-icon-small" />
                        Agregar
                      </Button>
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
                      <Button
                        onClick={addCertificacion}
                        className="btn-confirm"
                      >
                        <Plus className="btn-icon-small" />
                      </Button>
                      <Button
                        onClick={() => {
                          setMostrarInputCertificacion(false);
                          setNuevaCertificacion('');
                        }}
                        className="btn-cancel-add"
                      >
                        <X className="btn-icon-small" />
                      </Button>
                    </div>
                  )}

                  <ul className="certificaciones-list">
                    {currentPerfil.certificaciones.length > 0 ? currentPerfil.certificaciones.map((cert, index) => (
                      <li key={index} className="certificacion-item">
                        <div className="certificacion-content">
                          <Award className="certificacion-icon" />
                          {cert}
                        </div>
                        {isEditing && (
                          <Button
                            onClick={() => deleteCertificacion(index)}
                            className="btn-delete-cert"
                          >
                            <Trash2 className="icon-delete" />
                          </Button>
                        )}
                      </li>
                    )) : (
                        <p className="text-muted fst-italic">Sin certificaciones registradas.</p>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'proyectos' && (
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Proyectos Destacados</h2>
                  {isEditing && (
                    <Button
                      onClick={addProyecto}
                      className="btn-add"
                    >
                      <Plus className="btn-icon-small" />
                      Agregar
                    </Button>
                  )}
                </div>
                <div className="proyectos-list">
                  {currentPerfil.proyectos.length > 0 ? currentPerfil.proyectos.map((proyecto, index) => (
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
                            <Button
                              onClick={() => deleteProyecto(index)}
                              className="btn-delete"
                            >
                              <Trash2 className="icon-delete" />
                            </Button>
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
                  )) : (
                    <p className="text-muted fst-italic text-center">Sin proyectos destacados.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'resenas' && (
              <div className="card">
                <h2 className="card-title">
                  Reseñas ({reviews.length})
                </h2>
                <div className="resenas-list">
                  {reviews.length > 0 ? reviews.map((resena, index) => (
                    <div key={index} className="resena-item">
                      <div className="resena-content">
                        <div className="resena-avatar" style={{ background: 'linear-gradient(135deg, #351491 0%, #101728 100%)' }}>
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
                  )) : (
                    <p className="text-muted fst-italic text-center">Aún no hay reseñas para este profesional.</p>
                  )}
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
                      disabled 
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

              {!isEditing && !isMyProfile && (
                <Button className="btn-mensaje" onClick={handleContact}>
                  Enviar Mensaje
                </Button>
              )}
               {!isEditing && isMyProfile && (
                <Alert variant="info" className="mt-3 text-center">
                    Gestiona tus datos en la pestaña "Mi Cuenta".
                </Alert>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilContratante;