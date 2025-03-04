// Import all images using require.context
const importAll = (r) => {
  let images = {};
  r.keys().forEach((item) => {
    images[item.replace('./', '')] = r(item);
  });
  return images;
};

// Import all images from the characters directory
const images = importAll(require.context('../assets/characters', false, /\.(png|jpe?g|svg)$/));

console.log('All imported images:', images);

const characters = [
  {
    id: 1,
    image: images['char_01.png'],
    spriteSheet: images['bird1_sprite.png'],
    name: 'Bird 1'
  },
  {
    id: 2,
    image: images['char_02.png'],
    spriteSheet: images['bird2_sprite.png'],
    name: 'Bird 2'
  },
  {
    id: 3,
    image: images['char_03.png'],
    spriteSheet: images['bird3_sprite.png'],
    name: 'Bird 3'
  }
];

console.log('Characters array:', characters);

export default characters; 