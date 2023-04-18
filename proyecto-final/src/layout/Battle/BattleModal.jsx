export const BattleModal = ({
    showModal,
    onNextBattle,
    message,
    showNextBattle,
    goToHome,
    levelUpValues,
  }) => {
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
          {showNextBattle && (
            <button onClick={onNextBattle}>Siguiente Batalla</button>
          )}
          <button onClick={goToHome}>Salir al Home</button>
        </div>
      </div>
    );
  };