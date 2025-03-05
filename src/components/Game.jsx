import { useState, useEffect, useCallback, useRef, useReducer, useMemo } from 'react';
import Bird from './Bird';
import Pipe from './Pipe';
import Cloud from './Cloud';
import Ground from './Ground';
import ThemeSelect from './CharacterSelect';
import { themes } from '../utils/themeLoader';
import scoreAudio from '../assets/sounds/score.mp3';
import backgroundAudio from '../assets/sounds/background.mp3';
import './Game.css';

// Game constants
const CONSTANTS = {
  gravity: 0.4,
  jumpVelocity: -7,
  maxVelocity: 7,
  pipeGap: 60,
  groundHeight: 100,
  pipeSpeed: 2,
  gameWidth: 400,
  gameHeight: 500,
  birdX: 100,
  birdSize: 40,
  pipeWidth: 52,
  minPipeHeight: 100,
  maxPipeHeight: 200,
  pipeSpacing: 600,
  newPipePosition: 800,
  fps: 60
};

// Pipe pool for object reuse
const POOL_SIZE = 100;
const createPipePool = () => Array(POOL_SIZE).fill(null).map(() => ({ id: Math.random() }));
const pipePool = createPipePool();
let nextPipeIndex = 0;

// Initial state
const initialState = {
  birdPosition: 250,
  velocity: 0,
  gameStarted: false,
  gameOver: false,
  score: 0,
  pipePairs: [],
  groundPosition: 0,
  clouds: [
    { id: 1, x: 100, y: 50, speed: 1 },
    { id: 2, x: 300, y: 150, speed: 1.5 },
    { id: 3, x: 500, y: 100, speed: 0.75 },
  ],
  scoredPairs: new Set()
};

/**
 * Get a pipe from the object pool
 * @returns {Object} A pipe object with a unique ID
 */
const getPipeFromPool = () => {
  const pipe = pipePool[nextPipeIndex];
  nextPipeIndex = (nextPipeIndex + 1) % POOL_SIZE;
  return pipe;
};

/**
 * Generate a new pipe pair with random heights
 * @returns {Object} A pipe pair object with position and heights
 */
const generateNewPipe = () => {
  const pipe = getPipeFromPool();
  
  // Generate a random height within the range
  const topHeight = CONSTANTS.minPipeHeight + 
    Math.floor(Math.random() * (CONSTANTS.maxPipeHeight - CONSTANTS.minPipeHeight));
  
  // Calculate bottom height based on game height and pipe gap
  const bottomHeight = CONSTANTS.gameHeight - topHeight - CONSTANTS.pipeGap - CONSTANTS.groundHeight;
  
  return {
    ...pipe,
    x: CONSTANTS.newPipePosition,
    topHeight,
    bottomHeight
  };
};

/**
 * Check if the bird has collided with pipes or boundaries
 * @param {number} birdPosition - The bird's vertical position
 * @param {Array} pipePairs - Array of pipe pairs
 * @returns {boolean} True if collision detected
 */
const checkCollision = (birdPosition, pipePairs) => {
  // Check if bird hit the ground or ceiling
  if (birdPosition >= CONSTANTS.gameHeight - CONSTANTS.groundHeight - CONSTANTS.birdSize || 
      birdPosition <= 0) {
    return true;
  }
  
  // Check for pipe collisions
  return pipePairs.some(pair => {
    if (pair.x < CONSTANTS.birdX + CONSTANTS.birdSize && 
        pair.x + CONSTANTS.pipeWidth > CONSTANTS.birdX) {
      return birdPosition < pair.topHeight || 
             birdPosition + CONSTANTS.birdSize > CONSTANTS.gameHeight - pair.bottomHeight;
    }
    return false;
  });
};

/**
 * Game state reducer
 */
function gameReducer(state, action) {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        gameStarted: true
      };
    
    case 'UPDATE_GAME': {
      if (!state.gameStarted || state.gameOver) return state;

      // Update bird position and velocity
      const newVelocity = Math.min(state.velocity + CONSTANTS.gravity, CONSTANTS.maxVelocity);
      const newBirdPosition = Math.max(0, state.birdPosition + newVelocity);

      // Update ground position
      const newGroundPosition = (state.groundPosition - CONSTANTS.pipeSpeed) % (CONSTANTS.gameWidth * 2);

      // Update clouds
      const newClouds = state.clouds.map(cloud => {
        const newX = cloud.x - cloud.speed;
        return newX < -100 ? 
          { ...cloud, x: 500, y: Math.random() * 200 } :
          { ...cloud, x: newX };
      });

      // Update pipes and scoring
      let newScore = state.score;
      let scoredThisFrame = false;
      
      const newPipePairs = state.pipePairs
        .map(pair => {
          const scoringZone = pair.x + 30;
          // Score when bird passes the pipe
          if (!scoredThisFrame && 
              scoringZone <= CONSTANTS.birdX + CONSTANTS.birdSize && 
              scoringZone > CONSTANTS.birdX && 
              !state.scoredPairs.has(pair.id)) {
            newScore++;
            scoredThisFrame = true;
            action.onScore?.();
          }
          return { ...pair, x: pair.x - CONSTANTS.pipeSpeed };
        })
        .filter(pair => pair.x > -60); // Remove pipes that are off-screen

      // Add new pipe if needed
      if (state.pipePairs.length === 0 || 
          state.pipePairs[state.pipePairs.length - 1].x < CONSTANTS.pipeSpacing) {
        newPipePairs.push(generateNewPipe());
      }

      // Check for collisions
      const collision = checkCollision(newBirdPosition, newPipePairs);

      if (collision) {
        return {
          ...state,
          gameOver: true,
          pipePairs: newPipePairs,
          clouds: newClouds,
          birdPosition: newBirdPosition,
          velocity: newVelocity,
          score: newScore,
          groundPosition: newGroundPosition,
          scoredPairs: state.scoredPairs
        };
      }

      // Update scored pairs
      const newScoredPairs = new Set(state.scoredPairs);
      if (scoredThisFrame) {
        newPipePairs.forEach(pair => {
          const scoringZone = pair.x + 30;
          if (scoringZone <= CONSTANTS.birdX + CONSTANTS.birdSize && 
              scoringZone > CONSTANTS.birdX) {
            newScoredPairs.add(pair.id);
          }
        });
      }

      return {
        ...state,
        pipePairs: newPipePairs,
        clouds: newClouds,
        birdPosition: newBirdPosition,
        velocity: newVelocity,
        score: newScore,
        groundPosition: newGroundPosition,
        scoredPairs: newScoredPairs
      };
    }

    case 'JUMP':
      if (state.gameOver) return state;
      return {
        ...state,
        velocity: CONSTANTS.jumpVelocity,
        gameStarted: true
      };

    case 'RESET':
      return {
        ...initialState,
        clouds: state.clouds // Preserve cloud positions
      };

    default:
      return state;
  }
}

/**
 * Helper function to determine if a value is a color
 */
const isColor = (value) => {
  return typeof value === 'string' && (value.startsWith('#') || value.startsWith('rgb'));
};

/**
 * Main Game component
 */
export default function Game() {
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  // Refs for game loop
  const gameLoopRef = useRef(null);
  const lastUpdateRef = useRef(0);
  const frameInterval = 1000 / CONSTANTS.fps;

  // Audio handlers
  const playScoreSound = useCallback(() => {
    const audio = document.getElementById('scoreSound');
    if (audio) {
      // Stop any currently playing sound first
      audio.pause();
      audio.currentTime = 0;
      
      // Create a clean clone to avoid overlapping sounds
      const soundClone = audio.cloneNode();
      soundClone.volume = 0.3;
      
      // Play the clone and remove it when done
      soundClone.play()
        .then(() => {
          soundClone.addEventListener('ended', () => {
            soundClone.remove();
          });
        })
        .catch(err => console.log('Audio play failed:', err));
    }
  }, []);

  // Background music
  useEffect(() => {
    if (!selectedTheme) return;
    
    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
      if (state.gameStarted && !state.gameOver) {
        bgMusic.volume = 0.1;
        bgMusic.play().catch(err => console.log('Background music failed:', err));
      } else {
        bgMusic.pause();
        bgMusic.currentTime = 0;
      }
    }
  }, [state.gameStarted, state.gameOver, selectedTheme]);

  // Game loop
  const gameLoop = useCallback((timestamp) => {
    if (!state.gameStarted || state.gameOver) return;

    if (timestamp - lastUpdateRef.current >= frameInterval) {
      dispatch({ type: 'UPDATE_GAME', onScore: playScoreSound });
      lastUpdateRef.current = timestamp;
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [state.gameStarted, state.gameOver, playScoreSound, frameInterval]);

  // Start/stop game loop
  useEffect(() => {
    if (!selectedTheme) return;
    
    if (state.gameStarted && !state.gameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [state.gameStarted, state.gameOver, gameLoop, selectedTheme]);

  // Jump handler
  const jump = useCallback(() => {
    dispatch({ type: 'JUMP' });
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [jump]);

  // Game reset handler
  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  // Theme selection handler
  const backToCharacterSelect = useCallback(() => {
    resetGame();
    setSelectedTheme(null);
  }, [resetGame]);

  // Background style - defined even if no theme is selected
  const backgroundStyle = useMemo(() => {
    if (!selectedTheme || !selectedTheme.assets || !selectedTheme.assets.background || selectedTheme.assets.background.length === 0) {
      return { backgroundColor: '#87CEEB' }; // Fallback to sky blue
    }
    
    const bgValue = selectedTheme.assets.background[0];
    return isColor(bgValue)
      ? { backgroundColor: bgValue }
      : { backgroundImage: `url(${bgValue})`, backgroundSize: 'cover' };
  }, [selectedTheme]);

  // Ground container style
  const groundContainerStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: CONSTANTS.groundHeight + 'px',
    overflow: 'hidden',
    zIndex: 2
  };

  // Game container style
  const gameContainerStyle = {
    ...backgroundStyle,
    position: 'relative',
    overflow: 'hidden',
    height: '500px',
    paddingBottom: '0px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column'
  };

  // Show theme selection if no theme is selected
  if (!selectedTheme) {
    return <ThemeSelect onSelect={setSelectedTheme} />;
  }

  // Get theme assets
  const { assets } = selectedTheme;

  return (
    <div className="game" onClick={jump} style={gameContainerStyle}>
      {/* Audio elements */}
      <audio id="scoreSound" src={scoreAudio} preload="auto" />
      <audio id="bgMusic" src={backgroundAudio} loop preload="auto" />
      
      {/* Clouds */}
      {state.clouds.map((cloud) => (
        <Cloud key={cloud.id} x={cloud.x} y={cloud.y} />
      ))}
      
      {/* Bird */}
      <Bird 
        position={state.birdPosition} 
        velocity={state.velocity}
        birdImages={assets.bird}
      />
      
      {/* Pipes */}
      {state.pipePairs.map(pair => (
        <Pipe 
          key={pair.id}
          x={pair.x}
          topHeight={pair.topHeight}
          bottomHeight={pair.bottomHeight}
          topImage={assets.pipes && assets.pipes.length > 0 ? assets.pipes[0] : null}
          bottomImage={assets.pipes && assets.pipes.length > 0 ? assets.pipes[0] : null}
        />
      ))}
      
      {/* Ground */}
      <div style={groundContainerStyle}>
        <Ground 
          groundPosition={state.groundPosition} 
          groundImage={assets.ground && assets.ground.length > 0 ? assets.ground[0] : null} 
        />
      </div>
      
      {/* Start screen */}
      {!state.gameStarted && (
        <div className="start">
          <h2>Flappy Bird</h2>
          <p>Theme: {selectedTheme.name}</p>
          <p>Press Space to Start</p>
        </div>
      )}
      
      {/* Game over screen */}
      {state.gameOver && (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>Score: {state.score}</p>
          <div className="game-over-buttons">
            <button onClick={resetGame}>Play Again</button>
            <button onClick={backToCharacterSelect}>Select Theme</button>
          </div>
        </div>
      )}
      
      {/* Score display */}
      <div className="score">Score: {state.score}</div>
    </div>
  );
} 