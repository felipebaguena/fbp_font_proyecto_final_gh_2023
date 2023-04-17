import React, { useState, useEffect } from "react";
import "./Battle.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createBattle,
  getHeroItems,
  levelUpHero,
} from "../../services/apiCalls";

export const BattlePage = () => {
  const [battle, setBattle] = useState(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [heroItems, setHeroItems] = useState([]);
  const [createNewBattle, setCreateNewBattle] = useState(false);
  const [consecutiveWins, setConsecutiveWins] = useState(0);
  const [initialHeroHealth, setInitialHeroHealth] = useState(null);
  const [initialMonsterHealth, setInitialMonsterHealth] = useState(null);
  const [levelUpValues, setLevelUpValues] = useState(null);

  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const getHealthPercentage = (currentHealth, initialHealth) => {
    return (currentHealth / initialHealth) * 100;
  };

  useEffect(() => {
    setCreateNewBattle(true);
  }, []);

  useEffect(() => {
    if (battle) {
      console.log("Battle data:", battle);
    }

    const fetchData = async () => {
      if (createNewBattle) {
        setCreateNewBattle(false);
        const data = await createBattle(token);
        if (data && data.status === "success") {
          setBattle(data.data);
          setInitialHeroHealth(data.data.hero.health);
          setInitialMonsterHealth(data.data.monster.health);
        } else {
          console.error("Error fetching battle data:", data);
        }
      }
    };

    fetchData();
  }, [token, createNewBattle, battle]);

  useEffect(() => {
    const fetchItems = async () => {
      if (battle && battle.hero) {
        const items = await getHeroItems(token, battle.hero.id);
        if (items && items.status === "success") {
          setHeroItems(items.data);
        } else {
          console.error("Error fetching hero items:", items);
        }
      }
    };
    fetchItems();
  }, [battle, token]);

  useEffect(() => {
    if (consecutiveWins === 4 && battle && battle.hero) {
      levelUpHero(token, battle.hero.id)
        .then((response) => {
          if (response.status === "success") {
            console.log("Hero leveled up!");
            setLevelUpValues(response.addedValues);
            setShowModal(true);
          } else {
            console.error("Error leveling up hero:", response.message);
          }
        })
        .catch((error) => {
          console.error("Error leveling up hero:", error);
        });

      setConsecutiveWins(0);
    }
  }, [consecutiveWins, token, battle]);

  const getSelectedItemAttackModifier = () => {
    const selectedItemInt = parseInt(selectedItem);
    const selectedItemObj = heroItems.find(
      (item) => item.id === selectedItemInt
    );
    return selectedItemObj ? selectedItemObj.attack_modifier : 0;
  };

  const getSelectedItemDefenseModifier = () => {
    const selectedItemInt = parseInt(selectedItem);
    const selectedItemObj = heroItems.find(
      (item) => item.id === selectedItemInt
    );
    return selectedItemObj ? selectedItemObj.defense_modifier : 0;
  };

  const goToHome = () => {
    navigate("/");
  };

  const Modal = ({
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

  const handleAttack = async () => {
    if (
      isPlayerTurn &&
      battle &&
      battle.hero &&
      battle.monster &&
      battle.stage
    ) {
      //ATAQUE DEL HÉROE//

      const heroDamage =
        (battle.hero.attack +
          getSelectedItemAttackModifier() +
          battle.stage.attack_modifier) *
        2;
      const monsterDefense = battle.monster.defense;
      const damage = Math.max(0, heroDamage - monsterDefense);

      console.log(
        "Ataque del héroe (incluye modificador de escenario):",
        heroDamage
      );
      console.log("Defensa del monstruo:", monsterDefense);
      console.log("Daño realizado al monstruo:", damage);

      const newMonsterHp = Math.max(0, battle.monster.health - damage);
      setBattle((prevState) => ({
        ...prevState,
        monster: {
          ...prevState.monster,
          health: newMonsterHp,
        },
      }));

      setIsPlayerTurn(false);

      if (newMonsterHp <= 0) {
        setShowModal(true);
        setModalMessage("¡Has vencido al monstruo!");

        setConsecutiveWins((prevWins) => {
          const newWins = prevWins + 1;

          return newWins;
        });
        return;
      }

      //ATAQUE DEL MONSTRUO//

      setTimeout(() => {
        const monsterDamage = battle.monster.attack * 2;
        const heroDefense =
          battle.hero.defense +
          getSelectedItemDefenseModifier() +
          battle.stage.defense_modifier;
        const heroDamageTaken = Math.max(0, monsterDamage - heroDefense);

        console.log("Ataque del monstruo:", monsterDamage);
        console.log(
          "Defensa del héroe (incluye modificador de objeto y escenario):",
          heroDefense
        );
        console.log("Daño realizado al héroe:", heroDamageTaken);

        const newHeroHp = Math.max(0, battle.hero.health - heroDamageTaken);
        setBattle((prevState) => ({
          ...prevState,
          hero: {
            ...prevState.hero,
            health: newHeroHp,
          },
        }));

        if (newHeroHp <= 0) {
          setShowModal(true);
          setModalMessage("Tu héroe ha sido derrotado.");
        } else {
          setIsPlayerTurn(true);
        }
      }, 2000);
    }
  };

  if (!battle) {
    return <div>Loading...</div>;
  }

  const closeModal = () => {
    setShowModal(false);
  };

  const onNextBattle = async () => {
    closeModal();
    setIsPlayerTurn(true);
    setCreateNewBattle(true);
  };

  return (
    <div>
      <h1>Batalla en {battle.stage.name}</h1>
      <h2>
        {battle.hero.name} vs {battle.monster.name}
      </h2>
      <p>Vida del héroe:</p>
      <div className="health-bar">
        <div
          className="health-bar-fill"
          style={{
            width: `${getHealthPercentage(
              battle.hero.health,
              initialHeroHealth
            )}%`,
          }}
        >
          <span className="health-bar-text">{battle.hero.health}</span>
        </div>
      </div>
      <select
        value={selectedItem}
        onChange={(e) => setSelectedItem(e.target.value)}
      >
        <option value="">Selecciona un objeto</option>
        {heroItems.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
      <p>Vida del monstruo:</p>
      <div className="health-bar">
        <div
          className="health-bar-fill"
          style={{
            width: `${getHealthPercentage(
              battle.monster.health,
              initialMonsterHealth
            )}%`,
          }}
        >
          <span className="health-bar-text">{battle.monster.health}</span>
        </div>
      </div>
      {isPlayerTurn ? (
        <button onClick={handleAttack}>Atacar</button>
      ) : (
        <p>Espera tu turno...</p>
      )}

      {showModal && (
        <Modal
          showModal={showModal}
          closeModal={closeModal}
          onNextBattle={onNextBattle}
          message={modalMessage}
          showNextBattle={battle && battle.monster.health <= 0}
          goToHome={goToHome}
          levelUpValues={levelUpValues}
        />
      )}
    </div>
  );
};
