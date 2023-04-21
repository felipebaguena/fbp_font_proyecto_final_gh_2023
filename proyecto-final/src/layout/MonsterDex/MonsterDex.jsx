import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getDefeatedMonsters } from "../../services/apiCalls";

export function MonsterDex() {
  const heroId = useSelector((state) => state.hero.hero_id);
  const token = useSelector((state) => state.auth.token);
  const [monsters, setMonsters] = useState([]);

  useEffect(() => {
    console.log("Token:", token, "Hero ID:", heroId);
    async function fetchDefeatedMonsters() {
      const response = await getDefeatedMonsters(token, heroId);
      if (response && response.success) {
        setMonsters(response.data);
      } else {
        console.error("Failed to fetch defeated monsters:", response);
      }
    }
    fetchDefeatedMonsters();
  }, [token, heroId]);

  return (
    <div>
      <h3>Defeated Monsters</h3>
      <ul>
        {monsters.map((monster) => (
          <li key={monster.id}>
            {monster.name} (ID: {monster.id})
          </li>
        ))}
      </ul>
    </div>
  );
}
