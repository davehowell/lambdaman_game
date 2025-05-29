// Feature Engineering Game - Feature Forge
// This game represents the feature engineering phase of the ML ops workflow

// Constants for game board
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 60; // Doubled for better visibility
const UI_WIDTH = 200; // Width for score and hero display

// Game state variables (local to feature engineering)
let feGrid = null;
let feCurrentPiece = null;
let feNextPiece = null;
let feScore = 0;
let feGameOver = false;
let feFallInterval = 1000; // Milliseconds for piece to fall one step
let feLastFallTime = 0;
let feLevel = 1;

// Hero and tractor beam effects
let tractorBeamActive = false;
let tractorBeamIntensity = 0;
let heroPositionX = 0;
let heroPositionY = 0;

// Tetromino shapes and colors
const PIECE_TYPES = 'IOTSLJZ';
const PIECE_SHAPES = {
  'I': [[1, 1, 1, 1]],
  'O': [[1, 1], [1, 1]],
  'T': [[0, 1, 0], [1, 1, 1]],
  'S': [[0, 1, 1], [1, 1, 0]],
  'Z': [[1, 1, 0], [0, 1, 1]],
  'J': [[1, 0, 0], [1, 1, 1]],
  'L': [[0, 0, 1], [1, 1, 1]]
};

const PIECE_COLORS = { // Matrix-themed HSB colors
  'I': [180, 90, 90], // Cyan data streams
  'O': [120, 85, 85], // Green matrix code
  'T': [270, 80, 90], // Purple neural paths
  'S': [150, 90, 80], // Teal feature vectors
  'Z': [300, 85, 85], // Magenta algorithms
  'J': [200, 90, 85], // Blue data lakes
  'L': [60, 80, 90]   // Yellow feature flags
};

const PIECE_WORDS = { // Data engineering terms for each piece
  'I': 'NORMALIZE', // Long piece gets longest word
  'O': 'ONE-HOT',   // Square piece
  'T': 'OUTER',     // T-piece
  'S': 'LEFT',      // S-piece
  'Z': 'RIGHT',     // Z-piece
  'J': 'INNER',     // J-piece
  'L': 'JOIN'       // L-piece
};

class Piece {
  constructor(type) {
    this.type = type;
    this.shape = PIECE_SHAPES[type];
    this.color = PIECE_COLORS[type];
    this.x = floor(COLS / 2) - floor(this.shape[0].length / 2);
    this.y = 0;
    this.rotation = 0; // Track rotation state (0, 90, 180, 270 degrees)
  }

  draw(useOwnPosition = true, customPixelX = 0, customPixelY = 0, bSize = BLOCK_SIZE) {
    // Draw as wireframe
    noFill();
    stroke(this.color[0], this.color[1], this.color[2]);
    strokeWeight(2);

    // First pass: draw all blocks
    for (let r = 0; r < this.shape.length; r++) {
      for (let c = 0; c < this.shape[r].length; c++) {
        if (this.shape[r][c]) {
          let finalPixelX, finalPixelY;
          if (useOwnPosition) {
            finalPixelX = (this.x + c) * bSize;
            finalPixelY = (this.y + r) * bSize;
          } else {
            finalPixelX = customPixelX + c * bSize;
            finalPixelY = customPixelY + r * bSize;
          }
          rect(finalPixelX, finalPixelY, bSize, bSize);
        }
      }
    }
    
    // Second pass: draw the word across the piece
    const word = PIECE_WORDS[this.type];
    if (word) {
      fill(this.color[0], this.color[1], this.color[2]);
      noStroke();
      textAlign(CENTER, CENTER);
      
      // Calculate the center of the piece
      let minX = Infinity, maxX = -Infinity;
      let minY = Infinity, maxY = -Infinity;
      
      for (let r = 0; r < this.shape.length; r++) {
        for (let c = 0; c < this.shape[r].length; c++) {
          if (this.shape[r][c]) {
            let finalPixelX, finalPixelY;
            if (useOwnPosition) {
              finalPixelX = (this.x + c) * bSize;
              finalPixelY = (this.y + r) * bSize;
            } else {
              finalPixelX = customPixelX + c * bSize;
              finalPixelY = customPixelY + r * bSize;
            }
            minX = min(minX, finalPixelX);
            maxX = max(maxX, finalPixelX + bSize);
            minY = min(minY, finalPixelY);
            maxY = max(maxY, finalPixelY + bSize);
          }
        }
      }
      
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      
      // Calculate piece dimensions for proper text fitting
      const pieceWidth = maxX - minX;
      const pieceHeight = maxY - minY;
      
      // Adjust text size based on piece type and orientation
      let fontSize = bSize * 0.4; // Larger base size for doubled blocks
      if (this.type === 'I') {
        // For I-piece, check if it's vertical or horizontal
        if (pieceHeight > pieceWidth) {
          // Vertical - text needs to fit in width
          fontSize = bSize * 0.15;
        } else {
          // Horizontal - text can be larger
          fontSize = bSize * 0.35;
        }
      } else if (this.type === 'O') {
        fontSize = bSize * 0.3; // Slightly smaller for ONE-HOT
      }
      
      push();
      translate(centerX, centerY);
      // Apply rotation based on piece's rotation state
      rotate(radians(this.rotation));
      textSize(fontSize);
      text(word, 0, 0);
      pop();
    }
  }

  rotate() {
    const newShape = [];
    for (let c = 0; c < this.shape[0].length; c++) {
      newShape.push([]);
      for (let r = this.shape.length - 1; r >= 0; r--) {
        newShape[c].push(this.shape[r][c]);
      }
    }
    this.shape = newShape;
    this.rotation = (this.rotation + 90) % 360; // Update rotation state
  }

  getRotatedShape() {
    const newShape = [];
    for (let c = 0; c < this.shape[0].length; c++) {
      newShape.push([]);
      for (let r = this.shape.length - 1; r >= 0; r--) {
        newShape[c].push(this.shape[r][c]);
      }
    }
    return newShape;
  }
}

function initializeFeatureEngineering() {
  // Initialize game for external loading
  console.log("Feature Engineering (Feature Forge) initializing...");
  
  // Test if we can access global variables
  console.log("Can access ROWS?", typeof ROWS);
  console.log("Can access COLS?", typeof COLS);
  console.log("resetGame function exists?", typeof resetGame);
  
  // Reset all variables to defaults first
  feGrid = null;
  feCurrentPiece = null;
  feNextPiece = null;
  feScore = 0;
  feGameOver = false;
  feLevel = 1;
  feFallInterval = 1000;
  feLastFallTime = 0;
  feInitAttempts = 0; // Reset init attempts
  
  // Initialize tractor beam
  tractorBeamActive = false;
  tractorBeamIntensity = 0;
  
  // Position hero in the side panel
  heroPositionX = COLS * BLOCK_SIZE + UI_WIDTH / 2;
  heroPositionY = BLOCK_SIZE * 6; // Adjusted for larger blocks
  
  // Now call resetFeatureEngineering to set everything up
  console.log("About to call resetFeatureEngineering()...");
  if (typeof resetFeatureEngineering === 'function') {
    resetFeatureEngineering();
  } else {
    console.error("resetFeatureEngineering is not a function!");
  }
  
  console.log("Feature Engineering initialization complete");
  console.log("feGrid initialized:", feGrid !== null);
  console.log("feCurrentPiece initialized:", feCurrentPiece !== null);
  console.log("feGrid value:", feGrid);
}

function resetFeatureEngineering() {
  console.log("resetFeatureEngineering() called");
  try {
    // Initialize the grid
    console.log("Creating grid with ROWS:", ROWS, "COLS:", COLS);
    feGrid = [];
    for (let r = 0; r < ROWS; r++) {
      feGrid[r] = [];
      for (let c = 0; c < COLS; c++) {
        feGrid[r][c] = 0;
      }
    }
    console.log("Grid created successfully, feGrid length:", feGrid.length);
    
    feScore = 0;
    feLevel = 1;
    feGameOver = false;
    
    // Try to spawn pieces, but handle if p5.js isn't ready
    feCurrentPiece = spawnNewPiece();
    feNextPiece = spawnNewPiece();
    
    // If pieces couldn't be spawned, we'll try again later
    if (!feCurrentPiece || !feNextPiece) {
      console.log("Pieces not spawned yet, will retry in update loop");
    }
    
    feFallInterval = 1000;
    feLastFallTime = typeof millis === 'function' ? millis() : 0;
    
    console.log("resetGame complete - feGrid is now:", feGrid !== null);
  } catch (error) {
    console.error("Error in resetGame:", error);
  }
}

function spawnNewPiece() {
  // Check if p5.js functions are available
  if (typeof random !== 'function' || typeof floor !== 'function') {
    console.log("p5.js not ready for piece spawning");
    return null;
  }
  
  const randomType = PIECE_TYPES[floor(random(PIECE_TYPES.length))];
  return new Piece(randomType);
}

function isValidMove(piece, testX, testY, testShape) {
  for (let r = 0; r < testShape.length; r++) {
    for (let c = 0; c < testShape[r].length; c++) {
      if (testShape[r][c]) {
        const boardX = testX + c;
        const boardY = testY + r;

        if (boardX < 0 || boardX >= COLS || boardY >= ROWS) {
          return false;
        }
        if (boardY >= 0 && feGrid[boardY][boardX] !== 0) {
          return false;
        }
      }
    }
  }
  return true;
}

function lockPiece() {
  for (let r = 0; r < feCurrentPiece.shape.length; r++) {
    for (let c = 0; c < feCurrentPiece.shape[r].length; c++) {
      if (feCurrentPiece.shape[r][c]) {
        let gridX = feCurrentPiece.x + c;
        let gridY = feCurrentPiece.y + r;
        if (gridY >= 0 && gridY < ROWS && gridX >= 0 && gridX < COLS) {
             feGrid[gridY][gridX] = feCurrentPiece.color;
        } else if (gridY < 0) {
            feGameOver = true;
        }
      }
    }
  }
}

function handlePieceLocking() {
  lockPiece();
  if (feGameOver) return;

  clearLines();
  feCurrentPiece = feNextPiece;
  feNextPiece = spawnNewPiece();

  feCurrentPiece.x = floor(COLS / 2) - floor(feCurrentPiece.shape[0].length / 2);
  feCurrentPiece.y = 0;

  if (!isValidMove(feCurrentPiece, feCurrentPiece.x, feCurrentPiece.y, feCurrentPiece.shape)) {
    feGameOver = true;
  }
  feLastFallTime = millis();
}

function clearLines() {
  let linesClearedThisTurn = 0;
  for (let r = ROWS - 1; r >= 0; r--) {
    let isFull = true;
    for (let c = 0; c < COLS; c++) {
      if (feGrid[r][c] === 0) {
        isFull = false;
        break;
      }
    }
    if (isFull) {
      feGrid.splice(r, 1);
      feGrid.unshift(Array(COLS).fill(0));
      linesClearedThisTurn++;
      r++;
    }
  }
  if (linesClearedThisTurn > 0) {
    if (linesClearedThisTurn === 1) feScore += 100 * feLevel;
    else if (linesClearedThisTurn === 2) feScore += 300 * feLevel;
    else if (linesClearedThisTurn === 3) feScore += 500 * feLevel;
    else if (linesClearedThisTurn >= 4) feScore += 800 * feLevel;

    feLevel = floor(feScore / 1000) + 1;
    feFallInterval = max(100, 1000 - (feLevel -1) * 50 - linesClearedThisTurn * 10);
  }
}

// Track initialization attempts to prevent infinite loops
let feInitAttempts = 0;

function updateFeatureEngineering() {
  // Safety check - ensure game is fully initialized
  if (!feGrid) {
    if (feInitAttempts < 5) {
      console.log("Game not initialized, calling resetFeatureEngineering... (attempt", feInitAttempts + 1, ")");
      feInitAttempts++;
      resetFeatureEngineering();
    }
    return;
  }
  
  // Reset attempt counter on successful initialization
  feInitAttempts = 0;

  // Update game logic
  if (feGameOver) {
    return;
  }

  // Safety check - ensure pieces are initialized (only if p5.js is ready)
  if (!feCurrentPiece && typeof random === 'function') {
    console.log("Current piece not initialized, reinitializing...");
    feCurrentPiece = spawnNewPiece();
    if (!feNextPiece) {
      feNextPiece = spawnNewPiece();
    }
    // If we just created pieces, reset the fall timer
    if (feCurrentPiece && typeof millis === 'function') {
      feLastFallTime = millis();
    }
  }

  // Update tractor beam intensity
  if (feCurrentPiece) {
    if (tractorBeamActive) {
      tractorBeamIntensity = min(tractorBeamIntensity + 0.1, 1.0);
    } else {
      tractorBeamIntensity = max(tractorBeamIntensity - 0.1, 0.0);
    }
  }

  if (typeof millis === 'function' && millis() - feLastFallTime > feFallInterval) {
    if (isValidMove(feCurrentPiece, feCurrentPiece.x, feCurrentPiece.y + 1, feCurrentPiece.shape)) {
      feCurrentPiece.y++;
      feLastFallTime = typeof millis === 'function' ? millis() : 0;
    } else {
      handlePieceLocking();
    }
  }
}

function renderFeatureEngineering() {
  // Safety check - ensure game is initialized
  if (!feGrid) {
    background(220, 15, 12);
    fill(255, 80, 80);
    textAlign(CENTER, CENTER);
    textSize(24);
    text("Initializing Feature Engineering...", width / 2, height / 2);
    return;
  }

  // Matrix-themed dark background
  background(220, 15, 12);
  
  // Center the game board
  push();
  const totalWidth = COLS * BLOCK_SIZE + UI_WIDTH;
  const offsetX = (width - totalWidth) / 2;
  translate(offsetX, 0);
  
  drawGridAndStaticUI();
  
  if (feGameOver) {
    drawGameOver();
    pop();
    return;
  }
  
  // Draw tractor beam effect
  if (feCurrentPiece && tractorBeamIntensity > 0) {
    drawTractorBeam();
  }
  
  // Draw current piece (with safety check)
  if (feCurrentPiece) {
    feCurrentPiece.draw(true);
  }
  
  // Draw hero character
  drawHero();
  
  drawScoreAndLevel();
  
  pop();
}

function drawTractorBeam() {
  if (!feCurrentPiece) return;
  
  let beamStartX = heroPositionX;
  let beamStartY = heroPositionY + 30; // Below hero
  let beamEndX = (feCurrentPiece.x + feCurrentPiece.shape[0].length / 2) * BLOCK_SIZE;
  let beamEndY = (feCurrentPiece.y + feCurrentPiece.shape.length / 2) * BLOCK_SIZE;
  
  // Draw multiple beam lines for effect
  for (let i = 0; i < 5; i++) {
    let alpha = (tractorBeamIntensity * 40) * (1 - i * 0.15);
    let beamWidth = 20 - i * 3;
    
    stroke(180, 90, 90, alpha); // Cyan beam
    strokeWeight(beamWidth);
    line(beamStartX, beamStartY, beamEndX, beamEndY);
  }
  
  // Beam particles
  for (let i = 0; i < 8; i++) {
    let t = (frameCount + i * 10) * 0.02;
    let x = lerp(beamStartX, beamEndX, (sin(t) + 1) * 0.5);
    let y = lerp(beamStartY, beamEndY, (sin(t) + 1) * 0.5);
    
    let particleAlpha = tractorBeamIntensity * 60;
    fill(180, 80, 100, particleAlpha);
    noStroke();
    circle(x + random(-15, 15), y + random(-15, 15), random(3, 8));
  }
}

function drawHero() {
  push();
  translate(heroPositionX, heroPositionY);
  
  // Draw the actual hero sprite if available
  if (typeof heroImages !== 'undefined' && heroImages && heroImages[selectedHero]) {
    imageMode(CENTER);
    const heroScale = 0.8; // Scale to fit nicely in side panel
    
    // Apply rotation/tilt when tractor beam is active
    if (tractorBeamActive && feCurrentPiece) {
      // Calculate angle from hero to piece
      let targetX = (feCurrentPiece.x + feCurrentPiece.shape[0].length / 2) * BLOCK_SIZE;
      let targetY = (feCurrentPiece.y + feCurrentPiece.shape.length / 2) * BLOCK_SIZE;
      let angle = atan2(targetY - heroPositionY, targetX - heroPositionX);
      rotate(angle - PI/2); // Adjust so hero points toward piece
    }
    
    image(heroImages[selectedHero], 0, 0, 
          heroImages[selectedHero].width * heroScale, 
          heroImages[selectedHero].height * heroScale);
  } else {
    // Fallback placeholder
    fill(120, 90, 100);
    noStroke();
    ellipse(0, 0, 40, 50); // Body
    
    // Simple hero indicator
    fill(180, 100, 100);
    textAlign(CENTER, CENTER);
    textSize(12);
    text("HERO", 0, 0);
  }
  
  pop();
}

function drawGridAndStaticUI() {
  // Draw grid background
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (feGrid[r][c] === 0) {
        // Empty cell - very faint grid lines
        noFill();
        stroke(0, 0, 20, 20);
        strokeWeight(1);
      } else {
        // Filled cell - wireframe with color
        noFill();
        stroke(feGrid[r][c][0], feGrid[r][c][1], feGrid[r][c][2]);
        strokeWeight(2);
      }
      rect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    }
  }

  const uiX = COLS * BLOCK_SIZE;
  fill(240, 5, 20);
  noStroke();
  rect(uiX, 0, UI_WIDTH, height);

  const previewBoxSize = BLOCK_SIZE * 4;
  const previewAreaX = uiX + (UI_WIDTH - previewBoxSize) / 2;
  const previewAreaY = BLOCK_SIZE * 1.5;

  fill(0,0,100);
  textSize(18);
  textAlign(CENTER, BOTTOM);
  text("NEXT", previewAreaX + previewBoxSize / 2, previewAreaY - 5);

  fill(240, 5, 10);
  stroke(0,0,5,30);
  rect(previewAreaX, previewAreaY, previewBoxSize, previewBoxSize);

  if (feNextPiece) {
    let previewBlockDrawSize = BLOCK_SIZE * 0.75;
    let shapePixelWidth = feNextPiece.shape[0].length * previewBlockDrawSize;
    let shapePixelHeight = feNextPiece.shape.length * previewBlockDrawSize;
    let pieceRenderX = previewAreaX + (previewBoxSize - shapePixelWidth) / 2;
    let pieceRenderY = previewAreaY + (previewBoxSize - shapePixelHeight) / 2;
    feNextPiece.draw(false, pieceRenderX, pieceRenderY, previewBlockDrawSize);
  }
}

function drawScoreAndLevel() {
  const uiX = COLS * BLOCK_SIZE;
  const scoreAreaX = uiX + UI_WIDTH / 2;
  const scoreAreaY = BLOCK_SIZE * 4;

  fill(0,0,100);
  textSize(24);
  textAlign(CENTER, TOP);
  text(`Level: ${feLevel}`, scoreAreaX, scoreAreaY);
  text(`Score: ${feScore}`, scoreAreaX, scoreAreaY + 35);
}


function drawGameOver() {
  fill(0, 0, 0, 70);
  rect(0, 0, COLS * BLOCK_SIZE, height);

  fill(0, 100, 100);
  textSize(40);
  textAlign(CENTER, CENTER);
  text("GAME OVER", COLS * BLOCK_SIZE / 2, height / 2 - 40);
  textSize(20);
  fill(0,0,100);
  text(`Final Score: ${feScore}`, COLS * BLOCK_SIZE / 2, height / 2);
  text("Press 'R' to Restart", COLS * BLOCK_SIZE / 2, height / 2 + 40);
}

function handleFeatureEngineeringInput() {
  if (feGameOver) {
    if (key === 'r' || key === 'R') {
      resetFeatureEngineering();
    } else if (keyCode === ESCAPE) {
      // Return to main menu
      gameState = 'intro';
      currentGame = null;
    }
    return;
  }

  // Pause handling
  if (key === 'p' || key === 'P' || keyCode === ESCAPE) {
    gameState = 'paused';
    return;
  }

  // Don't process movement if current piece isn't ready
  if (!feCurrentPiece) {
    return;
  }

  if (keyCode === LEFT_ARROW) {
    tractorBeamActive = true;
    if (isValidMove(feCurrentPiece, feCurrentPiece.x - 1, feCurrentPiece.y, feCurrentPiece.shape)) {
      feCurrentPiece.x--;
    }
  } else if (keyCode === RIGHT_ARROW) {
    tractorBeamActive = true;
    if (isValidMove(feCurrentPiece, feCurrentPiece.x + 1, feCurrentPiece.y, feCurrentPiece.shape)) {
      feCurrentPiece.x++;
    }
  } else if (keyCode === DOWN_ARROW) {
    tractorBeamActive = true;
    if (isValidMove(feCurrentPiece, feCurrentPiece.x, feCurrentPiece.y + 1, feCurrentPiece.shape)) {
      feCurrentPiece.y++;
      feScore += 1 * feLevel;
      feLastFallTime = typeof millis === 'function' ? millis() : 0;
    } else {
      handlePieceLocking();
    }
  } else if (keyCode === UP_ARROW) {
    tractorBeamActive = true;
    const rotatedShape = feCurrentPiece.getRotatedShape();
    if (isValidMove(feCurrentPiece, feCurrentPiece.x, feCurrentPiece.y, rotatedShape)) {
      feCurrentPiece.shape = rotatedShape;
      feCurrentPiece.rotation = (feCurrentPiece.rotation + 90) % 360;
    } else {
      if (isValidMove(feCurrentPiece, feCurrentPiece.x + 1, feCurrentPiece.y, rotatedShape)) {
        feCurrentPiece.x++;
        feCurrentPiece.shape = rotatedShape;
        feCurrentPiece.rotation = (feCurrentPiece.rotation + 90) % 360;
      } else if (isValidMove(feCurrentPiece, feCurrentPiece.x - 1, feCurrentPiece.y, rotatedShape)) {
        feCurrentPiece.x--;
        feCurrentPiece.shape = rotatedShape;
        feCurrentPiece.rotation = (feCurrentPiece.rotation + 90) % 360;
      }
    }
  } else if (key === ' ') {
    tractorBeamActive = true;
    let cellsDropped = 0;
    while (isValidMove(feCurrentPiece, feCurrentPiece.x, feCurrentPiece.y + 1, feCurrentPiece.shape)) {
      feCurrentPiece.y++;
      cellsDropped++;
    }
    feScore += cellsDropped * 2 * feLevel;
    handlePieceLocking();
  } else {
    // Deactivate tractor beam when no movement keys are pressed
    tractorBeamActive = false;
  }
}

// For backwards compatibility  
function keyPressed() {
  handleFeatureEngineeringInput();
}
