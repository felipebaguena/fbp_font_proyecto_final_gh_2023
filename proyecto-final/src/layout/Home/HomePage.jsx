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

  const startStoryMode = () => {
    if (!token) {
      handleShowModal();
    } else {
      navigate("/storymode");
    }
  };

  return (
    <Container fluid>
      <Row className="games-banner">
        <div className="banner-top-logo-home d-flex">
        <div className="banner-top-left-right"></div>
        <div className="banner-top battle-title">
          <img
            className="logo-img"
            src="../../../public/images/logo-juego.png"
          />
        </div>
        <div className="banner-top-left-right"></div>
        </div>
        <Col xs={12} sm={6} md={3} className="game-container">
          <div className="game" onClick={startStory}>
            <img
              className="game-img"
              src="../../../public/images/aventuras_cover.png"
              width="400"
            />
          </div>
        </Col>
        <Col xs={12} sm={6} md={3} className="game-container">
          <div className="game" onClick={viewHeroes}>
            <img
              className="game-img"
              src="../../../public/images/misheroes_cover.png"
              width="400"
            />
          </div>
        </Col>
        <Col xs={12} sm={6} md={3} className="game-container">
          <div className="game" onClick={viewProfile}>
            <img
              className="game-img"
              src="../../../public/images/perfil_cover.png"
              width="400"
            />
          </div>
        </Col>
        <Col xs={12} sm={6} md={3} className="game-container">
          <div className="game" onClick={startStoryMode}>
            <img
              className="game-img"
              src="../../../public/images/historia_cover.png"
              width="400"
            />
          </div>
        </Col>
        {/* <div className="banner battle-title">
          <h1>Texto para el Home</h1>
        </div> */}
        <Col className="banner battle-title banner-console-img" onClick={startStory}>
          <img
            className="banner-console-img"
            src="../../../public/images/logo-consola-tv-2.png"
          />
        </Col>
      </Row>
      <Modal show={showModal} onHide={handleCloseModal}>
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
