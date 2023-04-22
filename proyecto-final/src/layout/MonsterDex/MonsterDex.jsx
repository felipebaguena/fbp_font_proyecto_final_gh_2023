import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getDefeatedMonsters, getTotalMonsters } from "../../services/apiCalls";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Col, Container, Row } from "react-bootstrap";

export function MonsterDex() {
  const heroId = useSelector((state) => state.hero.hero_id);
  const token = useSelector((state) => state.auth.token);
  const [monsters, setMonsters] = useState([]);
  const [totalMonsters, setTotalMonsters] = useState(0);
  const [expandedMonsterId, setExpandedMonsterId] = useState(null);

  useEffect(() => {
    async function fetchDefeatedMonsters() {
      const response = await getDefeatedMonsters(token, heroId);
      if (response && response.success) {
        const monstersWithImages = response.data.map((monster) => {
          const imageUrl = monster.monster_image.image
            ? `http://localhost:8000/${monster.monster_image.image}`
            : "";
          console.log(`Image URL for ${monster.name}: ${imageUrl}`);
          console.log(monster);
          return {
            ...monster,
            imageUrl,
          };
        });
        setMonsters(monstersWithImages);
      } else {
        console.error("Failed to fetch defeated monsters:", response);
      }
    }
    fetchDefeatedMonsters();
  }, [token, heroId]);

  useEffect(() => {
    async function fetchTotalMonsters() {
      const total = await getTotalMonsters(token);
      if (total) {
        setTotalMonsters(total);
      } else {
        console.error("Failed to fetch total monsters.");
      }
    }

    fetchTotalMonsters();
  }, [token]);

  const toggleDescription = (monsterId) => {
    if (expandedMonsterId === monsterId) {
      setExpandedMonsterId(null);
    } else {
      setExpandedMonsterId(monsterId);
    }
  };

  return (
    <Container>
      <h3>Defeated Monsters</h3>
      <p>
        Has acabado con {monsters.length} de {totalMonsters} tipos de monstruos
      </p>
      <Row xs={1} md={2} lg={3}>
        {monsters.map((monster) => (
          <Card
            className="m-1"
            key={monster.id}
            style={{ width: "18rem", marginBottom: "1rem" }}
          >
            <Card.Body>
              <Row>
                <Col xs={4}>
                  <Card.Img
                    src={monster.imageUrl}
                    alt={monster.name}
                    style={{ width: "64px", objectFit: "cover" }}
                  />
                </Col>
                <Col xs={8}>
                  <Card.Title>{monster.name}</Card.Title>
                  <Card.Text>Número: {monster.id}</Card.Text>
                </Col>
              </Row>
              <Row>
                <Col>
                  {expandedMonsterId === monster.id && (
                    <Card.Text>{monster.description}</Card.Text>
                  )}
                  <Button
                    variant="primary"
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
        ))}
      </Row>
    </Container>
  );
}
