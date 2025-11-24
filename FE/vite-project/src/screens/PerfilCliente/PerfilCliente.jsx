import React, { useState, useEffect } from 'react';
import { Star, MapPin, Calendar, Edit2, Save, X, Camera, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authAPI, bookingAPI, reviewAPI } from '../../services/api'; 
import { Spinner, Button, Modal, Form } from 'react-bootstrap'; 

const PerfilCliente = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    ubicacion: 'El Salvador',
    foto_perfil: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
            setFormData({
                nombre: user.nombre,
                apellido: user.apellido,
                ubicacion: 'El Salvador', 
                foto_perfil: user.foto_perfil
            });

            const history = await bookingAPI.getMyBookings();
            setBookings(history.data || []);
        }
      } catch (error) {
        console.error("Error cargando perfil:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleSave = async () => {
    try {
        await authAPI.updateProfile({
            foto_perfil: formData.foto_perfil
        });
        await updateProfile({ ...user, foto_perfil: formData.foto_perfil });
        setIsEditing(false);
    } catch (error) {
        alert("Error al actualizar perfil");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, foto_perfil: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenReview = (booking) => {
    setSelectedBooking(booking);
    setReviewForm({ rating: 5, comment: '' });
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedBooking) return;

    try {
        await reviewAPI.create({
            calificado_id: selectedBooking.profesional_usuario_id, 
            calificacion: reviewForm.rating,
            comentario: reviewForm.comment,
            contratacion_id: selectedBooking.id 
        });
        

        setBookings(prevBookings => 
            prevBookings.map(booking => 
                booking.id === selectedBooking.id 
                    ? { ...booking, calificacion: reviewForm.rating } 
                    : booking
            )
        );

        setShowReviewModal(false);
        
    } catch (error) {
        console.error(error);
        alert('Error al enviar la reseña.');
    }
  };

  
  const renderStars = (rating) => (
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

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f9fafb' }}>
      <div className="container py-4">
        {/* Header Card */}
        <div className="card border-0 shadow-sm mb-4">
          <div style={{ height: '128px', background: 'linear-gradient(135deg, #351491 0%, #101728 100%)' }}></div>
          <div className="card-body px-4 pb-4">
            <div className="row g-4" style={{ marginTop: '-64px' }}>
              <div className="col-auto">
                <div className="position-relative">
                  {formData.foto_perfil ? (
                    <img src={formData.foto_perfil} alt="Perfil" className="rounded-circle border border-4 border-white shadow-lg bg-white" style={{ width: '128px', height: '128px', objectFit: 'cover' }} />
                  ) : (
                    <div className="rounded-circle border border-4 border-white shadow-lg d-flex align-items-center justify-content-center text-white fw-bold" style={{ width: '128px', height: '128px', background: '#351491', fontSize: '3rem' }}>
                      {formData.nombre?.charAt(0)}{formData.apellido?.charAt(0)}
                    </div>
                  )}
                  {isEditing && (
                    <label className="position-absolute bottom-0 end-0 btn btn-primary rounded-circle p-2 shadow-lg" style={{ cursor: 'pointer' }}>
                      <Camera size={20} />
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="d-none" />
                    </label>
                  )}
                </div>
              </div>

              <div className="col pt-5">
                <div className="d-flex flex-column flex-sm-row justify-content-between">
                  <div className="flex-grow-1">
                    {isEditing ? (
                      <div className="d-flex gap-2 mb-2">
                        <input type="text" className="form-control fw-bold" value={formData.nombre} disabled placeholder="Nombre" />
                        <input type="text" className="form-control fw-bold" value={formData.apellido} disabled placeholder="Apellido" />
                      </div>
                    ) : (
                      <>
                        <h1 className="h2 fw-bold text-dark mb-1">{formData.nombre} {formData.apellido}</h1>
                        <p className="text-muted mb-2">Cliente</p>
                      </>
                    )}
                    <div className="d-flex align-items-center gap-3 text-muted small mb-2">
                        <div className="d-flex align-items-center gap-1">
                            <MapPin size={16} /> {formData.ubicacion}
                        </div>
                    </div>
                  </div>

                  <div className="mt-3 mt-sm-0">
                    {isEditing ? (
                      <div className="d-flex flex-column gap-2">
                        <button onClick={handleSave} className="btn btn-success d-flex align-items-center gap-2"><Save size={16} /> Guardar</button>
                        <button onClick={() => setIsEditing(false)} className="btn btn-secondary d-flex align-items-center gap-2"><X size={16} /> Cancelar</button>
                      </div>
                    ) : (
                      <button onClick={() => setIsEditing(true)} className="btn btn-primary d-flex align-items-center gap-2"><Edit2 size={16} /> Editar Perfil</button>
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
                  <h2 className="h5 fw-bold mb-0">Historial de Servicios</h2>
                </div>
                
                {bookings.length > 0 ? (
                    <div className="vstack gap-3">
                    {bookings.map((item) => (
                        <div key={item.id} className="border rounded p-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <h3 className="h6 fw-bold mb-1">{item.servicio}</h3>
                                <p className="text-muted small mb-0">Profesional: {item.profesional_nombre}</p>
                            </div>
                            <span className={`badge ${item.estado === 'completado' ? 'bg-success' : 'bg-warning'} d-flex align-items-center gap-1`}>
                                {item.estado === 'completado' ? <CheckCircle size={12}/> : <Clock size={12}/>} {item.estado}
                            </span>
                        </div>
                        
                        <div className="d-flex align-items-center justify-content-between mt-3 pt-2 border-top">
                            <div className="d-flex gap-3 text-muted small">
                                <span><Calendar size={14}/> {new Date(item.fecha).toLocaleDateString()}</span>
                                <span className="fw-bold text-primary">${item.monto}</span>
                            </div>
                            
                            {/* LÓGICA DE VISUALIZACIÓN DE ESTRELLAS / BOTÓN */}
                            {item.estado === 'completado' && (
                                item.calificacion ? (
                                    /* SI YA TIENE CALIFICACIÓN -> MOSTRAR ESTRELLAS */
                                    <div className="d-flex align-items-center gap-2" title="Tu calificación">
                                        <span className="text-muted small">Calificado:</span>
                                        {renderStars(item.calificacion)}
                                    </div>
                                ) : (
                                    /* SI NO TIENE CALIFICACIÓN -> MOSTRAR BOTÓN */
                                    <Button variant="outline-warning" size="sm" onClick={() => handleOpenReview(item)}>
                                        <Star size={14} className="me-1"/> Calificar
                                    </Button>
                                )
                            )}
                        </div>
                        </div>
                    ))}
                    </div>
                ) : (
                    <div className="text-center py-4 text-muted">
                        <AlertCircle size={48} className="mb-2 opacity-50" />
                        <p>Aún no has contratado servicios.</p>
                    </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h3 className="h5 fw-bold mb-4">Estadísticas</h3>
                <div className="p-3 rounded mb-3" style={{ backgroundColor: '#eef2ff' }}>
                    <div className="h3 fw-bold mb-0" style={{ color: '#312e81' }}>{bookings.length}</div>
                    <div className="text-muted small">Servicios Contratados</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE RESEÑA */}
      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} centered>
        <Modal.Header closeButton>
            <Modal.Title>Calificar Servicio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="text-center mb-4">
                <p className="mb-2">¿Qué te pareció el servicio de <strong>{selectedBooking?.profesional_nombre}</strong>?</p>
                <div className="d-flex justify-content-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                            key={star} 
                            size={32} 
                            className={star <= reviewForm.rating ? 'text-warning' : 'text-muted'} 
                            fill={star <= reviewForm.rating ? 'currentColor' : 'none'}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setReviewForm({...reviewForm, rating: star})}
                        />
                    ))}
                </div>
            </div>
            <Form.Group>
                <Form.Label>Comentario</Form.Label>
                <Form.Control 
                    as="textarea" 
                    rows={3} 
                    placeholder="Cuéntanos tu experiencia..."
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowReviewModal(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleSubmitReview}>Enviar Reseña</Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default PerfilCliente;