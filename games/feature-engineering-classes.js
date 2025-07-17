// Data Cleaning Game Classes - Complete implementation from original sketch.js
// Player, Bullet, Asteroid, DatabaseCleaner, Powerup, Firework, SQLParticle, MatrixSymbol, MatrixStream

// Matrix rain constants (must be global for classes to access)
const SYMBOL_SIZE = 16;
const MIN_STREAM_LENGTH = 10;
const MAX_STREAM_LENGTH = 30;

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
    
    // Update invincibility
    if (this.isInvincible) {
      this.invincibilityTimer--;
      if (this.invincibilityTimer <= 0) {
        this.isInvincible = false;
      }
    }
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
        
        // Check if hero image is loaded before drawing
        if (heroImages && heroImages[selectedHero] && heroImages[selectedHero].width > 0) {
            image(heroImages[selectedHero], 0, 0,
                  heroImages[selectedHero].width * heroScale,
                  heroImages[selectedHero].height * heroScale);
        } else {
            // Fallback: draw simple colored circle
            fill(120, 100, 100);
            noStroke();
            circle(0, 0, 40);
        }
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
            // Use special database cleaner weapon
            bullets.push(new DatabaseCleaner(bulletStartPos, this.heading));
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
    let cleanData = random(['SELECT', 'DELETE', 'WHERE', 'UPDATE', 'CLEAN', 'FIX', 'REPAIR']);
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

// --- DATABASE CLEANER CLASS ---
class DatabaseCleaner extends Bullet {
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