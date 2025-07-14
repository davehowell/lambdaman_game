


// --- Constants and Global Game Variables ---
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const MATRIX_FONT = 'monospace';

// Colors (HSB for easier manipulation of brightness/saturation if needed, but using RGB for typical Matrix green)
const COLOR_MATRIX_GREEN_BRIGHT = [0, 255, 70]; // For text, highlights
const COLOR_MATRIX_GREEN_MEDIUM = [0, 200, 50]; // For elements
const COLOR_MATRIX_GREEN_DARK = [0, 100, 30];   // For rain, dimmer elements
const COLOR_BACKGROUND = [0, 10, 2];        // Very dark green/black

const RAIN_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝ";
const CODE_FRAGMENTS = ["SELECT", "FROM", "WHERE", "JOIN", "lambda", "def class()", "UPDATE", "INSERT", "DROP TABLE", "ALTER", "import np", "tf.predict()", "async await", "Promise.all"];

let rainParticles = [];
const NUM_RAIN_PARTICLES = 200;

let bases = [];
const NUM_BASES = 3;
const BASE_WIDTH = 60;
const BASE_HEIGHT = 20;
const BASE_Y_OFFSET = 50;

let enemies = [];
let missiles = [];
let explosions = [];

let score = 0;
let wave = 1;
const BOSS_WAVE_NUMBER = 5; // Boss appears on this wave
let isBossActive = false;
let bossDefeatedThisGame = false;

let gameState = "PLAYING"; // "PLAYING", "GAME_OVER", "WAVE_CLEARED"
let gameStartTime;

const ENEMY_DEFINITIONS = [
  { name: "PostgreSQL", speed: 0.8, points: 10, color: [60, 180, 255], size: 25 }, // Blueish
  { name: "AlloyDB", speed: 1, points: 15, color: [100, 150, 250], size: 28 },    // Lighter Blue
  { name: "Firestore", speed: 1.2, points: 20, color: [255, 200, 80], size: 22 }, // Orange/Yellow
  { name: "BigQuery", speed: 0.6, points: 25, color: [230, 80, 80], size: 35 }    // Reddish
];
const BOSS_DEFINITION = { name: "MongoDB", speed: 0.4, points: 200, color: [80, 220, 100], size: 60, health: 8 };

let enemySpawnTimer = 0;
let enemySpawnInterval = 2000; // Milliseconds
let enemiesThisWave = 5;
let enemiesSpawnedThisWave = 0;

const MISSILE_SPEED = 8;
const EXPLOSION_RADIUS_START = 10;
const EXPLOSION_RADIUS_MAX = 60;
const EXPLOSION_DURATION = 30; // frames

// --- Classes ---

class RainParticle {
  constructor() {
    this.x = random(width);
    this.y = random(-height, 0);
    this.z = random(0.1, 1); // Depth factor
    this.char = random(RAIN_CHARS);
    this.speed = map(this.z, 0.1, 1, 1, 5);
    this.charSize = map(this.z, 0.1, 1, 8, 15);
    this.opacity = map(this.z, 0.1, 1, 50, 150);
  }

  update() {
    this.y += this.speed;
    if (this.y > height) {
      this.y = random(-100, 0);
      this.x = random(width);
      this.char = random(RAIN_CHARS);
    }
  }

  draw() {
    fill(COLOR_MATRIX_GREEN_DARK[0], COLOR_MATRIX_GREEN_DARK[1], COLOR_MATRIX_GREEN_DARK[2], this.opacity);
    textFont(MATRIX_FONT, this.charSize);
    text(this.char, this.x, this.y);
  }
}

class Base {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = BASE_WIDTH;
    this.height = BASE_HEIGHT;
    this.isDestroyed = false;
  }

  draw() {
    if (!this.isDestroyed) {
      fill(COLOR_MATRIX_GREEN_MEDIUM);
      noStroke();
      rectMode(CENTER);
      rect(this.x, this.y, this.width, this.height, 5);
      fill(COLOR_MATRIX_GREEN_BRIGHT);
      textSize(10);
      textAlign(CENTER, CENTER);
      text("NODE", this.x, this.y);
    }
  }

  checkCollision(enemy) {
    if (this.isDestroyed) return false;
    // Simple AABB collision for base vs enemy (enemy treated as point for base impact)
    return (
      enemy.y + enemy.size / 2 > this.y - this.height / 2 &&
      enemy.y - enemy.size / 2 < this.y + this.height / 2 &&
      enemy.x > this.x - this.width / 2 &&
      enemy.x < this.x + this.width / 2
    );
  }
}

class Enemy {
  constructor(x, y, definition) {
    this.x = x;
    this.y = y;
    this.definition = definition;
    this.name = definition.name;
    this.speed = definition.speed * (1 + (wave - 1) * 0.1); // Speed increases with wave
    this.points = definition.points;
    this.color = definition.color;
    this.size = definition.size;
    this.health = definition.health || 1; // Default health is 1
    this.isBoss = (this.name === BOSS_DEFINITION.name);
  }

  update() {
    this.y += this.speed;
  }

  draw() {
    fill(this.color);
    noStroke();
    ellipseMode(CENTER);
    // ellipse(this.x, this.y, this.size, this.size); // Simple circle

    // More "digital" look
    rectMode(CENTER);
    let segments = this.isBoss ? 8 : 5;
    for (let i = 0; i < segments; i++) {
        let angle = TWO_PI / segments * i;
        let d = this.size * 0.4;
        rect(this.x + cos(angle) * d*0.5, this.y + sin(angle) * d*0.5, this.size*0.3, this.size*0.3);
    }
    fill(this.color[0], this.color[1], this.color[2], 150);
    ellipse(this.x, this.y, this.size*0.8, this.size*0.8);


    fill(COLOR_MATRIX_GREEN_BRIGHT);
    textSize(this.isBoss ? 14 : 10);
    textAlign(CENTER, CENTER);
    text(this.name, this.x, this.y - this.size / 2 - (this.isBoss ? 12 : 8));
    if (this.isBoss && this.health > 1) {
        textSize(10);
        text(`HP: ${this.health}`, this.x, this.y + this.size / 2 + 8);
    }
  }

  isOffScreen() {
    return this.y - this.size / 2 > height;
  }

  takeDamage() {
    this.health--;
    return this.health <= 0;
  }
}

class Missile {
  constructor(targetX, targetY) {
    this.x = width / 2;
    this.y = height - BASE_Y_OFFSET - BASE_HEIGHT / 2 - 10; // Fire from above central base
    this.targetX = targetX;
    this.targetY = targetY;
    let angle = atan2(targetY - this.y, targetX - this.x);
    this.vx = cos(angle) * MISSILE_SPEED;
    this.vy = sin(angle) * MISSILE_SPEED;
    this.trail = [];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.trail.push({x: this.x, y: this.y});
    if (this.trail.length > 10) {
        this.trail.shift();
    }
  }

  draw() {
    stroke(COLOR_MATRIX_GREEN_BRIGHT);
    strokeWeight(3);
    line(this.x, this.y, this.x - this.vx * 2, this.y - this.vy * 2); // Short line for head

    // Draw trail
    for(let i = 0; i < this.trail.length; i++) {
        let pos = this.trail[i];
        let alpha = map(i, 0, this.trail.length, 50, 150);
        stroke(COLOR_MATRIX_GREEN_BRIGHT[0], COLOR_MATRIX_GREEN_BRIGHT[1], COLOR_MATRIX_GREEN_BRIGHT[2], alpha);
        strokeWeight(map(i,0, this.trail.length, 1, 3));
        point(pos.x, pos.y);
    }
  }

  hasReachedTarget() {
    // Check if missile has passed or reached its target
    return dist(this.x, this.y, this.targetX, this.targetY) < MISSILE_SPEED;
  }
}

class Explosion {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.currentRadius = EXPLOSION_RADIUS_START;
    this.maxRadius = EXPLOSION_RADIUS_MAX;
    this.duration = EXPLOSION_DURATION;
    this.age = 0;
    this.codeFragment = random(CODE_FRAGMENTS);
    this.hitEnemies = new Set(); // To ensure an enemy is hit only once per explosion
  }

  update() {
    this.age++;
    this.currentRadius = lerp(EXPLOSION_RADIUS_START, this.maxRadius, this.age / this.duration);
  }

  draw() {
    let alpha = map(this.age, 0, this.duration, 255, 0);
    noFill();
    stroke(COLOR_MATRIX_GREEN_BRIGHT[0], COLOR_MATRIX_GREEN_BRIGHT[1], COLOR_MATRIX_GREEN_BRIGHT[2], alpha);
    strokeWeight(map(this.age, 0, this.duration, 5, 1));
    ellipse(this.x, this.y, this.currentRadius * 2, this.currentRadius * 2);

    // Digital glitch effect
    for (let i = 0; i < 5; i++) {
        let rOff = random(-5, 5) * (this.age / this.duration);
        let aOff = random(TWO_PI);
        stroke(COLOR_MATRIX_GREEN_MEDIUM[0], COLOR_MATRIX_GREEN_MEDIUM[1], COLOR_MATRIX_GREEN_MEDIUM[2], alpha * 0.5);
        ellipse(this.x + cos(aOff)*rOff, this.y + sin(aOff)*rOff, this.currentRadius * 2 * random(0.9,1.1), this.currentRadius * 2 * random(0.9,1.1));
    }


    fill(COLOR_MATRIX_GREEN_BRIGHT[0], COLOR_MATRIX_GREEN_BRIGHT[1], COLOR_MATRIX_GREEN_BRIGHT[2], alpha);
    noStroke();
    textSize(14);
    textAlign(CENTER, CENTER);
    if (this.age < this.duration * 0.7) { // Show fragment for part of explosion
         text(this.codeFragment, this.x, this.y);
    }
  }

  isFinished() {
    return this.age >= this.duration;
  }

  checkCollision(enemy) {
    if (this.hitEnemies.has(enemy)) return false;

    let d = dist(this.x, this.y, enemy.x, enemy.y);
    if (d < this.currentRadius + enemy.size / 2) {
        this.hitEnemies.add(enemy);
        return true;
    }
    return false;
  }
}

// --- p5.js Setup and Draw ---
function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  textFont(MATRIX_FONT);
  gameStartTime = millis();
  initializeGame();
}

function draw() {
  background(COLOR_BACKGROUND);
  drawRain();

  if (gameState === "PLAYING") {
    updateGame();
    drawGameElements();
    drawUI();
  } else if (gameState === "GAME_OVER") {
    drawGameElements(); // Draw lingering elements
    drawUI();
    drawGameOverScreen();
  } else if (gameState === "WAVE_CLEARED") {
    drawGameElements();
    drawUI();
    drawWaveClearedScreen();
  }
}

// --- Game Initialization and Reset ---
function initializeGame() {
  rainParticles = [];
  for (let i = 0; i < NUM_RAIN_PARTICLES; i++) {
    rainParticles.push(new RainParticle());
  }

  bases = [];
  const baseSpacing = width / (NUM_BASES + 1);
  for (let i = 0; i < NUM_BASES; i++) {
    bases.push(new Base(baseSpacing * (i + 1), height - BASE_Y_OFFSET));
  }

  enemies = [];
  missiles = [];
  explosions = [];
  score = 0;
  wave = 1;
  isBossActive = false;
  bossDefeatedThisGame = false;
  resetWaveParameters();
  gameState = "PLAYING";
}

function resetWaveParameters() {
    enemiesSpawnedThisWave = 0;
    enemiesThisWave = 5 + (wave - 1) * 2; // More enemies each wave
    if (wave === BOSS_WAVE_NUMBER && !bossDefeatedThisGame) {
        enemiesThisWave = 0; // No regular enemies initially when boss spawns
        isBossActive = true;
    } else if (isBossActive && bossDefeatedThisGame) { // Post-boss waves
        enemiesThisWave = 7 + (wave - BOSS_WAVE_NUMBER);
    }
    enemySpawnInterval = max(500, 2000 - (wave - 1) * 100);
    enemySpawnTimer = millis() + enemySpawnInterval; // Delay first spawn of wave
}


// --- Drawing Functions ---
function drawRain() {
  for (let p of rainParticles) {
    p.update();
    p.draw();
  }
}

function drawGameElements() {
  for (let base of bases) {
    base.draw();
  }
  for (let missile of missiles) {
    missile.draw();
  }
  for (let enemy of enemies) {
    enemy.draw();
  }
  for (let explosion of explosions) {
    explosion.draw();
  }
  // Crosshair
  stroke(COLOR_MATRIX_GREEN_BRIGHT);
  strokeWeight(1);
  noFill();
  ellipse(mouseX, mouseY, 20, 20);
  line(mouseX - 15, mouseY, mouseX + 15, mouseY);
  line(mouseX, mouseY - 15, mouseX, mouseY + 15);
}

function drawUI() {
  fill(COLOR_MATRIX_GREEN_BRIGHT);
  noStroke();
  textSize(18);
  textAlign(LEFT, TOP);
  text(`Score: ${score}`, 10, 10);
  text(`Wave: ${wave}`, width - 100, 10);
  if (isBossActive && enemies.length > 0 && enemies[0].isBoss) {
      textAlign(CENTER, TOP);
      text(`${enemies[0].name} Approaching! HP: ${enemies[0].health}`, width/2, 10);
  }
}

function drawGameOverScreen() {
  fill(0, 0, 0, 150); // Semi-transparent overlay
  rectMode(CORNER);
  rect(0, 0, width, height);

  fill(COLOR_MATRIX_GREEN_BRIGHT);
  textSize(48);
  textAlign(CENTER, CENTER);
  text("SYSTEM FAILURE", width / 2, height / 2 - 40);
  textSize(24);
  text(`Final Score: ${score}`, width / 2, height / 2 + 10);
  text("Click to Recompile (Restart)", width / 2, height / 2 + 50);
}

function drawWaveClearedScreen() {
  fill(0,0,0,100);
  rectMode(CORNER);
  rect(0,0,width,height);

  fill(COLOR_MATRIX_GREEN_BRIGHT);
  textSize(32);
  textAlign(CENTER, CENTER);
  if (isBossActive && !bossDefeatedThisGame) { // This screen shouldn't show if boss just spawned
       // This state might be skipped if boss spawns right after wave clear
  } else if (bossDefeatedThisGame && wave === BOSS_WAVE_NUMBER) {
       text("TARGET ELIMINATED: MongoDB", width / 2, height / 2 - 20);
       text("Proceeding to next sequence...", width/2, height/2 + 20);
  }
  else {
      text(`Wave ${wave -1} Cleared!`, width / 2, height / 2 - 20);
      text("Prepare for next wave...", width / 2, height / 2 + 20);
  }
}

// --- Game Logic Update ---
function updateGame() {
  handleEnemySpawning();
  updateEntities();
  checkCollisionsAndStatus();
}

function handleEnemySpawning() {
    if (isBossActive && enemiesSpawnedThisWave === 0 && !bossDefeatedThisGame) { // Spawn boss if it's time
        if (enemies.length === 0) { // Ensure no other enemies before boss
            enemies.push(new Enemy(random(BOSS_DEFINITION.size, width - BOSS_DEFINITION.size), -BOSS_DEFINITION.size, BOSS_DEFINITION));
            enemiesSpawnedThisWave = 1; // Mark boss as spawned for this "wave"
        }
    } else if (!isBossActive || bossDefeatedThisGame) { // Regular enemy spawning
        if (millis() > enemySpawnTimer && enemiesSpawnedThisWave < enemiesThisWave) {
            let definition = random(ENEMY_DEFINITIONS);
            enemies.push(new Enemy(random(definition.size, width - definition.size), -definition.size, definition));
            enemiesSpawnedThisWave++;
            enemySpawnTimer = millis() + enemySpawnInterval / (1 + score * 0.0001); // Spawn faster with score
        }
    }

    // Check for wave completion
    if (enemiesSpawnedThisWave >= enemiesThisWave && enemies.length === 0 && explosions.length === 0) {
        if (isBossActive && !bossDefeatedThisGame) {
            // This case should ideally not happen if boss is still alive.
            // If boss defeated, bossDefeatedThisGame will be true.
        } else {
             if (gameState === "PLAYING") { // Avoid multiple transitions
                gameState = "WAVE_CLEARED";
                wave++;
                if(isBossActive && bossDefeatedThisGame) isBossActive = false; // Can reset boss state if continuing
                setTimeout(() => {
                    resetWaveParameters();
                    gameState = "PLAYING";
                }, 3000); // 3 second pause
            }
        }
    }
}


function updateEntities() {
  // Update missiles
  for (let i = missiles.length - 1; i >= 0; i--) {
    missiles[i].update();
    if (missiles[i].hasReachedTarget()) {
      explosions.push(new Explosion(missiles[i].targetX, missiles[i].targetY));
      missiles.splice(i, 1);
    }
  }

  // Update enemies
  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].update();
    if (enemies[i].isOffScreen()) {
      // Enemy reached bottom without hitting a base (missed player)
      // This doesn't directly destroy a base unless it path.overlaps, but could be a penalty
      enemies.splice(i, 1);
    }
  }

  // Update explosions
  for (let i = explosions.length - 1; i >= 0; i--) {
    explosions[i].update();
    if (explosions[i].isFinished()) {
      explosions.splice(i, 1);
    }
  }
}

function checkCollisionsAndStatus() {
  // Explosions vs Enemies
  for (let explosion of explosions) {
    for (let i = enemies.length - 1; i >= 0; i--) {
      if (explosion.checkCollision(enemies[i])) {
        if (enemies[i].takeDamage()) { // If enemy is destroyed
          score += enemies[i].points;
          if (enemies[i].isBoss) {
            isBossActive = false; // Boss defeated
            bossDefeatedThisGame = true;
            // Potentially trigger a special "boss defeated" wave clear
             if (gameState === "PLAYING") {
                gameState = "WAVE_CLEARED"; // Show special message for boss
                wave++; // Technically wave after boss is cleared
                setTimeout(() => {
                    resetWaveParameters();
                    gameState = "PLAYING";
                }, 4000); // Longer pause after boss
            }
          }
          enemies.splice(i, 1);
        }
      }
    }
  }

  // Enemies vs Bases
  for (let enemy of enemies) {
    for (let base of bases) {
      if (base.checkCollision(enemy)) {
        base.isDestroyed = true;
        // Remove enemy that hit the base
        enemies.splice(enemies.indexOf(enemy), 1);
        break; // Enemy can only destroy one base
      }
    }
  }

  // Check Game Over (all bases destroyed)
  let activeBases = 0;
  for (let base of bases) {
    if (!base.isDestroyed) {
      activeBases++;
    }
  }
  if (activeBases === 0 && gameState === "PLAYING") {
    gameState = "GAME_OVER";
  }
}

// --- Event Handlers ---
function mousePressed() {
  if (gameState === "PLAYING") {
    if (mouseY < height - BASE_Y_OFFSET - BASE_HEIGHT) { // Don't fire if clicking on UI/bases area
        missiles.push(new Missile(mouseX, mouseY));
    }
  } else if (gameState === "GAME_OVER") {
    initializeGame(); // Restart
  }
}

// Optional: Resize canvas if window is resized (not strictly needed for fixed size)
function windowResized() {
  // If you want a responsive canvas, resize here.
  // For this Missile Command, fixed size is often better.
  // resizeCanvas(windowWidth, windowHeight);
  // Re-initialize rain if canvas size changes drastically
  // if (rainParticles.length > 0 && (width !== CANVAS_WIDTH || height !== CANVAS_HEIGHT)) {
  //   rainParticles = [];
  //   for (let i = 0; i < NUM_RAIN_PARTICLES; i++) rainParticles.push(new RainParticle());
  // }
}
