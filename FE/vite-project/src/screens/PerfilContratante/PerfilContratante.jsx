import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { professionalAPI, reviewAPI, authAPI, categoryAPI, locationAPI, serviceAPI, contactAPI, bookingAPI } from '../../services/api'; 
import { Star, MapPin, Briefcase, Award, Clock, Mail, Phone, Calendar, Edit2, Save, X, Plus, Trash2, Camera, DollarSign, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotFound from '../NotFound/NotFound'; 
import { Alert, Spinner, Button, Form, Badge, Card, Modal, Toast, ToastContainer } from 'react-bootstrap'; 
import './PerfilContratante.css';

const PerfilContratante = ({ editingMode = false, profileUserId }) => { 
  const { id } = useParams(); 
  const targetId = profileUserId || id;
  const navigate = useNavigate();
  const { user, updateProfile: updateAuthProfile } = useAuth();
  
  // --- ESTADOS ---
  const [activeTab, setActiveTab] = useState(editingMode ? 'sobre-mi' : 'servicios');
  const [isEditing, setIsEditing] = useState(editingMode);
  
  const [perfil, setPerfil] = useState(null); 
  const [perfilTemp, setPerfilTemp] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [services, setServices] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [categoriesList, setCategoriesList] = useState([]);
  const [locationsList, setLocationsList] = useState([]);

  // Modal Solicitud
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null); 
  const [requestDetails, setRequestDetails] = useState(''); 

  // Toasts
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

  // Inputs Arrays
  const [nuevaHabilidad, setNuevaHabilidad] = useState('');
  const [nuevaCertificacion, setNuevaCertificacion] = useState('');
  const [mostrarInputHabilidad, setMostrarInputHabilidad] = useState(false);
  const [mostrarInputCertificacion, setMostrarInputCertificacion] = useState(false);

  const isMyProfile = user?.rol_id === 2 && user?.id === parseInt(targetId); 

  // --- HANDLERS ---
  const updateField = (field, value) => { setPerfilTemp({ ...perfilTemp, [field]: value }); };
  
  const handleTarifaChange = (e) => { 
    const value = e.target.value.replace(/[^0-9.]/g, ''); 
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) setPerfilTemp({ ...perfilTemp, tarifa: value }); 
  };
  
  const handleImageUpload = (e) => { 
    const file = e.target.files[0]; 
    if (file) { 
      const reader = new FileReader(); 
      reader.onloadend = () => { updateField('foto', reader.result); }; 
      reader.readAsDataURL(file); 
    } 
  };

  // Arrays
  const addExperiencia = () => { setPerfilTemp({ ...perfilTemp, experiencia: [...perfilTemp.experiencia, { puesto: "", periodo: "", descripcion: "" }] }); };
  const updateExperiencia = (index, field, value) => { const newExp = [...perfilTemp.experiencia]; newExp[index][field] = value; setPerfilTemp({ ...perfilTemp, experiencia: newExp }); };
  const deleteExperiencia = (index) => { const newExp = perfilTemp.experiencia.filter((_, i) => i !== index); setPerfilTemp({ ...perfilTemp, experiencia: newExp }); };
  
  const addHabilidad = () => { if (nuevaHabilidad.trim() && !perfilTemp.habilidades.includes(nuevaHabilidad.trim())) { setPerfilTemp({ ...perfilTemp, habilidades: [...perfilTemp.habilidades, nuevaHabilidad.trim()] }); setNuevaHabilidad(''); setMostrarInputHabilidad(false); } };
  const deleteHabilidad = (index) => { const newHab = perfilTemp.habilidades.filter((_, i) => i !== index); setPerfilTemp({ ...perfilTemp, habilidades: newHab }); };
  
  const addCertificacion = () => { if (nuevaCertificacion.trim()) { setPerfilTemp({ ...perfilTemp, certificaciones: [...perfilTemp.certificaciones, nuevaCertificacion.trim()] }); setNuevaCertificacion(''); setMostrarInputCertificacion(false); } };
  const deleteCertificacion = (index) => { const newCert = perfilTemp.certificaciones.filter((_, i) => i !== index); setPerfilTemp({ ...perfilTemp, certificaciones: newCert }); };
  
  const addProyecto = () => { setPerfilTemp({ ...perfilTemp, proyectos: [...perfilTemp.proyectos, { titulo: "", fecha: "", descripcion: "" }] }); };
  const updateProyecto = (index, field, value) => { const newProj = [...perfilTemp.proyectos]; newProj[index][field] = value; setPerfilTemp({ ...perfilTemp, proyectos: newProj }); };
  const deleteProyecto = (index) => { const newProj = perfilTemp.proyectos.filter((_, i) => i !== index); setPerfilTemp({ ...perfilTemp, proyectos: newProj }); };

  // --- LÓGICA WHATSAPP CORREGIDA ---
  
  // Función auxiliar para formatear el número
  const formatForWhatsApp = (phone) => {
    if (!phone) return '';
    // 1. Quitar todo lo que no sea número (espacios, guiones, paréntesis, +)
    let cleaned = phone.replace(/\D/g, '');
    
    // 2. Si el número tiene 8 dígitos (formato local SV), agregarle 503
    if (cleaned.length === 8) {
        return `503${cleaned}`;
    }
    
    // 3. Si ya empieza con 503 (11 dígitos), dejarlo así.
    // O si es otro número internacional, asumimos que está bien.
    return cleaned;
  };

  const handleOpenRequest = (service = null) => {
    if (!user) { navigate('/login', { state: { message: 'Inicia sesión para solicitar un servicio.' } }); return; }
    setSelectedService(service); setRequestDetails(''); setShowRequestModal(true);
  };

  const handleSubmitRequest = async () => {
    if (!requestDetails.trim()) { alert("Por favor, describe brevemente qué necesitas."); return; }
    try {
        await bookingAPI.create({ 
            profesional_id: perfil.perfil_id, 
            servicio_id: selectedService ? selectedService.id : null, 
            titulo_trabajo: selectedService ? selectedService.titulo : `Contacto General: ${perfil.titulo}`, 
            monto_acordado: selectedService ? selectedService.precio : 0, 
            detalles: requestDetails 
        });
        await contactAPI.register({ profesional_id: perfil.perfil_id });
        
        // USAMOS LA FUNCIÓN DE FORMATEO AQUÍ
        const whatsappNumber = formatForWhatsApp(perfil.telefono);
        
        if (whatsappNumber) {
            let message = `👋 Hola ${perfil.nombre}, te contacto desde TEKIT.\n\n`;
            if (selectedService) {
                message += `📌 *Servicio:* ${selectedService.titulo}\n💰 *Precio:* $${selectedService.precio}\n`;
            } else {
                message += `📌 *Motivo:* Consulta general\n`;
            }
            message += `📝 *Detalle:* ${requestDetails}`;
            
            window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
        } else {
            alert('Solicitud guardada, pero el profesional no tiene un número válido registrado.');
        }
        
        setShowRequestModal(false);
        setToastMessage('Solicitud enviada con éxito'); setToastVariant('success'); setShowToast(true);
    } catch (err) {
        console.error(err); setToastMessage('Error al enviar solicitud'); setToastVariant('danger'); setShowToast(true);
    }
  };

  const handleEdit = () => { if (isMyProfile) { setPerfilTemp({...perfil}); setIsEditing(true); } };

  const handleSave = async () => {
    if (!perfilTemp.titulo || !perfilTemp.ubicacion) {
        setToastMessage('Categoría y Ubicación son obligatorios'); setToastVariant('warning'); setShowToast(true); return;
    }
  
    const nombreCompleto = perfilTemp.nombre.trim();
    const primerEspacio = nombreCompleto.indexOf(' ');
    let nombreUser = nombreCompleto;
    let apellidoUser = '';
    if (primerEspacio !== -1) { nombreUser = nombreCompleto.substring(0, primerEspacio); apellidoUser = nombreCompleto.substring(primerEspacio + 1); }
  
    const profileUpdates = {
        titulo: perfilTemp.titulo,
        descripcion: perfilTemp.sobre_mi,
        ubicacion: perfilTemp.ubicacion,
        tarifa_por_hora: parseFloat(perfilTemp.tarifa) || 0,
        experiencias: perfilTemp.experiencia,
        habilidades: perfilTemp.habilidades,
        certificaciones: perfilTemp.certificaciones,
        proyectos: perfilTemp.proyectos
    };
    
    const userUpdates = {
        nombre: nombreUser,
        apellido: apellidoUser,
        telefono: perfilTemp.telefono, 
        foto_perfil: perfilTemp.foto 
    };
  
    try {
        await professionalAPI.updateProfile(profileUpdates); 
        await updateAuthProfile(userUpdates); 
        setPerfil(perfilTemp);
        setIsEditing(false);
        setToastMessage('Perfil actualizado correctamente'); setToastVariant('success'); setShowToast(true);
    } catch (apiError) {
        console.error("Error:", apiError);
        setToastMessage('Error al guardar cambios'); setToastVariant('danger'); setShowToast(true);
    }
  };
  
  const handleCancel = () => { setPerfilTemp({...perfil}); setIsEditing(false); };

  // --- EFECTOS ---
  useEffect(() => {
    if (editingMode) { setActiveTab('sobre-mi'); setIsEditing(true); }
    if (!targetId) { setLoading(false); return; }

    const fetchData = async () => {
      try {
        const [profResponse, reviewResponse, catResponse, locResponse, serviceResponse] = await Promise.all([
          professionalAPI.getById(targetId), reviewAPI.getByProfessional(targetId), categoryAPI.getAll(), locationAPI.getAll(), serviceAPI.getByProfessional(targetId)
        ]);
        setCategoriesList(catResponse.data || []); setLocationsList(locResponse.data || []); setServices(serviceResponse.data || []);
        const pData = profResponse.data;
        const mapped = {
            id: pData.usuario_id, perfil_id: pData.perfil_id, nombre: `${pData.nombre} ${pData.apellido}`, titulo: pData.titulo, ubicacion: pData.ubicacion, foto: pData.foto_perfil || `https://api.dicebear.com/7.x/initials/svg?seed=${pData.nombre}`, calificacion: pData.calificacion_promedio, resenas: pData.total_resenas, verificado: pData.verificado, miembro_desde: new Date(pData.fecha_registro).getFullYear().toString(), tarifa: pData.tarifa_por_hora, email: pData.email, telefono: pData.telefono, sobre_mi: pData.descripcion, experiencia: pData.experiencias || [], habilidades: (pData.habilidades || []).map(h => h.nombre), certificaciones: (pData.certificaciones || []).map(c => c.nombre), proyectos: pData.proyectos || []
        };
        setPerfil(mapped); setPerfilTemp(mapped); setReviews(reviewResponse.data.reviews || []);
      } catch (err) {
        if (err.response?.status === 404) setError('Perfil no encontrado'); else setError('Error de conexión');
      } finally { setLoading(false); }
    };
    fetchData();
  }, [targetId, user, editingMode]); 

  const renderStars = (rating) => (<div className="d-flex align-items-center gap-1">{[...Array(5)].map((_, i) => (<Star key={i} size={14} className={i < Math.round(rating||0) ? 'text-warning fill-warning' : 'text-muted'} fill={i < Math.round(rating||0) ? 'currentColor' : 'none'} />))}</div>);

  if (loading) return <div className="min-vh-100 d-flex align-items-center justify-content-center"><Spinner animation="border" variant="primary" /></div>;
  if (error || !perfil) return editingMode ? <Alert variant="warning">Completa tu perfil.</Alert> : <NotFound />;

  const currentPerfil = isEditing ? perfilTemp : perfil;

  return (
    <div className="perfil-contratante position-relative">
        {/* TOAST CONTAINER */}
        <ToastContainer position="top-end" className="p-3" style={{zIndex: 9999, position:'fixed', top:'80px', right:'20px'}}>
            <Toast onClose={()=>setShowToast(false)} show={showToast} delay={3000} autohide bg={toastVariant}>
                <Toast.Header><strong className="me-auto">Notificación</strong></Toast.Header>
                <Toast.Body className="text-white">{toastMessage}</Toast.Body>
            </Toast>
        </ToastContainer>

      <div className="perfil-header">
        <div className="header-gradient"></div>
        <div className="container">
          <div className="perfil-info-container">
            <div className="avatar-section">
              <div className="avatar-wrapper">
                <img src={currentPerfil.foto} alt={currentPerfil.nombre} className="avatar-image" />
                {isEditing && (<label className="avatar-edit-button"><Camera className="camera-icon" /><input type="file" accept="image/*" onChange={handleImageUpload} className="file-input-hidden" /></label>)}
              </div>
            </div>
            <div className="info-section">
              <div className="info-content">
                <div className="info-main">
                  {isEditing ? (
                    <div className="edit-fields">
                      <input type="text" value={currentPerfil.nombre} className="input-nombre" disabled />
                      <Form.Select value={currentPerfil.titulo} onChange={(e) => updateField('titulo', e.target.value)} className="input-titulo mb-2"><option value="">Categoría...</option>{categoriesList.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}</Form.Select>
                      <Form.Select value={currentPerfil.ubicacion} onChange={(e) => updateField('ubicacion', e.target.value)} className="input-ubicacion"><option value="">Ubicación...</option>{locationsList.map(l => <option key={l.id} value={l.nombre}>{l.nombre}</option>)}</Form.Select>
                    </div>
                  ) : (
                    <>
                      <div className="nombre-container"><h1 className="nombre">{currentPerfil.nombre}</h1>{currentPerfil.verificado && <Award className="badge-verificado" />}</div>
                      <p className="titulo">{currentPerfil.titulo}</p>
                      <div className="metadata"><span className="metadata-item"><MapPin size={14}/> {currentPerfil.ubicacion}</span><span className="metadata-item"><Calendar size={14}/> Desde {currentPerfil.miembro_desde}</span></div>
                      <div className="rating-container">{renderStars(currentPerfil.calificacion)}<span className="rating-number">{Number(currentPerfil.calificacion).toFixed(1)}</span><span>({currentPerfil.resenas} reseñas)</span></div>
                    </>
                  )}
                </div>
                <div className="info-actions">
                  {isEditing ? (
                    <div className="edit-actions">
                        <div className="tarifa-input-container"><span className="tarifa-symbol">$</span><input type="text" value={currentPerfil.tarifa} onChange={handleTarifaChange} className="input-tarifa" placeholder="0.00" /></div>
                        <Button onClick={handleSave} className="btn-save"><Save size={16}/> Guardar</Button>
                        <Button onClick={handleCancel} variant="outline-secondary"><X size={16}/> Cancelar</Button>
                    </div>
                  ) : (
                    <div className="d-flex flex-column align-items-end">
                        <div className="tarifa-display">Desde ${currentPerfil.tarifa}/hr</div>
                        {!isMyProfile && <Button className="btn-contact" onClick={() => handleOpenRequest(null)}>Contactar</Button>}
                    </div>
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
            {[{id:'servicios',l:'Servicios'},{id:'sobre-mi',l:'Sobre mí'},{id:'experiencia',l:'Experiencia'},{id:'habilidades',l:'Habilidades'},{id:'proyectos',l:'Proyectos'},{id:'resenas',l:'Reseñas'}].map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)} className={`tab-button ${activeTab === t.id ? 'tab-active' : ''}`}>{t.l}</button>
            ))}
          </nav>
        </div>
      </div>

      <div className="container content-container">
        <div className="content-grid">
          <div className="main-content">
            {activeTab === 'servicios' && (
                <div className="vstack gap-3">
                    {services.length > 0 ? services.map(s => (
                        <Card key={s.id} className="border-0 shadow-sm service-card-public">
                            <Card.Body className="d-flex justify-content-between">
                                <div>
                                    <h5 className="fw-bold mb-1">{s.titulo}</h5>
                                    <Badge bg="light" text="dark" className="mb-2">{s.categoria_nombre}</Badge>
                                    <p className="text-muted small mb-2">{s.descripcion}</p>
                                    <div className="fw-bold text-primary">${s.precio} <span className="fw-normal text-muted small">{s.tipo_precio === 'por_hora' ? '/hr' : 'fijo'}</span></div>
                                </div>
                                {!isEditing && !isMyProfile && <Button variant="success" size="sm" className="align-self-start" onClick={() => handleOpenRequest(s)}><MessageCircle size={16} className="me-1"/> Me interesa</Button>}
                            </Card.Body>
                        </Card>
                    )) : <div className="text-center py-5 text-muted">Sin servicios publicados.</div>}
                </div>
            )}

            {activeTab === 'sobre-mi' && (
              <Card className="border-0 shadow-sm p-4">
                <h5 className="fw-bold mb-3">Sobre mí</h5>
                {isEditing ? <Form.Control as="textarea" rows={5} value={currentPerfil.sobre_mi} onChange={(e)=>updateField('sobre_mi', e.target.value)} /> : <p>{currentPerfil.sobre_mi || 'Sin descripción.'}</p>}
              </Card>
            )}

            {activeTab === 'experiencia' && (
              <Card className="border-0 shadow-sm p-4">
                <div className="d-flex justify-content-between mb-3"><h5 className="fw-bold">Experiencia</h5>{isEditing && <Button size="sm" onClick={addExperiencia}><Plus size={16}/> Agregar</Button>}</div>
                {currentPerfil.experiencia.map((exp, i) => (
                    <div key={i} className="mb-4 border-bottom pb-3 last-no-border">
                        {isEditing ? (
                            <div className="vstack gap-2">
                                <Form.Control placeholder="Puesto / Rol" value={exp.puesto} onChange={(e)=>updateExperiencia(i,'puesto',e.target.value)} className="fw-bold"/>
                                <Form.Control placeholder="Periodo (Ej: 2020-2022)" value={exp.periodo} onChange={(e)=>updateExperiencia(i,'periodo',e.target.value)}/>
                                <Form.Control as="textarea" placeholder="Descripción..." value={exp.descripcion} onChange={(e)=>updateExperiencia(i,'descripcion',e.target.value)}/>
                                <Button variant="outline-danger" size="sm" onClick={()=>deleteExperiencia(i)}>Eliminar</Button>
                            </div>
                        ) : (
                            <>
                                <h6 className="fw-bold mb-1">{exp.puesto}</h6>
                                <div className="text-muted small mb-2"><Clock size={14}/> {exp.periodo}</div>
                                <p className="mb-0 small">{exp.descripcion}</p>
                            </>
                        )}
                    </div>
                ))}
              </Card>
            )}

            {activeTab === 'habilidades' && (
              <Card className="border-0 shadow-sm p-4">
                <div className="d-flex justify-content-between mb-3"><h5 className="fw-bold">Habilidades</h5>{isEditing && <Button size="sm" onClick={()=>setMostrarInputHabilidad(!mostrarInputHabilidad)}><Plus size={16}/></Button>}</div>
                {isEditing && mostrarInputHabilidad && <div className="d-flex gap-2 mb-3"><Form.Control placeholder="Nueva habilidad" value={nuevaHabilidad} onChange={(e)=>setNuevaHabilidad(e.target.value)} /><Button onClick={addHabilidad}>OK</Button></div>}
                <div className="d-flex flex-wrap gap-2 mb-4">
                    {currentPerfil.habilidades.map((h,i) => (
                        <Badge key={i} bg="light" text="dark" className="p-2 border d-flex align-items-center gap-2">
                            {h} {isEditing && <X size={14} style={{cursor:'pointer'}} onClick={()=>deleteHabilidad(i)}/>}
                        </Badge>
                    ))}
                </div>
                <div className="d-flex justify-content-between mb-3"><h5 className="fw-bold">Certificaciones</h5>{isEditing && <Button size="sm" onClick={()=>setMostrarInputCertificacion(!mostrarInputCertificacion)}><Plus size={16}/></Button>}</div>
                {isEditing && mostrarInputCertificacion && <div className="d-flex gap-2 mb-3"><Form.Control placeholder="Nueva certificación" value={nuevaCertificacion} onChange={(e)=>setNuevaCertificacion(e.target.value)} /><Button onClick={addCertificacion}>OK</Button></div>}
                <ul className="list-unstyled">
                    {currentPerfil.certificaciones.map((c,i) => (
                        <li key={i} className="mb-2 d-flex align-items-center gap-2"><Award size={16} className="text-primary"/> {c} {isEditing && <Button variant="link" size="sm" className="text-danger p-0" onClick={()=>deleteCertificacion(i)}><X size={16}/></Button>}</li>
                    ))}
                </ul>
              </Card>
            )}

            {/* PROYECTOS (CON 3 CAMPOS) */}
            {activeTab === 'proyectos' && (
              <Card className="border-0 shadow-sm p-4">
                <div className="d-flex justify-content-between mb-3"><h5 className="fw-bold">Proyectos Destacados</h5>{isEditing && <Button size="sm" onClick={addProyecto}><Plus size={16}/> Agregar</Button>}</div>
                {currentPerfil.proyectos.map((p, i) => (
                    <div key={i} className="mb-4 border rounded p-3 bg-light">
                        {isEditing ? (
                            <div className="vstack gap-2">
                                <Form.Control placeholder="Título del proyecto" className="fw-bold" value={p.titulo} onChange={(e)=>updateProyecto(i,'titulo',e.target.value)}/>
                                <Form.Control placeholder="Año (Ej: 2023)" value={p.fecha} onChange={(e)=>updateProyecto(i,'fecha',e.target.value)}/>
                                <Form.Control as="textarea" placeholder="Descripción detallada del proyecto..." value={p.descripcion} onChange={(e)=>updateProyecto(i,'descripcion',e.target.value)}/>
                                <Button variant="outline-danger" size="sm" onClick={()=>deleteProyecto(i)}>Eliminar Proyecto</Button>
                            </div>
                        ) : (
                            <>
                                <div className="d-flex justify-content-between"><h6 className="fw-bold">{p.titulo}</h6><span className="text-muted small">{p.fecha}</span></div>
                                <p className="mb-0 small">{p.descripcion}</p>
                            </>
                        )}
                    </div>
                ))}
              </Card>
            )}

            {activeTab === 'resenas' && (
                <Card className="border-0 shadow-sm p-4">
                    <h5 className="fw-bold mb-4">Reseñas ({reviews.length})</h5>
                    {reviews.length > 0 ? reviews.map((r, i) => (
                        <div key={i} className="mb-3 border-bottom pb-3">
                            <div className="d-flex justify-content-between">
                                <h6 className="fw-bold mb-0">{r.calificador_nombre} {r.calificador_apellido}</h6>
                                <span className="text-muted small">{r.fecha}</span>
                            </div>
                            {renderStars(r.calificacion)}
                            <p className="mt-2 mb-0 small">{r.comentario}</p>
                        </div>
                    )) : <p className="text-muted">Aún no hay reseñas.</p>}
                </Card>
            )}
          </div>

          <div className="sidebar-content">
            <div className="card sidebar-card">
              <h3 className="card-title-small">Información de Contacto</h3>
              <div className="contacto-info">
                <div className="contacto-item"><Mail className="contacto-icon" /><span className="contacto-text">{currentPerfil.email}</span></div>
                <div className="contacto-item">
                    <Phone className="contacto-icon" />
                    {isEditing ? (
                        <Form.Control 
                            type="tel" 
                            value={currentPerfil.telefono || ''} 
                            onChange={(e) => updateField('telefono', e.target.value)}
                            placeholder="Ej: 7123-4567"
                            className="py-1 px-2"
                            style={{ fontSize: '0.9rem' }}
                        />
                    ) : (
                        <span className="contacto-text">{currentPerfil.telefono || 'Sin teléfono'}</span>
                    )}
                </div>
              </div>
              <hr className="divider" />
              <h3 className="card-title-small">Disponibilidad</h3>
              <div className="disponibilidad-info"><div className="status-indicator"></div><span>Disponible para nuevos proyectos</span></div>
              {!isEditing && !isMyProfile && (<Button className="btn-mensaje" onClick={() => handleOpenRequest(null)}>Solicitar / Contactar</Button>)}
              
              {/* AVISO PERFIL PROPIO RESTAURADO */}
              {!isEditing && isMyProfile && (<Alert variant="info" className="mt-3 text-center small">Este es tu perfil público.</Alert>)}
            
            </div>
          </div>
        </div>
      </div>

      <Modal show={showRequestModal} onHide={()=>setShowRequestModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>{selectedService ? `Solicitar: ${selectedService.titulo}` : `Contactar a ${perfil?.nombre}`}</Modal.Title></Modal.Header>
        <Modal.Body><Form><Form.Group className="mb-3"><Form.Label>¿Qué necesitas?</Form.Label><Form.Control as="textarea" rows={4} placeholder="Detalles..." value={requestDetails} onChange={(e)=>setRequestDetails(e.target.value)} autoFocus/></Form.Group></Form></Modal.Body>
        <Modal.Footer><Button variant="secondary" onClick={()=>setShowRequestModal(false)}>Cancelar</Button><Button variant="success" onClick={handleSubmitRequest}><MessageCircle size={18} className="me-2" />Enviar a WhatsApp</Button></Modal.Footer>
      </Modal>
    </div>
  );
};

export default PerfilContratante;