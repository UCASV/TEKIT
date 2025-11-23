import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { categoryAPI, serviceAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Briefcase } from 'lucide-react';

function ServiceForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    categoria_id: '',
    titulo: '',
    descripcion: '',
    precio: '',
    tipo_precio: 'por_hora', 
  });

  useEffect(() => {
    // Si el usuario no es profesional (rol_id = 2), redirigir
    if (!user || user?.rol_id !== 2) { 
        setLoading(false);
        setError('Acceso denegado. Esta sección es solo para profesionales.');
        return;
    }
    
    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getAll();
        setCategories(response.data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('No se pudieron cargar las categorías.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'precio' ? value.replace(/[^0-9.]/g, '') : value,
    });
    setError(null);
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess('');

    if (!formData.categoria_id || !formData.titulo || !formData.tipo_precio) {
      setError('Por favor, complete los campos obligatorios (Categoría, Título, Tipo de Precio).');
      return;
    }

    if (formData.tipo_precio !== 'a_consultar' && (!formData.precio || parseFloat(formData.precio) <= 0)) {
        setError('Debe ingresar un precio válido si no es "A Consultar".');
        return;
    }

    setSubmitting(true);
    
    try {
        const dataToSend = {
            ...formData,
            categoria_id: parseInt(formData.categoria_id),
            precio: formData.tipo_precio === 'a_consultar' ? null : parseFloat(formData.precio)
        };
        
        await serviceAPI.create(dataToSend);

        setSuccess('¡Servicio creado exitosamente! Puedes verlo en tu dashboard.');
        setTimeout(() => navigate('/dashboard'), 2000);

    } catch (err) {
        console.error('Error al crear servicio:', err);
        setError(err.message || err.data?.message || 'Error al crear el servicio. Intenta de nuevo.');
    } finally {
        setSubmitting(false);
    }
  };
  
  const pricePlaceholder = formData.tipo_precio === 'por_hora' ? 'Ej: 25.00' : 'Ej: 150.00';

  if (loading) {
    return (
      <Container className="my-5 text-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Cargando formulario...</p>
      </Container>
    );
  }

  if (error && error.includes('Acceso denegado')) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger">
            {error}
            <Button variant="link" onClick={() => navigate('/register')} className="d-block mx-auto mt-2">Regístrate como Profesional</Button>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: '#f9fafb' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={7}>
            <Card className="border-0 shadow-sm p-4">
              <div className="text-center mb-4">
                <Briefcase size={32} className="text-primary mb-2" />
                <h2 className="fw-bold mb-2">Ofrecer un Nuevo Servicio</h2>
                <p className="text-muted">Detalla lo que ofreces a nuestros clientes.</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoría *</Form.Label>
                  <Form.Select
                    name="categoria_id"
                    value={formData.categoria_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icono} {cat.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Título del Servicio *</Form.Label>
                  <Form.Control
                    type="text"
                    name="titulo"
                    placeholder="Ej: Reparación de Fugas 24/7"
                    value={formData.titulo}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Descripción del Servicio</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="descripcion"
                    placeholder="Describe en detalle el servicio que ofreces, tu experiencia y lo que el cliente recibirá."
                    value={formData.descripcion}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Row className="mb-4">
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Tipo de Precio *</Form.Label>
                            <Form.Select
                                name="tipo_precio"
                                value={formData.tipo_precio}
                                onChange={handleChange}
                                required
                            >
                                <option value="por_hora">Precio por Hora</option>
                                <option value="fijo">Precio Fijo (por proyecto)</option>
                                <option value="a_consultar">A Consultar</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Precio (USD)</Form.Label>
                            <Form.Control
                                type="text"
                                name="precio"
                                placeholder={pricePlaceholder}
                                value={formData.precio}
                                onChange={handleChange}
                                disabled={formData.tipo_precio === 'a_consultar'}
                                required={formData.tipo_precio !== 'a_consultar'}
                            />
                            <Form.Text className="text-muted">
                                {formData.tipo_precio === 'a_consultar' && 'El cliente te contactará para negociar.'}
                            </Form.Text>
                        </Form.Group>
                    </Col>
                </Row>

                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100"
                  disabled={submitting}
                >
                  {submitting ? <><Spinner animation="border" size="sm" className="me-2" /> Publicando...</> : 'Publicar Servicio'}
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ServiceForm;