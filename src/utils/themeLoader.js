// Theme loader utility
// This utility loads theme assets and descriptions

// Import default assets as fallbacks
import defaultBirdSprite from '../assets/characters/bird1_sprite.png';
import defaultPipe from '../assets/pipe-top.png'; // Use a single pipe image
import defaultGround from '../assets/ground.png';

// Import theme descriptions
import classicDescription from '../assets/themes/classic/description.json';
import forestDescription from '../assets/themes/forest/description.json';
import sunsetDescription from '../assets/themes/sunset/description.json';

// Theme background colors
const THEME_BACKGROUNDS = {
  classic: '#87CEEB', // Sky blue
  forest: '#2E7D32',  // Forest green
  sunset: '#FF9800'   // Orange
};

// Function to import all files from a directory that match a pattern
function importAll(r) {
  try {
    return r.keys().map(r);
  } catch (error) {
    console.warn('Error importing files:', error);
    return [];
  }
}

// Try to import theme assets, use empty arrays if they don't exist
let classicBirdAssets = [];
let classicPipeAssets = [];
let classicGroundAssets = [];

let forestBirdAssets = [];
let forestPipeAssets = [];
let forestGroundAssets = [];

let sunsetBirdAssets = [];
let sunsetPipeAssets = [];
let sunsetGroundAssets = [];

try {
  // Try to load bird sprite sheets first
  const classicBirdSprite = importAll(require.context('../assets/themes/classic', false, /bird.*sprite.*\.png$/));
  const forestBirdSprite = importAll(require.context('../assets/themes/forest', false, /bird.*sprite.*\.png$/));
  const sunsetBirdSprite = importAll(require.context('../assets/themes/sunset', false, /bird.*sprite.*\.png$/));
  
  // If sprite sheets exist, use them, otherwise try individual frames
  classicBirdAssets = classicBirdSprite.length > 0 
    ? classicBirdSprite 
    : importAll(require.context('../assets/themes/classic', false, /bird[0-9].*\.png$/));
  
  forestBirdAssets = forestBirdSprite.length > 0 
    ? forestBirdSprite 
    : importAll(require.context('../assets/themes/forest', false, /bird[0-9].*\.png$/));
  
  sunsetBirdAssets = sunsetBirdSprite.length > 0 
    ? sunsetBirdSprite 
    : importAll(require.context('../assets/themes/sunset', false, /bird[0-9].*\.png$/));
  
  // Load other assets
  classicPipeAssets = importAll(require.context('../assets/themes/classic', false, /pipe\.png$/));
  classicGroundAssets = importAll(require.context('../assets/themes/classic', false, /ground.*\.png$/));
  
  forestPipeAssets = importAll(require.context('../assets/themes/forest', false, /pipe\.png$/));
  forestGroundAssets = importAll(require.context('../assets/themes/forest', false, /ground.*\.png$/));
  
  sunsetPipeAssets = importAll(require.context('../assets/themes/sunset', false, /pipe\.png$/));
  sunsetGroundAssets = importAll(require.context('../assets/themes/sunset', false, /ground.*\.png$/));
} catch (error) {
  console.warn('Error loading theme assets:', error);
}

// Create theme objects with assets
const classicAssets = {
  bird: classicBirdAssets.length > 0 ? classicBirdAssets : [defaultBirdSprite],
  pipes: classicPipeAssets.length > 0 ? classicPipeAssets : [defaultPipe],
  background: [THEME_BACKGROUNDS.classic],
  ground: classicGroundAssets.length > 0 ? classicGroundAssets : [defaultGround]
};

const forestAssets = {
  bird: forestBirdAssets.length > 0 ? forestBirdAssets : [defaultBirdSprite],
  pipes: forestPipeAssets.length > 0 ? forestPipeAssets : [defaultPipe],
  background: [THEME_BACKGROUNDS.forest],
  ground: forestGroundAssets.length > 0 ? forestGroundAssets : [defaultGround]
};

const sunsetAssets = {
  bird: sunsetBirdAssets.length > 0 ? sunsetBirdAssets : [defaultBirdSprite],
  pipes: sunsetPipeAssets.length > 0 ? sunsetPipeAssets : [defaultPipe],
  background: [THEME_BACKGROUNDS.sunset],
  ground: sunsetGroundAssets.length > 0 ? sunsetGroundAssets : [defaultGround]
};

// Export themes array
export const themes = [
  {
    id: 'classic',
    name: classicDescription.name || 'Classic',
    description: classicDescription.description || 'The original Flappy Bird experience.',
    assets: classicAssets
  },
  {
    id: 'forest',
    name: forestDescription.name || 'Forest',
    description: forestDescription.description || 'A peaceful forest environment.',
    assets: forestAssets
  },
  {
    id: 'sunset',
    name: sunsetDescription.name || 'Sunset',
    description: sunsetDescription.description || 'A beautiful sunset adventure.',
    assets: sunsetAssets
  }
];

export default themes; 