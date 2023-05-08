import React from "react";
import { Container, Row, Col } from "react-bootstrap";

export const AboutUsPage = () => {
  const videoId = "JZwAMuQmA08";
  const videoSrc = `https://www.youtube.com/embed/${videoId}`;

  return (
    <Container fluid>
      <Row>
        <div className="selector-hero-title selector-hero-title-story about-tittle">
          Sobre Grim Reckoning
        </div>
        <Col className="custom-text-container conversation-text-container conversation-image-container d-flex flex-column about-text-container">
        <p>Grim Reckoning es un videojuego web desarrollado en React que emplea una API desarrollada con PHP Laravel. El juego ha sido creado íntegramente por Felipe Báguena.
        </p>
        <p>
            El objetivo en Grim Reckoning es descubrir los misterios de la aldea de Ravenhollow, y podrás hacerlo a través de un sistema de conversaciones aleatorias con sus aldeanos en el que podrás elegir tus respuestas, cambiando con ellas el rumbo de la conversación.
        </p>
        <p>
            La aldea encierra peligrosos monstruos a los que tus héroes deberán combatir. Podrás crear héroes y mejorarlos con equipo para el combate y subidas de nivel, que sólo alcanzarás conforme acabes con tus enemigos. Sólo los héroes más valerosos serán capaces de acabar con todos los monstruos distintos que habitan Ravenhollow y se convertirán en los héroes más famosos de este oscuro reino.
        </p>
        </Col>
        <div className="banner banner-about">
          <div className="video-container">
            <iframe
              className="video-container-iframe"
              src={videoSrc}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
        <Col className="banner-top-logo-home d-flex justify-content-center">
          <div className="banner-top-left-right banner-bottom-left-right"></div>
          <Col className="banner-bottom battle-title d-flex justify-content-center">
            <a
              href="https://github.com/felipebaguena"
              className="cartdrige-img"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="cartdrige"
                src="/images/md-cartridge-gh.png"
                alt="GitHub"
              />
            </a>
            <a
              href="https://www.linkedin.com/in/felipe-b%C3%A1guena-b20689269/"
              className="cartdrige-img"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="cartdrige"
                src="/images/md-cartridge-gh-li.png"
                alt="LinkedIn"
              />
            </a>
          </Col>
          <div className="banner-top-left-right banner-bottom-left-right"></div>
        </Col>
      </Row>
    </Container>
  );
};
