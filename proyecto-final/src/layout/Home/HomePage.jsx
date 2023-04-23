import React from "react";
import "./HomePage.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

export const HomePage = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const startStory = () => {
    navigate("/heroes");
  };

  const viewHeroes = () => {
    navigate("/myheroes");
  };

  return (
    <Container fluid>
      <Row className="games-banner">
        <div className="banner-top-left-right"></div>
        <div className="banner-top battle-title">
          <img
            className="logo-img"
            src="../../../public/images/logo-juego.png"
          />
        </div>
        <div className="banner-top-left-right"></div>
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
          <div className="game" onClick={startStory}>
            <img
              className="game-img"
              src="../../../public/images/perfil_cover.png"
              width="400"
            />
          </div>
        </Col>
        <Col xs={12} sm={6} md={3} className="game-container">
          <div className="game" onClick={viewHeroes}>
            <img
              className="game-img"
              src="../../../public/images/historia_cover.png"
              width="400"
            />
          </div>
        </Col>
        <div className="banner battle-title">
          <h1>Texto para el Home</h1>
        </div>
      </Row>
    </Container>
  );
};
