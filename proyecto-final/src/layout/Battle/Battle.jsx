import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { createBattle, getHeroItems } from '../../services/apiCalls';

export const BattlePage = () => {
  const [battle, setBattle] = useState(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const token = useSelector((state) => state.auth.token);
  const hasFetchedBattle = useRef(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [heroItems, setHeroItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!hasFetchedBattle.current) {
        hasFetchedBattle.current = true;
        const data = await createBattle(token);
        if (data && data.status === 'success') {
          setBattle(data.data);
        } else {
          console.error('Error fetching battle data:', data);
        }
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    const fetchItems = async () => {
      if (battle && battle.hero) {
        const items = await getHeroItems(token, battle.hero.id);
        if (items && items.status === 'success') {
          setHeroItems(items.data);
        } else {
          console.error('Error fetching hero items:', items);
        }
      }
    };
    fetchItems();
  }, [battle, token]);

  const handleAttack = async () => {
    if (isPlayerTurn) {

        //ATAQUE DEL HÉROE//

      const damage = battle.hero.attack * 2;
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
        setModalMessage('¡Has vencido al monstruo!');
        return;
      }

        //ATAQUE DEL MONSTRUO//

      setTimeout(() => {
        const monsterDamage = battle.monster.attack;
        const newHeroHp = Math.max(0, battle.hero.health - monsterDamage);
        setBattle((prevState) => ({
          ...prevState,
          hero: {
            ...prevState.hero,
            health: newHeroHp,
          },
        }));

        if (newHeroHp <= 0) {
          setShowModal(true);
          setModalMessage('Tu héroe ha sido derrotado.');
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
      <select value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)}>
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