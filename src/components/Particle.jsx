import { useState, useEffect } from 'react';

export default function Particle({ x, y, color, size, angle, speed }) {
  const [position, setPosition] = useState({ x, y });
  const [opacity, setOpacity] = useState(0.8);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 400;
    let animationFrame;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = elapsed / duration;

      if (progress < 1) {
        setPosition(prev => ({
          x: prev.x + Math.cos(angle) * speed,
          y: prev.y + Math.sin(angle) * speed
        }));
        setOpacity(0.8 * (1 - progress));
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [angle, speed]);

  return (
    <div
      className="particle"
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        borderRadius: '50%',
        opacity,
        zIndex: 1,
      }}
    />
  );
} 