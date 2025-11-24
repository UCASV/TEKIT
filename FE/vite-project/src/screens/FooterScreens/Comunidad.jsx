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
          <h3 className="h3 fw-bold mb-4">Únete a nuestra red</h3>
          <p className="text-muted lead mb-4">
            Conecta con otros profesionales y clientes en nuestro grupo oficial de WhatsApp.
          </p>
          <Button 
            variant="success" 
            size="lg" 
            onClick={() => window.open('https://chat.whatsapp.com/GoVnJvakD3H0mvTSHymZi3', '_blank')}
          >
            <i className="bi bi-whatsapp me-2"></i>
            Unirme al Grupo de WhatsApp
          </Button>
        </Container>
      </section>
    </>
  );
}

export default Comunidad;