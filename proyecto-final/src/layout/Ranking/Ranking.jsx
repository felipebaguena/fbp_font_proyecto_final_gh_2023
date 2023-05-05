import React, { useState, useEffect } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getTopHeroesByKills } from "../../services/apiCalls";
import "./Ranking.css";

export const TopHeroes = () => {
  const [topHeroes, setTopHeroes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const handleBackToHome = () => {
    navigate("/");
  };

  useEffect(() => {
    async function fetchTopHeroes() {
      const topHeroesResponse = await getTopHeroesByKills();

      if (topHeroesResponse.success) {
        setTopHeroes(topHeroesResponse.data);
        setIsLoading(false);
      }
    }

    fetchTopHeroes();
  }, []);

  const renderHeroCard = (hero, index) => {
    let cardClass = "top-hero-card";
    if (index === 0) {
      cardClass += " first-place";
    } else if (index === 1) {
      cardClass += " second-place";
    } else if (index === 2) {
      cardClass += " third-place";
    }

    return (
      <Card key={hero.hero_id} className={cardClass}>
        <Card.Body className="rank-card d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <div className="hero-rank">{index + 1}º</div>
            {hero.hero_image && (
              <img
                src={hero.hero_image.image}
                alt={hero.hero_name}
                className="hero-data hero-image"
              />
            )}
            <div className="hero-data hero-name">{hero.hero_name}</div>
          </div>
          <div className="hero-data hero-kills">
            Monstruos eliminados: {hero.kills}
          </div>
        </Card.Body>
      </Card>
    );
  };

  return (
    <Container fluid>
      <Row className="justify-content-center">
        <div className="selector-hero-title selector-hero-title-story ranking-tittle">
          Los héroes más famosos de Ravenhollow
        </div>
        <Col xs={12} sm={10} lg={8}>
          {isLoading ? (
            <p className="battle-title">Cargando...</p>
          ) : (
            topHeroes.map((hero, index) => renderHeroCard(hero, index))
          )}
        </Col>
        <div
          className="selector-hero-title back-heroes-view"
          onClick={handleBackToHome}
        >
          Volver al incio
        </div>
      </Row>
    </Container>
  );
};
