import { useState, useEffect } from 'react';
import './CharacterSelect.css';
import characters from '../utils/characterLoader';

export default function CharacterSelect({ onSelect }) {
  const [selectedCharacter, setSelectedCharacter] = useState(0);
  
  const handleKeyPress = (e) => {
    if (e.code === 'Enter') {
      onSelect(characters[selectedCharacter]);
    } else if (e.code === 'ArrowLeft') {
      setSelectedCharacter(prev => (prev > 0 ? prev - 1 : characters.length - 1));
    } else if (e.code === 'ArrowRight') {
      setSelectedCharacter(prev => (prev < characters.length - 1 ? prev + 1 : 0));
    }
  };

  useEffect(() => {
    // Test if images are loading
    characters.forEach(char => {
      console.log('Testing image:', char.image);
      const img = new Image();
      img.onload = () => console.log('Image loaded:', char.image);
      img.onerror = () => console.error('Image failed to load:', char.image);
      img.src = char.image;

      console.log('Testing sprite:', char.spriteSheet);
      const sprite = new Image();
      sprite.onload = () => console.log('Sprite loaded:', char.spriteSheet);
      sprite.onerror = () => console.error('Sprite failed to load:', char.spriteSheet);
      sprite.src = char.spriteSheet;
    });
  }, []);

  console.log('Characters in select:', characters);

  return (
    <div 
      className="character-select" 
      tabIndex={0} 
      onKeyDown={handleKeyPress}
      autoFocus
    >
      <div className="test-animation" />
      
      <h2>Select Your Character</h2>
      <div className="characters">
        {characters.map((char, index) => {
          console.log(`Character ${index} image:`, char.image);
          return (
            <div 
              key={char.id} 
              className={`character ${selectedCharacter === index ? 'selected' : ''}`}
              onClick={() => {
                setSelectedCharacter(index);
                if (selectedCharacter === index) {
                  onSelect(char);
                }
              }}
            >
              <div 
                className="preview"
                style={{
                  backgroundImage: `url(${char.spriteSheet})`,
                  backgroundSize: '120px 40px',
                  width: '40px',
                  height: '40px',
                  backgroundPosition: '0 0',
                  backgroundRepeat: 'no-repeat',
                  animation: 'sprite-animation 0.3s steps(3) infinite',
                  imageRendering: 'pixelated'
                }}
              />
              <p>{char.name}</p>
            </div>
          );
        })}
      </div>
      <p className="instructions">
        Use ← → to select and ENTER to start<br/>
        Or double click to select
      </p>
    </div>
  );
} 