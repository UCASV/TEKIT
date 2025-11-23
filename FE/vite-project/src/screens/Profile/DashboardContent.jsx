import { Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap'
import { Briefcase, Clock, CheckCircle, DollarSign, Users, MessageSquare } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { serviceAPI, contactAPI } from '../../services/api'
import { useNavigate } from 'react-router-dom'

function DashboardContent() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const isProfessional = user?.rol_id === 2;

  useEffect(() => {
    if (!isProfessional) {
      setLoading(false);
      return; 
    }

    const fetchDashboardStats = async () => {
      try {
        // 1. Obtener Servicios Activos
        const servicesResponse = await serviceAPI.getMyServices();
        const services = servicesResponse.data || [];
        const activeServices = services.filter(s => s.activo).length;

        // 2. Obtener Estadísticas de Contacto (como proxy de actividad)
        const contactResponse = await contactAPI.getStats();
        const contactStats = contactResponse.data || {};

        setStats({
          activeServices,
          totalContacts: contactStats.total_contactos || 0,
          weeklyContacts: contactStats.contactos_semana || 0,
          // Datos no disponibles en la BD/API actual: usar proxy o placeholder
          monthlyEarnings: '$' + (contactStats.contactos_mes * 35).toLocaleString('en-US') || '$0' 
        });

      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Error al cargar las estadísticas. Asegúrate de que el backend esté corriendo y tengas un perfil profesional creado.');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardStats();
  }, [user]);

  if (!isProfessional) {
    return (
      <Card className="border-0 shadow-sm p-4 text-center">
        <h5 className="fw-bold mb-3">Estadísticas de Cliente</h5>
        <p className="text-muted">Ve tu historial de servicios en la pestaña "Mi Cuenta".</p>
      </Card>
    )
  }

  if (loading) {
    return <Spinner animation="border" variant="primary" className="d-block mx-auto my-5" />;
  }

  if (error) {
    return <Alert variant="danger" className="my-3">{error}</Alert>;
  }

  const statCards = [
    { title: 'Servicios Activos', value: stats.activeServices, icon: <Briefcase size={24} />, color: '#4f46e5' },
    { title: 'Contactos Totales', value: stats.totalContacts, icon: <MessageSquare size={24} />, color: '#f59e0b' },
    { title: 'Contactos Semana', value: stats.weeklyContacts, icon: <Clock size={24} />, color: '#10b981' },
    { title: 'Ingresos Estimados (Mes)', value: stats.monthlyEarnings, icon: <DollarSign size={24} />, color: '#8b5cf6' }
  ];

  return (
    <div className="p-0">
      <Row className="g-4 mb-5">
        {statCards.map((stat, index) => (
          <Col key={index} sm={6} lg={4}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <p className="text-muted small mb-1">{stat.title}</p>
                    <h3 className="fw-bold mb-0">{stat.value}</h3>
                  </div>
                  <div 
                    className="rounded-circle p-3"
                    style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
                  >
                    {stat.icon}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="fw-bold mb-4">Actividad Reciente (Proxy: Contactos)</h5>
              <div className="text-center text-muted py-5">
                <p>Tu actividad de contacto y servicios completados se mostrarán aquí.</p>
                <p className="small">Total de contactos registrados: {stats.totalContacts}</p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="fw-bold mb-4">Acciones Rápidas</h5>
              <div className="d-grid gap-2">
                <Button variant="primary" onClick={() => navigate('/ofrecer-servicios')}>Crear Nuevo Servicio</Button>
                <Button variant="outline-primary">Ver Solicitudes</Button>
                <Button variant="outline-secondary" onClick={() => navigate(`/profesional/${user.id}`)}>Ver mi Perfil Público</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default DashboardContent