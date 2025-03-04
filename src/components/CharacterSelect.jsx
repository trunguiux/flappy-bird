import { useState } from 'react';
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

  return (
    <div 
      className="character-select" 
      tabIndex={0} 
      onKeyDown={handleKeyPress}
      autoFocus
    >
      <h2>Select Your Character</h2>
      <div className="characters">
        {characters.map((char, index) => (
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
            <img src={char.image} alt={char.name} />
            <p>{char.name}</p>
          </div>
        ))}
      </div>
      <p className="instructions">
        Use ← → to select and ENTER to start<br/>
        Or double click to select
      </p>
    </div>
  );
} 