import React, { useState } from "react";
import "./HomePage.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";

export const HomePage = () => {
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const startStory = () => {
    if (!token) {
      handleShowModal();
    } else {
      navigate("/heroes");
    }
  };

  const startStoryMode = () => {
      navigate("/storymode");
  };

  const viewHeroes = () => {
    if (!token) {
      handleShowModal();
    } else {
      navigate("/myheroes");
    }
  };

  const viewProfile = () => {
    if (!token) {
      handleShowModal();
    } else {
      navigate("/profile");
    }
  };

  const viewRanking = () => {
    navigate("/ranking");
  };

  return (
    <Container fluid>
      <Row className="games-banner">
      <Col
          xs={12}
          className="banner-console-img-container banner-story-img-container banner-ranking-img-container ranking-s"
          onClick={viewRanking}
        >
          <img
            className="banner-story-img"
            src="/images/ranking-home-cover-l.jpg"
          />
        </Col>
        <div className="banner-top-logo-home d-flex">
          <div className="banner-top-left-right"></div>
          <div className="banner-top battle-title">
            <img
              className="logo-img"
              src="/images/logo-juego-xl.png"
            />
          </div>
          <div className="banner-top-left-right"></div>
        </div>
        <Col xs={12} sm={6} md={3} className="game-container">
          <div className="game" onClick={startStory}>
            <img
              className="game-img"
              src="/images/aventuras-cover-xl.jpg"
              width="400"
            />
            <img
              className="game-img-mobile"
              src="/images/aventura-spine-cover.jpg"
              width="400"
            />
          </div>
        </Col>
        <Col xs={12} sm={6} md={3} className="game-container">
          <div className="game" onClick={startStoryMode}>
            <img
              className="game-img"
              src="/images/historia-cover-xl.jpg"
              width="400"
            />
            <img
              className="game-img-mobile"
              src="/images/historia-spine-cover.jpg"
              width="400"
            />
          </div>
        </Col>
        <Col xs={12} sm={6} md={3} className="game-container">
          <div className="game" onClick={viewHeroes}>
            <img
              className="game-img"
              src="/images/heroes-cover-xl.jpg"
              width="400"
            />
            <img
              className="game-img-mobile"
              src="/images/heroes-spine-cover.jpg"
              width="400"
            />
          </div>
        </Col>
        <Col xs={12} sm={6} md={3} className="game-container">
          <div className="game" onClick={viewProfile}>
            <img
              className="game-img"
              src="/images/perfil-cover-xl.jpg"
              width="400"
            />
            <img
              className="game-img-mobile"
              src="/images/perfil-spine-cover.jpg"
              width="400"
            />
          </div>
        </Col>
        <Col
          xs={12}
          className="banner battle-title banner-console-img-container banner-console-img-container-margin"
          onClick={startStory}
        >
          <img
            className="banner-console-img"
            src="/images/logo-consola-tv-xl.png"
          />
        </Col>
        <Col
          xs={12}
          className="banner-console-img-container banner-story-img-container"
          onClick={startStoryMode}
        >
          <img
            className="banner-story-img"
            src="/images/story-home-cover-l.jpg"
          />
        </Col>
        <Col
          xs={12}
          className="banner-console-img-container banner-story-img-container banner-ranking-img-container ranking-xl"
          onClick={viewRanking}
        >
          <img
            className="banner-story-img"
            src="/images/ranking-home-cover-l.jpg"
          />
        </Col>
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
      <Modal 
      show={showModal} 
      onHide={handleCloseModal}
      className="custom-modal modal-title">
        <Modal.Header closeButton>
          <Modal.Title>Atención</Modal.Title>
        </Modal.Header>
        <Modal.Body>Por favor, inicia sesión o regístrate</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
