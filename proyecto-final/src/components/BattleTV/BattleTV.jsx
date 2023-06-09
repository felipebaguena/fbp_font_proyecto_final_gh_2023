import React, { useState, useEffect } from "react";
import { Col } from "react-bootstrap";
import { DamageIndicator } from "../BattleComponents/DamageIndicator";

export const BattleTV = ({
  showFlashOverlay,
  showHeroAttackAnimation,
  showMonsterAttackAnimation,
  battle,
  currentMonsterHealth,
  currentHeroHealth,
  heroImage,
  monsterImage,
  getHealthPercentage,
  getHealthBarColorClass,
  heroDamage,
  monsterDamage,
  heroAttackFailed,
  monsterAttackFailed,
  isCriticalHit,
}) => {
  const [bgImage, setBgImage] = useState("");

  // Imágenes aleatorias para mostrar en el monitor crt

  useEffect(() => {
    const images = [
      "/images/textures/BIGLEAVES.png",
      "/images/textures/DIRT.png",
      "/images/textures/FLATSTONES.png",
      "/images/textures/GOLDROCKS.png",
      "/images/textures/GRAYROCKS.png",
      "/images/textures/ICEYROCKS.png",
      "/images/textures/PATHROCKS.png",
      "/images/textures/SAND.png",
      "/images/textures/TINYLEAVES.png",
    ];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setBgImage(randomImage);
  }, [battle]);

  return (
    <Col xs={12} className="d-flex justify-content-center background-tv">
      <div className="table"></div>
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
                <span className="health-bar-text">{battle.monster.name}</span>
              </div>
            </div>
            <div className="tv-box d-flex">
              <div className="tv-box-hero">
                {monsterAttackFailed ? (
                  <DamageIndicator damage={0} type="hero" />
                ) : (
                  monsterDamage !== null && (
                    <DamageIndicator
                      damage={monsterDamage}
                      type="hero"
                      isCriticalHit={isCriticalHit}
                    />
                  )
                )}

                <img
                  className={`tv-box-hero ${
                    showHeroAttackAnimation ? "hero-attack-animation" : ""
                  }`}
                  src={heroImage}
                  alt={battle.hero.name}
                />
                <div
                  className={`tv-box-hero-shadow ${
                    showHeroAttackAnimation
                      ? "shadow-hero-attack-animation"
                      : ""
                  }`}
                ></div>
              </div>

              <div className="tv-box-monster">
                {heroAttackFailed ? (
                  <DamageIndicator damage={0} type="monster" />
                ) : (
                  heroDamage !== null && (
                    <DamageIndicator
                      damage={heroDamage}
                      type="monster"
                      isCriticalHit={isCriticalHit}
                    />
                  )
                )}

                <img
                  className={`${
                    showMonsterAttackAnimation ? "monster-attack-animation" : ""
                  }`}
                  src={monsterImage}
                  alt={battle.monster.name}
                />
                <div
                  className={`tv-box-hero-shadow tv-box-monster-shadow ${
                    showMonsterAttackAnimation
                      ? "shadow-monster-attack-animation"
                      : ""
                  }`}
                ></div>
              </div>
              <div
                className="ground ground-texture"
                style={{ backgroundImage: `url(${bgImage})` }}
              ></div>
            </div>
            <div className="health-bar">
              <div
                className={`health-bar-fill ${getHealthBarColorClass(
                  getHealthPercentage(currentHeroHealth, battle.hero.health)
                )}`}
                style={{
                  width: `${getHealthPercentage(
                    currentHeroHealth,
                    battle.hero.health
                  )}%`,
                }}
              ></div>
              <div className="health-bar-text-container">
                <span className="health-bar-text">{battle.hero.name}</span>
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
  );
};
