import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import "./Battle.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  assignRandomItemToSelectedHero,
  createBattle,
  getHeroImage,
  getHeroItems,
  getItemById,
  getMonsterImage,
  levelUpHero,
} from "../../services/apiCalls";
import { BattleModal } from "./BattleModal";

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
  const [randomItemReceived, setRandomItemReceived] = useState(null);
  const [heroImage, setHeroImage] = useState(null);
  const [monsterImage, setMonsterImage] = useState(null);

  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const getHealthPercentage = (currentHealth, initialHealth) => {
    return (currentHealth / initialHealth) * 100;
  };

  useEffect(() => {
    setCreateNewBattle(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!battle || createNewBattle) {
        setCreateNewBattle(false);
        const data = await createBattle(token);
        if (data && data.status === "success") {
          setBattle(data.data);
          setInitialHeroHealth(data.data.hero.health);
          setInitialMonsterHealth(data.data.monster.health);
          if (data.data.hero && data.data.hero.hero_image_id) {
            const heroImage = await getHeroImage(
              data.data.hero.hero_image_id,
              token
            );
            if (heroImage && heroImage.status === "success") {
              setHeroImage(heroImage.data.image_url);
            } else {
              console.error("Error fetching hero image:", heroImage);
            }
          }
          if (data.data.monster && data.data.monster.monster_image_id) {
            const monsterImage = await getMonsterImage(
              data.data.monster.monster_image_id
            );
            if (monsterImage && monsterImage.status === "success") {
              setMonsterImage(monsterImage.data.image_url);
            } else {
              console.error("Error fetching monster image:", monsterImage);
            }
          }
        } else {
          console.error("Error fetching battle data:", data);
        }
      }
    };
    fetchData();
  }, [token, createNewBattle]);

  useEffect(() => {
    const fetchItems = async () => {
      console.log(battle);
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

  const getHealthBarColorClass = (percentage) => {
    if (percentage >= 70) {
      return "health-bar-fill-green";
    } else if (percentage >= 30) {
      return "health-bar-fill-orange";
    } else {
      return "health-bar-fill-red";
    }
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

        if (Math.random() > 0.7) {
          assignRandomItemToSelectedHero(token, battle.hero.id)
            .then(async (response) => {
              if (response.status === "success") {
                const itemData = await getItemById(
                  token,
                  response.data.item_id
                );
                if (itemData) {
                  setRandomItemReceived(itemData);
                  setShowModal(true);
                } else {
                  console.error("Error obteniendo información del objeto");
                }
              } else {
                console.error(
                  "Error asignando objeto aleatorio:",
                  response.message
                );
              }
            })
            .catch((error) => {
              console.error("Error asignando objeto aleatorio:", error);
            });
        } else {
          setRandomItemReceived(null);
        }

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
    setRandomItemReceived(null);
    setCreateNewBattle(true);
    setLevelUpValues(null);
  };

  return (
    <Container>
      <div>
        <h2 className="battle-title">Batalla en {battle.stage.name}</h2>
      </div>
      <Row>
        <Col xs={12}>
          {/* <h2>
            <img src={heroImage} alt={battle.hero.name} />
            {battle.hero.name} vs {battle.monster.name}
            <img src={monsterImage} alt={battle.monster.name} />
          </h2> */}

          {/* <p>Vida del Monstruo:</p> */}
          {/* <div className="health-bar">
            <div
              className={`health-bar-fill ${getHealthBarColorClass(
                getHealthPercentage(battle.monster.health, initialMonsterHealth)
              )}`}
              style={{
                width: `${getHealthPercentage(
                  battle.monster.health,
                  initialMonsterHealth
                )}%`,
              }}
            ></div>
            <div className="health-bar-text-container">
              <span className="health-bar-text">{battle.monster.name}</span>
            </div>
          </div> */}

          <Col xs={12} className="d-flex justify-content-center">
            <div className="tv-outer-frame d-flex flex-column">
              <div className="tv-inner-frame">
                <div className="tv-screen-box">
                <div className="overlay"></div>
                  <div className="health-bar">
                    <div
                      className={`health-bar-fill (
                        getHealthPercentage(
                          battle.monster.health,
                          initialMonsterHealth
                        )
                      )`}
                      style={{
                        width: `${getHealthPercentage(
                          battle.monster.health,
                          initialMonsterHealth
                        )}%`,
                      }}
                    ></div>
                    <div className="health-bar-text-container">
                      <span className="health-bar-text">
                        {battle.monster.name}
                      </span>
                    </div>
                  </div>
                  <div className="tv-box d-flex">
                    <div className="tv-box-hero">
                      <img
                        className="tv-box-hero"
                        src={heroImage}
                        alt={battle.hero.name}
                      />
                    </div>
                    <div className="tv-box-monster">
                      <img src={monsterImage} alt={battle.monster.name} />
                    </div>
                  </div>
                  <div className="health-bar">
                    <div
                      className={`health-bar-fill ${getHealthBarColorClass(
                        getHealthPercentage(
                          battle.hero.health,
                          initialHeroHealth
                        )
                      )}`}
                      style={{
                        width: `${getHealthPercentage(
                          battle.hero.health,
                          initialHeroHealth
                        )}%`,
                      }}
                    ></div>
                    <div className="health-bar-text-container">
                      <span className="health-bar-text">
                        {battle.hero.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-column align-items-center">
                <div className="tv-logo">SONY</div>
                <div className="tv-controls">
                  <div className="tv-control-knob"></div>
                  <div className="tv-control-knob"></div>
                  <div className="tv-control-knob"></div>
                  <div className="tv-control-knob"></div>
                  <div className="tv-control-knob"></div>
                </div>
              </div>
            </div>
          </Col>

          {/* <p>Vida del Héroe:</p> */}
          {/* <div className="health-bar">
            <div
              className={`health-bar-fill ${getHealthBarColorClass(
                getHealthPercentage(battle.hero.health, initialHeroHealth)
              )}`}
              style={{
                width: `${getHealthPercentage(
                  battle.hero.health,
                  initialHeroHealth
                )}%`,
              }}
            ></div>
            <div className="health-bar-text-container">
              <span className="health-bar-text">{battle.hero.name}</span>
            </div>
          </div> */}
        </Col>

        <Col className="mt-3">
          {isPlayerTurn && (
            <div
              className="d-flex justify-content-center mt-3"
              style={{ marginTop: "1rem" }}
            >
              <div className="action-buttons-container">
                <Button
                  variant="dark"
                  onClick={handleAttack}
                  className="attack-button me-3"
                >
                  Atacar
                </Button>
                <Form.Select
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                >
                  <option value="">Selecciona un objeto</option>
                  {heroItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </div>
          )}
          <div className="modal-monster-turn">
            {!isPlayerTurn && !showModal && <p>Es el turno del enemigo...</p>}
            {showModal && (
              <BattleModal
                showModal={showModal}
                closeModal={closeModal}
                onNextBattle={onNextBattle}
                message={modalMessage}
                showNextBattle={battle && battle.monster.health <= 0}
                goToHome={goToHome}
                levelUpValues={levelUpValues}
                randomItemReceived={randomItemReceived}
              />
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};
