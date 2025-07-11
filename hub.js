// ML Operations Workflow Hub - Main Navigation and Progress Tracking

// Workflow phases configuration
const workflowPhases = [
    {
        id: 'data-cleaning',
        title: 'Bad Data Matrix',
        subtitle: 'Data Cleaning Phase',
        description: 'Fight corrupted data in the matrix. Use SQL commands to eliminate bad data asteroids.',
        gameFile: 'games/data-cleaning.html',
        completed: false,
        score: 0
    },
    {
        id: 'feature-engineering',
        title: 'Feature Forge',
        subtitle: 'Feature Engineering Phase', 
        description: 'Build and shape data features like Tetris blocks. Engineer the perfect dataset.',
        gameFile: 'games/feature-engineering.html',
        completed: false,
        score: 0
    },
    {
        id: 'model-training',
        title: 'Neural Network Training',
        subtitle: 'Model Training & Evaluation',
        description: 'Train neural networks by defeating waves of training data. Optimize for accuracy.',
        gameFile: 'games/model-training.html',
        completed: false,
        score: 0
    },
    {
        id: 'model-deployment',
        title: 'Deployment Pipeline',
        subtitle: 'Model Deployment Phase',
        description: 'Navigate the deployment maze. Collect artifacts while avoiding deployment ghosts.',
        gameFile: 'games/model-deployment.html',
        completed: false,
        score: 0
    },
    {
        id: 'model-monitoring',
        title: 'System Monitoring',
        subtitle: 'Model Monitoring Phase',
        description: 'Defend your ML systems from anomaly missiles. Keep the models healthy.',
        gameFile: 'games/model-monitoring.html',
        completed: false,
        score: 0
    }
];

// Team heroes configuration
const teamHeroes = [
    { name: 'Dave', sprite: 'dave_face' },
    { name: 'Nadya', sprite: 'nadya_face' }
];

// Initialize the hub
document.addEventListener('DOMContentLoaded', function() {
    renderWorkflowPipeline();
    renderHeroGallery();
    loadProgress();
    setupMessageListener();
});

function renderWorkflowPipeline() {
    const pipeline = document.getElementById('workflow-pipeline');
    pipeline.innerHTML = '';
    
    workflowPhases.forEach((phase, index) => {
        const phaseElement = document.createElement('div');
        phaseElement.className = `workflow-phase ${phase.completed ? 'completed' : ''}`;
        phaseElement.onclick = () => launchGame(phase.id);
        
        phaseElement.innerHTML = `
            <div class="phase-title">${phase.title}</div>
            <div class="phase-subtitle">${phase.subtitle}</div>
            <div class="phase-description">${phase.description}</div>
            ${phase.completed ? `<div class="phase-score">Best Score: ${MLOpsUtils.formatScore(phase.score)}</div>` : ''}
        `;
        
        pipeline.appendChild(phaseElement);
    });
}

function renderHeroGallery() {
    const gallery = document.getElementById('hero-gallery');
    gallery.innerHTML = '';
    
    teamHeroes.forEach(hero => {
        const heroElement = document.createElement('img');
        heroElement.className = 'hero-avatar';
        heroElement.src = MLOpsSprites.heroes[hero.sprite];
        heroElement.alt = hero.name;
        heroElement.title = hero.name;
        
        heroElement.onerror = function() {
            // Fallback to lambda man if hero image fails to load
            this.src = MLOpsSprites.heroes.lambda_man;
        };
        
        gallery.appendChild(heroElement);
    });
}

function launchGame(phaseId) {
    const phase = workflowPhases.find(p => p.id === phaseId);
    if (!phase) {
        console.error('Phase not found:', phaseId);
        return;
    }
    
    console.log(`Launching game: ${phase.title}`);
    
    // Show loading screen
    showLoadingScreen(`Loading ${phase.title}...`);
    
    // Load game in iframe
    const gameFrame = document.getElementById('game-frame');
    gameFrame.src = phase.gameFile;
    gameFrame.style.display = 'block';
    
    // Hide loading screen after a short delay
    setTimeout(() => {
        hideLoadingScreen();
    }, 1000);
}

function setupMessageListener() {
    window.addEventListener('message', function(event) {
        if (event.data.type === 'gameComplete') {
            handleGameCompletion(event.data);
        }
    });
}

function handleGameCompletion(gameData) {
    console.log('Game completed:', gameData);
    
    // Find and update the phase
    const phase = workflowPhases.find(p => p.id === gameData.game);
    if (phase) {
        phase.completed = true;
        if (gameData.score > phase.score) {
            phase.score = gameData.score;
        }
    }
    
    // Hide game iframe
    const gameFrame = document.getElementById('game-frame');
    gameFrame.style.display = 'none';
    gameFrame.src = '';
    
    // Save progress
    saveProgress();
    
    // Re-render pipeline to show completion
    renderWorkflowPipeline();
    
    // Show completion message
    showCompletionMessage(gameData);
    
    // Check if all phases are complete
    if (workflowPhases.every(p => p.completed)) {
        setTimeout(() => {
            showWorkflowComplete();
        }, 2000);
    }
}

function showCompletionMessage(gameData) {
    const phase = workflowPhases.find(p => p.id === gameData.game);
    const phaseName = phase ? phase.title : 'Game';
    
    MLOpsNavigation.showCompletionOverlay({
        message: `${phaseName} completed! Excellent work cleaning up the data chaos.`,
        score: gameData.score || 0,
        game: gameData.game
    });
}

function showWorkflowComplete() {
    const totalScore = workflowPhases.reduce((sum, phase) => sum + phase.score, 0);
    
    const overlay = document.createElement('div');
    overlay.className = 'game-complete-overlay';
    
    overlay.innerHTML = `
        <div class="game-complete-title">ML WORKFLOW COMPLETE!</div>
        <div class="game-complete-message">
            Congratulations! You've successfully navigated the entire ML Operations workflow.<br>
            From data cleaning to model monitoring, you've brought order to the chaos.
        </div>
        <div class="game-complete-score">TOTAL SCORE: ${MLOpsUtils.formatScore(totalScore)}</div>
        <button class="nav-button" onclick="resetWorkflow()">START NEW WORKFLOW</button>
    `;
    
    document.body.appendChild(overlay);
}

function resetWorkflow() {
    workflowPhases.forEach(phase => {
        phase.completed = false;
        phase.score = 0;
    });
    
    saveProgress();
    renderWorkflowPipeline();
    
    // Remove any overlays
    document.querySelectorAll('.game-complete-overlay').forEach(overlay => {
        overlay.remove();
    });
}

function showLoadingScreen(message) {
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading-screen';
    loadingScreen.id = 'loading-screen';
    
    loadingScreen.innerHTML = `
        <div class="loading-text">${message}</div>
    `;
    
    document.body.appendChild(loadingScreen);
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.remove();
    }
}

function saveProgress() {
    const progress = {
        phases: workflowPhases.map(p => ({
            id: p.id,
            completed: p.completed,
            score: p.score
        })),
        lastPlayed: Date.now()
    };
    
    localStorage.setItem('mlops-workflow-progress', JSON.stringify(progress));
}

function loadProgress() {
    const saved = localStorage.getItem('mlops-workflow-progress');
    if (saved) {
        try {
            const progress = JSON.parse(saved);
            progress.phases.forEach(savedPhase => {
                const phase = workflowPhases.find(p => p.id === savedPhase.id);
                if (phase) {
                    phase.completed = savedPhase.completed;
                    phase.score = savedPhase.score || 0;
                }
            });
            
            renderWorkflowPipeline();
        } catch (error) {
            console.error('Error loading progress:', error);
        }
    }
}
