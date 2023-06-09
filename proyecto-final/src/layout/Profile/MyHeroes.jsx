import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setHeroId } from "../../heroSlice";
import {
  assignRandomItemToHeroById,
  createHero,
  getHeroesAndItems,
  getAllHeroImages,
  deleteHero,
  removeItemFromHero,
} from "../../services/apiCalls";
import { Card, Button, Modal } from "react-bootstrap";
import InventoryHeroModal from "../../components/HeroComponents/InventoryHeroModal";

export const HeroesAndItems = () => {
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
  const [heroToDelete, setHeroToDelete] = useState(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [imageSelected, setImageSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Manejador para la navegación a la vista de monstruos eliminados con id del héroe depositada en redux

  const handleDefeatedMonstersClick = (heroId) => {
    dispatch(setHeroId(heroId));
    navigate(`/monsterdex/${heroId}`);
  };

  // Manejadores para la selección de imágenes en el modal de selección de héroes

  const handleShowImageSelectionModal = (imageId) => {
    setSelectedHeroImageId(imageId);
    setShowImageSelectionModal(true);
  };

  const handleCloseImageSelectionModal = () => {
    setShowImageSelectionModal(false);
  };

  const handleSelectHeroImage = (imageId) => {
    setSelectedHeroImageId(imageId);
    setImageSelected(true);
    handleCloseImageSelectionModal();
  };

  // Manejador para el borrado del héroe y confirmación de la eliminación

  const handleDeleteHero = (hero) => {
    setHeroToDelete(hero);
  };

  const confirmDeleteHero = async () => {
    if (heroToDelete) {
      const result = await deleteHero(token, heroToDelete.id);
      if (result && result.status === "success") {
        setRefreshHeroes(true);
      } else {
        console.error("Error deleting hero:", result);
      }
    }
    setHeroToDelete(null);
  };

  const handleShowModal = () => setShowModal(true);

  // Recopilación de todos los héroes del usuario

  useEffect(() => {
    const fetchData = async () => {
      const data = await getHeroesAndItems(token);
      const imageResponse = await getAllHeroImages(token);

      if (imageResponse.status === "success") {
        const fetchedImages = {};

        for (const image of imageResponse.data) {
          fetchedImages[image.id] = image.imageUrl;
        }
        setHeroImagesById(fetchedImages);
        setHeroes(data);
        setRefreshHeroes(false);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [token, refreshHeroes]);

  useEffect(() => {
    const fetchHeroImages = async () => {
      const response = await getAllHeroImages(token);
      if (Array.isArray(response.data)) {
        setHeroImages(response.data);
      } else {
        console.error("Error fetching hero images:", response);
      }
    };
    fetchHeroImages();
  }, [token]);

  // Manejador para la apertura y cierre del inventario del héroe

  const handleShowInventoryModal = (hero) => {
    setSelectedHero(hero);
    setShowInventoryModal(true);
  };

  const handleCloseInventoryModal = () => {
    setSelectedHero(null);
    setShowInventoryModal(false);
    setSelectedItemIndex(null);
    setRefreshHeroes(true);
  };

  // Manejador para la creación de héroe

  const handleCreateHero = async () => {
    const response = await createHero(token, {
      name: newHeroName,
      story: newHeroStory,
      hero_image_id: selectedHeroImageId,
    });
    if (response && response.data && response.data.id) {
      await assignRandomItemToHeroById(token, response.data.id);
      setCreationMessage(`Héroe ${newHeroName} creado con éxito!`);
      setImageSelected(false);
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

  const handleBackToHome = () => {
    navigate("/");
  };

  // Modal de selección de imágenes de héroe

  const renderImageSelectionModal = () => {
    return (
      <Modal
        show={showImageSelectionModal}
        onHide={handleCloseImageSelectionModal}
        className="custom-modal modal-title"
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

  // Clases y nombres para el color de los ítems en el inventario

  const getBackgroundColorByRarity = (rare) => {
    switch (rare) {
      case "comun":
        return "common-item";
      case "raro":
        return "rare-item";
      case "epico":
        return "epic-item";
      case "legendario":
        return "legendary-item";
      default:
        return "";
    }
  };

  const translateRarity = (rarity) => {
    switch (rarity) {
      case "comun":
        return "Común";
      case "raro":
        return "Raro";
      case "epico":
        return "Épico";
      case "legendario":
        return "Legendario";
      default:
        return rarity;
    }
  };

  // Manejador para eliminar ítems

  const handleRemoveItem = async () => {
    if (selectedHero && itemToDelete) {
      const itemId = itemToDelete.id;
      const result = await removeItemFromHero(token, selectedHero.id, itemId);
      if (result && result.status === "success") {
        setSelectedHero((prevHero) => {
          const updatedItems = prevHero.items.filter(
            (item) => item.id !== itemId
          );
          return { ...prevHero, items: updatedItems };
        });

        setShowDeleteConfirmModal(false);
        setItemToDelete(null);
      } else {
        console.error("Error removing item:", result);
      }
    }
  };

  // Modal para confirmación de eliminación de objetos en el inventario

  const renderDeleteConfirmModal = () => {
    return (
      <Modal
        show={showDeleteConfirmModal}
        onHide={() => setShowDeleteConfirmModal(false)}
        centered
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Eliminar ítem</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {itemToDelete && (
            <p className="custom-inventory-text">
              ¿Estás seguro de que deseas eliminar el ítem {itemToDelete.name}?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteConfirmModal(false)}
          >
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleRemoveItem}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  // Modal de confirmación de eliminación de ítems

  const handleShowDeleteConfirmModal = (item) => {
    setItemToDelete(item);
    setShowDeleteConfirmModal(true);
  };

  // Card placeholder para creación de nuevo héroe

  const renderNewHeroCard = () => {
    return (
      <Card style={{ width: "18rem" }}>
        <Card.Body className="custom-card">
          <Card.Title className="custom-card-title text-center">
            Nuevo héroe
          </Card.Title>
          <div className="image-card-container d-flex mb-3 align-items-center justify-content-center">
            <div className="ml-auto">
              <Card.Subtitle className="text-muted custom-card-subtitle">
                Level 1
              </Card.Subtitle>
            </div>
          </div>
          <Card.Text className="custom-card-text m-1 text-center story-card-container">
            Crea un nuevo personaje para tu aventura
          </Card.Text>
          <div className="d-flex flex-column card-buttons-container card-buttons-container-xl">
            <Button
              variant="primary"
              className="mb-1 custom-button"
              onClick={handleShowModal}
            >
              Crear
            </Button>
          </div>
        </Card.Body>
      </Card>
    );
  };

  // Card de héroe

  const renderHeroCard = (hero) => {
    return (
      <Card key={hero.id} style={{ width: "18rem" }}>
        <Card.Body className="custom-card">
          <Card.Title className="custom-card-title text-center">
            {hero.name}
          </Card.Title>
          <div className="image-card-container d-flex mb-3 align-items-center justify-content-center">
            {hero.hero_image && (
              <img
                src={hero.hero_image.image}
                alt={hero.hero_name}
                style={{ width: "64px" }}
              />
            )}
            <div className="ml-auto">
              <Card.Subtitle className="text-muted custom-card-subtitle">
                Level {hero.level}
              </Card.Subtitle>
            </div>
          </div>
          <Card.Text className="custom-card-text m-1 text-center story-card-container">
            {hero.story}
          </Card.Text>
          <div className="d-flex flex-column card-buttons-container card-buttons-container-xl">
            <Button
              variant="primary"
              className="custom-button"
              onClick={() => handleShowInventoryModal(hero)}
            >
              Inventario
            </Button>

            <Button
              variant="secondary"
              className="custom-button custom-button-select"
              onClick={() => handleDefeatedMonstersClick(hero.id)}
            >
              Monstruos Eliminados
            </Button>
            <Button
              variant="danger"
              className="custom-button custom-button-close"
              onClick={() => handleDeleteHero(hero)}
            >
              Eliminar héroe
            </Button>
          </div>
        </Card.Body>
      </Card>
    );
  };

  return (
    <div>
      <div className="selector-hero-title">Mis héroes</div>
      {isLoading ? (
            <p className="battle-title">Cargando héroes...</p>
          ) : (
            <>        
      <div className="d-flex flex-wrap justify-content-center">
        {heroes.map((hero) => (
          <div key={hero.id} className="m-2">
            {renderHeroCard(hero)}
          </div>
        ))}
        <div className="m-2">{renderNewHeroCard()}</div>
      </div>
      <InventoryHeroModal
        showInventoryModal={showInventoryModal}
        handleCloseInventoryModal={handleCloseInventoryModal}
        selectedHero={selectedHero}
        selectedItemIndex={selectedItemIndex}
        setSelectedItemIndex={setSelectedItemIndex}
        getBackgroundColorByRarity={getBackgroundColorByRarity}
        handleShowDeleteConfirmModal={handleShowDeleteConfirmModal}
        translateRarity={translateRarity}
      />
      {renderImageSelectionModal()}
      {renderDeleteConfirmModal()}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Crea un nuevo héroe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group custom-inventory-text">
              <label htmlFor="name">Nombre</label>
              <input
                type="text"
                className="form-control"
                id="name"
                maxLength="16"
                placeholder="Ingresa el nombre del héroe"
                value={newHeroName}
                onChange={(e) => setNewHeroName(e.target.value)}
              />
            </div>
            <div className="form-group custom-inventory-text">
              <label htmlFor="story">Historia</label>
              <textarea
                className="form-control"
                id="story"
                maxLength="70"
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
            </div>
          )}
          {creationMessage === null && (
            <>
              <Button
                variant="dark"
                onClick={handleShowImageSelectionModal}
                className="m-0 mt-3 mb-1 custom-button custom-inventory-text"
              >
                Seleccionar imagen
              </Button>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {creationMessage === null && (
            <>
              <Button
                variant="secondary"
                onClick={handleCloseModal}
                className="custom-button-close"
              >
                Cerrar
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateHero}
                className="custom-button-select"
                disabled={!newHeroName || !newHeroStory || !imageSelected}
              >
                Crear héroe
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
      {heroToDelete && (
        <Modal
          show={true}
          onHide={() => setHeroToDelete(null)}
          className="custom-modal modal-title"
        >
          <Modal.Header closeButton>
            <Modal.Title>Eliminar héroe</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            ¿Estás seguro de que deseas eliminar a {heroToDelete.name}?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setHeroToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmDeleteHero}>
              Eliminar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <div
        className="selector-hero-title back-heroes-view"
        onClick={handleBackToHome}
      >
        Volver al incio
      </div>
      </>
      )}
    </div>
  );
};
