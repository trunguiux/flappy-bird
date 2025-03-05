# Flappy Bird Theme System

This directory contains the themes for the Flappy Bird game. Each theme includes its own set of assets and a description file.

## Theme Structure

Each theme should be placed in its own directory under `src/assets/themes/` and should include:

1. **Bird Image**: Either a sprite sheet or individual frames
   - Sprite sheet naming: `bird_sprite.png` (3 frames side by side, 120x40px total)
   - Or individual frames: `bird1.png`, `bird2.png`, `bird3.png` (each 40x40px)

2. **Pipe Images**: Top and bottom pipe images
   - Naming: `pipe-top.png`, `pipe-bottom.png`
   - Size: Approximately 60px wide

3. **Ground Image**: A repeatable ground texture
   - Naming: `ground.png`
   - Size: Height around 100 pixels, width can vary

4. **Description File**: A JSON file with theme information
   - Filename: `description.json`
   - Format:
     ```json
     {
       "name": "Theme Name",
       "description": "A short description of the theme."
     }
     ```

## Example Theme Structure

```
src/assets/themes/
├── classic/
│   ├── bird_sprite.png (or bird1.png, bird2.png, bird3.png)
│   ├── pipe-top.png
│   ├── pipe-bottom.png
│   ├── ground.png
│   └── description.json
├── forest/
│   └── ...
└── sunset/
    └── ...
```

## Adding a New Theme

1. Create a new directory under `src/assets/themes/` with your theme name
2. Add all required assets following the naming convention
3. Create a `description.json` file with your theme's name and description
4. The theme will be automatically loaded by the game

## Asset Guidelines

- Keep file sizes small for better performance
- Use PNG format with transparency where needed
- Maintain consistent sizes across themes for best results
- Test your theme in the game to ensure all assets display correctly

## Background Colors

Each theme uses a predefined background color:
- Classic: Sky blue (#87CEEB)
- Forest: Forest green (#2E7D32)
- Sunset: Orange (#FF9800)

If you want to change these colors, you can modify the `THEME_BACKGROUNDS` object in `src/utils/themeLoader.js`. 