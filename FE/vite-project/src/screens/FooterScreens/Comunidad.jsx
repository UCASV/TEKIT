import { Container, Button } from "react-bootstrap";
import { Users } from 'lucide-react';
import './StylesFooters.css';

function Comunidad() {
  return (
    <>
      <section className="hero-section text-white text-center py-5">
        <Container className="py-5">
          <Users size={64} className="mb-3" />
          <h2 className="display-4 fw-bold mb-4">Comunidad TEKIT</h2>
          <p className="lead mb-4">
            Un espacio para conectar, compartir experiencias y hacer crecer tu red profesional.
          </p>
        </Container>
      </section>

      <section className="py-5 bg-white text-center min-vh-50 d-flex align-items-center">
        <Container>
          <h3 className="h3 fw-bold mb-4">¡Próximamente!</h3>
          <p className="text-muted lead mb-4">
            Estamos trabajando arduamente para construir un foro y una sección de recursos para nuestra comunidad de profesionales.
          </p>
          <Button variant="primary" size="lg" onClick={() => window.open('https://chat.whatsapp.com', '_blank')}>
            Únete a nuestro grupo de WhatsApp
          </Button>
        </Container>
      </section>
    </>
  );
}

export default Comunidad;