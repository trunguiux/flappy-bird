import groundImage from '../assets/ground.png';

export default function Ground() {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '400px', // Match game width
        height: '80px',
        backgroundImage: `url(${groundImage})`,
        backgroundRepeat: 'repeat-x',
        backgroundPosition: 'bottom',
        zIndex: 1,
      }}
    />
  );
} 