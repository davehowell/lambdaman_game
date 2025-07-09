// Hub Landing Page - Matrix Rain Effect using p5.js
// This sketch runs the matrix rain background for the main landing page

let matrixStreams = [];

// Matrix rain settings (from original sketch.js)
const SYMBOL_SIZE = 16;
const MIN_STREAM_LENGTH = 10;
const MAX_STREAM_LENGTH = 30;

function setup() {
    // Create canvas that fills the window
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.style('z-index', '-1'); // Put canvas behind everything
    canvas.id('matrix-p5-canvas');
    
    // Remove the default canvas if it exists
    let oldCanvas = document.getElementById('matrix-canvas');
    if (oldCanvas) {
        oldCanvas.style.display = 'none';
    }
    
    colorMode(HSB, 360, 100, 100, 100);
    
    // Initialize matrix streams
    let x = 0;
    for (let i = 0; x < width + SYMBOL_SIZE; i++) {
        let stream = new MatrixStream(x);
        stream.generateSymbols();
        matrixStreams.push(stream);
        x += SYMBOL_SIZE * 0.9;
    }
}

function draw() {
    // Dark background with slight transparency for trailing effect
    background(220, 10, 10, 35);
    
    // Render all matrix streams
    for (let stream of matrixStreams) {
        stream.render();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    
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

// --- MATRIX RAIN CLASSES (from original sketch.js) ---
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