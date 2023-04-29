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
  updateBattleResult,
} from "../../services/apiCalls";
import { BattleModal } from "./BattleModal";
import { BattleTV } from "../../components/BattleTV/BattleTV";
import { BattleControls } from "../../components/BattleComponents/BattleControls";
import InventoryModal from "../../components/BattleComponents/InventoryModal";

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
  const [showMonsterAttackAnimation, setShowMonsterAttackAnimation] = useState(false);
  const [showFlashOverlay, setShowFlashOverlay] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
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
    console.log("Creating a new battle...");
    const fetchData = async () => {
      if (!battle || createNewBattle) {
        setCreateNewBattle(false);
        const data = await createBattle(token);
        if (data && data.status === "success") {
          const adjustedMonsterHealth = calculateAdjustedMonsterHealth(
            data.data.monster,
            data.data.hero
          );
          data.data.monster.health = adjustedMonsterHealth;

          setBattle(data.data);
          setCurrentHeroHealth(data.data.hero.health);
          setCurrentMonsterHealth(adjustedMonsterHealth);
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
    if (battle && battle.hero) {
      const winsNeeded = 2 + battle.hero.level;
      if (consecutiveWins === winsNeeded) {
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
    }
  }, [consecutiveWins, token, battle]);

  const getSelectedItemAttackModifier = () => {
    const selectedItemInt = parseInt(selectedItem);
    const selectedItemObj = heroItems.find(
      (item) => item.id === selectedItemInt
    );
    if (selectedItemObj) {
      const heroLevel = battle.hero.level;
      const itemAttackModifier = selectedItemObj.attack_modifier;
      const itemAttackMultiplier = 1 + heroLevel * 0.05;
      return itemAttackModifier * itemAttackMultiplier;
    }
    return 0;
  };

  const openInventoryModal = () => {
    setShowInventoryModal(true);
  };

  const closeInventoryModal = () => {
    setShowInventoryModal(false);
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

  const randomMultiplier = () => Math.random() * (2.2 - 1.8) + 1.8;

  const calculateAdjustedMonsterAttack = () => {
    const heroLevel = battle.hero.level;
    const damageMultiplier = 1 + heroLevel * 0.1;
    return battle.monster.attack * damageMultiplier;
  };

  const calculateAdjustedMonsterDefense = () => {
    const heroLevel = battle.hero.level;
    const defenseMultiplier = 1 + heroLevel * 0.2;
    return battle.monster.defense * defenseMultiplier;
  };

  function calculateAdjustedMonsterHealth(monster, hero) {
    const heroLevel = hero.level;
    const baseMonsterHealth = monster.health;

    const adjustedHealth = baseMonsterHealth * (1 + (heroLevel - 1) * 0.1);

    return adjustedHealth;
  }

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

      const heroLevel = battle.hero.level;
      console.log("datos del héroe ==>", heroLevel);

      //ATAQUE DEL HÉROE//
      const heroDamage =
        (battle.hero.attack +
          getSelectedItemAttackModifier() +
          battle.stage.attack_modifier) *
        randomMultiplier();
      const monsterDefense = calculateAdjustedMonsterDefense();
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

        updateBattleResult(battle.id, true, token)
          .then((response) => {
            if (response.status === "success") {
              console.log("Resultado de la batalla actualizado correctamente");
            } else {
              console.error(
                "Error actualizando el resultado de la batalla:",
                response.message
              );
            }
          })
          .catch((error) => {
            console.error(
              "Error actualizando el resultado de la batalla:",
              error
            );
          });

        if (Math.random() > 0.5) {
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
    const monsterDamage = calculateAdjustedMonsterAttack() * randomMultiplier();
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

  const getBackgroundColorByRarity = (rare) => {
    const backgroundColors = {
      comun: "common-item",
      raro: "rare-item",
      epico: "epic-item",
      legendario: "legendary-item",
    };
    return backgroundColors[rare] || "";
  };  

const translateRarity = (rarity) =>
  ({
    comun: "Común",
    raro: "Raro",
    epico: "Épico",
    legendario: "Legendario",
  }[rarity] || rarity);

  return (
    <Container fluid>
      <Row className="justify-content-center">
        <Col className="container-table" xs={12} sm={10} lg={8}>
          <BattleTV
            showFlashOverlay={showFlashOverlay}
            showHeroAttackAnimation={showHeroAttackAnimation}
            showMonsterAttackAnimation={showMonsterAttackAnimation}
            battle={battle}
            currentMonsterHealth={currentMonsterHealth}
            currentHeroHealth={currentHeroHealth}
            heroImage={heroImage}
            monsterImage={monsterImage}
            getHealthPercentage={getHealthPercentage}
            getHealthBarColorClass={getHealthBarColorClass}
          />
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={11} sm={10} lg={8} className="controls-container">
          <Col className="mt-3 ">
            {isPlayerTurn && (
              <BattleControls
                handleAttack={handleAttack}
                handleDefense={handleDefense}
                openInventoryModal={openInventoryModal}
                selectedItem={selectedItem}
                findItemById={findItemById}
                getBackgroundColorByRarity={getBackgroundColorByRarity}
                heroPotions={heroPotions}
                handleUsePotion={handleUsePotion}
                PotionComponent={Potion}
                battle={battle}
              />
            )}
            <div className="modal-monster-turn">
              {!isPlayerTurn && !showModal && (
                <p className="battle-title">Es el turno del enemigo...</p>
              )}
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
            <InventoryModal
              showInventoryModal={showInventoryModal}
              closeInventoryModal={closeInventoryModal}
              heroItems={heroItems}
              selectedItemIndex={selectedItemIndex}
              setSelectedItemIndex={setSelectedItemIndex}
              getBackgroundColorByRarity={getBackgroundColorByRarity}
              translateRarity={translateRarity}
              setSelectedItem={setSelectedItem}
            />
          </Col>
        </Col>
      </Row>
    </Container>
  );
};
