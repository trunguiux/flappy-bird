import { useState, useCallback, useMemo } from 'react';
import './CharacterSelect.css';
import { themes } from '../utils/themeLoader';

/**
 * Helper function to determine if a value is a color
 */
const isColor = (value) => {
  return typeof value === 'string' && (value.startsWith('#') || value.startsWith('rgb'));
};

/**
 * Theme selection component
 */
export default function ThemeSelect({ onSelect }) {
  const [selectedTheme, setSelectedTheme] = useState(0);
  
  // Handle keyboard navigation
  const handleKeyPress = useCallback((e) => {
    if (e.code === 'Enter') {
      onSelect(themes[selectedTheme]);
    } else if (e.code === 'ArrowLeft') {
      setSelectedTheme(prev => (prev > 0 ? prev - 1 : themes.length - 1));
    } else if (e.code === 'ArrowRight') {
      setSelectedTheme(prev => (prev < themes.length - 1 ? prev + 1 : 0));
    }
  }, [onSelect, selectedTheme]);

  // Get current theme
  const currentTheme = themes[selectedTheme];
  
  // Get background style based on current theme
  const backgroundStyle = useMemo(() => {
    const background = currentTheme.assets.background;
    
    if (!background || background.length === 0) {
      return { backgroundColor: '#87CEEB' };
    }
    
    const bgValue = background[0];
    
    return isColor(bgValue)
      ? { backgroundColor: bgValue }
      : { 
          backgroundImage: `url(${bgValue})`,
          backgroundSize: 'cover'
        };
  }, [currentTheme.assets.background]);

  // Bird preview style
  const birdStyle = useMemo(() => ({
    backgroundImage: currentTheme.assets.bird && currentTheme.assets.bird.length > 0
      ? `url(${currentTheme.assets.bird[0]})` 
      : 'none',
    width: '40px',
    height: '40px',
    backgroundRepeat: 'no-repeat',
    position: 'absolute',
    left: '30%',
    top: '40%',
    transform: 'scale(1.5)'
  }), [currentTheme.assets.bird]);

  // Pipe container style
  const pipeContainerStyle = {
    position: 'absolute',
    right: '20%',
    width: '40px',
    height: '120px',
    overflow: 'hidden'
  };

  // Pipe content style
  const pipeContentStyle = useMemo(() => ({
    width: '100%',
    height: '100%',
    backgroundImage: currentTheme.assets.pipes && currentTheme.assets.pipes.length > 0
      ? `url(${currentTheme.assets.pipes[0]})` 
      : 'none',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'top'
  }), [currentTheme.assets.pipes]);

  // Ground style
  const groundStyle = useMemo(() => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '40px',
    backgroundImage: currentTheme.assets.ground && currentTheme.assets.ground.length > 0
      ? `url(${currentTheme.assets.ground[0]})` 
      : 'none',
    backgroundRepeat: 'repeat-x',
    backgroundPosition: 'bottom'
  }), [currentTheme.assets.ground]);

  // Handle theme selection
  const selectTheme = useCallback(() => {
    onSelect(currentTheme);
  }, [onSelect, currentTheme]);

  return (
    <div 
      className="theme-select" 
      tabIndex={0} 
      onKeyDown={handleKeyPress}
      autoFocus
    >
      <h2>Select Your Theme</h2>
      
      <div className="theme-preview" style={backgroundStyle}>
        <div className="theme-preview-content">
          {/* Bird preview */}
          <div className="bird-preview" style={birdStyle} />
          
          {/* Pipe preview - top */}
          <div 
            className="pipe-preview-container"
            style={{
              ...pipeContainerStyle,
              top: 0
            }}
          >
            <div
              style={{
                ...pipeContentStyle,
                transform: 'rotate(180deg)',
                transformOrigin: 'center bottom'
              }}
            />
          </div>
          
          {/* Pipe preview - bottom */}
          <div 
            className="pipe-preview-container"
            style={{
              ...pipeContainerStyle,
              bottom: 0
            }}
          >
            <div style={pipeContentStyle} />
          </div>
          
          {/* Ground preview */}
          <div className="ground-preview" style={groundStyle} />
        </div>
      </div>
      
      <h3>{currentTheme.name}</h3>
      <p className="theme-description">{currentTheme.description}</p>
      
      <div className="theme-selector">
        {themes.map((theme, index) => (
          <div 
            key={theme.id} 
            className={`theme-dot ${selectedTheme === index ? 'selected' : ''}`}
            onClick={() => setSelectedTheme(index)}
          />
        ))}
      </div>
      
      <button 
        className="start-button"
        onClick={selectTheme}
      >
        Start Game
      </button>
      
      <p className="instructions">
        Use ← → to select and ENTER to start
      </p>
    </div>
  );
} 