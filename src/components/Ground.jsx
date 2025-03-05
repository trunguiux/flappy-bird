import { memo, useMemo } from 'react';
import defaultGroundImage from '../assets/ground.png';

const Ground = ({ groundPosition, groundImage }) => {
  // Use provided image or fall back to default
  const groundImg = useMemo(() => groundImage || defaultGroundImage, [groundImage]);
  
  // Ground styles
  const groundStyle = {
    position: 'absolute',
    bottom: 0,
    left: `${groundPosition || 0}px`,
    width: '200%',
    height: '100%',
    backgroundImage: `url(${groundImg})`,
    backgroundRepeat: 'repeat-x',
    backgroundPosition: 'bottom',
    backgroundSize: 'auto 100%',
    zIndex: 2
  };
  
  return <div style={groundStyle} />;
};

export default memo(Ground); 