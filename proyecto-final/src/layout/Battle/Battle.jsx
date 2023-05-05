import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Battle.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  assignRandomItemToSelectedHero,
  createBattle,
  getHeroItems,
  getItemById,
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
  const [showMonsterAttackAnimation, setShowMonsterAttackAnimation] =
    useState(false);
  const [showFlashOverlay, setShowFlashOverlay] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [heroPotions, setHeroPotions] = useState(4);
  const [currentHeroHealth, setCurrentHeroHealth] = useState(null);
  const [currentMonsterHealth, setCurrentMonsterHealth] = useState(null);
  const [monsterIsDead, setMonsterIsDead] = useState(false);
  const [heroCurrentDefense, setHeroCurrentDefense] = useState(null);
  const [monsterAttackFailure, setMonsterAttackFailure] = useState(0);

  const [heroDamage, setHeroDamage] = useState(null);
  const [monsterDamage, setMonsterDamage] = useState(null);
  const [heroAttackFailed, setHeroAttackFailed] = useState(false);
  const [monsterAttackFailed, setMonsterAttackFailed] = useState(false);
  const [isCriticalHit, setIsCriticalHit] = useState(false);
  const [defenseCount, setDefenseCount] = useState(0);
  const [hasCreatedBattle, setHasCreatedBattle] = useState(false);

  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  // Timer para el daño mostrado en BattleTV

  useEffect(() => {
    if (heroDamage !== null || monsterDamage !== null) {
      const timer = setTimeout(() => {
        setHeroDamage(null);
        setMonsterDamage(null);
        setHeroAttackFailed(false);
        setMonsterAttackFailed(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [heroDamage, monsterDamage]);

  // Cálculo de porcentaje para barras de vida

  const getHealthPercentage = (currentHealth, initialHealth) => {
    return (currentHealth / initialHealth) * 100;
  };

  // Creación de batalla cuando se monta el componente

  useEffect(() => {
    setCreateNewBattle(true);
  }, []);

  // Rotación de turnos

  useEffect(() => {
    if (!isPlayerTurn & !monsterIsDead) {
      setTimeout(() => {
        monsterAttack();
      }, 1500);
    }
  }, [isPlayerTurn, monsterIsDead]);

  // Creación de nuevas batallas

  useEffect(() => {
    const fetchData = async () => {
      if ((!battle || createNewBattle) && !hasCreatedBattle) {
        setCreateNewBattle(false);
        setHasCreatedBattle(true);
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

          if (data.data.hero && data.data.hero.hero_image) {
            const heroImage = data.data.hero.hero_image.image_url;
            setHeroImage(heroImage);
          }

          if (data.data.monster && data.data.monster.monster_image) {
            const monsterImage = data.data.monster.monster_image.image_url;
            setMonsterImage(monsterImage);
          }
        } else {
          console.error("Error fetching battle data:", data);
        }
      }
    };

    if (createNewBattle) {
      fetchData();
    }
  }, [token, createNewBattle]);

  // LLamada a la API para traer los ítems del héroe

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

  // Subida de nivel del héroe (la subida se ejecuta sumando el nivel actual del héroe más dos)

  useEffect(() => {
    if (battle && battle.hero) {
      const winsNeeded = 2 + battle.hero.level;
      if (consecutiveWins === winsNeeded) {
        levelUpHero(token, battle.hero.id)
          .then((response) => {
            if (response.status === "success") {
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

  // Modificador para el ataque del héroe con respecto al nivel del héroe

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

  // Modales de apertura y cierre de inventario

  const openInventoryModal = () => {
    setShowInventoryModal(true);
  };

  const closeInventoryModal = () => {
    setShowInventoryModal(false);
  };

  const findItemById = (id) => {
    return heroItems.find((item) => item.id === id);
  };

  // Uso de pociones

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
      const updatedHeroHealth = Math.min(
        battle.hero.health,
        currentHeroHealth + 70
      );
      setCurrentHeroHealth(updatedHeroHealth);
      setIsPlayerTurn(false);
    }
  };

  // Modificador para la defensa del héroe en base al ítem seleccionado

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

  // Clases para los colores de la barra de vida

  const getHealthBarColorClass = (percentage) => {
    if (percentage >= 70) {
      return "health-bar-fill-green";
    } else if (percentage >= 30) {
      return "health-bar-fill-orange";
    } else {
      return "health-bar-fill-red";
    }
  };

  // Multiplicador para resultado aleatorio en combate

  const randomMultiplier = () => Math.random() * (2.2 - 1.8) + 1.8;

  // Ajustes de ataque, vida y defensa para el monstruo con respecto al nivel del héroe

  const calculateAdjustedMonsterAttack = () => {
    const heroLevel = battle.hero.level;
    const damageMultiplier = 1 + heroLevel * 0.15;
    return battle.monster.attack * damageMultiplier;
  };

  const calculateAdjustedMonsterDefense = () => {
    const heroLevel = battle.hero.level;
    const defenseMultiplier = 1 + heroLevel * 0.3;
    return battle.monster.defense * defenseMultiplier;
  };

  function calculateAdjustedMonsterHealth(monster, hero) {
    const heroLevel = hero.level;
    const baseMonsterHealth = monster.health;

    const adjustedHealth = baseMonsterHealth * (1 + (heroLevel - 1) * 0.1);
    return adjustedHealth;
  }

  // ATTAQUE Y DEFENSA EN BATALLA

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

      //ATAQUE DEL HÉROE

      const heroDamage =
        (battle.hero.attack +
          getSelectedItemAttackModifier() +
          battle.stage.attack_modifier) *
        randomMultiplier();
      const monsterDefense = calculateAdjustedMonsterDefense();
      const randomChance = Math.random();
      const failedAttack = randomChance < 0.05;
      setHeroAttackFailed(failedAttack);
      const criticalHit = Math.random() < 0.1;
      setIsCriticalHit(criticalHit);
      const damage = failedAttack
        ? 0
        : Math.max(0, heroDamage - monsterDefense) * (criticalHit ? 2 : 1);

      setHeroDamage(damage);

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

  // DEFENSA DEL HÉROE

  const handleDefense = () => {
    if (defenseCount < 4) {
      setDefenseCount((prevCount) => prevCount + 1);
      setHeroCurrentDefense((prevDefense) => prevDefense * 1.1);
      setMonsterAttackFailure((prevFailure) => prevFailure + 0.05);
    } else {
      console.log("Has alcanzado el límite de 4 defensas.");
    }
    setIsPlayerTurn(false);
  };

  // ATAQUE DEL MONSTRUO

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
    setMonsterAttackFailed(failedAttack);
    const criticalHit = Math.random() < 0.1;
    setIsCriticalHit(criticalHit);
    const heroDamageTaken = failedAttack
      ? 0
      : Math.max(0, monsterDamage - heroDefense) * (criticalHit ? 2 : 1);

    setMonsterDamage(heroDamageTaken);

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

    if (newHeroHp <= 0) {
      setShowModal(true);
      setModalMessage("El monstruo ha derrotado a tu héroe.");
    } else {
      setIsPlayerTurn(true);
    }
  };

  if (!battle) {
    return <p className="battle-title">Cargando...</p>;
  }

  const closeModal = () => {
    setShowModal(false);
  };

  // Gestión de siguiente batalla

  const onNextBattle = async () => {
    closeModal();
    setIsPlayerTurn(true);
    setRandomItemReceived(null);
    setCreateNewBattle(true);
    setLevelUpValues(null);
    setMonsterIsDead(false);
    setMonsterAttackFailure(0);
    setHasCreatedBattle(false);
    setDefenseCount(0);
  };

  // Colores por rareza en el inventario

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
            heroDamage={heroDamage}
            monsterDamage={monsterDamage}
            heroAttackFailed={heroAttackFailed}
            monsterAttackFailed={monsterAttackFailed}
            isCriticalHit={isCriticalHit}
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
                defenseCount={defenseCount}
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
