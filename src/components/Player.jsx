import React from 'react';

const Player = ({ player, boardSize, isCurrent }) => {
  const center = { x: 50, y: 50 };
  const angleStep = (2 * Math.PI) / boardSize;
  const radiusStep = 5;
  
  const radius = 10 + (player.position * radiusStep / 2);
  const angle = player.position * angleStep;
  const x = center.x + radius * Math.cos(angle);
  const y = center.y + radius * Math.sin(angle);
  
  return (
    <div 
      className={`player ${isCurrent ? 'current' : ''}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        backgroundColor: player.color
      }}
    >
      {player.name.charAt(0)}
    </div>
  );
};

export default Player;
