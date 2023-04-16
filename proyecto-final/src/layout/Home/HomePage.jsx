import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getHeroesAndItems, selectHero } from '../../services/apiCalls';


export const HomePage = () => {
  const [heroes, setHeroes] = useState([]);
  const [selectedHero, setSelectedHero] = useState(null);
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getHeroesAndItems(token);
      setHeroes(data);
      if (data.length > 0) {
        setSelectedHero(data[0].id);
      }
    };
    fetchData();
  }, [token]);

  const startBattle = async () => {
    if (selectedHero) {
      const result = await selectHero(token, selectedHero);
      if (result && result.status === 'success') {
        navigate('/battle');
      } else {
        console.error('Error selecting hero:', result);
      }
    } else {
      console.error('No hero selected');
    }
  };

  return (
    <div>
      <h1>Home</h1>
      <h2>Selecciona un héroe</h2>
      <select value={selectedHero} onChange={(e) => setSelectedHero(e.target.value)}>
        {heroes.map((hero) => (
          <option key={hero.id} value={hero.id}>
            {hero.name}
          </option>
        ))}
      </select>
      <button onClick={startBattle}>Comenzar batalla</button>
    </div>
  );
};
