# Data Heroes Game (Lambda Man Project)

## Overview
A Matrix-themed Asteroids game with a data team twist. Features team members as playable "Data Heroes" fighting bad data in a corrupted matrix. Built with p5.js for a presentation to showcase the data team's mission.

## Project Purpose
Created for a data team presentation to illustrate the team's role in "bringing order to chaos" and "surfacing insights from data". The game serves as an engaging metaphor for data quality and cleanup work.

## Key Features

### Core Gameplay
- **Asteroids-style mechanics** with Matrix rain background
- **Bad data asteroids** containing corrupted data symbols (`{}`, `()`, `=>`, `if`, etc.)
- **SQL command bullets** (SELECT, DELETE, UPDATE, CLEAN, etc.)
- **Dynamic hero system** using actual team member images
- **Pause menu** with hero swapping mid-game
- **Gemini-inspired powerup** at 500 points
- **Database Cleaner ultimate weapon** - expanding wireframe cylinder that clears all bad data
- **Victory condition** with fireworks when all data is cleaned

### Visual Features
- **Matrix rain effect** with Japanese characters and alphanumerics
- **Pixelated team member sprites** loaded from PNG files
- **Data stream trail** when heroes boost
- **Wireframe 3D database cylinder** for ultimate weapon
- **Rainbow-colored Gemini powerup** with concave diamond shape
- **Particle effects** when asteroids are destroyed

## Technical Architecture

### Files
```
lambdaman_game/
├── index.html       # Main HTML with overflow prevention
├── sketch.js        # All game logic (1000+ lines)
├── images/          # Team member sprites
│   ├── Dave.png
│   └── Nadya.png
└── CLAUDE.md        # This file
```

### Key Classes
- **Player** - Hero ship with image rendering and data abilities
- **Bullet** - SQL command projectiles
- **DatabaseCleaner** - Special expanding weapon (extends Bullet)
- **Asteroid** - Bad data entities with random data symbols
- **Powerup** - Gemini-style concave diamond
- **MatrixStream/MatrixSymbol** - Background rain effect
- **Firework** - Victory celebration particles

### Game States
- `intro` - Hero selection screen
- `playing` - Main gameplay
- `paused` - Pause menu
- `heroSwap` - Hero change screen (preserves game state)
- `gameOver` - Death screen
- `victory` - Win screen with fireworks

## Controls
- **Number keys (1-9)** - Select hero
- **Arrow keys** - Move
- **Space** - Shoot / Use Database Cleaner
- **P or ESC** - Pause
- **R** - Restart (from game over/victory)
- **In Pause Menu:**
  - C - Continue
  - H - Change Hero
  - R - Restart
  - M - Main Menu

## Customization Points

### Adding Team Members
1. Add PNG files to `images/` folder
2. Update `heroFiles` array in `preload()` function (line 39)
3. Names are automatically extracted from filenames

### Game Balance
- `ASTEROID_INIT_NUM` - Starting asteroid count
- `PLAYER_SIZE` - Hero sprite size
- `asteroidSpawnMultiplier` - Increases after powerup collection
- Powerup appears at 500 points (line 158)

### Visual Tweaks
- Matrix rain colors use HSB color mode
- Asteroid `dataBits` array contains bad data symbols
- Database weapon expansion rate and duration

## Important Implementation Details

### Dynamic Hero Loading
```javascript
const heroFiles = ['Dave.png', 'Nadya.png']; // Add more here
```

### Collision Detection
- Player uses 75% of asteroid radius for more forgiving gameplay
- Database Cleaner uses full radius + buffer for complete destruction
- Powerup collision uses standard radius check

### Victory Condition
Triggered when Database Cleaner destroys all asteroids and has expanded significantly. This ensures dramatic presentation timing.

### Performance Considerations
- Arrow key scrolling prevented with event listener
- Canvas resizes to window dimensions
- Matrix streams regenerate on window resize
- Particle effects cleaned up when off-screen

## Known Features & Behaviors
- Database Cleaner is one-time use only
- Asteroid spawn rate triples after powerup collection
- Hero can be changed mid-game without losing progress
- Victory only possible with Database Cleaner powerup
- All asteroid fragments are destroyed by Database Cleaner

## Presentation Tips
1. Start by showing the corrupted data matrix
2. Introduce team members via hero selection
3. Demonstrate normal gameplay (cleaning small data issues)
4. Show powerup collection and increased chaos
5. Climax with Database Cleaner clearing all bad data
6. Victory screen reinforces the team's mission

## Future Enhancement Ideas
- More team member sprites
- Different powerup types
- Boss asteroid with nested bad data
- Multiplayer co-op mode
- Data quality metrics display
- Integration with real data quality scores