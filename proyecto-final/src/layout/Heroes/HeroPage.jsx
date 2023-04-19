import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  assignRandomItemToHeroById,
  createHero,
  getHeroesAndItems,
  getAllHeroImages,
  selectHero,
  getHeroImage,
} from "../../services/apiCalls";
import { Card, Button, Modal } from "react-bootstrap";

export const HeroPage = () => {
  const [heroes, setHeroes] = useState([]);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [selectedHero, setSelectedHero] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [newHeroName, setNewHeroName] = useState("");
  const [newHeroStory, setNewHeroStory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [creationMessage, setCreationMessage] = useState(null);
  const [refreshHeroes, setRefreshHeroes] = useState(false);

  const [selectedHeroImageId, setSelectedHeroImageId] = useState(null);
  const [showImageSelectionModal, setShowImageSelectionModal] = useState(false);
  const [heroImages, setHeroImages] = useState([]);
  const [heroImagesById, setHeroImagesById] = useState({});

  const handleShowImageSelectionModal = (imageId) => {
    setSelectedHeroImageId(imageId);
    setShowImageSelectionModal(true);
  };

  const handleCloseImageSelectionModal = () => {
    setShowImageSelectionModal(false);
  };

  const handleSelectHeroImage = (imageId) => {
    setSelectedHeroImageId(imageId);
    handleCloseImageSelectionModal();
    console.log("Selected image ID:", imageId);
  };

  const handleShowModal = () => setShowModal(true);

  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getHeroesAndItems(token);
      const fetchedImages = {};

      for (const hero of data) {
        if (hero.hero_image_id) {
          const imageResponse = await getHeroImage(hero.hero_image_id, token);
          if (imageResponse.status === "success") {
            fetchedImages[hero.id] = imageResponse.data.image_url;
          }
        }
      }

      console.log("fetchedImages:", fetchedImages);

      setHeroImagesById(fetchedImages);
      setHeroes(data);
      setRefreshHeroes(false);
    };
    fetchData();
  }, [token, refreshHeroes]);

  useEffect(() => {
    console.log("Current selectedHeroImageId:", selectedHeroImageId);
  }, [selectedHeroImageId]);

  const handleSelectHero = async (heroId) => {
    const result = await selectHero(token, heroId);
    if (result && result.status === "success") {
      navigate("/battle");
    } else {
      console.error("Error selecting hero:", result);
    }
  };

  useEffect(() => {
    const fetchHeroImages = async () => {
      const response = await getAllHeroImages(token);
      console.log("Respuesta de getAllHeroImages:", response);
      if (Array.isArray(response.data)) {
        setHeroImages(response.data);
      } else {
        console.error("Error fetching hero images:", response);
      }
    };
    fetchHeroImages();
  }, [token]);

  const handleShowInventoryModal = (hero) => {
    setSelectedHero(hero);
    setShowInventoryModal(true);
  };

  const handleCloseInventoryModal = () => {
    setSelectedHero(null);
    setShowInventoryModal(false);
    setSelectedItemIndex(null);
  };

  const handleCreateHero = async () => {
    console.log("selectedHeroImageId:", selectedHeroImageId);
    console.log("Body enviado:", {
      name: newHeroName,
      story: newHeroStory,
      hero_image_id: selectedHeroImageId,
    });
    const response = await createHero(token, {
      name: newHeroName,
      story: newHeroStory,
      image_id: selectedHeroImageId,
    });
    if (response && response.data && response.data.id) {
      await assignRandomItemToHeroById(token, response.data.id);
      console.log(response.data);
      setCreationMessage(`Héroe ${newHeroName} creado con éxito!`);
      setTimeout(() => {
        handleCloseModal();
        setShowModal(false);
        setCreationMessage(null);
      }, 2000);
    } else {
      setCreationMessage("Error al crear héroe.");
    }
  };

  const handleCloseModal = () => {
    setNewHeroName("");
    setNewHeroStory("");
    setShowModal(false);
    setCreationMessage(null);
    setRefreshHeroes(true);
  };

  const renderImageSelectionModal = () => {
    console.log("heroImages:", heroImages);
    return (
      <Modal
        show={showImageSelectionModal}
        onHide={handleCloseImageSelectionModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Selecciona la imagen del héroe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-wrap justify-content-center">
            {heroImages.map((image, index) => (
              <div
                key={index}
                className={`m-2 ${
                  selectedHeroImageId === image.id
                    ? "border border-primary"
                    : ""
                }`}
                style={{ cursor: "pointer" }}
                onClick={() => handleSelectHeroImage(image.id)}
              >
                <img
                  src={image.imageUrl}
                  alt={`Hero image ${index}`}
                  width="100"
                />
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseImageSelectionModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    );
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
                    backgroundColor:
                      selectedItemIndex === index ? "#f8f9fa" : "",
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
    console.log(
      "Rendering hero",
      hero.id,
      "image URL:",
      heroImagesById[hero.id]
    );
    return (
      <Card key={index} style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title>
            {hero.name}
            {hero.hero_image_id && heroImagesById[hero.id] && (
              <img
                src={heroImagesById[hero.id]}
                alt={hero.name}
                style={{ width: "64px" }}
              />
            )}
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            Level {hero.level}
          </Card.Subtitle>
          <Card.Text>{hero.story}</Card.Text>
          <Button
            variant="primary"
            className="mr-2"
            onClick={() => handleShowInventoryModal(hero)}
          >
            Inventario
          </Button>
          <Button variant="success" onClick={() => handleSelectHero(hero.id)}>
            Seleccionar
          </Button>
        </Card.Body>
      </Card>
    );
  };

  return (
    <div>
      <h2>Selecciona un héroe</h2>
      <div className="d-flex flex-wrap justify-content-center">
        {heroes.map((hero, index) => (
          <div key={index} className="m-2">
            {renderHeroCard(hero, index)}
          </div>
        ))}
      </div>
      {renderInventoryModal()}
      {renderImageSelectionModal()}
      <Button variant="primary" onClick={handleShowModal}>
        Nuevo héroe
      </Button>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Crea un nuevo héroe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Ingresa el nombre del héroe"
                value={newHeroName}
                onChange={(e) => setNewHeroName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="story">Historia</label>
              <textarea
                className="form-control"
                id="story"
                rows="3"
                placeholder="Ingresa la historia del héroe"
                value={newHeroStory}
                onChange={(e) => setNewHeroStory(e.target.value)}
              ></textarea>
            </div>
          </form>
          {creationMessage && (
            <div className="my-3">
              <Modal.Title>{creationMessage}</Modal.Title>
              <h2>{`${newHeroName}`}</h2>
            </div>
          )}
          {creationMessage === null && (
            <>
              <Button variant="info" onClick={handleShowImageSelectionModal}>
                Seleccionar imagen
              </Button>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {creationMessage === null && (
            <>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cerrar
              </Button>
              <Button variant="primary" onClick={handleCreateHero}>
                Crear héroe
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};
