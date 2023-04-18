import { useEffect } from "react";

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
      <div>
        {message}
        {levelUpValues && (
          <p>
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
          <p>
            ¡Tu héroe ha recibido un objeto aleatorio! Objeto: {randomItemReceived.data.name}
          </p>
        )}
        {showNextBattle && (
          <button onClick={onNextBattle}>Siguiente Batalla</button>
        )}
        <button onClick={goToHome}>Salir al Home</button>
      </div>
    </div>
  );
};
