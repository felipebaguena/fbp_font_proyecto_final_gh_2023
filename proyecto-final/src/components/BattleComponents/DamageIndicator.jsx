export const DamageIndicator = ({ damage, type, isCriticalHit }) => {
    const className = `damage-indicator damage-indicator-${type}${
      isCriticalHit ? " damage-indicator-critical" : ""
    }`;
    const displayDamage = damage === 0 ? "Fallo" : Math.round(damage);
  
    return <div className={className}>{displayDamage}</div>;
  };