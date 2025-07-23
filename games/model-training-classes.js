// Model Training Game Classes - Space Invaders Style
// NeonAlien, ComplexModelBoss, HyperparameterPowerup, HyperparameterOptimizer, TrainingParticle, Firework, MatrixSymbol, MatrixStream

// Matrix rain constants (must be global for classes to access)
const SYMBOL_SIZE = 16;
const MIN_STREAM_LENGTH = 10;
const MAX_STREAM_LENGTH = 30;

// --- PLAYER CLASS ---
class Player {
  constructor() {
    this.pos = createVector(width / 2, height - 100);
    this.r = PLAYER_SIZE / 2; // Keep for compatibility with other systems
    this.spriteWidth = 124; // Actual sprite width
    this.spriteHeight = 164; // Actual sprite height
    this.collisionWidth = 62; // Half the sprite width for collision
    this.collisionHeight = 164; // Full sprite height for collision
    this.heading = 0; // Point right (0 degrees) for Space Invaders
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
    this.pos = createVector(width / 2, height - 100);
    this.vel = createVector(0, 0);
    this.heading = 0; // Point right for Space Invaders
    this.isInvincible = true;
    this.invincibilityTimer = PLAYER_INVINCIBILITY_DURATION;
  }

  handleInput() {
    // Space Invaders style movement - only left/right
    if (keyIsDown(LEFT_ARROW)) {
      this.vel.x = -PLAYER_MAX_SPEED;
    } else if (keyIsDown(RIGHT_ARROW)) {
      this.vel.x = PLAYER_MAX_SPEED;
    } else {
      this.vel.x = 0;
    }
  }

  shoot() {
    let bulletPos = createVector(this.pos.x, this.pos.y - this.r);
    bullets.push(new TrainingBullet(bulletPos, -PI/2)); // Always shoot upward
  }

  update() {
    if (this.isInvincible) {
      this.invincibilityTimer--;
      if (this.invincibilityTimer <= 0) {
        this.isInvincible = false;
      }
    }

    this.pos.add(this.vel);
    this.vel.mult(PLAYER_FRICTION);
  }

  edges() {
    // Keep player on screen
    if (this.pos.x < this.r) {
      this.pos.x = this.r;
      this.vel.x = 0;
    } else if (this.pos.x > width - this.r) {
      this.pos.x = width - this.r;
      this.vel.x = 0;
    }
  }

  render() {
    push();
    
    if (this.isInvincible && frameCount % 10 < 5) {
      // Flash when invincible
      tint(255, 100);
    }

    // Draw the selected hero sprite
    let heroImage = heroImages[selectedHero];
    
    translate(this.pos.x, this.pos.y);
    // No rotation needed - PNG is already in correct orientation
    
    if (selectedHero === 1) {
      scale(-1, 1); // Flip horizontally for player 2
    }
    
    imageMode(CENTER);
    image(heroImage, 0, 0, this.spriteWidth, this.spriteHeight);
    
    pop();
  }

  hits(alien) {
    if (!alien || alien.destroyed) return false;
    let d = dist(this.pos.x, this.pos.y, alien.x, alien.y);
    return d < this.r + alien.size/2;
  }
}

// --- NEON ALIEN CLASS ---
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
    this.isBoss = false;
  }

  update() {
    if (this.destroyed) return;
    
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
    drawingContext.shadowBlur = 15 * pulse;
    drawingContext.shadowColor = this.color.toString();
    
    // Draw pixel alien using 5x4 grid
    fill(this.color);
    noStroke();
    
    // Alien pattern (1 = filled pixel, 0 = empty)
    const alienPattern = [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [1, 0, 1, 0, 1]
    ];
    
    let pixelSize = 6;
    let startX = this.x - (alienPattern[0].length * pixelSize) / 2;
    let startY = this.y - (alienPattern.length * pixelSize) / 2;
    
    for (let row = 0; row < alienPattern.length; row++) {
      for (let col = 0; col < alienPattern[row].length; col++) {
        if (alienPattern[row][col] === 1) {
          let px = startX + col * pixelSize;
          let py = startY + row * pixelSize;
          rect(px, py, pixelSize, pixelSize);
        }
      }
    }
    
    // Reset shadow for label
    drawingContext.shadowBlur = 0;
    
    // Label below alien
    fill(this.color);
    textAlign(CENTER);
    textSize(8);
    text(this.label, this.x, this.y + this.size/2 + 12);
    pop();
  }

  checkCollision(bullet) {
    if (this.destroyed) return false;
    let d = dist(this.x, this.y, bullet.pos.x, bullet.pos.y);
    return d < this.size/2 + 5;
  }
}

// --- COMPLEX MODEL BOSS CLASS ---
class ComplexModelBoss extends NeonAlien {
  constructor(x, y) {
    super(x, y, 'ENSEMBLE_MODEL', color(255, 100, 0), 500);
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
    
    push();
    // Boss-specific neon glow effect (brighter than regular aliens)
    let pulse = sin(frameCount * 0.1 + this.pulsePhase) * 0.3 + 0.7;
    
    // Multiple shadows for glow
    drawingContext.shadowBlur = 25 * pulse;
    drawingContext.shadowColor = this.color.toString();
    
    // Draw larger pixel boss using 8x6 grid
    fill(this.color);
    noStroke();
    
    // Boss alien pattern (larger and more complex)
    const bossPattern = [
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 0],
      [1, 1, 0, 1, 1, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 0, 1, 1, 0, 1, 0],
      [1, 0, 1, 0, 0, 1, 0, 1]
    ];
    
    let pixelSize = 8; // Larger pixels for boss
    let startX = this.x - (bossPattern[0].length * pixelSize) / 2;
    let startY = this.y - (bossPattern.length * pixelSize) / 2;
    
    for (let row = 0; row < bossPattern.length; row++) {
      for (let col = 0; col < bossPattern[row].length; col++) {
        if (bossPattern[row][col] === 1) {
          let px = startX + col * pixelSize;
          let py = startY + row * pixelSize;
          rect(px, py, pixelSize, pixelSize);
        }
      }
    }
    
    // Reset shadow for UI elements
    drawingContext.shadowBlur = 0;
    
    // Label below boss
    fill(this.color);
    textAlign(CENTER);
    textSize(10);
    text(this.label, this.x, this.y + this.size/2 + 15);
    
    // Health bar
    fill(255, 0, 0);
    rect(this.x - 40, this.y - this.size/2 - 25, 80, 6);
    fill(0, 255, 0);
    rect(this.x - 40, this.y - this.size/2 - 25, 80 * (this.health/this.maxHealth), 6);
    pop();
  }
}

// --- HYPERPARAMETER POWERUP CLASS ---
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
    let d = dist(this.x, this.y, bullet.pos.x, bullet.pos.y);
    if (d < this.size + 10) { // Increased collision radius for easier collection
      this.collected = true;
      return true;
    }
    return false;
  }
}

// --- TRAINING BULLET CLASS ---
class TrainingBullet {
  constructor(position, heading) {
    this.pos = position.copy();
    this.vel = p5.Vector.fromAngle(heading);
    this.vel.mult(BULLET_SPEED);
    this.r = 4;
  }

  update() {
    this.pos.add(this.vel);
  }

  render() {
    push();
    // Tractor beam style bullet
    fill(0, 255, 255);
    stroke(0, 255, 255);
    strokeWeight(2);
    
    // Draw bullet with glow
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = 'cyan';
    ellipse(this.pos.x, this.pos.y, this.r * 2);
    
    // Trail effect
    stroke(0, 255, 255, 100);
    line(this.pos.x, this.pos.y, this.pos.x - this.vel.x, this.pos.y - this.vel.y);
    pop();
  }

  isOffscreen() {
    return this.pos.x < -10 || this.pos.x > width + 10 || 
           this.pos.y < -10 || this.pos.y > height + 10;
  }

  hits(alien) {
    if (!alien || alien.destroyed) return false;
    let d = dist(this.pos.x, this.pos.y, alien.x, alien.y);
    return d < this.r + alien.size/2;
  }
}

// --- HYPERPARAMETER OPTIMIZER CLASS ---
class HyperparameterOptimizer {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.expanding = true;
    this.radius = 0;
    this.maxRadius = width; // Cover whole screen
    this.expandSpeed = 20;
  }

  update() {
    if (this.expanding) {
      this.radius += this.expandSpeed;
      if (this.radius >= this.maxRadius) {
        this.expanding = false;
      }
    }
  }

  render() {
    if (!this.expanding) return;
    
    push();
    // Create massive sweep effect
    drawingContext.shadowBlur = 30;
    drawingContext.shadowColor = 'gold';
    
    stroke(255, 215, 0, 150);
    strokeWeight(5);
    noFill();
    
    // Draw expanding circle
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
    
    // Add some sparkle effects
    for (let i = 0; i < 8; i++) {
      let angle = (TWO_PI / 8) * i;
      let x = this.pos.x + cos(angle) * this.radius;
      let y = this.pos.y + sin(angle) * this.radius;
      
      fill(255, 215, 0, 200);
      noStroke();
      ellipse(x, y, 10);
    }
    pop();
  }

  isOffscreen() {
    return !this.expanding && this.radius >= this.maxRadius;
  }

  hits(alien) {
    if (!this.expanding) return false;
    let d = dist(this.pos.x, this.pos.y, alien.x, alien.y);
    return d <= this.radius;
  }
}

// --- TRAINING PARTICLE CLASS ---
class TrainingParticle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-3, 3), random(-3, 3));
    this.life = 255;
    this.maxLife = 255;
    this.size = random(3, 8);
    this.color = color(0, 255, 255);
  }

  update() {
    this.pos.add(this.vel);
    this.life -= 5;
    this.vel.mult(0.98); // Slow down over time
  }

  render() {
    push();
    let alpha = map(this.life, 0, this.maxLife, 0, 255);
    fill(red(this.color), green(this.color), blue(this.color), alpha);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size);
    pop();
  }

  isDead() {
    return this.life <= 0;
  }
}

// --- FIREWORK CLASS (keep from original) ---
class Firework {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-5, 5), random(-8, -2));
    this.acc = createVector(0, 0.1);
    this.life = 255;
    this.size = random(2, 6);
    this.color = color(random(360), 80, 90);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.life -= 3;
  }

  render() {
    push();
    colorMode(HSB);
    fill(hue(this.color), saturation(this.color), brightness(this.color), this.life);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size);
    pop();
  }

  isDead() {
    return this.life <= 0;
  }
}

// --- MATRIX RAIN CLASSES (keep from original) ---
class MatrixSymbol {
  constructor(x, y, size, color_alpha) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color_alpha = color_alpha;
    this.char = this.getRandomChar();
    this.switchTimer = random(120, 600); // Random time before switching character
    this.timer = 0;
  }

  getRandomChar() {
    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return chars[floor(random(chars.length))];
  }

  render() {
    this.timer++;
    if (this.timer >= this.switchTimer) {
      this.char = this.getRandomChar();
      this.timer = 0;
      this.switchTimer = random(120, 600);
    }

    push();
    fill(120, 100, this.color_alpha);
    textFont('monospace');
    textSize(this.size);
    textAlign(CENTER, CENTER);
    text(this.char, this.x, this.y);
    pop();
  }
}

class MatrixStream {
  constructor(x) {
    this.x = x;
    this.symbols = [];
    this.speed = random(1, 4);
    this.length = random(MIN_STREAM_LENGTH, MAX_STREAM_LENGTH);
  }

  generateSymbols() {
    this.symbols = [];
    for (let i = 0; i < this.length; i++) {
      let y = random(-height, 0) - (i * SYMBOL_SIZE);
      let alpha = map(i, 0, this.length - 1, 80, 30);
      this.symbols.push(new MatrixSymbol(this.x, y, SYMBOL_SIZE, alpha));
    }
  }

  render() {
    for (let symbol of this.symbols) {
      symbol.y += this.speed;
      if (symbol.y > height + SYMBOL_SIZE) {
        symbol.y = -SYMBOL_SIZE * this.length + random(-height, 0);
      }
      symbol.render();
    }
  }
}