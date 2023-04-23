import React from "react";
import './MonsterCard.css';
import { Card, Button, Col, Row } from "react-bootstrap";

export const MonsterCard = ({
  monster,
  expandedMonsterId,
  toggleDescription,
}) => {
  return (
    <Card className="m-1 custom-card custom-monster-card" key={monster.id} style={{ width: "18rem", marginBottom: "1rem" }}>
    <Card.Body>
      <Row className="justify-content-center">
        <Col xs="auto">
        <Card.Title className="custom-card-title text-center custom-monster-card-title">
            {monster.name}</Card.Title>
        </Col>
      </Row>
      <Row className="image-monster-row">
        <Col xs={4}>
          <Card.Img
            src={monster.imageUrl}
            alt={monster.name}
            style={{ width: "64px", objectFit: "cover" }}
          />
        </Col>
        <Col xs={8} className="d-flex align-items-center">
        <Card.Subtitle className="custom-card-subtitle custom-card-subtitle-monster">
                Número: {monster.id}
              </Card.Subtitle>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          {expandedMonsterId === monster.id && (
            <Card.Text>{monster.description}</Card.Text>
          )}
          <Button
            variant="dark"
            className="mb-1 custom-button"
            onClick={() => toggleDescription(monster.id)}
          >
            {expandedMonsterId === monster.id
              ? "Ocultar descripción"
              : "Descripción"}
          </Button>
        </Col>
      </Row>
    </Card.Body>
  </Card>
  
  );
};
