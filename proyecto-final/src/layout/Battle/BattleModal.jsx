import { useEffect } from "react";
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

  useEffect(() => {
    if (showModal && randomItemReceived) {
      console.log("randomItemReceived actualizado:", randomItemReceived);
    }
  }, [showModal, randomItemReceived]);
  

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
            ¡Tu héroe ha recibido un objeto aleatorio! Objeto: {randomItemReceived.data.name}
          </p>
        )}
        {showNextBattle && (

          <button className="next-battle-button" onClick={onNextBattle}>Siguiente Batalla</button>

        )}
        <button className="go-home-button" onClick={goToHome}>Salir al Home</button>
      </div>
    </div>
  );
};
