// Feature Engineering Game Classes
// MatrixStream, Firework classes for the Feature Engineering Tetris game

// Matrix rain constants
const SYMBOL_SIZE = 16;
const MIN_STREAM_LENGTH = 10;
const MAX_STREAM_LENGTH = 30;

// --- MATRIX SYMBOL CLASS ---
class MatrixSymbol {
    constructor(x, y, char, speed, isFirst = false) {
        this.x = x;
        this.y = y;
        this.char = char;
        this.speed = speed;
        this.isFirst = isFirst; // First character in the stream (brightest)
        this.opacity = random(0.1, 1.0);
        this.switchTime = millis() + random(100, 500);
    }

    update() {
        this.y += this.speed;
        
        // Randomly switch characters
        if (millis() > this.switchTime) {
            this.char = random(['0', '1', 'Z', 'I', 'O', 'N', 'λ', 'μ', 'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ']);
            this.switchTime = millis() + random(100, 500);
        }
    }

    render() {
        push();
        let hue = 120; // Green
        let saturation = 100;
        let brightness = this.isFirst ? 100 : map(this.y, 0, height, 20, 80);
        let alpha = this.isFirst ? 100 : this.opacity * 80;
        
        fill(hue, saturation, brightness, alpha);
        textSize(SYMBOL_SIZE);
        textAlign(CENTER, CENTER);
        text(this.char, this.x, this.y);
        pop();
    }

    isDead() {
        return this.y > height + SYMBOL_SIZE;
    }
}

// --- MATRIX STREAM CLASS ---
class MatrixStream {
    constructor(x) {
        this.x = x;
        this.symbols = [];
        this.speed = random(1, 3);
        this.length = random(MIN_STREAM_LENGTH, MAX_STREAM_LENGTH);
    }

    generateSymbols() {
        this.symbols = [];
        for (let i = 0; i < this.length; i++) {
            let char = random(['0', '1', 'Z', 'I', 'O', 'N', 'λ', 'μ', 'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ']);
            let y = -i * SYMBOL_SIZE - random(0, height);
            let isFirst = (i === 0);
            this.symbols.push(new MatrixSymbol(this.x, y, char, this.speed, isFirst));
        }
    }

    update() {
        for (let i = this.symbols.length - 1; i >= 0; i--) {
            this.symbols[i].update();
            if (this.symbols[i].isDead()) {
                // Regenerate symbol at the top
                let char = random(['0', '1', 'Z', 'I', 'O', 'N', 'λ', 'μ', 'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ']);
                let y = -SYMBOL_SIZE - random(0, height * 0.5);
                let isFirst = (i === 0);
                this.symbols[i] = new MatrixSymbol(this.x, y, char, this.speed, isFirst);
            }
        }
    }

    render() {
        for (let symbol of this.symbols) {
            symbol.render();
        }
    }
}

// --- FIREWORK CLASS ---
class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = random(-3, 3);
        this.vy = random(-5, -1);
        this.life = 1.0;
        this.decay = random(0.02, 0.05);
        this.hue = random(0, 360);
        this.size = random(2, 6);
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1; // Gravity
        this.life -= this.decay;
        this.vx *= 0.99; // Air resistance
        this.vy *= 0.99;
    }

    render() {
        if (this.life > 0) {
            push();
            fill(this.hue, 80, 100, this.life * 100);
            noStroke();
            circle(this.x, this.y, this.size * this.life);
            pop();
        }
    }

    isDead() {
        return this.life <= 0;
    }
}