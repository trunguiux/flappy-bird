export default function Cloud({ x, y }) {
  return (
    <div
      style={{
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
      }}
    />
  );
} 