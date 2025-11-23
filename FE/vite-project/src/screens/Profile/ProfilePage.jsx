import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Tab, Nav, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { User, Home, Award } from 'lucide-react';
import DashboardContent from './DashboardContent';
import PerfilCliente from '../PerfilCliente/PerfilCliente';
import PerfilContratante from '../PerfilContratante/PerfilContratante';

function ProfilePage() {
    const { user, isAuthenticated, hasRole } = useAuth();
    const [activeKey, setActiveKey] = useState('loading');
    const isProfessional = hasRole(2);
    
    // Determinar la pestaña inicial una vez que el usuario esté cargado
    useEffect(() => {
        if (isAuthenticated) {
            if (isProfessional) {
                setActiveKey('dashboard');
            } else {
                setActiveKey('client-profile');
            }
        }
    }, [isAuthenticated, isProfessional]);
    
    if (!isAuthenticated) {
        return <Alert variant="danger" className="my-5 container">Debes iniciar sesión para ver tu perfil.</Alert>;
    }
    
    // Si la clave es 'loading' significa que estamos esperando el efecto
    if (activeKey === 'loading') {
        return <Spinner animation="border" variant="primary" className="d-block mx-auto my-5" />;
    }

    return (
        <Container className="py-5 min-vh-100">
            <h2 className="fw-bold mb-4">Hola, {user.nombre}</h2>
            <p className="text-muted">Gestión de tu cuenta y actividad.</p>

            <Tab.Container id="profile-tabs" activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
                <Row>
                    <Col md={3}>
                        <Nav variant="pills" className="flex-column shadow-sm p-3 bg-white rounded">
                            {isProfessional && (
                                <>
                                    <Nav.Item>
                                        <Nav.Link eventKey="dashboard" className="d-flex align-items-center gap-2">
                                            <Home size={18} /> Dashboard
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="public-profile" className="d-flex align-items-center gap-2">
                                            <Award size={18} /> Perfil Público
                                        </Nav.Link>
                                    </Nav.Item>
                                    <hr className="my-2" />
                                </>
                            )}
                            <Nav.Item>
                                <Nav.Link eventKey="client-profile" className="d-flex align-items-center gap-2">
                                    <User size={18} /> Mi Cuenta
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    
                    <Col md={9}>
                        <Card className="border-0 shadow-sm p-4">
                            <Tab.Content>
                                {isProfessional && (
                                    <Tab.Pane eventKey="dashboard">
                                        <h3 className="h4 fw-bold mb-4">Resumen de Actividad</h3>
                                        <DashboardContent />
                                    </Tab.Pane>
                                )}
                                
                                <Tab.Pane eventKey="public-profile">
                                    <h3 className="h4 fw-bold mb-4">Edición de Perfil Público</h3>
                                    {/* Usa PerfilContratante en modo edición para el propio usuario */}
                                    <PerfilContratante editingMode={true} profileUserId={user.id} />
                                </Tab.Pane>
                                
                                <Tab.Pane eventKey="client-profile">
                                    <h3 className="h4 fw-bold mb-4">Datos Personales y Historial</h3>
                                    {/* Muestra la vista de cliente (compatible para ambos roles) */}
                                    <PerfilCliente />
                                </Tab.Pane>
                            </Tab.Content>
                        </Card>
                    </Col>
                </Row>
            </Tab.Container>
        </Container>
    );
}

export default ProfilePage;