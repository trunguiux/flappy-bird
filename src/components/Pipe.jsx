import topPipeImage from '../assets/pipe-top.png';  // Add your pipe images
import bottomPipeImage from '../assets/pipe-bottom.png';

export default function Pipe({ x, topHeight, bottomHeight }) {
  const BIRD_X = 100;
  const BIRD_SIZE = 40;
  const PIPE_WIDTH = 60;
  
  const showCollisionArea = x < BIRD_X + BIRD_SIZE && x + PIPE_WIDTH > BIRD_X;

  return (
    <>
      {/* Top pipe */}
      <div
        style={{
          position: 'absolute',
          width: '60px',
          height: `${topHeight}px`,
          left: `${x}px`,
          top: 0,
          backgroundImage: `url(${topPipeImage})`,
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* Bottom pipe */}
      <div
        style={{
          position: 'absolute',
          width: '60px',
          height: `${bottomHeight}px`,
          left: `${x}px`,
          bottom: 0,
          backgroundImage: `url(${bottomPipeImage})`,
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Collision visualization */}
      {showCollisionArea && (
        <>
          <div
            style={{
              position: 'absolute',
              width: '60px',
              height: `${topHeight}px`,
              left: `${x}px`,
              top: 0,
              border: '2px dashed red',
              boxSizing: 'border-box',
              zIndex: 3,
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: '60px',
              height: `${bottomHeight}px`,
              left: `${x}px`,
              bottom: 0,
              border: '2px dashed red',
              boxSizing: 'border-box',
              zIndex: 3,
              pointerEvents: 'none',
            }}
          />
        </>
      )}
    </>
  );
} 