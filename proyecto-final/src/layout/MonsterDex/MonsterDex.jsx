import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getDefeatedMonsters, getTotalMonsters } from "../../services/apiCalls";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Col, Container, Row } from "react-bootstrap";
import { MonsterCard } from "../../components/MonsterCard/MonsterCard";
import { useNavigate } from "react-router-dom";

export function MonsterDex() {
  const heroId = useSelector((state) => state.hero.hero_id);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
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

  const handleBackToHeroes = () => {
    navigate("/myheroes");
  };

  return (
<Container fluid>
  <div className="selector-hero-title">Monstruos eliminados</div>
  <div className="selector-hero-title defeated-monster-subtitle">
    Has acabado con {monsters.length} de {totalMonsters} tipos de monstruos
  </div>
  <div className="d-flex flex-wrap justify-content-center">
    {monsters.map((monster) => (
      <div key={monster.id} className="m-2">
        <MonsterCard
          monster={monster}
          expandedMonsterId={expandedMonsterId}
          toggleDescription={toggleDescription}
        />
      </div>
    ))}
  </div>
  <div
        className="selector-hero-title back-heroes-view"
        onClick={handleBackToHeroes}
      >
        Volver a Mis héroes
      </div>
</Container>
  );
}
