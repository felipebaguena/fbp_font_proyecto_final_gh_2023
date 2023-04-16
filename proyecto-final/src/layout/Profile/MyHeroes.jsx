import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getHeroesAndItems } from "../../services/apiCalls";
import { Card, Button, Modal } from "react-bootstrap";

export const HeroesAndItems = () => {
  const [heroes, setHeroes] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [selectedHero, setSelectedHero] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getHeroesAndItems(token);
      setHeroes(data);
    };
    fetchData();
  }, [token]);

  const handleCloseModal = () => {
    setSelectedItem(null);
    setShowModal(false);
  };

  const handleShowInventoryModal = (hero) => {
    setSelectedHero(hero);
    setShowInventoryModal(true);
  };

  const handleCloseInventoryModal = () => {
    setSelectedHero(null);
    setShowInventoryModal(false);
    setSelectedItemIndex(null);
  };

  const renderInventoryModal = () => {
    if (!selectedHero) return null;
    return (
      <Modal show={showInventoryModal} onHide={handleCloseInventoryModal}>
        <Modal.Header closeButton>
          <Modal.Title>Inventario de {selectedHero.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="list-group">
            {selectedHero.items.map((item, index) => (
              <React.Fragment key={index}>
                <div
                  className="list-group-item"
                  style={{
                    cursor: "pointer",
                    backgroundColor: selectedItemIndex === index ? "#f8f9fa" : "",
                  }}
                  onClick={() =>
                    selectedItemIndex === index
                      ? setSelectedItemIndex(null)
                      : setSelectedItemIndex(index)
                  }
                >
                  {item.name}
                </div>
                {selectedItemIndex === index && (
                  <div>
                    <p>{selectedHero.items[selectedItemIndex].description}</p>
                    <p>
                      Attack Modifier:{" "}
                      {selectedHero.items[selectedItemIndex].attack_modifier}
                    </p>
                    <p>
                      Defense Modifier:{" "}
                      {selectedHero.items[selectedItemIndex].defense_modifier}
                    </p>
                    <p>
                      Health Modifier:{" "}
                      {selectedHero.items[selectedItemIndex].health_modifier}
                    </p>
                    <p>Rarity: {selectedHero.items[selectedItemIndex].rare}</p>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseInventoryModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };  

  const renderHeroCard = (hero, index) => {
    return (
      <Card key={index} style={{ width: "18rem" }}>
        <Card.Body>
        <Card.Title>{hero.name}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            Level {hero.level}
          </Card.Subtitle>
          <Card.Text>{hero.story}</Card.Text>
          <Button variant="primary" onClick={() => handleShowInventoryModal(hero)}>
            Inventario
          </Button>
        </Card.Body>
      </Card>
    );
  };

  const renderModal = () => {
    if (!selectedItem) return null;

    return (
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedItem.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{selectedItem.description}</p>
          <p>Attack Modifier: {selectedItem.attack_modifier}</p>
          <p>Defense Modifier: {selectedItem.defense_modifier}</p>
          <p>Health Modifier: {selectedItem.health_modifier}</p>
          <p>Rarity: {selectedItem.rare}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <div>
      <h1>Mis Héroes y sus Items</h1>
      <div className="d-flex flex-wrap justify-content-center">
        {heroes.map((hero, index) => (
          <div key={index} className="m-2">
            {renderHeroCard(hero, index)}
          </div>
        ))}
      </div>
      {renderInventoryModal()}
      {renderModal()}
    </div>
  );
};
