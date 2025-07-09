let player;
let bullets = [];
let asteroids = [];
let matrixStreams = [];
let selectedHero = 0; // Selected hero index
let gameState = 'intro'; // 'intro', 'heroSelect', 'gameSelect', 'playing', 'gameOver', 'paused', 'victory'
let currentGame = null; // Track which game is currently loaded
let heroImages = []; // Store loaded hero images
let heroNames = []; // Store hero names from filenames
let heroFaceImages = []; // Store loaded hero face images

// Available games in the ML ops workflow
let games = [
  {
    id: 'data_cleaning',
    title: 'Bad Data Matrix',
    subtitle: 'Data Cleaning Phase',
    description: 'Fight corrupted data in the matrix',
    filename: 'data_cleaning.js'
  },
  {
    id: 'feature_engineering',
    title: 'Feature Forge',
    subtitle: 'Feature Engineering Phase',
    description: 'Build and shape data features',
    filename: 'feature_engineering.js'
  },
  {
    id: 'model_training',
    title: 'Neural Network Training',
    subtitle: 'Model Training & Evaluation',
    description: 'Train and evaluate ML models',
    filename: 'model_training.js'
  },
  {
    id: 'model_deployment',
    title: 'Deployment Pipeline',
    subtitle: 'Model Deployment Phase',
    description: 'Deploy models to production',
    filename: 'model_deployment.js'
  },
  {
    id: 'model_monitoring',
    title: 'System Monitoring',
    subtitle: 'Model Monitoring Phase',
    description: 'Monitor model performance',
    filename: 'model_monitoring.js'
  }
];

let selectedGame = 0; // Currently selected game index
let isPaused = false; // Track pause state
let powerup = null; // Gemini powerup
let hasPowerup = false; // Track if player has collected powerup
let powerupSpawned = false; // Track if powerup has been spawned
let fireworks = []; // Victory fireworks
let sqlParticles = []; // SQL text particles from destroyed asteroids
let asteroidSpawnMultiplier = 1; // Increases after powerup collection

// Game variables needed for data cleaning game
let score = 0;
let lives = 3;
let gameOver = false;

// --- MATRIX RAIN SETTINGS ---
const SYMBOL_SIZE = 16;
const MIN_STREAM_LENGTH = 10;
const MAX_STREAM_LENGTH = 30;

// --- GAME SETTINGS ---
const PLAYER_SIZE = 100;
const ASTEROID_INIT_NUM = 8; // Initial number of asteroids
const ASTEROID_INIT_SIZE = 70; // Radius of largest asteroids
const ASTEROID_MIN_SIZE = 20;  // Smallest radius before destruction
const ASTEROID_SPEED_MAX = 1.2;
const BULLET_SPEED = 8;
const PLAYER_TURN_RATE = 0.08;
const PLAYER_THRUST = 0.15;
const PLAYER_FRICTION = 0.99; // Closer to 1 means less friction
const PLAYER_MAX_SPEED = 6;
const PLAYER_INVINCIBILITY_DURATION = 120; // Frames (2 seconds at 60fps)

// --- PRELOAD ---
function preload() {
  // Define the hero image files (you can add more here)
  // In a real dynamic system, you'd get this list from a server
  const heroFiles = ['Dave.png', 'Nadya.png']; // Add more hero PNG files here
  const faceFiles = ['Dave_face.png', 'Nadya_face.png']; // Face images for menus

  // Load all hero images dynamically
  for (let i = 0; i < heroFiles.length; i++) {
    heroImages[i] = loadImage('images/' + heroFiles[i]);
    heroFaceImages[i] = loadImage('images/' + faceFiles[i]);
    // Extract name from filename (remove .png extension)
    heroNames[i] = heroFiles[i].replace('.png', '');
  }
}

// --- SETUP ---
function setup() {
  console.log("Setting up Data Heroes...");

  try {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 360, 100, 100, 100); // Hue, Saturation, Brightness, Alpha
    angleMode(RADIANS); // Use radians for all angle calculations

    // Prevent arrow keys from scrolling the page
    window.addEventListener('keydown', function(e) {
      // Arrow keys and space bar
      if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
      }
    }, false);

    // Initialize Matrix Rain
    console.log("Initializing matrix rain...");
    let x = 0;
    for (let i = 0; x < width + SYMBOL_SIZE; i++) {
      let stream = new MatrixStream(x);
      stream.generateSymbols();
      matrixStreams.push(stream);
      x += SYMBOL_SIZE * 0.9; // Spacing of streams
    }

    // Initialize player for data cleaning game
    console.log("Initializing player...");
    player = new Player();

    console.log("Data Heroes setup complete!");
    console.log("Game state:", gameState);
    console.log("Available games:", games ? games.length : "undefined");
  } catch (error) {
    console.error("Error in setup:", error);
  }
}

// --- DRAW LOOP ---
function draw() {
  try {
    background(220, 10, 10, 35); // Dark blue-black background with some trail effect

    for (let stream of matrixStreams) {
      stream.render();
    }

    if (gameState === 'intro') {
      displayIntro();
      return;
    }
  } catch (error) {
    console.error("Error in draw loop:", error);
    // Fallback display
    background(0);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(24);
    text("Error loading game. Check console for details.", width/2, height/2);
  }

  if (gameState === 'heroSelect') {
    displayHeroSelect();
    return;
  }

  if (gameOver || gameState === 'gameOver') {
    displayGameOver();
    return;
  }

  if (gameState === 'paused') {
    displayPauseMenu();
    return;
  }

  if (gameState === 'heroSwap') {
    displayHeroSwap();
    return;
  }

  if (gameState === 'victory') {
    displayVictory();
    return;
  }

  // Route to appropriate game logic based on currentGame
  if (currentGame === 'data_cleaning') {
    // Data cleaning asteroids game
    player.handleInput();
    player.update();
    player.edges();
    player.render();
  } else if (currentGame === 'feature_engineering') {
    // Feature engineering game
    if (typeof updateFeatureEngineering === 'function') {
      updateFeatureEngineering();
      renderFeatureEngineering();
      return; // Feature engineering handles its own rendering
    }
  } else {
    // Default to data cleaning for now
    player.handleInput();
    player.update();
    player.edges();
    player.render();
  }

  if (player.isInvincible) {
    player.invincibilityTimer--;
    if (player.invincibilityTimer <= 0) {
      player.isInvincible = false;
    }
  }

  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    bullets[i].render();
    if (bullets[i].isOffscreen()) {
      // If DatabaseOptimizer finishes, trigger victory
      if (bullets[i] instanceof DatabaseOptimizer && bullets[i].expanding) {
        // Clear all asteroids and create particles for them
        for (let asteroid of asteroids) {
          // Create particles for visual effect
          for (let j = 0; j < 5; j++) {
            let particleX = asteroid.pos.x + random(-20, 20);
            let particleY = asteroid.pos.y + random(-20, 20);
            fireworks.push(new Firework(particleX, particleY));
          }
          for (let j = 0; j < 2; j++) {
            sqlParticles.push(new SQLParticle(asteroid.pos.x, asteroid.pos.y));
          }
          // Add score for remaining asteroids
          score += floor(map(asteroid.r, ASTEROID_MIN_SIZE, ASTEROID_INIT_SIZE, 50, 10));
        }
        asteroids = [];
        gameState = 'victory';
      }
      bullets.splice(i, 1);
    }
  }

  // Update and render SQL particles
  for (let i = sqlParticles.length - 1; i >= 0; i--) {
    sqlParticles[i].update();
    sqlParticles[i].render();
    if (sqlParticles[i].isDead()) {
      sqlParticles.splice(i, 1);
    }
  }

  for (let i = asteroids.length - 1; i >= 0; i--) {
    asteroids[i].update();
    asteroids[i].edges();
    asteroids[i].render();

    if (!player.isInvincible && player.hits(asteroids[i])) {
        playerHit();
    }
  }

  // Check if DatabaseOptimizer is expanding
  let databaseOptimizerExpanding = false;
  for (let bullet of bullets) {
    if (bullet instanceof DatabaseOptimizer && bullet.expanding) {
      databaseOptimizerExpanding = true;
      break;
    }
  }

  for (let i = bullets.length - 1; i >= 0; i--) {
    for (let j = asteroids.length - 1; j >= 0; j--) {
      if (bullets[i] && asteroids[j] && bullets[i].hits(asteroids[j])) {
        score += floor(map(asteroids[j].r, ASTEROID_MIN_SIZE, ASTEROID_INIT_SIZE, 50, 10));
        // Only break up asteroids if DatabaseOptimizer is not expanding
        if (asteroids[j].r > ASTEROID_MIN_SIZE * 1.6 && !databaseOptimizerExpanding) {
          let newAsteroids = asteroids[j].breakup();
          asteroids.push(...newAsteroids);
        }
        asteroids.splice(j, 1);
        bullets.splice(i, 1);
        break;
      }
    }
  }

  // Spawn powerup at score 500
  if (score >= 500 && !powerupSpawned && !hasPowerup) {
    powerup = new Powerup();
    powerupSpawned = true;
  }

  // Update and render powerup
  if (powerup) {
    powerup.update();
    powerup.render();

    // Check powerup collision
    if (player.hits(powerup)) {
      hasPowerup = true;
      powerup = null;
      asteroidSpawnMultiplier = 3; // Triple asteroid spawning
    }
  }

  // Only spawn new asteroids if DatabaseOptimizer is not active
  if (asteroids.length === 0 && !gameOver && !databaseOptimizerExpanding) {
    let numToSpawn = (ASTEROID_INIT_NUM + floor(score / 300)) * asteroidSpawnMultiplier;
    spawnAsteroids(numToSpawn, ASTEROID_INIT_SIZE);
  }

  displayScoreLives();
}

function spawnAsteroids(num, baseSize) {
  for (let i = 0; i < num; i++) {
    let x, y;
    let attempts = 0;
    do {
        x = random(width);
        y = random(height);
        attempts++;
        if (attempts > 100) break;
    } while (dist(x, y, player.pos.x, player.pos.y) < baseSize * 2 + PLAYER_SIZE * 2);
    asteroids.push(new Asteroid(createVector(x,y), baseSize));
  }
}

function playerHit() {
    lives--;
    if (lives <= 0) {
        gameOver = true;
        gameState = 'gameOver';
    } else {
        player.reset();
    }
}

function displayScoreLives() {
    fill(120, 90, 100);
    textSize(20);
    textAlign(LEFT, TOP);
    text(`Score: ${score}`, 20, 20);
    textAlign(RIGHT, TOP);
    text(`Lives: ${lives}`, width - 20, 20);
    textAlign(CENTER, TOP);
    textSize(16);
    fill(120, 60, 70);
    text("Press P to pause", width / 2, 20);

    // Show powerup status
    if (hasPowerup) {
        textSize(24);
        fill((frameCount * 3) % 360, 100, 100);
        text("DATABASE QUERY ENGINE OPTIMIZER READY!", width / 2, 60);
        textSize(16);
        fill(120, 80, 90);
        text("Press SPACE to unleash", width / 2, 85);
    }
}

function displayGameOver() {
    fill(0, 100, 100);
    textSize(60);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width / 2, height / 2 - 40);
    textSize(30);
    fill(120, 90, 100);
    text(`Final Score: ${score}`, width / 2, height / 2 + 20);
    textSize(24);
    text("Press R to Restart", width / 2, height / 2 + 70);
}

// Calculate face animation rotation for a given hero index
function getFaceRotation(heroIndex) {
    // Animation cycle: 6.5 seconds total (0.5s animation + 2s offset + 4s pause)
    let cycleDuration = 6.5 * 60; // Convert to frames (assuming 60fps)
    let animationDuration = 0.5 * 60; // 0.5 seconds in frames

    // Calculate offset: player 1 starts immediately, player 2 starts after 2 seconds
    let startOffset = heroIndex * 2 * 60; // 2 seconds offset between players

    // Calculate position in animation cycle
    let time = (frameCount + startOffset) % cycleDuration;

    if (time < animationDuration) {
        // During animation: swing counter-clockwise then clockwise
        let progress = time / animationDuration;
        // Create a smooth swing: -15° to +15° and back
        let swingAngle = sin(progress * TWO_PI) * radians(15);
        return swingAngle;
    } else {
        // During pause: no rotation
        return 0;
    }
}

// Load the currently selected game
function loadCurrentGame() {
    currentGame = games[selectedGame].id;
    console.log(`Loading game: ${currentGame} (${games[selectedGame].title})`);

    if (currentGame === 'data_cleaning') {
        // Initialize the asteroids game (already in this file for now)
        resetGame();
    } else if (currentGame === 'feature_engineering') {
        // Initialize feature engineering game
        try {
            if (typeof initializeFeatureEngineering === 'function') {
                initializeFeatureEngineering();
                console.log("Feature Engineering initialized successfully");
            } else {
                console.log("Feature Engineering game not loaded yet");
                gameState = 'intro';
            }
        } catch (error) {
            console.error("Error initializing Feature Engineering:", error);
            gameState = 'intro';
        }
    } else {
        // Placeholder for other games
        console.log(`${games[selectedGame].title} - Coming Soon!`);
        gameState = 'intro'; // Return to menu for now
        return;
    }
}

function displayIntro() {
    try {
        // Title
        fill(120, 100, 100);
        textSize(96);
        textAlign(CENTER, CENTER);
        text("DATA HEROES", width / 2, height / 2 - 250);

        textSize(24);
        fill(120, 80, 90);
        text("Machine Learning Operations Workflow", width / 2, height / 2 - 200);

        // Main mission selection
        textSize(32);
        fill(120, 90, 100);
        text("Select Your Mission:", width / 2, height / 2 - 140);

        // Check if games array exists
        if (!games || games.length === 0) {
            textSize(18);
            fill(255, 80, 80);
            text("Error: Games not loaded", width / 2, height / 2);
            return;
        }

        // Draw game options with wider spacing
        let spacing = min(160, width / (games.length + 1));
        let startX = width / 2 - (spacing * (games.length - 1) / 2);

        for (let i = 0; i < games.length; i++) {
            let gameX = startX + spacing * i;
            let gameY = height / 2 - 50;

            push();

            // Highlight selected game
            if (i === selectedGame) {
                stroke(120, 100, 100);
                strokeWeight(1);
                noFill();
                rect(gameX - 60, gameY - 45, 120, 120, 10);
            }

            // Game number box - same color for all
            fill(120, 80, 90);
            rectMode(CENTER);
            rect(gameX, gameY, 60, 60, 10);

            // Game number
            fill(0, 0, 100);
            textSize(32);
            text(i + 1, gameX, gameY);

            // Game title - consistent styling
            textSize(14);
            textStyle(NORMAL); // Explicitly set to normal weight
            fill(120, 80, 90);
            text(games[i].title, gameX, gameY + 50);

            pop();
        }

        // Selected game description
        textSize(18);
        fill(120, 70, 80);
        text(games[selectedGame].subtitle, width / 2, height / 2 + 80);
        textSize(16);
        fill(120, 60, 70);
        text(games[selectedGame].description, width / 2, height / 2 + 110);

        // Instructions
        textSize(16);
        fill(120, 60, 70);
        text("Use ← → arrows to select • Press ENTER to choose heroes • Press SPACE to start", width / 2, height / 2 + 160);

    } catch (error) {
        console.error("Error in displayIntro:", error);
        fill(255, 80, 80);
        textAlign(CENTER, CENTER);
        textSize(18);
        text("Error displaying intro: " + error.message, width / 2, height / 2);
    }
}

function displayHeroSelect() {
    // Title
    fill(120, 100, 100);
    textSize(64);
    textAlign(CENTER, CENTER);
    text("DATA HEROES", width / 2, height / 2 - 200);

    // Current mission info
    textSize(28);
    fill(120, 90, 100);
    text(games[selectedGame].title, width / 2, height / 2 - 150);

    textSize(18);
    fill(120, 70, 80);
    text(games[selectedGame].description, width / 2, height / 2 - 120);

    // Hero selection
    textSize(24);
    fill(120, 90, 100);
    text("Choose Your Data Hero:", width / 2, height / 2 - 70);

    // Calculate spacing for heroes
    let heroCount = heroImages.length;
    let spacing = min(300, width / (heroCount + 1));
    let startX = width / 2 - (spacing * (heroCount - 1) / 2);

    // Draw all hero options using face images
    for (let i = 0; i < heroCount; i++) {
        push();
        let heroX = startX + spacing * i;
        let heroY = height / 2 + 30;

        // Highlight selected hero
        if (i === selectedHero) {
            stroke(120, 100, 100);
            strokeWeight(3);
            noFill();
            ellipse(heroX, heroY, 140, 140);
        }

        // Apply face animation rotation
        translate(heroX, heroY);
        rotate(getFaceRotation(i));

        imageMode(CENTER);
        let faceScale = 0.8;
        image(heroFaceImages[i], 0, 0,
              heroFaceImages[i].width * faceScale, heroFaceImages[i].height * faceScale);
        pop();

        // Hero name and key prompt
        textSize(20);
        fill(120, 80, 90);
        text(heroNames[i], heroX, heroY + 100);
        text(`Press [${i + 1}]`, heroX, heroY + 120);
    }

    // Instructions
    textSize(16);
    fill(120, 60, 70);
    text("Select your hero and press ENTER to start the mission!", width / 2, height / 2 + 200);
}

function displayPauseMenu() {
    // Semi-transparent overlay
    push();
    fill(0, 0, 0, 50);
    rect(0, 0, width, height);
    pop();

    // Pause menu box
    push();
    fill(220, 20, 20, 90);
    stroke(120, 100, 100);
    strokeWeight(2);
    rectMode(CENTER);
    rect(width / 2, height / 2, 400, 350, 10);
    pop();

    // Title
    fill(120, 100, 100);
    textSize(36);
    textAlign(CENTER, CENTER);
    text("PAUSED", width / 2, height / 2 - 120);

    // Current hero display with animated face
    push();
    translate(width / 2, height / 2 - 50);
    rotate(getFaceRotation(selectedHero));

    imageMode(CENTER);
    let faceScale = 0.6;
    image(heroFaceImages[selectedHero], 0, 0,
          heroFaceImages[selectedHero].width * faceScale,
          heroFaceImages[selectedHero].height * faceScale);
    pop();

    textSize(16);
    fill(120, 80, 90);
    text(`Playing as: ${heroNames[selectedHero]}`, width / 2, height / 2);

    // Menu options
    textSize(20);
    fill(120, 90, 100);
    text("[ENTER] Continue Playing", width / 2, height / 2 + 50);
    text("[H] Change Hero", width / 2, height / 2 + 80);
    text("[R] Restart Game", width / 2, height / 2 + 110);
    text("[M] Main Menu", width / 2, height / 2 + 140);
}

function displayHeroSwap() {
    // Keep the game visible in background
    // Display all game elements but frozen
    for (let stream of matrixStreams) {
        stream.render();
    }
    player.render();
    for (let asteroid of asteroids) {
        asteroid.render();
    }
    for (let bullet of bullets) {
        bullet.render();
    }
    displayScoreLives();

    // Semi-transparent overlay
    push();
    fill(0, 0, 0, 70);
    rect(0, 0, width, height);
    pop();

    // Hero selection box
    push();
    fill(220, 20, 20, 90);
    stroke(120, 100, 100);
    strokeWeight(2);
    rectMode(CENTER);
    let boxWidth = min(600, width * 0.8);
    let boxHeight = 400;
    rect(width / 2, height / 2, boxWidth, boxHeight, 10);
    pop();

    // Title
    fill(120, 100, 100);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("CHANGE HERO", width / 2, height / 2 - 140);

    textSize(18);
    fill(120, 80, 90);
    text("Select a new hero to continue with current progress", width / 2, height / 2 - 100);

    // Calculate spacing for heroes
    let heroCount = heroImages.length;
    let spacing = min(200, boxWidth / (heroCount + 1));
    let startX = width / 2 - (spacing * (heroCount - 1) / 2);

    // Draw all hero options using face images
    for (let i = 0; i < heroCount; i++) {
        push();
        let heroX = startX + spacing * i;
        let heroY = height / 2;

        // Highlight current hero
        if (i === selectedHero) {
            stroke(120, 100, 100);
            strokeWeight(3);
            noFill();
            ellipse(heroX, heroY, 120, 120);
        }

        // Apply face animation rotation
        translate(heroX, heroY);
        rotate(getFaceRotation(i));

        imageMode(CENTER);
        let faceScale = 0.6; // Smaller scale for hero swap
        image(heroFaceImages[i], 0, 0,
              heroFaceImages[i].width * faceScale, heroFaceImages[i].height * faceScale);
        pop();

        // Hero name and key prompt
        textSize(18);
        fill(120, 80, 90);
        text(heroNames[i], heroX, heroY + 70);
        text(`[${i + 1}]`, heroX, heroY + 90);
    }

    // Instructions
    textSize(16);
    fill(120, 60, 70);
    text("Press number to select • ESC to cancel", width / 2, height / 2 + 150);
}

function keyPressed() {
  if (gameState === 'intro') {
    // Game selection navigation
    if (keyCode === LEFT_ARROW) {
      selectedGame = (selectedGame - 1 + games.length) % games.length;
    } else if (keyCode === RIGHT_ARROW) {
      selectedGame = (selectedGame + 1) % games.length;
    } else if (keyCode === ENTER) {
      gameState = 'heroSelect';
    } else if (key === ' ') {
      // Quick start with current selections
      gameState = 'playing';
      loadCurrentGame();
    }
    return;
  }

  if (gameState === 'heroSelect') {
    // Handle dynamic number of heroes (1-9 keys)
    let heroIndex = parseInt(key) - 1;
    if (!isNaN(heroIndex) && heroIndex >= 0 && heroIndex < heroImages.length) {
      selectedHero = heroIndex;
    } else if (keyCode === ENTER) {
      gameState = 'playing';
      loadCurrentGame();
    } else if (keyCode === ESCAPE) {
      gameState = 'intro';
    }
    return;
  }

  if (gameState === 'paused') {
    if (keyCode === ENTER) {
      gameState = 'playing';
    } else if (key === 'h' || key === 'H') {
      gameState = 'heroSwap';
    } else if (key === 'r' || key === 'R') {
      // Restart the appropriate game
      if (currentGame === 'data_cleaning') {
        resetGame();
      } else if (currentGame === 'feature_engineering') {
        if (typeof resetFeatureEngineering === 'function') {
          resetFeatureEngineering();
        }
      }
      gameState = 'playing';
    } else if (key === 'm' || key === 'M') {
      gameState = 'intro';
      gameOver = false;
    }
    return;
  }

  if (gameState === 'heroSwap') {
    // Handle hero selection during pause
    let heroIndex = parseInt(key) - 1;
    if (!isNaN(heroIndex) && heroIndex >= 0 && heroIndex < heroImages.length) {
      selectedHero = heroIndex;
      gameState = 'playing';  // Resume game with new hero
    }
    if (keyCode === ESCAPE) {
      gameState = 'paused';  // Go back to pause menu
    }
    return;
  }

  if (gameState === 'playing') {
    // Universal pause for all games
    if (key === 'p' || key === 'P' || keyCode === ESCAPE) {
      gameState = 'paused';
      return;
    }

    // Route input to appropriate game
    if (currentGame === 'feature_engineering') {
      if (typeof handleFeatureEngineeringInput === 'function') {
        handleFeatureEngineeringInput();
      }
      return;
    } else if (currentGame === 'data_cleaning') {
      // Handle data cleaning (asteroids) input
      if (key === ' ') {
        player.shoot();
      }
    }
  }

  if ((gameOver || gameState === 'victory') && (key === 'r' || key === 'R')) {
      if (currentGame === 'data_cleaning') {
        resetGame();
      } else if (currentGame === 'feature_engineering') {
        if (typeof resetGame === 'function') {
          resetGame(); // Feature engineering's resetGame
        }
      }
      gameState = 'playing';
      return;
  }
}


function windowResized() {
  // Account for any browser UI elements
  let w = window.innerWidth;
  let h = window.innerHeight;
  resizeCanvas(w, h);

  // Regenerate matrix streams for new size
  matrixStreams = [];
  let x = 0;
  for (let i = 0; x < width + SYMBOL_SIZE; i++) {
    let stream = new MatrixStream(x);
    stream.generateSymbols();
    matrixStreams.push(stream);
    x += SYMBOL_SIZE * 0.9;
  }
}

function resetGame() {
    score = 0;
    lives = 3;
    gameOver = false;
    asteroids = [];
    bullets = [];
    fireworks = [];
    sqlParticles = [];
    powerup = null;
    hasPowerup = false;
    powerupSpawned = false;
    asteroidSpawnMultiplier = 1;
    player.reset();
    spawnAsteroids(ASTEROID_INIT_NUM, ASTEROID_INIT_SIZE);
}

// Draw pixelated hero sprites
function drawPixelHero(heroIndex) {
    noStroke();
    const pixelSize = 2;

    if (heroIndex === 0) {
        // Hero 1 - Data Analyst (glasses, professional look)
        const hero1 = [
            "  333333  ",
            " 33333333 ",
            " 31133113 ",
            " 33333333 ",
            "  333333  ",
            "  444444  ",
            " 44444444 ",
            " 44222244 ",
            " 44444444 ",
            "  44  44  ",
            "  55  55  "
        ];

        const colors = {
            '1': color(0, 0, 0), // Black (eyes)
            '2': color(180, 80, 100), // Cyan (tie/accent)
            '3': color(30, 50, 90), // Skin tone
            '4': color(240, 20, 80), // Blue shirt
            '5': color(0, 0, 30) // Dark pants
        };

        drawPixelArt(hero1, colors, pixelSize);

    } else {
        // Hero 2 - Data Engineer (hard hat, tools)
        const hero2 = [
            "  666666  ",
            " 66666666 ",
            " 66777766 ",
            " 31133113 ",
            " 33333333 ",
            "  333333  ",
            " 88888888 ",
            " 88898988 ",
            " 88888888 ",
            "  88  88  ",
            "  55  55  "
        ];

        const colors = {
            '1': color(0, 0, 0), // Black (eyes)
            '3': color(30, 50, 90), // Skin tone
            '5': color(0, 0, 30), // Dark pants
            '6': color(60, 100, 100), // Yellow hard hat
            '7': color(60, 100, 80), // Hard hat stripe
            '8': color(30, 100, 50), // Orange vest
            '9': color(180, 80, 100) // Tool/accent
        };

        drawPixelArt(hero2, colors, pixelSize);
    }
}

function drawPixelArt(pattern, colors, pixelSize) {
    for (let y = 0; y < pattern.length; y++) {
        for (let x = 0; x < pattern[y].length; x++) {
            const char = pattern[y][x];
            if (char !== ' ' && colors[char]) {
                fill(colors[char]);
                rect((x - pattern[y].length/2) * pixelSize,
                     (y - pattern.length/2) * pixelSize,
                     pixelSize, pixelSize);
            }
        }
    }
}

// --- PLAYER CLASS ---
class Player {
  constructor() {
    this.pos = createVector(width / 2, height / 2);
    this.r = PLAYER_SIZE / 2; // Keep for compatibility with other systems
    this.spriteWidth = 124; // Actual sprite width
    this.spriteHeight = 164; // Actual sprite height
    this.collisionWidth = 62; // Half the sprite width for collision
    this.collisionHeight = 164; // Full sprite height for collision
    this.heading = -PI / 2; // Start pointing upwards (0 is right, -PI/2 is up)
    this.vel = createVector(0, 0);
    this.isInvincible = false;
    this.invincibilityTimer = 0;
    this.boosterColorHue = 0; // For flame color cycling
  }

  // Get collision properties based on selected hero (player 2 is horizontally flipped)
  getCollisionRotation() {
    return selectedHero === 1 ? radians(-15) : radians(15); // Player 2: -15°, others: +15°
  }

  getCollisionOffsetX() {
    return selectedHero === 1 ? 31 : -31; // Player 2: +31, others: -31
  }

  reset() {
    this.pos = createVector(width / 2, height / 2);
    this.vel = createVector(0, 0);
    this.heading = -PI / 2;
    this.isInvincible = true;
    this.invincibilityTimer = PLAYER_INVINCIBILITY_DURATION;
  }

  handleInput() {
    if (keyIsDown(LEFT_ARROW)) {
      this.heading -= PLAYER_TURN_RATE;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.heading += PLAYER_TURN_RATE;
    }
    if (keyIsDown(UP_ARROW)) {
      let force = p5.Vector.fromAngle(this.heading); // Vector points in direction of heading
      force.mult(PLAYER_THRUST);
      this.vel.add(force);
      this.boosterColorHue = (this.boosterColorHue + 8) % 60;
    }
    if (keyIsDown(DOWN_ARROW)) {
      // Reverse thrust - apply force opposite to current heading
      let force = p5.Vector.fromAngle(this.heading + PI); // Opposite direction
      force.mult(PLAYER_THRUST * 0.7); // Slightly weaker reverse thrust
      this.vel.add(force);
      this.boosterColorHue = (this.boosterColorHue + 8) % 60;
    }
  }

  update() {
    this.vel.mult(PLAYER_FRICTION);
    this.vel.limit(PLAYER_MAX_SPEED);
    this.pos.add(this.vel);
  }

  render() {
    push();
    translate(this.pos.x, this.pos.y);

    if (this.isInvincible && floor(frameCount / 6) % 2 === 0) {
      // Blink effect - skip rendering
    } else {
        // Draw hero image
        push();
        rotate(this.heading + PI/2); // Adjust rotation so hero faces direction
        imageMode(CENTER);
        let heroScale = 1; // Adjust this to fit your game scale
        image(heroImages[selectedHero], 0, 0,
              heroImages[selectedHero].width * heroScale,
              heroImages[selectedHero].height * heroScale);
        pop();

        // Draw main thruster effect from boots when thrusting forward
        if (keyIsDown(UP_ARROW) && this.vel.magSq() > 0.01) {
            push();
            rotate(this.heading + PI/2); // Align with character orientation

            // Thruster comes from bottom of character (boots area)
            // Offset to match where the character's boots actually are
            let bootOffsetX = this.getCollisionOffsetX(); // Dynamic offset based on hero
            let bootOffsetY = this.spriteHeight / 2; // Bottom of sprite

            noStroke();
            for (let i = 0; i < 8; i++) {
                let alpha = map(i, 0, 8, 100, 10);
                fill(this.boosterColorHue + i * 5, 80, 90, alpha);
                textSize(random(10, 16));
                textAlign(CENTER, CENTER);
                let dataChar = random(['0', '1', '>', '<', '/', '*', '{', '}']);
                // Spray effect from boots - wider spread, offset to boot position
                let spreadX = bootOffsetX + random(-25, 25);
                let spreadY = bootOffsetY + i * 12 + random(-5, 5);
                text(dataChar, spreadX, spreadY);
            }
            pop();
        }

        // Draw reverse thruster effect from top corners when reverse thrusting
        if (keyIsDown(DOWN_ARROW) && this.vel.magSq() > 0.01) {
            push();
            rotate(this.heading + PI/2); // Align with character orientation

            // Two reverse thrusters at top corners, splayed outward
            let topOffset = -this.spriteHeight / 2 - 10; // Top of sprite
            let thrusterPositions = [
                {x: -20, angle: -0.3}, // Left thruster, angled left
                {x: 20, angle: 0.3}    // Right thruster, angled right
            ];

            noStroke();

            // Draw both reverse thrusters
            for (let thruster of thrusterPositions) {
                push();
                translate(thruster.x, topOffset);
                rotate(thruster.angle); // Splay angle

                for (let i = 0; i < 4; i++) {
                    let alpha = map(i, 0, 4, 80, 15);
                    fill(this.boosterColorHue + 180, 70, 80, alpha); // Different hue for reverse
                    textSize(random(6, 10));
                    textAlign(CENTER, CENTER);
                    let dataChar = random(['!', '?', 'X', '-', '~']);
                    // Thruster spray in the angled direction
                    let spreadX = random(-8, 8);
                    let spreadY = -i * 8 + random(-3, 3);
                    text(dataChar, spreadX, spreadY);
                }
                pop();
            }

            pop();
        }
    }
    pop();
  }

  edges() {
    if (this.pos.x > width + this.r) this.pos.x = -this.r;
    else if (this.pos.x < -this.r) this.pos.x = width + this.r;
    if (this.pos.y > height + this.r) this.pos.y = -this.r;
    else if (this.pos.y < -this.r) this.pos.y = height + this.r;
  }

  shoot() {
    if (!gameOver) {
        // Calculate bullet start position from the ship's nose
        let noseOffsetLength = this.spriteHeight / 2 + 10; // Distance from center to nose tip
        let bulletStartPos = createVector(
            this.pos.x + noseOffsetLength * cos(this.heading),
            this.pos.y + noseOffsetLength * sin(this.heading)
        );

        if (hasPowerup) {
            // Use special database optimizer weapon
            bullets.push(new DatabaseOptimizer(bulletStartPos, this.heading));
            hasPowerup = false; // One-time use
            asteroidSpawnMultiplier = 1; // Reset spawn rate
        } else {
            bullets.push(new Bullet(bulletStartPos, this.heading));
        }
    }
  }

  hits(object) {
    // First, find the collision center (offset from sprite center)
    let playerRotation = this.heading + PI/2; // Player's visual rotation
    let offsetCos = cos(playerRotation);
    let offsetSin = sin(playerRotation);

    // Get dynamic collision properties based on selected hero
    let collisionOffsetX = this.getCollisionOffsetX();
    let collisionRotation = this.getCollisionRotation();

    // Calculate the actual collision center position
    let collisionCenterX = this.pos.x + collisionOffsetX * offsetCos;
    let collisionCenterY = this.pos.y + collisionOffsetX * offsetSin;

    // Get the asteroid position relative to collision center
    let relX = object.pos.x - collisionCenterX;
    let relY = object.pos.y - collisionCenterY;

    // Rotate the relative position by the negative of collision rotation + heading
    // This transforms the asteroid position into the oval's coordinate system
    let totalRotation = -(playerRotation + collisionRotation);
    let cos_r = cos(totalRotation);
    let sin_r = sin(totalRotation);

    let rotatedX = relX * cos_r - relY * sin_r;
    let rotatedY = relX * sin_r + relY * cos_r;

    // Check if point is within the rotated ellipse
    let a = this.collisionWidth / 2; // Semi-major axis (narrower)
    let b = this.collisionHeight / 2; // Semi-minor axis

    // Add asteroid radius to the check for better collision
    let asteroidR = object.r * 0.75;

    // Ellipse equation: (x/a)^2 + (y/b)^2 <= 1
    // We scale up the ellipse by the asteroid radius
    let ellipseCheck = sq(rotatedX / (a + asteroidR)) + sq(rotatedY / (b + asteroidR));

    return ellipseCheck <= 1;
  }
}

// --- BULLET CLASS ---
class Bullet {
  constructor(startPos, angle) {
    this.pos = startPos.copy(); // Use the provided start position (ship's nose)
    this.vel = p5.Vector.fromAngle(angle);
    this.vel.mult(BULLET_SPEED);
    this.r = 15;
    this.life = 80;
  }

  update() {
    this.pos.add(this.vel);
    this.life--;
  }

  render() {
    push();
    // Data cleaning bullets - look like SQL or code
    fill(180, 100, 100, map(this.life, 0, 30, 0, 100));
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(24);
    let cleanData = random(['SELECT', 'DELETE', 'WHERE', 'UPDATE']);
    text(cleanData, this.pos.x, this.pos.y);
    pop();
  }

  isOffscreen() {
    return (this.pos.x < -this.r || this.pos.x > width + this.r ||
            this.pos.y < -this.r || this.pos.y > height + this.r || this.life <= 0);
  }

  hits(asteroid) {
    let d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
    return (d < this.r + asteroid.r);
  }
}

// --- ASTEROID CLASS ---
class Asteroid {
  constructor(pos, r) {
    this.pos = pos ? pos.copy() : createVector(random(width), random(height));
    this.r = r ? r * random(0.7, 1.1) : ASTEROID_INIT_SIZE * random(0.7, 1.1);
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(ASTEROID_SPEED_MAX * 0.4, ASTEROID_SPEED_MAX));

    this.totalVertices = floor(random(6, 12));
    this.offsets = [];
    for (let i = 0; i < this.totalVertices; i++) {
      this.offsets.push(random(-this.r * 0.5, this.r * 0.3));
    }

    this.angle = random(TWO_PI);
    this.rotationSpeed = random(-0.015, 0.015);

    this.dataBits = [];
    let numBits = floor(map(this.r, ASTEROID_MIN_SIZE, ASTEROID_INIT_SIZE, 1, 4));
    for (let i = 0; i < numBits; i++) {
        let angle = random(TWO_PI);
        let distFactor = random(0.1, 0.55);
        this.dataBits.push({
            char: random(['0','1',';','{','}','()','=>','if','0x','#!','*','&']),
            x: cos(angle) * this.r * distFactor,
            y: sin(angle) * this.r * distFactor,
            size: max(8, this.r * random(0.18, 0.28))
        });
    }
    this.colorHue = random(100, 140);
  }

  update() {
    this.pos.add(this.vel);
    this.angle += this.rotationSpeed;
  }

  render() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);

    stroke(this.colorHue, 90, 50);
    strokeWeight(1.5);
    fill(this.colorHue, 80, 25, 75);

    beginShape();
    for (let i = 0; i < this.totalVertices; i++) {
      let angle = map(i, 0, this.totalVertices, 0, TWO_PI);
      let rVertex = this.r + this.offsets[i];
      let x = rVertex * cos(angle);
      let y = rVertex * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);

    noStroke();
    fill(this.colorHue, 100, 90);
    textAlign(CENTER, CENTER);

    for(let bit of this.dataBits) {
        textSize(bit.size);
        text(bit.char, bit.x, bit.y);
    }
    pop();
  }

  edges() {
    if (this.pos.x > width + this.r) this.pos.x = -this.r;
    else if (this.pos.x < -this.r) this.pos.x = width + this.r;
    if (this.pos.y > height + this.r) this.pos.y = -this.r;
    else if (this.pos.y < -this.r) this.pos.y = height + this.r;
  }

  breakup() {
    let newAsteroids = [];
    newAsteroids.push(new Asteroid(this.pos, this.r * 0.65));
    newAsteroids.push(new Asteroid(this.pos, this.r * 0.65));
    return newAsteroids;
  }
}

// --- MATRIX RAIN CLASSES ---
class MatrixSymbol {
  constructor(x, y, speed, first, opacity) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.first = first;
    this.opacity = opacity;
    this.value;
    this.switchInterval = round(random(8, 30));
    this.setToRandomSymbol();
  }

  setToRandomSymbol() {
    const charSet = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    this.value = charSet.charAt(floor(random(charSet.length)));
  }

  rain() {
    this.y = (this.y >= height + SYMBOL_SIZE) ? -SYMBOL_SIZE : this.y + this.speed;
    if (frameCount % this.switchInterval === 0) {
      this.setToRandomSymbol();
    }
  }

  render() {
    if (this.first) {
      fill(130, 100, 98, this.opacity);
    } else {
      fill(120, 85, 75, this.opacity);
    }
    noStroke();
    textSize(SYMBOL_SIZE);
    textAlign(CENTER, CENTER);
    text(this.value, this.x, this.y);
    this.rain();
  }
}

class MatrixStream {
  constructor(x) {
    this.x = x;
    this.symbols = [];
    this.totalSymbols = round(random(MIN_STREAM_LENGTH, MAX_STREAM_LENGTH));
    this.speed = random(2, 7);
    this.baseOpacity = random(40, 90);
  }

  generateSymbols() {
    let y = random(-height * 0.5, 0);
    let opacityStep = this.baseOpacity / this.totalSymbols;

    for (let i = 0; i < this.totalSymbols; i++) {
      let symbol = new MatrixSymbol(
        this.x,
        y,
        this.speed,
        i === 0,
        max(10, this.baseOpacity - (i * opacityStep))
      );
      this.symbols.push(symbol);
      y -= SYMBOL_SIZE * random(0.9, 1.1);
    }
  }

  render() {
    this.symbols.forEach(symbol => {
      symbol.render();
    });
  }
}

// --- POWERUP CLASS ---
class Powerup {
  constructor() {
    this.pos = createVector(random(width * 0.2, width * 0.8), random(height * 0.2, height * 0.8));
    this.r = 30;
    this.angle = 0;
    this.floatOffset = 0;
  }

  update() {
    this.angle += 0.02;
    this.floatOffset = sin(frameCount * 0.05) * 10;
  }

  render() {
    push();
    translate(this.pos.x, this.pos.y + this.floatOffset);
    rotate(this.angle);

    // Draw Gemini-style concave diamond
    noFill();
    strokeWeight(3);

    // Animated gradient effect
    let hue = (frameCount * 2) % 360;
    stroke(hue, 100, 100);

    // Concave diamond shape using quadratic curves
    let s = this.r; // Half size for easier calculations
    let valleyDepthFactor = 0.8; // How concave the shape is (0 = diamond, 1 = very pinched)

    // Outer Tips
    let tipTop = { x: 0, y: -s };
    let tipRight = { x: s, y: 0 };
    let tipBottom = { x: 0, y: s };
    let tipLeft = { x: -s, y: 0 };

    // Control Points for concave curves
    let controlDist = s * (1 - valleyDepthFactor);

    let cpTopRight = { x: controlDist, y: -controlDist };
    let cpBottomRight = { x: controlDist, y: controlDist };
    let cpBottomLeft = { x: -controlDist, y: controlDist };
    let cpTopLeft = { x: -controlDist, y: -controlDist };

    beginShape();
    vertex(tipTop.x, tipTop.y);
    quadraticVertex(cpTopRight.x, cpTopRight.y, tipRight.x, tipRight.y);
    quadraticVertex(cpBottomRight.x, cpBottomRight.y, tipBottom.x, tipBottom.y);
    quadraticVertex(cpBottomLeft.x, cpBottomLeft.y, tipLeft.x, tipLeft.y);
    quadraticVertex(cpTopLeft.x, cpTopLeft.y, tipTop.x, tipTop.y);
    endShape();

    // Inner diamond with same shape
    scale(0.6);
    beginShape();
    vertex(tipTop.x, tipTop.y);
    quadraticVertex(cpTopRight.x, cpTopRight.y, tipRight.x, tipRight.y);
    quadraticVertex(cpBottomRight.x, cpBottomRight.y, tipBottom.x, tipBottom.y);
    quadraticVertex(cpBottomLeft.x, cpBottomLeft.y, tipLeft.x, tipLeft.y);
    quadraticVertex(cpTopLeft.x, cpTopLeft.y, tipTop.x, tipTop.y);
    endShape();

    pop();
  }
}

// --- DATABASE OPTIMIZER CLASS ---
class DatabaseOptimizer extends Bullet {
  constructor(startPos, angle) {
    super(startPos, angle);
    this.expansionRate = 0;
    this.maxRadius = max(width, height) * 1.5; // Ensure it covers entire screen
    this.expanding = false;
    this.expandTimer = 0;
    this.rotation = 0;
    this.destroyedAsteroids = new Set(); // Track destroyed asteroids to avoid double-counting
  }

  update() {
    if (!this.expanding) {
      this.pos.add(this.vel);
      this.life--;

      // Start expanding after traveling a bit
      if (this.life < 70) {
        this.expanding = true;
        this.life = 400; // Longer life to ensure full expansion

        // Remove all other bullets to prevent interference
        for (let i = bullets.length - 1; i >= 0; i--) {
          if (bullets[i] !== this) {
            bullets.splice(i, 1);
          }
        }
      }
    } else {
      // Faster expansion to ensure full screen coverage
      this.expansionRate += 12;
      this.r = this.expansionRate;
      this.rotation += 0.05;
      this.life--;

      // Destroy asteroids within range for visual effect
      for (let i = asteroids.length - 1; i >= 0; i--) {
        let d = dist(this.pos.x, this.pos.y, asteroids[i].pos.x, asteroids[i].pos.y);
        // Use asteroid's full radius for complete destruction
        if (d < this.r + asteroids[i].r && !this.destroyedAsteroids.has(asteroids[i])) {
          this.destroyedAsteroids.add(asteroids[i]);

          // Create destruction particles
          for (let j = 0; j < 10; j++) {
            let particleX = asteroids[i].pos.x + random(-20, 20);
            let particleY = asteroids[i].pos.y + random(-20, 20);
            fireworks.push(new Firework(particleX, particleY));
          }

          // Create SQL particles flying away
          for (let j = 0; j < 3; j++) {
            sqlParticles.push(new SQLParticle(asteroids[i].pos.x, asteroids[i].pos.y));
          }

          asteroids.splice(i, 1);
        }
      }
    }
  }

  render() {
    push();
    translate(this.pos.x, this.pos.y);

    if (!this.expanding) {
      // Draw as wireframe database cylinder
      rotate(this.heading);
      noFill();
      stroke(180, 100, 100);
      strokeWeight(2);

      // Cylinder parameters
      let w = 80; // Width (diameter)
      let h = 40; // Height

      // Top ellipse
      ellipse(0, -h/2, w, w/3);

      // Bottom ellipse
      ellipse(0, h/2, w, w/3);

      // Side lines
      line(-w/2, -h/2, -w/2, h/2);
      line(w/2, -h/2, w/2, h/2);

      // Data bands
      strokeWeight(1);
      for (let i = -1; i <= 1; i++) {
        ellipse(0, i * h/3, w * 0.8, w/4);
      }
    } else {
      // Expanding database cleaner effect
      rotate(this.rotation);

      // Multiple expanding cylinders for visual effect
      for (let i = 0; i < 3; i++) {
        let radius = this.r - i * 50;
        if (radius > 0) {
          let alpha = map(radius, 0, this.maxRadius, 100, 0) * (1 - i * 0.3);

          noFill();
          stroke(180 - i * 20, 100, 100, alpha);
          strokeWeight(3 - i);

          // Draw expanding cylinder shape with proportional height
          // Maintain the original aspect ratio (width:height = 60:40 = 1.5:1)
          let w = radius * 2;
          let h = w * (40/60); // Keep original aspect ratio
          let ellipseHeight = w / 3; // Vertical scale of ellipses

          // Top ellipse
          ellipse(0, -h/2, w, ellipseHeight);

          // Bottom ellipse
          ellipse(0, h/2, w, ellipseHeight);

          // Side lines at multiple angles for wireframe effect
          for (let angle = 0; angle < TWO_PI; angle += PI/4) {
            let x = cos(angle) * radius;
            line(x, -h/2, x, h/2);
          }

          // Data rings
          strokeWeight(1);
          stroke(200, 100, 100, alpha * 0.5);
          for (let j = -1; j <= 1; j++) {
            ellipse(0, j * h/3, w * 0.9, ellipseHeight * 0.8);
          }
        }
      }

      // Central glow effect
      if (this.r < 100) {
        let glowAlpha = map(this.r, 0, 100, 100, 0);
        fill(180, 100, 100, glowAlpha * 0.3);
        noStroke();
        circle(0, 0, this.r);
      }
    }
    pop();
  }

  isOffscreen() {
    // Only consider it offscreen when it has reached max radius
    // Life doesn't matter for victory condition
    return this.r >= this.maxRadius;
  }
}

// --- FIREWORK CLASS ---
class Firework {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(5, 15));
    this.acc = createVector(0, 0.2);
    this.life = 100;
    this.hue = random(360);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.life -= 2;
  }

  render() {
    push();
    let alpha = map(this.life, 0, 100, 0, 100);
    stroke(this.hue, 100, 100, alpha);
    strokeWeight(4);
    point(this.pos.x, this.pos.y);
    pop();
  }

  isDead() {
    return this.life <= 0;
  }
}

// --- SQL PARTICLE CLASS ---
class SQLParticle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(2, 6));
    this.acc = createVector(0, -0.1); // Slight upward drift
    this.life = 60;
    this.text = 'SQL';
    this.startSize = random(16, 24);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.life -= 1.5;
  }

  render() {
    push();
    translate(this.pos.x, this.pos.y);

    let alpha = map(this.life, 0, 60, 0, 100);
    // Size grows as particle flies away (life decreases)
    let sizeMult = map(this.life, 60, 0, 1, 2.5);
    fill(180, 100, 100, alpha);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(this.startSize * sizeMult);
    text(this.text, 0, 0);
    pop();
  }

  isDead() {
    return this.life <= 0;
  }
}

// --- VICTORY DISPLAY ---
function displayVictory() {
  // Matrix rain continues
  for (let stream of matrixStreams) {
    stream.render();
  }

  // Create fireworks
  if (frameCount % 10 === 0) {
    let x = random(width);
    let y = random(height * 0.2, height * 0.5);
    for (let i = 0; i < 50; i++) {
      fireworks.push(new Firework(x, y));
    }
  }

  // Update and render fireworks
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].render();
    if (fireworks[i].isDead()) {
      fireworks.splice(i, 1);
    }
  }

  // Victory text
  fill(120, 100, 100);
  textSize(72);
  textAlign(CENTER, CENTER);
  text("YOU WIN!", width / 2, height / 2 - 100);

  textSize(36);
  fill(180, 80, 90);
  text("Data Matrix Cleaned!", width / 2, height / 2 - 20);

  textSize(24);
  fill(120, 70, 80);
  text(`Final Score: ${score}`, width / 2, height / 2 + 40);
  text(`Hero: ${heroNames[selectedHero]}`, width / 2, height / 2 + 80);

  textSize(20);
  fill(120, 60, 70);
  text("Press R to play again", width / 2, height / 2 + 140);
}
