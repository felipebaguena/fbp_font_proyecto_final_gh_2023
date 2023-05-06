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
  isLoadingNextBattle,
}) => {
  const [showNextBattleButton, setShowNextBattleButton] = useState(false);

  useEffect(() => {
    if (showModal && !isLoadingNextBattle) {
        setShowNextBattleButton(true);
    } else {
      setShowNextBattleButton(false);
    }
  }, [showModal, isLoadingNextBattle]);

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
        {showNextBattle && (
          <>
            {isLoadingNextBattle ? (
              <p className="battle-title">Comprobando recompensas</p>
            ) : (
              showNextBattleButton && (
                <button className="next-battle-button" onClick={onNextBattle}>
                  Siguiente Batalla
                </button>
              )
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
