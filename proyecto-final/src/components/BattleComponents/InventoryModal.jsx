import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export const InventoryModal = ({
  showInventoryModal,
  closeInventoryModal,
  heroItems,
  selectedItemIndex,
  setSelectedItemIndex,
  getBackgroundColorByRarity,
  selectedItem,
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
                  selectedItemIndex === index
                    ? "custom-button-select"
                    : ""
                } ${getBackgroundColorByRarity(item.rare)}`}
                onClick={() =>
                  selectedItemIndex === index
                    ? setSelectedItemIndex(null)
                    : setSelectedItemIndex(index)
                }
              >
                {item.name}
              </Button>
            </React.Fragment>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="success"
          className="mb-2 custom-button custom-button-select"
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

