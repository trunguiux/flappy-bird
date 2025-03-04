import { useState, useEffect, useRef } from 'react';
import Particle from './Particle';
import './Bird.css';

export default function Bird({ position, characterImage, velocity }) {
  const [particles, setParticles] = useState([]);
  const prevPosition = useRef(position);

  // Calculate rotation based on velocity
  const getRotation = () => {
    if (velocity < -2) return -20; // Point up when moving up fast
    if (velocity > 2) return 20;   // Point down when falling fast
    return 0;                      // Level when moving normally
  };

  useEffect(() => {
    // Only create particles when moving up (jumping)
    if (position < prevPosition.current) {
      const createParticle = () => ({
        id: Date.now() + Math.random(),
        x: 120,
        y: position + 20,
        color: 'rgba(255, 255, 255, 0.8)',
        size: Math.random() * 4 + 2,
        angle: Math.PI + (Math.random() * 0.5 - 0.25),
        speed: Math.random() * 2 + 1,
      });

      setParticles(prev => [
        ...prev,
        createParticle(),
        createParticle(),
        createParticle()
      ]);
    }

    prevPosition.current = position;

    const timer = setTimeout(() => {
      setParticles(prev => prev.filter(p => Date.now() - p.id < 400));
    }, 400);

    return () => clearTimeout(timer);
  }, [position]);

  return (
    <div style={{ position: 'relative' }}>
      {particles.map(particle => (
        <Particle
          key={particle.id}
          x={particle.x}
          y={particle.y}
          color={particle.color}
          size={particle.size}
          angle={particle.angle}
          speed={particle.speed}
        />
      ))}
      <div
        className="preview"
        style={{
          position: 'absolute',
          left: '100px',
          top: `${position}px`,
          width: '40px',
          height: '40px',
          backgroundImage: `url(${characterImage})`,
          backgroundSize: '120px 40px',
          backgroundRepeat: 'no-repeat',
          animation: 'sprite-animation 0.3s steps(3) infinite',
          transform: `scale(1.5) rotate(${getRotation()}deg)`,
          transformOrigin: 'center center',
          zIndex: 2,
        }}
      />
    </div>
  );
} 