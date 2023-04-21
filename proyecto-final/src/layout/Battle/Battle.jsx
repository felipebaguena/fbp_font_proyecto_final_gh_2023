import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, Modal } from "react-bootstrap";
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
  const [levelUpValues, setLevelUpValues] = useState(null);
  const [randomItemReceived, setRandomItemReceived] = useState(null);
  const [heroImage, setHeroImage] = useState(null);
  const [monsterImage, setMonsterImage] = useState(null);

  const [showHeroAttackAnimation, setShowHeroAttackAnimation] = useState(false);
  const [showMonsterAttackAnimation, setShowMonsterAttackAnimation] =
    useState(false);
  const [showFlashOverlay, setShowFlashOverlay] = useState(false);

  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [modalSelectedItem, setModalSelectedItem] = useState(null);

  const [heroPotions, setHeroPotions] = useState(4);
  const [currentHeroHealth, setCurrentHeroHealth] = useState(null);
  const [currentMonsterHealth, setCurrentMonsterHealth] = useState(null);

  const [monsterIsDead, setMonsterIsDead] = useState(false);

  const [heroCurrentDefense, setHeroCurrentDefense] = useState(null);
  const [monsterAttackFailure, setMonsterAttackFailure] = useState(0);

  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const getHealthPercentage = (currentHealth, initialHealth) => {
    return (currentHealth / initialHealth) * 100;
  };

  useEffect(() => {
    setCreateNewBattle(true);
  }, []);

  useEffect(() => {
    if (!isPlayerTurn & !monsterIsDead) {
      setTimeout(() => {
        monsterAttack();
      }, 1500);
    }
  }, [isPlayerTurn, monsterIsDead]);

  useEffect(() => {
    const fetchData = async () => {
      if (!battle || createNewBattle) {
        setCreateNewBattle(false);
        const data = await createBattle(token);
        if (data && data.status === "success") {
          setBattle(data.data);
          setCurrentHeroHealth(data.data.hero.health);
          setCurrentMonsterHealth(data.data.monster.health);
          setHeroCurrentDefense(data.data.hero.defense);
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

  const openInventoryModal = () => {
    setShowInventoryModal(true);
  };

  const closeInventoryModal = () => {
    setShowInventoryModal(false);
  };

  const handleModalItemClick = (item) => {
    setModalSelectedItem(item);
  };

  const findItemById = (id) => {
    return heroItems.find((item) => item.id === id);
  };

  const Potion = ({ index, handleUsePotion, isActive, isClickable }) => {
    const handleClick = () => {
      if (isClickable) {
        handleUsePotion(index);
      }
    };

    return (
      <div
        className={`potion${isActive ? " active" : ""}${
          isClickable ? " clickable" : ""
        }`}
        onClick={handleClick}
      />
    );
  };

  const handleUsePotion = () => {
    if (isPlayerTurn && heroPotions > 0) {
      setHeroPotions((prevPotions) => prevPotions - 1);
      console.log("vida actual del héroe: ", currentHeroHealth);
      const updatedHeroHealth = Math.min(
        battle.hero.health,
        currentHeroHealth + 50
      );
      setCurrentHeroHealth(updatedHeroHealth);
      setIsPlayerTurn(false);
    }
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
      setShowHeroAttackAnimation(true);
      setTimeout(() => {
        setShowHeroAttackAnimation(false);
        setShowFlashOverlay(true);
      }, 300);

      setTimeout(() => {
        setShowFlashOverlay(false);
      }, 1000);

      //ATAQUE DEL HÉROE//

      const heroDamage =
        (battle.hero.attack +
          getSelectedItemAttackModifier() +
          battle.stage.attack_modifier) *
        2;
      const monsterDefense = battle.monster.defense;
      const randomChance = Math.random();
      const failedAttack = randomChance < 0.05;
      const criticalHit = Math.random() < 0.1;
      const damage = failedAttack
        ? 0
        : Math.max(0, heroDamage - monsterDefense) * (criticalHit ? 2 : 1);

      console.log(
        "Ataque del héroe (incluye modificador de escenario):",
        heroDamage
      );
      console.log("Defensa del monstruo:", monsterDefense);
      console.log("Daño realizado al monstruo:", damage);

      const newMonsterHp = Math.max(0, currentMonsterHealth - damage);
      setCurrentMonsterHealth(newMonsterHp);

      setIsPlayerTurn(false);

      if (newMonsterHp <= 0) {
        setShowModal(true);
        setMonsterIsDead(true);
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
    }
  };

  // DEFENSA DEL HÉROE //

  const handleDefense = () => {
    setHeroCurrentDefense((prevDefense) => prevDefense * 1.1);
    setMonsterAttackFailure((prevFailure) => prevFailure + 0.05);
    setIsPlayerTurn(false);
  };

  //ATAQUE DEL MONSTRUO//

  const monsterAttack = () => {
    const monsterDamage = battle.monster.attack * 2;
    const heroDefense =
      heroCurrentDefense +
      getSelectedItemDefenseModifier() +
      battle.stage.defense_modifier;
    const randomChance = Math.random();
    const baseFailureChance = 0.05;
    const failedAttack =
      randomChance < baseFailureChance + monsterAttackFailure;
    const criticalHit = Math.random() < 0.1;
    const heroDamageTaken = failedAttack
      ? 0
      : Math.max(0, monsterDamage - heroDefense) * (criticalHit ? 2 : 1);

    console.log(
      "Probabilidad de fallo del monstruo:",
      (baseFailureChance + monsterAttackFailure) * 100 + "%"
    );

    console.log("Ataque del monstruo:", monsterDamage);
    console.log(
      "Defensa del héroe (incluye modificador de escenario):",
      heroDefense
    );
    console.log("Daño realizado al héroe:", heroDamageTaken);
    console.log("vida actual del héroe en monster attack: ", currentHeroHealth);
    const newHeroHp = Math.max(0, currentHeroHealth - heroDamageTaken);
    setCurrentHeroHealth(newHeroHp);

    setShowMonsterAttackAnimation(true);
    setTimeout(() => {
      setShowMonsterAttackAnimation(false);
      setShowFlashOverlay(true);
    }, 300);

    setTimeout(() => {
      setShowFlashOverlay(false);
    }, 1000);
    console.log("vida actual del héroe en 322: ", currentHeroHealth);
    if (newHeroHp <= 0) {
      setShowModal(true);
      setModalMessage("El monstruo ha derrotado a tu héroe.");
    } else {
      setIsPlayerTurn(true);
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
    setMonsterIsDead(false);
    setMonsterAttackFailure(0);
  };

  return (
    <Container fluid>
      <Row className="justify-content-center">
        <Col xs={11} sm={10} lg={8}>
          <Col xs={12} className="d-flex justify-content-center background-tv">
            <div className="tv-outer-frame d-flex flex-column">
              <div className="tv-inner-frame">
                <div className="tv-screen-box">
                  <div className="scanlines"></div>
                  {showFlashOverlay && <div className="flash-overlay"></div>}
                  <div className="health-bar">
                    <div
                      className={`health-bar-fill ${getHealthPercentage(
                        battle.monster.health,
                        currentMonsterHealth
                      )}`}
                      style={{
                        width: `${getHealthPercentage(
                          currentMonsterHealth,
                          battle.monster.health
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
                        className={`tv-box-hero ${
                          showHeroAttackAnimation ? "hero-attack-animation" : ""
                        }`}
                        src={heroImage}
                        alt={battle.hero.name}
                      />
                    </div>
                    <div className="tv-box-monster">
                      <img
                        className={`${
                          showMonsterAttackAnimation
                            ? "monster-attack-animation"
                            : ""
                        }`}
                        src={monsterImage}
                        alt={battle.monster.name}
                      />
                    </div>
                  </div>
                  <div className="health-bar">
                    <div
                      className={`health-bar-fill ${getHealthBarColorClass(
                        getHealthPercentage(
                          currentHeroHealth,
                          battle.hero.health
                        )
                      )}`}
                      style={{
                        width: `${getHealthPercentage(
                          currentHeroHealth,
                          battle.hero.health
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
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col xs={11} sm={10} lg={8} className="controls-container">
          <Col className="mt-3 ">
            {isPlayerTurn && (
              <div
                className="d-flex justify-content-around mt-3"
                style={{ marginTop: "1rem" }}
              >
                <div className="action-buttons-container">
                  <div>
                    <p className="battle-title">
                      Batalla en {battle.stage.name}
                    </p>
                  </div>
                  <Button
                    variant="dark"
                    onClick={handleAttack}
                    className="attack-button"
                  >
                    Atacar
                  </Button>
                  <Button
                    variant="dark"
                    onClick={handleDefense}
                    className="attack-button defense-button"
                  >
                    Defensa
                  </Button>
                </div>
                <div className="inventory-potion-container">
                  <p className="battle-title">Inventario</p>
                  <Button
                    variant="dark"
                    onClick={openInventoryModal}
                    className="attack-button inventory-button me-3"
                  >
                    {selectedItem
                      ? findItemById(selectedItem).name
                      : "Selecciona un objeto"}
                  </Button>

                  <div className="d-flex justify-content-center potion-button">
                    {Array.from({ length: 4 }, (_, index) => (
                      <Potion
                        key={index}
                        index={index}
                        handleUsePotion={handleUsePotion}
                        isActive={index < heroPotions}
                        isClickable={index < heroPotions}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div className="modal-monster-turn">
              {!isPlayerTurn && !showModal && <p className="battle-title">Es el turno del enemigo...</p>}
              {showModal && (
                <BattleModal
                  showModal={showModal}
                  closeModal={closeModal}
                  onNextBattle={onNextBattle}
                  message={modalMessage}
                  showNextBattle={battle && currentMonsterHealth <= 0}
                  goToHome={goToHome}
                  levelUpValues={levelUpValues}
                  randomItemReceived={randomItemReceived}
                />
              )}
            </div>
            <Modal
              show={showInventoryModal}
              onHide={closeInventoryModal}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Inventario</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {heroItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="dark"
                    className="mb-2"
                    onClick={() => handleModalItemClick(item)}
                  >
                    {item.name}
                  </Button>
                ))}
                {modalSelectedItem && (
                  <div className="mt-3">
                    <h5>Detalles del ítem:</h5>
                    <p>
                      Nombre: {modalSelectedItem.name} <br />
                      Descripción: {modalSelectedItem.description} <br />
                      Modificador de Ataque: +{" "}
                      {modalSelectedItem.attack_modifier} <br />
                      Modificador de Defensa: +{" "}
                      {modalSelectedItem.defense_modifier} <br />
                    </p>
                  </div>
                )}
              </Modal.Body>

              <Modal.Footer>
                <Button
                  variant="success"
                  onClick={() => {
                    if (modalSelectedItem) {
                      setSelectedItem(modalSelectedItem.id);
                      closeInventoryModal();
                    }
                  }}
                  disabled={!modalSelectedItem}
                >
                  Seleccionar ítem
                </Button>
                <Button variant="secondary" onClick={closeInventoryModal}>
                  Cerrar
                </Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </Col>
      </Row>
    </Container>
  );
};
