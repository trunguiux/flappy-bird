// This function will dynamically import all character images
function importAll(r) {
  const images = {};
  r.keys().forEach((item, index) => {
    images[item.replace('./', '')] = {
      id: index,
      image: r(item),
      name: `Bird ${index + 1}`
    };
  });
  return Object.values(images);
}

// Import all images from the characters directory
const characters = importAll(require.context('../assets/characters', false, /\.(png|jpe?g|svg)$/));

export default characters; 