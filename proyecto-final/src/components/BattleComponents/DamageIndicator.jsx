export const DamageIndicator = ({ damage, type }) => {
  const className = `damage-indicator damage-indicator-${type}`;
  const displayDamage = damage === 0 ? "Fallo" : Math.round(damage);

  return <div className={className}>{displayDamage}</div>;
};
