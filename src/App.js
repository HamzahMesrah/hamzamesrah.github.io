import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Load saved data from localStorage
  const loadFromStorage = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : defaultValue;
  };

  const [grid, setGrid] = useState([]);
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(loadFromStorage('multiplicationGame_score', 0));
  const [gameOver, setGameOver] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(loadFromStorage('multiplicationGame_darkMode', false));
  const [numbers] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

  // Generate random question
  const generateNewQuestion = () => {
    const firstNum = Math.floor(Math.random() * 12) + 1;
    const secondNum = Math.floor(Math.random() * 12) + 1;
    const target = firstNum * secondNum;
    setCurrentQuestion({
      text: `? × ? = ${target}`,
      answer: target
    });
  };

  // Initialize game grid
  const initializeGame = () => {
    const newGrid = [];
    for (let i = 0; i < 8; i++) {
      const row = [];
      for (let j = 0; j < 8; j++) {
        row.push(Math.floor(Math.random() * 12) + 1);
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    generateNewQuestion();
    setSelectedBlocks([]);
  };

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('multiplicationGame_score', JSON.stringify(score));
    localStorage.setItem('multiplicationGame_darkMode', JSON.stringify(darkMode));
  }, [score, darkMode]);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  const handleBlockClick = (row, col) => {
    if (gameOver) return;

    const newSelected = [...selectedBlocks, { row, col, value: grid[row][col] }];
    setSelectedBlocks(newSelected);

    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      const product = first.value * second.value;

      if (product === currentQuestion.answer) {
        const newGrid = [...grid];
        newGrid[first.row][first.col] = null;
        newGrid[second.row][second.col] = null;
        
        for (let i = 0; i < 8; i++) {
          for (let j = 0; j < 8; j++) {
            if (newGrid[i][j] === null) {
              newGrid[i][j] = Math.floor(Math.random() * 12) + 1;
            }
          }
        }

        setGrid(newGrid);
        setScore(score + 10);
        generateNewQuestion();
      } else {
        document.getElementById(`block-${first.row}-${first.col}`).classList.add('shake');
        document.getElementById(`block-${second.row}-${second.col}`).classList.add('shake');
        setTimeout(() => {
          document.getElementById(`block-${first.row}-${first.col}`).classList.remove('shake');
          document.getElementById(`block-${second.row}-${second.col}`).classList.remove('shake');
        }, 500);
      }

      setSelectedBlocks([]);
    }
  };

  const getBlockColor = (value) => {
    const colors = [
      '#FF5733', '#33FF57', '#3357FF', '#FF00FF',
      '#FF33F3', '#33FFF3', '#8A2BE2', '#FF6347',
      '#7CFC00', '#FFD700', '#FF69B4', '#1E90FF'
    ];
    return colors[value - 1] || '#CCCCCC';
  };

  const resetGame = () => {
    setScore(0);
    setGameOver(false);
    initializeGame();
  };

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <h1>Number Crush: Multiplication</h1>
      
      <button 
        className="settings-button"
        onClick={() => setShowSettings(!showSettings)}
      >
        {showSettings ? 'Hide Settings' : 'Settings'}
      </button>
      
{showSettings && (
  <div className="settings-modal">
    <button 
      className="close-button"
      onClick={() => setShowSettings(false)}
    >
      &times;
    </button>
    <h3>Settings</h3>
    <div className="theme-toggle">
      <label>
        <input 
          type="checkbox" 
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
        />
        Dark Mode
      </label>
    </div>
    <button 
      className="clear-data"
      onClick={() => {
        if (window.confirm('Are you sure you want to reset your score?')) {
          resetGame();
        }
      }}
    >
      Reset Score
    </button>
  </div>
)}

      <div className="game-info">
        <div className="question">{currentQuestion?.text}</div>
        <div className="score">Score: {score}</div>
      </div>

      <div className="game-board">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                id={`block-${rowIndex}-${colIndex}`}
                className={`block ${selectedBlocks.some(b => b.row === rowIndex && b.col === colIndex) ? 'selected' : ''}`}
                style={{ backgroundColor: getBlockColor(cell) }}
                onClick={() => handleBlockClick(rowIndex, colIndex)}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>

      {gameOver && (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>Final Score: {score}</p>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  );
}

export default App;
