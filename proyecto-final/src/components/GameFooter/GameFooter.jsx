import React from "react";
import { Link } from "react-router-dom";
import "./GameFooter.css";
import { Container, Row, Col, ListGroup, ListGroupItem } from "react-bootstrap";

export const GameFooter = () => {
  return (
    <footer className="text-white mt-4 background-sega-md">
      <Container fluid className="pt-4 footer-text">
        <Row>
          <Col md={4}>
            <img
              className="logo-img-footer"
              src="../../../public/images/logo-juego-s.png"
              alt="logo-game"
            />
            <p className="text-footer-logo">
              Grim Reckoning, un juego de cazar monstruos en un mundo sombrío.
              Adéntrate en la aldea de Ravenhollow y descubre sus secretos.
            </p>
          </Col>
          <Col md={4}>
            <h5 className="footer-text-xl">Contacto</h5>
            <ListGroup>
              <ListGroupItem className="background-footer-none footer-text">
                <strong>Email:</strong> felipebaguena@gmail.com
              </ListGroupItem>
              <ListGroupItem className="background-footer-none footer-text">
                <strong>
                  <a
                    className="links-footer"
                    href="https://github.com/felipebaguena"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Perfil de GitHub
                  </a>
                </strong>
              </ListGroupItem>
              <ListGroupItem className="background-footer-none footer-text">
                <strong>
                  <a
                    className="links-footer"
                    href="https://www.linkedin.com/in/felipe-b%C3%A1guena-b20689269/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Perfil de LinkedIn
                  </a>
                </strong>
              </ListGroupItem>
            </ListGroup>
          </Col>
          <Col md={4}>
            <h5 className="footer-text-xl">Enlaces útiles</h5>
            <ListGroup>
              <ListGroupItem
                className="background-footer-none footer-text"
                action
                as="div"
              >
                <Link className="links-footer links-footer-2" to="/">Políticas de privacidad</Link>
              </ListGroupItem>
              <ListGroupItem
                className="background-footer-none footer-text"
                action
                as="div"
              >
                <Link className="links-footer links-footer-2" to="/">Términos y condiciones</Link>
              </ListGroupItem>
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
