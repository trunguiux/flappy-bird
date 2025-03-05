import { useState, useEffect, useRef, memo, useMemo } from 'react';
import Particle from './Particle';
import './Bird.css';
// Use the correct path to the bird sprite
import defaultBirdImage from '../assets/characters/bird1_sprite.png';

const PARTICLE_LIFETIME = 200; // Slightly longer for visibility
const PARTICLES_PER_JUMP = 4; // Create a burst of particles

// Define particle colors for variation
const PARTICLE_COLORS = [
  'rgba(255, 255, 255, 0.9)', // White
  'rgba(255, 236, 179, 0.9)', // Light yellow
  'rgba(173, 216, 230, 0.9)', // Light blue
  'rgba(240, 248, 255, 0.9)'  // Alice blue
];

/**
 * Bird component with particle effects
 */
const Bird = ({ position, velocity, birdImages }) => {
  // State and refs
  const [particles, setParticles] = useState([]);
  const prevPosition = useRef(position);
  const lastJumpTime = useRef(0);
  
  // Use provided images or fall back to default
  const birdImage = useMemo(() => 
    birdImages && birdImages.length > 0 ? birdImages[0] : defaultBirdImage, 
    [birdImages]
  );
  
  // Calculate rotation based on velocity
  const rotation = useMemo(() => {
    if (velocity < -2) return -20;
    if (velocity > 2) return 20;
    return 0;
  }, [velocity]);
  
  // Bird style
  const birdStyle = {
    position: 'absolute',
    left: '100px',
    top: `${position}px`,
    width: '40px',
    height: '40px',
    backgroundImage: `url(${birdImage})`,
    backgroundRepeat: 'no-repeat',
    transform: `rotate(${rotation}deg)`,
    transition: 'transform 0.1s ease',
    zIndex: 10,
  };
  
  // Particle effect on jump
  useEffect(() => {
    // Create a burst of particles only on jump
    const now = Date.now();
    if (position < prevPosition.current && now - lastJumpTime.current > 100) {
      // Create a burst of particles all at once
      const newParticles = Array.from({ length: PARTICLES_PER_JUMP }).map((_, i) => {
        // Calculate spread angle (fan pattern)
        const spreadAngle = Math.PI + (Math.random() * 0.6 - 0.3);
        // Vary the speed based on position in fan
        const particleSpeed = 1.5 + Math.random() * 1.5;
        
        return {
          id: now + Math.random(),
          x: 120,
          y: position + 20,
          color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
          size: 5 + Math.random() * 3, // Larger particles
          angle: spreadAngle,
          speed: particleSpeed,
          createdAt: now,
          // Add random offset to create burst effect
          offsetX: (Math.random() - 0.5) * 5,
          offsetY: (Math.random() - 0.5) * 5
        };
      });
      
      setParticles(prev => [...prev.filter(p => now - p.createdAt < PARTICLE_LIFETIME), ...newParticles].slice(-12));
      lastJumpTime.current = now;
    }

    prevPosition.current = position;

    // Cleanup expired particles
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setParticles(prev => prev.filter(p => now - p.createdAt < PARTICLE_LIFETIME));
    }, 200);

    return () => clearInterval(cleanupInterval);
  }, [position]);

  return (
    <div style={{ position: 'relative' }}>
      {/* Render particles */}
      {particles.map(particle => (
        <Particle
          key={particle.id}
          {...particle}
          lifetime={PARTICLE_LIFETIME}
        />
      ))}
      
      {/* Render bird */}
      <div className="bird" style={birdStyle} />
    </div>
  );
};

export default memo(Bird); 