import { memo, useMemo } from 'react';

/**
 * Cloud component for background decoration
 */
const Cloud = ({ x, y }) => {
  // Cloud style with memoization to prevent unnecessary recalculations
  const cloudStyle = useMemo(() => ({
    position: 'absolute',
    left: `${x}px`,
    top: `${y}px`,
    width: '100px',
    height: '40px',
    backgroundColor: 'white',
    borderRadius: '20px',
    opacity: 0.8,
    boxShadow: '0 0 20px rgba(255,255,255,0.5)',
    zIndex: 0,
  }), [x, y]);

  return <div style={cloudStyle} />;
};

export default memo(Cloud); 