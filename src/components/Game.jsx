import { useState, useEffect, useCallback } from 'react';
import Bird from './Bird';
import Pipe from './Pipe';
import Cloud from './Cloud';
import Ground from './Ground';
import CharacterSelect from './CharacterSelect';
import './Game.css';

export default function Game() {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [birdPosition, setBirdPosition] = useState(250);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [pipePairs, setPipePairs] = useState([]);
  const [clouds, setClouds] = useState([
    { x: 100, y: 50, speed: 1 },
    { x: 300, y: 150, speed: 1.5 },
    { x: 500, y: 100, speed: 0.75 },
  ]);
  const [scoredPairs, setScoredPairs] = useState(new Set());
  
  const gravity = 3;
  const jumpHeight = 50;
  const pipeGap = 150;
  
  // Add audio element
  const scoreSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
  scoreSound.volume = 0.3; // Adjust volume (0.0 to 1.0)
  
  const playScoreSound = () => {
    scoreSound.currentTime = 0; // Reset sound to start
    scoreSound.play().catch(err => console.log('Audio play failed:', err));
  };

  const jump = useCallback(() => {
    if (!gameOver) {
      setBirdPosition(pos => pos - jumpHeight);
      if (!gameStarted) setGameStarted(true);
    }
  }, [gameOver]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault(); // Prevent page scrolling
        jump();
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [jump]);

  const GROUND_HEIGHT = 80;  // Same as ground component height

  useEffect(() => {
    let gameLoop;
    if (gameStarted && !gameOver) {
      gameLoop = setInterval(() => {
        setBirdPosition(pos => pos + gravity);
        
        // Move clouds with parallax effect
        setClouds(currentClouds => 
          currentClouds.map(cloud => ({
            ...cloud,
            x: cloud.x - cloud.speed,
            ...(cloud.x < -100 && { x: 500, y: Math.random() * 200 })
          }))
        );

        setPipePairs(currentPairs => {
          const newPairs = currentPairs
            .map(pair => {
              // Check if bird has passed through the scoring zone
              const birdX = 100; // Bird's fixed X position
              const birdWidth = 40;
              const scoringZone = pair.x + 30; // Middle of the pipe

              if (scoringZone <= birdX + birdWidth && !scoredPairs.has(pair.id)) {
                setScoredPairs(prev => new Set([...prev, pair.id]));
                setScore(s => s + 1);
                playScoreSound();
              }

              return { ...pair, x: pair.x - 5 };
            })
            .filter(pair => pair.x > -60);
            
          if (currentPairs.length === 0 || currentPairs[currentPairs.length - 1].x < 0) {
            const topHeight = Math.random() * 200 + 100;
            newPairs.push({
              id: Date.now(),
              x: 400,
              topHeight,
              bottomHeight: 500 - topHeight - pipeGap
            });
          }
          
          return newPairs;
        });

        // Update collision detection
        const BIRD_X = 100;
        const BIRD_SIZE = 40;
        const PIPE_WIDTH = 60;

        // Update ground collision check
        if (birdPosition <= 0 || birdPosition >= 500 - GROUND_HEIGHT - BIRD_SIZE) {
          setGameOver(true);
        }

        // Check pipe collisions with pairs
        pipePairs.forEach(pair => {
          if (pair.x < BIRD_X + BIRD_SIZE && pair.x + PIPE_WIDTH > BIRD_X) {
            if (birdPosition < pair.topHeight || 
                birdPosition + BIRD_SIZE > 500 - pair.bottomHeight) {
              setGameOver(true);
            }
          }
        });

      }, 20);
    }
    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, birdPosition, pipePairs, scoredPairs]);

  const resetGame = () => {
    setBirdPosition(250);
    setPipePairs([]);
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
    setScoredPairs(new Set());
  };

  const backToCharacterSelect = () => {
    resetGame();
    setSelectedCharacter(null);
  };

  if (!selectedCharacter) {
    return <CharacterSelect onSelect={setSelectedCharacter} />;
  }

  // Pass the selected character to the Bird component
  return (
    <div className="game" onClick={jump}>
      {clouds.map((cloud, i) => (
        <Cloud key={`cloud-${i}`} x={cloud.x} y={cloud.y} />
      ))}
      <Bird position={birdPosition} characterImage={selectedCharacter.image} />
      {pipePairs.map(pair => (
        <Pipe 
          key={pair.id}
          x={pair.x}
          topHeight={pair.topHeight}
          bottomHeight={pair.bottomHeight}
        />
      ))}
      <Ground />
      {!gameStarted && <div className="start">Press Space to Start</div>}
      {gameOver && (
        <div className="game-over">
          Game Over! Score: {Math.floor(score/2)}
          <div className="game-over-buttons">
            <button onClick={resetGame}>Play Again</button>
            <button onClick={backToCharacterSelect}>Select Character</button>
          </div>
        </div>
      )}
      <div className="score">Score: {Math.floor(score/2)}</div>
    </div>
  );
} 