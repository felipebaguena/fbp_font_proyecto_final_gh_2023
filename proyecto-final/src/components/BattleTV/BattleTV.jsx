import React from "react";
import { Col } from "react-bootstrap";

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
}) => {
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
                    showMonsterAttackAnimation ? "monster-attack-animation" : ""
                  }`}
                  src={monsterImage}
                  alt={battle.monster.name}
                />
              </div>
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
