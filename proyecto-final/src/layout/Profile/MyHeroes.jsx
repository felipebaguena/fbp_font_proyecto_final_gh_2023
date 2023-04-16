import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getHeroesAndItems } from "../../services/apiCalls";


export const HeroesAndItems = () => {
  const [heroes, setHeroes] = useState([]);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getHeroesAndItems(token);
      setHeroes(data);
    };
    fetchData();
  }, [token]);

  return (
    <div>
      <h1>Mis Héroes y sus Items</h1>
      <form>
        {heroes.map((hero, index) => (
          <div key={index}>
            <h2>{hero.name}</h2>
            <ul>
              {hero.items.map((item, itemIndex) => (
                <li key={itemIndex}>{item.name}</li>
              ))}
            </ul>
          </div>
        ))}
      </form>
    </div>
  );
};
