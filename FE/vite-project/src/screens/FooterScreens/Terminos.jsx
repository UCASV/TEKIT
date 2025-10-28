import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap'
import './StylesFooters.css';

function Terminos() {
  return (
    <>
      <section className="hero-section text-white text-center py-5">
        <Container className="py-5">
          <h2 className="display-4 fw-bold mb-4">Términos y Condiciones</h2>
          <p className="lead mb-4">
            Consulta los términos que rigen el uso de nuestra plataforma y
            servicios.
          </p>
        </Container>
      </section>

      <section className="py-5">
        <Container>
          <h3 className="fw-bold mb-4">1. Aceptación de los Términos</h3>
          <p className="text-muted">
            Al acceder o utilizar nuestra plataforma, el usuario acepta
            cumplir con estos Términos y Condiciones, así como con todas las
            leyes y regulaciones aplicables.
          </p>

          <h3 className="fw-bold mt-5 mb-4">2. Uso de la Plataforma</h3>
          <p className="text-muted">
            Los usuarios se comprometen a utilizar el sitio únicamente con
            fines legales y de acuerdo con las políticas establecidas. Está
            prohibido el uso para actividades fraudulentas, difamatorias o
            que infrinjan los derechos de terceros.
          </p>

          <h3 className="fw-bold mt-5 mb-4">3. Registro de Usuarios</h3>
          <p className="text-muted">
            Para acceder a ciertos servicios, los usuarios deben crear una
            cuenta proporcionando información veraz y actualizada. Es
            responsabilidad del usuario mantener la confidencialidad de sus
            credenciales.
          </p>

          <h3 className="fw-bold mt-5 mb-4">4. Responsabilidad del Contenido</h3>
          <p className="text-muted">
            Marketplace no se hace responsable por el contenido generado por
            los usuarios o profesionales. Sin embargo, nos reservamos el
            derecho de eliminar publicaciones que violen nuestras políticas.
          </p>

          <h3 className="fw-bold mt-5 mb-4">5. Propiedad Intelectual</h3>
          <p className="text-muted">
            Todos los elementos visuales, marcas y contenidos del sitio son
            propiedad exclusiva de Marketplace o de sus licenciatarios. Su uso
            no autorizado está prohibido.
          </p>

          <h3 className="fw-bold mt-5 mb-4">6. Modificaciones</h3>
          <p className="text-muted">
            Nos reservamos el derecho de modificar estos términos en cualquier
            momento. Los cambios entrarán en vigor al publicarse en esta
            página.
          </p>

          <h3 className="fw-bold mt-5 mb-4">7. Contacto</h3>
          <p className="text-muted">
            Si tienes dudas o comentarios sobre estos términos, puedes
            contactarnos en{" "}
            <a href="mailto:legal@tekit.com" className="text-primary">
              legal@tekit.com
            </a>
            .
          </p>
        </Container>
      </section>

      <section className="cta-section text-white text-center py-5">
        <Container className="py-4">
          <h3 className="h2 mb-3">¿Necesitas más información legal?</h3>
          <p className="mb-4">Nuestro equipo puede ayudarte con cualquier duda.</p>
          <button className="cta-main-btn">Contactar al equipo legal</button>
        </Container>
      </section>
    </>
  );
}

export default Terminos;
