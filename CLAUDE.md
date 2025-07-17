# Data Heroes Game (Lambda Man Project)

## Overview
A Matrix-themed ML Operations workflow presentation system featuring 5 retro arcade games, each representing a phase of the ML pipeline. Built with p5.js for engaging data team presentations.

## Project Purpose
Created for a data team presentation to illustrate the team's role in the ML operations workflow through interactive game metaphors. Each game represents a critical phase: Data Cleaning, Feature Engineering, Model Training, Model Deployment, and Model Monitoring.

## Current Progress (2025-07-17)
- **✅ Feature Engineering (Asteroids)** - COMPLETE (renamed from Data Cleaning)
- **✅ Model Monitoring (Missile Command)** - COMPLETE (all bugs fixed)
- **✅ Landing Page Layout** - COMPLETE (simplified linear design)
- **⏳ Model Training (Space Invaders)** - TODO
- **⏳ Model Deployment (Pac-Man)** - TODO

## Major Restructuring (2025-07-17)
- **Simplified to 4-game structure** (removed janky Tetris game)
- **Games Completed:** 2/4 (50%)
- **Landing Page:** Clean linear layout with larger tiles - COMPLETE
- **Next Focus:** Complete remaining 2 games

## Project Architecture

### File Structure
```
lambdaman_game/
├── index.html                    # Main hub with interactive ML workflow
├── hub-sketch.js                 # Hub matrix rain background
├── hub.js                        # Hub navigation logic
├── presentation.md               # Game metaphor explanations
├── next-steps.md                 # Detailed implementation plan
├── CLAUDE.md                     # This file
├── shared/
│   ├── shared.css               # Matrix theme styles
│   ├── shared.js                # Utilities, sprites, navigation
│   └── sprites/                 # Hero images
│       ├── Dave.png
│       ├── Dave_face.png
│       ├── Nadya.png
│       ├── Nadya_face.png
│       └── [additional team members]
├── games/
│   ├── data-cleaning.html       # ✅ COMPLETE - Asteroids
│   ├── data-cleaning-classes.js # ✅ COMPLETE
│   ├── feature-engineering.html # ✅ COMPLETE - Tetris
│   ├── feature-engineering-classes.js # ✅ COMPLETE
│   ├── model-monitoring.html    # 🎯 NEXT - Missile Command
│   ├── model-deployment.html    # TODO - Pac-Man
│   └── model-training.html      # TODO - Space Invaders
└── to_be_integrated/           # Source files to port
    ├── missle_command_example.js # → model-monitoring.html
    ├── model_deploy_pacman.html  # → model-deployment.html
    └── mt_me_space_invaders.html # → model-training.html
```

## Proven Template Architecture

### Key Success Patterns (Established)
- **Modular HTML files** with embedded p5.js for each game
- **Shared assets** from `../shared/sprites/` and `../shared/shared.js`
- **Consistent hero system** with face images and rotation animations
- **Standardized pause menu** with hero switching (H key)
- **Matrix theme integration** throughout all games
- **Hub navigation** with simple `returnToHub()` function
- **Performance optimizations** maintaining 60fps

### Standard Game States
- `playing` - Main gameplay
- `paused` - Pause menu with options
- `heroSwap` - Hero selection (preserves progress)
- `gameOver` - Failure screen
- `victory` - Success screen with fireworks

### Controls (Consistent Across All Games)
- **Arrow keys** - Movement/control
- **Space** - Primary action
- **P/ESC** - Pause
- **R** - Restart (from game over/victory)
- **In Pause Menu:**
  - ENTER - Continue
  - H - Change Hero
  - R - Restart
  - M - Main Menu (returns to hub)

## Completed Games

### 1. Data Cleaning (Asteroids-style)
- **Theme:** Fight corrupted data in the matrix using SQL commands
- **Features:** Database Cleaner powerup, bad data asteroids, SQL bullets
- **Victory:** Clear all data with Database Cleaner

### 2. Feature Engineering (Tetris-style)
- **Theme:** Build and shape data features like Tetris blocks
- **Features:** Data engineering terms on pieces (NORMALIZE, ONE-HOT, etc.)
- **Special:** Tractor beam visual effects when manipulating pieces
- **Victory:** Clear 30 lines

## Next Priority: Model Monitoring (Missile Command)

### Implementation Plan
1. Use proven template from data-cleaning.html
2. Port missile command logic from `missle_command_example.js`
3. Theme adaptation:
   - Cities → ML Models to protect
   - Missiles → Data drift, anomalies, performance degradation
   - Defense missiles → Monitoring alerts and corrections
4. Maintain hero system and pause menu
5. Add special "System Reset" powerup (like Database Cleaner)

### Expected Features
- Protect ML models from incoming threats
- Different threat types (drift, anomalies, errors)
- Hero operates defense turret with tractor beam
- Progressive difficulty as threats increase
- Victory condition when surviving all waves

## Technical Guidelines

### When Adding New Games
1. **Always start with data-cleaning.html as template**
2. Create corresponding `-classes.js` file for game logic
3. Ensure these classes are present:
   - `MatrixStream` and `MatrixSymbol` for background
   - `Firework` for victory celebrations
   - Game-specific classes as needed
4. Maintain consistent UI structure:
   - Score display
   - Level/Lives display  
   - Phase indicator
   - Hero name display
5. Test pause menu and hero switching
6. Verify hub navigation works

### Performance Standards
- Target 60fps consistently
- Cap particle effects and spawning rates
- Clean up off-screen objects
- Use `frameCount % n` for periodic updates

### Hero System
- Heroes loaded from `shared/sprites/`
- Face images for pause menu (`*_face.png`)
- Animation cycle: 6.5s with 0.5s wiggle
- Support for unlimited team members

## Important Notes

### For Next Session
1. **Current Task:** Complete remaining 2 games
2. **Priority 1:** Model Training (Space Invaders) - complex implementation needed
3. **Priority 2:** Model Deployment (Pac-Man) - simpler port from existing
4. **Landing Page:** Now has clean linear layout that works well for MacBook presentations

### Key Decisions Made
- Feature Engineering uses Asteroids gameplay with data engineering theme
- Heroes have tractor beam effects in Feature Engineering  
- Victory conditions are game-appropriate for each phase
- All games maintain Matrix green theme consistency
- Simple navigation back to hub (no complex completion overlays)
- Landing page uses simple linear layout instead of complex SVG pipeline
- Tiles sized properly for MacBook presentation (320x280px with larger text)

### Testing Checklist
- [ ] Game loads and initializes properly
- [ ] Hero system works (switching mid-game)
- [ ] Pause menu functions correctly
- [ ] Game mechanics feel smooth at 60fps
- [ ] Victory/Game Over screens display
- [ ] Navigation back to hub works
- [ ] Matrix rain renders in background

## Presentation Flow
1. **Hub:** Interactive ML pipeline overview
2. **Data Cleaning:** Clear corrupted data (Asteroids)
3. **Feature Engineering:** Build features (Tetris)
4. **Model Training:** Train networks (Space Invaders) - TODO
5. **Model Deployment:** Navigate deployment (Pac-Man) - TODO
6. **Model Monitoring:** Defend models (Missile Command) - NEXT

The project demonstrates the data team's complete ML operations workflow through engaging, retro-themed games that reinforce each phase's importance.