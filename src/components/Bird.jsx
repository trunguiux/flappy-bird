import { useState, useEffect, useRef } from 'react';
import Particle from './Particle';

export default function Bird({ position, characterImage }) {
  const [particles, setParticles] = useState([]);
  const prevPosition = useRef(position);

  useEffect(() => {
    // Only create particles when moving up (jumping)
    if (position < prevPosition.current) {
      const createParticle = () => ({
        id: Date.now() + Math.random(),
        x: 120, // Slightly behind the bird
        y: position + 20, // Center of bird
        color: 'rgba(255, 255, 255, 0.8)', // More visible
        size: Math.random() * 4 + 2, // Slightly larger
        angle: Math.PI + (Math.random() * 0.5 - 0.25), // Mostly left direction
        speed: Math.random() * 2 + 1, // Faster movement
      });

      // Create multiple particles per jump
      setParticles(prev => [
        ...prev,
        createParticle(),
        createParticle(),
        createParticle()
      ]);
    }

    prevPosition.current = position;

    // Cleanup old particles
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
        style={{
          position: 'absolute',
          width: '40px',
          height: '40px',
          left: '100px',
          top: `${position}px`,
          backgroundImage: `url(${characterImage})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          transition: 'top 0.1s ease',
          zIndex: 2,
        }}
      />
    </div>
  );
} 