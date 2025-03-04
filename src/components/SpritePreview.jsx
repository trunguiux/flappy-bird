import { useEffect, useRef } from 'react';

const SpritePreview = ({ spriteSheet }) => {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = spriteSheet;
    
    img.onload = () => {
      const animate = () => {
        ctx.clearRect(0, 0, 40, 40);
        ctx.drawImage(img, frameRef.current * 40, 0, 40, 40, 0, 0, 40, 40);
        frameRef.current = (frameRef.current + 1) % 3;
      };

      setInterval(animate, 100);
    };
  }, [spriteSheet]);

  return <canvas ref={canvasRef} width={40} height={40} />;
}; 