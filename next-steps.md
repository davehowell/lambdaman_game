# Lambda Man Game - Next Steps Plan

## Current State Assessment

### ✅ Successfully Implemented
- **Data Cleaning Game** (`games/data-cleaning.html`) - **COMPLETE & WORKING**
  - Asteroids-style gameplay with Matrix theme
  - Hero system with Dave & Nadya sprites
  - Pause menu with hero switching
  - Victory/game over screens
  - Continuous firing system
  - Database Cleaner powerup
  - Proper navigation back to hub

- **Feature Engineering Game** (`games/feature-engineering.html`) - **COMPLETE & WORKING** ✅ NEW!
  - Tetris-style gameplay with feature blocks
  - Hero system with tractor beam effects
  - Data engineering themed pieces (NORMALIZE, ONE-HOT, etc.)
  - Pause menu with hero switching
  - Victory condition at 30 lines cleared
  - Proper navigation back to hub
  - 60fps performance maintained

### 🎯 Template Architecture Established
The `games/data-cleaning.html` structure is now the **proven template** for all remaining games:

**Key Success Patterns:**
- **Modular HTML files** with embedded p5.js
- **Shared assets** from `../shared/sprites/` and `../shared/shared.js`
- **Consistent hero system** with face images and rotation animations
- **Standardized pause menu** with hero switching
- **Matrix theme integration** throughout
- **Hub navigation** with `returnToHub()` function
- **Performance optimizations** (capped spawning, optimized rendering)

## Implementation Plan

### Phase 1: Port Existing Games (Priority Order)

#### 1. ~~Feature Engineering~~ → `games/feature-engineering.html` ✅ **COMPLETE**
**Status:** Successfully ported and tested
**Completion Date:** 2025-07-09
**Final Implementation:**
- Used data-cleaning.html template structure
- Integrated complete Tetris logic from source
- Added tractor beam visual effects
- Maintained hero system and pause menu
- Verified 60fps performance
- Hub navigation working correctly

#### 2. Model Monitoring → `games/model-monitoring.html` ✅ **COMPLETE**
**Status:** Successfully implemented and refined based on playtesting feedback
**Completion Date:** 2025-07-14
**Final Implementation:**
- Single-level structure with Production Outage boss (30s-1min gameplay)
- Proper ML model names: Neural Net, XGBoost, Random Forest
- System Reset powerup with massive defense grid
- Optimized text sizes for presentation readability
- Clean theme without matrix rain for focused gameplay
- Fast-paced timing perfect for demo presentations

#### 3. Model Deployment → `games/model-deployment.html`
**Base:** `to_be_integrated/model_deploy_pacman.html` (mostly complete)
**Theme:** Pac-Man navigating production environment

**Port Strategy:**
- Convert existing standalone HTML to template structure
- Integrate hero system and pause menu
- Update styling to match Matrix theme
- Add proper navigation and game states
- Test maze navigation and collision detection

**Expected Effort:** 4-6 hours (mostly styling and integration)

#### 4. Model Training → `games/model-training.html`
**Base:** `to_be_integrated/mt_me_space_invaders.html` + `model_training.js`
**Theme:** Space Invaders with training batches and hyperparameter tuning

**Port Strategy:**
- Use data-cleaning template as base
- Implement Space Invaders mechanics
- Replace "asteroids" with "training batches" (invader waves)
- Add hyperparameter adjustment mechanics
- Include training progress visualization

**Expected Effort:** 8-10 hours (most complex, needs significant development)

### Phase 2: Hub Integration & Polish

#### 5. Update Main Hub (`index.html`)
**Current:** Basic landing page with matrix rain
**Target:** Interactive ML workflow presentation

**Features to Add:**
- **Interactive Pipeline**: Clickable workflow stages
- **Progress Tracking**: Visual indicators for completed games
- **Game Descriptions**: Brief explanations matching `presentation.md`
- **Smooth Transitions**: Animated navigation between sections
- **Presentation Mode**: Auto-advance for demos

**Expected Effort:** 6-8 hours

#### 6. Shared Assets Enhancement
**Current:** Basic sprite system
**Target:** Comprehensive shared utilities

**Enhancements:**
- **More Hero Sprites**: Add additional team members
- **Sound Effects**: Consistent audio across games
- **Particle Systems**: Shared explosion/effect classes
- **Theme Consistency**: Unified color schemes and typography
- **Performance Utils**: Shared optimization functions

**Expected Effort:** 4-6 hours

### Phase 3: Testing & Optimization

#### 7. Comprehensive Testing
- **Individual Game Testing**: Each game works standalone
- **Navigation Testing**: Hub ↔ game transitions
- **Performance Testing**: 60fps on target devices
- **Browser Compatibility**: Chrome, Firefox, Safari
- **Mobile Responsiveness**: Touch controls and scaling

#### 8. Documentation & Polish
- **Code Comments**: Clear documentation for future maintenance
- **User Guide**: Instructions for presentation use
- **Developer Guide**: How to add new games/features
- **Performance Guidelines**: Best practices for smooth gameplay

## Technical Implementation Details

### Template Structure (Based on data-cleaning.html)
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Game Name] - [MLOps Phase]</title>
    <link rel="stylesheet" href="../shared/shared.css">
    <style>
        /* Game-specific styles */
    </style>
</head>
<body>
    <div class="game-container">
        <div class="game-ui">
            <div class="score-display">SCORE: <span id="score">00000000</span></div>
            <div class="lives-display">LIVES: <span id="lives">3</span></div>
            <div class="level-display">PHASE: [PHASE NAME]</div>
        </div>
        
        <div class="game-info">
            <div>HERO: <span id="current-hero">LAMBDA MAN</span></div>
        </div>
        
        <div class="controls-help">
            <!-- Game-specific controls -->
        </div>
    </div>

    <!-- p5.js library -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"></script>
    <!-- Shared utilities -->
    <script src="../shared/shared.js"></script>
    <!-- Game classes -->
    <script src="[game]-classes.js"></script>
    <!-- Game script -->
    <script>
        // Game state management
        let gameState = 'playing';
        let score = 0;
        let lives = 3;
        let gameStartTime;
        
        // Hero system (consistent across all games)
        let heroImages = [];
        let heroNames = [];
        let heroFaceImages = [];
        let selectedHero = 0;
        
        // Firing system (where applicable)
        let lastFireTime = 0;
        const FIRE_RATE = 8;
        
        // Core functions
        function preload() { /* Load hero images */ }
        function setup() { /* Initialize game */ }
        function draw() { /* Main game loop */ }
        function displayPauseMenu() { /* Standardized pause menu */ }
        function displayHeroSwap() { /* Hero selection */ }
        function displayGameOver() { /* Game over screen */ }
        function displayVictory() { /* Victory screen */ }
        function keyPressed() { /* Input handling */ }
        function resetGame() { /* Reset game state */ }
        function returnToHub() { /* Navigate back */ }
    </script>
</body>
</html>
```

### File Organization
```
lambdaman_game/
├── index.html                    # Main hub (interactive workflow)
├── hub-sketch.js                 # Hub matrix rain
├── hub.js                        # Hub navigation
├── presentation.md               # Game metaphor explanations
├── next-steps.md                 # This document
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
│   ├── data-cleaning-classes.js # ✅ COMPLETE - Game classes
│   ├── feature-engineering.html # ✅ COMPLETE - Tetris
│   ├── feature-engineering-classes.js # ✅ COMPLETE
│   ├── model-monitoring.html    # 🎯 NEXT PRIORITY - Missile Command
│   ├── model-monitoring-classes.js
│   ├── model-deployment.html    # 🎯 READY - Pac-Man
│   ├── model-deployment-classes.js
│   ├── model-training.html      # 🎯 COMPLEX - Space Invaders
│   └── model-training-classes.js
└── to_be_integrated/           # Source files to port
    ├── feature_engineering.js   # ✅ PORTED → feature-engineering.html
    ├── missle_command_example.js # → model-monitoring.html
    ├── model_deploy_pacman.html  # → model-deployment.html
    ├── mt_me_space_invaders.html # → model-training.html
    └── [other legacy files]
```

## Success Metrics

### Technical Goals
- **60fps performance** on all games
- **Consistent UX** across all games (pause menu, hero system, navigation)
- **Zero crashes** during normal gameplay
- **Fast loading** (<2 seconds per game)

### Presentation Goals
- **Seamless demo flow** from hub through all games
- **Clear metaphor connection** between games and MLOps phases
- **Engaging visuals** that support the educational message
- **Professional polish** suitable for client presentations

## Risk Mitigation

### Technical Risks
- **Performance**: Cap spawning rates, optimize rendering loops
- **Browser compatibility**: Test on target browsers early
- **Mobile responsiveness**: Implement touch controls where needed

### Timeline Risks
- **Scope creep**: Stick to template pattern, avoid custom features
- **Integration complexity**: Use proven data-cleaning.html structure
- **Testing time**: Allocate 20% of time for testing and bug fixes

## Conclusion

With the successful implementation of `games/data-cleaning.html`, we now have a **proven template and architecture** that can be replicated for all remaining games. The modular HTML approach has demonstrated:

- **Excellent performance** (60fps with optimizations)
- **Consistent user experience** (pause menu, hero system, navigation)
- **Maintainable code structure** (clear separation of concerns)
- **Professional presentation quality** (Matrix theme, smooth gameplay)

The remaining work is primarily **mechanical porting** of existing game logic into the established template structure, making this a predictable and manageable implementation plan.

**Next Action:** Begin with Model Monitoring game (Missile Command style), as it's the next priority in the workflow sequence. The Feature Engineering port has validated that the template approach works well for different game mechanics.

## Playtesting Feedback (2025-07-14)

### Key Issues Identified & Fixed:
1. **Text Size Problems** - All text was too small for presentation viewing
   - **Solution:** Increased CSS font-sizes from 12px→24px, 18px→32px
   - **Solution:** Increased p5.js textSize from 10-12→16-24 for all game elements

2. **Model Display Issues** - Cities showed "SYS-1", "SYS-2", "SYS-3" instead of ML model names
   - **Solution:** Replaced with proper ML model names: "Neural Net", "XGBoost", "Random Forest"
   - **Solution:** Improved visual contrast with dark backgrounds and bright green text
   - **Solution:** Increased model size from 80x30 to 120x50 pixels

3. **Boss Logic Broken** - Game ended at wave 5 instead of spawning boss
   - **Solution:** Converted to single-level structure with "Production Outage" boss
   - **Solution:** Boss spawns after 15 seconds or 10 regular enemies (whichever comes first)
   - **Solution:** Clear victory condition when boss is defeated

4. **Missing System Reset Powerup** - Critical feature wasn't implemented
   - **Solution:** Added pulsing powerup that spawns at 400 points
   - **Solution:** Creates massive defense grid across entire screen when activated
   - **Solution:** Perfect for defeating the Production Outage boss dramatically

5. **Presentation Timing** - 2-3 minutes too long for presentation flow
   - **Solution:** Optimized for 30s-1min gameplay duration
   - **Solution:** Faster enemy spawn rates and progression
   - **Solution:** Early powerup availability for quick climax

### Design Validation:
- **Matrix Rain Removal:** Confirmed clean gameplay area without busy background
- **Green Glow Theme:** Perfect visual effect maintained throughout
- **Presentation Focus:** Games now support MLOps concepts within tight timeframes

## Playtesting Feedback Round 2 (2025-07-14) - CRITICAL FIXES NEEDED

### 🚨 HIGH PRIORITY Issues:

#### 1. **Powerup/Boss Timing Mismatch**
- **Problem**: Boss spawns at ~150-175 points, but System Reset powerup spawns at 400 points
- **Problem**: Regular missiles can damage boss (should be powerup-only)
- **Solution**: Increase missile point values 4x to accelerate scoring
- **Solution**: Sync powerup spawn with boss appearance (or immediately after)
- **Solution**: Make regular missiles do ZERO damage to boss
- **Goal**: Force strategic System Reset usage for dramatic boss defeat

#### 2. **Powerup Collection UX Unclear**
- **Problem**: User unclear how to collect the pulsing System Reset powerup
- **Investigation**: Determine if it's mouse hover, click, or automatic collection
- **Solution**: Add clear visual feedback and/or instructions
- **Goal**: Intuitive powerup interaction

#### 3. **Boss Victory Logic Broken**
- **Problem**: Boss hitting one model → "OFFLINE" → game enters limbo state
- **Problem**: No proper failure condition for "Production Outage"
- **Solution**: Boss should destroy ALL 3 models in sequence for total system failure
- **Solution**: Immediate game over when all models destroyed
- **Goal**: Proper "Production Outage" represents complete ML infrastructure failure

### 🔧 MEDIUM PRIORITY Issues:

#### 4. **UI Layout Collision**
- **Problem**: Bottom left help text overlaps model bases in narrow browser windows
- **Solution**: Move model bases higher up screen to avoid text overlap
- **Solution**: Ensure responsive layout works at various browser widths
- **Goal**: Clean presentation at all screen sizes

### 🎨 LOW PRIORITY Issues:

#### 5. **Enemy Visual Enhancement**
- **Problem**: Red circle enemies need more thematic "pizzazz"
- **Feedback**: Red color is good, but needs ML monitoring theme effects
- **Solution**: Make enemies glowy/hollow circles with visual effects
- **Goal**: More engaging threat visualization while maintaining readability

### Next Session Implementation Order:
1. **Fix powerup/boss synchronization** (critical for game mechanics)
2. **Investigate and fix powerup collection UX** (user confusion)  
3. **Implement boss total destruction logic** (proper failure state)
4. **Adjust model positioning for responsive layout** (presentation quality)
5. **Enhance enemy visual effects** (polish)

### Specific Code Changes Needed:
- Increase enemy point values 4x in enemy definitions
- Change powerup spawn condition from score-based to boss-appearance-based
- Add boss immunity to regular missiles (only System Reset damages boss)
- Clarify powerup collection mechanism (currently mouse distance-based)
- Implement boss sequential model destruction instead of single-model hit
- Move model base Y positions higher to avoid UI text overlap
- Add glow/hollow effects to enemy circle rendering

### Current Status:
**Model Monitoring Game**: Feature-complete but needs critical bug fixes from playtesting
**Game Length**: Perfect at 30s-1min 
**Theme**: Excellent - just needs mechanical refinements
**Visual Polish**: Good foundation, needs enemy enhancement and layout fixes

## Progress Summary (2025-07-17)
### ✅ MAJOR RESTRUCTURING COMPLETE
- **Simplified to 4-game structure** (removed janky Tetris game)
- **Renamed Data Cleaning → Feature Engineering** (keeping Asteroids gameplay)
- **Games Completed:** 3/4 (75%)
  - **Feature Engineering:** ✅ Asteroids-style - COMPLETE (renamed from Data Cleaning)
  - **Model Training:** ⏳ Space Invaders - TODO
  - **Model Deployment:** ⏳ Pac-Man - TODO
  - **Model Monitoring:** ✅ Missile Command - COMPLETE (all bugs fixed)

### 🎯 CURRENT FOCUS: Landing Page Pipeline Visualization

## Landing Page Pipeline Visualization Plan (2025-07-17)

### Overview
Transform the landing page from a simple grid layout to an engaging pipeline visualization that represents the MLOps workflow as a flowing data pipeline.

### Visual Design
- **S-shaped pipeline** connecting all 4 games
- **Green neon pipe outline** (maintains Matrix theme)
- **Colorful game tiles** with distinct neon colors:
  - Feature Engineering: **Purple** (#9D4EDD)
  - Model Training: **Blue** (#0096C7)
  - Model Deployment: **Pink** (#FF006E)
  - Model Monitoring: **Orange** (#FB5607)

### Implementation Steps

#### 1. Restructure Layout (index.html)
- Change from grid to absolute positioning
- Create container for pipeline visualization
- Position tiles along S-curve path:
  - Bottom-left: Feature Engineering (start)
  - Bottom-right: Model Training
  - Top-left: Model Deployment
  - Top-right: Model Monitoring (end)

#### 2. Create SVG Pipeline
- Design S-shaped path using cubic bezier curves
- Apply green neon effect:
  - Stroke: bright green (#00ff41)
  - Multiple box-shadows for glow effect
  - Semi-transparent fill
- Position behind game tiles with proper z-index

#### 3. Colorize Game Tiles
- Update each tile with unique neon color
- Maintain consistent neon glow effects
- Update hover states to match new colors
- Keep completed checkmarks visible

#### 4. Add Flow Animation (Optional Enhancement)
- Subtle pulse effect along pipeline
- Moving particles or dots through pipe
- Reinforces data flow concept
- Use CSS animations for performance

### Technical Considerations
- Maintain responsive design for different screen sizes
- Ensure accessibility with proper contrast
- Keep Matrix rain background visible but subtle
- Optimize performance with CSS transforms

### Expected Outcome
- Clear visual metaphor for MLOps pipeline
- Engaging presentation that draws the eye through the workflow
- Professional yet playful aesthetic
- Intuitive progression from data processing to model monitoring

## Remaining Work After Pipeline Visualization

### Phase 1: Complete Remaining Games
1. **Model Training (Space Invaders)**
   - Port from `to_be_integrated/mt_me_space_invaders.html`
   - Theme: Training batches as invader waves
   - Add hyperparameter tuning mechanics
   - Estimated: 8-10 hours

2. **Model Deployment (Pac-Man)**
   - Port from `to_be_integrated/model_deploy_pacman.html`
   - Theme: Navigate deployment maze
   - Collect artifacts, avoid deployment ghosts
   - Estimated: 4-6 hours

### Phase 2: Final Polish
- Sound effects integration
- Performance optimization
- Cross-browser testing
- Documentation updates

## Current Status Update (2025-07-17)

### ✅ Landing Page Completed
**Status:** Successfully simplified to clean linear layout
**Changes Made:**
- Removed complex SVG pipeline design (too difficult to maintain)
- Implemented simple left-to-right linear layout with flexbox
- Enlarged tiles to 320x280px with larger text for MacBook presentation
- Fixed hero gallery positioning to be fully visible
- Removed mobile responsive CSS (MacBook presentation only)

**Result:** Clean, professional layout that works reliably for presentations

## Next Priorities

### 1. Model Training Game (Space Invaders) - HIGH PRIORITY
**Source:** `to_be_integrated/mt_me_space_invaders.html`
**Complexity:** High (most complex remaining game)
**Theme:** Train neural networks by defeating waves of training data
**Estimated Effort:** 6-8 hours (reduced due to simplified design)
**Target Duration:** 30-60 seconds gameplay for presentation

#### Detailed Implementation Plan:

**Game Mechanics:**
- **Ultra-short gameplay**: Only 8-10 aliens total (reduced from 15)
  - Wave 1: 5 neon aliens labeled "BATCH_1" through "BATCH_5"
  - Wave 2: 3 neon aliens labeled "EPOCH_1" through "EPOCH_3"
  - Boss: 1 large "COMPLEX_MODEL" alien
- **Quick progression**: High point values (50-100 per alien) for fast powerup spawn
- **Simplified victory**: Defeat boss to instantly win

**Visual Design:**
- **Neon alien style**: Glowing hollow rectangles with pulsing effects
  - Use stroke with bright colors + glow shadows
  - Colors: Cyan (#00FFFF), Magenta (#FF00FF), Yellow (#FFFF00)
  - Continuous pulse animation using sin waves
- **Matrix background**: Keep grid pattern but add subtle green tint
- **Hero integration**: Replace triangle ship with hero sprite + tractor beam bullets

**Powerup System:**
- **"Hyperparameter Optimizer" powerup**:
  - Spawns at 100 points (after ~2 aliens)
  - Pulsing golden neural network icon
  - When collected: Creates massive horizontal sweep clearing all regular aliens
  - Saves charge for boss battle
- **Collection method**: Shoot the powerup to collect (like Feature Engineering)

**Boss Mechanics:**
- **"Complex Model" boss**:
  - Spawns immediately after first wave cleared
  - Large neon rectangle with "COMPLEX_MODEL" label
  - Moves slowly side-to-side
  - Health: 5 hits normally OR 1 hit with powerup
  - Glowing red/orange with electric effects
- **Victory sequence**: Boss explodes → fireworks → "MODEL TRAINED!" message

**Technical Requirements:**
- Use `games/feature-engineering.html` as template (NOT data-cleaning.html)
- Create `games/model-training-classes.js` with:
  - `NeonAlien` class with glow rendering
  - `HyperparameterPowerup` class
  - `ComplexModelBoss` class
  - `TrainingBullet` class (hero's tractor beam style)
- Implement hero system with face switching in pause menu
- Add continuous firing while holding spacebar
- Standard game states: playing, paused, heroSwap, victory, gameOver

#### Step-by-Step Implementation for Sonnet:

1. **Copy template structure**:
   ```bash
   cp games/feature-engineering.html games/model-training.html
   cp games/feature-engineering-classes.js games/model-training-classes.js
   ```

2. **Update model-training.html**:
   - Change title to "Model Training - Training Phase"
   - Update `.level-display` to show "PHASE: MODEL TRAINING"
   - Change powerup text from "DATABASE CLEANER" to "HYPERPARAMETER OPTIMIZER"
   - Update controls text to mention "training batches" instead of "corrupted data"
   - Keep ALL hero system code intact

3. **Key code sections to modify in model-training.html**:
   ```javascript
   // Line ~150: Change asteroid creation to alien creation
   function createAliens() {
       // Wave 1: 5 aliens in a row
       for (let i = 0; i < 5; i++) {
           aliens.push(new NeonAlien(
               200 + i * 80,  // x position
               100,           // y position
               'BATCH_' + (i + 1),
               color(0, 255, 255),  // cyan
               50  // points
           ));
       }
   }

   // Line ~200: Change powerup spawn condition
   if (!powerupSpawned && score >= 100) {
       powerup = new HyperparameterPowerup(width/2, height/2);
       powerupSpawned = true;
   }

   // Line ~250: Add boss spawn after first wave
   if (aliens.filter(a => a.wave === 1).every(a => a.destroyed)) {
       if (!bossSpawned) {
           aliens.push(new ComplexModelBoss(width/2, 150));
           bossSpawned = true;
       }
   }
   ```

4. **In model-training-classes.js**, create these classes:
   ```javascript
   class NeonAlien {
       constructor(x, y, label, neonColor, points) {
           this.x = x;
           this.y = y;
           this.label = label;
           this.color = neonColor;
           this.points = points;
           this.size = 40;
           this.destroyed = false;
           this.wave = 1;
           this.moveSpeed = 1;
           this.direction = 1;
           this.pulsePhase = random(TWO_PI);
       }

       update() {
           // Horizontal movement
           this.x += this.moveSpeed * this.direction;
           if (this.x > width - 50 || this.x < 50) {
               this.direction *= -1;
               this.y += 20; // Move down
           }
       }

       render() {
           if (this.destroyed) return;
           
           push();
           // Neon glow effect
           let pulse = sin(frameCount * 0.05 + this.pulsePhase) * 0.3 + 0.7;
           
           // Multiple shadows for glow
           drawingContext.shadowBlur = 20 * pulse;
           drawingContext.shadowColor = this.color.toString();
           
           // Draw hollow rectangle
           stroke(this.color);
           strokeWeight(3);
           noFill();
           rect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
           
           // Label
           fill(this.color);
           noStroke();
           textAlign(CENTER);
           textSize(10);
           text(this.label, this.x, this.y);
           pop();
       }

       checkCollision(bullet) {
           let d = dist(this.x, this.y, bullet.x, bullet.y);
           return d < this.size/2 + 5;
       }
   }

   class ComplexModelBoss extends NeonAlien {
       constructor(x, y) {
           super(x, y, 'COMPLEX_MODEL', color(255, 100, 0), 500);
           this.size = 80;
           this.health = 5;
           this.maxHealth = 5;
           this.isBoss = true;
       }

       takeDamage(fromPowerup = false) {
           if (fromPowerup) {
               this.health = 0;
           } else {
               this.health--;
           }
           
           if (this.health <= 0) {
               this.destroyed = true;
               return true;
           }
           return false;
       }

       render() {
           if (this.destroyed) return;
           
           super.render();
           
           // Health bar
           push();
           fill(255, 0, 0);
           rect(this.x - 40, this.y - this.size/2 - 20, 80, 5);
           fill(0, 255, 0);
           rect(this.x - 40, this.y - this.size/2 - 20, 80 * (this.health/this.maxHealth), 5);
           pop();
       }
   }

   class HyperparameterPowerup {
       constructor(x, y) {
           this.x = x;
           this.y = y;
           this.size = 30;
           this.collected = false;
           this.pulsePhase = 0;
       }

       update() {
           this.pulsePhase += 0.1;
       }

       render() {
           if (this.collected) return;
           
           push();
           let pulse = sin(this.pulsePhase) * 0.3 + 0.7;
           
           // Golden glow
           drawingContext.shadowBlur = 30 * pulse;
           drawingContext.shadowColor = 'gold';
           
           // Neural network icon (simplified)
           stroke(255, 215, 0);
           strokeWeight(3);
           noFill();
           
           // Draw connected nodes
           for (let i = 0; i < 3; i++) {
               let angle = (TWO_PI / 3) * i;
               let x1 = this.x + cos(angle) * 15;
               let y1 = this.y + sin(angle) * 15;
               ellipse(x1, y1, 10);
               line(this.x, this.y, x1, y1);
           }
           ellipse(this.x, this.y, 15);
           
           // Label
           fill(255, 215, 0);
           noStroke();
           textAlign(CENTER);
           textSize(10);
           text('OPTIMIZE', this.x, this.y + 25);
           pop();
       }

       checkCollection(bullet) {
           if (this.collected) return false;
           let d = dist(this.x, this.y, bullet.x, bullet.y);
           if (d < this.size) {
               this.collected = true;
               return true;
           }
           return false;
       }
   }
   ```

5. **Critical game flow to implement**:
   - Start with 5 cyan aliens moving side to side
   - At 100 points (2 aliens), spawn golden powerup
   - Player shoots powerup to collect it
   - After all 5 aliens destroyed, spawn orange boss
   - If player has powerup: SPACE creates horizontal sweep killing boss instantly
   - If no powerup: Need 5 hits to kill boss
   - Victory triggers fireworks (already in template)

### 2. Model Deployment Game (Pac-Man) - MEDIUM PRIORITY  
**Source:** `to_be_integrated/model_deploy_pacman.html`
**Complexity:** Medium (mostly complete, needs integration)
**Theme:** Navigate deployment maze, collect data signals, avoid system errors
**Estimated Effort:** 4-5 hours (simplified for presentation)
**Target Duration:** 30-45 seconds gameplay for presentation

#### Detailed Implementation Plan:

**Game Mechanics:**
- **Simplified maze**: Reduce from 13x11 to 9x7 grid
  - Only ~15 dots total (vs ~30 in source)
  - 2 power pellets instead of 4
  - Wider corridors for easier navigation
- **Faster completion**: Higher movement speed, fewer collectibles
- **Quick victory**: Collect all dots to instantly win

**Visual Design:**
- **Matrix theme integration**:
  - Green maze walls with neon glow
  - Yellow dots become green "data signals"
  - Power pellets glow cyan as "DEPLOY" markers
- **Hero integration**: Replace Pac-Man with hero sprite
  - Keep mouth animation logic but apply to hero rotation
  - Add subtle tractor beam trail effect

**Powerup System:**
- **"System Deployer" powerup**:
  - First power pellet collected = permanent power mode
  - Changes all ghosts to frightened blue permanently
  - Second pellet = bonus points only
- **Visual feedback**: Screen flash + "DEPLOYMENT MODE ACTIVE" text

**Boss/Enemy Mechanics:**
- **Regular ghosts** (simplified):
  - Only 2 ghosts: "LATENCY" (red) and "TIMEOUT" (orange)
  - Very simple AI - random direction changes
  - Slow movement for predictable patterns
- **"Production Outage" boss ghost** (optional):
  - Appears after collecting 10 dots
  - Larger, purple ghost labeled "OUTAGE"
  - Can only be defeated in power mode
  - Defeating boss = instant victory option

**Technical Requirements:**
- Use `games/feature-engineering.html` as template
- Create `games/model-deployment-classes.js` with specific classes
- Implement hero system from shared sprites
- Simplified collision detection (grid-based only)
- Standard game states + maze rendering

#### Step-by-Step Implementation for Sonnet:

1. **Copy template structure**:
   ```bash
   cp games/feature-engineering.html games/model-deployment.html
   cp games/feature-engineering-classes.js games/model-deployment-classes.js
   ```

2. **CRITICAL: This is a MAJOR rewrite, not minor changes**
   - The Pac-Man game is fundamentally different from Asteroids
   - You'll need to replace most of the game logic
   - Keep: hero system, pause menu, game states
   - Replace: all gameplay mechanics

3. **Simplified 9x7 maze array** (use this EXACT maze):
   ```javascript
   const MAZE = [
       [1,1,1,1,1,1,1,1,1],
       [1,3,2,2,1,2,2,3,1],  // 3 = power pellet
       [1,2,1,2,2,2,1,2,1],  // 2 = dot
       [1,2,2,2,1,2,2,2,1],  // 1 = wall
       [1,2,1,2,2,2,1,2,1],  // 0 = empty
       [1,2,2,2,2,2,2,2,1],
       [1,1,1,1,1,1,1,1,1]
   ];
   // Total: 15 dots, 2 power pellets
   ```

4. **In model-deployment-classes.js**, create:
   ```javascript
   class DeploymentHero {
       constructor(gridX, gridY) {
           this.gridX = gridX;
           this.gridY = gridY;
           this.x = gridX * CELL_SIZE + CELL_SIZE/2;
           this.y = gridY * CELL_SIZE + CELL_SIZE/2;
           this.direction = 0; // 0=right, 1=down, 2=left, 3=up
           this.nextDirection = 0;
           this.speed = 3;
           this.moving = false;
           this.heroImage = null; // Set from main game
       }

       update() {
           // Grid-based movement
           let targetX = this.gridX * CELL_SIZE + CELL_SIZE/2;
           let targetY = this.gridY * CELL_SIZE + CELL_SIZE/2;

           // Try to change direction if at grid center
           if (this.x === targetX && this.y === targetY) {
               if (this.canMove(this.nextDirection)) {
                   this.direction = this.nextDirection;
               }
               if (this.canMove(this.direction)) {
                   let [dx, dy] = this.getDirectionVector(this.direction);
                   this.gridX += dx;
                   this.gridY += dy;
               }
           }

           // Smooth movement towards target
           if (this.x < targetX) this.x = min(this.x + this.speed, targetX);
           if (this.x > targetX) this.x = max(this.x - this.speed, targetX);
           if (this.y < targetY) this.y = min(this.y + this.speed, targetY);
           if (this.y > targetY) this.y = max(this.y - this.speed, targetY);
       }

       canMove(dir) {
           let [dx, dy] = this.getDirectionVector(dir);
           let newX = this.gridX + dx;
           let newY = this.gridY + dy;
           
           if (newX < 0 || newX >= MAZE[0].length || 
               newY < 0 || newY >= MAZE.length) {
               return false;
           }
           
           return MAZE[newY][newX] !== 1;
       }

       getDirectionVector(dir) {
           const vectors = [[1,0], [0,1], [-1,0], [0,-1]];
           return vectors[dir];
       }

       render() {
           push();
           imageMode(CENTER);
           translate(this.x, this.y);
           rotate(this.direction * HALF_PI);
           image(this.heroImage, 0, 0, CELL_SIZE * 0.8, CELL_SIZE * 0.8);
           pop();
       }
   }

   class DataSignal {
       constructor(gridX, gridY) {
           this.gridX = gridX;
           this.gridY = gridY;
           this.x = gridX * CELL_SIZE + CELL_SIZE/2;
           this.y = gridY * CELL_SIZE + CELL_SIZE/2;
           this.collected = false;
           this.pulsePhase = random(TWO_PI);
       }

       render() {
           if (this.collected) return;
           
           push();
           let pulse = sin(frameCount * 0.1 + this.pulsePhase) * 0.2 + 0.8;
           fill(0, 255, 0, 255 * pulse);
           noStroke();
           ellipse(this.x, this.y, 6);
           pop();
       }
   }

   class SystemError {
       constructor(gridX, gridY, name, color) {
           this.gridX = gridX;
           this.gridY = gridY;
           this.x = gridX * CELL_SIZE + CELL_SIZE/2;
           this.y = gridY * CELL_SIZE + CELL_SIZE/2;
           this.name = name;
           this.color = color;
           this.direction = floor(random(4));
           this.frightened = false;
           this.speed = 1.5;
       }

       update() {
           // Simple AI: change direction randomly at intersections
           let targetX = this.gridX * CELL_SIZE + CELL_SIZE/2;
           let targetY = this.gridY * CELL_SIZE + CELL_SIZE/2;

           if (this.x === targetX && this.y === targetY) {
               // At grid center, maybe change direction
               if (random() < 0.3 || !this.canMove(this.direction)) {
                   let possibleDirs = [];
                   for (let d = 0; d < 4; d++) {
                       if (this.canMove(d)) possibleDirs.push(d);
                   }
                   if (possibleDirs.length > 0) {
                       this.direction = random(possibleDirs);
                   }
               }

               // Move to next grid cell
               if (this.canMove(this.direction)) {
                   let [dx, dy] = this.getDirectionVector(this.direction);
                   this.gridX += dx;
                   this.gridY += dy;
               }
           }

           // Smooth movement
           let speed = this.frightened ? 1 : this.speed;
           if (this.x < targetX) this.x = min(this.x + speed, targetX);
           if (this.x > targetX) this.x = max(this.x - speed, targetX);
           if (this.y < targetY) this.y = min(this.y + speed, targetY);
           if (this.y > targetY) this.y = max(this.y - speed, targetY);
       }

       canMove(dir) {
           // Same as hero canMove
           let [dx, dy] = this.getDirectionVector(dir);
           let newX = this.gridX + dx;
           let newY = this.gridY + dy;
           
           if (newX < 0 || newX >= MAZE[0].length || 
               newY < 0 || newY >= MAZE.length) {
               return false;
           }
           
           return MAZE[newY][newX] !== 1;
       }

       getDirectionVector(dir) {
           const vectors = [[1,0], [0,1], [-1,0], [0,-1]];
           return vectors[dir];
       }

       render() {
           push();
           if (this.frightened) {
               fill(0, 0, 255, 150);
           } else {
               fill(this.color);
           }
           
           // Simple ghost shape
           ellipse(this.x, this.y, CELL_SIZE * 0.8);
           rect(this.x - CELL_SIZE * 0.4, this.y, CELL_SIZE * 0.8, CELL_SIZE * 0.3);
           
           // Eyes
           fill(255);
           ellipse(this.x - 5, this.y - 3, 6);
           ellipse(this.x + 5, this.y - 3, 6);
           
           // Label
           textAlign(CENTER);
           textSize(8);
           text(this.name, this.x, this.y + CELL_SIZE/2 + 5);
           pop();
       }
   }
   ```

5. **Main game loop structure in model-deployment.html**:
   ```javascript
   const CELL_SIZE = 60;  // Size of each maze cell
   let MAZE; // Define the 9x7 array from above
   let hero;
   let dots = [];
   let powerPellets = [];
   let ghosts = [];
   let walls = [];
   let score = 0;
   let powerMode = false;
   let dotsCollected = 0;

   function setup() {
       createCanvas(800, 600);
       
       // Create hero at center of maze
       hero = new DeploymentHero(4, 3);
       hero.heroImage = heroImages[selectedHero];
       
       // Parse maze and create objects
       for (let y = 0; y < MAZE.length; y++) {
           for (let x = 0; x < MAZE[0].length; x++) {
               if (MAZE[y][x] === 1) {
                   walls.push({x: x, y: y});
               } else if (MAZE[y][x] === 2) {
                   dots.push(new DataSignal(x, y));
               } else if (MAZE[y][x] === 3) {
                   powerPellets.push(new PowerPellet(x, y));
               }
           }
       }
       
       // Create 2 ghosts
       ghosts.push(new SystemError(1, 1, 'LATENCY', color(255, 0, 0)));
       ghosts.push(new SystemError(7, 5, 'TIMEOUT', color(255, 165, 0)));
   }

   function draw() {
       background(0);
       
       // Draw maze walls
       fill(0, 100, 0);
       stroke(0, 255, 0);
       strokeWeight(2);
       for (let wall of walls) {
           rect(wall.x * CELL_SIZE, wall.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
       }
       
       // Update and draw game objects
       hero.update();
       hero.render();
       
       // Check collisions
       for (let dot of dots) {
           if (!dot.collected && hero.gridX === dot.gridX && hero.gridY === dot.gridY) {
               dot.collected = true;
               dotsCollected++;
               score += 10;
           }
           dot.render();
       }
       
       // Check power pellet collection
       for (let pellet of powerPellets) {
           if (!pellet.collected && hero.gridX === pellet.gridX && hero.gridY === pellet.gridY) {
               pellet.collected = true;
               powerMode = true;
               // Make all ghosts frightened permanently
               for (let ghost of ghosts) {
                   ghost.frightened = true;
               }
           }
       }
       
       // Victory condition
       if (dotsCollected >= dots.length) {
           gameState = 'victory';
       }
   }

   // Handle arrow key input
   function keyPressed() {
       if (keyCode === LEFT_ARROW) hero.nextDirection = 2;
       if (keyCode === RIGHT_ARROW) hero.nextDirection = 0;
       if (keyCode === UP_ARROW) hero.nextDirection = 3;
       if (keyCode === DOWN_ARROW) hero.nextDirection = 1;
       
       // Keep all pause menu handling from template
   }
   ```

6. **Key differences from source to implement**:
   - Grid size: 9x7 instead of 13x11
   - Hero uses sprite instead of pac-man shape
   - Only 2 ghosts instead of 4
   - Power mode is permanent once activated
   - No boss ghost (keep it simple)
   - Victory when all 15 dots collected

## Project Completion Status
- **Games Completed:** 2/4 (50%)
- **Landing Page:** ✅ Complete
- **Remaining Work:** 2 games + final polish
- **Estimated Total:** 10-13 hours remaining (reduced due to simplifications)

## Presentation Flow Timing (NEW)
Designed for smooth demo flow during company presentation:

1. **Hub Introduction** (30 seconds)
   - Show ML pipeline overview
   - Explain team's role
   
2. **Feature Engineering** (30-45 seconds) ✅
   - Quick Asteroids gameplay
   - Database Cleaner powerup demo
   
3. **Model Training** (30-60 seconds) ⏳
   - Defeat neon aliens
   - Hyperparameter Optimizer → Boss defeat
   
4. **Model Deployment** (30-45 seconds) ⏳
   - Navigate simplified maze
   - System Deployer → Clear remaining signals
   
5. **Model Monitoring** (30-60 seconds) ✅
   - Defend against threats
   - System Reset → Production Outage defeat

**Total Demo Time:** ~3-4 minutes of active gameplay
**Key Design Principle:** Each game features a dramatic powerup moment leading to quick victory

## CRITICAL INSTRUCTIONS FOR SONNET

### Before Starting Implementation:

1. **Always test existing games first**:
   ```bash
   # Open these in browser to understand the patterns
   open games/feature-engineering.html
   open games/model-monitoring.html
   ```

2. **Check all required files exist**:
   ```bash
   ls games/feature-engineering.html  # Your template
   ls games/feature-engineering-classes.js  # Template classes
   ls shared/shared.js  # Hero system
   ls shared/sprites/Dave.png  # Hero images
   ```

3. **NEVER start from scratch**: Always copy the working template files first

### Implementation Priority:
1. **Model Training (Space Invaders)** - Start here, simpler changes to template
2. **Model Deployment (Pac-Man)** - More complex rewrite

### Key Files to Preserve Exactly:
- **Hero system code** in template (lines ~100-200 in feature-engineering.html)
- **Pause menu code** (lines ~300-400 in template)
- **Game state management** (`'playing'`, `'paused'`, `'heroSwap'`, `'victory'`, `'gameOver'`)
- **Shared CSS imports** and HTML structure

### Testing Checklist for Each Game:
- [ ] Game loads without JavaScript errors
- [ ] Hero sprites display correctly
- [ ] Arrow keys move hero/control game
- [ ] Space bar shoots/takes action
- [ ] P key pauses and shows pause menu
- [ ] H key in pause menu shows hero selection
- [ ] ESC key from pause menu returns to hub (calls `returnToHub()`)
- [ ] Powerup spawns at correct score
- [ ] Powerup can be collected (shot in Space Invaders)
- [ ] Boss appears after conditions met
- [ ] Victory screen shows fireworks
- [ ] R key restarts from victory/game over
- [ ] All text is readable (24px+ font sizes)

### Common Pitfalls to Avoid:
1. **Don't modify hero system** - it works perfectly, just use it
2. **Don't change CSS structure** - use the exact same HTML layout
3. **Don't remove Matrix rain background** - it's in the template
4. **Don't forget the fireworks** - victory must show celebration
5. **Always test pause menu** - this breaks easily if modified incorrectly

### File Structure Verification:
```
games/
├── feature-engineering.html ✅ (working template)
├── feature-engineering-classes.js ✅ (working classes)
├── model-monitoring.html ✅ (working game)
├── model-training.html ⏳ (copy from feature-engineering.html)
├── model-training-classes.js ⏳ (copy from feature-engineering-classes.js)
├── model-deployment.html ⏳ (copy from feature-engineering.html)
└── model-deployment-classes.js ⏳ (copy from feature-engineering-classes.js)
```

### Debug Commands:
```bash
# If games don't work, check browser console:
# Chrome: F12 → Console tab
# Look for red error messages
# Common issues: missing files, typos in class names

# Test hub navigation works:
open index.html
# Click on game tiles to verify they open
```

### Completion Criteria:
Each game MUST demonstrate this flow in under 60 seconds:
1. Hero moves and shoots/navigates
2. Collect points to spawn powerup
3. Use powerup dramatically (sweep/power mode)
4. Achieve victory quickly
5. Show fireworks celebration
6. Allow restart or return to hub

The goal is smooth, impressive demo flow for company presentation about ML operations workflow.