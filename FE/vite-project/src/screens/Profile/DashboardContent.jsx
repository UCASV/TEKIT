import { Row, Col, Card, Button, Spinner, Alert, Badge, Table } from 'react-bootstrap';
import { Briefcase, Clock, DollarSign, MessageSquare, Trash2, Plus, CheckCircle, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { serviceAPI, contactAPI, bookingAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

function DashboardContent() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [stats, setStats] = useState(null)
  const [services, setServices] = useState([]) 
  const [requests, setRequests] = useState([]) 
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const isProfessional = user?.rol_id === 2;

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [servicesRes, contactRes, requestsRes] = await Promise.all([
          serviceAPI.getMyServices(),
          contactAPI.getStats(), // Ahora trae datos de Contrataciones
          bookingAPI.getProfessionalRequests()
      ]);

      const myServices = servicesRes.data || [];
      const statsData = contactRes.data || {}; // Nuevos datos del backend
      const myRequests = requestsRes.data || [];

      setServices(myServices);
      setRequests(myRequests);

      setStats({
        activeServices: myServices.filter(s => s.activo).length,
        // Mapeamos los nuevos campos del backend
        totalSolicitudes: statsData.total_solicitudes || 0,
        weeklySolicitudes: statsData.solicitudes_semana || 0,
        // Formateamos el dinero real de trabajos completados
        monthlyEarnings: '$' + (statsData.ganancias_mes || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })
      });

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Error al cargar los datos del dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isProfessional) {
        fetchData();
    }
  }, [user]);

  const handleDeleteService = async (serviceId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
        try {
            await serviceAPI.delete(serviceId);
            fetchData();
        } catch (err) {
            alert('Error al eliminar el servicio');
        }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
        await bookingAPI.updateStatus(id, newStatus);
        fetchData(); 
    } catch (error) {
        alert("Error al actualizar estado");
    }
  };

  if (!isProfessional) {
    return (
      <Card className="border-0 shadow-sm p-4 text-center">
        <h5 className="fw-bold mb-3">Estadísticas de Cliente</h5>
        <p className="text-muted">Ve tu historial de servicios en la pestaña "Mi Cuenta".</p>
      </Card>
    )
  }

  if (loading) return <Spinner animation="border" variant="primary" className="d-block mx-auto my-5" />;
  if (error) return <Alert variant="danger" className="my-3">{error}</Alert>;

  const statCards = [
    { 
        title: 'Servicios Activos', 
        value: stats.activeServices, 
        icon: <Briefcase size={24} />, 
        color: '#4f46e5' 
    },
    { 
        title: 'Solicitudes Recibidas', // CAMBIO DE NOMBRE
        value: stats.totalSolicitudes, 
        icon: <MessageSquare size={24} />, 
        color: '#f59e0b' 
    },
    { 
        title: 'Solicitudes Semana', 
        value: stats.weeklySolicitudes, 
        icon: <Clock size={24} />, 
        color: '#10b981' 
    },
    { 
        title: 'Ganancias (Mes)', // CAMBIO DE NOMBRE
        value: stats.monthlyEarnings, 
        icon: <DollarSign size={24} />, 
        color: '#8b5cf6' 
    }
  ];

  return (
    <div className="p-0">
      {/* SECTION 1: ESTADÍSTICAS */}
      <Row className="g-4 mb-5">
        {statCards.map((stat, index) => (
          <Col key={index} sm={6} lg={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <p className="text-muted small mb-1">{stat.title}</p>
                    <h3 className="fw-bold mb-0">{stat.value}</h3>
                  </div>
                  <div className="rounded-circle p-3" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                    {stat.icon}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row>
        {/* SECTION 2: MIS SERVICIOS */}
        <Col lg={8}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold mb-0">Mis Servicios Publicados</h5>
            <Button variant="primary" size="sm" onClick={() => navigate('/ofrecer-servicios')}>
                <Plus size={16} className="me-1" /> Nuevo Servicio
            </Button>
          </div>

          {services.length > 0 ? (
            <div className="vstack gap-3 mb-5">
                {services.map(service => (
                    <Card key={service.id} className="border-0 shadow-sm">
                        <Card.Body className="d-flex align-items-center justify-content-between p-4">
                            <div className="d-flex align-items-center gap-3">
                                <div className="rounded p-3 bg-light fs-4">
                                    {service.categoria_icono || '🔧'}
                                </div>
                                <div>
                                    <h6 className="fw-bold mb-1">{service.titulo}</h6>
                                    <div className="d-flex align-items-center gap-2 text-muted small">
                                        <Badge bg="info" text="dark" className="fw-normal">{service.categoria_nombre}</Badge>
                                        <span>•</span>
                                        <span>{service.tipo_precio === 'por_hora' ? `$${service.precio}/hr` : `$${service.precio} fijo`}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex align-items-center gap-3">
                                <Badge bg={service.activo ? 'success' : 'secondary'}>
                                    {service.activo ? 'Activo' : 'Inactivo'}
                                </Badge>
                                <Button 
                                    variant="outline-danger" 
                                    size="sm" 
                                    className="btn-icon"
                                    onClick={() => handleDeleteService(service.id)}
                                    title="Eliminar servicio"
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                ))}
            </div>
          ) : (
            <Card className="border-0 shadow-sm text-center py-5 mb-5">
                <Card.Body>
                    <div className="text-muted mb-3">No tienes servicios activos actualmente.</div>
                    <Button variant="outline-primary" onClick={() => navigate('/ofrecer-servicios')}>
                        Crear mi primer servicio
                    </Button>
                </Card.Body>
            </Card>
          )}

          {/* SECTION 3: SOLICITUDES DE TRABAJO */}
          <div className="mb-4">
            <h5 className="fw-bold">Solicitudes de Trabajo Recientes</h5>
          </div>
          
          <Card className="border-0 shadow-sm">
            <Card.Body>
                {requests.length > 0 ? (
                    <div className="table-responsive">
                        <Table hover align="middle">
                            <thead className="bg-light">
                                <tr>
                                    <th>Cliente</th>
                                    <th>Servicio / Trabajo</th>
                                    <th>Detalles</th>
                                    <th>Fecha</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map(req => (
                                    <tr key={req.id}>
                                        <td>
                                            <div className="fw-bold">{req.cliente_nombre}</div>
                                            <small className="text-muted">{req.cliente_telefono || 'Sin tel'}</small>
                                        </td>
                                        <td>{req.titulo_trabajo}</td>
                                        <td style={{maxWidth: '200px'}} className="text-truncate" title={req.comentario_cliente}>
                                            {req.comentario_cliente}
                                        </td>
                                        <td>{new Date(req.fecha_solicitud).toLocaleDateString()}</td>
                                        <td>
                                            <Badge bg={
                                                req.estado === 'completado' ? 'success' : 
                                                req.estado === 'cancelado' ? 'danger' : 'warning'
                                            }>
                                                {req.estado.toUpperCase()}
                                            </Badge>
                                        </td>
                                        <td>
                                            {req.estado === 'pendiente' && (
                                                <div className="d-flex gap-1">
                                                    <Button 
                                                        variant="success" size="sm" 
                                                        onClick={() => handleStatusChange(req.id, 'completado')}
                                                        title="Marcar como Completado"
                                                    >
                                                        <CheckCircle size={16}/>
                                                    </Button>
                                                    <Button 
                                                        variant="outline-danger" size="sm"
                                                        onClick={() => handleStatusChange(req.id, 'cancelado')}
                                                        title="Cancelar"
                                                    >
                                                        <XCircle size={16}/>
                                                    </Button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                ) : (
                    <div className="text-center py-4 text-muted">
                        No tienes solicitudes de trabajo registradas aún.
                    </div>
                )}
            </Card.Body>
          </Card>
        </Col>

        {/* SECTION 4: SIDEBAR */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <h5 className="fw-bold mb-4">Acciones Rápidas</h5>
              <div className="d-grid gap-2">
                <Button variant="outline-secondary" onClick={() => navigate(`/profesional/${user.id}`)}>
                    Ver mi Perfil Público
                </Button>
                <Button variant="outline-secondary" onClick={() => navigate('/ayuda')}>
                    Centro de Ayuda
                </Button>
              </div>
            </Card.Body>
          </Card>
          
          <Card className="bg-primary text-white border-0 shadow-sm">
            <Card.Body className="p-4">
                <h5 className="fw-bold">Consejo Pro 🚀</h5>
                <p className="small mb-0 opacity-75">
                    Marca tus trabajos como "Completado" para que el sistema sume tus ganancias reales del mes y los clientes puedan dejarte reseñas.
                </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default DashboardContent