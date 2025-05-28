let player;
let bullets = [];
let asteroids = [];
let matrixStreams = [];
let selectedHero = 0; // Selected hero index
let gameState = 'intro'; // 'intro', 'playing', 'gameOver'
let heroImages = []; // Store loaded hero images
let heroNames = []; // Store hero names from filenames

// --- MATRIX RAIN SETTINGS ---
const SYMBOL_SIZE = 16;
const MIN_STREAM_LENGTH = 10;
const MAX_STREAM_LENGTH = 30;

// --- GAME SETTINGS ---
const PLAYER_SIZE = 100;
const ASTEROID_INIT_NUM = 4; // Initial number of asteroids
const ASTEROID_INIT_SIZE = 70; // Radius of largest asteroids
const ASTEROID_MIN_SIZE = 20;  // Smallest radius before destruction
const ASTEROID_SPEED_MAX = 1.2;
const BULLET_SPEED = 8;
const PLAYER_TURN_RATE = 0.08;
const PLAYER_THRUST = 0.15;
const PLAYER_FRICTION = 0.99; // Closer to 1 means less friction
const PLAYER_MAX_SPEED = 6;
const PLAYER_INVINCIBILITY_DURATION = 120; // Frames (2 seconds at 60fps)

let score = 0;
let lives = 3;
let gameOver = false;

// --- PRELOAD ---
function preload() {
  // Define the hero image files (you can add more here)
  // In a real dynamic system, you'd get this list from a server
  const heroFiles = ['Dave.png', 'Nadya.png']; // Add more hero PNG files here

  // Load all hero images dynamically
  for (let i = 0; i < heroFiles.length; i++) {
    heroImages[i] = loadImage('images/' + heroFiles[i]);
    // Extract name from filename (remove .png extension)
    heroNames[i] = heroFiles[i].replace('.png', '');
  }
}

// --- SETUP ---
function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100); // Hue, Saturation, Brightness, Alpha
  angleMode(RADIANS); // Use radians for all angle calculations

  // Initialize Matrix Rain
  let x = 0;
  for (let i = 0; x < width + SYMBOL_SIZE; i++) {
    let stream = new MatrixStream(x);
    stream.generateSymbols();
    matrixStreams.push(stream);
    x += SYMBOL_SIZE * 0.9; // Spacing of streams
  }

  player = new Player();
  spawnAsteroids(ASTEROID_INIT_NUM, ASTEROID_INIT_SIZE);
}

// --- DRAW LOOP ---
function draw() {
  background(220, 10, 10, 35); // Dark blue-black background with some trail effect

  for (let stream of matrixStreams) {
    stream.render();
  }

  if (gameState === 'intro') {
    displayIntro();
    return;
  }

  if (gameOver || gameState === 'gameOver') {
    displayGameOver();
    return;
  }

  player.handleInput();
  player.update();
  player.edges();
  player.render();

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
      bullets.splice(i, 1);
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

  for (let i = bullets.length - 1; i >= 0; i--) {
    for (let j = asteroids.length - 1; j >= 0; j--) {
      if (bullets[i] && asteroids[j] && bullets[i].hits(asteroids[j])) {
        score += floor(map(asteroids[j].r, ASTEROID_MIN_SIZE, ASTEROID_INIT_SIZE, 50, 10));
        if (asteroids[j].r > ASTEROID_MIN_SIZE * 1.6) {
          let newAsteroids = asteroids[j].breakup();
          asteroids.push(...newAsteroids);
        }
        asteroids.splice(j, 1);
        bullets.splice(i, 1);
        break;
      }
    }
  }

  if (asteroids.length === 0 && !gameOver) {
    let numToSpawn = ASTEROID_INIT_NUM + floor(score / 300);
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

function displayIntro() {
    // Title
    fill(120, 100, 100);
    textSize(96);
    textAlign(CENTER, CENTER);
    text("DATA HEROES", width / 2, height / 2 - 250);

    textSize(24);
    fill(120, 80, 90);
    text("Fighting Bad Data in the Matrix", width / 2, height / 2 - 150);
    text("Surfacing insights from chaos", width / 2, height / 2 - 125);

    // Story text
    textSize(18);
    fill(120, 60, 80);
    text("The data matrix has been corrupted with bad data!", width / 2, height / 2 - 80);
    text("Only our data heroes can clean up this mess...", width / 2, height / 2 - 50);

    // Hero selection
    textSize(24);
    fill(120, 90, 100);
    text("Choose Your Data Hero:", width / 2, height / 2 );

    // Calculate spacing for heroes
    let heroCount = heroImages.length;
    let spacing = min(300, width / (heroCount + 1));
    let startX = width / 2 - (spacing * (heroCount - 1) / 2);

    // Draw all hero options
    for (let i = 0; i < heroCount; i++) {
        push();
        imageMode(CENTER);
        let heroX = startX + spacing * i;
        let heroScale = 1;
        image(heroImages[i], heroX, height / 2 + 100,
              heroImages[i].width * heroScale, heroImages[i].height * heroScale);

        // Hero name and key prompt
        textSize(20);
        fill(120, 80, 90);
        text(heroNames[i], heroX, height / 2 + 200);
        text(`Press [${i + 1}]`, heroX, height / 2 + 220);
        pop();
    }

    // Instructions
    textSize(16);
    fill(120, 60, 70);
    text("Arrow keys to move • Space to shoot • Clean the bad data!", width / 2, height / 2 + 250);
}

function keyPressed() {
  if (gameState === 'intro') {
    // Handle dynamic number of heroes (1-9 keys)
    let heroIndex = parseInt(key) - 1;
    if (!isNaN(heroIndex) && heroIndex >= 0 && heroIndex < heroImages.length) {
      selectedHero = heroIndex;
      gameState = 'playing';
      resetGame();
    }
    return;
  }

  if (gameOver && (key === 'r' || key === 'R')) {
      resetGame();
      gameState = 'playing';
      return;
  }
  if (key === ' ') {
    player.shoot();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
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
    this.r = PLAYER_SIZE / 2; // Radius for collision and size calculation
    this.heading = -PI / 2; // Start pointing upwards (0 is right, -PI/2 is up)
    this.vel = createVector(0, 0);
    this.isInvincible = false;
    this.invincibilityTimer = 0;
    this.boosterColorHue = 0; // For flame color cycling
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

        // Draw booster effect when moving
        if (keyIsDown(UP_ARROW) && this.vel.magSq() > 0.01) {
            // Data stream effect behind hero
            push();
            rotate(this.heading);
            let streamOffset = -this.r * 1.5;

            noStroke();
            for (let i = 0; i < 5; i++) {
                let alpha = map(i, 0, 5, 80, 20);
                fill(120, 100, 100, alpha);
                textSize(random(8, 12));
                textAlign(CENTER, CENTER);
                let dataChar = random(['0', '1', '>', '<', '/', '*']);
                text(dataChar, streamOffset - i * 8, random(-10, 10));
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
        let noseOffsetLength = this.r * 1.3; // Distance from center to nose tip
        let bulletStartPos = createVector(
            this.pos.x + noseOffsetLength * cos(this.heading),
            this.pos.y + noseOffsetLength * sin(this.heading)
        );
        bullets.push(new Bullet(bulletStartPos, this.heading));
    }
  }

  hits(asteroid) {
    let d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
    return (d < this.r + asteroid.r * 0.75);
  }
}

// --- BULLET CLASS ---
class Bullet {
  constructor(startPos, angle) {
    this.pos = startPos.copy(); // Use the provided start position (ship's nose)
    this.vel = p5.Vector.fromAngle(angle);
    this.vel.mult(BULLET_SPEED);
    this.r = 3;
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
    let cleanData = random(['SELECT', 'DELETE', 'WHERE', 'UPDATE', 'FIX', 'CLEAN']);
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
    let numBits = floor(map(this.r, ASTEROID_MIN_SIZE, ASTEROID_INIT_SIZE, 1, 6));
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
