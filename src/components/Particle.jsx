import { useState, useEffect, memo, useRef } from 'react';

/**
 * Particle component for visual effects
 * Renders a single animated particle with movement and fading
 */
const Particle = ({ 
  x, 
  y, 
  color, 
  size, 
  angle, 
  speed, 
  offsetX = 0, 
  offsetY = 0, 
  lifetime 
}) => {
  // Animation frame reference
  const frameIdRef = useRef(null);
  
  // Initial particle style
  const [style, setStyle] = useState({
    position: 'absolute',
    left: x + offsetX,
    top: y + offsetY,
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: 'transparent',
    borderRadius: '50%',
    opacity: 0,
    zIndex: 1,
    transform: 'translate3d(0,0,0) scale(0.5)',
    willChange: 'transform, opacity, box-shadow',
    pointerEvents: 'none',
    boxShadow: `0 0 ${size/2}px ${size/4}px ${color}`,
    transition: 'transform 50ms ease-out'
  });

  // Particle animation effect
  useEffect(() => {
    // Start with "pop" animation
    requestAnimationFrame(() => {
      setStyle(prev => ({
        ...prev,
        opacity: 0.95,
        transform: 'translate3d(0,0,0) scale(1.2)'
      }));
    });

    // Animation timing variables
    const startTime = performance.now();
    let lastFrame = startTime;
    
    /**
     * Animation loop function
     * @param {number} currentTime - Current timestamp
     */
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const delta = currentTime - lastFrame;
      lastFrame = currentTime;
      
      const progress = elapsed / lifetime;

      if (progress < 1) {
        // Calculate movement based on angle and speed
        const moveX = Math.cos(angle) * speed * delta / 16;
        const moveY = Math.sin(angle) * speed * delta / 16;
        const fadeOut = progress > 0.6; // Only start fading in last 40%
        
        setStyle(prev => {
          // Extract current transform values
          const translateMatch = prev.transform.match(/translate3d\(([^,]+),([^,]+),([^)]+)\)/);
          
          let currentX = parseFloat(translateMatch?.[1] || '0');
          let currentY = parseFloat(translateMatch?.[2] || '0');
          
          // Update position
          currentX += moveX;
          currentY += moveY;
          
          // Calculate visual properties based on progress
          const scale = fadeOut ? 1.2 - (progress - 0.6) / 0.4 : 1.2;
          const newOpacity = fadeOut ? 0.95 * (1 - (progress - 0.6) / 0.4) : 0.95;
          const shadowSize = size / 2 * (1 - progress * 0.7);
          const shadowBlur = size / 4 * (1 - progress * 0.5);
          
          return {
            ...prev,
            transform: `translate3d(${currentX}px, ${currentY}px, 0) scale(${scale})`,
            opacity: newOpacity,
            boxShadow: `0 0 ${shadowSize}px ${shadowBlur}px ${color}`
          };
        });

        frameIdRef.current = requestAnimationFrame(animate);
      }
    };

    // Start animation
    frameIdRef.current = requestAnimationFrame(animate);

    // Cleanup animation on unmount
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, [x, y, offsetX, offsetY, angle, speed, color, size, lifetime]);

  return <div style={style} />;
};

export default memo(Particle); 