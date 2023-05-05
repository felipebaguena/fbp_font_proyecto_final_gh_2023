import { useEffect, useState } from "react";
import "./Battle";

export const BattleModal = ({
  showModal,
  onNextBattle,
  message,
  showNextBattle,
  goToHome,
  levelUpValues,
  randomItemReceived,
}) => {
  const [showNextBattleButton, setShowNextBattleButton] = useState(false);
  const [showPreparingMessage, setShowPreparingMessage] = useState(false);

  useEffect(() => {
    if (showModal) {
      setShowPreparingMessage(true);
      setTimeout(() => {
        setShowNextBattleButton(true);
        setShowPreparingMessage(false);
      }, 3000);
    } else {
      setShowNextBattleButton(false);
      setShowPreparingMessage(false);
    }
  }, [showModal]);

  return (
    <div style={{ display: showModal ? "block" : "none" }}>
      <div className="battle-title d-flex flex-column align-items-center">
        {message}
        {levelUpValues && (
          <p className="battle-title">
            ¡Tu héroe ha subido de nivel! Valores añadidos:
            <br />
            Ataque: {levelUpValues.attack}
            <br />
            Defensa: {levelUpValues.defense}
            <br />
            Salud: {levelUpValues.health}
          </p>
        )}
        {randomItemReceived && (
          <p className="battle-title">
            ¡Tu héroe ha recibido un objeto aleatorio! Objeto:{" "}
            {randomItemReceived.data.name}
          </p>
        )}
        {showPreparingMessage && <p className="battle-title">Cargando...</p>}
        {showNextBattle && (
          <>
            {showNextBattleButton && (
              <button className="next-battle-button" onClick={onNextBattle}>
                Siguiente Batalla
              </button>
            )}
          </>
        )}
        <button className="go-home-button" onClick={goToHome}>
          Salir al Home
        </button>
      </div>
    </div>
  );
};
