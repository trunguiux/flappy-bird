import { memo, useEffect, useState, useMemo } from 'react';
import defaultPipeImage from '../assets/pipe-top.png'; // Default pipe image

const Pipe = ({ x, topHeight, bottomHeight, topImage, bottomImage }) => {
  // Constants
  const BIRD_X = 100;
  const BIRD_SIZE = 40;
  
  // State for pipe width based on image dimensions
  const [pipeWidth, setPipeWidth] = useState(52);
  
  // Use provided image or fall back to default
  const pipeImg = useMemo(() => topImage || defaultPipeImage, [topImage]);
  
  // Calculate if pipe is in collision area
  const showCollisionArea = x < BIRD_X + BIRD_SIZE && x + pipeWidth > BIRD_X;
  
  // Get the natural dimensions of the pipe image
  useEffect(() => {
    if (pipeImg) {
      const img = new Image();
      img.onload = () => {
        setPipeWidth(img.naturalWidth);
      };
      img.src = pipeImg;
    }
  }, [pipeImg]);
  
  // Common styles
  const containerStyle = {
    position: 'absolute',
    width: pipeWidth + 'px',
    left: x + 'px',
    zIndex: 1,
    overflow: 'hidden'
  };
  
  const imageStyle = {
    width: pipeWidth + 'px',
    display: 'block',
    objectFit: 'none'
  };
  
  const collisionStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    border: '2px dashed red',
    boxSizing: 'border-box',
    zIndex: 10,
    pointerEvents: 'none'
  };
  
  return (
    <>
      {/* Top pipe */}
      <div
        style={{
          ...containerStyle,
          height: topHeight + 'px',
          top: 0,
          display: 'flex',
          alignItems: 'flex-end',
          backgroundColor: '#4CAF50' // Fallback color
        }}
      >
        <img 
          src={pipeImg}
          alt="Top pipe"
          style={{
            ...imageStyle,
            transform: 'rotate(180deg)'
          }}
        />
        
        {/* Collision visualization */}
        {showCollisionArea && <div style={collisionStyle} />}
      </div>
      
      {/* Bottom pipe */}
      <div
        style={{
          ...containerStyle,
          height: bottomHeight + 'px',
          bottom: 0,
          display: 'flex',
          alignItems: 'flex-start',
          backgroundColor: '#4CAF50' // Fallback color
        }}
      >
        <img 
          src={pipeImg}
          alt="Bottom pipe"
          style={imageStyle}
        />
        
        {/* Collision visualization */}
        {showCollisionArea && <div style={collisionStyle} />}
      </div>
    </>
  );
};

export default memo(Pipe); 