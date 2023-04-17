import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { createBattle, getHeroItems } from "../../services/apiCalls";

export const BattlePage = () => {
  const [battle, setBattle] = useState(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const token = useSelector((state) => state.auth.token);
  const hasFetchedBattle = useRef(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [heroItems, setHeroItems] = useState([]);

  useEffect(() => {

    console.log("Battle data:", battle);
    
    const fetchData = async () => {
      if (!hasFetchedBattle.current) {
        hasFetchedBattle.current = true;
        const data = await createBattle(token);
        if (data && data.status === "success") {
          setBattle(data.data);
        } else {
          console.error("Error fetching battle data:", data);
        }
      }
    };
    fetchData();
  }, [token, battle]);

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

  return (
    <div>
      <h1>Batalla</h1>
      <h2>
        {battle.hero.name} vs {battle.monster.name}
      </h2>
      <p>Vida del héroe: {battle.hero.health}</p>
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
      <p>Vida del monstruo: {battle.monster.health}</p>
      {isPlayerTurn ? (
        <button onClick={handleAttack}>Atacar</button>
      ) : (
        <p>Espera tu turno...</p>
      )}

      {showModal && (
        <div>
          <div>{modalMessage}</div>
        </div>
      )}
    </div>
  );
};
