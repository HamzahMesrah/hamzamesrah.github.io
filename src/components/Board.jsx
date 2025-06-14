import React from 'react';
import Player from './Player';

const Board = ({ players, boardSize, currentPlayer }) => {
  const renderSpaces = () => {
    const spaces = [];
    const center = { x: 50, y: 50 }; // Center of the spiral
    const angleStep = (2 * Math.PI) / boardSize;
    const radiusStep = 5;
    
    for (let i = 0; i < boardSize; i++) {
      const radius = 10 + (i * radiusStep / 2);
      const angle = i * angleStep;
      const x = center.x + radius * Math.cos(angle);
      const y = center.y + radius * Math.sin(angle);
      
      // Determine table for this space (cycling through 2-12)
      const table = 2 + (i % 11);
      
      spaces.push(
        <div 
          key={i}
          className={`board-space table-${table}`}
          style={{
            left: `${x}%`,
            top: `${y}%`,
            backgroundColor: getTableColor(table)
          }}
        >
          {i === boardSize - 1 ? '🏆' : table}
        </div>
      );
    }
    
    return spaces;
  };
  
  const getTableColor = (table) => {
    const colors = [
      '#FF5733', '#33FF57', '#3357FF', '#F3FF33', 
      '#FF33F3', '#33FFF3', '#8A2BE2', '#FF6347',
      '#7CFC00', '#FFD700', '#FF69B4', '#1E90FF'
    ];
    return colors[table - 2] || '#CCCCCC';
  };
  
  return (
    <div className="board">
      {renderSpaces()}
      {players.map((player, index) => (
        <Player 
          key={player.id}
          player={player}
          boardSize={boardSize}
          isCurrent={index === currentPlayer}
        />
      ))}
    </div>
  );
};

export default Board;
