// Model Monitoring Game Classes
// Missile Command style game with ML monitoring theme

// Matrix Rain Classes (from shared pattern)
class MatrixSymbol {
    constructor(x, y, speed, opacity, size) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.opacity = opacity;
        this.size = size;
        this.interval = round(random(5, 30));
        this.switchInterval = round(random(20, 100));
        this.char = this.setRandomChar();
        this.first = false;
    }

    setRandomChar() {
        const charSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝ";
        return charSet[floor(random(0, charSet.length))];
    }

    rain() {
        this.y = (this.y >= height) ? 0 : this.y + this.speed;
    }

    render() {
        fill(120, 100, this.first ? 100 : 70, this.opacity);
        textSize(this.size);
        text(this.char, this.x, this.y);
        this.rain();
        if (frameCount % this.switchInterval === 0) {
            this.char = this.setRandomChar();
        }
    }
}

class MatrixStream {
    constructor(x) {
        this.x = x;
        this.symbols = [];
        this.totalSymbols = round(random(10, 30));
        this.speed = random(2, 6);
    }

    generateSymbols() {
        let opacity = 255;
        let first = true;
        let y = random(-1000, 0);
        for (let i = 0; i <= this.totalSymbols; i++) {
            let symbol = new MatrixSymbol(this.x, y, this.speed, opacity, 16);
            symbol.first = first;
            this.symbols.push(symbol);
            opacity -= 255 / this.totalSymbols;
            y -= 16;
            first = false;
        }
    }

    render() {
        this.symbols.forEach(symbol => symbol.render());
    }
}

// Firework class for victory celebrations
class Firework {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = p5.Vector.random2D().mult(random(2, 10));
        this.acc = createVector(0, 0);
        this.lifespan = 255;
        this.hue = random(80, 180);
    }

    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
        this.lifespan -= 4;
        this.vel.mult(0.95);
    }

    render() {
        push();
        stroke(this.hue, 80, 100, this.lifespan);
        strokeWeight(3);
        point(this.pos.x, this.pos.y);
        pop();
    }

    isDead() {
        return this.lifespan < 0;
    }
}

// ML Model class (cities to defend)
class MLModel {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = MODEL_WIDTH;
        this.height = MODEL_HEIGHT;
        this.isDestroyed = false;
        this.modelTypes = ["Neural Net", "Random Forest", "SVM", "XGBoost", "LSTM"];
        this.modelName = random(this.modelTypes);
    }

    render() {
        if (!this.isDestroyed) {
            push();
            fill(120, 80, 90);
            noStroke();
            rectMode(CENTER);
            
            // Model base
            rect(this.x, this.y, this.width, this.height, 10);
            
            // Server rack effect
            for (let i = 0; i < 4; i++) {
                let yOffset = -this.height/2 + 10 + i * 12;
                stroke(120, 100, 100, 150);
                strokeWeight(1);
                line(this.x - this.width/2 + 5, this.y + yOffset, 
                     this.x + this.width/2 - 5, this.y + yOffset);
            }
            
            // Model name
            fill(120, 100, 100);
            noStroke();
            textSize(12);
            textAlign(CENTER, CENTER);
            text(this.modelName, this.x, this.y);
            
            // Status indicator
            fill(120, 100, 100);
            circle(this.x, this.y - this.height/2 - 10, 8);
            pop();
        } else {
            // Destroyed model
            push();
            fill(0, 100, 50, 100);
            noStroke();
            rectMode(CENTER);
            rect(this.x, this.y, this.width, this.height, 10);
            
            fill(0, 100, 100);
            textSize(16);
            textAlign(CENTER, CENTER);
            text("OFFLINE", this.x, this.y);
            pop();
        }
    }

    checkCollision(threat) {
        if (this.isDestroyed) return false;
        
        return (
            threat.y + threat.size / 2 > this.y - this.height / 2 &&
            threat.y - threat.size / 2 < this.y + this.height / 2 &&
            threat.x > this.x - this.width / 2 &&
            threat.x < this.x + this.width / 2
        );
    }
}

// Threat class (enemy missiles)
class Threat {
    constructor(x, y, definition) {
        this.x = x;
        this.y = y;
        this.definition = definition;
        this.name = definition.name;
        this.speed = definition.speed * (1 + (wave - 1) * 0.1);
        this.points = definition.points;
        this.color = definition.color;
        this.size = definition.size;
        this.health = definition.health || 1;
        this.isBoss = (this.name === BOSS_THREAT.name);
        this.particles = [];
    }

    update() {
        this.y += this.speed;
        
        // Add trail particles
        if (frameCount % 3 === 0) {
            this.particles.push({
                x: this.x + random(-5, 5),
                y: this.y - this.size/2,
                alpha: 255
            });
        }
        
        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].y -= 1;
            this.particles[i].alpha -= 15;
            if (this.particles[i].alpha <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    render() {
        // Draw trail
        for (let p of this.particles) {
            push();
            fill(this.color[0], this.color[1], this.color[2], p.alpha * 0.5);
            noStroke();
            circle(p.x, p.y, 4);
            pop();
        }
        
        push();
        // Main threat body
        fill(this.color[0], this.color[1], this.color[2]);
        noStroke();
        
        if (this.isBoss) {
            // Boss has more complex shape
            rectMode(CENTER);
            for (let i = 0; i < 8; i++) {
                let angle = TWO_PI / 8 * i;
                let d = this.size * 0.4;
                rect(this.x + cos(angle) * d * 0.5, this.y + sin(angle) * d * 0.5, 
                     this.size * 0.3, this.size * 0.3, 5);
            }
            fill(this.color[0], this.color[1], this.color[2], 150);
            ellipse(this.x, this.y, this.size * 0.8, this.size * 0.8);
        } else {
            // Regular threat
            triangle(
                this.x, this.y + this.size/2,
                this.x - this.size/2, this.y - this.size/2,
                this.x + this.size/2, this.y - this.size/2
            );
        }
        
        // Threat name
        fill(120, 100, 100);
        textSize(this.isBoss ? 14 : 10);
        textAlign(CENTER, CENTER);
        text(this.name, this.x, this.y - this.size / 2 - (this.isBoss ? 12 : 8));
        
        if (this.isBoss && this.health > 1) {
            textSize(10);
            text(`HP: ${this.health}`, this.x, this.y + this.size / 2 + 8);
        }
        pop();
    }

    isOffScreen() {
        return this.y - this.size / 2 > height;
    }

    takeDamage() {
        this.health--;
        return this.health <= 0;
    }
}

// Defense missile class
class Defense {
    constructor(startX, startY, targetX, targetY) {
        this.x = startX;
        this.y = startY;
        this.targetX = targetX;
        this.targetY = targetY;
        let angle = atan2(targetY - startY, targetX - startX);
        this.vx = cos(angle) * DEFENSE_SPEED;
        this.vy = sin(angle) * DEFENSE_SPEED;
        this.trail = [];
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.trail.push({x: this.x, y: this.y});
        if (this.trail.length > 15) {
            this.trail.shift();
        }
    }

    render() {
        // Draw trail
        for (let i = 0; i < this.trail.length; i++) {
            let pos = this.trail[i];
            let alpha = map(i, 0, this.trail.length, 50, 150);
            push();
            stroke(120, 100, 100, alpha);
            strokeWeight(map(i, 0, this.trail.length, 1, 3));
            point(pos.x, pos.y);
            pop();
        }
        
        // Main missile
        push();
        stroke(120, 100, 100);
        strokeWeight(4);
        line(this.x, this.y, this.x - this.vx * 2, this.y - this.vy * 2);
        
        // Warhead glow
        fill(120, 100, 100);
        noStroke();
        circle(this.x, this.y, 6);
        pop();
    }

    hasReachedTarget() {
        return dist(this.x, this.y, this.targetX, this.targetY) < DEFENSE_SPEED;
    }
}

// Monitoring explosion class
class MonitoringExplosion {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.currentRadius = EXPLOSION_RADIUS_START;
        this.maxRadius = EXPLOSION_RADIUS_MAX;
        this.duration = EXPLOSION_DURATION;
        this.age = 0;
        this.mlTerms = ["ALERT", "MONITOR", "DETECT", "ANALYZE", "PROTECT", "SCAN", "VERIFY"];
        this.term = random(this.mlTerms);
        this.hitThreats = new Set();
    }

    update() {
        this.age++;
        this.currentRadius = lerp(EXPLOSION_RADIUS_START, this.maxRadius, this.age / this.duration);
    }

    render() {
        let alpha = map(this.age, 0, this.duration, 255, 0);
        
        push();
        // Main explosion ring
        noFill();
        stroke(120, 100, 100, alpha);
        strokeWeight(map(this.age, 0, this.duration, 5, 1));
        ellipse(this.x, this.y, this.currentRadius * 2, this.currentRadius * 2);
        
        // Digital glitch effect
        for (let i = 0; i < 5; i++) {
            let rOff = random(-5, 5) * (this.age / this.duration);
            let aOff = random(TWO_PI);
            stroke(120, 80, 80, alpha * 0.5);
            ellipse(this.x + cos(aOff) * rOff, this.y + sin(aOff) * rOff, 
                   this.currentRadius * 2 * random(0.9, 1.1), 
                   this.currentRadius * 2 * random(0.9, 1.1));
        }
        
        // ML term display
        if (this.age < this.duration * 0.7) {
            fill(120, 100, 100, alpha);
            noStroke();
            textSize(16);
            textAlign(CENTER, CENTER);
            text(this.term, this.x, this.y);
        }
        pop();
    }

    isFinished() {
        return this.age >= this.duration;
    }

    checkCollision(threat) {
        if (this.hitThreats.has(threat)) return false;
        
        let d = dist(this.x, this.y, threat.x, threat.y);
        if (d < this.currentRadius + threat.size / 2) {
            this.hitThreats.add(threat);
            return true;
        }
        return false;
    }
}

// Defense Hero class
class DefenseHero {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.size = 80;
        this.moveSpeed = 5;
    }

    update() {
        // Smooth movement towards mouse X position
        if (abs(mouseX - this.x) > 5) {
            this.x = lerp(this.x, mouseX, 0.1);
        }
    }

    render() {
        push();
        imageMode(CENTER);
        
        // Draw hero image if loaded
        if (heroImages[selectedHero] && heroImages[selectedHero].width > 0) {
            let heroScale = this.size / heroImages[selectedHero].width;
            image(heroImages[selectedHero], this.x, this.y, 
                  heroImages[selectedHero].width * heroScale,
                  heroImages[selectedHero].height * heroScale);
        } else {
            // Fallback if image not loaded
            fill(120, 100, 100);
            noStroke();
            rectMode(CENTER);
            rect(this.x, this.y, this.size, this.size);
        }
        
        // Defense turret
        stroke(120, 100, 100);
        strokeWeight(4);
        let turretAngle = atan2(mouseY - this.y, mouseX - this.x);
        line(this.x, this.y, 
             this.x + cos(turretAngle) * 40, 
             this.y + sin(turretAngle) * 40);
        
        // Turret base
        fill(120, 80, 80);
        noStroke();
        circle(this.x, this.y, 20);
        pop();
    }
}

// System Reset Powerup class
class SystemResetPowerup {
    constructor() {
        this.x = random(100, width - 100);
        this.y = random(100, height / 2);
        this.size = 40;
        this.pulsePhase = 0;
    }

    update() {
        this.pulsePhase += 0.05;
    }

    render() {
        push();
        // Pulsing effect
        let pulse = sin(this.pulsePhase) * 5;
        
        // Outer glow
        fill(180, 100, 100, 50);
        noStroke();
        circle(this.x, this.y, this.size + pulse + 20);
        
        // Main powerup
        fill(180, 80, 90);
        circle(this.x, this.y, this.size + pulse);
        
        // Icon
        fill(120, 100, 100);
        textAlign(CENTER, CENTER);
        textSize(20);
        text("SR", this.x, this.y);
        
        // Label
        textSize(12);
        text("SYSTEM RESET", this.x, this.y + this.size + 10);
        pop();
    }
}