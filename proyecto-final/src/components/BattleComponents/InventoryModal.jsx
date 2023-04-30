import React from "react";
import { Modal, Button } from "react-bootstrap";

const InventoryModal = ({
  showInventoryModal,
  closeInventoryModal,
  heroItems,
  selectedItemIndex,
  setSelectedItemIndex,
  getBackgroundColorByRarity,
  translateRarity,
  setSelectedItem,
}) => {
  return (
    <Modal
      show={showInventoryModal}
      onHide={closeInventoryModal}
      centered
      className="custom-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Inventario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="list-group">
          {heroItems.map((item, index) => (
            <React.Fragment key={item.id}>
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
                <div className="mt-3 custom-inventory-text">
                  <h5>Detalles del ítem:</h5>
                  <p>
                    Nombre: {item.name} <br />
                    Descripción: {item.description} <br />
                    Modificador de Ataque: +{item.attack_modifier} <br />
                    Modificador de Defensa: +{item.defense_modifier} <br />
                    Rareza: {translateRarity(item.rare)} <br />
                  </p>
                  <Button
                    variant="success"
                    className="mb-2 custom-button custom-button-select custom-button-select-inventory"
                    onClick={() => {
                      if (selectedItemIndex !== null) {
                        setSelectedItem(heroItems[selectedItemIndex].id);
                        closeInventoryModal();
                      }
                    }}
                    disabled={selectedItemIndex === null}
                  >
                    Seleccionar ítem
                  </Button>
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
          onClick={closeInventoryModal}
        >
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InventoryModal;
