import { useState, useEffect, useCallback, useRef, memo, useReducer } from 'react';
import Bird from './Bird';
import Pipe from './Pipe';
import Cloud from './Cloud';
import Ground from './Ground';
import CharacterSelect from './CharacterSelect';
import scoreAudio from '../assets/sounds/score.mp3';
import backgroundAudio from '../assets/sounds/background.mp3';
import './Game.css';

// Memoize components that don't need frequent updates
const MemoizedBird = memo(Bird);
const MemoizedPipe = memo(Pipe);
const MemoizedCloud = memo(Cloud);
const MemoizedGround = memo(Ground);

// Object pools
const POOL_SIZE = 10;
const pipePool = Array(POOL_SIZE).fill(null).map(() => ({ id: Math.random() }));
let nextPipeIndex = 0;

const getPipeFromPool = () => {
  const pipe = pipePool[nextPipeIndex];
  nextPipeIndex = (nextPipeIndex + 1) % POOL_SIZE;
  return pipe;
};

// Initial state
const initialState = {
  birdPosition: 250,
  velocity: 0,
  gameStarted: false,
  gameOver: false,
  score: 0,
  pipePairs: [],
  clouds: [
    { id: 1, x: 100, y: 50, speed: 1 },
    { id: 2, x: 300, y: 150, speed: 1.5 },
    { id: 3, x: 500, y: 100, speed: 0.75 },
  ],
  scoredPairs: new Set()
};

// Game constants
const CONSTANTS = {
  gravity: 0.4,
  jumpVelocity: -7,
  maxVelocity: 7,
  pipeGap: 150,
  groundHeight: 80,
  pipeSpeed: 4,
  gameWidth: 400,
  gameHeight: 500,
  birdX: 100,
  birdSize: 40,
  pipeWidth: 60
};

// Reducer for game state
function gameReducer(state, action) {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        gameStarted: true
      };
    
    case 'UPDATE_GAME': {
      if (!state.gameStarted || state.gameOver) return state;

      const newVelocity = Math.min(state.velocity + CONSTANTS.gravity, CONSTANTS.maxVelocity);
      const newBirdPosition = Math.max(0, state.birdPosition + newVelocity);

      // Update clouds with minimal object creation
      const newClouds = state.clouds.map(cloud => {
        const newX = cloud.x - cloud.speed;
        return newX < -100 ? 
          { ...cloud, x: 500, y: Math.random() * 200 } :
          { ...cloud, x: newX };
      });

      // Update pipes with object pooling
      let newScore = state.score;
      let newScoredPairs = state.scoredPairs;
      const newPipePairs = state.pipePairs
        .map(pair => {
          const scoringZone = pair.x + 30;
          if (scoringZone <= CONSTANTS.birdX + CONSTANTS.birdSize && !state.scoredPairs.has(pair.id)) {
            newScore++;
            newScoredPairs = new Set([...newScoredPairs, pair.id]);
            action.onScore?.();
          }
          return { ...pair, x: pair.x - CONSTANTS.pipeSpeed };
        })
        .filter(pair => pair.x > -60);

      // Add new pipe if needed
      if (state.pipePairs.length === 0 || state.pipePairs[state.pipePairs.length - 1].x < 50) {
        const pipe = getPipeFromPool();
        const topHeight = Math.random() * 200 + 100;
        newPipePairs.push({
          ...pipe,
          x: 400,
          topHeight,
          bottomHeight: CONSTANTS.gameHeight - topHeight - CONSTANTS.pipeGap
        });
      }

      // Check collisions
      const collision = newBirdPosition >= CONSTANTS.gameHeight - CONSTANTS.groundHeight - CONSTANTS.birdSize ||
        newBirdPosition <= 0 ||
        newPipePairs.some(pair => {
          if (pair.x < CONSTANTS.birdX + CONSTANTS.birdSize && 
              pair.x + CONSTANTS.pipeWidth > CONSTANTS.birdX) {
            return newBirdPosition < pair.topHeight || 
                   newBirdPosition + CONSTANTS.birdSize > CONSTANTS.gameHeight - pair.bottomHeight;
          }
          return false;
        });

      if (collision) {
        return {
          ...state,
          gameOver: true,
          pipePairs: newPipePairs,
          clouds: newClouds,
          birdPosition: newBirdPosition,
          velocity: newVelocity,
          score: newScore,
          scoredPairs: newScoredPairs
        };
      }

      return {
        ...state,
        pipePairs: newPipePairs,
        clouds: newClouds,
        birdPosition: newBirdPosition,
        velocity: newVelocity,
        score: newScore,
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

export default function Game() {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  // Refs for game loop
  const gameLoopRef = useRef(null);
  const lastUpdateRef = useRef(0);
  const FPS = 60;
  const frameInterval = 1000 / FPS;

  // Audio handlers
  const playScoreSound = useCallback(() => {
    const audio = document.getElementById('scoreSound');
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(err => console.log('Audio play failed:', err));
    }
  }, []);

  // Background music
  useEffect(() => {
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
  }, [state.gameStarted, state.gameOver]);

  // Game loop
  const gameLoop = useCallback((timestamp) => {
    if (!state.gameStarted || state.gameOver) return;

    if (timestamp - lastUpdateRef.current >= frameInterval) {
      dispatch({ type: 'UPDATE_GAME', onScore: playScoreSound });
      lastUpdateRef.current = timestamp;
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [state.gameStarted, state.gameOver, playScoreSound]);

  // Start/stop game loop
  useEffect(() => {
    if (state.gameStarted && !state.gameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [state.gameStarted, state.gameOver, gameLoop]);

  const jump = useCallback(() => {
    dispatch({ type: 'JUMP' });
  }, []);

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

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const backToCharacterSelect = useCallback(() => {
    resetGame();
    setSelectedCharacter(null);
  }, [resetGame]);

  if (!selectedCharacter) {
    return <CharacterSelect onSelect={setSelectedCharacter} />;
  }

  return (
    <div className="game" onClick={jump}>
      <audio id="scoreSound" src={scoreAudio} preload="auto" />
      <audio id="bgMusic" src={backgroundAudio} loop preload="auto" />
      {state.clouds.map((cloud) => (
        <MemoizedCloud key={cloud.id} x={cloud.x} y={cloud.y} />
      ))}
      <MemoizedBird 
        position={state.birdPosition} 
        characterImage={selectedCharacter.spriteSheet}
        velocity={state.velocity}
      />
      {state.pipePairs.map(pair => (
        <MemoizedPipe 
          key={pair.id}
          x={pair.x}
          topHeight={pair.topHeight}
          bottomHeight={pair.bottomHeight}
        />
      ))}
      <MemoizedGround />
      {!state.gameStarted && <div className="start">Press Space to Start</div>}
      {state.gameOver && (
        <div className="game-over">
          Game Over! Score: {state.score}
          <div className="game-over-buttons">
            <button onClick={resetGame}>Play Again</button>
            <button onClick={backToCharacterSelect}>Select Character</button>
          </div>
        </div>
      )}
      <div className="score">Score: {state.score}</div>
    </div>
  );
} 