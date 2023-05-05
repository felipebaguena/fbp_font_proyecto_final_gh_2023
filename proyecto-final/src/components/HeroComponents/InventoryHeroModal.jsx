import React from "react";
import { Button, Modal } from "react-bootstrap";

const InventoryHeroModal = ({
  showInventoryModal,
  handleCloseInventoryModal,
  selectedHero,
  selectedItemIndex,
  setSelectedItemIndex,
  getBackgroundColorByRarity,
  handleShowDeleteConfirmModal,
  translateRarity,
}) => {
  if (!selectedHero) return null;
  return (
    <Modal
      show={showInventoryModal}
      onHide={handleCloseInventoryModal}
      centered
      className="custom-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">
          Inventario de {selectedHero.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="list-group">
          {selectedHero.items.map((item, index) => (
            <React.Fragment key={index}>
              <Button
                variant="dark"
                className={`custom-button ${
                  selectedItemIndex === index ? "custom-button-select" : ""
                } ${getBackgroundColorByRarity(item.rare)}`}
                onClick={() =>
                  selectedItemIndex === index
                    ? setSelectedItemIndex(null)
                    : setSelectedItemIndex(index)
                }
              >
                {item.name}
              </Button>
              {selectedItemIndex === index && (
                <div className="custom-inventory-text">
                  <p>{selectedHero.items[selectedItemIndex].description}</p>
                  <p>
                    Modificador de Ataque:{" "}
                    {selectedHero.items[selectedItemIndex].attack_modifier}
                  </p>
                  <p>
                    Modificador de Defensa:{" "}
                    {selectedHero.items[selectedItemIndex].defense_modifier}
                  </p>
                  <p>
                    Rareza:{" "}
                    {translateRarity(
                      selectedHero.items[selectedItemIndex].rare
                    )}
                  </p>
                  {selectedItemIndex !== null && (
                    <Button
                      variant="danger"
                      className="custom-button custom-button-remove"
                      onClick={() =>
                        handleShowDeleteConfirmModal(
                          selectedHero.items[selectedItemIndex]
                        )
                      }
                    >
                      Eliminar ítem
                    </Button>
                  )}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          className="custom-button custom-button-close"
          onClick={handleCloseInventoryModal}
        >
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InventoryHeroModal;
