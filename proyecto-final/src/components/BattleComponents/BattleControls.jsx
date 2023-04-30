import React from "react";
import Button from "react-bootstrap/Button";

export const BattleControls = ({
  handleAttack,
  handleDefense,
  openInventoryModal,
  selectedItem,
  findItemById,
  getBackgroundColorByRarity,
  heroPotions,
  handleUsePotion,
  PotionComponent,
  battle,
  defenseCount,
}) => {
  return (
    <div
      className="d-flex justify-content-around mt-3 buttons-battle-container"
      style={{ marginTop: "1rem" }}
    >
      <div className="action-buttons-container">
        <div>
          <p className="battle-title">Batalla en {battle.stage.name}</p>
        </div>
        <Button variant="dark" onClick={handleAttack} className="attack-button">
          Atacar
        </Button>
        <Button
          variant="dark"
          onClick={handleDefense}
          disabled={defenseCount >= 4}
          className="attack-button defense-button"
        >
          {defenseCount >= 4 ? "Defensa máxima" : "Defensa"}
        </Button>
      </div>
      <div className="inventory-potion-container">
        <p className="battle-title">Inventario</p>
        <Button
          variant="dark"
          onClick={openInventoryModal}
          className={`attack-button inventory-button me-3 ${
            selectedItem
              ? getBackgroundColorByRarity(findItemById(selectedItem).rare)
              : ""
          }`}
        >
          {selectedItem
            ? findItemById(selectedItem).name
            : "Selecciona un objeto"}
        </Button>
        <div className="d-flex justify-content-center potion-button">
          {Array.from({ length: 4 }, (_, index) => (
            <PotionComponent
              key={index}
              index={index}
              handleUsePotion={handleUsePotion}
              isActive={index < heroPotions}
              isClickable={index < heroPotions}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
