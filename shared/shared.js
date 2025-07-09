// ML Ops Workflow - Shared Assets and Utilities
// Matrix-themed shared functionality for all games

// Shared sprite paths (use relative paths - adjust based on where they're used)
const MLOpsSprites = {
    heroes: {
        dave: 'shared/sprites/Dave.png',
        nadya: 'shared/sprites/Nadya.png',
        dave_face: 'shared/sprites/Dave_face.png',
        nadya_face: 'shared/sprites/Nadya_face.png',
        lambda_man: 'shared/sprites/Lambda-man.png',
        angel_bot: 'shared/sprites/angel-bot.png',
        flying_cyborg: 'shared/sprites/flying-cyborg.jpg',
        green_suit: 'shared/sprites/green_suit.png',
        grey_suit: 'shared/sprites/grey-suit.jpeg',
        murdetbot_suit: 'shared/sprites/murdetbot_suit.png',
        purple_suit: 'shared/sprites/purple_suit.jpeg'
    },
    characters: 'shared/sprites/characters.png'
};

// Matrix theme configuration
const MatrixTheme = {
    colors: {
        bright: '#00ff41',
        medium: '#00cc33',
        dark: '#008822',
        dim: '#004411',
        black: '#000000',
        darkGreen: '#001100'
    },

    // Matrix rain characters
    rainChars: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝ",

    // Code fragments for different ML phases
    codeFragments: {
        dataClean: ["SELECT", "FROM", "WHERE", "JOIN", "CLEAN", "FILTER", "VALIDATE", "TRANSFORM"],
        featureEng: ["NORMALIZE", "ENCODE", "SCALE", "EXTRACT", "COMBINE", "REDUCE", "ENGINEER"],
        modelTrain: ["TRAIN", "VALIDATE", "OPTIMIZE", "BACKPROP", "GRADIENT", "EPOCH", "BATCH"],
        modelDeploy: ["DEPLOY", "CONTAINER", "PIPELINE", "CI/CD", "STAGING", "PROD", "ROLLBACK"],
        modelMonitor: ["MONITOR", "ALERT", "DRIFT", "ANOMALY", "METRICS", "HEALTH", "PERFORMANCE"]
    }
};

// Shared utilities
const MLOpsUtils = {
    // Note: Matrix rain effect is now handled directly in hub-sketch.js using p5.js
    // This placeholder function is kept for compatibility with games that might reference it
    createMatrixRain: function(symbolSize = 16, minStreamLength = 10, maxStreamLength = 30) {
        console.log('Matrix rain is handled by p5.js in individual game sketches');
        return {
            streams: [],
            render: function() {},
            regenerate: function(width, height) {}
        };
    },

    // Format score with leading zeros
    formatScore: function(score) {
        return score.toString().padStart(8, '0');
    },

    // Draw glowing text for game UI (p5.js version)
    drawGlowText: function(text, x, y, size = 24) {
        push();
        fill(120, 100, 100); // Matrix green
        textSize(size);
        textAlign(CENTER, CENTER);
        text(text, x, y);
        pop();
    },

    // Create particle effect
    createParticleEffect: function(x, y, color = MatrixTheme.colors.bright, count = 10) {
        const particles = [];

        for (let i = 0; i < count; i++) {
            particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 1.0,
                decay: Math.random() * 0.02 + 0.01,
                size: Math.random() * 3 + 1,
                color: color
            });
        }

        return {
            particles: particles,
            update: function() {
                for (let i = particles.length - 1; i >= 0; i--) {
                    const p = particles[i];
                    p.x += p.vx;
                    p.y += p.vy;
                    p.life -= p.decay;

                    if (p.life <= 0) {
                        particles.splice(i, 1);
                    }
                }
            },
            render: function(ctx) {
                particles.forEach(p => {
                    ctx.save();
                    ctx.globalAlpha = p.life;
                    ctx.fillStyle = p.color;
                    ctx.fillRect(p.x, p.y, p.size, p.size);
                    ctx.restore();
                });
            },
            isDead: function() {
                return particles.length === 0;
            }
        };
    },

    // Load hero sprite with error handling
    loadHeroSprite: function(heroName, callback) {
        const img = new Image();
        img.onload = () => callback(img);
        img.onerror = () => {
            console.warn(`Failed to load hero sprite: ${heroName}`);
            callback(null);
        };
        img.src = MLOpsSprites.heroes[heroName] || MLOpsSprites.heroes.lambda_man;
    },

    // Format score with Matrix styling
    formatScore: function(score) {
        return score.toString().padStart(8, '0');
    },

    // Create glowing text effect
    drawGlowText: function(ctx, text, x, y, fontSize = 24, color = MatrixTheme.colors.bright) {
        ctx.save();
        ctx.font = `${fontSize}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Glow effect
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);

        ctx.restore();
    }
};

// Navigation system for returning to hub
const MLOpsNavigation = {
    // Return to main hub with game completion data
    returnToHub: function(gameData = {}) {
        const completionData = {
            type: 'gameComplete',
            game: gameData.game || 'unknown',
            score: gameData.score || 0,
            completed: gameData.completed || false,
            timeSpent: gameData.timeSpent || 0,
            ...gameData
        };

        // If we're in an iframe, post message to parent
        if (window.parent !== window) {
            window.parent.postMessage(completionData, '*');
        } else {
            // If standalone, redirect to main hub
            window.location.href = '../index.html';
        }
    },

    // Show game completion overlay
    showCompletionOverlay: function(gameData, onContinue) {
        const overlay = document.createElement('div');
        overlay.className = 'game-complete-overlay';

        overlay.innerHTML = `
            <div class="game-complete-title">PHASE COMPLETE</div>
            <div class="game-complete-message">${gameData.message || 'Well done! Moving to next phase of ML workflow.'}</div>
            <div class="game-complete-score">SCORE: ${MLOpsUtils.formatScore(gameData.score || 0)}</div>
            <button class="nav-button" onclick="this.parentElement.remove(); ${onContinue ? 'onContinue()' : 'MLOpsNavigation.returnToHub(arguments[0])'}"
                    data-game-data='${JSON.stringify(gameData)}'>
                CONTINUE TO NEXT PHASE
            </button>
        `;

        document.body.appendChild(overlay);

        // Auto-continue after 5 seconds if no interaction
        setTimeout(() => {
            if (document.body.contains(overlay)) {
                overlay.remove();
                if (onContinue) {
                    onContinue();
                } else {
                    MLOpsNavigation.returnToHub(gameData);
                }
            }
        }, 5000);
    }
};

// Original Matrix Rain Classes
MLOpsUtils.MatrixSymbol = class {
    constructor(x, y, speed, first, opacity, symbolSize) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.first = first;
        this.opacity = opacity;
        this.symbolSize = symbolSize;
        this.value;
        this.switchInterval = Math.round(Math.random() * 22 + 8); // random(8, 30)
        this.setToRandomSymbol();
    }

    setToRandomSymbol() {
        const charSet = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        this.value = charSet.charAt(Math.floor(Math.random() * charSet.length));
    }

    rain() {
        this.y = (this.y >= window.innerHeight + this.symbolSize) ? -this.symbolSize : this.y + this.speed;
        if (frameCount % this.switchInterval === 0) {
            this.setToRandomSymbol();
        }
    }

    render() {
        push();
        if (this.first) {
            fill(130, 100, 98, this.opacity);
        } else {
            fill(120, 85, 75, this.opacity);
        }
        noStroke();
        textSize(this.symbolSize);
        textAlign(CENTER, CENTER);
        text(this.value, this.x, this.y);
        this.rain();
        pop();
    }
};

MLOpsUtils.MatrixStream = class {
    constructor(x, symbolSize, minStreamLength, maxStreamLength) {
        this.x = x;
        this.symbols = [];
        this.symbolSize = symbolSize;
        this.totalSymbols = Math.round(Math.random() * (maxStreamLength - minStreamLength) + minStreamLength);
        this.speed = Math.random() * 5 + 2; // random(2, 7)
        this.baseOpacity = Math.random() * 50 + 40; // random(40, 90)
    }

    generateSymbols() {
        let y = Math.random() * (-window.innerHeight * 0.5); // random(-height * 0.5, 0)
        let opacityStep = this.baseOpacity / this.totalSymbols;

        for (let i = 0; i < this.totalSymbols; i++) {
            let symbol = new MLOpsUtils.MatrixSymbol(
                this.x,
                y,
                this.speed,
                i === 0,
                Math.max(10, this.baseOpacity - (i * opacityStep)),
                this.symbolSize
            );
            this.symbols.push(symbol);
            y -= this.symbolSize * (Math.random() * 0.2 + 0.9); // random(0.9, 1.1)
        }
    }

    render() {
        this.symbols.forEach(symbol => {
            symbol.render();
        });
    }
};

// Initialize shared functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add Matrix theme class to body
    document.body.classList.add('matrix-theme');

    // Prevent arrow key scrolling
    window.addEventListener('keydown', function(e) {
        if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].indexOf(e.code) > -1) {
            e.preventDefault();
        }
    }, false);

    console.log('ML Ops shared utilities loaded');
});
